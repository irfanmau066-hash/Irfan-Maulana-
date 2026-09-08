import * as XLSX from 'xlsx';
import { Consumer } from '../types';

export function formatRupiah(amount: number): string {
  return `Rp ${amount.toLocaleString('id-ID')}`;
}

export function exportConsumersToExcel(
  consumers: Consumer[],
  fileName: string = 'laporan_konsumen.xlsx'
): void {
  if (!consumers || consumers.length === 0) {
    throw new Error('Tidak ada data konsumen untuk diekspor.');
  }

  // Exact columns matching Streamlit DataFrame
  const rows = consumers.map((c, index) => ({
    'No': index + 1,
    'Tanggal': c.tanggal,
    'Nama Konsumen': c.nama,
    'Pinjaman': c.pinjaman,
    'No. HP': c.noHp || '-',
    'Nama Marketing': c.marketing || '-',
    'Nomor Kontrak': c.kontrak,
    'Note': c.note || '-',
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);

  // Set column widths for clean readability in Excel
  worksheet['!cols'] = [
    { wch: 6 },  // No
    { wch: 14 }, // Tanggal
    { wch: 26 }, // Nama Konsumen
    { wch: 18 }, // Pinjaman
    { wch: 18 }, // No. HP
    { wch: 20 }, // Nama Marketing
    { wch: 20 }, // Nomor Kontrak
    { wch: 36 }, // Note
  ];

  const workbook = XLSX.utils.book_new();
  // Sheet name 'Laporan' directly matches the Streamlit code: sheet_name='Laporan'
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Laporan');

  // Trigger browser download
  XLSX.writeFile(workbook, fileName);
}

export function parseExcelFile(file: File): Promise<Consumer[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const rawJson: Record<string, unknown>[] = XLSX.utils.sheet_to_json(worksheet);

        const consumers: Consumer[] = rawJson.map((row, idx) => {
          const tanggal = String(row['Tanggal'] || row['tanggal'] || new Date().toISOString().slice(0, 10)).trim();
          const nama = String(row['Nama Konsumen'] || row['Nama'] || row['nama'] || `Konsumen #${idx + 1}`).trim();
          const rawPinjaman = Number(row['Pinjaman'] || row['Jumlah Pinjaman'] || row['pinjaman'] || 0);
          const pinjaman = isNaN(rawPinjaman) ? 0 : rawPinjaman;
          const noHp = String(row['No. HP'] || row['No HP'] || row['Telepon'] || row['noHp'] || '').trim();
          const marketing = String(row['Nama Marketing'] || row['Marketing'] || row['marketing'] || '').trim();
          const kontrak = String(row['Nomor Kontrak'] || row['No Kontrak'] || row['kontrak'] || `KTR-${Date.now().toString().slice(-4)}`).trim();
          const note = String(row['Note'] || row['Catatan'] || row['note'] || '').trim();

          return {
            id: `import-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 6)}`,
            tanggal,
            nama,
            pinjaman,
            noHp,
            marketing,
            kontrak,
            note,
            createdAt: new Date().toISOString(),
          };
        });

        resolve(consumers);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });
}

