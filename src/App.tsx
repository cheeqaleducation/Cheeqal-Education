import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import Generator from './components/Generator';
import DocumentViewer from './components/DocumentViewer';
import { View, ModulAjar } from './types';
import { AnimatePresence, motion } from 'motion/react';
import { Bell, User, Search, LogOut, LogIn, GraduationCap } from 'lucide-react';
import { useAuth } from './components/AuthProvider';
import { fetchDocuments, saveDocument, removeDocument, validateConnection } from './services/firebaseService';

export default function App() {
  const { user, loading: authLoading, login, logout } = useAuth();
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [documents, setDocuments] = useState<ModulAjar[]>([]);
  const [viewingDoc, setViewingDoc] = useState<ModulAjar | null>(null);
  const [dataLoading, setDataLoading] = useState(false);

  useEffect(() => {
    validateConnection();
  }, []);

  // Load documents from Firestore when user logs in
  useEffect(() => {
    if (user) {
      const loadData = async () => {
        setDataLoading(true);
        try {
          const docs = await fetchDocuments();
          setDocuments(docs);
        } catch (error) {
          console.error("Failed to load documents:", error);
        } finally {
          setDataLoading(false);
        }
      };
      loadData();
    } else {
      setDocuments([]);
    }
  }, [user]);

  const handleSaveDoc = async (doc: ModulAjar) => {
    try {
      await saveDocument(doc);
      setDocuments(prev => [doc, ...prev]);
      setCurrentView('dashboard');
    } catch (error) {
      alert("Gagal menyimpan ke cloud. Periksa koneksi Anda.");
    }
  };

  const handleDeleteDoc = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus dokumen ini (permanen)?')) {
      try {
        await removeDocument(id);
        setDocuments(prev => prev.filter(d => d.id !== id));
      } catch (error) {
        alert("Gagal menghapus.");
      }
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center">
        <div className="flex gap-2">
          <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 1 }} className="w-4 h-4 bg-[#5A6348] rounded-full" />
          <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-4 h-4 bg-[#5A6348]/60 rounded-full" />
          <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-4 h-4 bg-[#5A6348]/30 rounded-full" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white border border-[#E5E1D9] rounded-[2.5rem] p-12 shadow-xl shadow-[#5A6348]/5 text-center"
        >
          <div className="inline-flex bg-[#5A6348] p-4 rounded-[1.5rem] mb-8 shadow-lg shadow-[#5A6348]/20 text-white">
            <GraduationCap className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-semibold text-[#2D2C2A] mb-3">EduKit Assistant</h1>
          <p className="text-[#8C8881] mb-10">Selamat datang kembali. Masuk dengan akun Google untuk sinkronisasi perangkat pembelajaran Anda secara otomatis.</p>
          
          <button 
            onClick={login}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-[#F5F2ED] text-[#2D2C2A] py-4 rounded-xl font-bold border border-[#E5E1D9] transition-all"
          >
            <LogIn className="w-5 h-5" />
            Masuk dengan Google
          </button>
          
          <p className="mt-8 text-[10px] font-bold text-[#A8A49C] uppercase tracking-[0.2em]">Penyimpanan Cloud Aktif</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#FDFCFB] font-sans text-[#43423E]">
      <Navigation currentView={currentView} onViewChange={setCurrentView} />
      
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-20 bg-[#FDFCFB]/80 backdrop-blur-md px-10 flex items-center justify-between sticky top-0 z-30">
          <div>
            <h2 className="text-2xl font-semibold text-[#2D2C2A]">Halo, {user.displayName?.split(' ')[0]}!</h2>
            <p className="text-[#8C8881] text-sm">Data Anda tersimpan dengan aman di Cloud Firebase.</p>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative">
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-[#C27D56] rounded-full border-2 border-[#FDFCFB]"></span>
              <Bell className="w-6 h-6 text-[#A8A49C]" />
            </div>
            <div className="flex items-center gap-3 pl-4 border-l border-[#E5E1D9]">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-[#2D2C2A] leading-tight">{user.displayName}</p>
                <button onClick={logout} className="flex items-center gap-1 text-[10px] font-bold text-red-600 uppercase tracking-wider hover:underline">
                  <LogOut className="w-3 h-3" />
                  Logout
                </button>
              </div>
              <button className="w-10 h-10 rounded-2xl border border-[#E5E1D9] shadow-sm overflow-hidden">
                <img src={user.photoURL || ''} alt="User" />
              </button>
            </div>
          </div>
        </header>

        <div className="px-10 py-6 pb-20">
          {dataLoading && documents.length === 0 ? (
             <div className="flex justify-center py-20">
               <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-8 h-8 border-4 border-[#5A6348]/10 border-t-[#5A6348] rounded-full" />
             </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentView}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {currentView === 'dashboard' && (
                  <Dashboard 
                    documents={documents} 
                    onNew={() => setCurrentView('generator')} 
                    onDelete={handleDeleteDoc}
                    onView={setViewingDoc}
                  />
                )}
                {currentView === 'generator' && (
                  <Generator onSave={handleSaveDoc} />
                )}
                {currentView === 'materi' && (
                  <div className="flex flex-col items-center justify-center py-32 text-center">
                    <div className="bg-[#F5F2ED] p-8 rounded-[2.5rem] mb-6 shadow-inner border border-[#E5E1D9]">
                      <Search className="w-16 h-16 text-[#D9D4CD]" />
                    </div>
                    <h3 className="text-2xl font-semibold text-[#2D2C2A] mb-2">Eksplorasi Materi</h3>
                    <p className="text-[#8C8881] max-w-sm">Fitur perpustakaan materi cerdas sedang dalam tahap sinkronisasi dengan kurikulum terbaru.</p>
                  </div>
                )}
                {currentView === 'settings' && (
                  <div className="max-w-2xl bg-white border border-[#E5E1D9] rounded-[2.5rem] p-10 space-y-10 shadow-sm">
                    <h3 className="text-2xl font-semibold text-[#2D2C2A]">Pengaturan Akun</h3>
                    <div className="space-y-8">
                      <div className="flex items-center gap-8">
                        <div className="w-24 h-24 rounded-3xl bg-[#F5F2ED] flex items-center justify-center border border-[#E5E1D9] overflow-hidden">
                          <img src={user.photoURL || ''} className="w-full h-full object-cover" />
                        </div>
                        <div className="space-y-1">
                          <p className="font-bold text-[#2D2C2A]">{user.displayName}</p>
                          <p className="text-sm text-[#8C8881]">{user.email}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-[#8C8881] uppercase tracking-widest">Nama Lengkap</label>
                          <input type="text" readOnly value={user.displayName || ''} className="w-full px-5 py-3 border border-[#E5E1D9] rounded-xl bg-[#FDFCFB] text-[#A8A49C]" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-[#8C8881] uppercase tracking-widest">Email</label>
                          <input type="text" readOnly value={user.email || ''} className="w-full px-5 py-3 border border-[#E5E1D9] rounded-xl bg-[#FDFCFB] text-[#A8A49C]" />
                        </div>
                      </div>
                      <button onClick={logout} className="px-6 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-bold transition-colors">
                        Keluar dari Akun
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </main>

      <AnimatePresence>
        {viewingDoc && (
          <DocumentViewer document={viewingDoc} onClose={() => setViewingDoc(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
