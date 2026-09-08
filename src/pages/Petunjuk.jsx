import React from 'react';
import { petunjuk } from '../data/soal';
import { logPenelitian } from '../data/logger';

export default function Petunjuk({ onNext, siswa }) {
  const lanjut = () => {
    logPenelitian({ tipe: 'STUDENT_ACTIVITY', siswa, detail: 'Selesai membaca petunjuk' });
    onNext();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-3xl shadow-[0_24px_60px_-30px_rgba(19,78,74,0.2)] p-8">
        <h2 className="text-2xl font-extrabold tracking-tight text-stone-900 mb-1">Sebelum mulai</h2>
        <p className="text-sm text-stone-500 mb-6">Baca dulu aturan mainnya ya</p>

        <div className="grid md:grid-cols-2 gap-4 mb-5">
          <div className="bg-stone-50 rounded-2xl p-5">
            <h3 className="font-bold text-teal-900 text-sm mb-2">Tujuan pembelajaran</h3>
            <ul className="space-y-1.5 text-sm text-stone-600 leading-relaxed">
              {petunjuk.tujuan.map((t, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-teal-700 mt-0.5">·</span>{t}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-stone-50 rounded-2xl p-5">
            <h3 className="font-bold text-teal-900 text-sm mb-2">Aturan pengerjaan</h3>
            <ol className="space-y-1.5 text-sm text-stone-600 leading-relaxed list-decimal list-inside">
              {petunjuk.aturan.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ol>
          </div>
        </div>

        <div className="border border-teal-700/20 bg-teal-50/60 rounded-2xl p-5 text-sm text-teal-950 leading-relaxed">
          <p className="font-bold text-teal-800 mb-1">Tentang Asisten AI</p>
          Asisten akan <b>memeriksa jawabanmu secara real-time</b> dan menunjukkan bagian
          mana yang salah. Ia tidak pernah memberi jawaban akhir. Gunakan untuk belajar,
          bukan untuk menyalin.
        </div>

        <button onClick={lanjut}
          className="mt-6 w-full bg-teal-800 text-white py-3.5 rounded-xl font-bold hover:bg-teal-900 active:scale-[0.98] transition shadow-[0_8px_20px_-8px_rgba(15,118,110,0.5)]">
          Lanjut ke Konteks Batik
        </button>
      </div>
    </div>
  );
}
