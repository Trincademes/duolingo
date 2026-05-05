"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { adminApi } from "../lib/api";

const defaultCourse = {
  name: "",
  description: "",
  color: "#195b52"
};

export function AdminConsole({ initialTab = "overview" }) {
  const [tab, setTab] = useState(initialTab);
  const [credentials, setCredentials] = useState({
    email: "admin@duotech.com",
    password: "admin123"
  });
  const [session, setSession] = useState(null);
  const [catalog, setCatalog] = useState([]);
  const [reports, setReports] = useState(null);
  const [message, setMessage] = useState("");
  const [courseDraft, setCourseDraft] = useState(defaultCourse);

  useEffect(() => {
    if (session?.token) {
      refresh(session.token).catch((error) => setMessage(error.message));
    }
  }, [session?.token]);

  async function refresh(token) {
    const [nextCatalog, nextReports] = await Promise.all([
      adminApi.getCourses(token),
      adminApi.getReports(token)
    ]);

    setCatalog(nextCatalog);
    setReports(nextReports);
  }

  async function handleLogin(event) {
    event.preventDefault();

    try {
      const nextSession = await adminApi.login(credentials);
      setSession(nextSession);
      setMessage("Login administrativo realizado.");
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function handleCreateCourse(event) {
    event.preventDefault();

    try {
      await adminApi.createCourse(session.token, courseDraft);
      setCourseDraft(defaultCourse);
      await refresh(session.token);
      setMessage("Curso criado.");
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function mutate(action, successMessage = "Catalogo atualizado.") {
    try {
      await action();
      await refresh(session.token);
      setMessage(successMessage);
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <main className="page-shell">
      <section className="hero-panel">
        <div className="pill">Administracao e relatorios</div>
        <h1 className="hero-title">Painel para evoluir conteudo sem apagar progresso academico.</h1>
        <p className="hero-text">
          Agora o CRUD arquiva itens em vez de removelos do historico do aluno, e os relatorios exibem os KPIs
          do enunciado: retencao, uso diario, acuracia, conclusao e streak.
        </p>
        <div className="hero-actions">
          <Link className="pill" href="/">Voltar</Link>
          <Link className="pill" href="/dashboard/courses">Cursos</Link>
          <Link className="pill" href="/dashboard/reports">Relatorios</Link>
        </div>
      </section>

      {!session ? (
        <section className="panel" style={{ maxWidth: 520 }}>
          <h2 className="panel-title">Login do administrador</h2>
          <form className="stack" onSubmit={handleLogin}>
            <label className="field">
              <span>Email</span>
              <input value={credentials.email} onChange={(event) => setCredentials((current) => ({ ...current, email: event.target.value }))} />
            </label>
            <label className="field">
              <span>Senha</span>
              <input type="password" value={credentials.password} onChange={(event) => setCredentials((current) => ({ ...current, password: event.target.value }))} />
            </label>
            <button className="btn btn-primary" type="submit">Entrar</button>
          </form>
          {message ? <p className="message">{message}</p> : null}
        </section>
      ) : (
        <section className="console-layout">
          <aside className="panel sidebar stack">
            <button className="btn btn-primary" onClick={() => setTab("overview")}>Visao geral</button>
            <button className="btn btn-secondary" onClick={() => setTab("courses")}>Cursos e trilhas</button>
            <button className="btn btn-secondary" onClick={() => setTab("reports")}>KPIs</button>
            <p className="muted tiny">Conectado como {session.user.email}</p>
          </aside>

          <div className="stack">
            {message ? <p className="message">{message}</p> : null}

            {tab === "overview" && (
              <>
                <section className="grid grid-3">
                  <article className="metric">
                    Usuarios
                    <strong>{reports?.totalUsers ?? 0}</strong>
                  </article>
                  <article className="metric">
                    Ativos hoje
                    <strong>{reports?.activeToday ?? 0}</strong>
                  </article>
                  <article className="metric">
                    Minutos diarios
                    <strong>{reports?.averageDailyUseMinutes ?? 0}</strong>
                  </article>
                </section>

                <section className="grid grid-3">
                  <article className="metric">
                    Retencao D1
                    <strong>{reports?.retention?.d1 ?? 0}%</strong>
                  </article>
                  <article className="metric">
                    Retencao D7
                    <strong>{reports?.retention?.d7 ?? 0}%</strong>
                  </article>
                  <article className="metric">
                    Retencao D30
                    <strong>{reports?.retention?.d30 ?? 0}%</strong>
                  </article>
                </section>

                <section className="panel">
                  <h2 className="panel-title">Cobertura administrativa</h2>
                  <div className="chip-row">
                    <span className="pill">Curso</span>
                    <span className="pill">Modulo</span>
                    <span className="pill">Licao</span>
                    <span className="pill">Exercicio</span>
                    <span className="pill">Arquivamento sem perder progresso</span>
                  </div>
                </section>
              </>
            )}

            {tab === "courses" && (
              <>
                <section className="panel">
                  <h2 className="panel-title">Criar curso</h2>
                  <form className="grid grid-2" onSubmit={handleCreateCourse}>
                    <label className="field">
                      <span>Nome</span>
                      <input value={courseDraft.name} onChange={(event) => setCourseDraft((current) => ({ ...current, name: event.target.value }))} />
                    </label>
                    <label className="field">
                      <span>Cor</span>
                      <input value={courseDraft.color} onChange={(event) => setCourseDraft((current) => ({ ...current, color: event.target.value }))} />
                    </label>
                    <label className="field" style={{ gridColumn: "1 / -1" }}>
                      <span>Descricao</span>
                      <textarea value={courseDraft.description} onChange={(event) => setCourseDraft((current) => ({ ...current, description: event.target.value }))} />
                    </label>
                    <button className="btn btn-primary" type="submit">Salvar curso</button>
                  </form>
                </section>

                <section className="stack">
                  {catalog.map((course) => (
                    <CourseEditor key={course.id} course={course} session={session} mutate={mutate} />
                  ))}
                </section>
              </>
            )}

            {tab === "reports" && (
              <section className="stack">
                <article className="panel">
                  <h2 className="panel-title">Indicadores principais</h2>
                  <div className="grid grid-3">
                    <div className="metric">
                      Media de licoes por usuario
                      <strong>{reports?.averageLessonsPerUser ?? 0}</strong>
                    </div>
                    <div className="metric">
                      Media de streak
                      <strong>{reports?.averageStreak ?? 0}</strong>
                    </div>
                    <div className="metric">
                      Manutencao de streak
                      <strong>{reports?.streakMaintenanceRate ?? 0}%</strong>
                    </div>
                  </div>
                </article>

                <article className="panel">
                  <h2 className="panel-title">Conclusao e acuracia</h2>
                  <div className="grid grid-3">
                    <div className="metric">
                      Conclusao de modulos
                      <strong>{reports?.moduleCompletionRate ?? 0}%</strong>
                    </div>
                    <div className="metric">
                      Acuracia media
                      <strong>{reports?.averageAccuracy ?? 0}%</strong>
                    </div>
                    <div className="metric">
                      Acuracia por exercicio
                      <strong>{reports?.exerciseAccuracy?.overallAccuracyRate ?? 0}%</strong>
                    </div>
                  </div>
                </article>

                <article className="panel">
                  <h2 className="panel-title">Conclusao por curso</h2>
                  <div className="stack">
                    {(reports?.courseCompletion ?? []).map((item) => (
                      <div key={item.courseId} className="entity-card">
                        <h3 className="entity-title">{item.courseId.toUpperCase()}</h3>
                        <p className="muted tiny">{item.completedLessons}/{item.totalLessons} licoes concluídas</p>
                        <p className="muted tiny">{item.percentage}% de avanço agregado</p>
                      </div>
                    ))}
                  </div>
                </article>

                <article className="panel">
                  <h2 className="panel-title">Exercicios com mais erro</h2>
                  <div className="stack">
                    {(reports?.exerciseAccuracy?.perExercise ?? []).map((item) => (
                      <div key={item.exerciseId} className="entity-card">
                        <h3 className="entity-title">{item.exerciseId}</h3>
                        <p className="muted tiny">Acuracia: {item.accuracyRate}%</p>
                        <p className="muted tiny">Tentativas: {item.attempts} | Erros: {item.errors}</p>
                        <p className="muted tiny">Topicos: {(item.reviewTags ?? []).join(", ")}</p>
                      </div>
                    ))}
                  </div>
                </article>
              </section>
            )}
          </div>
        </section>
      )}
    </main>
  );
}

function CourseEditor({ course, session, mutate }) {
  const [courseState, setCourseState] = useState(course);
  const [moduleDraft, setModuleDraft] = useState({ title: "" });

  return (
    <article className="panel stack">
      <div className="btn-row">
        <div style={{ marginRight: "auto" }}>
          <h2 className="panel-title">{courseState.name}</h2>
          {course.archivedAt ? <p className="muted tiny">Curso arquivado em {course.archivedAt}</p> : null}
        </div>
        <button className="btn btn-danger" onClick={() => mutate(() => adminApi.deleteCourse(session.token, course.id), "Curso arquivado sem apagar o progresso.")}>
          Arquivar curso
        </button>
      </div>

      <div className="grid grid-2">
        <label className="field">
          <span>Nome</span>
          <input value={courseState.name} onChange={(event) => setCourseState((current) => ({ ...current, name: event.target.value }))} />
        </label>
        <label className="field">
          <span>Cor</span>
          <input value={courseState.color} onChange={(event) => setCourseState((current) => ({ ...current, color: event.target.value }))} />
        </label>
        <label className="field" style={{ gridColumn: "1 / -1" }}>
          <span>Descricao</span>
          <textarea value={courseState.description} onChange={(event) => setCourseState((current) => ({ ...current, description: event.target.value }))} />
        </label>
      </div>

      <button className="btn btn-primary" onClick={() => mutate(() => adminApi.updateCourse(session.token, course.id, courseState))}>
        Atualizar curso
      </button>

      <div className="entity-card stack">
        <h3 className="entity-title">Novo modulo</h3>
        <label className="field">
          <span>Titulo</span>
          <input value={moduleDraft.title} onChange={(event) => setModuleDraft({ title: event.target.value })} />
        </label>
        <button className="btn btn-secondary" onClick={() => mutate(() => adminApi.createModule(session.token, { courseId: course.id, title: moduleDraft.title }))}>
          Criar modulo
        </button>
      </div>

      <div className="stack">
        {course.modules.map((module) => (
          <ModuleEditor key={module.id} module={module} session={session} mutate={mutate} />
        ))}
      </div>
    </article>
  );
}

function ModuleEditor({ module, session, mutate }) {
  const [moduleState, setModuleState] = useState(module);
  const [lessonDraft, setLessonDraft] = useState({
    title: "",
    explanation: ""
  });

  return (
    <section className="entity-card stack">
      <div className="btn-row">
        <div style={{ marginRight: "auto" }}>
          <h3 className="entity-title">{moduleState.title}</h3>
          {module.archivedAt ? <p className="muted tiny">Modulo arquivado em {module.archivedAt}</p> : null}
        </div>
        <button className="btn btn-danger" onClick={() => mutate(() => adminApi.deleteModule(session.token, module.id), "Modulo arquivado sem apagar progresso.")}>
          Arquivar modulo
        </button>
      </div>

      <div className="grid grid-2">
        <label className="field">
          <span>Titulo</span>
          <input value={moduleState.title} onChange={(event) => setModuleState((current) => ({ ...current, title: event.target.value }))} />
        </label>
        <label className="field">
          <span>Ordem</span>
          <input value={moduleState.order} onChange={(event) => setModuleState((current) => ({ ...current, order: Number(event.target.value) }))} />
        </label>
      </div>

      <button className="btn btn-secondary" onClick={() => mutate(() => adminApi.updateModule(session.token, module.id, moduleState))}>
        Atualizar modulo
      </button>

      <div className="entity-card stack">
        <h4 className="entity-title">Nova licao</h4>
        <label className="field">
          <span>Titulo</span>
          <input value={lessonDraft.title} onChange={(event) => setLessonDraft((current) => ({ ...current, title: event.target.value }))} />
        </label>
        <label className="field">
          <span>Explicacao</span>
          <textarea value={lessonDraft.explanation} onChange={(event) => setLessonDraft((current) => ({ ...current, explanation: event.target.value }))} />
        </label>
        <button className="btn btn-secondary" onClick={() => mutate(() => adminApi.createLesson(session.token, { moduleId: module.id, ...lessonDraft }))}>
          Criar licao
        </button>
      </div>

      <div className="stack">
        {module.lessons.map((lesson) => (
          <LessonEditor key={lesson.id} lesson={lesson} session={session} mutate={mutate} />
        ))}
      </div>
    </section>
  );
}

function LessonEditor({ lesson, session, mutate }) {
  const [lessonState, setLessonState] = useState({
    ...lesson,
    reviewTags: (lesson.reviewTags ?? []).join(", ")
  });
  const [exerciseDraft, setExerciseDraft] = useState({
    type: "multiple_choice",
    prompt: "",
    explanation: "",
    correctAnswer: "",
    options: "[]"
  });

  return (
    <section className="entity-card stack">
      <div className="btn-row">
        <div style={{ marginRight: "auto" }}>
          <h4 className="entity-title">{lesson.title}</h4>
          {lesson.archivedAt ? <p className="muted tiny">Licao arquivada em {lesson.archivedAt}</p> : null}
        </div>
        <button className="btn btn-danger" onClick={() => mutate(() => adminApi.deleteLesson(session.token, lesson.id), "Licao arquivada sem apagar historico do aluno.")}>
          Arquivar licao
        </button>
      </div>

      <div className="grid grid-2">
        <label className="field">
          <span>Titulo</span>
          <input value={lessonState.title} onChange={(event) => setLessonState((current) => ({ ...current, title: event.target.value }))} />
        </label>
        <label className="field">
          <span>Ordem</span>
          <input value={lessonState.order} onChange={(event) => setLessonState((current) => ({ ...current, order: Number(event.target.value) }))} />
        </label>
        <label className="field">
          <span>Minimo de acertos</span>
          <input value={lessonState.minCorrectAnswers} onChange={(event) => setLessonState((current) => ({ ...current, minCorrectAnswers: Number(event.target.value) }))} />
        </label>
        <label className="field">
          <span>XP</span>
          <input value={lessonState.xpReward} onChange={(event) => setLessonState((current) => ({ ...current, xpReward: Number(event.target.value) }))} />
        </label>
        <label className="field" style={{ gridColumn: "1 / -1" }}>
          <span>Explicacao</span>
          <textarea value={lessonState.explanation} onChange={(event) => setLessonState((current) => ({ ...current, explanation: event.target.value }))} />
        </label>
        <label className="field" style={{ gridColumn: "1 / -1" }}>
          <span>Tags de revisao</span>
          <input value={lessonState.reviewTags} onChange={(event) => setLessonState((current) => ({ ...current, reviewTags: event.target.value }))} />
        </label>
      </div>

      <button
        className="btn btn-secondary"
        onClick={() => mutate(() => adminApi.updateLesson(session.token, lesson.id, {
          ...lessonState,
          reviewTags: lessonState.reviewTags.split(",").map((item) => item.trim()).filter(Boolean)
        }))}
      >
        Atualizar licao
      </button>

      <div className="entity-card stack">
        <h5 className="entity-title">Novo exercicio</h5>
        <div className="grid grid-2">
          <label className="field">
            <span>Tipo</span>
            <select value={exerciseDraft.type} onChange={(event) => setExerciseDraft((current) => ({ ...current, type: event.target.value }))}>
              <option value="multiple_choice">Multipla escolha</option>
              <option value="true_false">Verdadeiro/Falso</option>
              <option value="matching">Associacao</option>
              <option value="fill_code">Completar codigo</option>
              <option value="order_steps">Ordenar passos</option>
            </select>
          </label>
          <label className="field">
            <span>Resposta correta</span>
            <input value={exerciseDraft.correctAnswer} onChange={(event) => setExerciseDraft((current) => ({ ...current, correctAnswer: event.target.value }))} />
          </label>
          <label className="field" style={{ gridColumn: "1 / -1" }}>
            <span>Pergunta</span>
            <textarea value={exerciseDraft.prompt} onChange={(event) => setExerciseDraft((current) => ({ ...current, prompt: event.target.value }))} />
          </label>
          <label className="field" style={{ gridColumn: "1 / -1" }}>
            <span>Opcoes em JSON</span>
            <textarea value={exerciseDraft.options} onChange={(event) => setExerciseDraft((current) => ({ ...current, options: event.target.value }))} />
          </label>
          <label className="field" style={{ gridColumn: "1 / -1" }}>
            <span>Explicacao</span>
            <textarea value={exerciseDraft.explanation} onChange={(event) => setExerciseDraft((current) => ({ ...current, explanation: event.target.value }))} />
          </label>
        </div>
        <button
          className="btn btn-secondary"
          onClick={() => mutate(() => adminApi.createExercise(session.token, {
            lessonId: lesson.id,
            type: exerciseDraft.type,
            prompt: exerciseDraft.prompt,
            explanation: exerciseDraft.explanation,
            correctAnswer: safeJson(exerciseDraft.correctAnswer),
            options: safeJson(exerciseDraft.options)
          }))}
        >
          Criar exercicio
        </button>
      </div>

      <div className="stack">
        {lesson.exercises.map((exercise) => (
          <ExerciseEditor key={exercise.id} exercise={exercise} session={session} mutate={mutate} />
        ))}
      </div>
    </section>
  );
}

function ExerciseEditor({ exercise, session, mutate }) {
  const [exerciseState, setExerciseState] = useState({
    ...exercise,
    options: JSON.stringify(exercise.options),
    correctAnswer: JSON.stringify(exercise.correctAnswer)
  });

  return (
    <div className="entity-card stack">
      <div className="btn-row">
        <div style={{ marginRight: "auto" }}>
          <strong>{exercise.type}</strong>
          {exercise.archivedAt ? <p className="muted tiny">Exercicio arquivado em {exercise.archivedAt}</p> : null}
        </div>
        <button className="btn btn-danger" onClick={() => mutate(() => adminApi.deleteExercise(session.token, exercise.id), "Exercicio arquivado sem apagar desempenho.")}>
          Arquivar exercicio
        </button>
      </div>
      <label className="field">
        <span>Pergunta</span>
        <textarea value={exerciseState.prompt} onChange={(event) => setExerciseState((current) => ({ ...current, prompt: event.target.value }))} />
      </label>
      <label className="field">
        <span>Opcoes em JSON</span>
        <textarea value={exerciseState.options} onChange={(event) => setExerciseState((current) => ({ ...current, options: event.target.value }))} />
      </label>
      <label className="field">
        <span>Resposta correta em JSON</span>
        <textarea value={exerciseState.correctAnswer} onChange={(event) => setExerciseState((current) => ({ ...current, correctAnswer: event.target.value }))} />
      </label>
      <label className="field">
        <span>Explicacao</span>
        <textarea value={exerciseState.explanation} onChange={(event) => setExerciseState((current) => ({ ...current, explanation: event.target.value }))} />
      </label>
      <button
        className="btn btn-secondary"
        onClick={() => mutate(() => adminApi.updateExercise(session.token, exercise.id, {
          ...exerciseState,
          options: safeJson(exerciseState.options),
          correctAnswer: safeJson(exerciseState.correctAnswer)
        }))}
      >
        Atualizar exercicio
      </button>
    </div>
  );
}

function safeJson(value) {
  try {
    return JSON.parse(value);
  } catch (_error) {
    return value;
  }
}
