import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.json({ limit: '1mb' }));

// File log penelitian (JSON Lines) — mudah diekspor ke Excel/SPSS
const LOG_FILE = path.join(__dirname, 'penelitian_data.jsonl');

// ============ KONFIGURASI GURU & AI ============
const GURU = { username: 'wilda', password: '123' };
const GEMINI_MODEL = 'gemini-3.1-flash-lite';
const GEMINI_FALLBACK = 'gemini-flash-latest'; // dipakai otomatis jika model utama 503/overloaded
const GEMINI_URL = (m) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${process.env.GOOGLE_API_KEY}`;

async function panggilGemini(prompt) {
  const body = JSON.stringify({
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.7, maxOutputTokens: 300, thinkingConfig: { thinkingBudget: 0 } },
  });
  let lastErr = '';
  for (const model of [GEMINI_MODEL, GEMINI_FALLBACK]) {
    try {
      const r = await fetch(GEMINI_URL(model), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body });
      if (r.ok) {
        const data = await r.json();
        const text = data?.candidates?.[0]?.content?.parts?.find((p) => p.text)?.text || '';
        if (text) return { feedback: text.trim(), model };
        lastErr = 'respons kosong';
        continue;
      }
      lastErr = `${r.status}`;
      // 503/429/5xx -> coba model fallback; 4xx lain (mis. 400) tidak ada gunanya diulang
      if (r.status !== 503 && r.status !== 429 && r.status < 500) break;
    } catch (e) {
      lastErr = e.message;
    }
  }
  return { error: `AI sedang tidak tersedia (${lastErr}), coba lagi sebentar.` };
}

// ============ LOG PENELITIAN ============
app.post('/api/log', (req, res) => {
  const entry = { ...req.body, server_time: new Date().toISOString() };
  fs.appendFileSync(LOG_FILE, JSON.stringify(entry) + '\n');
  res.json({ ok: true });
});

app.get('/api/log', (req, res) => {
  if (!fs.existsSync(LOG_FILE)) return res.json({ data: [] });
  const lines = fs.readFileSync(LOG_FILE, 'utf8').trim().split('\n');
  res.json({ data: lines.map((l) => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean) });
});

// Download data penelitian (hanya guru)
app.get('/api/guru/download', (req, res) => {
  const u = req.query.u, p = req.query.p;
  if (u !== GURU.username || p !== GURU.password) return res.status(401).json({ error: 'Akses ditolak' });
  if (!fs.existsSync(LOG_FILE)) return res.setHeader('Content-Disposition', 'attachment; filename="penelitian_data.csv"').send('tipe,siswa,waktu,detail\n');
  const lines = fs.readFileSync(LOG_FILE, 'utf8').trim().split('\n');
  const rows = lines.map((l) => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);
  const fields = ['tipe', 'bagian', 'soal', 'jawaban', 'benar', 'level', 'respon', 'detail', 'nama', 'kelas', 'absen', 'waktu', 'server_time'];
  const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const csv = [fields.join(','), ...rows.map((r) => fields.map((f) => esc(r[f])).join(','))].join('\n');
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="penelitian_data.csv"');
  res.send(csv);
});

// ============ LOGIN GURU ============
app.post('/api/guru/login', (req, res) => {
  const { username, password } = req.body || {};
  if (username === GURU.username && password === GURU.password) {
    return res.json({ ok: true });
  }
  res.status(401).json({ ok: false, error: 'Username atau password salah' });
});

// Hasil evaluasi (hanya guru)
app.get('/api/guru/evaluasi', (req, res) => {
  const u = req.query.u, p = req.query.p;
  if (u !== GURU.username || p !== GURU.password) return res.status(401).json({ error: 'Akses ditolak' });
  if (!fs.existsSync(LOG_FILE)) return res.json({ data: [] });
  const lines = fs.readFileSync(LOG_FILE, 'utf8').trim().split('\n');
  const rows = lines.map((l) => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);
  res.json({ data: rows.filter((r) => r.tipe === 'EVALUATION_RESULT' || r.tipe === 'STUDENT_ANSWER') });
});

// Hapus data siswa yang tidak valid (hanya guru)
app.post('/api/guru/hapus-siswa', (req, res) => {
  const u = req.query.u, p = req.query.p;
  if (u !== GURU.username || p !== GURU.password) return res.status(401).json({ error: 'Akses ditolak' });
  const { nama, kelas, absen } = req.body || {};
  if (!nama) return res.status(400).json({ error: 'Nama siswa wajib diisi' });
  if (!fs.existsSync(LOG_FILE)) return res.json({ ok: true, deleted: 0 });
  const lines = fs.readFileSync(LOG_FILE, 'utf8').trim().split('\n');
  const rows = lines.map((l) => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);
  const sisa = rows.filter((r) => {
    const cocok = r.siswa && r.siswa.nama === nama &&
      (kelas === undefined || kelas === '' || r.siswa.kelas === kelas) &&
      (absen === undefined || absen === '' || r.siswa.absen === absen);
    return !cocok;
  });
  const deleted = rows.length - sisa.length;
  fs.writeFileSync(LOG_FILE, sisa.map((r) => JSON.stringify(r)).join('\n') + (sisa.length ? '\n' : ''));
  res.json({ ok: true, deleted });
});

// ============ AI REALTIME (Gemini) ============
// Feedback real-time: cek jawaban siswa, beri tahu mana yang salah, TIDAK memberi jawaban akhir
app.post('/api/ai/feedback', async (req, res) => {
  const { soal, jawabanSiswa, konteks, mode } = req.body || {};
  if (!jawabanSiswa) return res.status(400).json({ error: 'Jawaban kosong' });

  const systemRule = mode === 'bantuan'
    ? `Kamu adalah "Asisten Matematika" untuk siswa SMP Indonesia yang sedang belajar SPLDV dengan konteks batik Pekalongan.
ATURAN KERAS:
- JANGAN PERNAH memberikan jawaban akhir, angka jawaban, atau persamaan jadi.
- Pendekatan wajib: sebutkan STUDI KASUS SERUPA dari kehidupan nyata (boleh di luar batik: belanja, tarif parkir, bongkar-muat, karyawan & upah, dsb) yang STRUKTURnya mirip soal ini, TAPI dengan angka/konteks yang BERBEDA dari soal.
- Kemudian bimbing siswa menghubungkan studi kasus itu ke soal: "coba lihat polanya, bagian mana yang mirip?"
- Akhiri dengan 1 pertanyaan pengarah agar siswa sendiri yang menyimpulkan.
- Beri RUANG BERPIKIR: jangan menuntun sampai langkah terakhir, cukup 1 lompatan berpikir.
- Maksimal 5 kalimat, bahasa Indonesia ramah untuk siswa SMP.`
    : `Kamu adalah korektor jawaban untuk siswa SMP Indonesia pada materi SPLDV (konteks batik Pekalongan).
ATURAN KERAS:
- Periksa jawaban siswa. Tunjukkan BAGIAN MANA yang salah dan MENGAPA, tanpa memberikan jawaban benar lengkap.
- Jika benar, puji singkat dan arahkan ke langkah berikutnya.
- Jika jawaban siswa belum terisi/jawaban kosong, minta mereka mencoba dulu.
- Maksimal 4 kalimat, bahasa Indonesia ramah. Format: "Koreksi: ..." lalu penjelasan singkat.`;

  const prompt = `${systemRule}

SOAL:
${soal}

KONTEKS:
${konteks || '-'}

JAWABAN SISWA:
${jawabanSiswa}

Berikan feedback sekarang.`;

  try {
    const { feedback, model, error } = await panggilGemini(prompt);
    if (error) return res.status(502).json({ error });
    res.json({ feedback, model });
  } catch (e) {
    console.error('AI fetch error:', e.message);
    res.status(502).json({ error: 'AI sedang tidak tersedia, coba lagi nanti' });
  }
});

// ============ FRONTEND ============
const dist = path.join(__dirname, 'dist');
app.use(express.static(dist));
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(dist, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`LKPD Batik v3 berjalan di port ${PORT}`));
