import Navbar from '@/components/Navbar';
import '@/styles/layout.css';

export const metadata = {
  title: 'SheBloom — Caretaker Dashboard',
};

export default function CaretakerLayout({ children }) {
  return (
    <div className="app">
      <Navbar />
      <main style={{ paddingTop: 'var(--nav-height, 64px)', minHeight: '100vh' }}>
        {children}
      </main>
    </div>
  );
}
