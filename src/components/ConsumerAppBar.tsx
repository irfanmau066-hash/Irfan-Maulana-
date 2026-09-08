import React from 'react';
import {
  BarChart3,
  UserPlus,
  FileSpreadsheet,
  Code2,
  Download,
} from 'lucide-react';
import { ActiveTab } from '../types';

interface ConsumerAppBarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  consumerCount: number;
  onExportAll: () => void;
}

export const ConsumerAppBar: React.FC<ConsumerAppBarProps> = ({
  activeTab,
  onTabChange,
  consumerCount,
  onExportAll,
}) => {
  return (
    <header className="bg-[#008577] text-white shadow-md select-none sticky top-0 z-30">
      {/* Main Top Header */}
      <div className="px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center border border-white/25 shadow-inner">
            <FileSpreadsheet className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold leading-tight tracking-tight">
              Data & Laporan Konsumen
            </h1>
            <p className="text-[10px] text-teal-100 font-medium">
              Expo React Native & Excel Export
            </p>
          </div>
        </div>

        {/* Quick Export Button */}
        <button
          onClick={onExportAll}
          title="Unduh Laporan ke Excel (.xlsx)"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white text-[11px] font-bold active:scale-95 transition-all shadow-2xs cursor-pointer border border-white/20"
        >
          <Download className="w-3.5 h-3.5 text-emerald-200" />
          <span>Excel</span>
        </button>
      </div>

      {/* Navigation Tabs (Corresponding to Streamlit Menus) */}
      <div className="grid grid-cols-4 border-t border-teal-600/60 bg-[#007468]">
        {/* Menu 1: Menu Utama & Grafik */}
        <button
          onClick={() => onTabChange('dashboard')}
          className={`py-2 px-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-bold transition-all relative cursor-pointer ${
            activeTab === 'dashboard'
              ? 'text-white'
              : 'text-teal-200 hover:text-white'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span className="truncate">Ringkasan</span>
          {activeTab === 'dashboard' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.75 bg-amber-300 rounded-t-full" />
          )}
        </button>

        {/* Menu 2: Input Data Konsumen */}
        <button
          onClick={() => onTabChange('form')}
          className={`py-2 px-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-bold transition-all relative cursor-pointer ${
            activeTab === 'form'
              ? 'text-white'
              : 'text-teal-200 hover:text-white'
          }`}
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span className="truncate">Input Data</span>
          {activeTab === 'form' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.75 bg-amber-300 rounded-t-full" />
          )}
        </button>

        {/* Menu 3: Laporan Harian & Ekspor */}
        <button
          onClick={() => onTabChange('laporan')}
          className={`py-2 px-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-bold transition-all relative cursor-pointer ${
            activeTab === 'laporan'
              ? 'text-white'
              : 'text-teal-200 hover:text-white'
          }`}
        >
          <div className="relative">
            <FileSpreadsheet className="w-3.5 h-3.5" />
            {consumerCount > 0 && (
              <span className="absolute -top-1 -right-2 px-1 py-0.2 rounded-full text-[8px] font-extrabold bg-amber-400 text-slate-900 leading-none">
                {consumerCount}
              </span>
            )}
          </div>
          <span className="truncate">Laporan</span>
          {activeTab === 'laporan' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.75 bg-amber-300 rounded-t-full" />
          )}
        </button>

        {/* Tab 4: Kode Expo (React Native Source & Guide) */}
        <button
          onClick={() => onTabChange('expo')}
          className={`py-2 px-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-bold transition-all relative cursor-pointer ${
            activeTab === 'expo'
              ? 'text-white'
              : 'text-teal-200 hover:text-white'
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span className="truncate">Kode Expo</span>
          {activeTab === 'expo' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.75 bg-amber-300 rounded-t-full" />
          )}
        </button>
      </div>
    </header>
  );
};
