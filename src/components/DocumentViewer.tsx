import React, { useState } from 'react';
import { X, Download, Copy, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { ModulAjar } from '@/types';
import { motion } from 'motion/react';

interface DocumentViewerProps {
  document: ModulAjar;
  onClose: () => void;
}

export default function DocumentViewer({ document, onClose }: DocumentViewerProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(document.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2D2C2A]/40 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="bg-[#FDFCFB] w-full max-w-5xl h-[92vh] rounded-[3rem] shadow-2xl flex flex-col overflow-hidden border border-[#E5E1D9]"
      >
        {/* Header */}
        <div className="p-8 border-b border-[#F5F2ED] flex items-center justify-between bg-white relative z-10">
          <div>
            <h3 className="text-2xl font-semibold text-[#2D2C2A]">{document.title}</h3>
            <p className="text-sm text-[#8C8881]">{document.subject} • Kelas {document.grade} • {document.curriculum}</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleCopy}
              className="p-3 text-[#A8A49C] hover:text-[#5A6348] hover:bg-[#F5F2ED] rounded-xl transition-all border border-transparent hover:border-[#E5E1D9]"
              title="Copy to clipboard"
            >
              {copied ? <Check className="w-5 h-5 text-[#5A6348]" /> : <Copy className="w-5 h-5" />}
            </button>
            <button className="p-3 text-[#A8A49C] hover:text-[#C27D56] hover:bg-[#FAF4F0] rounded-xl transition-all border border-transparent hover:border-[#E5E1D9]" title="Download PDF">
              <Download className="w-5 h-5" />
            </button>
            <div className="w-px h-8 bg-[#E5E1D9] mx-2"></div>
            <button 
              onClick={onClose}
              className="p-2.5 bg-[#F5F2ED] hover:bg-[#EAE7E2] text-[#2D2C2A] rounded-full transition-all border border-[#E5E1D9]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-12 bg-white flex justify-center">
          <div className="max-w-3xl w-full markdown-body">
            <ReactMarkdown>{document.content}</ReactMarkdown>
          </div>
        </div>
        
        {/* Footer */}
        <div className="p-6 border-t border-[#F5F2ED] bg-[#FDFCFB] text-center">
          <p className="text-[10px] font-bold text-[#A8A49C] uppercase tracking-[0.3em]">Arsip Digital EduKit • {new Date().getFullYear()}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
