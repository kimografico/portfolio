/**
 * Middleware de autenticación para las rutas de escritura del espacio Kimo.
 * Usa el hash compartido del login del frontend para bloquear POST/PUT/PATCH/DELETE.
 */

function getConfiguredHash() {
  return (process.env.KIMO_PASSWORD_HASH || process.env.VITE_KIMO_PASSWORD_HASH || '').trim();
}

function getBearerToken(req) {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ')) {
    return '';
  }

  return header.slice(7).trim();
}

function requireKimoAuth(req, res, next) {
  const configuredHash = getConfiguredHash();

  // Si no hay hash configurado en el backend, no bloqueamos para no romper el entorno.
  if (!configuredHash) {
    next();
    return;
  }

  const token = getBearerToken(req);
  if (!token || token !== configuredHash) {
    res.status(401).json({
      success: false,
      error: 'Unauthorized',
    });
    return;
  }

  next();
}

module.exports = requireKimoAuth;
