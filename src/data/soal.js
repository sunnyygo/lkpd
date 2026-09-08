// Data LKPD: Petunjuk, Konteks Budaya, Aktivitas A-F, Evaluasi
// Semua konteks soal realistis dengan aktivitas batik Pekalongan.

export const petunjuk = {
  tujuan: [
    "Memahami permasalahan kontekstual terkait batik Pekalongan.",
    "Mengidentifikasi informasi yang diketahui dan ditanyakan.",
    "Menentukan variabel dan membuat model matematika (SPLDV).",
    "Menyelesaikan SPLDV dan menafsirkan hasilnya dalam konteks masalah.",
    "Mengembangkan kemampuan literasi matematika.",
  ],
  aturan: [
    "Kerjakan secara berurutan: Petunjuk → Konteks Batik → Eksplorasi → Aktivitas → Evaluasi → Hasil.",
    "Coba kerjakan sendiri terlebih dahulu sebelum menggunakan Bantuan AI.",
    "Bantuan AI maksimal 3 kali per aktivitas dan hanya berupa petunjuk, bukan jawaban akhir.",
    "Jawaban disimpan otomatis untuk keperluan penelitian.",
  ],
};

export const konteksBatik = [
  {
    judul: "Batik Pekalongan",
    isi: "Pekalongan dikenal sebagai Kota Batik. Motif khasnya seperti jlamprang, buketan, dan encim berkembang dari perjumpaan budaya lokal dengan pedagang dari berbagai negara.",
  },
  {
    judul: "Aktivitas Pengrajin",
    isi: "Pengrajin batik menentukan jumlah kain yang dibatik, banyak malam (lilin) yang dipakai, lama pengerjaan, dan biaya produksi setiap hari.",
  },
  {
    judul: "Jual Beli Produk Batik",
    isi: "Di toko dan pasar batik, pembeli membeli kombinasi produk — misalnya kain tulis dan kain cap — dengan harga total tertentu. Dari sinilah muncul banyak masalah yang bisa dimodelkan dengan SPLDV.",
  },
];

// ============ EKSPLORASI (aktifitas pengantar) ============
export const eksplorasi = {
  judul: "Eksplorasi: Jual Beli Kain Batik",
  soal:
    "Di sebuah toko batik di Pekalongan, seorang pembeli membeli 2 kain batik tulis dan 3 kain batik cap seharga Rp1.200.000. Pada pembelian lain, 3 kain batik tulis dan 2 kain batik cap seharga Rp1.300.000.",
  pertanyaan: [
    {
      id: "e1",
      tipe: "uraian",
      teks: "Apa saja informasi yang diketahui dari permasalahan tersebut?",
      kunci: null,
    },
    {
      id: "e2",
      tipe: "uraian",
      teks: "Apa yang ditanyakan dari permasalahan tersebut?",
      kunci: null,
    },
    {
      id: "e3",
      tipe: "uraian",
      teks: "Misalkan harga kain batik tulis = x dan harga kain batik cap = y. Buatlah dua persamaan berdasarkan informasi tersebut!",
      kunci: ["2x+3y=1200000", "3x+2y=1300000"],
    },
  ],
};

// ============ AKTIVITAS A - F ============
// Setiap aktivitas: konteks realistis, tahapan literasi (memahami, merumuskan, menerapkan, menafsirkan)
export const aktivitas = [
  {
    id: "A",
    judul: "Aktivitas A — Mengidentifikasi Informasi",
    konteks:
      "Ibu Sari adalah perajin batik di Kampung Batik Pekalongan. Dalam sehari ia dapat menyelesaikan 4 kain batik cap dan 2 kain batik tulis. Total kain yang ia kerjakan dalam sehari adalah 6 kain.",
    tahap: "Memahami masalah",
    pertanyaan: [
      {
        id: "a1",
        tipe: "uraian",
        teks: "Tuliskan informasi yang diketahui dari cerita di atas!",
        kunci: null,
      },
      {
        id: "a2",
        tipe: "pilihan",
        teks: "Hubungan yang tepat antara banyak kain cap (c) dan kain tulis (t) yang dikerjakan Ibu Sari adalah...",
        opsi: ["c + t = 6", "c − t = 6", "c × t = 6", "c : t = 6"],
        kunci: "c + t = 6",
      },
    ],
  },
  {
    id: "B",
    judul: "Aktivitas B — Menentukan Variabel",
    konteks:
      "Pak Ahmad menjual produk batik di toko miliknya: sarung batik dan kain panjang. Suatu hari, hasil penjualan 3 sarung dan 2 kain panjang adalah Rp540.000.",
    tahap: "Merumuskan masalah",
    pertanyaan: [
      {
        id: "b1",
        tipe: "uraian",
        teks:
          "Jika x = harga sarung batik dan y = harga kain panjang, tuliskan kalimat matematika yang sesuai dengan cerita tersebut!",
        kunci: ["3x+2y=540000"],
      },
    ],
  },
  {
    id: "C",
    judul: "Aktivitas C — Membentuk Persamaan",
    konteks:
      "Sebuah rumah batik menerima pesanan. Produksi 5 helai kain motif jlamprang dan 4 helai kain motif buketan membutuhkan 23 jam kerja. Produksi 3 helai kain motif jlamprang dan 6 helai kain motif buketan membutuhkan 27 jam kerja.",
    tahap: "Merumuskan masalah",
    pertanyaan: [
      {
        id: "c1",
        tipe: "uraian",
        teks:
          "Misalkan j = lama pengerjaan kain jlamprang (jam/lembar) dan b = lama pengerjaan kain buketan (jam/lembar). Buatlah dua persamaan linear dari cerita tersebut!",
        kunci: ["5j+4b=23", "3j+6b=27"],
      },
    ],
  },
  {
    id: "D",
    judul: "Aktivitas D — Menyelesaikan SPLDV",
    konteks:
      "Di toko batik Pekalongan, 1 kain batik tulis dan 2 kain batik cap dijual seharga Rp220.000. Sementara 2 kain batik tulis dan 1 kain batik cap dijual seharga Rp290.000.",
    tahap: "Menerapkan konsep",
    pertanyaan: [
      {
        id: "d1",
        tipe: "uraian",
        teks:
          "Misalkan x = harga kain tulis dan y = harga kain cap. Tuliskan model matematisnya!",
        kunci: ["x+2y=220000", "2x+y=290000"],
      },
      {
        id: "d2",
        tipe: "uraian",
        teks:
          "Selesaikan SPLDV tersebut (boleh dengan metode substitusi/eliminasi/gabungan). Tuliskan nilai x dan y!",
        kunci: ["x=120000", "y=50000"],
      },
    ],
  },
  {
    id: "E",
    judul: "Aktivitas E — Menafsirkan Hasil",
    konteks:
      "Seorang pemilik rumah batik menghitung: hasil penjualan 2 selimut batik dan 3 kaos batik adalah Rp690.000. Hasil penjualan 1 selimut batik dan 2 kaos batik adalah Rp350.000. Perhitungan menghasilkan harga selimut batik Rp270.000 dan kaos batik Rp50.000.",
    tahap: "Menafsirkan",
    pertanyaan: [
      {
        id: "e1",
        tipe: "uraian",
        teks:
          "Periksa: apakah hasil perhitungan tersebut masuk akal? Jelaskan dengan menguji kembali ke kedua kondisi penjualan!",
        kunci: ["tidak masuk akal", "2(270000)+3(50000)=690000 salah"],
      },
    ],
  },
  {
    id: "F",
    judul: "Aktivitas F — Masalah Kompleks",
    konteks:
      "Sebuah kelompok pengrajin di Pekalongan membuat dua jenis paket produk batik untuk bazar. Paket Keringat berisi 3 handuk batik dan 2 tas batik, dijual Rp285.000. Paket Semangat berisi 1 handuk batik dan 4 tas batik, dijual Rp255.000. Panitia bazar memesan gabungan 4 handuk batik dan 3 tas batik untuk undian.",
    tahap: "Penalaran",
    pertanyaan: [
      {
        id: "f1",
        tipe: "uraian",
        teks:
          "Tentukan harga 1 handuk batik dan 1 tas batik dengan membuat model SPLDV dari kedua paket tersebut!",
        kunci: ["3h+2t=285000", "h+4t=255000", "h=65000", "t=45000"],
      },
      {
        id: "f2",
        tipe: "pilihan",
        teks: "Biaya pembelian gabungan (4 handuk batik dan 3 tas batik) untuk undian adalah...",
        opsi: ["Rp325.000", "Rp395.000", "Rp405.000", "Rp415.000"],
        kunci: "Rp395.000",
      },
    ],
  },
];

// ============ EVALUASI AKHIR (literasi matematis) ============
export const evaluasi = [
  {
    id: "ev1",
    tipe: "pilihan",
    level: "Pemahaman konteks",
    teks:
      "Sebuah pasar batik Pekalongan menjual 2 kain encim dan 1 kain jlamprang seharga Rp310.000. Kalimat matematika yang tepat jika kain encim = e dan kain jlamprang = j adalah...",
    opsi: ["2e + j = 310.000", "2e − j = 310.000", "e + 2j = 310.000", "2e × j = 310.000"],
    kunci: "2e + j = 310.000",
  },
  {
    id: "ev2",
    tipe: "pilihan",
    level: "Pemodelan",
    teks:
      "Perajin batik Pak Rudi menghabiskan 9 liter malam untuk 3 kain cap dan 6 kain tulis. Pemakaian malam dinyatakan sebagai...",
    opsi: ["3c + 6t = 9", "3c − 6t = 9", "3c + 6t = 9 liter", "c + t = 9"],
    kunci: "3c + 6t = 9",
  },
  {
    id: "ev3",
    tipe: "uraian",
    level: "Perhitungan",
    teks:
      "Toko batik menjual 1 kain tulis dan 1 kain cap seharga Rp180.000. 2 kain tulis dan 1 kain cap seharga Rp280.000. Tentukan harga 1 kain tulis dan 1 kain cap!",
    kunci: ["tulis=100000", "cap=80000", "x=100000", "y=80000"],
  },
  {
    id: "ev4",
    tipe: "uraian",
    level: "Interpretasi",
    teks:
      "Hasil perhitungan soal nomor 3 menghasilkan kain tulis Rp100.000 dan kain cap Rp80.000. Jelaskan arti kedua nilai tersebut dalam konteks penjualan toko batik!",
    kunci: null,
  },
  {
    id: "ev5",
    tipe: "uraian",
    level: "Penalaran",
    teks:
      "Ibu Lurah menjual 3 slop batik dan 2 daster batik seharga Rp225.000. Sedangkan 1 slop dan 2 daster seharga Rp115.000. Tanpa menghitung penuh, tebak kira-kira mana yang lebih mahal: slop atau daster? Jelaskan alasanmu!",
    kunci: null,
  },
];
