/**
 * Middleware de manejo centralizado de errores
 * Captura errores y devuelve respuestas JSON consistentes
 */

function errorHandler(err, req, res, next) {
  console.error('Error:', err);

  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(status).json({
    success: false,
    error: message,
  });
}

module.exports = errorHandler;
