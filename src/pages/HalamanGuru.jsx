import React, { useState } from 'react';
import { logPenelitian } from '../data/logger';

// Halaman Guru: login wilda/123, lihat hasil evaluasi, download CSV
export default function HalamanGuru({ onBack }) {
  const [login, setLogin] = useState({ username: '', password: '' });
  const [cred, setCred] = useState({ username: '', password: '' });
  const [authed, setAuthed] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [konfirmasi, setKonfirmasi] = useState(null); // siswa yang menunggu konfirmasi hapus
  const [menghapus, setMenghapus] = useState(false);

  const masuk = async () => {
    setError('');
    try {
      const r = await fetch('/api/guru/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(login),
      });
      if (!r.ok) {
        setError('Username atau password salah');
        return;
      }
      setAuthed(true);
      setCred(login);
      muatData(login.username, login.password);
    } catch {
      setError('Gagal terhubung ke server');
    }
  };

  const muatData = async (u, p) => {
    try {
      const r = await fetch(`/api/guru/evaluasi?u=${encodeURIComponent(u)}&p=${encodeURIComponent(p)}`);
      const d = await r.json();
      setData(d.data || []);
    } catch {
      setError('Gagal memuat data');
    }
  };

  const hapusSiswa = async (s) => {
    setMenghapus(true);
    try {
      const q = `u=${encodeURIComponent(cred.username)}&p=${encodeURIComponent(cred.password)}`;
      const r = await fetch(`/api/guru/hapus-siswa?${q}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nama: s.nama, kelas: s.kelas, absen: s.absen }),
      });
      if (r.ok) muatData(cred.username, cred.password);
    } catch {
      setError('Gagal menghapus data');
    }
    setKonfirmasi(null);
    setMenghapus(false);
  };

  if (!authed) {
    return (
      <div className="max-w-sm mx-auto">
        <div className="bg-white p-8 rounded-2xl shadow-lg border-t-8 border-stone-800">
          <h1 className="text-xl font-bold text-stone-900 mb-1">Halaman Guru</h1>
          <p className="text-sm text-stone-500 mb-6">Masuk untuk melihat hasil evaluasi siswa</p>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Username"
              value={login.username}
              onChange={(e) => setLogin({ ...login, username: e.target.value })}
              className="w-full p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-800 outline-none text-sm"
            />
            <input
              type="password"
              placeholder="Password"
              value={login.password}
              onChange={(e) => setLogin({ ...login, password: e.target.value })}
              onKeyDown={(e) => e.key === 'Enter' && masuk()}
              className="w-full p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-800 outline-none text-sm"
            />
            {error && <p className="text-sm text-red-700 bg-red-50 p-2 rounded-lg">{error}</p>}
            <button
              onClick={masuk}
              className="w-full bg-stone-900 text-white p-3 rounded-lg font-bold hover:bg-stone-800 active:scale-[0.98] transition"
            >
              Masuk
            </button>
            <button onClick={onBack} className="w-full text-sm text-stone-500 hover:text-stone-800 py-1">
              Kembali ke LKPD
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Ringkasan per siswa
  const perSiswa = {};
  (data || []).forEach((d) => {
    const id = d.siswa ? `${d.siswa.nama}|${d.siswa.kelas}|${d.siswa.absen}` : 'Tanpa nama';
    if (!perSiswa[id]) perSiswa[id] = { nama: d.siswa?.nama || 'Tanpa nama', kelas: d.siswa?.kelas, absen: d.siswa?.absen, jawaban: 0, evaluasi: null, ai: 0 };
    if (d.tipe === 'STUDENT_ANSWER') perSiswa[id].jawaban++;
    if (d.tipe === 'EVALUATION_RESULT') perSiswa[id].evaluasi = d;
    if (d.tipe === 'AI_REQUEST') perSiswa[id].ai++;
    if (d.tipe === 'EVALUATION_RESULT' && d.penggunaan_ai != null) perSiswa[id].ai = d.penggunaan_ai;
  });
  const daftar = Object.values(perSiswa);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Hasil Siswa</h1>
          <p className="text-sm text-stone-500">{daftar.length} siswa tercatat</p>
        </div>
        <div className="flex gap-2">
          <a
            href={`/api/guru/download?u=${encodeURIComponent(cred.username)}&p=${encodeURIComponent(cred.password)}`}
            className="bg-teal-700 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-teal-800 active:scale-[0.98] transition"
          >
            Unduh CSV
          </a>
          <button onClick={onBack} className="bg-stone-200 text-stone-700 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-stone-300">
            Keluar
          </button>
        </div>
      </div>

      {!data && <p className="text-stone-500 text-sm">Memuat data...</p>}

      {data && daftar.length === 0 && (
        <div className="bg-white p-8 rounded-2xl text-center text-stone-500 text-sm">
          Belum ada siswa yang mengerjakan LKPD.
        </div>
      )}

      {data && daftar.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-stone-100 text-left text-xs uppercase tracking-wide text-stone-500">
                <th className="px-4 py-3">Nama</th>
                <th className="px-4 py-3">Kelas</th>
                <th className="px-4 py-3">Absen</th>
                <th className="px-4 py-3 text-center">Jawaban</th>
                <th className="px-4 py-3 text-center">Pakai AI</th>
                <th className="px-4 py-3 text-center">Evaluasi</th>
                <th className="px-4 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {daftar.map((s, i) => (
                <tr key={i} className="hover:bg-stone-50">
                  <td className="px-4 py-3 font-medium text-stone-800">{s.nama}</td>
                  <td className="px-4 py-3">{s.kelas}</td>
                  <td className="px-4 py-3">{s.absen}</td>
                  <td className="px-4 py-3 text-center">{s.jawaban}</td>
                  <td className="px-4 py-3 text-center">{s.ai}x</td>
                  <td className="px-4 py-3 text-center">
                    {s.evaluasi ? `${s.evaluasi.terjawab}/${s.evaluasi.total_soal}` : 'belum'}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => setKonfirmasi(s)}
                      className="text-xs text-red-600 hover:text-red-800 font-semibold px-2 py-1 rounded hover:bg-red-50 transition"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal konfirmasi hapus — putih solid, di tengah layar */}
      {konfirmasi && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 p-4"
          onClick={() => !menghapus && setKonfirmasi(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-11 h-11 mx-auto mb-3 rounded-full bg-red-50 flex items-center justify-center text-red-600 text-xl">
              !
            </div>
            <h3 className="font-bold text-stone-900 mb-1">Hapus data siswa?</h3>
            <p className="text-sm text-stone-500 leading-relaxed mb-5">
              Semua data <b className="text-stone-700">{konfirmasi.nama}</b> (Kelas {konfirmasi.kelas}, Absen {konfirmasi.absen}) akan dihapus permanen dan tidak bisa dibatalkan.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setKonfirmasi(null)}
                disabled={menghapus}
                className="flex-1 bg-stone-100 text-stone-700 text-sm font-semibold py-2.5 rounded-xl hover:bg-stone-200 active:scale-[0.98] transition disabled:opacity-50"
              >
                Batal
              </button>
              <button
                onClick={() => hapusSiswa(konfirmasi)}
                disabled={menghapus}
                className="flex-1 bg-red-600 text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-red-700 active:scale-[0.98] transition disabled:opacity-50"
              >
                {menghapus ? 'Menghapus...' : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
