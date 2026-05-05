import React from 'react';
import { LayoutDashboard, PenTool, BookOpen, Settings, GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { View } from '@/types';

interface NavigationProps {
  currentView: View;
  onViewChange: (view: View) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'generator', label: 'AI Generator', icon: PenTool },
  { id: 'materi', label: 'Materi', icon: BookOpen },
  { id: 'settings', label: 'Settings', icon: Settings },
] as const;

export default function Navigation({ currentView, onViewChange }: NavigationProps) {
  return (
    <aside className="w-64 bg-[#F5F2ED] border-r border-[#E5E1D9] h-screen flex flex-col sticky top-0">
      <div className="p-8 flex items-center gap-3">
        <div className="bg-[#5A6348] p-2.5 rounded-xl shadow-lg shadow-[#5A6348]/20">
          <GraduationCap className="w-5 h-5 text-white" />
        </div>
        <h1 className="font-bold text-xl text-[#2D2C2A] tracking-tight">EduKit</h1>
      </div>

      <nav className="flex-1 px-4 py-2 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                isActive 
                  ? "bg-white text-[#5A6348] shadow-sm ring-1 ring-[#E5E1D9]" 
                  : "text-[#8C8881] hover:bg-[#EAE7E2] hover:text-[#43423E]"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive ? "text-[#5A6348]" : "text-[#A8A49C]")} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-6 border-t border-[#E5E1D9]">
        <div className="bg-[#EAE7E2] rounded-2xl p-4">
          <p className="text-[10px] font-bold text-[#8C8881] uppercase tracking-wider mb-2">Penyimpanan</p>
          <div className="w-full bg-[#D9D4CD] h-1.5 rounded-full overflow-hidden mb-2">
            <div className="bg-[#5A6348] h-full w-2/3"></div>
          </div>
          <p className="text-[10px] text-[#6B6862]">1.2 GB dari 2.0 GB digunakan</p>
        </div>
      </div>
    </aside>
  );
}
