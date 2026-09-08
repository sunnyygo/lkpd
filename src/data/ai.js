// Layanan AI: feedback realtime via backend (Gemini 3.1 Flash Lite)
// Backend memakai GOOGLE_API_KEY, jadi key tidak pernah tampil di browser siswa.

export async function feedbackAI({ soal, jawabanSiswa, konteks, mode = 'koreksi' }) {
  try {
    const r = await fetch('/api/ai/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ soal, jawabanSiswa, konteks, mode }),
    });
    if (!r.ok) return { feedback: null, error: 'AI sedang tidak tersedia, coba lagi sebentar.' };
    const data = await r.json();
    return { feedback: data.feedback, error: null };
  } catch {
    return { feedback: null, error: 'Koneksi ke AI gagal. Periksa jaringan.' };
  }
}
