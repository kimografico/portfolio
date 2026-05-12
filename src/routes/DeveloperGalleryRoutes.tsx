import { useRoutes } from 'react-router-dom';
import CategoryGalleryPage from '../components/layout/CategoryGalleryPage';
import { developerGalleries } from '../data/config/developerGalleries';

export default function DeveloperGalleryRoutes() {
  return useRoutes(
    developerGalleries.map(({ slug, props }) => ({
      path: slug,
      element: <CategoryGalleryPage {...props} />,
    })),
  );
}
