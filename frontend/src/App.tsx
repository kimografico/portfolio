import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import KimoLayout from './pages/Kimo/KimoLayout';
import BooksPage from './pages/Kimo/BooksPage';
import PlacesPage from './pages/Kimo/PlacesPage';

// Componentes placeholder para rutas en desarrollo
const PlaceholderPage = ({ title }: { title: string }) => (
  <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '4rem 2rem' }}>
    <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{title}</h1>
    <p style={{ color: '#666' }}>Esta sección está en desarrollo.</p>
  </div>
);

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/kimo" element={<KimoLayout />}>
        <Route index element={<BooksPage />} />
        <Route path="books" element={<BooksPage />} />
        <Route path="places" element={<PlacesPage />} />
      </Route>
      <Route path="/diseno" element={<PlaceholderPage title="Diseño" />} />
      <Route path="/diseno/:id" element={<PlaceholderPage title="Proyecto de Diseño" />} />
      <Route path="/dev" element={<PlaceholderPage title="Desarrollo" />} />
      <Route path="/dev/:id" element={<PlaceholderPage title="Proyecto de Desarrollo" />} />
      <Route path="/contacto" element={<PlaceholderPage title="Contacto" />} />
      {/* Fallback 404 */}
      <Route path="*" element={<PlaceholderPage title="404 - Página no encontrada" />} />
    </Routes>
  );
}
