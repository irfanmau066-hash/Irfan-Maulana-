import React, { useState } from 'react';
import { Smartphone, Monitor } from 'lucide-react';
import { AndroidStatusBar } from './AndroidStatusBar';
import { AndroidNavBar } from './AndroidNavBar';

interface AndroidFrameProps {
  children: React.ReactNode;
  onBack?: () => void;
  onHome?: () => void;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({
  children,
  onBack,
  onHome,
}) => {
  const [isDeviceFrame, setIsDeviceFrame] = useState(true);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-900 flex flex-col items-center justify-start sm:p-6 p-0 font-sans selection:bg-teal-500 selection:text-white">
      {/* Top Bar Switcher (Device Frame vs Full View) */}
      <div className="w-full max-w-md mx-auto mb-3 px-4 pt-2 hidden sm:flex items-center justify-between text-xs text-slate-400 select-none">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-slate-300">Android Mobile Simulator</span>
        </div>

        <div className="flex items-center bg-slate-800 p-0.5 rounded-lg border border-slate-700">
          <button
            onClick={() => setIsDeviceFrame(true)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all text-[11px] font-medium cursor-pointer ${
              isDeviceFrame
                ? 'bg-[#008577] text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Tampilkan Frame Smartphone Android"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Frame HP</span>
          </button>
          <button
            onClick={() => setIsDeviceFrame(false)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all text-[11px] font-medium cursor-pointer ${
              !isDeviceFrame
                ? 'bg-[#008577] text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Tampilan Penuh Layar"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Layar Penuh</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div
        className={`w-full transition-all duration-300 ${
          isDeviceFrame
            ? 'max-w-[420px] bg-slate-800 rounded-[44px] p-3 shadow-2xl border-4 border-slate-700 relative'
            : 'max-w-2xl bg-slate-100 min-h-screen sm:rounded-2xl sm:shadow-lg sm:border sm:border-slate-200'
        }`}
      >
        {isDeviceFrame && (
          <>
            {/* Speaker & Front Camera Notch */}
            <div className="absolute top-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5">
              <div className="w-12 h-1 rounded-full bg-slate-900/60" />
              <div className="w-3 h-3 rounded-full bg-slate-950 border border-slate-800/80 flex items-center justify-center">
                <div className="w-1 h-1 rounded-full bg-blue-950/60" />
              </div>
            </div>

            {/* Hardware buttons on side */}
            <div className="absolute -left-4.5 top-28 w-1 h-12 bg-slate-700 rounded-l-md" />
            <div className="absolute -left-4.5 top-44 w-1 h-12 bg-slate-700 rounded-l-md" />
            <div className="absolute -right-4.5 top-32 w-1 h-16 bg-slate-700 rounded-r-md" />
          </>
        )}

        {/* Screen Area */}
        <div
          className={`w-full overflow-hidden bg-slate-50 flex flex-col ${
            isDeviceFrame
              ? 'rounded-[36px] min-h-[760px] max-h-[850px] shadow-inner relative'
              : 'min-h-screen'
          }`}
        >
          {/* Android Status Bar */}
          <div className="bg-[#008577] text-white">
            <AndroidStatusBar dark={true} />
          </div>

          {/* Scrollable Screen Content */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden relative flex flex-col">
            {children}
          </div>

          {/* Android Bottom Navigation */}
          <AndroidNavBar onBack={onBack} onHome={onHome} />
        </div>
      </div>
    </div>
  );
};
