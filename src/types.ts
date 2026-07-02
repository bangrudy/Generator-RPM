export interface RpmInput {
  namaSatuanPendidikan: string;
  namaGuru: string;
  nipGuru: string;
  namaKepalaSekolah: string;
  nipKepalaSekolah: string;
  tahunPelajaran: string;
  tempatTanggalPengesahan: string;
  jenjangPendidikan: 'SD' | 'SMP' | 'SMA';
  kelas: string;
  mataPelajaran: string;
  capaianPembelajaran?: string; // Optional since it's generated server-side now
  tujuanPembelajaran: string;
  materiPelajaran: string;
  jumlahPertemuan: number;
  durasiPertemuan: string;
  kemitraanPembelajaran: string;
  lingkunganPembelajaran: string;
  pemanfaatanDigital: string[];
  praktikPedagogis: string[]; // Pedagogis per pertemuan
  dimensiLulusan: string[];
}

export interface IdentitasOutput {
  namaSatuanPendidikan: string;
  mataPelajaran: string;
  kelasSemester: string;
  durasiPertemuan: string;
}

export interface IdentifikasiOutput {
  siswa: string;
  materiPelajaran: string;
  capaianDimensiLulusan: string[];
}

export interface DesainPembelajaranOutput {
  capaianPembelajaran: string;
  lintasDisiplinIlmu: string;
  tujuanPembelajaran: string;
  topikPembelajaran: string;
  praktikPedagogisPerPertemuan: string[];
  kemitraanPembelajaran: string;
  lingkunganPembelajaran: string;
  pemanfaatanDigital: string;
}

export interface LangkahDetail {
  tipe: 'Berkesadaran' | 'Bermakna' | 'Menggembirakan';
  subLabel?: string; // e.g. "Ice Breaking", "Apersepsi", "Motivasi", "Fase 1: Orientasi...", "Refleksi"
  poinKegiatan: string[];
}

export interface PertemuanBelajar {
  noPertemuan: number;
  alokasiWaktu: string;
  materiPertemuan: string;
  modelPembelajaran: string;
  memahami: LangkahDetail[];
  mengaplikasi: LangkahDetail[];
  refleksi: LangkahDetail[];
}

export interface SiswaObservasi {
  nama: string;
  indikatorScores: string[]; // e.g., ["✓", "△", "✓", "–"]
  catatan: string;
}

export interface AsesmenProsesOutput {
  mataPelajaran: string;
  materiPelajaran: string;
  kelas: string;
  guru: string;
  indikator: string[]; // exactly 4 indicators
  siswaObservasi: SiswaObservasi[];
}

export interface SoalPilihanGanda {
  no: number;
  pertanyaan: string;
  opsi: string[]; // exactly 5 options: A, B, C, D, E
  jawabanBenar: string;
}

export interface AsesmenAkhirOutput {
  mataPelajaran: string;
  materiPelajaran: string;
  kelas: string;
  soalPilihanGanda: SoalPilihanGanda[];
}

export interface AsesmenPembelajaranOutput {
  asesmenAwal: string;
  asesmenProses: AsesmenProsesOutput;
  asesmenAkhir: AsesmenAkhirOutput;
}

export interface LkpdSoal {
  no: number;
  pertanyaan: string;
  tingkatKesulitan: string;
  langkahPengerjaan: string[];
}

export interface LkpdOutput {
  identitas: {
    nama: string;
    kelas: string;
    tujuanPembelajaran: string;
  };
  soal: LkpdSoal[];
}

export interface RpmOutput {
  identitas: IdentitasOutput;
  identifikasi: IdentifikasiOutput;
  desainPembelajaran: DesainPembelajaranOutput;
  pengalamanBelajar: PertemuanBelajar[];
  asesmenPembelajaran: AsesmenPembelajaranOutput;
  lkpd: LkpdOutput;
}
