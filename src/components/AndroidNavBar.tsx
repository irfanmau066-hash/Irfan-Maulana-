import React from 'react';

interface AndroidNavBarProps {
  onBack?: () => void;
  onHome?: () => void;
}

export const AndroidNavBar: React.FC<AndroidNavBarProps> = ({ onBack, onHome }) => {
  return (
    <div className="w-full py-2 flex items-center justify-center bg-slate-900/5 select-none">
      <div className="flex items-center justify-around w-48 py-1">
        {/* Back triangle */}
        <button
          onClick={onBack}
          title="Kembali"
          className="p-2 text-slate-500 hover:text-slate-800 active:scale-90 transition-transform"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
        </button>

        {/* Home circle */}
        <button
          onClick={onHome}
          title="Beranda"
          className="p-2 text-slate-500 hover:text-slate-800 active:scale-90 transition-transform"
        >
          <div className="w-3.5 h-3.5 rounded-full border-2 border-current" />
        </button>

        {/* Recents square */}
        <button
          onClick={onHome}
          title="Aplikasi Terkini"
          className="p-2 text-slate-500 hover:text-slate-800 active:scale-90 transition-transform"
        >
          <div className="w-3 h-3 border-2 border-current rounded-xs" />
        </button>
      </div>
    </div>
  );
};
