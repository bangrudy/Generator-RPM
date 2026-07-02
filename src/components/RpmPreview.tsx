import React, { useState, useRef } from 'react';
import { RpmOutput, RpmInput } from '../types';
import { Copy, Printer, FileDown, CheckCircle, Table, FileText, AlertCircle, HelpCircle } from 'lucide-react';

interface RpmPreviewProps {
  data: RpmOutput;
  input: RpmInput;
}

export default function RpmPreview({ data, input }: RpmPreviewProps) {
  const [activeView, setActiveView] = useState<'spreadsheet' | 'document'>('spreadsheet');
  const [copySuccess, setCopySuccess] = useState(false);
  const printAreaRef = useRef<HTMLDivElement>(null);

  // Generate the HTML for exporting/copying/downloading
  const getExportHtml = () => {
    const formattedDate = input.tempatTanggalPengesahan || 'Jakarta, 15 Juli 2026';
    const pedaText = data.desainPembelajaran.praktikPedagogisPerPertemuan.join(', ');
    const digitalText = input.pemanfaatanDigital.join(', ');
    const dimensiText = data.identifikasi.capaianDimensiLulusan.join(', ');

    return `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Generator RPM - ${data.identitas.mataPelajaran}</title>
<style>
  body {
    font-family: 'Arial', 'Helvetica', sans-serif;
    color: #1e293b;
    line-height: 1.45;
    padding: 30px;
    background-color: #ffffff;
    max-width: 800px;
    margin: 0 auto;
  }
  h1 {
    text-align: center;
    font-size: 18pt;
    font-weight: 800;
    text-transform: uppercase;
    margin: 0 0 5px 0;
    color: #0f172a;
    letter-spacing: -0.5px;
  }
  .subtitle {
    text-align: center;
    font-size: 10pt;
    font-weight: bold;
    margin-bottom: 30px;
    color: #475569;
    text-transform: uppercase;
  }
  .section-header {
    border-left: 4px solid #059669;
    padding-left: 10px;
    color: #065f46;
    font-size: 11pt;
    font-weight: bold;
    text-transform: uppercase;
    margin-top: 25px;
    margin-bottom: 12px;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 15px;
    font-size: 9.5pt;
  }
  th, td {
    border: 1px solid #cbd5e1;
    padding: 8px 12px;
    text-align: left;
    vertical-align: top;
  }
  th {
    background-color: #f1f5f9;
    font-weight: bold;
    color: #0f172a;
  }
  .table-spreadsheet {
    width: 100%;
    border: 1px solid #cbd5e1;
  }
  .table-spreadsheet td, .table-spreadsheet th {
    border: 1px solid #cbd5e1;
  }
  .header-cell {
    background-color: #f1f5f9;
    font-weight: bold;
    color: #0f172a;
    padding: 8px 12px;
  }
  .sub-header-cell {
    background-color: #f8fafc;
    font-weight: bold;
    color: #1e293b;
  }
  ul, ol {
    margin: 4px 0 4px 18px;
    padding: 0;
  }
  li {
    margin-bottom: 3px;
    line-height: 1.4;
    color: #334155;
  }
  /* LKPD Styling */
  .lkpd-container {
    border: 2px dashed #0d9488;
    padding: 24px;
    border-radius: 8px;
    background-color: #ffffff;
    margin-top: 40px;
    page-break-inside: auto;
  }
  .lkpd-title {
    text-align: center;
    font-size: 14pt;
    font-weight: 800;
    color: #115e59;
    margin-bottom: 5px;
    text-transform: uppercase;
  }
  .lkpd-subtitle {
    text-align: center;
    font-size: 9pt;
    color: #0d9488;
    margin-bottom: 24px;
    font-style: italic;
  }
  .lkpd-meta-table {
    background-color: #f0fdfa;
    margin-bottom: 20px;
    border: 1px solid #99f6e4;
  }
  .lkpd-meta-table td {
    padding: 10px 12px;
    border: 1px solid #99f6e4;
  }
  .lkpd-soal-card {
    background-color: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 16px;
    margin-bottom: 16px;
  }
  .lkpd-soal-header {
    font-weight: bold;
    color: #0f172a;
    border-bottom: 1px solid #e2e8f0;
    padding-bottom: 8px;
    margin-bottom: 12px;
    display: flex;
    justify-content: space-between;
  }
  .step-list {
    background-color: #f8fafc;
    padding: 10px 14px;
    border-left: 3px solid #0d9488;
    margin-top: 10px;
    font-size: 9.5pt;
    border-radius: 4px;
  }
  /* Signature layout */
  .signature-block {
    margin-top: 60px;
    width: 100%;
    page-break-inside: avoid;
  }
  .signature-table {
    width: 100%;
    border: none !important;
  }
  .signature-table td {
    border: none !important;
    width: 50%;
    padding: 10px !important;
  }
  .signature-space {
    height: 80px;
  }
  
  /* A4 Print and PDF Export optimizations */
  @media print {
    @page {
      size: A4;
      margin: 15mm 15mm 15mm 15mm;
    }
    body {
      padding: 0 !important;
      margin: 0 !important;
      width: 100% !important;
      max-width: none !important;
      font-size: 9.5pt !important;
    }
    .lkpd-container {
      margin-top: 25px !important;
      padding: 15px !important;
      border: 1.5px dashed #0d9488 !important;
      page-break-inside: auto !important;
    }
    .section-header {
      margin-top: 18px !important;
      margin-bottom: 8px !important;
    }
    table {
      margin-bottom: 10px !important;
    }
    h1 {
      font-size: 16pt !important;
    }
    .subtitle {
      margin-bottom: 15px !important;
    }
  }
</style>
</head>
<body>

  <div style="text-align: center; border-bottom: 3px solid #0f172a; padding-bottom: 12px; margin-bottom: 24px;">
    <h1>RENCANA PEMBELAJARAN MENDALAM (RPM)</h1>
    <div class="subtitle" style="margin: 4px 0 0 0;">KURIKULUM MERDEKA • JENJANG PENDIDIKAN ${input.jenjangPendidikan}</div>
  </div>

  <!-- I. IDENTITAS PEMBELAJARAN -->
  <div class="section-header">I. IDENTITAS PEMBELAJARAN</div>
  <table class="table-spreadsheet">
    <tr>
      <td style="width: 33%; background-color: #f8fafc; font-weight: bold; border: 1px solid #cbd5e1; padding: 10px;">Nama Satuan Pendidikan</td>
      <td style="width: 67%; border: 1px solid #cbd5e1; padding: 10px;">${data.identitas.namaSatuanPendidikan}</td>
    </tr>
    <tr>
      <td style="background-color: #f8fafc; font-weight: bold; border: 1px solid #cbd5e1; padding: 10px;">Mata Pelajaran</td>
      <td style="border: 1px solid #cbd5e1; padding: 10px;">${data.identitas.mataPelajaran}</td>
    </tr>
    <tr>
      <td style="background-color: #f8fafc; font-weight: bold; border: 1px solid #cbd5e1; padding: 10px;">Kelas / Semester</td>
      <td style="border: 1px solid #cbd5e1; padding: 10px;">${data.identitas.kelasSemester}</td>
    </tr>
    <tr>
      <td style="background-color: #f8fafc; font-weight: bold; border: 1px solid #cbd5e1; padding: 10px;">Durasi Pertemuan</td>
      <td style="border: 1px solid #cbd5e1; padding: 10px;">${data.identitas.durasiPertemuan} (${input.jumlahPertemuan} Pertemuan)</td>
    </tr>
  </table>

  <!-- II. IDENTIFIKASI KESIAPAN SISWA -->
  <div class="section-header">II. IDENTIFIKASI KESIAPAN SISWA</div>
  <table class="table-spreadsheet">
    <tr>
      <td style="width: 33%; background-color: #f8fafc; font-weight: bold; border: 1px solid #cbd5e1; padding: 12px; vertical-align: top;">Karakteristik & Profil Siswa fiktif</td>
      <td style="width: 67%; border: 1px solid #cbd5e1; padding: 12px; text-align: justify; line-height: 1.5;">${data.identifikasi.siswa}</td>
    </tr>
    <tr>
      <td style="background-color: #f8fafc; font-weight: bold; border: 1px solid #cbd5e1; padding: 10px;">Materi Pelajaran Pokok</td>
      <td style="border: 1px solid #cbd5e1; padding: 10px;">${data.identifikasi.materiPelajaran}</td>
    </tr>
    <tr>
      <td style="background-color: #f8fafc; font-weight: bold; border: 1px solid #cbd5e1; padding: 12px; vertical-align: top;">Capaian Dimensi Lulusan</td>
      <td style="border: 1px solid #cbd5e1; padding: 12px;">${dimensiText}</td>
    </tr>
  </table>

  <!-- III. DESAIN PEMBELAJARAN -->
  <div class="section-header">III. DESAIN PEMBELAJARAN</div>
  <table class="table-spreadsheet">
    <tr>
      <td style="width: 33%; background-color: #f8fafc; font-weight: bold; border: 1px solid #cbd5e1; padding: 12px; vertical-align: top;">Tujuan Pembelajaran (TP)</td>
      <td style="width: 67%; border: 1px solid #cbd5e1; padding: 12px; text-align: justify; font-weight: bold; color: #0f172a;">${data.desainPembelajaran.tujuanPembelajaran}</td>
    </tr>
    <tr>
      <td style="background-color: #f8fafc; font-weight: bold; border: 1px solid #cbd5e1; padding: 12px; vertical-align: top;">Topik Pembelajaran Kontekstual</td>
      <td style="border: 1px solid #cbd5e1; padding: 12px; font-weight: 500; color: #115e59; font-style: italic;">${data.desainPembelajaran.topikPembelajaran}</td>
    </tr>
    <tr>
      <td style="background-color: #f8fafc; font-weight: bold; border: 1px solid #cbd5e1; padding: 12px; vertical-align: top;">Lintas Disiplin Ilmu</td>
      <td style="border: 1px solid #cbd5e1; padding: 12px; text-align: justify; line-height: 1.5;">${data.desainPembelajaran.lintasDisiplinIlmu}</td>
    </tr>
    <tr>
      <td style="background-color: #f8fafc; font-weight: bold; border: 1px solid #cbd5e1; padding: 12px; vertical-align: top;">Praktik Pedagogis per Pertemuan</td>
      <td style="border: 1px solid #cbd5e1; padding: 12px; font-weight: bold;">${pedaText}</td>
    </tr>
    <tr>
      <td style="background-color: #f8fafc; font-weight: bold; border: 1px solid #cbd5e1; padding: 10px;">Kemitraan Pembelajaran</td>
      <td style="border: 1px solid #cbd5e1; padding: 10px;">${data.desainPembelajaran.kemitraanPembelajaran || '-'}</td>
    </tr>
    <tr>
      <td style="background-color: #f8fafc; font-weight: bold; border: 1px solid #cbd5e1; padding: 10px;">Lingkungan Pembelajaran</td>
      <td style="border: 1px solid #cbd5e1; padding: 10px;">${data.desainPembelajaran.lingkunganPembelajaran || '-'}</td>
    </tr>
    <tr>
      <td style="background-color: #f8fafc; font-weight: bold; border: 1px solid #cbd5e1; padding: 10px;">Pemanfaatan Platform Digital</td>
      <td style="border: 1px solid #cbd5e1; padding: 10px;">${digitalText}</td>
    </tr>
  </table>

  <!-- IV. SKENARIO PENGALAMAN BELAJAR -->
  <div class="section-header">IV. SKENARIO PENGALAMAN BELAJAR</div>
  ${data.pengalamanBelajar.map((pertemuan) => `
    <div style="margin-top: 15px; margin-bottom: 25px; padding: 15px; border: 1px solid #e2e8f0; background-color: #fafafa; border-radius: 6px;">
      <h4 style="color: #065f46; font-size: 11pt; font-weight: bold; margin: 0 0 4px 0;">Pertemuan ${pertemuan.noPertemuan} (${pertemuan.alokasiWaktu}) - ${pertemuan.materiPertemuan}</h4>
      <p style="font-size: 9pt; color: #64748b; font-weight: 500; margin: 0 0 12px 0;">Model Pembelajaran: ${pertemuan.modelPembelajaran}</p>
      
      <table class="table-spreadsheet" style="background-color: #ffffff; margin-bottom: 0;">
        <thead>
          <tr style="background-color: #f1f5f9; font-weight: bold;">
            <th style="width: 25%; padding: 8px; border: 1px solid #cbd5e1; color: #1e293b; font-size: 9.5pt;">Aspek Belajar</th>
            <th style="padding: 8px; border: 1px solid #cbd5e1; color: #1e293b; font-size: 9.5pt;">Skenario Kegiatan Pembelajaran</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding: 10px; border: 1px solid #cbd5e1; font-weight: bold; color: #1e293b; font-size: 9.5pt; vertical-align: top;">
              Memahami<br><span style="font-weight: normal; color: #64748b; font-size: 8pt; display: block; margin-top: 4px;">(Kegiatan Awal)</span>
            </td>
            <td style="padding: 10px; border: 1px solid #cbd5e1; text-align: justify; vertical-align: top; font-size: 9.5pt; line-height: 1.45;">
              ${pertemuan.memahami.filter(item => item.subLabel?.toLowerCase() !== 'bermakna').map(item => `
                <div style="margin-bottom: 8px;">
                  <span style="font-size: 8pt; font-weight: bold; background-color: #f1f5f9; color: #334155; padding: 2px 6px; border-radius: 4px; text-transform: uppercase; border: 1px solid #e2e8f0; display: inline-block; margin-bottom: 4px;">${item.tipe}</span>
                  ${item.subLabel ? `<span style="font-weight: bold; color: #0f172a; margin-left: 4px; font-size: 9.5pt;">${item.subLabel}:</span>` : ''}
                  <ul style="margin: 4px 0 4px 20px; padding: 0;">
                    ${item.poinKegiatan.map(p => `<li style="margin-bottom: 3px; line-height: 1.4; color: #334155;">${p}</li>`).join('')}
                  </ul>
                </div>
              `).join('')}
            </td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #cbd5e1; font-weight: bold; color: #1e293b; font-size: 9.5pt; vertical-align: top;">
              Mengaplikasi<br><span style="font-weight: normal; color: #64748b; font-size: 8pt; display: block; margin-top: 4px;">(Kegiatan Inti)</span>
            </td>
            <td style="padding: 10px; border: 1px solid #cbd5e1; text-align: justify; vertical-align: top; font-size: 9.5pt; line-height: 1.45;">
              ${pertemuan.mengaplikasi.map(item => `
                <div style="margin-bottom: 8px;">
                  <span style="font-size: 8pt; font-weight: bold; background-color: #e0e7ff; color: #4338ca; padding: 2px 6px; border-radius: 4px; text-transform: uppercase; border: 1px solid #c7d2fe; display: inline-block; margin-bottom: 4px;">${item.tipe}</span>
                  ${item.subLabel ? `<span style="font-weight: bold; color: #0f172a; margin-left: 4px; font-size: 9.5pt;">${item.subLabel}:</span>` : ''}
                  <ul style="margin: 4px 0 4px 20px; padding: 0;">
                    ${item.poinKegiatan.map(p => `<li style="margin-bottom: 3px; line-height: 1.4; color: #334155;">${p}</li>`).join('')}
                  </ul>
                </div>
              `).join('')}
            </td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #cbd5e1; font-weight: bold; color: #1e293b; font-size: 9.5pt; vertical-align: top;">
              Refleksi<br><span style="font-weight: normal; color: #64748b; font-size: 8pt; display: block; margin-top: 4px;">(Kegiatan Penutup)</span>
            </td>
            <td style="padding: 10px; border: 1px solid #cbd5e1; text-align: justify; vertical-align: top; font-size: 9.5pt; line-height: 1.45;">
              ${pertemuan.refleksi.map(item => `
                <div style="margin-bottom: 8px;">
                  <span style="font-size: 8pt; font-weight: bold; background-color: #f0fdf4; color: #15803d; padding: 2px 6px; border-radius: 4px; text-transform: uppercase; border: 1px solid #bbf7d0; display: inline-block; margin-bottom: 4px;">${item.tipe}</span>
                  ${item.subLabel ? `<span style="font-weight: bold; color: #0f172a; margin-left: 4px; font-size: 9.5pt;">${item.subLabel}:</span>` : ''}
                  <ul style="margin: 4px 0 4px 20px; padding: 0;">
                    ${item.poinKegiatan.map(p => `<li style="margin-bottom: 3px; line-height: 1.4; color: #334155;">${p}</li>`).join('')}
                  </ul>
                </div>
              `).join('')}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `).join('')}

  <!-- V. RENCANA ASESMEN PEMBELAJARAN -->
  <div class="section-header">V. RENCANA ASESMEN PEMBELAJARAN</div>
  
  <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; padding: 15px; margin-bottom: 20px; border-radius: 4px;">
    <h4 style="margin: 0 0 8px 0; color: #0f172a; font-size: 10pt; font-weight: bold;">A. Asesmen Awal (Diagnostik)</h4>
    <p style="margin: 0; color: #334155; font-size: 9.5pt; text-align: justify; white-space: pre-wrap; line-height: 1.5;">${data.asesmenPembelajaran.asesmenAwal}</p>
  </div>

  <div style="margin-bottom: 25px;">
    <h4 style="margin: 0 0 10px 0; color: #0f172a; font-size: 10pt; font-weight: bold;">B. Asesmen Proses (Formatif - Tanya jawab & Observasi Kelompok)</h4>
    
    <table style="width: 100%; border: none !important; margin-bottom: 12px; font-size: 9.5pt;">
      <tr>
        <td style="width: 25%; border: none !important; padding: 2px 0; vertical-align: top;"><b>Mata Pelajaran</b></td>
        <td style="width: 75%; border: none !important; padding: 2px 0; vertical-align: top;">: ${data.asesmenPembelajaran.asesmenProses.mataPelajaran || data.identitas.mataPelajaran}</td>
      </tr>
      <tr>
        <td style="border: none !important; padding: 2px 0; vertical-align: top;"><b>Materi Pelajaran</b></td>
        <td style="border: none !important; padding: 2px 0; vertical-align: top;">: ${data.asesmenPembelajaran.asesmenProses.materiPelajaran || data.identifikasi.materiPelajaran}</td>
      </tr>
      <tr>
        <td style="border: none !important; padding: 2px 0; vertical-align: top;"><b>Kelas / Semester</b></td>
        <td style="border: none !important; padding: 2px 0; vertical-align: top;">: ${data.asesmenPembelajaran.asesmenProses.kelas || data.identitas.kelasSemester}</td>
      </tr>
      <tr>
        <td style="border: none !important; padding: 2px 0; vertical-align: top;"><b>Guru Pengampu</b></td>
        <td style="border: none !important; padding: 2px 0; vertical-align: top;">: ${data.asesmenPembelajaran.asesmenProses.guru || input.namaGuru}</td>
      </tr>
    </table>

    <table class="table-spreadsheet" style="font-size: 9pt;">
      <thead>
        <tr style="background-color: #f1f5f9; font-weight: bold; color: #1e293b;">
          <th rowspan="2" style="width: 8%; text-align: center; vertical-align: middle; padding: 8px; border: 1px solid #cbd5e1;">NO</th>
          <th rowspan="2" style="width: 25%; vertical-align: middle; padding: 8px; border: 1px solid #cbd5e1;">Nama Siswa</th>
          <th colspan="4" style="text-align: center; padding: 6px; border: 1px solid #cbd5e1;">Indikator yang diamati</th>
          <th rowspan="2" style="width: 35%; vertical-align: middle; padding: 8px; border: 1px solid #cbd5e1;">Catatan Guru Pengamatan</th>
        </tr>
        <tr style="background-color: #f8fafc; font-weight: bold; color: #475569;">
          <th style="text-align: center; width: 8%; padding: 4px; border: 1px solid #cbd5e1;">1</th>
          <th style="text-align: center; width: 8%; padding: 4px; border: 1px solid #cbd5e1;">2</th>
          <th style="text-align: center; width: 8%; padding: 4px; border: 1px solid #cbd5e1;">3</th>
          <th style="text-align: center; width: 8%; padding: 4px; border: 1px solid #cbd5e1;">4</th>
        </tr>
      </thead>
      <tbody>
        ${data.asesmenPembelajaran.asesmenProses.siswaObservasi.map((siswa, i) => `
          <tr>
            <td style="text-align: center; padding: 8px; border: 1px solid #cbd5e1;">${i + 1}</td>
            <td style="padding: 8px; border: 1px solid #cbd5e1;"><b>${siswa.nama}</b></td>
            <td style="text-align: center; font-size: 10pt; padding: 8px; border: 1px solid #cbd5e1;">${siswa.indikatorScores[0] || '✓'}</td>
            <td style="text-align: center; font-size: 10pt; padding: 8px; border: 1px solid #cbd5e1;">${siswa.indikatorScores[1] || '✓'}</td>
            <td style="text-align: center; font-size: 10pt; padding: 8px; border: 1px solid #cbd5e1;">${siswa.indikatorScores[2] || '✓'}</td>
            <td style="text-align: center; font-size: 10pt; padding: 8px; border: 1px solid #cbd5e1;">${siswa.indikatorScores[3] || '✓'}</td>
            <td style="font-style: italic; text-align: justify; padding: 8px; border: 1px solid #cbd5e1; color: #334155;">${siswa.catatan}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; padding: 12px; border-radius: 4px; margin-top: 10px; font-size: 9pt; color: #1e293b; line-height: 1.5;">
      <b style="color: #0f172a; display: block; margin-bottom: 4px;">Indikator yang Diamati:</b>
      <ol style="margin: 0 0 8px 0; padding-left: 20px;">
        ${data.asesmenPembelajaran.asesmenProses.indikator.map((ind, idx) => `
          <li style="margin-bottom: 3px; color: #334155;"><b>Indikator ${idx + 1}:</b> ${ind}</li>
        `).join('')}
      </ol>
      <div style="border-top: 1px solid #cbd5e1; padding-top: 6px; margin-top: 6px; font-size: 8.5pt; color: #475569;">
        <b>Keterangan Penilaian:</b><br>
        ✓ : Sudah terlihat / tercapai &nbsp;&nbsp;|&nbsp;&nbsp; 
        △ : Mulai berkembang, masih memerlukan sedikit bimbingan &nbsp;&nbsp;|&nbsp;&nbsp; 
        – : Belum terlihat atau belum menunjukkan indikator
      </div>
    </div>
  </div>

  <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; padding: 15px; border-radius: 4px; margin-bottom: 25px;">
    <h4 style="margin: 0 0 10px 0; color: #0f172a; font-size: 10pt; font-weight: bold;">C. Asesmen Akhir (Sumatif Tertulis - Pilihan Ganda)</h4>
    
    <table style="width: 100%; border: none !important; margin-bottom: 15px;">
      <tr>
        <td style="width: 25%; border: none !important; padding: 2px 0;"><b>Mata Pelajaran</b></td>
        <td style="width: 75%; border: none !important; padding: 2px 0;">: ${data.asesmenPembelajaran.asesmenAkhir.mataPelajaran}</td>
      </tr>
      <tr>
        <td style="border: none !important; padding: 2px 0;"><b>Materi Pelajaran</b></td>
        <td style="border: none !important; padding: 2px 0;">: ${data.asesmenPembelajaran.asesmenAkhir.materiPelajaran}</td>
      </tr>
      <tr>
        <td style="border: none !important; padding: 2px 0;"><b>Kelas</b></td>
        <td style="border: none !important; padding: 2px 0;">: ${data.asesmenPembelajaran.asesmenAkhir.kelas}</td>
      </tr>
    </table>

    <p style="margin: 10px 0 5px 0; font-weight: bold; color: #0f172a;">Daftar Pertanyaan Pilihan Ganda:</p>
    ${data.asesmenPembelajaran.asesmenAkhir.soalPilihanGanda.map((soal) => `
      <div style="margin-bottom: 12px; padding-left: 5px;">
        <p style="margin: 0 0 4px 0; color: #0f172a;"><b>Soal No. ${soal.no}:</b> ${soal.pertanyaan}</p>
        <ul style="list-style-type: none; margin: 0; padding-left: 15px;">
          ${soal.opsi.map(op => `<li style="margin-bottom: 2px; color: #475569;">${op}</li>`).join('')}
        </ul>
      </div>
    `).join('')}

    <div style="border-top: 1px solid #cbd5e1; padding-top: 10px; margin-top: 15px; color: #065f46; font-weight: bold; font-size: 9.5pt;">
      Kunci Jawaban Sumatif:
      ${data.asesmenPembelajaran.asesmenAkhir.soalPilihanGanda.map((soal) => `
        <div style="padding-left: 15px; font-weight: normal; color: #334155; margin-top: 2px;">Soal No. ${soal.no} : <b>${soal.jawabanBenar}</b></div>
      `).join('')}
    </div>
  </div>


  <!-- 6. LEMBAR KERJA PESERTA DIDIK (LKPD) -->
  <div class="lkpd-container">
    <div style="text-align: center; margin-bottom: 20px;">
      <span style="background-color: #ccfbf1; color: #115e59; font-size: 8pt; font-weight: bold; padding: 4px 10px; border-radius: 9999px; text-transform: uppercase;">Aktivitas Mandiri</span>
      <div class="lkpd-title" style="margin-top: 8px;">LKPD (Lembar Kerja Peserta Didik)</div>
      <div class="lkpd-subtitle">Media Belajar Berpikir Kritis & Kontekstual Berorientasi Pemahaman Mendalam</div>
    </div>
    
    <div style="background-color: #f0fdfa; border: 1px solid #99f6e4; padding: 15px; border-radius: 6px; margin-bottom: 25px;">
      <table style="width: 100%; border: none !important; margin: 0;">
        <tr>
          <td style="width: 50%; border: none !important; padding: 4px 0; font-size: 9.5pt; color: #115e59;"><b>Nama Lengkap Siswa :</b> <span style="border-bottom: 1px dashed #0d9488; display: inline-block; width: 180px;">&nbsp;</span></td>
          <td style="width: 50%; border: none !important; padding: 4px 0; font-size: 9.5pt; color: #115e59; text-align: right;"><b>Kelas / Semester :</b> <span style="font-weight: bold; color: #0f172a;">${data.lkpd.identitas.kelas || input.kelas}</span></td>
        </tr>
      </table>
      <div style="margin-top: 10px; border-top: 1px solid #99f6e4; padding-top: 10px;">
        <span style="font-size: 9.5pt; font-weight: bold; color: #115e59; display: block; margin-bottom: 4px;">Tujuan Pembelajaran (TP) Terkait:</span>
        <p style="margin: 0; background-color: #ffffff; padding: 10px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 9.5pt; color: #1e293b; text-align: justify; line-height: 1.4;">
          ${data.lkpd.identitas.tujuanPembelajaran}
        </p>
      </div>
    </div>

    <h4 style="color: #115e59; border-bottom: 2px solid #0d9488; padding-bottom: 4px; margin-top: 20px; margin-bottom: 15px; font-size: 11pt; font-weight: bold;">Lembar Aktivitas Soal Bergradasi (Mudah - Sedang - Sulit - Kontekstual)</h4>
    
    ${data.lkpd.soal.map((soal) => `
      <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px; padding: 15px; margin-bottom: 15px; page-break-inside: avoid;">
        <table style="width: 100%; border: none !important; margin-bottom: 8px;">
          <tr>
            <td style="border: none !important; padding: 0; font-weight: bold; color: #115e59; font-size: 10pt;">Soal No. ${soal.no}</td>
            <td style="border: none !important; padding: 0; text-align: right;">
              <span style="font-size: 8pt; font-weight: bold; padding: 2px 8px; border-radius: 9999px; ${
                soal.tingkatKesulitan === 'Mudah'
                  ? 'background-color: #d1fae5; color: #065f46;'
                  : soal.tingkatKesulitan === 'Sedang'
                  ? 'background-color: #fef3c7; color: #92400e;'
                  : 'background-color: #fee2e2; color: #991b1b;'
              }">Tingkat Kesulitan: ${soal.tingkatKesulitan}</span>
            </td>
          </tr>
        </table>
        <p style="margin: 5px 0 12px 0; font-weight: bold; font-size: 10.5pt; color: #0f172a; text-align: justify; line-height: 1.4;">${soal.pertanyaan}</p>
        <div style="background-color: #f8fafc; border-left: 3px solid #0d9488; padding: 10px 14px; font-size: 9.5pt; border-radius: 4px;">
          <b style="color: #475569; display: block; margin-bottom: 6px;">💡 Panduan Langkah & Proses Berpikir:</b>
          <ol style="margin: 0; padding-left: 18px;">
            ${soal.langkahPengerjaan.map(step => `<li style="margin-bottom: 4px; color: #334155; line-height: 1.4;">${step}</li>`).join('')}
          </ol>
        </div>
      </div>
    `).join('')}
  </div>

  <!-- SIGNATURE BLOCK -->
  <div class="signature-block" style="margin-top: 50px; font-size: 9.5pt;">
    <table style="width: 100%; border: none !important;">
      <tr>
        <td style="width: 50%; border: none !important; padding: 0; line-height: 1.5; vertical-align: top;">
          <div style="color: #ffffff; font-size: 1px; line-height: 1;">&nbsp;</div>
          Mengetahui,<br>
          <span style="font-weight: bold; color: #0f172a;">Kepala Satuan Pendidikan</span>
          <div style="height: 70px;"></div>
          <span style="font-weight: bold; color: #0f172a; border-bottom: 1.5px solid #000000; padding-bottom: 2px; display: inline-block; min-width: 180px;">${input.namaKepalaSekolah}</span><br>
          NIP. ${input.nipKepalaSekolah || '-'}
        </td>
        <td style="width: 50%; border: none !important; padding: 0; line-height: 1.5; text-align: right; vertical-align: top;">
          <span>${formattedDate}</span><br>
          Guru Pengampu,<br>
          <span style="font-weight: bold; color: #0f172a;">Guru Mata Pelajaran</span>
          <div style="height: 70px;"></div>
          <span style="font-weight: bold; color: #0f172a; border-bottom: 1.5px solid #000000; padding-bottom: 2px; display: inline-block; text-align: right; min-width: 180px;">${input.namaGuru}</span><br>
          NIP. ${input.nipGuru || '-'}
        </td>
      </tr>
    </table>
  </div>

</body>
</html>
    `;
  };

  const handleCopyAndOpenGoogleDoc = async () => {
    try {
      const html = getExportHtml();
      const plainText = `RENCANA PEMBELAJARAN MENDALAM (RPM)\n\nIDENTITAS\nSekolah: ${data.identitas.namaSatuanPendidikan}\nMapel: ${data.identitas.mataPelajaran}\n\nSilakan paste dokumen lengkap Anda di Google Docs!`;
      
      const blobHtml = new Blob([html], { type: 'text/html' });
      const blobText = new Blob([plainText], { type: 'text/plain' });

      const item = new ClipboardItem({
        'text/html': blobHtml,
        'text/plain': blobText
      });

      await navigator.clipboard.write([item]);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 3000);

      // Open Google Doc create new template in a new window/tab
      window.open('https://docs.google.com/document/u/0/create', '_blank');
    } catch (err) {
      console.error("Gagal menyalin ke clipboard:", err);
      alert("Browser Anda memblokir salin clipboard otomatis, atau memerlukan izin. Silakan cetak atau unduh dokumen langsung.");
    }
  };

  const handleDownloadWord = () => {
    const htmlContent = getExportHtml();
    
    // Create Blob formatted as MS-Word HTML string
    // This allows MS Word to open the HTML string preserving tables, colors, borders and page layout
    const blob = new Blob(['\ufeff' + htmlContent], {
      type: 'application/msword'
    });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    const sanitizedMapel = data.identitas.mataPelajaran.replace(/[^a-zA-Z0-0]/g, '_');
    link.download = `RPM_${sanitizedMapel}_${data.identitas.kelasSemester.split('/')[0].trim().replace(/\s+/g, '')}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    // Elegant way to print only the document is using a temporary printable window
    // This prevents printing sidebars, headers, tabs, etc.
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(getExportHtml());
      printWindow.document.close();
      printWindow.focus();
      // Delay printing slightly to ensure all styles load
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    } else {
      alert("Pop-up diblokir oleh browser. Silakan aktifkan izin pop-up untuk mencetak dokumen.");
    }
  };

  return (
    <div className="space-y-6" id="rpm_preview_root">
      {/* Action Toolbar */}
      <div className="bg-white p-4 rounded-2xl shadow-md border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
          <button
            onClick={() => setActiveView('spreadsheet')}
            className={`flex-1 sm:flex-none px-4 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer ${
              activeView === 'spreadsheet'
                ? 'bg-white text-slate-800 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Table className="h-4 w-4 text-emerald-600" />
            Tampilan Spreadsheet
          </button>
          <button
            onClick={() => setActiveView('document')}
            className={`flex-1 sm:flex-none px-4 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer ${
              activeView === 'document'
                ? 'bg-white text-slate-800 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="h-4 w-4 text-teal-600" />
            Tampilan Dokumen Cetak
          </button>
        </div>

        <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={handleCopyAndOpenGoogleDoc}
            className="flex-1 sm:flex-none px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-sm hover:shadow active:scale-[0.98] transition cursor-pointer"
            title="Salin semua tabel dan buka tab Google Docs baru untuk langsung di-paste"
          >
            {copySuccess ? (
              <>
                <CheckCircle className="h-4 w-4 text-emerald-400" />
                Tersalin! Membuka Docs...
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Salin & Buka di Google Doc
              </>
            )}
          </button>

          <button
            onClick={handleDownloadWord}
            className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 border border-emerald-200 active:scale-[0.98] transition cursor-pointer"
          >
            <FileDown className="h-4 w-4" />
            Download File Word (.doc)
          </button>

          <button
            onClick={handlePrint}
            className="px-3 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98] transition cursor-pointer"
            title="Cetak langsung atau simpan sebagai PDF berkualitas tinggi dengan format kertas A4"
          >
            <Printer className="h-4 w-4" />
            Ekspor PDF / Cetak (A4)
          </button>
        </div>
      </div>

      <div className="bg-amber-50 border-l-4 border-amber-400 p-3 rounded-r-lg flex flex-col gap-2 text-amber-900 text-xs font-medium">
        <div className="flex items-start gap-2.5">
          <AlertCircle className="h-4.5 w-4.5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Tips Ekspor PDF (A4):</span> Saat dialog cetak browser terbuka, pastikan memilih opsi tujuan/printer <b>“Simpan sebagai PDF” (Save as PDF)</b>, atur ukuran kertas ke <b>A4</b>, dan centang opsi <b>“Grafik Latar Belakang” (Background Graphics)</b> agar seluruh warna, tabel, dan border tercetak utuh dan elegan!
          </div>
        </div>
        <div className="flex items-start gap-2.5 border-t border-amber-200/50 pt-2">
          <AlertCircle className="h-4.5 w-4.5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Tips Paste di Google Docs / Word:</span> Setelah menekan tombol <b>“Salin & Buka di Google Doc”</b>, klik lembar kosong di tab Google Doc yang baru dibuka, lalu tekan tombol keyboard <b>Ctrl + V (atau Cmd + V)</b>. Seluruh tabel spreadsheet akan ter-paste dengan rapi dan presisi beserta LKPD & Tanda Tangan!
          </div>
        </div>
      </div>

      {/* Rpm Render Area */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-150 overflow-hidden" ref={printAreaRef}>
        {activeView === 'spreadsheet' ? (
          // Spreadsheet style rendering
          <div className="p-1 sm:p-4 overflow-x-auto">
            <div className="min-w-[800px] border border-slate-200 rounded-xl overflow-hidden bg-slate-50 font-sans text-sm">
              {/* Spreadsheet Grid Header */}
              <div className="bg-slate-200 px-4 py-2 border-b border-slate-300 flex items-center justify-between text-xs font-bold text-slate-500">
                <span className="font-mono">Spreadsheet: RPM_${data.identitas.mataPelajaran.replace(/\s+/g, '')}.xlsx</span>
                <span>Tampilan Sel Rata Kanan-Kiri Teratur</span>
              </div>

              {/* 1. IDENTITAS SHEET SECTION */}
              <div className="bg-emerald-800 text-white px-4 py-2 font-bold text-xs tracking-wider flex items-center gap-2">
                <span className="font-mono bg-emerald-900 px-1.5 py-0.5 rounded text-[10px]">TAB 1</span>
                <span>BAGIAN I: IDENTITAS PEMBELAJARAN</span>
              </div>
              <table className="w-full bg-white border-collapse text-left">
                <tbody>
                  <tr className="border-b border-slate-150">
                    <td className="w-1/3 bg-slate-50/80 px-4 py-3 font-semibold text-slate-600 border-r border-slate-150">Nama Satuan Pendidikan</td>
                    <td className="px-4 py-3 text-slate-800 font-medium">{data.identitas.namaSatuanPendidikan}</td>
                  </tr>
                  <tr className="border-b border-slate-150">
                    <td className="bg-slate-50/80 px-4 py-3 font-semibold text-slate-600 border-r border-slate-150">Mata Pelajaran (Mapel)</td>
                    <td className="px-4 py-3 text-slate-800 font-medium">{data.identitas.mataPelajaran}</td>
                  </tr>
                  <tr className="border-b border-slate-150">
                    <td className="bg-slate-50/80 px-4 py-3 font-semibold text-slate-600 border-r border-slate-150">Kelas / Semester</td>
                    <td className="px-4 py-3 text-slate-800 font-medium">{data.identitas.kelasSemester}</td>
                  </tr>
                  <tr className="border-b border-slate-150">
                    <td className="bg-slate-50/80 px-4 py-3 font-semibold text-slate-600 border-r border-slate-150">Durasi Pertemuan</td>
                    <td className="px-4 py-3 text-slate-800 font-medium">{data.identitas.durasiPertemuan} ({input.jumlahPertemuan} Pertemuan)</td>
                  </tr>
                </tbody>
              </table>

              {/* 2. IDENTIFIKASI SHEET SECTION */}
              <div className="bg-teal-800 text-white px-4 py-2 font-bold text-xs tracking-wider flex items-center gap-2 border-t border-slate-200">
                <span className="font-mono bg-teal-900 px-1.5 py-0.5 rounded text-[10px]">TAB 2</span>
                <span>BAGIAN II: IDENTIFIKASI SISWA & DIMENSI LULUSAN</span>
              </div>
              <table className="w-full bg-white border-collapse text-left">
                <tbody>
                  <tr className="border-b border-slate-150">
                    <td className="w-1/3 bg-slate-50/80 px-4 py-4 font-semibold text-slate-600 border-r border-slate-150 align-top">
                      Karakteristik & Profil Siswa<br />
                      <small className="text-slate-400 font-normal italic block mt-1">(Generated Otomatis)</small>
                    </td>
                    <td className="px-4 py-4 text-slate-700 text-justify leading-relaxed">{data.identifikasi.siswa}</td>
                  </tr>
                  <tr className="border-b border-slate-150">
                    <td className="bg-slate-50/80 px-4 py-3 font-semibold text-slate-600 border-r border-slate-150">Materi Pelajaran</td>
                    <td className="px-4 py-3 text-slate-800 font-semibold">{data.identifikasi.materiPelajaran}</td>
                  </tr>
                  <tr className="border-b border-slate-150">
                    <td className="bg-slate-50/80 px-4 py-3 font-semibold text-slate-600 border-r border-slate-150 align-top">Capaian Dimensi Lulusan</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1.5">
                        {data.identifikasi.capaianDimensiLulusan.map((dim, i) => (
                          <span key={i} className="px-2.5 py-1 bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold rounded-full">
                            {dim}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* 3. DESAIN PEMBELAJARAN SHEET SECTION */}
              <div className="bg-cyan-800 text-white px-4 py-2 font-bold text-xs tracking-wider flex items-center gap-2 border-t border-slate-200">
                <span className="font-mono bg-cyan-900 px-1.5 py-0.5 rounded text-[10px]">TAB 3</span>
                <span>BAGIAN III: DESAIN PEMBELAJARAN (KURIKULUM MERDEKA)</span>
              </div>
              <table className="w-full bg-white border-collapse text-left">
                <tbody>
                  <tr className="border-b border-slate-150">
                    <td className="w-1/3 bg-slate-50/80 px-4 py-3.5 font-semibold text-slate-600 border-r border-slate-150 align-top">Tujuan Pembelajaran (TP)</td>
                    <td className="px-4 py-3.5 text-slate-700 text-justify font-medium text-slate-900">{data.desainPembelajaran.tujuanPembelajaran}</td>
                  </tr>
                  <tr className="border-b border-slate-150">
                    <td className="bg-slate-50/80 px-4 py-3.5 font-semibold text-slate-600 border-r border-slate-150 align-top">Topik Pembelajaran Kontekstual</td>
                    <td className="px-4 py-3.5 text-emerald-800 font-semibold italic bg-emerald-50/30">{data.desainPembelajaran.topikPembelajaran}</td>
                  </tr>
                  <tr className="border-b border-slate-150">
                    <td className="bg-slate-50/80 px-4 py-3.5 font-semibold text-slate-600 border-r border-slate-150 align-top">Lintas Disiplin Ilmu</td>
                    <td className="px-4 py-3.5 text-slate-700 text-justify">{data.desainPembelajaran.lintasDisiplinIlmu}</td>
                  </tr>
                  <tr className="border-b border-slate-150">
                    <td className="bg-slate-50/80 px-4 py-3.5 font-semibold text-slate-600 border-r border-slate-150 align-top">Praktik Pedagogis per Pertemuan</td>
                    <td className="px-4 py-3.5 text-slate-800 font-semibold">{data.desainPembelajaran.praktikPedagogisPerPertemuan.join(', ')}</td>
                  </tr>
                  <tr className="border-b border-slate-150">
                    <td className="bg-slate-50/80 px-4 py-3 font-semibold text-slate-600 border-r border-slate-150">Kemitraan Pembelajaran</td>
                    <td className="px-4 py-3 text-slate-700">{data.desainPembelajaran.kemitraanPembelajaran || '-'}</td>
                  </tr>
                  <tr className="border-b border-slate-150">
                    <td className="bg-slate-50/80 px-4 py-3 font-semibold text-slate-600 border-r border-slate-150">Lingkungan Pembelajaran</td>
                    <td className="px-4 py-3 text-slate-700">{data.desainPembelajaran.lingkunganPembelajaran || '-'}</td>
                  </tr>
                  <tr className="border-b border-slate-150">
                    <td className="bg-slate-50/80 px-4 py-3 font-semibold text-slate-600 border-r border-slate-150">Pemanfaatan Digital</td>
                    <td className="px-4 py-3 text-slate-700">{data.desainPembelajaran.pemanfaatanDigital || input.pemanfaatanDigital.join(', ')}</td>
                  </tr>
                </tbody>
              </table>

              {/* 4. PENGALAMAN BELAJAR SHEET SECTION */}
              <div className="bg-indigo-800 text-white px-4 py-2 font-bold text-xs tracking-wider flex items-center gap-2 border-t border-slate-200">
                <span className="font-mono bg-indigo-900 px-1.5 py-0.5 rounded text-[10px]">TAB 4</span>
                <span>BAGIAN IV: PENGALAMAN BELAJAR (SKENARIO PEMBELAJARAN MENDALAM)</span>
              </div>
              <div className="p-4 bg-slate-100 space-y-4">
                {data.pengalamanBelajar.map((pertemuan, pIdx) => (
                  <div key={pIdx} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                    <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex flex-wrap justify-between items-center gap-2">
                      <span className="font-bold text-slate-800 text-xs">
                        Pertemuan Ke-{pertemuan.noPertemuan} ({pertemuan.alokasiWaktu})
                      </span>
                      <span className="text-xs text-indigo-700 font-medium">
                        Model: <span className="font-bold">{pertemuan.modelPembelajaran}</span>
                      </span>
                    </div>
                    <div className="px-4 py-1.5 bg-slate-50/50 text-slate-600 text-[11px] border-b border-slate-150">
                      <b>Materi Pokok:</b> {pertemuan.materiPertemuan}
                    </div>
                    <table className="w-full bg-white border-collapse text-left text-xs">
                      <thead>
                        <tr className="bg-slate-100/80 text-slate-700 text-[11px] font-bold border-b border-slate-200">
                          <th className="px-4 py-2.5 border-r border-slate-150 w-1/4 text-center">Aspek Belajar</th>
                          <th className="px-4 py-2.5 text-center">Skenario Kegiatan Pembelajaran</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-slate-150">
                          <td className="px-4 py-3 border-r border-slate-150 font-bold text-slate-800 align-top">
                            Memahami<br />
                            <span className="text-[9px] text-slate-400 font-normal block mt-0.5">(Kegiatan Awal)</span>
                          </td>
                          <td className="px-4 py-3 text-slate-700 text-justify align-top leading-relaxed space-y-2">
                            {pertemuan.memahami.filter(item => item.subLabel?.toLowerCase() !== 'bermakna').map((item, i) => (
                              <div key={i} className="mb-2 last:mb-0">
                                <span className="inline-block px-1.5 py-0.5 bg-indigo-50 border border-indigo-200 text-indigo-700 text-[9px] font-bold rounded uppercase mr-2">
                                  {item.tipe}
                                </span>
                                {item.subLabel && <span className="font-semibold text-slate-900">{item.subLabel}: </span>}
                                <ul className="list-disc pl-4 mt-1 space-y-1">
                                  {item.poinKegiatan.map((p, j) => <li key={j}>{p}</li>)}
                                </ul>
                              </div>
                            ))}
                          </td>
                        </tr>
                        <tr className="border-b border-slate-150">
                          <td className="px-4 py-3 border-r border-slate-150 font-bold text-slate-800 align-top">
                            Mengaplikasi<br />
                            <span className="text-[9px] text-slate-400 font-normal block mt-0.5">(Kegiatan Inti & Sintaks)</span>
                          </td>
                          <td className="px-4 py-3 text-slate-700 text-justify align-top leading-relaxed space-y-2">
                            {pertemuan.mengaplikasi.map((item, i) => (
                              <div key={i} className="mb-2 last:mb-0">
                                <span className="inline-block px-1.5 py-0.5 bg-indigo-50 border border-indigo-200 text-indigo-700 text-[9px] font-bold rounded uppercase mr-2">
                                  {item.tipe}
                                </span>
                                {item.subLabel && <span className="font-semibold text-slate-900">{item.subLabel}: </span>}
                                <ul className="list-disc pl-4 mt-1 space-y-1">
                                  {item.poinKegiatan.map((p, j) => <li key={j}>{p}</li>)}
                                </ul>
                              </div>
                            ))}
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 border-r border-slate-150 font-bold text-slate-800 align-top">
                            Refleksi<br />
                            <span className="text-[9px] text-slate-400 font-normal block mt-0.5">(Kegiatan Penutup & Umpan Balik)</span>
                          </td>
                          <td className="px-4 py-3 text-slate-700 text-justify align-top leading-relaxed space-y-2">
                            {pertemuan.refleksi.map((item, i) => (
                              <div key={i} className="mb-2 last:mb-0">
                                <span className="inline-block px-1.5 py-0.5 bg-indigo-50 border border-indigo-200 text-indigo-700 text-[9px] font-bold rounded uppercase mr-2">
                                  {item.tipe}
                                </span>
                                {item.subLabel && <span className="font-semibold text-slate-900">{item.subLabel}: </span>}
                                <ul className="list-disc pl-4 mt-1 space-y-1">
                                  {item.poinKegiatan.map((p, j) => <li key={j}>{p}</li>)}
                                </ul>
                              </div>
                            ))}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>

              {/* 5. ASESMEN SHEET SECTION */}
              <div className="bg-slate-800 text-white px-4 py-2 font-bold text-xs tracking-wider flex items-center gap-2 border-t border-slate-200">
                <span className="font-mono bg-slate-900 px-1.5 py-0.5 rounded text-[10px]">TAB 5</span>
                <span>BAGIAN V: ASESMEN PEMBELAJARAN (DIAGNOSTIK, FORMATIF & SUMATIF)</span>
              </div>
              
              <div className="p-4 bg-white space-y-6">
                <div>
                  <h4 className="font-bold text-slate-800 text-xs border-b border-slate-100 pb-1 mb-2">A. ASESMEN AWAL (DIAGNOSTIK / APERSEPSI)</h4>
                  <div className="bg-slate-50 p-3 rounded-lg text-slate-700 text-justify text-xs leading-relaxed border border-slate-100">
                    {data.asesmenPembelajaran.asesmenAwal}
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-slate-800 text-xs border-b border-slate-100 pb-1 mb-3">B. ASESMEN PROSES (FORMATIF - OBSERVASI DISKUSI)</h4>
                  
                  {/* Observasi Formative Template */}
                  <div className="font-mono text-xs bg-slate-900 text-emerald-400 p-4 rounded-lg space-y-1 overflow-x-auto shadow-inner mb-4">
                    <div>ASESMEN FORMATIF</div>
                    <div>Teknik : Tanya jawab, observasi</div>
                    <div className="h-2"></div>
                    <div>LEMBAR OBSERVASI ASESMEN FORMATIF</div>
                    <div>Mata Pelajaran : {data.asesmenPembelajaran.asesmenProses.mataPelajaran}</div>
                    <div>Materi Pelajaran : {data.asesmenPembelajaran.asesmenProses.materiPelajaran}</div>
                    <div>Kelas : {data.asesmenPembelajaran.asesmenProses.kelas}</div>
                    <div>Tanggal : ...............</div>
                    <div>Guru : {data.asesmenPembelajaran.asesmenProses.guru}</div>
                    <div className="h-2"></div>
                    <div className="font-bold text-white">Indikator yang diamati:</div>
                    {data.asesmenPembelajaran.asesmenProses.indikator.map((ind, i) => (
                      <div key={i} className="pl-2 text-slate-300">• [{i + 1}] {ind}</div>
                    ))}
                  </div>

                  {/* Formative Observational Table */}
                  <table className="w-full text-xs text-left border-collapse border border-slate-200 mb-4 bg-white">
                    <thead>
                      <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                        <th rowSpan={2} className="px-3 py-2 border-r border-slate-200 text-center w-12">NO</th>
                        <th rowSpan={2} className="px-3 py-2 border-r border-slate-200">Nama Siswa</th>
                        <th colSpan={4} className="px-3 py-1 border-r border-slate-200 text-center">Indikator yang diamati</th>
                        <th rowSpan={2} className="px-3 py-2">Catatan Guru</th>
                      </tr>
                      <tr className="bg-slate-100/50 text-slate-600 font-bold border-b border-slate-200">
                        <th className="px-2 py-1 border-r border-slate-200 text-center w-10">1</th>
                        <th className="px-2 py-1 border-r border-slate-200 text-center w-10">2</th>
                        <th className="px-2 py-1 border-r border-slate-200 text-center w-10">3</th>
                        <th className="px-2 py-1 border-r border-slate-200 text-center w-10">4</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.asesmenPembelajaran.asesmenProses.siswaObservasi.map((siswa, idx) => (
                        <tr key={idx} className="border-b border-slate-200 hover:bg-slate-50/50">
                          <td className="px-3 py-2 border-r border-slate-200 text-center">{idx + 1}</td>
                          <td className="px-3 py-2 border-r border-slate-200 font-bold text-slate-800">{siswa.nama}</td>
                          <td className="px-2 py-2 border-r border-slate-200 text-center font-bold text-sm text-slate-700">{siswa.indikatorScores[0] || '✓'}</td>
                          <td className="px-2 py-2 border-r border-slate-200 text-center font-bold text-sm text-slate-700">{siswa.indikatorScores[1] || '✓'}</td>
                          <td className="px-2 py-2 border-r border-slate-200 text-center font-bold text-sm text-slate-700">{siswa.indikatorScores[2] || '✓'}</td>
                          <td className="px-2 py-2 border-r border-slate-200 text-center font-bold text-sm text-slate-700">{siswa.indikatorScores[3] || '✓'}</td>
                          <td className="px-3 py-2 text-slate-600 italic text-justify">{siswa.catatan}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Keterangan */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
                      <span className="font-bold text-slate-700 block mb-1.5">Keterangan Penilaian:</span>
                      <table className="w-full text-[11px]">
                        <tbody>
                          <tr className="border-b border-slate-200">
                            <td className="py-1 font-bold text-center w-8 text-sm">✓</td>
                            <td className="py-1 text-slate-600">Sudah terlihat / tercapai</td>
                          </tr>
                          <tr className="border-b border-slate-200">
                            <td className="py-1 font-bold text-center text-sm text-amber-600">△</td>
                            <td className="py-1 text-slate-600">Mulai berkembang, memerlukan bimbingan</td>
                          </tr>
                          <tr>
                            <td className="py-1 font-bold text-center text-sm text-rose-500">–</td>
                            <td className="py-1 text-slate-600">Belum terlihat atau belum menunjukkan indikator</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
                      <span className="font-bold text-slate-700 block mb-1.5">Tindak Lanjut Hasil Observasi:</span>
                      <div className="space-y-1.5 text-[11px] leading-relaxed">
                        <div><b>✓ (Sebagian besar tercapai):</b> Pengayaan atau pengerjaan soal dengan tingkat kesulitan lebih tinggi.</div>
                        <div><b>△ (Beberapa berkembang):</b> Penguatan melalui latihan berkelompok dan bimbingan terbimbing.</div>
                        <div><b>– (Sebagian besar belum terlihat):</b> Program remedial intensif dan bimbingan individu yang terpantau.</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <h4 className="font-bold text-slate-800 text-xs border-b border-slate-100 pb-1 mb-3">C. ASESMEN AKHIR (SUMATIF TERTULIS)</h4>
                  
                  <div className="font-mono text-xs bg-slate-900 text-slate-300 p-4 rounded-lg space-y-3 overflow-x-auto shadow-inner">
                    <div className="font-bold text-emerald-400">ASESMEN SUMATIF</div>
                    <div>Teknik : Tertulis</div>
                    <div className="h-1"></div>
                    <div className="font-bold text-white">LEMBAR OBSERVASI ASESMEN SUMATIF</div>
                    <div>Mata Pelajaran : {data.asesmenPembelajaran.asesmenAkhir.mataPelajaran}</div>
                    <div>Materi Pelajaran : {data.asesmenPembelajaran.asesmenAkhir.materiPelajaran}</div>
                    <div>Kelas : {data.asesmenPembelajaran.asesmenAkhir.kelas}</div>
                    <div>Tanggal : ...............</div>
                    <div className="h-2"></div>
                    <div className="font-bold text-white">Butir Soal (Pilihan Ganda):</div>
                    {data.asesmenPembelajaran.asesmenAkhir.soalPilihanGanda.map((soal) => (
                      <div key={soal.no} className="border-t border-slate-800 pt-2 mt-2 space-y-1">
                        <div className="text-white font-medium">{soal.no}. {soal.pertanyaan}</div>
                        {soal.opsi.map((op, oIdx) => (
                          <div key={oIdx} className="pl-4 text-slate-400">{op}</div>
                        ))}
                      </div>
                    ))}
                    <div className="h-2"></div>
                    <div className="font-bold text-emerald-400 border-t border-slate-800 pt-2">Kunci Jawaban:</div>
                    {data.asesmenPembelajaran.asesmenAkhir.soalPilihanGanda.map((soal) => (
                      <div key={soal.no} className="pl-2">Soal No. {soal.no} : <span className="font-bold text-white bg-emerald-950 px-1 py-0.5 rounded">{soal.jawabanBenar}</span></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Standard Document printable paper view
          <div className="p-8 max-w-[850px] mx-auto font-sans text-slate-800 leading-relaxed space-y-8 bg-white selection:bg-teal-100" id="rpm_paper_doc">
            <div className="text-center space-y-1.5 border-b-2 border-slate-900 pb-4">
              <h1 className="text-2xl font-black uppercase text-slate-900 tracking-tight">RENCANA PEMBELAJARAN MENDALAM (RPM)</h1>
              <p className="text-sm font-bold text-slate-500 uppercase">KURIKULUM MERDEKA • JENJANG PENDIDIKAN {input.jenjangPendidikan}</p>
            </div>

            {/* Print Section 1 */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-emerald-800 tracking-wider uppercase border-l-4 border-emerald-600 pl-2">I. Identitas Pembelajaran</h3>
              <table className="w-full text-xs text-left border-collapse border border-slate-300">
                <tbody>
                  <tr className="border-b border-slate-200">
                    <td className="w-1/3 bg-slate-50 p-2.5 font-bold border-r border-slate-200">Nama Satuan Pendidikan</td>
                    <td className="p-2.5">{data.identitas.namaSatuanPendidikan}</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="bg-slate-50 p-2.5 font-bold border-r border-slate-200">Mata Pelajaran</td>
                    <td className="p-2.5">{data.identitas.mataPelajaran}</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="bg-slate-50 p-2.5 font-bold border-r border-slate-200">Kelas / Semester</td>
                    <td className="p-2.5">{data.identitas.kelasSemester}</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="bg-slate-50 p-2.5 font-bold border-r border-slate-200">Durasi Pertemuan</td>
                    <td className="p-2.5">{data.identitas.durasiPertemuan} ({input.jumlahPertemuan} Pertemuan)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Print Section 2 */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-emerald-800 tracking-wider uppercase border-l-4 border-emerald-600 pl-2">II. Identifikasi Kesiapan Siswa</h3>
              <table className="w-full text-xs text-left border-collapse border border-slate-300">
                <tbody>
                  <tr className="border-b border-slate-200">
                    <td className="w-1/3 bg-slate-50 p-3 font-bold border-r border-slate-200 align-top">Karakteristik & Profil Siswa fiktif</td>
                    <td className="p-3 text-justify leading-relaxed">{data.identifikasi.siswa}</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="bg-slate-50 p-2.5 font-bold border-r border-slate-200">Materi Pelajaran Pokok</td>
                    <td className="p-2.5">{data.identifikasi.materiPelajaran}</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="bg-slate-50 p-2.5 font-bold border-r border-slate-200 align-top">Capaian Dimensi Lulusan</td>
                    <td className="p-2.5">{data.identifikasi.capaianDimensiLulusan.join(', ')}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Print Section 3 */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-emerald-800 tracking-wider uppercase border-l-4 border-emerald-600 pl-2">III. Desain Pembelajaran</h3>
              <table className="w-full text-xs text-left border-collapse border border-slate-300">
                <tbody>
                  <tr className="border-b border-slate-200">
                    <td className="bg-slate-50 p-3 font-bold border-r border-slate-200 align-top">Tujuan Pembelajaran (TP)</td>
                    <td className="p-3 text-justify font-medium text-slate-900">{data.desainPembelajaran.tujuanPembelajaran}</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="bg-slate-50 p-3 font-bold border-r border-slate-200 align-top">Topik Pembelajaran Kontekstual</td>
                    <td className="p-3 font-medium text-teal-800 italic">{data.desainPembelajaran.topikPembelajaran}</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="bg-slate-50 p-3 font-bold border-r border-slate-200 align-top">Lintas Disiplin Ilmu</td>
                    <td className="p-3 text-justify">{data.desainPembelajaran.lintasDisiplinIlmu}</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="bg-slate-50 p-3 font-bold border-r border-slate-200 align-top">Praktik Pedagogis per Pertemuan</td>
                    <td className="p-3 font-bold">{data.desainPembelajaran.praktikPedagogisPerPertemuan.join(', ')}</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="bg-slate-50 p-2.5 font-bold border-r border-slate-200">Kemitraan Pembelajaran</td>
                    <td className="p-2.5">{data.desainPembelajaran.kemitraanPembelajaran || '-'}</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="bg-slate-50 p-2.5 font-bold border-r border-slate-200">Lingkungan Pembelajaran</td>
                    <td className="p-2.5">{data.desainPembelajaran.lingkunganPembelajaran || '-'}</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="bg-slate-50 p-2.5 font-bold border-r border-slate-200">Pemanfaatan Platform Digital</td>
                    <td className="p-2.5">{input.pemanfaatanDigital.join(', ')}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Print Section 4 */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-emerald-800 tracking-wider uppercase border-l-4 border-emerald-600 pl-2">IV. Skenario Pengalaman Belajar</h3>
              {data.pengalamanBelajar.map((pertemuan, pIdx) => (
                <div key={pIdx} className="space-y-2 border border-slate-200 rounded-lg p-3 bg-slate-50/50">
                  <h4 className="text-xs font-bold text-emerald-800">Pertemuan {pertemuan.noPertemuan} ({pertemuan.alokasiWaktu}) - {pertemuan.materiPertemuan}</h4>
                  <p className="text-[10px] text-slate-500 font-medium">Model Pembelajaran: {pertemuan.modelPembelajaran}</p>
                  <table className="w-full text-xs text-left border-collapse border border-slate-300 bg-white">
                    <thead>
                      <tr className="bg-slate-100 font-bold border-b border-slate-300">
                        <th className="p-2 border-r border-slate-300 w-1/4">Aspek Belajar</th>
                        <th className="p-2">Skenario Kegiatan Pembelajaran</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-slate-200">
                        <td className="p-2 border-r border-slate-300 font-bold text-slate-800 align-top">Memahami<br /><small className="font-normal text-slate-400 block mt-1">(Kegiatan Awal)</small></td>
                        <td className="p-2 text-justify align-top leading-relaxed space-y-2">
                          {pertemuan.memahami.filter(item => item.subLabel?.toLowerCase() !== 'bermakna').map((item, i) => (
                            <div key={i} className="text-xs mb-1.5 last:mb-0">
                              <span className="inline-block bg-slate-100 text-slate-700 font-bold px-1 py-0.5 rounded text-[9px] uppercase mr-1.5">{item.tipe}</span>
                              {item.subLabel && <span className="font-semibold text-slate-900 mr-1">{item.subLabel}:</span>}
                              <ul className="list-disc pl-5 mt-0.5 space-y-0.5">
                                {item.poinKegiatan.map((p, j) => <li key={j}>{p}</li>)}
                              </ul>
                            </div>
                          ))}
                        </td>
                      </tr>
                      <tr className="border-b border-slate-200">
                        <td className="p-2 border-r border-slate-300 font-bold text-slate-800 align-top">Mengaplikasi<br /><small className="font-normal text-slate-400 block mt-1">(Kegiatan Inti)</small></td>
                        <td className="p-2 text-justify align-top leading-relaxed space-y-2">
                          {pertemuan.mengaplikasi.map((item, i) => (
                            <div key={i} className="text-xs mb-1.5 last:mb-0">
                              <span className="inline-block bg-indigo-50 text-indigo-700 font-bold px-1 py-0.5 rounded text-[9px] uppercase mr-1.5">{item.tipe}</span>
                              {item.subLabel && <span className="font-semibold text-slate-900 mr-1">{item.subLabel}:</span>}
                              <ul className="list-disc pl-5 mt-0.5 space-y-0.5">
                                {item.poinKegiatan.map((p, j) => <li key={j}>{p}</li>)}
                              </ul>
                            </div>
                          ))}
                        </td>
                      </tr>
                      <tr className="border-b border-slate-200">
                        <td className="p-2 border-r border-slate-300 font-bold text-slate-800 align-top">Refleksi<br /><small className="font-normal text-slate-400 block mt-1">(Kegiatan Penutup)</small></td>
                        <td className="p-2 text-justify align-top leading-relaxed space-y-2">
                          {pertemuan.refleksi.map((item, i) => (
                            <div key={i} className="text-xs mb-1.5 last:mb-0">
                              <span className="inline-block bg-teal-50 text-teal-700 font-bold px-1 py-0.5 rounded text-[9px] uppercase mr-1.5">{item.tipe}</span>
                              {item.subLabel && <span className="font-semibold text-slate-900 mr-1">{item.subLabel}:</span>}
                              <ul className="list-disc pl-5 mt-0.5 space-y-0.5">
                                {item.poinKegiatan.map((p, j) => <li key={j}>{p}</li>)}
                              </ul>
                            </div>
                          ))}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ))}
            </div>

            {/* Print Section 5 */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-emerald-800 tracking-wider uppercase border-l-4 border-emerald-600 pl-2">V. Rencana Asesmen Pembelajaran</h3>
              
              <div className="space-y-1 bg-slate-50 p-3 rounded border text-xs">
                <span className="font-bold text-slate-800">A. Asesmen Awal (Diagnostik):</span>
                <p className="text-slate-700 text-justify leading-relaxed whitespace-pre-wrap">{data.asesmenPembelajaran.asesmenAwal}</p>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-800 block">B. Asesmen Proses (Formatif - Tanya jawab & Observasi Kelompok):</span>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs mb-2">
                  <div><span className="font-bold">Mata Pelajaran:</span> {data.asesmenPembelajaran.asesmenProses.mataPelajaran || data.identitas.mataPelajaran}</div>
                  <div><span className="font-bold">Materi Pelajaran:</span> {data.asesmenPembelajaran.asesmenProses.materiPelajaran || data.identifikasi.materiPelajaran}</div>
                  <div><span className="font-bold">Kelas / Semester:</span> {data.asesmenPembelajaran.asesmenProses.kelas || data.identitas.kelasSemester}</div>
                  <div><span className="font-bold">Guru Pengampu:</span> {data.asesmenPembelajaran.asesmenProses.guru || input.namaGuru}</div>
                </div>

                <table className="w-full text-[10px] text-left border-collapse border border-slate-300">
                  <thead>
                    <tr className="bg-slate-150 font-bold border-b border-slate-300 text-slate-700">
                      <th rowSpan={2} className="p-2 border-r border-slate-300 text-center w-10">NO</th>
                      <th rowSpan={2} className="p-2 border-r border-slate-300">Nama Siswa</th>
                      <th colSpan={4} className="p-1 border-r border-slate-300 text-center">Indikator yang diamati</th>
                      <th rowSpan={2} className="p-2">Catatan Guru Pengamatan</th>
                    </tr>
                    <tr className="bg-slate-100 font-bold border-b border-slate-300 text-slate-600">
                      <th className="p-1 border-r border-slate-300 text-center">1</th>
                      <th className="p-1 border-r border-slate-300 text-center">2</th>
                      <th className="p-1 border-r border-slate-300 text-center">3</th>
                      <th className="p-1 border-r border-slate-300 text-center">4</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.asesmenPembelajaran.asesmenProses.siswaObservasi.map((siswa, i) => (
                      <tr key={i} className="border-b border-slate-200">
                        <td className="p-2 border-r border-slate-200 text-center">{i + 1}</td>
                        <td className="p-2 border-r border-slate-200 font-bold">{siswa.nama}</td>
                        <td className="p-1 border-r border-slate-200 text-center text-xs">{siswa.indikatorScores[0]}</td>
                        <td className="p-1 border-r border-slate-200 text-center text-xs">{siswa.indikatorScores[1]}</td>
                        <td className="p-1 border-r border-slate-200 text-center text-xs">{siswa.indikatorScores[2]}</td>
                        <td className="p-1 border-r border-slate-200 text-center text-xs">{siswa.indikatorScores[3]}</td>
                        <td className="p-2 text-justify italic">{siswa.catatan}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg text-xs space-y-2">
                  <div>
                    <span className="font-bold text-slate-800 block mb-1">Indikator yang Diamati:</span>
                    <ol className="list-decimal pl-4 space-y-1 text-slate-700">
                      {data.asesmenPembelajaran.asesmenProses.indikator.map((ind, idx) => (
                        <li key={idx}><strong>Indikator {idx + 1}:</strong> {ind}</li>
                      ))}
                    </ol>
                  </div>
                  <div className="border-t border-slate-200 pt-1.5 text-[10px] text-slate-500">
                    <span className="font-bold">Keterangan Penilaian:</span>{' '}
                    ✓ : Sudah terlihat / tercapai |{' '}
                    △ : Mulai berkembang, masih memerlukan bimbingan |{' '}
                    – : Belum terlihat atau belum menunjukkan indikator
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-slate-800 block">C. Asesmen Akhir (Sumatif Tertulis - Pilihan Ganda):</span>
                <div className="bg-slate-50 p-4 rounded border text-xs space-y-3 font-mono leading-relaxed text-slate-700">
                  {data.asesmenPembelajaran.asesmenAkhir.soalPilihanGanda.map((soal) => (
                    <div key={soal.no} className="space-y-1">
                      <span className="font-bold text-slate-950">Soal No. {soal.no}: {soal.pertanyaan}</span>
                      <div className="pl-4">
                        {soal.opsi.map((op, opIdx) => <div key={opIdx}>{op}</div>)}
                      </div>
                    </div>
                  ))}
                  <div className="border-t border-slate-200 pt-2 text-emerald-800 font-bold">
                    Kunci Jawaban Sumatif:
                    {data.asesmenPembelajaran.asesmenAkhir.soalPilihanGanda.map((soal) => (
                      <div key={soal.no} className="pl-4">Soal No. {soal.no} : {soal.jawabanBenar}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 6. LEMBAR KERJA PESERTA DIDIK (LKPD) - ALWAYS RENDERED BEAUTIFULLY AT THE BOTTOM */}
        <div className="p-4 sm:p-8 border-t border-slate-200 bg-gradient-to-b from-teal-50/20 to-teal-100/10">
          <div className="max-w-[850px] mx-auto border-2 border-dashed border-teal-300 rounded-2xl bg-white p-6 sm:p-8 shadow-sm space-y-6">
            <div className="text-center">
              <span className="px-3 py-1 bg-teal-100 text-teal-800 text-xs font-bold rounded-full uppercase tracking-wider">Aktivitas Mandiri</span>
              <h2 className="text-xl font-extrabold text-teal-800 mt-2 uppercase tracking-tight">LKPD (Lembar Kerja Peserta Didik)</h2>
              <p className="text-[11px] text-teal-600/80 italic mt-0.5">Media Belajar Berpikir Kritis & Kontekstual Berorientasi Pemahaman Mendalam</p>
            </div>

            {/* LKPD Meta */}
            <div className="bg-teal-50/50 p-4 rounded-xl border border-teal-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
              <div>
                <span className="font-bold">Nama Lengkap Siswa :</span> <span className="border-b border-dashed border-slate-400 inline-block w-40 text-center">.......................................</span>
              </div>
              <div>
                <span className="font-bold">Kelas / Semester :</span> <span className="font-semibold text-slate-900">{data.lkpd.identitas.kelas || input.kelas}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="font-bold block mb-1">Tujuan Pembelajaran (TP) Terkait :</span>
                <p className="bg-white p-2 rounded border border-teal-100 leading-relaxed font-medium text-slate-800 text-justify">
                  {data.lkpd.identitas.tujuanPembelajaran}
                </p>
              </div>
            </div>

            {/* LKPD Questions list */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-teal-800 tracking-wider uppercase border-b border-teal-100 pb-1 flex items-center gap-1.5">
                <HelpCircle className="h-4 w-4 text-teal-600" />
                Lembar Aktivitas Soal Bergradasi (Mudah - Sedang - Sulit - Kontekstual)
              </h3>

              {data.lkpd.soal.map((soal, i) => (
                <div key={soal.no} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-teal-200 transition">
                  <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-100">
                    <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded">Soal No. {soal.no}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      soal.tingkatKesulitan === 'Mudah'
                        ? 'bg-emerald-50 text-emerald-700'
                        : soal.tingkatKesulitan === 'Sedang'
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-rose-50 text-rose-700'
                    }`}>
                      Tingkat Kesulitan: {soal.tingkatKesulitan}
                    </span>
                  </div>

                  <p className="text-sm font-bold text-slate-800 mb-3 text-justify leading-relaxed">{soal.pertanyaan}</p>

                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-150 text-xs">
                    <span className="font-bold text-slate-700 block mb-1.5">💡 Panduan Langkah & Proses Berpikir:</span>
                    <ol className="list-decimal pl-4 text-slate-600 space-y-1">
                      {soal.langkahPengerjaan.map((step, sIdx) => (
                        <li key={sIdx} className="leading-relaxed">{step}</li>
                      ))}
                    </ol>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Signature Box Section at the absolute end of document */}
        <div className="px-8 py-6 max-w-[850px] mx-auto border-t border-slate-100 text-xs text-slate-700">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-8 sm:gap-4">
            <div className="w-1/2 min-w-[200px] space-y-1">
              <p className="invisible">Siti, 15 Juli 2026</p>
              <p>Mengetahui,</p>
              <p className="font-bold">Kepala Satuan Pendidikan</p>
              <div className="h-20"></div>
              <p className="font-bold text-slate-950 border-b border-slate-300 pb-0.5 inline-block min-w-[180px]">{input.namaKepalaSekolah}</p>
              <p className="text-slate-500 font-mono text-[10px]">NIP. {input.nipKepalaSekolah || '-'}</p>
            </div>

            <div className="w-1/2 min-w-[200px] text-right space-y-1 ml-auto">
              <p>{input.tempatTanggalPengesahan || 'Jakarta, 15 Juli 2026'}</p>
              <p className="invisible">Guru Pengampu</p>
              <p className="font-bold">Guru Mata Pelajaran</p>
              <div className="h-20"></div>
              <p className="font-bold text-slate-950 border-b border-slate-300 pb-0.5 inline-block text-right min-w-[180px]">{input.namaGuru}</p>
              <p className="text-slate-500 font-mono text-[10px]">NIP. {input.nipGuru || '-'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
