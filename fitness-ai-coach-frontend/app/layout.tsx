import Footer from './components/Footer/footer';
import Header from './components/Header/header';
import './globals.css';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './context/AuthContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head />
      <body >
        <AuthProvider>

        <Header/>
        {children}
        <Footer />
        <ToastContainer />
        </AuthProvider>
      </body>
    </html>
  );
}
