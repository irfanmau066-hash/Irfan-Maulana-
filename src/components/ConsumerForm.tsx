import React, { useState } from 'react';
import {
  User,
  Calendar,
  Wallet,
  Phone,
  Briefcase,
  FileText,
  StickyNote,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Save,
  ChevronRight,
} from 'lucide-react';
import { Consumer } from '../types';
import { formatRupiah } from '../utils/excel';

interface ConsumerFormProps {
  onSaveConsumer: (consumer: Omit<Consumer, 'id' | 'createdAt'>) => void;
  totalSaved: number;
  onGoToLaporan?: () => void;
  onGoToDashboard?: () => void;
}

export const ConsumerForm: React.FC<ConsumerFormProps> = ({
  onSaveConsumer,
  totalSaved,
  onGoToLaporan,
  onGoToDashboard,
}) => {
  const todayStr = new Date().toISOString().slice(0, 10);
  const [tanggal, setTanggal] = useState(todayStr);
  const [nama, setNama] = useState('');
  const [pinjaman, setPinjaman] = useState<number>(10000000);
  const [noHp, setNoHp] = useState('');
  const [marketing, setMarketing] = useState('');
  const [kontrak, setKontrak] = useState('');
  const [note, setNote] = useState('');

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // Streamlit validation: if nama and kontrak:
    if (!nama.trim() || !kontrak.trim()) {
      setErrorMessage('Nama Konsumen dan Nomor Kontrak wajib diisi.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      onSaveConsumer({
        tanggal: tanggal || todayStr,
        nama: nama.trim(),
        pinjaman: Number(pinjaman) || 0,
        noHp: noHp.trim(),
        marketing: marketing.trim(),
        kontrak: kontrak.trim(),
        note: note.trim(),
      });

      setIsSubmitting(false);
      // Streamlit message: st.success("Data konsumen berhasil disimpan!")
      setSuccessMessage('Data konsumen berhasil disimpan!');

      // Reset form
      setNama('');
      setPinjaman(10000000);
      setNoHp('');
      setMarketing('');
      setKontrak('');
      setNote('');

      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    }, 300);
  };

  const handleFillSample = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const samples = [
      {
        nama: 'Wahyu Hidayat',
        pinjaman: 25000000,
        noHp: '081233445566',
        marketing: 'Agus Setiawan',
        kontrak: `KTR-2026-${randomNum}`,
        note: 'Pencairan modal kerja bengkel motor',
      },
      {
        nama: 'Sri Wahyuni',
        pinjaman: 15000000,
        noHp: '085788990011',
        marketing: 'Dewi Lestari',
        kontrak: `KTR-2026-${randomNum}`,
        note: 'Jaminan BPKB motor Honda Vario 2022',
      },
      {
        nama: 'Bambang Supriyadi',
        pinjaman: 50000000,
        noHp: '087711224466',
        marketing: 'Rian Saputra',
        kontrak: `KTR-2026-${randomNum}`,
        note: 'Ekspansi cabang resto kuliner, survei oke',
      },
    ];
    const chosen = samples[Math.floor(Math.random() * samples.length)];
    setTanggal(todayStr);
    setNama(chosen.nama);
    setPinjaman(chosen.pinjaman);
    setNoHp(chosen.noHp);
    setMarketing(chosen.marketing);
    setKontrak(chosen.kontrak);
    setNote(chosen.note);
    setErrorMessage(null);
  };

  const handleReset = () => {
    setTanggal(todayStr);
    setNama('');
    setPinjaman(0);
    setNoHp('');
    setMarketing('');
    setKontrak('');
    setNote('');
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const adjustPinjaman = (addition: number) => {
    setPinjaman((prev) => Math.max(0, (prev || 0) + addition));
  };

  return (
    <div className="w-full p-4 flex flex-col space-y-4">
      {/* Form Card Container */}
      <div className="w-full bg-white rounded-2xl shadow-xs border border-slate-100 p-4 sm:p-5">
        {/* Title corresponding to st.title("Formulir Input Data Konsumen") */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-teal-50 text-[#008577] mb-2 shadow-inner">
            <User className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-slate-800 tracking-tight">
            Formulir Input Data Konsumen
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Lengkapi data pinjaman konsumen untuk pencatatan dan laporan
          </p>
        </div>

        {/* Success Alert (st.success("Data konsumen berhasil disimpan!")) */}
        {successMessage && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2.5 animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div className="flex-1">
              <p className="font-bold">{successMessage}</p>
              <p className="text-emerald-700 text-[11px] mt-0.5">
                Data masuk ke database & laporan harian. Total tersimpan: {totalSaved} konsumen.
              </p>
            </div>
          </div>
        )}

        {/* Error Alert (st.error("Nama Konsumen dan Nomor Kontrak wajib diisi.")) */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-center gap-2.5 animate-fadeIn">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <div className="flex-1">
              <p className="font-bold">Gagal Menyimpan Data</p>
              <p className="text-rose-700 text-[11px] mt-0.5">{errorMessage}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* 1. Tanggal (st.date_input("Tanggal")) */}
          <div>
            <label
              htmlFor="formTanggal"
              className="block text-xs font-semibold text-slate-700 mb-1"
            >
              Tanggal
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Calendar className="w-4 h-4" />
              </div>
              <input
                id="formTanggal"
                type="date"
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:bg-white focus:border-[#008577]"
              />
            </div>
          </div>

          {/* 2. Nama Konsumen (st.text_input("Nama Konsumen")) - Required */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label
                htmlFor="formNama"
                className="text-xs font-semibold text-slate-700"
              >
                Nama Konsumen <span className="text-rose-500">*</span>
              </label>
              <span className="text-[10px] text-slate-400 font-medium">Wajib diisi</span>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                id="formNama"
                type="text"
                value={nama}
                onChange={(e) => {
                  setNama(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder="Masukkan nama lengkap konsumen"
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:border-[#008577]"
              />
            </div>
          </div>

          {/* 3. Jumlah Pinjaman (Rp) (st.number_input("Jumlah Pinjaman (Rp)", min_value=0, step=100000)) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label
                htmlFor="formPinjaman"
                className="text-xs font-semibold text-slate-700"
              >
                Jumlah Pinjaman (Rp)
              </label>
              <span className="text-[11px] font-extrabold text-[#008577]">
                {formatRupiah(pinjaman || 0)}
              </span>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Wallet className="w-4 h-4" />
              </div>
              <input
                id="formPinjaman"
                type="number"
                min={0}
                step={100000}
                value={pinjaman === 0 ? '' : pinjaman}
                onChange={(e) => setPinjaman(Number(e.target.value) || 0)}
                placeholder="Contoh: 15000000 (kelipatan 100.000)"
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-semibold placeholder-slate-400 outline-none focus:bg-white focus:border-[#008577]"
              />
            </div>

            {/* Quick Amount Step Buttons */}
            <div className="mt-1.5 flex items-center gap-1.5 overflow-x-auto pb-1 text-[10px]">
              <button
                type="button"
                onClick={() => adjustPinjaman(1000000)}
                className="px-2 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer shrink-0"
              >
                +1 Juta
              </button>
              <button
                type="button"
                onClick={() => adjustPinjaman(5000000)}
                className="px-2 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer shrink-0"
              >
                +5 Juta
              </button>
              <button
                type="button"
                onClick={() => adjustPinjaman(10000000)}
                className="px-2 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer shrink-0"
              >
                +10 Juta
              </button>
              <button
                type="button"
                onClick={() => setPinjaman(25000000)}
                className="px-2 py-1 rounded-md bg-teal-50 hover:bg-teal-100 text-teal-800 font-semibold cursor-pointer shrink-0"
              >
                25 Jt
              </button>
              <button
                type="button"
                onClick={() => setPinjaman(50000000)}
                className="px-2 py-1 rounded-md bg-teal-50 hover:bg-teal-100 text-teal-800 font-semibold cursor-pointer shrink-0"
              >
                50 Jt
              </button>
            </div>
          </div>

          {/* 4. No. HP (st.text_input("No. HP")) */}
          <div>
            <label
              htmlFor="formNoHp"
              className="block text-xs font-semibold text-slate-700 mb-1"
            >
              No. HP / WhatsApp
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Phone className="w-4 h-4" />
              </div>
              <input
                id="formNoHp"
                type="tel"
                value={noHp}
                onChange={(e) => setNoHp(e.target.value)}
                placeholder="Contoh: 081234567890"
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:border-[#008577]"
              />
            </div>
          </div>

          {/* 5. Nama Marketing (st.text_input("Nama Marketing")) */}
          <div>
            <label
              htmlFor="formMarketing"
              className="block text-xs font-semibold text-slate-700 mb-1"
            >
              Nama Marketing
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Briefcase className="w-4 h-4" />
              </div>
              <input
                id="formMarketing"
                type="text"
                value={marketing}
                onChange={(e) => setMarketing(e.target.value)}
                placeholder="Nama petugas / agen marketing"
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:border-[#008577]"
              />
            </div>
          </div>

          {/* 6. Nomor Kontrak (st.text_input("Nomor Kontrak")) - Required */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label
                htmlFor="formKontrak"
                className="text-xs font-semibold text-slate-700"
              >
                Nomor Kontrak <span className="text-rose-500">*</span>
              </label>
              <span className="text-[10px] text-slate-400 font-medium">Wajib diisi</span>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <FileText className="w-4 h-4" />
              </div>
              <input
                id="formKontrak"
                type="text"
                value={kontrak}
                onChange={(e) => {
                  setKontrak(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder="Contoh: KTR-2026-0901"
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-mono placeholder-slate-400 outline-none focus:bg-white focus:border-[#008577]"
              />
            </div>
          </div>

          {/* 7. Note / Catatan (st.text_area("Note / Catatan")) */}
          <div>
            <label
              htmlFor="formNote"
              className="block text-xs font-semibold text-slate-700 mb-1"
            >
              Note / Catatan
            </label>
            <div className="relative">
              <div className="absolute top-2.5 left-3 pointer-events-none text-slate-400">
                <StickyNote className="w-4 h-4" />
              </div>
              <textarea
                id="formNote"
                rows={2}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Catatan tambahan (jaminan, status survei, pencairan, dll.)"
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:border-[#008577] resize-none"
              />
            </div>
          </div>

          {/* Submit Button (st.form_submit_button("Simpan Data")) */}
          <div className="pt-2">
            <button
              id="submitBtn"
              type="submit"
              disabled={isSubmitting}
              style={{ backgroundColor: '#008577' }}
              className="w-full py-3 px-4 rounded-xl text-white font-bold text-xs shadow-md hover:brightness-105 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Simpan Data</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Action buttons: Sample data & Reset */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={handleFillSample}
            className="flex items-center gap-1 text-teal-700 hover:text-teal-900 font-semibold py-1 px-2 rounded-lg hover:bg-teal-50 transition-colors cursor-pointer"
            title="Isi form dengan data simulasi"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Isi Contoh Data</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1 text-slate-500 hover:text-slate-800 font-medium py-1 px-2 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Bersihkan</span>
          </button>
        </div>
      </div>

      {/* Navigation Card */}
      {onGoToLaporan && (
        <div className="p-3.5 rounded-xl bg-teal-50/70 border border-teal-100 text-teal-900 text-xs flex items-center justify-between">
          <div>
            <p className="font-bold text-teal-900">Total {totalSaved} Konsumen Terdata</p>
            <p className="text-[11px] text-teal-700">Lihat seluruh rekapan di menu Laporan</p>
          </div>
          <button
            onClick={onGoToLaporan}
            className="px-2.5 py-1.5 rounded-lg bg-[#008577] text-white text-[11px] font-bold flex items-center gap-1 hover:brightness-110 cursor-pointer shadow-2xs"
          >
            <span>Lihat Laporan</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
};
