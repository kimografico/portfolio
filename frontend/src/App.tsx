import { Routes, Route } from 'react-router-dom';
import KimoLayout from './pages/Kimo/KimoLayout';
import BooksPage from './pages/Kimo/BooksPage';
import PlacesPage from './pages/Kimo/PlacesPage';
import Home from './pages/Home/Home';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="kimo" element={<KimoLayout />}>
        <Route index element={<BooksPage />} />
        <Route path="books" element={<BooksPage />} />
        <Route path="places" element={<PlacesPage />} />
      </Route>
      {/* ...otras rutas si las hay... */}
    </Routes>
  );
}
