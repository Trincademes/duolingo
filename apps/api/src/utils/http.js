export function sendSuccess(response, data, status = 200) {
  response.status(status).json({
    success: true,
    data
  });
}

export function sendError(response, error, status = 400) {
  response.status(status).json({
    success: false,
    error: error.message ?? "Erro inesperado."
  });
}

