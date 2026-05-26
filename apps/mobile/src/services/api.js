const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3333";

async function request(path, { body, method = "GET", token } = {}) {
  // Wrapper unico para manter headers, token JWT e tratamento de erro padronizados.
  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    ...(body ? { body: JSON.stringify(body) } : {})
  });
  const payload = await response.json().catch(() => ({}));

  if (!response.ok || payload.success === false) {
    const message = typeof payload.error === "string"
      ? payload.error
      : payload.error?.message ?? payload.message ?? "Nao foi possivel comunicar com a API.";
    throw new Error(message);
  }

  return payload.data;
}

export function login({ email, password }) {
  return request("/auth/login", {
    method: "POST",
    body: { email, password }
  });
}

export function register({ name, email, password }) {
  return request("/auth/register", {
    method: "POST",
    body: { name, email, password }
  });
}

export function updateProfile(token, payload) {
  return request("/auth/profile", {
    method: "PUT",
    token,
    body: payload
  });
}

export function syncStats(token, user) {
  // Envia somente os campos de progresso que a API pode persistir.
  return request("/me/stats", {
    method: "PUT",
    token,
    body: {
      xp: user.xp,
      level: user.level,
      streak: user.streak,
      lastStudyDate: user.lastStudyDate,
      rankingOptIn: user.rankingOptIn
    }
  });
}

export function getRanking(token) {
  return request("/ranking", {
    token
  });
}
