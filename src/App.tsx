/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { RpmInput, RpmOutput } from './types';
import RpmForm from './components/RpmForm';
import RpmPreview from './components/RpmPreview';
import { motion, AnimatePresence } from 'motion/react';
import { GraduationCap, Sparkles, BookOpen, ChevronLeft, AlertCircle, FileSpreadsheet, ListTodo, HelpCircle, FileCheck } from 'lucide-react';

export default function App() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeStep, setActiveStep] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [rpmInput, setRpmInput] = useState<RpmInput | null>(null);
  const [rpmOutput, setRpmOutput] = useState<RpmOutput | null>(null);

  const handleGenerateRpm = async (input: RpmInput) => {
    setLoading(true);
    setProgress(0);
    setActiveStep('Menghubungkan ke Gemini AI & menganalisis parameter kurikulum...');
    setError(null);
    setRpmInput(input);
    setRpmOutput(null);

    // Dynamic, organic progress updates based on Indonesian curriculum structure
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 98) return prev;
        
        // Organic step increments
        const increment = Math.floor(Math.random() * 6) + 3; // 3 to 8 percent
        const next = Math.min(prev + increment, 98);
        
        if (next < 15) {
          setActiveStep('Menganalisis parameter Kurikulum Merdeka & model pedagogis...');
        } else if (next < 35) {
          setActiveStep('Merumuskan Tujuan Pembelajaran & Identifikasi karakteristik siswa...');
        } else if (next < 55) {
          setActiveStep(`Menyusun rincian Pengalaman Belajar untuk ${input.jumlahPertemuan} Pertemuan...`);
        } else if (next < 75) {
          setActiveStep('Merancang instrumen Asesmen Formatif & Lembar Observasi...');
        } else if (next < 90) {
          setActiveStep('Membentuk butir soal Asesmen Sumatif & kunci jawaban...');
        } else {
          setActiveStep('Mendesain LKPD bergradasi & merelasikan aktivitas pertemuan...');
        }
        return next;
      });
    }, 280);

    try {
      const response = await fetch('/api/generate-rpm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Terjadi kesalahan saat membuat rencana pembelajaran.');
      }

      clearInterval(interval);
      setProgress(100);
      setActiveStep('Rencana Pembelajaran Mendalam (RPM) berhasil disusun!');
      
      // Let the user feel the satisfying 100% completion for 350ms
      await new Promise(resolve => setTimeout(resolve, 350));

      setRpmOutput(data);
      // Scroll to preview after generating
      setTimeout(() => {
        document.getElementById('rpm_preview_section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      clearInterval(interval);
      console.error(err);
      setError(err.message || 'Gagal memproses data. Hubungi admin atau coba lagi beberapa saat.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetForm = () => {
    setRpmOutput(null);
    setRpmInput(null);
    setError(null);
    setProgress(0);
    setActiveStep('');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans" id="app_root">
      {/* Dynamic Nav-Header */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-emerald-500 to-teal-500 p-2.5 rounded-xl text-slate-900 shadow-lg shadow-emerald-500/20">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight text-white flex items-center gap-1">
                Generator RPM
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider">v2.1</span>
              </h1>
              <p className="text-[10px] text-slate-400 font-medium">Perencanaan Pembelajaran Mendalam Otomatis</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold text-slate-400">
            <span className="hidden md:inline">Kurikulum Merdeka Belajar</span>
            <span className="h-4 w-[1px] bg-slate-800 hidden md:inline"></span>
            <span className="bg-slate-800 px-2.5 py-1 rounded text-[10px] text-emerald-400 border border-slate-700/50">Gemini Powered</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Intro Pitch / Hero Widget */}
        <AnimatePresence mode="wait">
          {!rpmOutput && !loading && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <div className="md:col-span-2 space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-100">
                  <Sparkles className="h-3.5 w-3.5 text-emerald-600 animate-pulse" />
                  Paradigma Baru Pembelajaran Mendalam
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Tingkatkan Kualitas Rencana Pembelajaran Anda dengan Generator RPM
                </h2>
                <p className="text-sm text-slate-500 leading-relaxed max-w-2xl">
                  Rancang Perencanaan Pembelajaran Mendalam (RPM) yang kaya, bermakna, kontekstual, dan selaras dengan karakteristik siswa Anda. Generator ini secara otomatis melahirkan skenario pembelajaran bergradasi, instrumen penilaian formatif lembar observasi siswa, rubrik tindak lanjut, sumatif lengkap dengan kunci jawaban, serta LKPD yang menantang.
                </p>
              </div>

              <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-slate-300 p-5 rounded-2xl flex flex-col justify-between border border-slate-800">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Fitur Output Lengkap</span>
                <ul className="text-xs space-y-2.5 my-4">
                  <li className="flex items-center gap-2"><FileSpreadsheet className="h-4 w-4 text-emerald-500 shrink-0" /> Spreadsheet Identitas & Desain</li>
                  <li className="flex items-center gap-2"><ListTodo className="h-4 w-4 text-emerald-500 shrink-0" /> Skenario Pengalaman Belajar</li>
                  <li className="flex items-center gap-2"><FileCheck className="h-4 w-4 text-emerald-500 shrink-0" /> Asesmen Observasi & Sumatif</li>
                  <li className="flex items-center gap-2"><HelpCircle className="h-4 w-4 text-emerald-500 shrink-0" /> LKPD Bergradasi + Kunci Jawaban</li>
                </ul>
                <p className="text-[10px] text-slate-400 font-medium italic">Ejaan Bahasa Indonesia Disempurnakan (EID) yang baik dan benar.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Global Error Banner */}
        {error && (
          <div className="bg-rose-50 border-l-4 border-rose-500 p-5 rounded-r-2xl text-rose-800 text-sm shadow-sm flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-rose-500 mt-0.5 shrink-0" />
            <div className="space-y-1">
              <span className="font-bold block text-rose-950">Terjadi Kesalahan Pemrosesan</span>
              <p>{error}</p>
              <button 
                onClick={handleResetForm}
                className="mt-2 text-xs font-semibold text-rose-700 hover:text-rose-900 underline block"
              >
                Coba Ulang Pengisian Formulir
              </button>
            </div>
          </div>
        )}

        {/* Generation loading screen overlay with dynamic progress bar */}
        {loading && (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-8 sm:p-12 text-center max-w-lg mx-auto space-y-6 flex flex-col items-center">
            <div className="relative">
              <div className="h-20 w-20 rounded-full border-4 border-slate-100 border-t-emerald-600 animate-spin flex items-center justify-center">
                <span className="text-sm font-extrabold text-emerald-700 absolute">{progress}%</span>
              </div>
              <Sparkles className="h-6 w-6 text-yellow-400 absolute -top-1 -right-1 animate-bounce" />
            </div>
            
            <div className="space-y-3 w-full">
              <h3 className="text-lg font-extrabold text-slate-800">Sedang Menyusun Dokumen RPM</h3>
              
              {/* Progress Bar */}
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-teal-500 to-emerald-600 h-full rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="min-h-[40px] flex items-center justify-center px-4 bg-slate-50 rounded-xl border border-slate-100 py-2">
                <p className="text-xs text-teal-800 font-semibold animate-pulse">
                  {activeStep}
                </p>
              </div>

              <p className="text-[10px] text-slate-400 max-w-sm mx-auto leading-relaxed pt-1">
                Teknologi optimasi Gemini 3.5 Flash mempercepat penataan rubrik, soal evaluasi, dan modul belajar secara sinkron.
              </p>
            </div>

            <div className="bg-emerald-50 p-3 rounded-xl text-[11px] text-emerald-800 font-medium border border-teal-100 w-full flex items-center justify-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Menyelaraskan Asesmen Formatif, Sumatif, dan LKPD per pertemuan</span>
            </div>
          </div>
        )}

        {/* Core Screen Area */}
        {!loading && (
          <div className="space-y-8">
            {!rpmOutput ? (
              // Form Input Screen
              <RpmForm onSubmit={handleGenerateRpm} loading={loading} />
            ) : (
              // Preview & Export Screen
              <div className="space-y-4" id="rpm_preview_section">
                <div className="flex items-center justify-between">
                  <button
                    onClick={handleResetForm}
                    className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition flex items-center gap-1 shadow-sm cursor-pointer"
                  >
                    <ChevronLeft className="h-4 w-4 text-slate-500" />
                    Kembali & Edit Input
                  </button>
                  <span className="text-xs font-semibold text-slate-500">
                    Selesai Dibuat • Siap Dicetak & Salin
                  </span>
                </div>
                
                {/* Visual Preview Container */}
                {rpmInput && <RpmPreview data={rpmOutput} input={rpmInput} />}
              </div>
            )}
          </div>
        )}

      </main>

      {/* Footer block */}
      <footer className="bg-white border-t border-slate-100 py-6 mt-12 text-xs text-slate-400 text-center">
        <div className="max-w-7xl mx-auto px-4">
          <p className="font-bold text-slate-600">Generator RPM • © 2026</p>
          <p className="mt-1">Dibuat menggunakan standard model kecerdasan buatan terbaik untuk mendampingi guru penggerak Indonesia.</p>
        </div>
      </footer>
    </div>
  );
}
