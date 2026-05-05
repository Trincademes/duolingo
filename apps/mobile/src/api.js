const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3333";

async function request(path, { method = "GET", token, body } = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    ...(body ? { body: JSON.stringify(body) } : {})
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error ?? "Falha na requisicao.");
  }

  return data.data;
}

export const api = {
  register: (body) => request("/auth/register", { method: "POST", body }),
  login: (body) => request("/auth/login", { method: "POST", body }),
  forgotPassword: (body) => request("/auth/forgot-password", { method: "POST", body }),
  resetPassword: (body) => request("/auth/reset-password", { method: "POST", body }),
  updateProfile: (token, body) => request("/auth/profile", { method: "PUT", token, body }),
  getCourses: () => request("/courses"),
  startCourse: (token, courseId) => request(`/courses/${courseId}/start`, { method: "POST", token }),
  getTrack: (token, courseId) => request(`/courses/${courseId}/track`, { token }),
  getLesson: (token, lessonId) => request(`/lessons/${lessonId}`, { token }),
  submitLesson: (token, lessonId, answers, studyMeta) => request(`/lessons/${lessonId}/submit`, { method: "POST", token, body: { answers, studyMeta } }),
  getDashboard: (token) => request("/me/dashboard", { token }),
  getHistory: (token) => request("/me/history", { token }),
  getReview: (token, courseId) => request(`/me/review/${courseId}`, { token }),
  getReviewSession: (token, courseId) => request(`/me/review/${courseId}/session`, { method: "POST", token }),
  getNotifications: (token) => request("/me/notifications", { token }),
  updateNotifications: (token, body) => request("/me/notifications", { method: "PUT", token, body }),
  getRanking: (token) => request("/ranking", { token })
};
