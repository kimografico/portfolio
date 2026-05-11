import { Outlet } from 'react-router-dom';
import MainHeader from './MainHeader';
import MainFooter from './MainFooter';

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <a href="#main-content" className="skip-link">
        Saltar al contenido principal
      </a>
      <MainHeader />
      <main id="main-content" className="flex-1" data-id="main-content">
        <Outlet />
      </main>
      <MainFooter />
    </div>
  );
}
