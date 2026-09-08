import React from 'react';
import { logPenelitian } from '../data/logger';

export default function Hasil({ siswa, ringkasan, onUlang }) {
  const ulang = () => {
    logPenelitian({ tipe: 'STUDENT_ACTIVITY', siswa, detail: 'Siswa mengulang LKPD' });
    onUlang();
  };

  const stat = (v, label, cls) => (
    <div className="bg-stone-50 rounded-2xl p-5 text-center">
      <p className={`text-3xl font-extrabold tnum ${cls}`}>{v}</p>
      <p className="text-[11px] uppercase tracking-wider text-stone-400 mt-1">{label}</p>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-3xl shadow-[0_24px_60px_-30px_rgba(19,78,74,0.2)] overflow-hidden">
        <div className="batik-stripe h-2"></div>
        <div className="p-8">
          <h2 className="text-2xl font-extrabold tracking-tight text-stone-900 mb-1">Kerja bagus!</h2>
          <p className="text-sm text-stone-500 mb-6">
            {siswa.nama} · Kelas {siswa.kelas} · Absen {siswa.absen}
          </p>

          <div className="grid grid-cols-3 gap-3 mb-6">
            {stat(`${ringkasan.terjawab}/${ringkasan.total}`, 'Soal terjawab', 'text-teal-800')}
            {stat(`${ringkasan.aiCount}x`, 'Bantuan AI', 'text-stone-700')}
            {stat('A-F', 'Aktivitas', 'text-stone-700')}
          </div>

          <div className="bg-teal-50/60 border border-teal-700/15 rounded-2xl p-5 text-sm text-teal-950 leading-relaxed mb-6">
            Seluruh jawaban dan interaksi AI-mu terekam dalam sistem. Gunakan koreksi
            dari Asisten untuk memahami kesalahanmu, bukan sekadar melengkapi jawaban.
          </div>

          <button onClick={ulang}
            className="w-full bg-teal-800 text-white py-3.5 rounded-xl font-bold hover:bg-teal-900 active:scale-[0.98] transition shadow-[0_8px_20px_-8px_rgba(15,118,110,0.5)]">
            Ulangi LKPD
          </button>
        </div>
      </div>
    </div>
  );
}
