import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

const MainLayout = lazy(() => import('./components/layout/MainLayout'));
const ScrollToTop = lazy(() => import('./components/layout/ScrollToTop'));
const Home = lazy(() => import('./pages/Home'));
const ResumeDesignPage = lazy(() => import('./pages/ContactMe/ResumeDesignPage'));
const ResumeDevPage = lazy(() => import('./pages/ContactMe/ResumeDevPage'));
const ContactMe = lazy(() => import('./pages/ContactMe/ContactMe'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const GraphicDesignHome = lazy(() => import('./pages/GraphicDesign/GraphicDesignHome'));
const DeveloperHome = lazy(() => import('./pages/Developer/DeveloperHome'));
const GraphicDesignProjectDetail = lazy(
  () => import('./pages/GraphicDesign/GraphicDesignProjectDetail'),
);
const DeveloperProjectDetail = lazy(() => import('./pages/Developer/DeveloperProjectDetail'));
const KimoLayout = lazy(() => import('./pages/Kimo/KimoLayout'));
const BooksPage = lazy(() => import('./pages/Kimo/Books/BooksPage'));
const PlacesPage = lazy(() => import('./pages/Kimo/Places/PlacesPage'));
const IllustrationsPage = lazy(() => import('./pages/Kimo/Ilustraciones/IllustrationsPage'));
const IllustrationDetailPage = lazy(
  () => import('./pages/Kimo/Ilustraciones/IllustrationDetailPage'),
);
const IconGallery = lazy(() => import('./pages/Kimo/IconGallery'));
const KimoAuthGate = lazy(() => import('./components/layout/KimoAuthGate'));
const KimoLoginPage = lazy(() => import('./pages/Kimo/LoginPage'));
const DataPage = lazy(() => import('./pages/Kimo/Admin/DataPage'));
const PendientePage = lazy(() => import('./pages/Kimo/Admin/PendientePage'));
const AddProjectPage = lazy(() => import('./pages/Kimo/Admin/AddProjectPage'));
const AddBookPage = lazy(() => import('./pages/Kimo/Admin/AddBookPage'));
const AddIllustrationPage = lazy(() => import('./pages/Kimo/Admin/AddIllustrationPage'));
const AddPlacePage = lazy(() => import('./pages/Kimo/Admin/AddPlacePage'));
const RecentWorksManagerPage = lazy(() => import('./pages/Kimo/Admin/RecentWorksManagerPage'));
const ResumeManagerPage = lazy(() => import('./pages/Kimo/Admin/ResumeManagerPage'));
const EditProjectPage = lazy(() => import('./pages/Kimo/Admin/EditProjectPage'));
const GraphicDesignGalleryRoutes = lazy(() => import('./routes/GraphicDesignGalleryRoutes'));
const DeveloperGalleryRoutes = lazy(() => import('./routes/DeveloperGalleryRoutes'));

function RouteFallback() {
  return (
    <div
      className="min-h-screen flex items-center justify-center text-sm text-muted"
      data-id="route-loading"
    >
      Cargando…
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<RouteFallback />}>
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
              <Route path="add-book" element={<AddBookPage />} />
              <Route path="add-illustration" element={<AddIllustrationPage />} />
              <Route path="add-place" element={<AddPlacePage />} />
              <Route path="edit-project/:id" element={<EditProjectPage />} />
              <Route path="recent-works" element={<RecentWorksManagerPage />} />
              <Route path="resume" element={<ResumeManagerPage />} />
            </Route>
          </Route>
          <Route path="/graphic-design" element={<GraphicDesignHome />} />
          <Route path="/graphic-design/*" element={<GraphicDesignGalleryRoutes />} />
          <Route path="/graphic-design/:category/:id" element={<GraphicDesignProjectDetail />} />
          <Route path="/dev" element={<DeveloperHome />} />
          <Route path="/dev/*" element={<DeveloperGalleryRoutes />} />
          <Route path="/dev/:parent/:id" element={<DeveloperProjectDetail />} />
          <Route path="/contacto" element={<ContactMe />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
