import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import KimoLayout from './pages/Kimo/KimoLayout';
import BooksPage from './pages/Kimo/BooksPage';
import PlacesPage from './pages/Kimo/PlacesPage';
import IllustrationsPage from './pages/Kimo/Ilustraciones/IllustrationsPage';
import IllustrationDetailPage from './pages/Kimo/Ilustraciones/IllustrationDetailPage';
import NotFoundPage from './pages/NotFoundPage';
import GraphicDesignHome from './pages/GraphicDesign/GraphicDesignHome';
import GraphicDesignProjectDetail from './pages/GraphicDesign/GraphicDesignProjectDetail';
import DeveloperHome from './pages/Developer/DeveloperHome';
import DeveloperProjectDetail from './pages/Developer/DeveloperProjectDetail';
import MainLayout from './components/layout/MainLayout';
import ContactMe from './pages/ContactMe/ContactMe';
import ScrollToTop from './components/layout/ScrollToTop';
import IconGallery from './pages/Kimo/IconGallery';
import CategoryGalleryPage from './components/layout/CategoryGalleryPage';
import { graphicDesignGalleries } from './config/graphicDesignGalleries';
import { developerGalleries } from './config/developerGalleries';

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
          {/* Galerías de Diseño Gráfico: generadas dinámicamente desde la configuración */}
          {graphicDesignGalleries.map(({ slug, props }) => (
            <Route
              key={slug}
              path={`/graphic-design/${slug}`}
              element={<CategoryGalleryPage {...props} />}
            />
          ))}
          <Route path="/graphic-design/:category/:id" element={<GraphicDesignProjectDetail />} />
          <Route path="/dev" element={<DeveloperHome />} />
          {/* Galerías de Desarrollo: generadas dinámicamente desde la configuración */}
          {developerGalleries.map(({ slug, props }) => (
            <Route key={slug} path={`/dev/${slug}`} element={<CategoryGalleryPage {...props} />} />
          ))}
          <Route path="/dev/:parent/:id" element={<DeveloperProjectDetail />} />
          <Route path="/contacto" element={<ContactMe />} />
          {/* Fallback 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </>
  );
}
