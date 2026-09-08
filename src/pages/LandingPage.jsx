import React, { useState } from 'react';
import { logPenelitian } from '../data/logger';
import HalamanGuru from './HalamanGuru';

// Beranda: identitas siswa + pintu masuk halaman guru
export default function LandingPage({ onStart }) {
  const [data, setData] = useState({ nama: '', kelas: '', absen: '' });
  const [guruMode, setGuruMode] = useState(false);

  if (guruMode) return <HalamanGuru onBack={() => setGuruMode(false)} />;

  const mulai = () => {
    if (!data.nama || !data.kelas || !data.absen) return;
    logPenelitian({ tipe: 'STUDENT_ACTIVITY', siswa: data, detail: 'Klik Mulai Belajar' });
    onStart(data);
  };

  const inputCls =
    'w-full p-3 border border-stone-200 rounded-xl bg-white focus:ring-2 focus:ring-teal-700/40 focus:border-teal-700 outline-none text-sm transition placeholder:text-stone-400';

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-3xl shadow-[0_24px_60px_-24px_rgba(19,78,74,0.25)] overflow-hidden">
        <div className="batik-stripe h-2"></div>
        <div className="p-8 batik-dots">
          <h1 className="text-3xl font-extrabold tracking-tight text-stone-900 leading-tight">
            LKPD <span className="italic font-semibold text-teal-800">SPLDV</span>
          </h1>
          <p className="text-stone-500 text-sm mt-1 mb-5 leading-relaxed">
            Etnomatematika Batik Pekalongan. Pelajari sistem persamaan linear dua
            variabel lewat permasalahan nyata pengrajin batik.
          </p>

          <div className="space-y-3">
            <input type="text" placeholder="Nama lengkap" value={data.nama}
              onChange={(e) => setData({ ...data, nama: e.target.value })} className={inputCls} />
            <input type="text" placeholder="Kelas" value={data.kelas}
              onChange={(e) => setData({ ...data, kelas: e.target.value })} className={inputCls} />
            <input type="text" placeholder="Nomor absen" value={data.absen}
              onChange={(e) => setData({ ...data, absen: e.target.value })} className={inputCls} />
            <button onClick={mulai}
              className="w-full bg-teal-800 text-white p-3.5 rounded-xl font-bold hover:bg-teal-900 active:scale-[0.98] transition shadow-[0_8px_20px_-8px_rgba(15,118,110,0.5)]">
              Mulai Belajar
            </button>
          </div>
        </div>
      </div>

      <div className="text-center mt-6">
        <button
          onClick={() => setGuruMode(true)}
          className="text-xs text-stone-400 hover:text-stone-700 underline underline-offset-4 transition"
        >
          Halaman Guru
        </button>
      </div>
    </div>
  );
}
