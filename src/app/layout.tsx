import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export const metadata = {
  title: 'FOSHT AI - Automasi Blog Berbasis API',
  description: 'API Agent khusus untuk menulis artikel blog SEO lengkap dengan gambar secara otomatis.',
  
  // PERBAIKAN DI SINI: Menambahkan logo untuk Favicon & Apple Touch Icon
  icons: {
    icon: '/img/fosht.png',      // Logo standar di tab browser
    shortcut: '/img/fosht.png',  // Shortcut icon
    apple: '/img/fosht.png',     // Logo saat website di-save ke Home Screen iOS
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="bg-black text-white min-h-screen flex flex-col antialiased selection:bg-orange-500 selection:text-white">
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}