import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export const metadata = {
  title: 'FOSHT AI - Automasi Blog Berbasis API',
  description: 'API Agent khusus untuk menulis artikel blog SEO lengkap dengan gambar secara otomatis.',
};

export default function RootLayout({ children }) {
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