import React, { useState, useEffect, useCallback } from 'react';
import { Consumer, ActiveTab } from './types';
import { INITIAL_CONSUMERS } from './data/initialData';
import { exportConsumersToExcel } from './utils/excel';
import { AndroidFrame } from './components/AndroidFrame';
import { ConsumerAppBar } from './components/ConsumerAppBar';
import { DashboardView } from './components/DashboardView';
import { ConsumerForm } from './components/ConsumerForm';
import { ConsumerList } from './components/ConsumerList';
import { ExpoViewer } from './components/ExpoViewer';
import { CheckCircle2, AlertCircle, FileSpreadsheet } from 'lucide-react';

const STORAGE_KEY = 'konsumen_pinjaman_app_v2';

export default function App() {
  const [consumers, setConsumers] = useState<Consumer[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return INITIAL_CONSUMERS;
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    subMessage?: string;
    type: 'success' | 'error' | 'info';
  }>({
    show: false,
    message: '',
    type: 'success',
  });

  // Persist consumers to localStorage whenever changed
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(consumers));
    } catch (e) {
      console.error('Failed to persist consumers data', e);
    }
  }, [consumers]);

  const showToast = useCallback(
    (message: string, subMessage?: string, type: 'success' | 'error' | 'info' = 'success') => {
      setToast({ show: true, message, subMessage, type });
      setTimeout(() => {
        setToast((prev) => ({ ...prev, show: false }));
      }, 4500);
    },
    []
  );

  // Handle saving consumer from form
  const handleSaveConsumer = (
    consumerData: Omit<Consumer, 'id' | 'createdAt'>
  ) => {
    const newConsumer: Consumer = {
      ...consumerData,
      id: `c-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
    };

    const updated = [newConsumer, ...consumers];
    setConsumers(updated);

    showToast(
      'Data Konsumen Berhasil Disimpan!',
      `Data ${consumerData.nama} (${consumerData.kontrak}) telah ditambahkan.`,
      'success'
    );
  };

  const handleUpdateConsumer = (updatedConsumer: Consumer) => {
    setConsumers((prev) =>
      prev.map((c) => (c.id === updatedConsumer.id ? updatedConsumer : c))
    );
    showToast(
      'Data Diperbarui',
      `Perubahan pada ${updatedConsumer.nama} telah disimpan.`,
      'success'
    );
  };

  const handleDeleteConsumer = (id: string) => {
    const target = consumers.find((c) => c.id === id);
    setConsumers((prev) => prev.filter((c) => c.id !== id));
    showToast(
      'Data Dihapus',
      target ? `Data ${target.nama} telah dihapus.` : undefined,
      'info'
    );
  };

  const handleClearAll = () => {
    setConsumers([]);
    showToast('Semua Data Telah Dikosongkan', undefined, 'info');
  };

  const handleImportConsumers = (imported: Consumer[]) => {
    setConsumers((prev) => [...imported, ...prev]);
    showToast(
      'Impor Excel Berhasil!',
      `${imported.length} data konsumen berhasil ditambahkan.`,
      'success'
    );
  };

  const handleExportAll = () => {
    if (consumers.length === 0) {
      showToast(
        'Tidak Ada Data',
        'Silakan masukkan data konsumen terlebih dahulu.',
        'error'
      );
      return;
    }

    try {
      const fileName = 'laporan_konsumen.xlsx';
      exportConsumersToExcel(consumers, fileName);
      showToast(
        'Laporan Excel Berhasil Diunduh!',
        `${consumers.length} data konsumen diekspor ke ${fileName}.`,
        'success'
      );
    } catch (e) {
      showToast('Gagal Mengunduh Excel', (e as Error).message, 'error');
    }
  };

  return (
    <AndroidFrame
      onBack={() => {
        if (activeTab !== 'dashboard') {
          setActiveTab('dashboard');
        }
      }}
      onHome={() => setActiveTab('dashboard')}
    >
      {/* Android Top App Bar with Tabs */}
      <ConsumerAppBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        consumerCount={consumers.length}
        onExportAll={handleExportAll}
      />

      {/* Screen Content based on Active Tab */}
      <main className="flex-1 pb-6">
        {activeTab === 'dashboard' ? (
          <DashboardView
            consumers={consumers}
            onGoToInput={() => setActiveTab('form')}
            onGoToLaporan={() => setActiveTab('laporan')}
          />
        ) : activeTab === 'form' ? (
          <ConsumerForm
            onSaveConsumer={handleSaveConsumer}
            totalSaved={consumers.length}
            onGoToLaporan={() => setActiveTab('laporan')}
            onGoToDashboard={() => setActiveTab('dashboard')}
          />
        ) : activeTab === 'laporan' ? (
          <ConsumerList
            consumers={consumers}
            onDeleteConsumer={handleDeleteConsumer}
            onUpdateConsumer={handleUpdateConsumer}
            onClearAll={handleClearAll}
            onImportConsumers={handleImportConsumers}
            onExportAll={handleExportAll}
            onGoToForm={() => setActiveTab('form')}
          />
        ) : (
          <ExpoViewer />
        )}
      </main>

      {/* Android Bottom Toast / Snackbar */}
      {toast.show && (
        <div className="absolute bottom-14 left-4 right-4 z-50 animate-bounce-short">
          <div
            className={`px-4 py-3 rounded-2xl shadow-xl border flex items-start gap-3 text-xs ${
              toast.type === 'success'
                ? 'bg-slate-900/95 text-white border-teal-500/40 backdrop-blur-md'
                : toast.type === 'error'
                ? 'bg-rose-900/95 text-white border-rose-500/40 backdrop-blur-md'
                : 'bg-slate-900/95 text-white border-slate-700/60 backdrop-blur-md'
            }`}
          >
            {toast.type === 'success' ? (
              <FileSpreadsheet className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : toast.type === 'error' ? (
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-teal-300 shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <p className="font-bold text-white text-xs">{toast.message}</p>
              {toast.subMessage && (
                <p className="text-slate-300 text-[11px] mt-0.5 leading-tight">
                  {toast.subMessage}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </AndroidFrame>
  );
}
