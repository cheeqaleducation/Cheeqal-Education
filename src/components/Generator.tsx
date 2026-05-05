import React, { useState } from 'react';
import { Sparkles, Loader2, Save, Download, FileText, ChevronRight } from 'lucide-react';
import { generateModulAjar } from '@/services/gemini';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import { ModulAjar } from '@/types';

interface GeneratorProps {
  onSave: (doc: ModulAjar) => void;
}

export default function Generator({ onSave }: GeneratorProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    subject: '',
    grade: '',
    topic: '',
    objectives: ''
  });

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const output = await generateModulAjar(formData);
      setResult(output || 'Gagal menghasilkan konten.');
    } catch (error) {
      alert('Terjadi kesalahan saat menghubungi AI.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (!result) return;
    const newDoc: ModulAjar = {
      id: crypto.randomUUID(),
      title: formData.topic || 'Modul Ajar Tanpa Judul',
      subject: formData.subject,
      grade: formData.grade,
      curriculum: 'Kurikulum Merdeka',
      createdAt: new Date().toISOString(),
      content: result
    };
    onSave(newDoc);
    alert('Modul ajar tersimpan!');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-semibold text-[#2D2C2A]">AI Modul Ajar Generator</h2>
        <p className="text-[#8C8881]">Gunakan kecerdasan buatan untuk merancang modul ajar yang komprehensif dalam hitungan detik.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Form Column */}
        <div className="lg:col-span-5 bg-white p-8 rounded-3xl border border-[#E5E1D9] shadow-sm space-y-8">
          <form onSubmit={handleGenerate} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#8C8881] uppercase tracking-wider">Mata Pelajaran</label>
              <input
                required
                type="text"
                placeholder="Misal: Matematika, Bahasa Indonesia"
                className="w-full px-5 py-3 rounded-xl border border-[#E5E1D9] bg-white text-[#43423E] focus:outline-none focus:ring-2 focus:ring-[#5A6348]/10 focus:border-[#5A6348] transition-all"
                value={formData.subject}
                onChange={e => setFormData({ ...formData, subject: e.target.value })}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#8C8881] uppercase tracking-wider">Kelas</label>
                <select
                  required
                  className="w-full px-5 py-3 rounded-xl border border-[#E5E1D9] bg-white text-[#43423E] focus:outline-none focus:ring-2 focus:ring-[#5A6348]/10 focus:border-[#5A6348] transition-all cursor-pointer"
                  value={formData.grade}
                  onChange={e => setFormData({ ...formData, grade: e.target.value })}
                >
                  <option value="">Pilih</option>
                  {[...Array(12)].map((_, i) => (
                    <option key={i} value={`${i+1}`}>{`Kelas ${i+1}`}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-[#8C8881] uppercase tracking-wider">Topik Utama</label>
              <input
                required
                type="text"
                placeholder="Misal: Pecahan Senilai, Puisi Rakyat"
                className="w-full px-5 py-3 rounded-xl border border-[#E5E1D9] bg-white text-[#43423E] focus:outline-none focus:ring-2 focus:ring-[#5A6348]/10 focus:border-[#5A6348] transition-all"
                value={formData.topic}
                onChange={e => setFormData({ ...formData, topic: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-[#8C8881] uppercase tracking-wider">Tujuan Pembelajaran</label>
              <textarea
                rows={4}
                placeholder="Jelaskan target capaian siswa..."
                className="w-full px-5 py-3 rounded-xl border border-[#E5E1D9] bg-white text-[#43423E] focus:outline-none focus:ring-2 focus:ring-[#5A6348]/10 focus:border-[#5A6348] transition-all resize-none"
                value={formData.objectives}
                onChange={e => setFormData({ ...formData, objectives: e.target.value })}
              />
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full bg-[#5A6348] hover:bg-[#4A5438] disabled:bg-[#D9D4CD] text-white font-bold py-4 px-8 rounded-xl shadow-lg shadow-[#5A6348]/20 transition-all duration-200 flex items-center justify-center gap-3"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-white/80" />
                  Rancang Modul Ajar
                </>
              )}
            </button>
          </form>
        </div>

        {/* Result Column */}
        <div className="lg:col-span-7 h-full">
          <AnimatePresence mode="wait">
            {!result && !loading ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full min-h-[500px] border-2 border-dashed border-[#D9D4CD] rounded-3xl flex flex-col items-center justify-center p-12 text-center bg-[#F5F2ED]/50"
              >
                <div className="bg-white p-5 rounded-3xl shadow-sm mb-6">
                  <FileText className="w-10 h-10 text-[#D9D4CD]" />
                </div>
                <h3 className="text-xl font-semibold text-[#2D2C2A] mb-2">Simulasi Rancangan</h3>
                <p className="text-[#8C8881] max-w-sm">Siap untuk merancang perangkat cerdas? Isi parameter untuk mulai melihat keajaiban AI.</p>
              </motion.div>
            ) : loading ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full min-h-[500px] bg-white border border-[#E5E1D9] rounded-3xl p-12 flex flex-col items-center justify-center text-center gap-6"
              >
                <div className="flex gap-2.5">
                  {[0, 1, 2].map(i => (
                    <motion.div 
                      key={i}
                      animate={{ scale: [1, 1.4, 1], opacity: [0.3, 1, 0.3], y: [0, -4, 0] }}
                      transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.2 }}
                      className="w-4 h-4 bg-[#5A6348] rounded-full" 
                    />
                  ))}
                </div>
                <div className="space-y-1">
                  <p className="text-lg font-semibold text-[#2D2C2A]">Menganalisis Kurikulum Merdeka...</p>
                  <p className="text-sm text-[#8C8881]">Merangkai kegiatan pembelajaran yang bermakna.</p>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-[#E5E1D9] rounded-3xl flex flex-col h-[750px] shadow-xl shadow-[#5A6348]/5"
              >
                <div className="p-5 border-b border-[#F5F2ED] flex items-center justify-between bg-white sticky top-0 rounded-t-3xl z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 bg-[#5A6348] rounded-full"></div>
                    <span className="text-[10px] font-bold text-[#8C8881] uppercase tracking-[0.2em]">Capaian AI EduKit</span>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={handleSave}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-[#5A6348] bg-[#F0F2EA] hover:bg-[#E2E6D8] rounded-xl transition-all"
                    >
                      <Save className="w-4 h-4" />
                      Simpan
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-[#C27D56] bg-[#FAF4F0] hover:bg-[#F2E8E0] rounded-xl transition-all">
                      <Download className="w-4 h-4" />
                      PDF
                    </button>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-10 markdown-body custom-scrollbar">
                  <ReactMarkdown>{result}</ReactMarkdown>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
