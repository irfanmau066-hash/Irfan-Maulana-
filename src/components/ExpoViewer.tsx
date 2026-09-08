import React, { useState } from 'react';
import {
  Copy,
  Check,
  Download,
  Terminal,
  Code2,
  FileCode,
  Layers,
  Smartphone,
} from 'lucide-react';
import {
  EXPO_APP_CODE,
  EXPO_PACKAGE_JSON,
  EXPO_SETUP_STEPS,
  STREAMLIT_TO_EXPO_MAPPING,
} from '../expo/expoSourceCode';

export const ExpoViewer: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'code' | 'steps' | 'mapping'>('code');
  const [codeType, setCodeType] = useState<'app' | 'package'>('app');
  const [copied, setCopied] = useState(false);
  const [copiedCmdIndex, setCopiedCmdIndex] = useState<number | null>(null);

  const currentCode = codeType === 'app' ? EXPO_APP_CODE : EXPO_PACKAGE_JSON;
  const fileName = codeType === 'app' ? 'App.tsx' : 'package.json';

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(currentCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  const handleCopyCommand = async (cmd: string, index: number) => {
    try {
      await navigator.clipboard.writeText(cmd);
      setCopiedCmdIndex(index);
      setTimeout(() => setCopiedCmdIndex(null), 2000);
    } catch {
      // fallback
    }
  };

  const handleDownloadFile = () => {
    const blob = new Blob([currentCode], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full p-4 flex flex-col space-y-4">
      {/* Expo Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 text-white p-4 rounded-2xl border border-slate-700 shadow-md">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#008577] flex items-center justify-center text-white shadow-inner font-bold text-sm">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white tracking-tight">
                  Proyek Mobile Expo (React Native)
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-teal-400/20 text-teal-300 border border-teal-400/30">
                  Expo SDK 52
                </span>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Konversi 100% dari kode Streamlit Python ke React Native Expo + Ekspor Excel
              </p>
            </div>
          </div>
        </div>

        {/* Sub-nav Pill buttons */}
        <div className="mt-4 flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveSubTab('code')}
            className={`flex-1 py-1.5 px-2.5 rounded-lg font-semibold text-[11px] flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeSubTab === 'code'
                ? 'bg-[#008577] text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Kode Sumber</span>
          </button>
          <button
            onClick={() => setActiveSubTab('steps')}
            className={`flex-1 py-1.5 px-2.5 rounded-lg font-semibold text-[11px] flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeSubTab === 'steps'
                ? 'bg-[#008577] text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Cara Menjalankan</span>
          </button>
          <button
            onClick={() => setActiveSubTab('mapping')}
            className={`flex-1 py-1.5 px-2.5 rounded-lg font-semibold text-[11px] flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeSubTab === 'mapping'
                ? 'bg-[#008577] text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Streamlit &rarr; Expo</span>
          </button>
        </div>
      </div>

      {/* Subtab 1: Code Viewer */}
      {activeSubTab === 'code' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          {/* File Selector & Actions */}
          <div className="bg-slate-100 p-2.5 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCodeType('app')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  codeType === 'app'
                    ? 'bg-white text-[#008577] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                App.tsx
              </button>
              <button
                onClick={() => setCodeType('package')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  codeType === 'package'
                    ? 'bg-white text-[#008577] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                package.json
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleCopyCode}
                className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                title="Salin kode"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span>Salin</span>
                  </>
                )}
              </button>

              <button
                onClick={handleDownloadFile}
                className="p-1 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 transition-colors cursor-pointer shadow-2xs"
                title={`Unduh ${fileName}`}
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Syntax Highlighted Box */}
          <div className="relative">
            <pre className="p-4 bg-slate-900 text-slate-100 text-[11px] font-mono leading-relaxed overflow-x-auto max-h-[460px] select-all">
              <code>{currentCode}</code>
            </pre>
          </div>

          <div className="p-3 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
            <span>
              File siap digunakan pada project Expo React Native dengan library <code>xlsx</code>, <code>expo-file-system</code>, dan <code>expo-sharing</code>.
            </span>
          </div>
        </div>
      )}

      {/* Subtab 2: Quick Start Steps */}
      {activeSubTab === 'steps' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
          <div className="pb-2 border-b border-slate-100">
            <h4 className="text-xs font-bold text-slate-800">
              Panduan Menjalankan di Expo Go (HP Android / iPhone)
            </h4>
            <p className="text-[11px] text-slate-500">
              Ikuti 5 langkah mudah berikut di komputer Anda:
            </p>
          </div>

          <div className="space-y-3">
            {EXPO_SETUP_STEPS.map((step, idx) => (
              <div
                key={step.step}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#008577] text-white text-[10px] font-bold flex items-center justify-center">
                      {step.step}
                    </span>
                    <h5 className="text-xs font-bold text-slate-800">
                      {step.title}
                    </h5>
                  </div>

                  {step.command.startsWith('npx') || step.command.startsWith('cd') ? (
                    <button
                      onClick={() => handleCopyCommand(step.command, idx)}
                      className="px-2 py-0.5 rounded-md bg-white hover:bg-slate-100 border border-slate-200 text-[10px] font-semibold text-slate-600 flex items-center gap-1 cursor-pointer"
                      title="Salin perintah"
                    >
                      {copiedCmdIndex === idx ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-700">Tersalin</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-slate-400" />
                          <span>Salin</span>
                        </>
                      )}
                    </button>
                  ) : null}
                </div>

                <p className="text-[11px] text-slate-500 pl-7">
                  {step.desc}
                </p>

                <div className="ml-7 bg-slate-900 text-emerald-300 p-2 rounded-lg font-mono text-[11px] select-all flex items-center justify-between">
                  <code>{step.command}</code>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
            <Smartphone className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed">
              <p className="font-semibold text-amber-900">Tips Expo Go:</p>
              <p className="text-amber-800 mt-0.5">
                Install aplikasi <strong>Expo Go</strong> dari Google Play Store di HP Android Anda. Setelah menjalankan <code className="bg-amber-100/80 px-1 py-0.5 rounded">npx expo start</code>, scan QR code yang muncul di terminal menggunakan kamera atau aplikasi Expo Go untuk langsung menjalankan aplikasi secara live!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Subtab 3: Streamlit to Expo Mapping */}
      {activeSubTab === 'mapping' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
          <div className="pb-2 border-b border-slate-100">
            <h4 className="text-xs font-bold text-slate-800">
              Kamus Konversi: Streamlit Python &rarr; Expo (React Native)
            </h4>
            <p className="text-[11px] text-slate-500">
              Berikut padanan setiap fitur dan logika Python Streamlit ke kode React Native Expo
            </p>
          </div>

          <div className="space-y-2.5">
            {STREAMLIT_TO_EXPO_MAPPING.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                  <span className="w-4 h-4 rounded bg-teal-100 text-teal-800 text-[10px] flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span>{item.feature}</span>
                </div>

                <div className="grid grid-cols-1 gap-2 text-[11px]">
                  <div className="bg-rose-50/70 border border-rose-200/60 p-2 rounded-lg font-mono text-rose-900">
                    <span className="text-[10px] uppercase font-bold text-rose-500 block mb-0.5">
                      Streamlit Python:
                    </span>
                    <code>{item.streamlitCode}</code>
                  </div>

                  <div className="bg-emerald-50/70 border border-emerald-200/60 p-2 rounded-lg font-mono text-emerald-900">
                    <span className="text-[10px] uppercase font-bold text-emerald-600 block mb-0.5">
                      Expo React Native:
                    </span>
                    <code>{item.expoEquivalent}</code>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
