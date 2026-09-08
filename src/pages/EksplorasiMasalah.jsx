import React, { useState } from 'react';
import { eksplorasi } from '../data/soal';
import { logPenelitian } from '../data/logger';
import PanelAI from '../components/PanelAI';

// Eksplorasi: koreksi AI real-time menunjukkan bagian yang salah
export default function EksplorasiMasalah({ onNext, siswa }) {
  const [jawaban, setJawaban] = useState({});
  const [terkunci, setTerkunci] = useState({});

  const onAILog = (payload) => logPenelitian({ ...payload, siswa, bagian: 'Eksplorasi' });
  const kunci = (id) => setTerkunci((t) => ({ ...t, [id]: true }));

  const lanjut = () => {
    logPenelitian({ tipe: 'STUDENT_ACTIVITY', siswa, detail: 'Selesai eksplorasi' });
    onNext();
  };

  const taCls =
    'w-full p-3 border border-stone-200 rounded-xl bg-white focus:ring-2 focus:ring-teal-700/40 focus:border-teal-700 outline-none text-sm transition placeholder:text-stone-400';

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-3xl shadow-[0_24px_60px_-30px_rgba(19,78,74,0.2)] p-8">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-teal-700">
          Eksplorasi
        </span>
        <h2 className="text-2xl font-extrabold tracking-tight text-stone-900 mt-1 mb-5">
          {eksplorasi.judul}
        </h2>

        <div className="bg-stone-50 rounded-2xl p-5 mb-6 border-l-4 border-teal-700">
          <p className="text-stone-700 text-sm leading-relaxed italic">{eksplorasi.soal}</p>
        </div>

        <div className="space-y-6">
          {eksplorasi.pertanyaan.map((p, i) => (
            <div key={p.id}>
              <label className="block font-semibold text-stone-800 mb-2 text-sm leading-relaxed">
                <span className="tnum text-teal-700 mr-1.5">{i + 1}.</span>{p.teks}
              </label>
              <textarea
                className={`${taCls} h-20`}
                value={jawaban[p.id] || ''}
                onChange={(e) => setJawaban({ ...jawaban, [p.id]: e.target.value })}
                placeholder="Tulis jawabanmu di sini..."
                disabled={terkunci[p.id]}
              />
              <PanelAI soal={p.teks} konteks={eksplorasi.soal} jawaban={jawaban[p.id]} onLog={onAILog} onLock={() => kunci(p.id)} terkunci={terkunci[p.id]} />
            </div>
          ))}
        </div>

        <button onClick={lanjut}
          className="mt-7 w-full bg-teal-800 text-white py-3.5 rounded-xl font-bold hover:bg-teal-900 active:scale-[0.98] transition shadow-[0_8px_20px_-8px_rgba(15,118,110,0.5)]">
          Lanjut ke Aktivitas
        </button>
      </div>
    </div>
  );
}
