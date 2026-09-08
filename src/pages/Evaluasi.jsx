import React, { useState } from 'react';
import { evaluasi } from '../data/soal';
import { logPenelitian } from '../data/logger';
import PanelAI from '../components/PanelAI';

// Evaluasi akhir dengan koreksi AI real-time per soal
export default function Evaluasi({ onNext, siswa }) {
  const [jawaban, setJawaban] = useState({});
  const [terkunci, setTerkunci] = useState({});
  const [aiCount, setAiCount] = useState(0);

  const onAILog = (payload) => {
    if (payload.tipe === 'AI_REQUEST') setAiCount((c) => c + 1);
    logPenelitian({ ...payload, siswa, bagian: 'Evaluasi' });
  };
  const kunci = (id) => setTerkunci((t) => ({ ...t, [id]: true }));

  const pilihOpsi = (p, o) => {
    setJawaban((j) => ({ ...j, [p.id]: o }));
    logPenelitian({
      tipe: 'STUDENT_ANSWER', siswa, bagian: 'Evaluasi',
      level: p.level, soal: p.id, jawaban: o, benar: o === p.kunci,
    });
  };

  const selesai = async () => {
    const total = evaluasi.length;
    const terjawab = evaluasi.filter((p) => (jawaban[p.id] || '').trim()).length;
    // Hitung penggunaan AI yang SEBENARNYA dari log penelitian (semua bagian:
    // Eksplorasi + Aktivitas + Evaluasi), bukan hanya klik di halaman ini.
    let aiTotal = aiCount;
    try {
      const r = await fetch('/api/log');
      const d = await r.json();
      aiTotal = (d.data || []).filter(
        (e) => e.tipe === 'AI_REQUEST' && e.siswa && siswa &&
          e.siswa.nama === siswa.nama &&
          e.siswa.kelas === siswa.kelas &&
          e.siswa.absen === siswa.absen
      ).length;
    } catch {
      // fallback: pakai hitungan lokal halaman evaluasi saja
    }
    logPenelitian({
      tipe: 'EVALUATION_RESULT', siswa, total_soal: total, terjawab,
      penggunaan_ai: aiTotal, detail: 'Evaluasi akhir diselesaikan',
    });
    onNext({ total, terjawab, aiCount: aiTotal });
  };

  const taCls =
    'w-full p-3 border border-stone-200 rounded-xl bg-white focus:ring-2 focus:ring-teal-700/40 focus:border-teal-700 outline-none text-sm transition placeholder:text-stone-400';

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-3xl shadow-[0_24px_60px_-30px_rgba(19,78,74,0.2)] p-8">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-teal-700">Evaluasi akhir</span>
        <h2 className="text-2xl font-extrabold tracking-tight text-stone-900 mt-1 mb-1">Uji kemampuanmu</h2>
        <p className="text-sm text-stone-500 mb-6">
          Pemahaman konteks, pemodelan, perhitungan, interpretasi, dan penalaran.
          Asisten AI akan memeriksa setiap jawabanmu secara langsung.
        </p>

        <div className="space-y-5">
          {evaluasi.map((p, i) => (
            <div key={p.id} className="border border-stone-100 rounded-2xl p-5 hover:border-stone-200 transition">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-stone-700 tnum">Soal {i + 1}</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">
                  {p.level}
                </span>
              </div>
              <p className="text-sm text-stone-700 leading-relaxed mb-3">{p.teks}</p>
              {p.tipe === 'pilihan' ? (
                <div className="grid sm:grid-cols-2 gap-2">
                  {p.opsi.map((o, j) => (
                    <button key={j} onClick={() => pilihOpsi(p, o)} disabled={terkunci[p.id]}
                      className={`text-left text-sm p-3 rounded-xl border transition active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed ${
                        jawaban[p.id] === o
                          ? 'border-teal-700 bg-teal-50 text-teal-900 font-semibold'
                          : 'border-stone-200 bg-white hover:border-stone-300 text-stone-700'
                      }`}>
                      {o}
                    </button>
                  ))}
                </div>
              ) : (
                <textarea
                  className={`${taCls} h-20`}
                  value={jawaban[p.id] || ''}
                  onChange={(e) => setJawaban({ ...jawaban, [p.id]: e.target.value })}
                  placeholder="Tulis jawaban dan alasanmu..."
                  disabled={terkunci[p.id]}
                />
              )}
              <PanelAI soal={p.teks} konteks="Evaluasi akhir LKPD SPLDV batik Pekalongan" jawaban={jawaban[p.id]} onLog={onAILog} onLock={() => kunci(p.id)} terkunci={terkunci[p.id]} />
            </div>
          ))}
        </div>

        <button onClick={selesai}
          className="mt-7 w-full bg-teal-800 text-white py-3.5 rounded-xl font-bold hover:bg-teal-900 active:scale-[0.98] transition shadow-[0_8px_20px_-8px_rgba(15,118,110,0.5)]">
          Selesai dan lihat hasil
        </button>
      </div>
    </div>
  );
}
