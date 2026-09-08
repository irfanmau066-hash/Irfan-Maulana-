export interface Consumer {
  id: string;
  tanggal: string; // YYYY-MM-DD
  nama: string; // Nama Konsumen (required)
  pinjaman: number; // Jumlah Pinjaman (Rp)
  noHp: string; // No. HP
  marketing: string; // Nama Marketing
  kontrak: string; // Nomor Kontrak (required)
  note: string; // Note / Catatan
  createdAt: string;
}

export type ActiveTab = 'dashboard' | 'form' | 'laporan' | 'expo';

