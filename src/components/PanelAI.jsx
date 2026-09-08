import React, { useState } from 'react';
import { feedbackAI } from '../data/ai';
import { logPenelitian } from '../data/logger';

// Panel AI realtime dengan batasan penelitian:
// - Petunjuk maksimal 2x per soal (studi kasus serupa + bimbingan menyesuaikan)
// - Periksa jawaban hanya 1x; setelah diperiksa jawaban TERKUNCI (tidak bisa diubah)
export default function PanelAI({ soal, konteks, jawaban, onLog, onLock, terkunci = false }) {
  const [hasil, setHasil] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState(null);
  const [petunjukCount, setPetunjukCount] = useState(0);
  const MAX_PETUNJUK = 2;

  const panggil = async (m) => {
    if (m === 'koreksi' && !(jawaban || '').trim()) return;
    if (m === 'bantuan' && petunjukCount >= MAX_PETUNJUK) return;
    setMode(m);
    setLoading(true);
    setHasil(null);
    onLog && onLog({ tipe: 'AI_REQUEST', mode: m, soal: soal.slice(0, 60), pemakaian_ke: m === 'bantuan' ? petunjukCount + 1 : undefined });
    const { feedback, error } = await feedbackAI({
      soal,
      jawabanSiswa: jawaban || '(siswa belum menulis jawaban, minta ia mencoba dulu)',
      konteks,
      mode: m,
    });
    setLoading(false);
    setHasil(feedback || error);
    if (m === 'bantuan') setPetunjukCount((c) => c + 1);
    if (m === 'koreksi' && feedback) {
      onLog && onLog({ tipe: 'AI_FEEDBACK', mode: m, respon: feedback.slice(0, 200) });
      onLock && onLock();
      onLog && onLog({ tipe: 'STUDENT_ACTIVITY', detail: 'Jawaban dikunci setelah diperiksa AI' });
    } else if (feedback) {
      onLog && onLog({ tipe: 'AI_FEEDBACK', mode: m, respon: feedback.slice(0, 200) });
    }
  };

  const sisaPetunjuk = MAX_PETUNJUK - petunjukCount;

  return (
    <div className="mt-3">
      {!terkunci && (
        <div className="flex flex-wrap gap-2 items-center">
          <button
            onClick={() => panggil('koreksi')}
            disabled={loading || !(jawaban || '').trim()}
            className="bg-teal-700 text-white text-xs font-semibold px-3 py-2 rounded-lg hover:bg-teal-800 active:scale-[0.98] transition disabled:bg-stone-300 disabled:text-stone-500"
          >
            Periksa dengan AI
          </button>
          <button
            onClick={() => panggil('bantuan')}
            disabled={loading || sisaPetunjuk <= 0}
            className="bg-stone-200 text-stone-700 text-xs font-semibold px-3 py-2 rounded-lg hover:bg-stone-300 active:scale-[0.98] transition disabled:bg-stone-100 disabled:text-stone-400"
          >
            Minta petunjuk {sisaPetunjuk > 0 && `(${sisaPetunjuk}x)`}
          </button>
          <span className="text-[10px] text-stone-400">Periksa hanya bisa 1x · jawaban terkunci setelahnya</span>
        </div>
      )}

      {terkunci && (
        <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-teal-800 bg-teal-50 border border-teal-700/20 px-2.5 py-1 rounded-full">
          <span>✓</span> Jawaban sudah diperiksa & dikunci
        </div>
      )}

      {loading && (
        <div className="mt-3 flex items-center gap-2 text-xs text-stone-500">
          <span className="inline-block w-3 h-3 border-2 border-teal-700 border-t-transparent rounded-full animate-spin"></span>
          Asisten sedang meninjau...
        </div>
      )}

      {hasil && !loading && (
        <div className="mt-3 bg-teal-50 border-l-4 border-teal-700 text-teal-950 p-3 rounded-r-lg text-sm leading-relaxed whitespace-pre-wrap">
          <p className="font-semibold text-teal-800 mb-1 text-xs uppercase tracking-wide">
            {mode === 'bantuan' ? 'Petunjuk Asisten' : 'Koreksi Real-time'}
          </p>
          {hasil}
        </div>
      )}
    </div>
  );
}
