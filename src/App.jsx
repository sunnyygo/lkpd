import React, { useState } from 'react';
import LandingPage from './pages/LandingPage';
import Petunjuk from './pages/Petunjuk';
import KonteksBatik from './pages/KonteksBatik';
import EksplorasiMasalah from './pages/EksplorasiMasalah';
import DaftarAktivitas from './pages/DaftarAktivitas';
import Evaluasi from './pages/Evaluasi';
import Hasil from './pages/Hasil';
import ProgressBar from './components/ProgressBar';

const LANGKAH = ['Beranda', 'Petunjuk', 'Konteks', 'Eksplorasi', 'Aktivitas', 'Evaluasi', 'Hasil'];

export default function App() {
  const [step, setStep] = useState(0);
  const [siswa, setSiswa] = useState(null);
  const [ringkasan, setRingkasan] = useState({});

  return (
    <div className="min-h-screen py-10 px-4">
      <header className="max-w-2xl mx-auto mb-8 text-center">
        <div className="batik-stripe h-1.5 rounded-full mx-auto max-w-[120px] mb-4"></div>
        <p className="text-[11px] uppercase tracking-[0.18em] text-stone-400">
          LKPD Digital · SPLDV · Etnomatematika Batik Pekalongan
        </p>
      </header>

      {siswa && step > 0 && <ProgressBar langkah={step + 1} total={LANGKAH.length} />}

      {step === 0 && (
        <LandingPage onStart={(d) => { setSiswa(d); setStep(1); }} />
      )}
      {step === 1 && <Petunjuk siswa={siswa} onNext={() => setStep(2)} />}
      {step === 2 && <KonteksBatik siswa={siswa} onNext={() => setStep(3)} />}
      {step === 3 && <EksplorasiMasalah siswa={siswa} onNext={() => setStep(4)} />}
      {step === 4 && <DaftarAktivitas siswa={siswa} onNext={() => setStep(5)} />}
      {step === 5 && (
        <Evaluasi siswa={siswa} onNext={(r) => { setRingkasan(r); setStep(6); }} />
      )}
      {step === 6 && <Hasil siswa={siswa} ringkasan={ringkasan} onUlang={() => setStep(0)} />}

      <footer className="max-w-2xl mx-auto mt-10 text-center text-[11px] text-stone-400">
        Media pembelajaran penelitian skripsi · AI pendukung, bukan sumber utama
      </footer>
    </div>
  );
}
