import React from 'react';
import { konteksBatik } from '../data/soal';
import { logPenelitian } from '../data/logger';

export default function KonteksBatik({ onNext, siswa }) {
  const lanjut = () => {
    logPenelitian({ tipe: 'STUDENT_ACTIVITY', siswa, detail: 'Selesai membaca konteks budaya batik' });
    onNext();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-3xl shadow-[0_24px_60px_-30px_rgba(19,78,74,0.2)] p-8">
        <h2 className="text-2xl font-extrabold tracking-tight text-stone-900 mb-1">
          Matematika dalam budaya batik Pekalongan
        </h2>
        <p className="text-sm text-stone-500 mb-6">Pengenalan singkat sebelum masuk materi</p>

        <div className="space-y-3">
          {konteksBatik.map((k, i) => (
            <div key={i} className="flex gap-4 items-start bg-stone-50 rounded-2xl p-5">
              <span className="batik-stripe w-1 self-stretch rounded-full shrink-0"></span>
              <div>
                <h3 className="font-bold text-stone-800 text-sm mb-1">{k.judul}</h3>
                <p className="text-sm text-stone-600 leading-relaxed">{k.isi}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-sm text-stone-500 italic mt-5 leading-relaxed">
          "Di balik setiap helai kain batik, ada perhitungan yang cermat, dari banyak
          malam yang dipakai hingga harga jual di pasar."
        </p>

        <button onClick={lanjut}
          className="mt-6 w-full bg-teal-800 text-white py-3.5 rounded-xl font-bold hover:bg-teal-900 active:scale-[0.98] transition shadow-[0_8px_20px_-8px_rgba(15,118,110,0.5)]">
          Mulai Eksplorasi
        </button>
      </div>
    </div>
  );
}
