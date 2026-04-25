import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import KimoLayout from './pages/Kimo/KimoLayout';
import BooksPage from './pages/Kimo/BooksPage';
import PlacesPage from './pages/Kimo/PlacesPage';
import IllustrationsPage from './pages/Kimo/Ilustraciones/IllustrationsPage';
import IllustrationDetailPage from './pages/Kimo/Ilustraciones/IllustrationDetailPage';
import NotFoundPage from './pages/NotFoundPage';
import GraphicDesignHome from './pages/GraphicDesign/GraphicDesignHome';
import MainLayout from './components/layout/MainLayout';
import ContactMe from './pages/ContactMe/ContactMe';
import ScrollToTop from './components/layout/ScrollToTop';
import IconGallery from './pages/Kimo/IconGallery';

// Componentes placeholder para rutas en desarrollo
const PlaceholderPage = ({ title }: { title: string }) => (
  <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '4rem 2rem' }}>
    <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{title}</h1>
    <p style={{ color: '#666' }}>Esta sección está en desarrollo.</p>
  </div>
);

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/kimo" element={<KimoLayout />}>
            <Route index element={<BooksPage />} />
            <Route path="books" element={<BooksPage />} />
            <Route path="places" element={<PlacesPage />} />
            <Route path="ilustraciones" element={<IllustrationsPage />} />
            <Route path="ilustraciones/:id" element={<IllustrationDetailPage />} />
            <Route path="iconos" element={<IconGallery />} />
          </Route>
          <Route path="/graphic-design" element={<GraphicDesignHome />} />
          <Route path="/dev" element={<PlaceholderPage title="Desarrollo" />} />
          <Route path="/dev/:id" element={<PlaceholderPage title="Proyecto de Desarrollo" />} />
          <Route path="/contacto" element={<ContactMe />} />
          {/* Fallback 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </>
  );
}
