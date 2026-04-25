import { Outlet } from 'react-router-dom';
import MainHeader from './MainHeader';
import MainFooter from './MainFooter';

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <MainHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <MainFooter />
    </div>
  );
}
