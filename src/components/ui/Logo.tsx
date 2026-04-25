import { Link } from 'react-router-dom';
import './logo.css';

/**
 * Logo: Componente reutilizable para el logotipo de la cabecera.
 * Usa estilos de logo.css para separar la lógica visual.
 */
export default function Logo() {
  return (
    <Link to="/" className="logo">
      <span className="text-ink">kimo</span>
      <span className="text-accent">gráfico</span>
    </Link>
  );
}
