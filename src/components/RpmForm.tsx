import React, { useState, useEffect } from 'react';
import { RpmInput } from '../types';
import { Sparkles, GraduationCap, School, BookOpen, Clock, Calendar, CheckSquare, Layers } from 'lucide-react';

interface RpmFormProps {
  onSubmit: (data: RpmInput) => void;
  loading: boolean;
}

const DIGITAL_OPTIONS = [
  'Rumah Pendidikan',
  'LMS',
  'Canva AI',
  'Youtube',
  'PPT',
  'Wayground',
  'Mentimeter',
  'Geo Gebra',
  'Gemini AI'
];

const PEDAGOGIS_OPTIONS = [
  'Inkuiri-Discovery',
  'PjBL',
  'Problem Based Learning',
  'Game Based Learning',
  'Station Learning'
];

const DIMENSI_OPTIONS = [
  'Keimanan & Ketakwaan',
  'Kewargaan',
  'Penalaran Kritis',
  'Kreativitas',
  'Kolaborasi',
  'Kemandirian',
  'Kesehatan',
  'Komunikasi'
];

const EXAMPLES = {
  sd: {
    namaSatuanPendidikan: 'SD Negeri Nusantara 1',
    namaGuru: 'Siti Rahmawati, S.Pd.',
    nipGuru: '19881215 201504 2 003',
    namaKepalaSekolah: 'Drs. H. Ahmad Fauzi, M.Pd.',
    nipKepalaSekolah: '19750510 199903 1 002',
    tahunPelajaran: '2026/2027',
    tempatTanggalPengesahan: 'Jakarta, 15 Juli 2026',
    jenjangPendidikan: 'SD' as const,
    kelas: 'Kelas IV (Empat) / Ganjil',
    mataPelajaran: 'Matematika',
    capaianPembelajaran: 'Peserta didik dapat mengidentifikasi pecahan senilai menggunakan gambar dan benda konkret serta membandingkan dan mengurutkan pecahan.',
    tujuanPembelajaran: 'Siswa dapat menentukan dan membuktikan pecahan senilai menggunakan kertas lipat atau gambar konkret secara mandiri dan kritis.',
    materiPelajaran: 'Pecahan Senilai',
    jumlahPertemuan: 2,
    durasiPertemuan: '2 × 35 menit',
    kemitraanPembelajaran: 'Orang tua membantu menyiapkan potongan kertas berwarna di rumah untuk media belajar.',
    lingkunganPembelajaran: 'Ruang kelas yang ditata melingkar dengan meja berkelompok (4-5 siswa).',
    pemanfaatanDigital: ['Canva AI', 'Youtube', 'PPT'],
    praktikPedagogis: ['Inkuiri-Discovery', 'Game Based Learning'],
    dimensiLulusan: ['Penalaran Kritis', 'Kolaborasi', 'Kemandirian']
  },
  smp: {
    namaSatuanPendidikan: 'SMP Negeri Merdeka Jaya',
    namaGuru: 'Budi Santoso, S.Si.',
    nipGuru: '19920310 201908 1 004',
    namaKepalaSekolah: 'Ir. Endang Lestari, M.Si.',
    nipKepalaSekolah: '19711123 199603 2 001',
    tahunPelajaran: '2026/2027',
    tempatTanggalPengesahan: 'Bandung, 18 Juli 2026',
    jenjangPendidikan: 'SMP' as const,
    kelas: 'Kelas VIII (Delapan) / Genap',
    mataPelajaran: 'Ilmu Pengetahuan Alam (IPA)',
    capaianPembelajaran: 'Peserta didik mampu mendeskripsikan struktur dan fungsi sistem organ tubuh manusia (sistem pencernaan, pernapasan, dan peredaran darah) serta hubungannya dengan kesehatan.',
    tujuanPembelajaran: 'Siswa dapat menganalisis fungsi organ pencernaan manusia dan mensimulasikan proses pencernaan mekanik serta kimiawi dengan tepat.',
    materiPelajaran: 'Sistem Pencernaan Manusia',
    jumlahPertemuan: 3,
    durasiPertemuan: '2 × 40 menit',
    kemitraanPembelajaran: 'Puskesmas setempat menyediakan brosur gizi seimbang dan narasumber ahli gizi.',
    lingkunganPembelajaran: 'Laboratorium IPA sekolah yang bersih dengan alat peraga torso tubuh manusia.',
    pemanfaatanDigital: ['Gemini AI', 'Mentimeter', 'Youtube'],
    praktikPedagogis: ['Problem Based Learning', 'Station Learning', 'Inkuiri-Discovery'],
    dimensiLulusan: ['Penalaran Kritis', 'Kreativitas', 'Komunikasi']
  },
  sma: {
    namaSatuanPendidikan: 'SMA Unggul Pradita',
    namaGuru: 'Diana Putri, M.Pd.',
    nipGuru: '19850904 201012 2 001',
    namaKepalaSekolah: 'Prof. Dr. Herman Siregar',
    nipKepalaSekolah: '19680415 199303 1 005',
    tahunPelajaran: '2026/2027',
    tempatTanggalPengesahan: 'Medan, 22 Juli 2026',
    jenjangPendidikan: 'SMA' as const,
    kelas: 'Kelas XI (Sebelas) / Ganjil',
    mataPelajaran: 'Fisika',
    capaianPembelajaran: 'Peserta didik mampu menganalisis gejala gelombang, karakteristik gelombang mekanik, serta merancang pemanfaatan spektrum gelombang elektromagnetik dalam teknologi.',
    tujuanPembelajaran: 'Siswa dapat mengevaluasi spektrum gelombang elektromagnetik dan dampak radiasinya terhadap kesehatan tubuh manusia melalui analisis kritis data ilmiah.',
    materiPelajaran: 'Gelombang Elektromagnetik',
    jumlahPertemuan: 2,
    durasiPertemuan: '3 × 45 menit',
    kemitraanPembelajaran: 'Alumni yang bekerja di bidang radiologi medis diundang sebagai pembicara tamu via online.',
    lingkunganPembelajaran: 'Kelas kolaboratif dengan akses internet kecepatan tinggi dan LCD Proyektor.',
    pemanfaatanDigital: ['LMS', 'Wayground', 'Canva AI', 'Gemini AI'],
    praktikPedagogis: ['PjBL', 'Problem Based Learning'],
    dimensiLulusan: ['Penalaran Kritis', 'Kreativitas', 'Kolaborasi', 'Komunikasi']
  }
};

export default function RpmForm({ onSubmit, loading }: RpmFormProps) {
  const [formData, setFormData] = useState<RpmInput>({
    namaSatuanPendidikan: '',
    namaGuru: '',
    nipGuru: '',
    namaKepalaSekolah: '',
    nipKepalaSekolah: '',
    tahunPelajaran: '2026/2027',
    tempatTanggalPengesahan: '',
    jenjangPendidikan: 'SMP',
    kelas: '',
    mataPelajaran: '',
    capaianPembelajaran: '',
    tujuanPembelajaran: '',
    materiPelajaran: '',
    jumlahPertemuan: 2,
    durasiPertemuan: '2 × 40 menit',
    kemitraanPembelajaran: '',
    lingkunganPembelajaran: '',
    pemanfaatanDigital: [],
    praktikPedagogis: ['Inkuiri-Discovery', 'Problem Based Learning'],
    dimensiLulusan: ['Penalaran Kritis', 'Kreativitas']
  });

  const [validationError, setValidationError] = useState<string | null>(null);

  // Set default kelas list based on jenjang
  const getKelasList = () => {
    switch (formData.jenjangPendidikan) {
      case 'SD':
        return ['Kelas I (Satu)', 'Kelas II (Dua)', 'Kelas III (Tiga)', 'Kelas IV (Empat)', 'Kelas V (Lima)', 'Kelas VI (Enam)'];
      case 'SMP':
        return ['Kelas VII (Tujuh)', 'Kelas VIII (Delapan)', 'Kelas IX (Sembilan)'];
      case 'SMA':
        return ['Kelas X (Sepuluh)', 'Kelas XI (Sebelas)', 'Kelas XII (Duabelas)'];
    }
  };

  const handleApplyExample = (type: 'sd' | 'smp' | 'sma') => {
    setFormData(EXAMPLES[type]);
    setValidationError(null);
  };

  const handleFieldChange = (field: keyof RpmInput, value: any) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // If changing jenjang, reset class to match standard
      if (field === 'jenjangPendidikan') {
        const classes = updated.jenjangPendidikan === 'SD' 
          ? 'Kelas IV (Empat) / Ganjil' 
          : updated.jenjangPendidikan === 'SMP' 
          ? 'Kelas VIII (Delapan) / Ganjil' 
          : 'Kelas XI (Sebelas) / Ganjil';
        updated.kelas = classes;

        const durasi = updated.jenjangPendidikan === 'SD' 
          ? '2 × 35 menit' 
          : updated.jenjangPendidikan === 'SMP' 
          ? '2 × 40 menit' 
          : '3 × 45 menit';
        updated.durasiPertemuan = durasi;
      }
      return updated;
    });
  };

  const handleToggleDigital = (option: string) => {
    setFormData(prev => {
      const digital = [...prev.pemanfaatanDigital];
      const index = digital.indexOf(option);
      if (index === -1) {
        digital.push(option);
      } else {
        digital.splice(index, 1);
      }
      return { ...prev, pemanfaatanDigital: digital };
    });
  };

  const handleToggleDimensi = (option: string) => {
    setFormData(prev => {
      const dimensi = [...prev.dimensiLulusan];
      const index = dimensi.indexOf(option);
      if (index === -1) {
        dimensi.push(option);
      } else {
        dimensi.splice(index, 1);
      }
      return { ...prev, dimensiLulusan: dimensi };
    });
  };

  const handlePedagogisChange = (index: number, value: string) => {
    setFormData(prev => {
      const list = [...prev.praktikPedagogis];
      list[index] = value;
      return { ...prev, praktikPedagogis: list };
    });
  };

  // Keep praktikPedagogis size in sync with jumlahPertemuan
  useEffect(() => {
    setFormData(prev => {
      const list = [...prev.praktikPedagogis];
      if (list.length < prev.jumlahPertemuan) {
        while (list.length < prev.jumlahPertemuan) {
          list.push(PEDAGOGIS_OPTIONS[0]);
        }
      } else if (list.length > prev.jumlahPertemuan) {
        list.splice(prev.jumlahPertemuan);
      }
      return { ...prev, praktikPedagogis: list };
    });
  }, [formData.jumlahPertemuan]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic Validations
    if (!formData.namaSatuanPendidikan.trim()) return setValidationError('Nama Satuan Pendidikan wajib diisi');
    if (!formData.namaGuru.trim()) return setValidationError('Nama Guru wajib diisi');
    if (!formData.namaKepalaSekolah.trim()) return setValidationError('Nama Kepala Sekolah wajib diisi');
    if (!formData.tempatTanggalPengesahan.trim()) return setValidationError('Tempat & Tanggal Pengesahan wajib diisi');
    if (!formData.kelas.trim()) return setValidationError('Kelas wajib diisi');
    if (!formData.mataPelajaran.trim()) return setValidationError('Mata Pelajaran wajib diisi');
    if (!formData.tujuanPembelajaran.trim()) return setValidationError('Tujuan Pembelajaran (TP) wajib diisi');
    if (!formData.materiPelajaran.trim()) return setValidationError('Materi Pelajaran wajib diisi');
    if (!formData.durasiPertemuan.trim()) return setValidationError('Durasi Pertemuan wajib diisi (misal: 2 x 40 menit)');
    if (!formData.jumlahPertemuan || formData.jumlahPertemuan < 1) return setValidationError('Jumlah Pertemuan minimal 1');
    if (formData.pemanfaatanDigital.length === 0) return setValidationError('Pilih minimal 1 Pemanfaatan Digital');
    if (formData.dimensiLulusan.length === 0) return setValidationError('Pilih minimal 1 Dimensi Lulusan');

    setValidationError(null);
    onSubmit(formData);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden" id="rpm_form_container">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 px-6 py-8 text-white">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Sparkles className="h-6 w-6 animate-pulse text-yellow-300" />
          Konfigurasi Generator RPM
        </h2>
        <p className="text-sm text-emerald-50/90 mt-1">
          Isi formulir lengkap atau pilih template contoh untuk menghasilkan Perencanaan Pembelajaran Mendalam (RPM) profesional dengan AI.
        </p>

        {/* Example Quick Buttons */}
        <div className="mt-5 flex flex-wrap gap-2">
          <span className="text-xs font-medium text-emerald-100 flex items-center mr-1">Gunakan Contoh:</span>
          <button
            type="button"
            onClick={() => handleApplyExample('sd')}
            className="px-3 py-1.5 bg-white/20 hover:bg-white/35 active:bg-white/45 transition rounded-lg text-xs font-medium flex items-center gap-1 border border-white/20 cursor-pointer"
          >
            🏫 SD - Pecahan
          </button>
          <button
            type="button"
            onClick={() => handleApplyExample('smp')}
            className="px-3 py-1.5 bg-white/20 hover:bg-white/35 active:bg-white/45 transition rounded-lg text-xs font-medium flex items-center gap-1 border border-white/20 cursor-pointer"
          >
            🔬 SMP - IPA Pencernaan
          </button>
          <button
            type="button"
            onClick={() => handleApplyExample('sma')}
            className="px-3 py-1.5 bg-white/20 hover:bg-white/35 active:bg-white/45 transition rounded-lg text-xs font-medium flex items-center gap-1 border border-white/20 cursor-pointer"
          >
            ⚛️ SMA - Fisika Radiasi
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-8">
        {validationError && (
          <div className="bg-rose-50 border-l-4 border-rose-500 p-4 rounded-r-lg text-rose-800 text-sm font-medium">
            ⚠️ {validationError}
          </div>
        )}

        {/* Section 1: Identitas Sekolah & Guru */}
        <div className="space-y-4">
          <h3 className="text-md font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
            <School className="h-5 w-5 text-emerald-600" />
            1. Identitas Satuan Pendidikan & Guru
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Satuan Pendidikan <span className="text-rose-500">*</span></label>
              <input
                type="text"
                value={formData.namaSatuanPendidikan}
                onChange={e => handleFieldChange('namaSatuanPendidikan', e.target.value)}
                placeholder="cth: SMAS Cendana"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tahun Pelajaran <span className="text-rose-500">*</span></label>
              <input
                type="text"
                value={formData.tahunPelajaran}
                onChange={e => handleFieldChange('tahunPelajaran', e.target.value)}
                placeholder="cth: 2026/2027"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Guru Pengampu <span className="text-rose-500">*</span></label>
              <input
                type="text"
                value={formData.namaGuru}
                onChange={e => handleFieldChange('namaGuru', e.target.value)}
                placeholder=""
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">NIP Guru <span className="text-slate-400">(Opsional)</span></label>
              <input
                type="text"
                value={formData.nipGuru}
                onChange={e => handleFieldChange('nipGuru', e.target.value)}
                placeholder=""
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Kepala Sekolah <span className="text-rose-500">*</span></label>
              <input
                type="text"
                value={formData.namaKepalaSekolah}
                onChange={e => handleFieldChange('namaKepalaSekolah', e.target.value)}
                placeholder=""
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">NIP Kepala Sekolah <span className="text-slate-400">(Opsional)</span></label>
              <input
                type="text"
                value={formData.nipKepalaSekolah}
                onChange={e => handleFieldChange('nipKepalaSekolah', e.target.value)}
                placeholder=""
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div className="md:col-span-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tempat, Tanggal Pengesahan <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  value={formData.tempatTanggalPengesahan}
                  onChange={e => handleFieldChange('tempatTanggalPengesahan', e.target.value)}
                  placeholder="cth: Pekanbaru, 1 Juli 2026"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Sasaran Kelas & Mata Pelajaran */}
        <div className="space-y-4">
          <h3 className="text-md font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-emerald-600" />
            2. Jenjang, Kelas & Kurikulum Mapel
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Jenjang Pendidikan <span className="text-rose-500">*</span></label>
              <div className="grid grid-cols-3 gap-2">
                {(['SD', 'SMP', 'SMA'] as const).map(jen => (
                  <button
                    key={jen}
                    type="button"
                    onClick={() => handleFieldChange('jenjangPendidikan', jen)}
                    className={`py-2 text-sm font-semibold rounded-lg border transition ${
                      formData.jenjangPendidikan === jen
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    {jen}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Kelas / Semester <span className="text-rose-500">*</span></label>
              <input
                type="text"
                value={formData.kelas}
                onChange={e => handleFieldChange('kelas', e.target.value)}
                placeholder="cth: Kelas VIII / Ganjil"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
              <span className="text-[10px] text-slate-400 block mt-1">Saran: {getKelasList().join(', ')}</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Mata Pelajaran <span className="text-rose-500">*</span></label>
              <input
                type="text"
                value={formData.mataPelajaran}
                onChange={e => handleFieldChange('mataPelajaran', e.target.value)}
                placeholder="cth: IPA / Matematika / Bahasa Indonesia"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Capaian & Tujuan Pembelajaran */}
        <div className="space-y-4">
          <h3 className="text-md font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-emerald-600" />
            3. Target Kompetensi & Materi
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Materi Pelajaran <span className="text-rose-500">*</span></label>
              <input
                type="text"
                value={formData.materiPelajaran}
                onChange={e => handleFieldChange('materiPelajaran', e.target.value)}
                placeholder="cth: Pecahan Senilai / Ekosistem / Struktur Sel"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tujuan Pembelajaran (TP) <span className="text-rose-500">*</span></label>
                <textarea
                  value={formData.tujuanPembelajaran}
                  onChange={e => handleFieldChange('tujuanPembelajaran', e.target.value)}
                  placeholder="Masukkan Tujuan Pembelajaran yang terukur..."
                  rows={4}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Desain Waktu & Pedagogi */}
        <div className="space-y-4">
          <h3 className="text-md font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
            <Clock className="h-5 w-5 text-emerald-600" />
            4. Desain Alokasi Waktu & Praktik Pedagogis
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Jumlah Pertemuan (Angka) <span className="text-rose-500">*</span></label>
              <input
                type="number"
                min="1"
                max="10"
                value={formData.jumlahPertemuan}
                onChange={e => handleFieldChange('jumlahPertemuan', parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Durasi per Pertemuan <span className="text-rose-500">*</span></label>
              <input
                type="text"
                value={formData.durasiPertemuan}
                onChange={e => handleFieldChange('durasiPertemuan', e.target.value)}
                placeholder="cth: 2 × 40 menit"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div className="md:col-span-1">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Kemitraan Pembelajaran</label>
              <input
                type="text"
                value={formData.kemitraanPembelajaran}
                onChange={e => handleFieldChange('kemitraanPembelajaran', e.target.value)}
                placeholder="cth: Kerja sama dengan orang tua / narasumber ahli"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Dynamic Pedagogis selection per Pertemuan */}
          <div className="bg-slate-50 p-4 rounded-xl space-y-3 border border-slate-100">
            <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1">
              <Layers className="h-4 w-4 text-emerald-600" />
              Praktik Pedagogis per Pertemuan (Bisa Berbeda Tiap Pertemuan):
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {Array.from({ length: formData.jumlahPertemuan }).map((_, i) => (
                <div key={i} className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-sm flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-slate-500">Pertemuan ke-{i + 1}</span>
                  <select
                    value={formData.praktikPedagogis[i] || 'Inkuiri-Discovery'}
                    onChange={e => handlePedagogisChange(i, e.target.value)}
                    className="w-full px-2 py-1 bg-transparent text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 border border-slate-200 rounded"
                  >
                    {PEDAGOGIS_OPTIONS.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 5: Lingkungan Belajar, Digital & Dimensi Lulusan */}
        <div className="space-y-4">
          <h3 className="text-md font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
            <CheckSquare className="h-5 w-5 text-emerald-600" />
            5. Lingkungan Pembelajaran, Digitalisasi & Profil Lulusan
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Lingkungan Pembelajaran</label>
              <input
                type="text"
                value={formData.lingkunganPembelajaran}
                onChange={e => handleFieldChange('lingkunganPembelajaran', e.target.value)}
                placeholder="cth: Laboratorium IPA sekolah, Ruang kelas dengan tata duduk berkelompok melingkar"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            {/* Pemanfaatan Digital Multi-checkboxes */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">Pemanfaatan Platform Digital <span className="text-rose-500">*</span> <span className="text-slate-400 font-normal">(pilih satu atau lebih)</span></label>
              <div className="flex flex-wrap gap-2">
                {DIGITAL_OPTIONS.map(opt => {
                  const selected = formData.pemanfaatanDigital.includes(opt);
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleToggleDigital(opt)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition cursor-pointer ${
                        selected
                          ? 'bg-teal-50 border-teal-500 text-teal-800 font-semibold shadow-sm'
                          : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      {selected && <span className="mr-1 text-teal-600">✓</span>}
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dimensi Lulusan Multi-checkboxes */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">Capaian Dimensi Lulusan <span className="text-rose-500">*</span> <span className="text-slate-400 font-normal">(pilih satu atau lebih)</span></label>
              <div className="flex flex-wrap gap-2">
                {DIMENSI_OPTIONS.map(opt => {
                  const selected = formData.dimensiLulusan.includes(opt);
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleToggleDimensi(opt)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition cursor-pointer ${
                        selected
                          ? 'bg-cyan-50 border-cyan-500 text-cyan-800 font-semibold shadow-sm'
                          : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      {selected && <span className="mr-1 text-cyan-600">✓</span>}
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Submit Action */}
        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold text-sm rounded-xl shadow-lg shadow-emerald-600/10 active:scale-[0.98] transition disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Menghubungi Asisten AI (Mohon tunggu)...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5 text-yellow-300" />
                Generate Rencana Pembelajaran (RPM)
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
