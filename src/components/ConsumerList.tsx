import React, { useState, useRef, useMemo } from 'react';
import {
  Search,
  FileSpreadsheet,
  Trash2,
  Edit2,
  Phone,
  MessageCircle,
  Calendar,
  Briefcase,
  FileText,
  Upload,
  UserPlus,
  AlertTriangle,
  Check,
  X,
  Wallet,
  Layers,
  Filter,
} from 'lucide-react';
import { Consumer } from '../types';
import { formatRupiah, parseExcelFile } from '../utils/excel';

interface ConsumerListProps {
  consumers: Consumer[];
  onDeleteConsumer: (id: string) => void;
  onUpdateConsumer: (consumer: Consumer) => void;
  onClearAll: () => void;
  onImportConsumers: (imported: Consumer[]) => void;
  onExportAll: () => void;
  onGoToForm: () => void;
}

export const ConsumerList: React.FC<ConsumerListProps> = ({
  consumers,
  onDeleteConsumer,
  onUpdateConsumer,
  onClearAll,
  onImportConsumers,
  onExportAll,
  onGoToForm,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Consumer | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filtered Consumers based on search query and optional date filter (Laporan Harian)
  const filteredConsumers = useMemo(() => {
    return consumers.filter((c) => {
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        c.nama.toLowerCase().includes(q) ||
        (c.kontrak && c.kontrak.toLowerCase().includes(q)) ||
        (c.marketing && c.marketing.toLowerCase().includes(q)) ||
        (c.noHp && c.noHp.includes(q)) ||
        (c.note && c.note.toLowerCase().includes(q));

      const matchDate = !dateFilter || c.tanggal === dateFilter;

      return matchQuery && matchDate;
    });
  }, [consumers, searchQuery, dateFilter]);

  const filteredTotalPinjaman = useMemo(() => {
    return filteredConsumers.reduce((acc, curr) => acc + (curr.pinjaman || 0), 0);
  }, [filteredConsumers]);

  const handleStartEdit = (consumer: Consumer) => {
    setEditingId(consumer.id);
    setEditForm({ ...consumer });
  };

  const handleSaveEdit = () => {
    if (editForm && editForm.nama.trim() && editForm.kontrak.trim()) {
      onUpdateConsumer(editForm);
      setEditingId(null);
      setEditForm(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm(null);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsImporting(true);
      const imported = await parseExcelFile(file);
      if (imported.length > 0) {
        onImportConsumers(imported);
        setImportStatus(`Berhasil mengimpor ${imported.length} data konsumen.`);
        setTimeout(() => setImportStatus(null), 4000);
      } else {
        setImportStatus('Tidak ada data valid yang ditemukan pada file.');
        setTimeout(() => setImportStatus(null), 4000);
      }
    } catch {
      setImportStatus('Gagal membaca file Excel. Pastikan format file .xlsx valid.');
      setTimeout(() => setImportStatus(null), 4000);
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const formatWhatsAppNumber = (phone: string): string => {
    let clean = phone.replace(/[^0-9]/g, '');
    if (clean.startsWith('0')) {
      clean = '62' + clean.slice(1);
    } else if (!clean.startsWith('62')) {
      clean = '62' + clean;
    }
    return clean;
  };

  return (
    <div className="w-full p-4 flex flex-col space-y-3.5">
      {/* Title corresponding to st.title("Laporan Harian & Ekspor Data") */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider">
              Rekapitulasi Data
            </span>
            <h2 className="text-base font-bold text-slate-800 tracking-tight">
              Laporan Harian & Ekspor Data
            </h2>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setViewMode(viewMode === 'cards' ? 'table' : 'cards')}
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              title={viewMode === 'cards' ? 'Beralih ke Tabel' : 'Beralih ke Kartu'}
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="text-[11px]">{viewMode === 'cards' ? 'Tabel' : 'Kartu'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* If DataFrame is empty: st.warning("Belum ada data laporan yang tersedia.") */}
      {consumers.length === 0 ? (
        <div className="p-6 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 text-center">
          <AlertTriangle className="w-8 h-8 text-amber-600 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-amber-900">
            Belum ada data laporan yang tersedia.
          </h3>
          <p className="text-xs text-amber-800 mt-1 max-w-xs mx-auto">
            Silakan tambahkan data konsumen melalui formulir input atau impor file Excel.
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <button
              onClick={onGoToForm}
              style={{ backgroundColor: '#008577' }}
              className="px-4 py-2 rounded-xl text-white text-xs font-bold shadow-xs hover:brightness-105 cursor-pointer inline-flex items-center gap-1.5"
            >
              <UserPlus className="w-4 h-4" />
              <span>Input Data Konsumen</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-2 rounded-xl bg-white border border-amber-300 text-amber-900 text-xs font-semibold hover:bg-amber-100 cursor-pointer inline-flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Impor Excel</span>
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Action Toolbar & Filters */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-xs space-y-2.5">
            {/* Download Button (st.download_button: "Unduh Laporan ke Excel", file_name="laporan_konsumen.xlsx") */}
            <div className="flex items-center gap-2">
              <button
                onClick={onExportAll}
                style={{ backgroundColor: '#008577' }}
                className="flex-1 py-2.5 px-3 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs hover:brightness-105 active:scale-98 transition-all cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4 text-teal-200" />
                <span>Unduh Laporan ke Excel</span>
                <span className="bg-teal-900/40 text-teal-100 px-1.5 py-0.2 rounded-md text-[10px]">
                  .xlsx
                </span>
              </button>

              {/* Import Excel Button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isImporting}
                className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                title="Impor dari file Excel (.xlsx)"
              >
                <Upload className="w-3.5 h-3.5 text-slate-600" />
                <span>Impor</span>
              </button>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".xlsx, .xls, .csv"
                className="hidden"
              />
            </div>

            {/* Import Status Message */}
            {importStatus && (
              <div className="p-2 rounded-lg bg-teal-50 border border-teal-200 text-teal-900 text-[11px] flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#008577]" />
                <span>{importStatus}</span>
              </div>
            )}

            {/* Search and Daily Filter (Laporan Harian) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {/* Search */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari nama, kontrak, marketing..."
                  className="w-full pl-8 pr-7 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:border-[#008577]"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Laporan Harian: Date filter */}
              <div className="relative flex items-center gap-1.5">
                <div className="relative flex-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    title="Filter Laporan Harian (Pilih Tanggal)"
                    className="w-full pl-8 pr-2 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 outline-none focus:bg-white focus:border-[#008577]"
                  />
                </div>
                {dateFilter && (
                  <button
                    onClick={() => setDateFilter('')}
                    className="px-2 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] font-medium"
                    title="Tampilkan Semua Tanggal"
                  >
                    Semua
                  </button>
                )}
              </div>
            </div>

            {/* Filter Summary */}
            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
              <span>
                Menampilkan <strong>{filteredConsumers.length}</strong> dari {consumers.length} data
                {dateFilter && ` (Tanggal: ${dateFilter})`}
              </span>
              <span className="font-extrabold text-[#008577]">
                Total: {formatRupiah(filteredTotalPinjaman)}
              </span>
            </div>
          </div>

          {/* List of Consumers (Cards or DataFrame Table) */}
          {filteredConsumers.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-100 p-6 text-center">
              <Filter className="w-6 h-6 text-slate-400 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-700">
                Tidak ada data yang cocok dengan filter.
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Coba sesuaikan kata kunci pencarian atau bersihkan filter tanggal.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setDateFilter('');
                }}
                className="mt-3 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
              >
                Reset Filter
              </button>
            </div>
          ) : viewMode === 'table' ? (
            /* Streamlit DataFrame Table View (st.dataframe(df)) */
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto max-h-[480px]">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-100 sticky top-0 text-slate-700 font-bold border-b border-slate-200 text-[11px]">
                    <tr>
                      <th className="py-2.5 px-3">No</th>
                      <th className="py-2.5 px-3">Tanggal</th>
                      <th className="py-2.5 px-3">Nama Konsumen</th>
                      <th className="py-2.5 px-3">Pinjaman</th>
                      <th className="py-2.5 px-3">No. HP</th>
                      <th className="py-2.5 px-3">Marketing</th>
                      <th className="py-2.5 px-3">Nomor Kontrak</th>
                      <th className="py-2.5 px-3">Note</th>
                      <th className="py-2.5 px-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {filteredConsumers.map((c, idx) => (
                      <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-2 px-3 font-semibold text-slate-400">{idx + 1}</td>
                        <td className="py-2 px-3 whitespace-nowrap text-slate-600 font-mono text-[11px]">
                          {c.tanggal}
                        </td>
                        <td className="py-2 px-3 font-bold text-slate-900 whitespace-nowrap">
                          {c.nama}
                        </td>
                        <td className="py-2 px-3 font-extrabold text-[#008577] whitespace-nowrap">
                          {formatRupiah(c.pinjaman)}
                        </td>
                        <td className="py-2 px-3 whitespace-nowrap text-slate-600">
                          {c.noHp || '-'}
                        </td>
                        <td className="py-2 px-3 whitespace-nowrap text-slate-600">
                          {c.marketing || '-'}
                        </td>
                        <td className="py-2 px-3 whitespace-nowrap font-mono text-[11px] text-slate-700">
                          {c.kontrak}
                        </td>
                        <td className="py-2 px-3 text-slate-500 max-w-[200px] truncate" title={c.note}>
                          {c.note || '-'}
                        </td>
                        <td className="py-2 px-3 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-1">
                            <button
                              onClick={() => handleStartEdit(c)}
                              className="p-1 text-slate-400 hover:text-teal-700"
                              title="Edit"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onDeleteConsumer(c.id)}
                              className="p-1 text-slate-400 hover:text-rose-600"
                              title="Hapus"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* Cards View */
            <div className="space-y-2.5">
              {filteredConsumers.map((c, index) => (
                <div
                  key={c.id}
                  className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-xs hover:border-teal-200 transition-all"
                >
                  {editingId === c.id && editForm ? (
                    /* In-place Edit Form */
                    <div className="space-y-2">
                      <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                        <span className="text-xs font-bold text-[#008577]">
                          Edit Konsumen #{index + 1}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={handleSaveEdit}
                            className="px-2 py-0.5 rounded-md bg-teal-50 text-[#008577] text-xs font-bold flex items-center gap-1"
                          >
                            <Check className="w-3 h-3" />
                            <span>Simpan</span>
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="p-1 rounded-md text-slate-400 hover:text-slate-600"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <label className="text-[10px] text-slate-500 font-semibold">Tanggal</label>
                          <input
                            type="date"
                            value={editForm.tanggal}
                            onChange={(e) =>
                              setEditForm({ ...editForm, tanggal: e.target.value })
                            }
                            className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-500 font-semibold">Nama Konsumen</label>
                          <input
                            type="text"
                            value={editForm.nama}
                            onChange={(e) =>
                              setEditForm({ ...editForm, nama: e.target.value })
                            }
                            className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-500 font-semibold">Pinjaman (Rp)</label>
                          <input
                            type="number"
                            step={100000}
                            value={editForm.pinjaman}
                            onChange={(e) =>
                              setEditForm({ ...editForm, pinjaman: Number(e.target.value) || 0 })
                            }
                            className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-500 font-semibold">Nomor Kontrak</label>
                          <input
                            type="text"
                            value={editForm.kontrak}
                            onChange={(e) =>
                              setEditForm({ ...editForm, kontrak: e.target.value })
                            }
                            className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-500 font-semibold">No. HP</label>
                          <input
                            type="tel"
                            value={editForm.noHp}
                            onChange={(e) =>
                              setEditForm({ ...editForm, noHp: e.target.value })
                            }
                            className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-500 font-semibold">Marketing</label>
                          <input
                            type="text"
                            value={editForm.marketing}
                            onChange={(e) =>
                              setEditForm({ ...editForm, marketing: e.target.value })
                            }
                            className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-500 font-semibold">Note / Catatan</label>
                        <input
                          type="text"
                          value={editForm.note}
                          onChange={(e) =>
                            setEditForm({ ...editForm, note: e.target.value })
                          }
                          className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                        />
                      </div>
                    </div>
                  ) : (
                    /* Normal Card Item */
                    <div>
                      {/* Top bar of Card: Tanggal + Kontrak + Actions */}
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-mono">
                          <Calendar className="w-3.5 h-3.5 text-teal-700" />
                          <span>{c.tanggal}</span>
                          <span className="text-slate-300">•</span>
                          <span className="font-bold text-slate-700 bg-slate-100 px-1.5 py-0.2 rounded">
                            {c.kontrak}
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleStartEdit(c)}
                            className="p-1 text-slate-400 hover:text-teal-700 rounded transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {deleteConfirmId === c.id ? (
                            <div className="flex items-center gap-1 bg-rose-50 px-1.5 py-0.5 rounded-lg border border-rose-200">
                              <button
                                onClick={() => {
                                  onDeleteConsumer(c.id);
                                  setDeleteConfirmId(null);
                                }}
                                className="text-[10px] font-bold text-rose-600 hover:underline"
                              >
                                Hapus?
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(null)}
                                className="text-slate-400 hover:text-slate-600"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirmId(c.id)}
                              className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                              title="Hapus"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Middle: Nama + Pinjaman */}
                      <div className="mt-2 flex items-start justify-between">
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">{c.nama}</h4>
                          <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                            <Briefcase className="w-3 h-3 text-slate-400" />
                            <span>Marketing: {c.marketing || '-'}</span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-sm font-extrabold text-[#008577]">
                            {formatRupiah(c.pinjaman)}
                          </span>
                        </div>
                      </div>

                      {/* Bottom: Note + Phone Action */}
                      <div className="mt-2.5 pt-2 border-t border-slate-50 flex items-center justify-between text-xs">
                        <div className="flex-1 pr-2 truncate text-[11px] text-slate-500">
                          {c.note ? (
                            <span>
                              <strong className="text-slate-600">Note:</strong> {c.note}
                            </span>
                          ) : (
                            <span className="italic text-slate-400">Tidak ada catatan</span>
                          )}
                        </div>

                        {c.noHp && (
                          <div className="flex items-center gap-1.5 shrink-0">
                            {/* WhatsApp Button */}
                            <a
                              href={`https://wa.me/${formatWhatsAppNumber(c.noHp)}?text=Halo%20${encodeURIComponent(c.nama)},%20mengenai%20kontrak%20${encodeURIComponent(c.kontrak)}`}
                              target="_blank"
                              rel="noreferrer"
                              className="px-2 py-0.8 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-semibold flex items-center gap-1 shadow-2xs"
                              title="Hubungi via WhatsApp"
                            >
                              <MessageCircle className="w-3 h-3" />
                              <span>WA</span>
                            </a>

                            {/* Call Button */}
                            <a
                              href={`tel:${c.noHp}`}
                              className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                              title="Panggil Telepon"
                            >
                              <Phone className="w-3 h-3" />
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Clear all footer action */}
          {consumers.length > 0 && (
            <div className="pt-2 text-center">
              <button
                onClick={() => {
                  if (window.confirm('Yakin ingin menghapus semua data konsumen?')) {
                    onClearAll();
                  }
                }}
                className="text-[11px] text-slate-400 hover:text-rose-600 transition-colors inline-flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
                <span>Kosongkan Seluruh Data</span>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
