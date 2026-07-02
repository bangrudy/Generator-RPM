import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for RPM Generation
  app.post("/api/generate-rpm", async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(400).json({
          error: "API Key Gemini tidak ditemukan. Silakan tambahkan GEMINI_API_KEY di panel Secrets/Settings di kanan atas."
        });
      }

      // Lazy load GoogleGenAI to handle errors gracefully
      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const {
        namaSatuanPendidikan,
        namaGuru,
        nipGuru,
        namaKepalaSekolah,
        nipKepalaSekolah,
        tahunPelajaran,
        tempatTanggalPengesahan,
        jenjangPendidikan,
        kelas,
        mataPelajaran,
        tujuanPembelajaran,
        materiPelajaran,
        jumlahPertemuan,
        durasiPertemuan,
        kemitraanPembelajaran,
        lingkunganPembelajaran,
        pemanfaatanDigital,
        praktikPedagogis, // array or single
        dimensiLulusan // array of strings
      } = req.body;

      const pedagogisList = Array.isArray(praktikPedagogis) 
        ? praktikPedagogis.join(", ") 
        : (praktikPedagogis || "Inkuiri-Discovery");

      const dimensiList = Array.isArray(dimensiLulusan)
        ? dimensiLulusan.join(", ")
        : (dimensiLulusan || "Penalaran Kritis");

      // Construct a highly detailed prompt in Indonesian
      const prompt = `
Anda adalah seorang ahli teknologi pendidikan, kurikulum Merdeka belajar, dan konsultan model pembelajaran Deep Learning (Perencanaan Pembelajaran Mendalam - RPM) di Indonesia.
Tugas Anda adalah merancang Rencana Pembelajaran Mendalam (RPM) terstruktur secara lengkap, profesional, dan kaya konten menggunakan parameter berikut:

1. Nama Satuan Pendidikan: ${namaSatuanPendidikan}
2. Nama Guru: ${namaGuru} (NIP: ${nipGuru || '-'})
3. Nama Kepala Sekolah: ${namaKepalaSekolah} (NIP: ${nipKepalaSekolah || '-'})
4. Tahun Pelajaran: ${tahunPelajaran}
5. Tempat & Tanggal Pengesahan: ${tempatTanggalPengesahan}
6. Jenjang Pendidikan: ${jenjangPendidikan}
7. Kelas: ${kelas}
8. Mata Pelajaran: ${mataPelajaran}
9. Tujuan Pembelajaran (TP): ${tujuanPembelajaran}
10. Materi Pelajaran: ${materiPelajaran}
11. Jumlah Pertemuan: ${jumlahPertemuan} Pertemuan
12. Durasi per Pertemuan: ${durasiPertemuan}
13. Kemitraan Pembelajaran: ${kemitraanPembelajaran}
14. Lingkungan Pembelajaran: ${lingkunganPembelajaran}
15. Pemanfaatan Digital: ${pemanfaatanDigital}
16. Praktik Pedagogis per Pertemuan: ${pedagogisList}
17. Dimensi Lulusan: ${dimensiList}

Instruksi Tambahan untuk Output:
- Pastikan semua kalimat menggunakan Bahasa Indonesia yang baik dan benar (EID) dan tidak ada yang terpotong.
- Generate otomatis satu deskripsi "Capaian Pembelajaran (CP)" yang tepat, formal, dan selaras dengan Kurikulum Merdeka, Mata Pelajaran ${mataPelajaran}, Kelas ${kelas}, dan Tujuan Pembelajaran: "${tujuanPembelajaran}".
- Bagian Identifikasi Siswa harus di-generate otomatis berupa analisis karakteristik/profil singkat fiktif siswa yang logis untuk jenjang ${jenjangPendidikan} kelas ${kelas} dalam mempelajari topik ${materiPelajaran}.
- Lintas Disiplin Ilmu harus merancang keterkaitan materi ini dengan mata pelajaran lain secara bermakna (misal matematika digabungkan dengan IPA dan bahasa).
- Topik Pembelajaran harus dirumuskan secara kontekstual yang menghubungkan materi dan tujuan pembelajaran agar relevan dengan kehidupan nyata peserta didik.
- Rancang Pengalaman Belajar secara runut per pertemuan dengan total tepat ${jumlahPertemuan} pertemuan. Jangan menggabungkan pertemuan! Setiap pertemuan harus memiliki tabel skenarionya sendiri yang terdiri dari tiga tahapan: Memahami, Mengaplikasi, dan Refleksi.
- Pada tahapan 'Memahami' di setiap pertemuan, WAJIB buat langkah-langkah detail berikut secara lengkap:
  1. Langkah pertama bertipe "Berkesadaran" dengan subLabel "Berkesadaran", yang berisi poinKegiatan eksak berikut (tidak boleh diubah atau disingkat):
     - "Peserta didik menyiapkan diri secara fisik dan psikis untuk mengikuti proses pembelajaran melalui kegiatan berikut:\na. Peserta didik memberi salam dan berdo’a sesuai kepercayaan masing-masing yang dipimpin oleh ketua kelas.\nb. Guru menanyakan kabar dan mengecek kehadiran peserta didik.\nc. Peserta didik mempersiapkan perlengkapan dan peralatan yang diperlukan untuk pembelajaran."
     - "Peserta didik diberikan asesmen diagnostik kognitif dan non-kognitif oleh guru."
     - "Peserta didik menyimak informasi tentang tujuan pembelajaran hari ini. Salah satu peserta didik diminta untuk membacakan tujuan pembelajaran yang ditayangkan pada slide PPT."
  2. Langkah-langkah berikutnya bertipe "Bermakna" atau "Menggembirakan" yang mencakup:
     - SubLabel "Apersepsi" (Tipe "Bermakna"): Penjelasan tentang materi prasyarat yang relevan dengan topik ini (AI men-generate materi prasyarat yang logis untuk topik ${materiPelajaran}).
     - SubLabel "Pertanyaan Pemantik" (Tipe "Bermakna"): Pertanyaan pemantik kontekstual yang memicu rasa ingin tahu siswa tentang ${materiPelajaran}.
     - SubLabel "Menggembirakan (Ice Breaking)" (Tipe "Menggembirakan"): Contoh aktivitas Ice Breaking yang spesifik, relevan, dan menggembirakan untuk menyegarkan suasana kelas.
- Pada tahapan 'Mengaplikasi' di setiap pertemuan, buat langkah-langkah kegiatan siswa yang runut sesuai dengan model pembelajaran (sintaks model pedagogi yang dipilih untuk pertemuan itu, misalnya "Fase 1: ...", "Fase 2: ...", dst.). Anda WAJIB menyisipkan langkah-langkah berikut secara eksplisit ke dalam sintaks pembelajaran tersebut:
  - Harus ada langkah: "Peserta didik diberi kesempatan oleh guru untuk mengumpulkan informasi yang sesuai dengan penyelesaian masalah yang diberikan pada LKPD." (Tipe "Bermakna")
  - Harus ada langkah: "Peserta didik secara berkelompok mengerjakan LKPD, lalu mempresentasikan hasil kerja kelompok di depan kelas." (Tipe "Bermakna" atau "Berkesadaran")
  - Pada Fase 3, Fase 4, dan Fase 5, Anda WAJIB menjabarkannya lebih detail dengan menambahkan beberapa poin penting (bullet points) yang spesifik dan kaya konten (maksimal tepat 3 poin kegiatan untuk masing-masing Fase 3, Fase 4, dan Fase 5).
- Pada tahapan 'Refleksi' di setiap pertemuan, buat kegiatan penutup yang komprehensif dengan menyusunnya menjadi tepat maksimal 3 atau 4 poin kegiatan. Kegiatan penutup ini WAJIB mencakup poin-poin kegiatan berikut:
  1. Poin kegiatan membuat kesimpulan terstruktur secara bersama-sama antara peserta didik dan guru tentang materi pelajaran hari ini.
  2. Poin kegiatan refleksi diri/refleksi kelas untuk mengevaluasi pemahaman, proses, dan perasaan peserta didik selama pembelajaran.
  3. Poin kegiatan melakukan asesmen sumatif harian (misal kuis singkat atau evaluasi tertulis) untuk mengukur tingkat pemahaman akhir peserta didik.
- Pada Asesmen Pembelajaran, jika Jumlah Pertemuan adalah N (misalnya N = 3), maka rancanglah asesmen formatif, asesmen sumatif, dan LKPD agar benar-benar selaras, relevan, dan berkorespondensi satu-ke-satu dengan masing-masing materi dan kegiatan di Pertemuan 1 sampai N tersebut:
  - Pada 'asesmenAwal' (Asesmen Awal), buatlah penjelasan pelaksanaan serta tampilkan secara eksplisit tepat maksimal 2 butir soal asesmen diagnostik (1 soal kognitif tentang materi prasyarat topik ${materiPelajaran}, dan 1 soal non-kognitif tentang gaya belajar atau kesiapan siswa) lengkap dengan panduan/kunci jawaban singkat.
  - Pada 'asesmenProses' (Formatif), buatlah lembar observasi yang berisi:
    - 4 Indikator yang diamati. Anda WAJIB menyesuaikan Indikator ke-i secara berurutan agar mengukur/menilai aktivitas spesifik yang dipelajari pada Pertemuan ke-i (Indikator 1 mengukur Pertemuan 1, Indikator 2 mengukur Pertemuan 2, Indikator 3 mengukur Pertemuan 3, dst. sampai N). Jadikan salah satu indikator tetap selaras dengan tujuan pembelajaran: "${tujuanPembelajaran}". Indikator ke-4 dapat berupa sikap umum siswa (seperti kolaborasi kelompok atau keaktifan kelas).
    - Roster minimal 3 siswa fiktif dengan penilaian indikator berisi simbol '✓', '△', atau '–' serta Catatan Guru yang relevan untuk setiap siswa tersebut yang menggambarkan perkembangan performa mereka di setiap pertemuan secara logis dan kontekstual.
  - Pada 'asesmenAkhir' (Sumatif), buatlah daftar pertanyaan pilihan ganda dengan jumlah soal yang tepat sama dengan jumlah pertemuan N (misalnya 3 soal jika N = 3). Setiap soal WAJIB dibuat khusus untuk menguji topik dan materi yang dibahas pada Pertemuan yang bersangkutan secara berurutan (Soal No. 1 untuk menguji Pertemuan 1, Soal No. 2 untuk menguji Pertemuan 2, Soal No. 3 untuk menguji Pertemuan 3, dst.). Setiap soal memiliki 5 pilihan/opsi: A, B, C, D, E, lengkap dengan kunci jawaban.
- Buatkan juga Lembar Kerja Peserta Didik (LKPD) yang menarik:
  - Jumlah butir soal di dalam LKPD WAJIB dibuat tepat sejumlah N (sesuai jumlah pertemuan, misalnya 3 soal jika N = 3).
  - Setiap butir soal di dalam LKPD WAJIB didesain khusus untuk menjadi penugasan/aktivitas kelompok/mandiri dari Pertemuan yang bersangkutan secara berurutan (Soal No. 1 didesain selaras dengan materi Pertemuan 1, Soal No. 2 didesain selaras dengan materi Pertemuan 2, Soal No. 3 didesain selaras dengan materi Pertemuan 3, dst.).
  - Di awal kalimat pertanyaan setiap soal LKPD, Anda WAJIB menyisipkan penanda pertemuan yang jelas, misalnya: "(Untuk Pertemuan 1) ..." atau "(Tugas Kelompok Pertemuan 2) ...".
  - Urutan tingkat kesulitan soal LKPD harus tetap bergradasi secara logis dari mudah ke sulit (misalnya Soal No. 1 Mudah, Soal No. 2 Sedang, Soal No. 3 Sulit & Kontekstual kehidupan sehari-hari).
  - Setiap soal LKPD harus dilengkapi dengan langkah-langkah panduan pengerjaan & proses berpikir yang runut yang membimbing siswa menyelesaikan permasalahan spesifik dari pertemuan tersebut.

Format JSON Anda harus valid dan tepat mengikuti schema yang disediakan.
`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.2,
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              identitas: {
                type: Type.OBJECT,
                properties: {
                  namaSatuanPendidikan: { type: Type.STRING },
                  mataPelajaran: { type: Type.STRING },
                  kelasSemester: { type: Type.STRING },
                  durasiPertemuan: { type: Type.STRING }
                },
                required: ["namaSatuanPendidikan", "mataPelajaran", "kelasSemester", "durasiPertemuan"]
              },
              identifikasi: {
                type: Type.OBJECT,
                properties: {
                  siswa: { type: Type.STRING },
                  materiPelajaran: { type: Type.STRING },
                  capaianDimensiLulusan: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  }
                },
                required: ["siswa", "materiPelajaran", "capaianDimensiLulusan"]
              },
              desainPembelajaran: {
                type: Type.OBJECT,
                properties: {
                  capaianPembelajaran: { type: Type.STRING },
                  lintasDisiplinIlmu: { type: Type.STRING },
                  tujuanPembelajaran: { type: Type.STRING },
                  topikPembelajaran: { type: Type.STRING },
                  praktikPedagogisPerPertemuan: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  kemitraanPembelajaran: { type: Type.STRING },
                  lingkunganPembelajaran: { type: Type.STRING },
                  pemanfaatanDigital: { type: Type.STRING }
                },
                required: [
                  "capaianPembelajaran", "lintasDisiplinIlmu", "tujuanPembelajaran",
                  "topikPembelajaran", "praktikPedagogisPerPertemuan",
                  "kemitraanPembelajaran", "lingkunganPembelajaran", "pemanfaatanDigital"
                ]
              },
              pengalamanBelajar: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    noPertemuan: { type: Type.INTEGER },
                    alokasiWaktu: { type: Type.STRING },
                    materiPertemuan: { type: Type.STRING },
                    modelPembelajaran: { type: Type.STRING },
                    memahami: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          tipe: { type: Type.STRING }, // "Berkesadaran", "Bermakna", "Menggembirakan"
                          subLabel: { type: Type.STRING }, // e.g. "Apersepsi", "Ice Breaking", "Motivasi", "Langkah Awal"
                          poinKegiatan: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                          }
                        },
                        required: ["tipe", "poinKegiatan"]
                      }
                    },
                    mengaplikasi: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          tipe: { type: Type.STRING }, // "Berkesadaran", "Bermakna", "Menggembirakan"
                          subLabel: { type: Type.STRING }, // e.g. "Fase 1: ...", "Fase 2: ..."
                          poinKegiatan: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                          }
                        },
                        required: ["tipe", "poinKegiatan"]
                      }
                    },
                    refleksi: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          tipe: { type: Type.STRING }, // "Berkesadaran", "Bermakna", "Menggembirakan"
                          subLabel: { type: Type.STRING }, // e.g. "Kesimpulan", "Umpan Balik"
                          poinKegiatan: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                          }
                        },
                        required: ["tipe", "poinKegiatan"]
                      }
                    }
                  },
                  required: ["noPertemuan", "alokasiWaktu", "materiPertemuan", "modelPembelajaran", "memahami", "mengaplikasi", "refleksi"]
                }
              },
              asesmenPembelajaran: {
                type: Type.OBJECT,
                properties: {
                  asesmenAwal: { type: Type.STRING },
                  asesmenProses: {
                    type: Type.OBJECT,
                    properties: {
                      mataPelajaran: { type: Type.STRING },
                      materiPelajaran: { type: Type.STRING },
                      kelas: { type: Type.STRING },
                      guru: { type: Type.STRING },
                      indikator: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING }
                      },
                      siswaObservasi: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            nama: { type: Type.STRING },
                            indikatorScores: {
                              type: Type.ARRAY,
                              items: { type: Type.STRING } // e.g. "✓", "△", "–"
                            },
                            catatan: { type: Type.STRING }
                          },
                          required: ["nama", "indikatorScores", "catatan"]
                        }
                      }
                    },
                    required: ["mataPelajaran", "materiPelajaran", "kelas", "guru", "indikator", "siswaObservasi"]
                  },
                  asesmenAkhir: {
                    type: Type.OBJECT,
                    properties: {
                      mataPelajaran: { type: Type.STRING },
                      materiPelajaran: { type: Type.STRING },
                      kelas: { type: Type.STRING },
                      soalPilihanGanda: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            no: { type: Type.INTEGER },
                            pertanyaan: { type: Type.STRING },
                            opsi: {
                              type: Type.ARRAY,
                              items: { type: Type.STRING } // 5 options
                            },
                            jawabanBenar: { type: Type.STRING }
                          },
                          required: ["no", "pertanyaan", "opsi", "jawabanBenar"]
                        }
                      }
                    },
                    required: ["mataPelajaran", "materiPelajaran", "kelas", "soalPilihanGanda"]
                  }
                },
                required: ["asesmenAwal", "asesmenProses", "asesmenAkhir"]
              },
              lkpd: {
                type: Type.OBJECT,
                properties: {
                  identitas: {
                    type: Type.OBJECT,
                    properties: {
                      nama: { type: Type.STRING },
                      kelas: { type: Type.STRING },
                      tujuanPembelajaran: { type: Type.STRING }
                    },
                    required: ["nama", "kelas", "tujuanPembelajaran"]
                  },
                  soal: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        no: { type: Type.INTEGER },
                        pertanyaan: { type: Type.STRING },
                        tingkatKesulitan: { type: Type.STRING }, // e.g., "Mudah", "Sedang", "Sulit"
                        langkahPengerjaan: {
                          type: Type.ARRAY,
                          items: { type: Type.STRING }
                        }
                      },
                      required: ["no", "pertanyaan", "tingkatKesulitan", "langkahPengerjaan"]
                    }
                  }
                },
                required: ["identitas", "soal"]
              }
            },
            required: [
              "identitas", "identifikasi", "desainPembelajaran",
              "pengalamanBelajar", "asesmenPembelajaran", "lkpd"
            ]
          }
        }
      });

      const responseText = response.text || "{}";
      const parsedData = JSON.parse(responseText.trim());
      res.json(parsedData);
    } catch (err: any) {
      console.error("API error:", err);
      res.status(500).json({ error: err.message || "Gagal membuat RPM. Silakan periksa koneksi Anda dan coba lagi." });
    }
  });

  // Serve Vite app in dev mode, static folder in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
