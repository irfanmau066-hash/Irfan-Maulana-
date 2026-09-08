import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as XLSX from 'xlsx';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

// Tipe Data Konsumen sesuai Streamlit
interface ConsumerData {
  id: string;
  tanggal: string;
  nama: string;
  pinjaman: number;
  noHp: string;
  marketing: string;
  kontrak: string;
  note: string;
}

type TabType = 'dashboard' | 'input' | 'laporan';

const INITIAL_DATA: ConsumerData[] = [
  {
    id: '1',
    tanggal: '2026-07-14',
    nama: 'Budi Santoso',
    pinjaman: 25000000,
    noHp: '081234567890',
    marketing: 'Agus Setiawan',
    kontrak: 'KTR-2026-0701',
    note: 'Pencairan via BCA, tenor 12 bulan',
  },
  {
    id: '2',
    tanggal: '2026-07-28',
    nama: 'Siti Rahmawati',
    pinjaman: 15000000,
    noHp: '085712345678',
    marketing: 'Dewi Lestari',
    kontrak: 'KTR-2026-0745',
    note: 'Usaha warung sembako',
  },
  {
    id: '3',
    tanggal: '2026-08-05',
    nama: 'Ahmad Fauzi',
    pinjaman: 45000000,
    noHp: '087890123456',
    marketing: 'Agus Setiawan',
    kontrak: 'KTR-2026-0812',
    note: 'Jaminan BPKB Mobil',
  },
  {
    id: '4',
    tanggal: '2026-08-18',
    nama: 'Nur Hidayah',
    pinjaman: 20000000,
    noHp: '081399887766',
    marketing: 'Rian Saputra',
    kontrak: 'KTR-2026-0833',
    note: 'Tambahan modal kios',
  },
  {
    id: '5',
    tanggal: '2026-09-02',
    nama: 'Eko Prasetyo',
    pinjaman: 30000000,
    noHp: '082155443322',
    marketing: 'Rian Saputra',
    kontrak: 'KTR-2026-0904',
    note: 'Berkas lengkap dan disetujui',
  },
  {
    id: '6',
    tanggal: '2026-09-08',
    nama: 'Ratna Sari',
    pinjaman: 18000000,
    noHp: '081911223344',
    marketing: 'Agus Setiawan',
    kontrak: 'KTR-2026-0915',
    note: 'Pencairan hari ini',
  },
];

const MONTH_NAMES: Record<string, string> = {
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

function formatRupiah(amount: number): string {
  return `Rp ${amount.toString().replace(/\\B(?=(\\d{3})+(?!\\d))/g, '.')}`;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [dataKonsumen, setDataKonsumen] = useState<ConsumerData[]>(INITIAL_DATA);

  // Form State
  const todayStr = new Date().toISOString().slice(0, 10);
  const [tanggal, setTanggal] = useState(todayStr);
  const [nama, setNama] = useState('');
  const [pinjaman, setPinjaman] = useState('10000000');
  const [noHp, setNoHp] = useState('');
  const [marketing, setMarketing] = useState('');
  const [kontrak, setKontrak] = useState('');
  const [note, setNote] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  // Search & Filter State di Laporan
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  // 1. Metrik Ringkasan
  const totalKonsumen = dataKonsumen.length;
  const totalPinjaman = useMemo(() => {
    return dataKonsumen.reduce((acc, curr) => acc + (curr.pinjaman || 0), 0);
  }, [dataKonsumen]);

  // 2. Grafik Performa Bulanan
  const monthlyData = useMemo(() => {
    const map: Record<string, { monthKey: string; label: string; total: number; count: number }> = {};
    dataKonsumen.forEach((item) => {
      const parts = item.tanggal.split('-');
      if (parts.length >= 2) {
        const key = `${parts[0]}-${parts[1]}`;
        const mName = MONTH_NAMES[parts[1]] || parts[1];
        if (!map[key]) {
          map[key] = { monthKey: key, label: `${mName} ${parts[0]}`, total: 0, count: 0 };
        }
        map[key].total += item.pinjaman || 0;
        map[key].count += 1;
      }
    });
    return Object.values(map).sort((a, b) => a.monthKey.localeCompare(b.monthKey));
  }, [dataKonsumen]);

  const maxMonthTotal = useMemo(() => {
    return monthlyData.reduce((max, curr) => Math.max(max, curr.total), 0) || 1;
  }, [monthlyData]);

  // Handle Simpan Data (Menu 2: Input Data Konsumen)
  const handleSimpanData = () => {
    // Validasi Streamlit: if nama and kontrak:
    if (!nama.trim() || !kontrak.trim()) {
      Alert.alert('Peringatan', 'Nama Konsumen dan Nomor Kontrak wajib diisi.');
      return;
    }

    const numericPinjaman = parseInt(pinjaman.replace(/[^0-9]/g, ''), 10) || 0;

    const newData: ConsumerData = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      tanggal: tanggal || todayStr,
      nama: nama.trim(),
      pinjaman: numericPinjaman,
      noHp: noHp.trim(),
      marketing: marketing.trim(),
      kontrak: kontrak.trim(),
      note: note.trim(),
    };

    setDataKonsumen((prev) => [newData, ...prev]);

    Alert.alert('Sukses', 'Data konsumen berhasil disimpan!', [
      { text: 'OK', onPress: () => {} },
      { text: 'Lihat Laporan', onPress: () => setActiveTab('laporan') },
    ]);

    // Reset Form
    setNama('');
    setPinjaman('10000000');
    setNoHp('');
    setMarketing('');
    setKontrak('');
    setNote('');
  };

  // Handle Ekspor ke Excel (Menu 3: Laporan Harian & Ekspor Data)
  const handleUnduhExcel = async () => {
    if (dataKonsumen.length === 0) {
      Alert.alert('Peringatan', 'Belum ada data laporan yang tersedia.');
      return;
    }

    setIsExporting(true);
    try {
      // 1. Format baris sesuai kolom DataFrame Streamlit
      const rows = dataKonsumen.map((item, index) => ({
        'No': index + 1,
        'Tanggal': item.tanggal,
        'Nama Konsumen': item.nama,
        'Pinjaman': item.pinjaman,
        'No. HP': item.noHp || '-',
        'Nama Marketing': item.marketing || '-',
        'Nomor Kontrak': item.kontrak,
        'Note': item.note || '-',
      }));

      // 2. Buat sheet dan workbook dengan nama sheet 'Laporan'
      const ws = XLSX.utils.json_to_sheet(rows);
      ws['!cols'] = [
        { wch: 6 },
        { wch: 14 },
        { wch: 25 },
        { wch: 18 },
        { wch: 18 },
        { wch: 20 },
        { wch: 20 },
        { wch: 30 },
      ];

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Laporan');

      // 3. Tulis ke file sistem lokal
      const base64 = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' });
      const fileName = 'laporan_konsumen.xlsx';
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;

      await FileSystem.writeAsStringAsync(fileUri, base64, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // 4. Buka dialog bagikan / buka dengan Excel
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          dialogTitle: 'Unduh Laporan ke Excel',
          UTI: 'com.microsoft.excel.xlsx',
        });
      } else {
        Alert.alert('Berhasil', `File disimpan di: ${fileUri}`);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Gagal membuat file Excel.');
    } finally {
      setIsExporting(false);
    }
  };

  // Filter data untuk laporan
  const filteredData = useMemo(() => {
    return dataKonsumen.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        item.nama.toLowerCase().includes(q) ||
        item.kontrak.toLowerCase().includes(q) ||
        item.marketing.toLowerCase().includes(q) ||
        item.noHp.includes(q);

      const matchDate = !dateFilter || item.tanggal === dateFilter;

      return matchQuery && matchDate;
    });
  }, [dataKonsumen, searchQuery, dateFilter]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#008577" />

      {/* Header Utama */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Aplikasi Konsumen & Laporan</Text>
        <Text style={styles.headerSubtitle}>
          {activeTab === 'dashboard'
            ? 'Dashboard Ringkasan & Performa'
            : activeTab === 'input'
            ? 'Formulir Input Data Konsumen'
            : 'Laporan Harian & Ekspor Data'}
        </Text>
      </View>

      {/* Content Area */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        {activeTab === 'dashboard' && (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Metrik Ringkasan (col1 & col2 di Streamlit) */}
            <View style={styles.metricsRow}>
              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>Total Konsumen</Text>
                <Text style={styles.metricValue}>{totalKonsumen}</Text>
                <Text style={styles.metricSub}>Orang terdaftar</Text>
              </View>

              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>Total Pinjaman</Text>
                <Text style={[styles.metricValue, { color: '#008577', fontSize: 16 }]}>
                  {formatRupiah(totalPinjaman)}
                </Text>
                <Text style={styles.metricSub}>Akumulasi disetujui</Text>
              </View>
            </View>

            {/* Subheader: Grafik Performa Pinjaman Bulanan */}
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Grafik Performa Pinjaman Bulanan</Text>

              {monthlyData.length === 0 ? (
                <View style={styles.infoBox}>
                  <Text style={styles.infoText}>Belum ada data untuk ditampilkan pada grafik.</Text>
                </View>
              ) : (
                <View style={styles.chartContainer}>
                  {monthlyData.map((m) => {
                    const pct = Math.max(12, Math.round((m.total / maxMonthTotal) * 100));
                    return (
                      <View key={m.monthKey} style={styles.barColumn}>
                        <Text style={styles.barTopLabel}>
                          {(m.total / 1000000).toFixed(0)} Jt
                        </Text>
                        <View style={styles.barTrack}>
                          <View style={[styles.barFill, { height: `${pct}%` }]} />
                        </View>
                        <Text style={styles.barBottomLabel} numberOfLines={1}>
                          {m.label.split(' ')[0]}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              )}

              {/* Rincian List */}
              <View style={styles.breakdownList}>
                {monthlyData.map((m) => (
                  <View key={m.monthKey} style={styles.breakdownRow}>
                    <Text style={styles.breakdownLabel}>{m.label}</Text>
                    <Text style={styles.breakdownValue}>{formatRupiah(m.total)}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Shortcut Button */}
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={() => setActiveTab('input')}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryBtnText}>+ Input Data Konsumen Baru</Text>
            </TouchableOpacity>
          </ScrollView>
        )}

        {activeTab === 'input' && (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.card}>
              <Text style={styles.formTitle}>Formulir Input Data Konsumen</Text>

              {/* Tanggal */}
              <Text style={styles.fieldLabel}>Tanggal (YYYY-MM-DD)</Text>
              <TextInput
                style={styles.input}
                value={tanggal}
                onChangeText={setTanggal}
                placeholder="2026-09-08"
                placeholderTextColor="#888"
              />

              {/* Nama Konsumen */}
              <Text style={styles.fieldLabel}>Nama Konsumen *</Text>
              <TextInput
                style={styles.input}
                value={nama}
                onChangeText={setNama}
                placeholder="Nama lengkap konsumen"
                placeholderTextColor="#888"
              />

              {/* Jumlah Pinjaman */}
              <View style={styles.rowBetween}>
                <Text style={styles.fieldLabel}>Jumlah Pinjaman (Rp)</Text>
                <Text style={styles.pinjamanPreview}>
                  {formatRupiah(parseInt(pinjaman.replace(/[^0-9]/g, ''), 10) || 0)}
                </Text>
              </View>
              <TextInput
                style={styles.input}
                value={pinjaman}
                onChangeText={setPinjaman}
                keyboardType="numeric"
                placeholder="Contoh: 10000000"
                placeholderTextColor="#888"
              />

              {/* No. HP */}
              <Text style={styles.fieldLabel}>No. HP / WhatsApp</Text>
              <TextInput
                style={styles.input}
                value={noHp}
                onChangeText={setNoHp}
                keyboardType="phone-pad"
                placeholder="081234567890"
                placeholderTextColor="#888"
              />

              {/* Nama Marketing */}
              <Text style={styles.fieldLabel}>Nama Marketing</Text>
              <TextInput
                style={styles.input}
                value={marketing}
                onChangeText={setMarketing}
                placeholder="Petugas marketing"
                placeholderTextColor="#888"
              />

              {/* Nomor Kontrak */}
              <Text style={styles.fieldLabel}>Nomor Kontrak *</Text>
              <TextInput
                style={styles.input}
                value={kontrak}
                onChangeText={setKontrak}
                placeholder="Contoh: KTR-2026-0901"
                placeholderTextColor="#888"
              />

              {/* Note / Catatan */}
              <Text style={styles.fieldLabel}>Note / Catatan</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={note}
                onChangeText={setNote}
                multiline
                numberOfLines={3}
                placeholder="Catatan jaminan atau status verifikasi"
                placeholderTextColor="#888"
              />

              {/* Tombol Simpan */}
              <TouchableOpacity
                style={styles.primaryBtn}
                onPress={handleSimpanData}
                activeOpacity={0.8}
              >
                <Text style={styles.primaryBtnText}>Simpan Data</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}

        {activeTab === 'laporan' && (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Tombol Unduh Laporan ke Excel */}
            <TouchableOpacity
              style={[styles.excelBtn, isExporting && styles.btnDisabled]}
              onPress={handleUnduhExcel}
              disabled={isExporting}
              activeOpacity={0.8}
            >
              <Text style={styles.excelBtnText}>
                {isExporting ? 'Membuat File Excel...' : 'Unduh Laporan ke Excel (.xlsx)'}
              </Text>
            </TouchableOpacity>

            {/* Filter & Search */}
            <View style={styles.filterCard}>
              <Text style={styles.fieldLabel}>Pencarian</Text>
              <TextInput
                style={styles.inputSmall}
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Cari nama, kontrak, marketing..."
                placeholderTextColor="#888"
              />

              <Text style={[styles.fieldLabel, { marginTop: 8 }]}>Filter Tanggal Harian</Text>
              <TextInput
                style={styles.inputSmall}
                value={dateFilter}
                onChangeText={setDateFilter}
                placeholder="Filter tanggal (cth: 2026-09-08)"
                placeholderTextColor="#888"
              />
            </View>

            {/* Daftar Data Konsumen (DataFrame equivalent) */}
            {dataKonsumen.length === 0 ? (
              <View style={styles.warningBox}>
                <Text style={styles.warningText}>Belum ada data laporan yang tersedia.</Text>
              </View>
            ) : filteredData.length === 0 ? (
              <View style={styles.infoBox}>
                <Text style={styles.infoText}>Tidak ada data yang cocok dengan filter.</Text>
              </View>
            ) : (
              <View style={styles.listContainer}>
                {filteredData.map((item, index) => (
                  <View key={item.id} style={styles.itemCard}>
                    <View style={styles.itemHeader}>
                      <Text style={styles.itemIndex}>#{index + 1}</Text>
                      <Text style={styles.itemDate}>{item.tanggal}</Text>
                      <Text style={styles.itemKontrak}>{item.kontrak}</Text>
                    </View>

                    <Text style={styles.itemNama}>{item.nama}</Text>

                    <View style={styles.rowBetween}>
                      <Text style={styles.itemLabel}>Pinjaman:</Text>
                      <Text style={styles.itemPinjaman}>{formatRupiah(item.pinjaman)}</Text>
                    </View>

                    <View style={styles.rowBetween}>
                      <Text style={styles.itemLabel}>No. HP:</Text>
                      <Text style={styles.itemValue}>{item.noHp || '-'}</Text>
                    </View>

                    <View style={styles.rowBetween}>
                      <Text style={styles.itemLabel}>Marketing:</Text>
                      <Text style={styles.itemValue}>{item.marketing || '-'}</Text>
                    </View>

                    {item.note ? (
                      <View style={styles.noteBox}>
                        <Text style={styles.noteText}>Note: {item.note}</Text>
                      </View>
                    ) : null}
                  </View>
                ))}
              </View>
            )}
          </ScrollView>
        )}
      </KeyboardAvoidingView>

      {/* Bottom Navigation Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity
          style={[styles.navItem, activeTab === 'dashboard' && styles.navItemActive]}
          onPress={() => setActiveTab('dashboard')}
        >
          <Text style={[styles.navText, activeTab === 'dashboard' && styles.navTextActive]}>
            Ringkasan
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navItem, activeTab === 'input' && styles.navItemActive]}
          onPress={() => setActiveTab('input')}
        >
          <Text style={[styles.navText, activeTab === 'input' && styles.navTextActive]}>
            Input Data
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navItem, activeTab === 'laporan' && styles.navItemActive]}
          onPress={() => setActiveTab('laporan')}
        >
          <Text style={[styles.navText, activeTab === 'laporan' && styles.navTextActive]}>
            Laporan ({dataKonsumen.length})
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  flex: {
    flex: 1,
  },
  header: {
    backgroundColor: '#008577',
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: '#CCFBF1',
    fontSize: 12,
    marginTop: 2,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 24,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  metricLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0F172A',
    marginTop: 4,
  },
  metricSub: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 14,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 14,
    textAlign: 'center',
  },
  infoBox: {
    backgroundColor: '#EFF6FF',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  infoText: {
    color: '#1E40AF',
    fontSize: 13,
    textAlign: 'center',
  },
  warningBox: {
    backgroundColor: '#FEF3C7',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FDE68A',
    alignItems: 'center',
    marginVertical: 12,
  },
  warningText: {
    color: '#92400E',
    fontSize: 14,
    fontWeight: '600',
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 160,
    paddingTop: 20,
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
    paddingBottom: 8,
    gap: 8,
  },
  barColumn: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
  },
  barTopLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#475569',
    marginBottom: 4,
  },
  barTrack: {
    width: '100%',
    maxWidth: 36,
    backgroundColor: '#F1F5F9',
    borderRadius: 6,
    height: 100,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    backgroundColor: '#008577',
    borderRadius: 6,
    width: '100%',
  },
  barBottomLabel: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 6,
  },
  breakdownList: {
    marginTop: 14,
    gap: 8,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
  },
  breakdownLabel: {
    fontSize: 12,
    color: '#334155',
  },
  breakdownValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#008577',
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 4,
  },
  pinjamanPreview: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#008577',
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0F172A',
    marginBottom: 12,
  },
  inputSmall: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 13,
    color: '#0F172A',
  },
  textArea: {
    minHeight: 65,
    textAlignVertical: 'top',
  },
  primaryBtn: {
    backgroundColor: '#008577',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  excelBtn: {
    backgroundColor: '#008577',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  excelBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  btnDisabled: {
    opacity: 0.6,
  },
  filterCard: {
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  listContainer: {
    gap: 10,
  },
  itemCard: {
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
    marginBottom: 6,
  },
  itemIndex: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#008577',
  },
  itemDate: {
    fontSize: 11,
    color: '#64748B',
  },
  itemKontrak: {
    fontSize: 11,
    fontWeight: 'bold',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    color: '#334155',
  },
  itemNama: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 6,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 2,
  },
  itemLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  itemValue: {
    fontSize: 12,
    color: '#334155',
  },
  itemPinjaman: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#008577',
  },
  noteBox: {
    backgroundColor: '#F8FAFC',
    padding: 8,
    borderRadius: 6,
    marginTop: 6,
  },
  noteText: {
    fontSize: 11,
    color: '#64748B',
    fontStyle: 'italic',
  },
  navBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
  },
  navItemActive: {
    borderTopWidth: 2,
    borderColor: '#008577',
  },
  navText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  navTextActive: {
    color: '#008577',
    fontWeight: 'bold',
  },
});
