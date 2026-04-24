import { render, screen } from '@testing-library/react';
import App from './App';

test('muestra el título Portfolio', () => {
  render(<App />);
  expect(screen.getByText(/Portfolio/i)).toBeInTheDocument();
});
