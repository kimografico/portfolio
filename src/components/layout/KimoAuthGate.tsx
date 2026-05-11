import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { isKimoAuthenticated, sanitizeKimoRedirect } from '../../lib/kimoAuth';

export default function KimoAuthGate() {
  const location = useLocation();

  if (!isKimoAuthenticated()) {
    const redirectPath = sanitizeKimoRedirect(`${location.pathname}${location.search}`);

    return <Navigate to={`/kimo/login?redirect=${encodeURIComponent(redirectPath)}`} replace />;
  }

  return <Outlet />;
}
