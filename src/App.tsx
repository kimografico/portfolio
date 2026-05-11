import ResumeDesignPage from './pages/ContactMe/ResumeDesignPage';
import ResumeDevPage from './pages/ContactMe/ResumeDevPage';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import KimoLayout from './pages/Kimo/KimoLayout';
import BooksPage from './pages/Kimo/Books/BooksPage';
import PlacesPage from './pages/Kimo/Places/PlacesPage';
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
import KimoAuthGate from './components/layout/KimoAuthGate';
import KimoLoginPage from './pages/Kimo/LoginPage';
import DataPage from './pages/Kimo/Admin/DataPage';
import PendientePage from './pages/Kimo/Admin/PendientePage';
import AddProjectPage from './pages/Kimo/Admin/AddProjectPage';
import RecentWorksManagerPage from './pages/Kimo/Admin/RecentWorksManagerPage';
import ResumeManagerPage from './pages/Kimo/Admin/ResumeManagerPage';
import EditProjectPage from './pages/Kimo/Admin/EditProjectPage';
import CategoryGalleryPage from './components/layout/CategoryGalleryPage';
import { graphicDesignGalleries } from './data/config/graphicDesignGalleries';
import { developerGalleries } from './data/config/developerGalleries';

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/resume/design" element={<ResumeDesignPage />} />
          <Route path="/resume/development" element={<ResumeDevPage />} />
          <Route path="/kimo/login" element={<KimoLoginPage />} />
          <Route element={<KimoAuthGate />}>
            <Route path="/kimo" element={<KimoLayout />}>
              <Route index element={<BooksPage />} />
              <Route path="books" element={<BooksPage />} />
              <Route path="places" element={<PlacesPage />} />
              <Route path="ilustraciones" element={<IllustrationsPage />} />
              <Route path="ilustraciones/:id" element={<IllustrationDetailPage />} />
              <Route path="iconos" element={<IconGallery />} />
              <Route path="data" element={<DataPage />} />
              <Route path="pendiente" element={<PendientePage />} />
              <Route path="add-project" element={<AddProjectPage />} />
              <Route path="edit-project/:id" element={<EditProjectPage />} />
              <Route path="recent-works" element={<RecentWorksManagerPage />} />
              <Route path="resume" element={<ResumeManagerPage />} />
            </Route>
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
