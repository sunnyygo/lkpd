import React, { useState } from 'react';
import { aktivitas } from '../data/soal';
import { logPenelitian } from '../data/logger';
import PanelAI from '../components/PanelAI';

// Aktivitas A-F dengan koreksi AI real-time
export default function DaftarAktivitas({ onNext, siswa }) {
  const [idx, setIdx] = useState(0);
  const [jawaban, setJawaban] = useState({});
  const [terkunci, setTerkunci] = useState({});
  const akt = aktivitas[idx];

  const onAILog = (payload) => logPenelitian({ ...payload, siswa, bagian: `Aktivitas-${akt.id}` });
  const kunci = (id) => setTerkunci((t) => ({ ...t, [id]: true }));

  const pilihOpsi = (p, o) => {
    setJawaban((j) => ({ ...j, [p.id]: o }));
    logPenelitian({
      tipe: 'STUDENT_ANSWER', siswa, bagian: `Aktivitas-${akt.id}`,
      tahap: akt.tahap, soal: p.id, jawaban: o, benar: o === p.kunci,
    });
  };

  const lanjutAktivitas = () => {
    logPenelitian({ tipe: 'STUDENT_ACTIVITY', siswa, detail: `Selesai ${akt.judul}` });
    if (idx < aktivitas.length - 1) { setIdx(idx + 1); setJawaban({}); } else { onNext(); }
  };

  const taCls =
    'w-full p-3 border border-stone-200 rounded-xl bg-white focus:ring-2 focus:ring-teal-700/40 focus:border-teal-700 outline-none text-sm transition placeholder:text-stone-400';

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-3xl shadow-[0_24px_60px_-30px_rgba(19,78,74,0.2)] p-8">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-teal-700">
            Aktivitas {akt.id}
          </span>
          <span className="text-xs text-stone-400 tnum">{idx + 1}/{aktivitas.length} · {akt.tahap}</span>
        </div>
        <h2 className="text-2xl font-extrabold tracking-tight text-stone-900 mb-5">{akt.judul.split('—')[1] || akt.judul}</h2>

        <div className="bg-stone-50 rounded-2xl p-5 mb-6 border-l-4 border-teal-700">
          <p className="text-stone-700 text-sm leading-relaxed">{akt.konteks}</p>
        </div>

        <div className="space-y-6">
          {akt.pertanyaan.map((p) => (
            <div key={p.id}>
              <label className="block font-semibold text-stone-800 mb-2 text-sm leading-relaxed">{p.teks}</label>
              {p.tipe === 'pilihan' ? (
                <div className="grid sm:grid-cols-2 gap-2">
                  {p.opsi.map((o, i) => (
                    <button key={i} onClick={() => pilihOpsi(p, o)} disabled={terkunci[p.id]}
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
                  placeholder="Tulis jawabanmu di sini..."
                  disabled={terkunci[p.id]}
                />
              )}
              <PanelAI soal={p.teks} konteks={akt.konteks} jawaban={jawaban[p.id]} onLog={onAILog} onLock={() => kunci(p.id)} terkunci={terkunci[p.id]} />
            </div>
          ))}
        </div>

        <button onClick={lanjutAktivitas}
          className="mt-7 w-full bg-teal-800 text-white py-3.5 rounded-xl font-bold hover:bg-teal-900 active:scale-[0.98] transition shadow-[0_8px_20px_-8px_rgba(15,118,110,0.5)]">
          {idx < aktivitas.length - 1 ? 'Lanjut ke Aktivitas Berikutnya' : 'Lanjut ke Evaluasi'}
        </button>
      </div>
    </div>
  );
}
