import { useRoutes } from 'react-router-dom';
import CategoryGalleryPage from '../components/layout/CategoryGalleryPage';
import { graphicDesignGalleries } from '../data/config/graphicDesignGalleries';

export default function GraphicDesignGalleryRoutes() {
  return useRoutes(
    graphicDesignGalleries.map(({ slug, props }) => ({
      path: slug,
      element: <CategoryGalleryPage {...props} />,
    })),
  );
}
