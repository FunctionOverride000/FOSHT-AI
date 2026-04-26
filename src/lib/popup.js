import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

// Konfigurasi Tema Gelap FOSHT
// Konfigurasi Tema Gelap FOSHT
const foshtTheme = {
  background: '#111827', // Warna bg-gray-900 Tailwind
  color: '#ffffff',      // Teks putih
  confirmButtonColor: '#f97316', // Tombol utama oranye
  cancelButtonColor: '#374151'   // Tombol batal abu-abu
};

export const popupSuccess = (title, text) => {
  return MySwal.fire({ ...foshtTheme, icon: 'success', title, text });
};

export const popupError = (title, text) => {
  return MySwal.fire({ ...foshtTheme, icon: 'error', title, text });
};

// Pop-up Konfirmasi (Pengganti confirm)
export const popupConfirm = async (title, text) => {
  const result = await MySwal.fire({
    ...foshtTheme,
    icon: 'warning',
    title,
    text,
    showCancelButton: true,
    confirmButtonText: 'Ya, Lanjutkan',
    cancelButtonText: 'Batal'
  });
  return result.isConfirmed; // Akan return true jika user klik "Ya"
};