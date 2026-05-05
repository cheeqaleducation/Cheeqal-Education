import React from 'react';
import { Plus, Search, FileText, Calendar, Users, Eye, Trash2 } from 'lucide-react';
import { ModulAjar } from '@/types';
import { motion } from 'motion/react';

interface DashboardProps {
  documents: ModulAjar[];
  onNew: () => void;
  onDelete: (id: string) => void;
  onView: (doc: ModulAjar) => void;
}

export default function Dashboard({ documents, onNew, onDelete, onView }: DashboardProps) {
  return (
    <div className="space-y-10">
      {/* Header Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Modul Aktif', value: documents.length, icon: FileText, color: 'text-[#5A6348]', bg: 'bg-white', border: 'border-[#E5E1D9]' },
          { label: 'Tugas Masuk', value: '48', icon: Users, color: 'text-[#C27D56]', bg: 'bg-white', border: 'border-[#E5E1D9]' },
          { label: 'Kehadiran', value: '96%', icon: Calendar, color: 'text-[#6B7D8A]', bg: 'bg-white', border: 'border-[#E5E1D9]' },
        ].map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={i} 
            className={`bg-white p-6 rounded-2xl border ${stat.border} shadow-sm flex items-center gap-5`}
          >
            <div className={`p-3 rounded-xl bg-[#F5F2ED]`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#8C8881] uppercase tracking-wider">{stat.label}</p>
              <h4 className="text-3xl font-semibold text-[#2D2C2A]">{stat.value}</h4>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-xl font-semibold text-[#2D2C2A] flex items-center gap-2">
            Perangkat Pembelajaran Terbaru
            <span className="text-xs font-bold text-[#8C8881] bg-[#F5F2ED] px-2.5 py-1 rounded-full border border-[#E5E1D9]">{documents.length}</span>
          </h3>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#A8A49C]" />
              <input 
                type="text" 
                placeholder="Cari modul..." 
                className="pl-9 pr-4 py-2 bg-white border border-[#E5E1D9] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#5A6348]/20 focus:border-[#5A6348] w-full sm:w-64 text-[#43423E]"
              />
            </div>
            <button 
              onClick={onNew}
              className="flex items-center gap-2 bg-[#5A6348] hover:bg-[#4A5438] text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md shadow-[#5A6348]/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              Perangkat Baru
            </button>
          </div>
        </div>

        {documents.length === 0 ? (
          <div className="bg-[#F5F2ED] border-2 border-dashed border-[#D9D4CD] rounded-[2.5rem] p-20 text-center">
            <div className="bg-white w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
              <FileText className="w-8 h-8 text-[#D9D4CD]" />
            </div>
            <h4 className="text-xl font-semibold text-[#2D2C2A] mb-2">Belum ada perangkat</h4>
            <p className="text-[#8C8881] max-w-sm mx-auto mb-8">Mulai dengan membuat perangkat pembelajaran pertama Anda menggunakan AI Generator.</p>
            <button 
              onClick={onNew}
              className="px-8 py-3 bg-[#2D2C2A] text-white rounded-xl text-sm font-semibold hover:bg-[#1A1918] transition-colors shadow-lg"
            >
              Buat Sekarang
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {documents.map((doc, i) => (
              <motion.div
                layoutId={doc.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                key={doc.id}
                className="group bg-[#F5F2ED] border border-transparent rounded-[2rem] p-6 hover:border-[#5A6348] hover:bg-white hover:shadow-xl hover:shadow-[#5A6348]/5 transition-all duration-300 relative overflow-hidden cursor-pointer"
                onClick={() => onView(doc)}
              >
                <div className="absolute top-0 right-0 p-4 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10" onClick={e => e.stopPropagation()}>
                  <button 
                    onClick={() => onView(doc)}
                    className="p-2 bg-white hover:bg-[#F5F2ED] text-[#5A6348] rounded-xl shadow-sm border border-[#E5E1D9]"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => onDelete(doc.id)}
                    className="p-2 bg-white hover:bg-red-50 text-red-600 rounded-xl shadow-sm border border-[#E5E1D9]"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="bg-white w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:bg-[#5A6348] group-hover:text-white transition-colors duration-300">
                  <span className="font-bold text-sm">{doc.subject.substring(0, 3).toUpperCase()}</span>
                </div>
                <h4 className="text-lg font-semibold text-[#2D2C2A] mb-1 line-clamp-1">{doc.title}</h4>
                <p className="text-sm text-[#8C8881] mb-6">{doc.subject} • Kelas {doc.grade} • RPP Lengkap</p>
                
                <div className="flex items-center justify-between pt-5 border-t border-[#D9D4CD]/50">
                  <span className="px-3 py-1 bg-white rounded-full text-[10px] font-bold text-[#5A6348] border border-[#E5E1D9] uppercase tracking-wider">
                    {doc.curriculum}
                  </span>
                  <div className="text-[10px] font-bold text-[#A8A49C] uppercase tracking-[0.15em]">
                    {new Date(doc.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                  </div>
                </div>
              </motion.div>
            ))}
            
            {/* New Doc Trigger Card */}
            <motion.div
              onClick={onNew}
              className="bg-white p-6 rounded-[2rem] border-2 border-dashed border-[#D9D4CD] flex flex-col items-center justify-center text-[#8C8881] hover:bg-[#FDFCFB] hover:border-[#5A6348] cursor-pointer group min-h-[220px] transition-all"
            >
              <div className="w-12 h-12 rounded-full bg-[#F5F2ED] flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-[#5A6348] group-hover:text-white transition-all">
                <Plus className="w-6 h-6" />
              </div>
              <span className="font-semibold">Tambah Perangkat</span>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
