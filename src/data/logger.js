// Log penelitian: setiap aktivitas siswa, jawaban, penggunaan AI, feedback AI, hasil evaluasi
// Dikirim ke backend /api/log dengan label tipe yang jelas agar mudah dianalisis peneliti.

export async function logPenelitian(payload) {
  const data = {
    ...payload,
    waktu: new Date().toISOString(),
  };
  try {
    await fetch('/api/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  } catch (e) {
    // Jangan ganggu pengerjaan siswa jika backend offline
    console.warn('Log gagal dikirim', e);
  }
  return data;
}

// Tipe log yang dibedakan untuk penelitian:
// STUDENT_ACTIVITY  : klik/halaman yang dikunjungi siswa
// STUDENT_ANSWER    : jawaban siswa per soal
// AI_REQUEST        : siswa meminta bantuan AI (level berapa)
// AI_FEEDBACK       : respons AI yang diberikan
// EVALUATION_RESULT : hasil evaluasi akhir
