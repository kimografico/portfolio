import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { useState, type FormEvent } from 'react';
import KimoLogin from '../../components/compositions/KimoLogin';
import {
  checkKimoPassword,
  isKimoAuthenticated,
  sanitizeKimoRedirect,
  setKimoAuthenticated,
} from '../../utils/kimoAuth';

export default function KimoLoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = sanitizeKimoRedirect(searchParams.get('redirect'));
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isKimoAuthenticated()) {
    return <Navigate to={redirectPath} replace />;
  }

  const notice = '';

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!password.trim()) {
      setError('Introduce una contraseña antes de continuar.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const { isValid, hash } = await checkKimoPassword(password);
      console.log('KIMO password hash:', hash);
      if (isValid) {
        setKimoAuthenticated(true);
        navigate(redirectPath, { replace: true });
        return;
      }
      setError('Contraseña incorrecta.');
    } catch {
      setError('No se ha podido verificar la contraseña en este navegador.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section
      className="flex min-h-full items-center justify-center bg-bg px-6 py-16 md:py-24"
      data-id="kimo-login-page"
    >
      <KimoLogin
        password={password}
        notice={notice}
        error={error}
        isSubmitting={isSubmitting}
        onPasswordChange={setPassword}
        onSubmit={handleSubmit}
      />
    </section>
  );
}
