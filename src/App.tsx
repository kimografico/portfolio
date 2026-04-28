import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import KimoLayout from './pages/Kimo/KimoLayout';
import BooksPage from './pages/Kimo/BooksPage';
import PlacesPage from './pages/Kimo/PlacesPage';
import IllustrationsPage from './pages/Kimo/Ilustraciones/IllustrationsPage';
import IllustrationDetailPage from './pages/Kimo/Ilustraciones/IllustrationDetailPage';
import NotFoundPage from './pages/NotFoundPage';
import GraphicDesignHome from './pages/GraphicDesign/GraphicDesignHome';
import DeveloperHome from './pages/Developer/DeveloperHome';
import DeveloperWordpress from './pages/Developer/DeveloperWordpress';
import DeveloperVanilla from './pages/Developer/DeveloperVanilla';
import DeveloperFrameworks from './pages/Developer/DeveloperFrameworks';
import DeveloperProjectDetail from './pages/Developer/DeveloperProjectDetail';
import MainLayout from './components/layout/MainLayout';
import ContactMe from './pages/ContactMe/ContactMe';
import ScrollToTop from './components/layout/ScrollToTop';
import IconGallery from './pages/Kimo/IconGallery';

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
          <Route path="/dev" element={<DeveloperHome />} />
          <Route path="/dev/wordpress" element={<DeveloperWordpress />} />
          <Route path="/dev/vanilla" element={<DeveloperVanilla />} />
          <Route path="/dev/frameworks" element={<DeveloperFrameworks />} />
          <Route path="/dev/:parent/:id" element={<DeveloperProjectDetail />} />
          <Route path="/contacto" element={<ContactMe />} />
          {/* Fallback 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </>
  );
}
