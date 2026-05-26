const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333";

async function request(path, { method = "GET", token, body } = {}) {
  // Cliente HTTP simples para o painel; todas as chamadas passam pelo mesmo contrato.
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

export const adminApi = {
  login: (body) => request("/auth/login", { method: "POST", body }),
  getCourses: (token) => request("/admin/courses", { token }),
  createCourse: (token, body) =>
    request("/admin/courses", { method: "POST", token, body }),
  updateCourse: (token, courseId, body) =>
    request(`/admin/courses/${courseId}`, { method: "PUT", token, body }),
  deleteCourse: (token, courseId) => request(`/admin/courses/${courseId}`, { method: "DELETE", token }),
  createModule: (token, body) => request("/admin/modules", { method: "POST", token, body }),
  updateModule: (token, moduleId, body) =>
    request(`/admin/modules/${moduleId}`, { method: "PUT", token, body }),
  deleteModule: (token, moduleId) => request(`/admin/modules/${moduleId}`, { method: "DELETE", token }),
  createLesson: (token, body) => request("/admin/lessons", { method: "POST", token, body }),
  updateLesson: (token, lessonId, body) =>
    request(`/admin/lessons/${lessonId}`, { method: "PUT", token, body }),
  deleteLesson: (token, lessonId) => request(`/admin/lessons/${lessonId}`, { method: "DELETE", token }),
  createExercise: (token, body) => request("/admin/exercises", { method: "POST", token, body }),
  updateExercise: (token, exerciseId, body) =>
    request(`/admin/exercises/${exerciseId}`, { method: "PUT", token, body }),
  deleteExercise: (token, exerciseId) =>
    request(`/admin/exercises/${exerciseId}`, { method: "DELETE", token }),
  getReports: (token) => request("/admin/reports", { token })
};
