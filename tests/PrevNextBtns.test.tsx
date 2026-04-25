import { render, screen, fireEvent } from '@testing-library/react';
import PrevNextBtns from '../src/components/ui/PrevNextBtns';

describe('PrevNextBtns', () => {
  it('llama a onPrev y onNext cuando se hace click', () => {
    const onPrev = vi.fn();
    const onNext = vi.fn();
    render(<PrevNextBtns onPrev={onPrev} onNext={onNext} />);
    fireEvent.click(screen.getByLabelText(/anterior/i));
    fireEvent.click(screen.getByLabelText(/siguiente/i));
    expect(onPrev).toHaveBeenCalled();
    expect(onNext).toHaveBeenCalled();
  });

  it('deshabilita los botones correctamente', () => {
    const onPrev = vi.fn();
    const onNext = vi.fn();
    render(<PrevNextBtns onPrev={onPrev} onNext={onNext} disabledPrev disabledNext />);
    expect(screen.getByLabelText(/anterior/i)).toBeDisabled();
    expect(screen.getByLabelText(/siguiente/i)).toBeDisabled();
  });
});
