import React, { useMemo, useState } from 'react';
import {
  Users,
  Wallet,
  TrendingUp,
  Award,
  Calendar,
  ChevronRight,
  UserPlus,
  FileSpreadsheet,
  BarChart3,
  Sparkles,
} from 'lucide-react';
import { Consumer } from '../types';
import { formatRupiah } from '../utils/excel';

interface DashboardViewProps {
  consumers: Consumer[];
  onGoToInput: () => void;
  onGoToLaporan: () => void;
}

const MONTH_NAMES_ID: Record<string, string> = {
  '01': 'Januari',
  '02': 'Februari',
  '03': 'Maret',
  '04': 'April',
  '05': 'Mei',
  '06': 'Juni',
  '07': 'Juli',
  '08': 'Agustus',
  '09': 'September',
  '10': 'Oktober',
  '11': 'November',
  '12': 'Desember',
};

export const DashboardView: React.FC<DashboardViewProps> = ({
  consumers,
  onGoToInput,
  onGoToLaporan,
}) => {
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  // Metrik Ringkasan (Total Konsumen & Total Pinjaman)
  const totalKonsumen = consumers.length;
  const totalPinjaman = useMemo(() => {
    return consumers.reduce((acc, curr) => acc + (curr.pinjaman || 0), 0);
  }, [consumers]);

  const rataRataPinjaman = totalKonsumen > 0 ? Math.round(totalPinjaman / totalKonsumen) : 0;

  // Group by Month for "Grafik Performa Pinjaman Bulanan"
  // df["Bulan"] = pd.to_datetime(df["Tanggal"]).dt.strftime('%B')
  // grafik_data = df.groupby("Bulan")["Pinjaman"].sum().reset_index()
  const monthlyData = useMemo(() => {
    const map: Record<string, { monthKey: string; monthLabel: string; total: number; count: number; consumers: Consumer[] }> = {};

    consumers.forEach((c) => {
      if (!c.tanggal) return;
      const parts = c.tanggal.split('-');
      if (parts.length >= 2) {
        const yearMonth = `${parts[0]}-${parts[1]}`;
        const monthNum = parts[1];
        const monthName = MONTH_NAMES_ID[monthNum] || `Bulan ${monthNum}`;
        const label = `${monthName} ${parts[0]}`;

        if (!map[yearMonth]) {
          map[yearMonth] = {
            monthKey: yearMonth,
            monthLabel: label,
            total: 0,
            count: 0,
            consumers: [],
          };
        }
        map[yearMonth].total += c.pinjaman || 0;
        map[yearMonth].count += 1;
        map[yearMonth].consumers.push(c);
      }
    });

    return Object.values(map).sort((a, b) => a.monthKey.localeCompare(b.monthKey));
  }, [consumers]);

  const maxMonthTotal = useMemo(() => {
    return monthlyData.reduce((max, item) => Math.max(max, item.total), 0) || 1;
  }, [monthlyData]);

  // Group by Marketing
  const marketingData = useMemo(() => {
    const map: Record<string, { name: string; total: number; count: number }> = {};
    consumers.forEach((c) => {
      const name = c.marketing?.trim() || 'Tanpa Marketing';
      if (!map[name]) {
        map[name] = { name, total: 0, count: 0 };
      }
      map[name].total += c.pinjaman || 0;
      map[name].count += 1;
    });
    return Object.values(map).sort((a, b) => b.total - a.total);
  }, [consumers]);

  const topMarketing = marketingData[0];

  return (
    <div className="w-full p-4 flex flex-col space-y-4">
      {/* Title equivalent to st.title("Dashboard Ringkasan & Performa") */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-teal-700">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Aplikasi Konsumen & Pinjaman</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight mt-0.5">
              Dashboard Ringkasan & Performa
            </h2>
          </div>
          <button
            onClick={onGoToInput}
            className="p-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-[#008577] text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
            title="Tambah Data Konsumen"
          >
            <UserPlus className="w-4 h-4" />
            <span className="hidden sm:inline">Input Data</span>
          </button>
        </div>
      </div>

      {/* Metrik Ringkasan: col1.metric("Total Konsumen"), col2.metric("Total Pinjaman") */}
      <div className="grid grid-cols-2 gap-3">
        {/* Metric 1: Total Konsumen */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span className="font-semibold text-slate-600">Total Konsumen</span>
            <div className="w-7 h-7 rounded-lg bg-teal-50 text-[#008577] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-extrabold text-slate-900">
              {totalKonsumen}
            </span>
            <span className="text-xs text-slate-400 ml-1 font-medium">orang</span>
          </div>
          <p className="text-[11px] text-teal-700 font-medium mt-1">
            Konsumen terdata aktif
          </p>
        </div>

        {/* Metric 2: Total Pinjaman */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span className="font-semibold text-slate-600">Total Pinjaman</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-lg sm:text-xl font-extrabold text-emerald-700 leading-tight">
              {formatRupiah(totalPinjaman)}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Rata-rata {formatRupiah(rataRataPinjaman)}/orang
          </p>
        </div>
      </div>

      {/* Subheader: "Grafik Performa Pinjaman Bulanan" (st.subheader) */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#008577] text-white flex items-center justify-center">
              <BarChart3 className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-xs font-bold text-slate-800">
              Grafik Performa Pinjaman Bulanan
            </h3>
          </div>
          {monthlyData.length > 0 && (
            <span className="text-[10px] font-semibold bg-teal-50 text-teal-800 px-2 py-0.5 rounded-full">
              {monthlyData.length} Periode
            </span>
          )}
        </div>

        {monthlyData.length === 0 ? (
          /* Streamlit empty notice: st.info("Belum ada data untuk ditampilkan pada grafik.") */
          <div className="p-6 rounded-xl bg-blue-50/70 border border-blue-100 text-center">
            <BarChart3 className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <p className="text-xs font-semibold text-blue-900">
              Belum ada data untuk ditampilkan pada grafik.
            </p>
            <p className="text-[11px] text-blue-700 mt-0.5">
              Silakan masukkan data konsumen pertama Anda melalui formulir input.
            </p>
            <button
              onClick={onGoToInput}
              style={{ backgroundColor: '#008577' }}
              className="mt-3 px-3.5 py-1.5 rounded-xl text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-xs hover:brightness-105 cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Input Data Konsumen</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Interactive Visual Bar Chart */}
            <div className="pt-3 pb-1">
              <div className="h-44 flex items-end justify-between gap-3 px-2 border-b border-slate-200">
                {monthlyData.map((m) => {
                  const percentage = Math.max(12, Math.round((m.total / maxMonthTotal) * 100));
                  const isSelected = selectedMonth === m.monthKey;

                  return (
                    <div
                      key={m.monthKey}
                      onClick={() => setSelectedMonth(isSelected ? null : m.monthKey)}
                      className="flex-1 flex flex-col items-center justify-end h-full group cursor-pointer"
                      title={`${m.monthLabel}: ${formatRupiah(m.total)} (${m.count} konsumen)`}
                    >
                      {/* Tooltip / Value on top */}
                      <span className="text-[10px] font-bold text-slate-600 mb-1 opacity-90 group-hover:text-[#008577] transition-colors whitespace-nowrap text-center">
                        Rp {(m.total / 1000000).toFixed(0)} Jt
                      </span>

                      {/* Bar Container */}
                      <div className="w-full max-w-[48px] bg-slate-100 rounded-t-xl overflow-hidden relative flex flex-col justify-end">
                        <div
                          style={{ height: `${percentage}%` }}
                          className={`w-full rounded-t-xl transition-all duration-500 ${
                            isSelected
                              ? 'bg-amber-400 shadow-md ring-2 ring-amber-300'
                              : 'bg-gradient-to-t from-[#008577] to-teal-500 group-hover:from-teal-600 group-hover:to-teal-400'
                          }`}
                        />
                      </div>

                      {/* Label on bottom */}
                      <span className="text-[10px] font-semibold text-slate-600 mt-2 truncate max-w-[65px] text-center">
                        {m.monthLabel.split(' ')[0]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Monthly Breakdown Rows */}
            <div className="space-y-2 pt-1">
              <div className="text-[11px] font-semibold text-slate-500 flex items-center justify-between">
                <span>Rincian Pinjaman Bulanan</span>
                <span className="text-[10px] text-slate-400">Klik grafik untuk filter</span>
              </div>

              {monthlyData.map((m) => {
                const isSelected = selectedMonth === m.monthKey;
                return (
                  <div
                    key={m.monthKey}
                    onClick={() => setSelectedMonth(isSelected ? null : m.monthKey)}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between text-xs ${
                      isSelected
                        ? 'bg-teal-50 border-[#008577] shadow-xs'
                        : 'bg-slate-50/70 border-slate-100 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                      <div>
                        <span className="font-bold text-slate-800">
                          {m.monthLabel}
                        </span>
                        <p className="text-[10px] text-slate-500">
                          {m.count} konsumen disetujui
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-extrabold text-[#008577]">
                        {formatRupiah(m.total)}
                      </span>
                      <p className="text-[10px] text-slate-400">
                        {Math.round((m.total / totalPinjaman) * 100)}% dari total
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Marketing Leaderboard Card */}
      {marketingData.length > 0 && (
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              <h3 className="text-xs font-bold text-slate-800">
                Performa Tim Marketing
              </h3>
            </div>
            {topMarketing && (
              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                Top: {topMarketing.name}
              </span>
            )}
          </div>

          <div className="space-y-2">
            {marketingData.slice(0, 4).map((m, idx) => (
              <div
                key={m.name}
                className="flex items-center justify-between p-2 rounded-xl bg-slate-50/70 text-xs"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${
                      idx === 0
                        ? 'bg-amber-400 text-slate-900 shadow-2xs'
                        : idx === 1
                        ? 'bg-slate-300 text-slate-800'
                        : idx === 2
                        ? 'bg-amber-700 text-white'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <div>
                    <span className="font-bold text-slate-800">{m.name}</span>
                    <p className="text-[10px] text-slate-400">
                      {m.count} kontrak konsumen
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-bold text-slate-800">
                    {formatRupiah(m.total)}
                  </span>
                  <p className="text-[10px] text-teal-700 font-medium">
                    {Math.round((m.total / (totalPinjaman || 1)) * 100)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Action Footer Card */}
      <div className="bg-gradient-to-r from-teal-900 to-slate-900 text-white p-4 rounded-2xl border border-teal-800 shadow-md">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="text-xs font-bold text-white">
              Siap Cetak & Ekspor Laporan?
            </h4>
            <p className="text-[11px] text-teal-200 mt-0.5">
              Seluruh data dapat difilter per tanggal dan diekspor ke format Excel (.xlsx).
            </p>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={onGoToLaporan}
            className="flex-1 py-2 px-3 rounded-xl bg-[#008577] hover:brightness-110 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-teal-200" />
            <span>Buka Laporan & Ekspor</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
