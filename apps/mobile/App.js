import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { StatusBar } from "expo-status-bar";
import { api } from "./src/api";
import { theme } from "./src/theme";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true
  })
});

const SESSION_KEY = "duotech-session";

export default function App() {
  const [session, setSession] = useState(null);
  const [authMode, setAuthMode] = useState("login");
  const [authForm, setAuthForm] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [profileForm, setProfileForm] = useState({
    name: "",
    password: "",
    rankingOptIn: false
  });
  const [resetForm, setResetForm] = useState({
    email: "",
    token: "",
    password: ""
  });
  const [showResetPanel, setShowResetPanel] = useState(false);
  const [courses, setCourses] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [selectedCourseId, setSelectedCourseId] = useState("expo");
  const [track, setTrack] = useState(null);
  const [history, setHistory] = useState([]);
  const [reviewSuggestions, setReviewSuggestions] = useState([]);
  const [reviewSession, setReviewSession] = useState([]);
  const [notifications, setNotifications] = useState({
    enabled: true,
    dailyReminderTime: "19:00"
  });
  const [ranking, setRanking] = useState([]);
  const [lesson, setLesson] = useState(null);
  const [lessonStartedAt, setLessonStartedAt] = useState(null);
  const [answers, setAnswers] = useState({});
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentExerciseFeedback, setCurrentExerciseFeedback] = useState(null);
  const [lessonResult, setLessonResult] = useState(null);
  const [tab, setTab] = useState("home");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function bootstrap() {
      const cachedSession = await AsyncStorage.getItem(SESSION_KEY);

      if (cachedSession) {
        const parsed = JSON.parse(cachedSession);
        setSession(parsed);
      }

      const availableCourses = await api.getCourses();
      setCourses(availableCourses);
    }

    bootstrap().catch((error) => setMessage(error.message));
  }, []);

  useEffect(() => {
    if (!session?.token) {
      return;
    }

    refreshStudentData(session.token, selectedCourseId).catch((error) => setMessage(error.message));
  }, [session?.token, selectedCourseId]);

  const activeCourse = useMemo(
    () => courses.find((course) => course.id === selectedCourseId) ?? null,
    [courses, selectedCourseId]
  );

  async function refreshStudentData(token, courseId) {
    const [nextDashboard, nextHistory, nextNotifications, nextRanking] = await Promise.all([
      api.getDashboard(token),
      api.getHistory(token),
      api.getNotifications(token),
      api.getRanking(token)
    ]);

    setDashboard(nextDashboard);
    setHistory(nextHistory);
    setNotifications(nextNotifications);
    setRanking(nextRanking);
    setProfileForm({
      name: nextDashboard.user.name,
      password: "",
      rankingOptIn: nextDashboard.user.rankingOptIn ?? false
    });

    const nextSession = {
      token,
      user: nextDashboard.user
    };

    setSession(nextSession);
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(nextSession));

    try {
      const nextTrack = await api.getTrack(token, courseId);
      setTrack(nextTrack);
      setReviewSuggestions(await api.getReview(token, courseId));
    } catch (_error) {
      setTrack(null);
      setReviewSuggestions([]);
    }
  }

  async function handleAuth() {
    setLoading(true);
    setMessage("");

    try {
      const payload = authMode === "register"
        ? await api.register(authForm)
        : await api.login(authForm);

      setSession(payload);
      await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(payload));
      setAuthForm({ name: "", email: "", password: "" });
      await refreshStudentData(payload.token, selectedCourseId);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotPassword() {
    try {
      const response = await api.forgotPassword({ email: authForm.email });
      setResetForm({
        email: authForm.email,
        token: response.recoveryToken,
        password: ""
      });
      setShowResetPanel(true);
      Alert.alert("Recuperacao", `${response.message}\nToken: ${response.recoveryToken}`);
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function handleResetPassword() {
    try {
      const response = await api.resetPassword(resetForm);
      setShowResetPanel(false);
      setResetForm({ email: "", token: "", password: "" });
      setMessage(response.message);
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function handleStartCourse(courseId) {
    if (!session?.token) {
      return;
    }

    try {
      const response = await api.startCourse(session.token, courseId);
      setSelectedCourseId(courseId);
      setTrack(response);
      setTab("track");
      await refreshStudentData(session.token, courseId);
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function handleOpenLesson(lessonId) {
    if (!session?.token) {
      return;
    }

    try {
      const nextLesson = await api.getLesson(session.token, lessonId);
      setLesson(nextLesson);
      setLessonStartedAt(new Date().toISOString());
      setCurrentExerciseIndex(0);
      setCurrentExerciseFeedback(null);
      setAnswers({});
      setLessonResult(null);
      setTab("lesson");
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function handleSubmitLesson() {
    if (!session?.token || !lesson) {
      return;
    }

    try {
      const submittedAt = new Date().toISOString();
      const durationSeconds = lessonStartedAt
        ? Math.max(5, Math.round((new Date(submittedAt) - new Date(lessonStartedAt)) / 1000))
        : 0;
      const result = await api.submitLesson(session.token, lesson.id, answers, {
        startedAt: lessonStartedAt,
        submittedAt,
        durationSeconds
      });
      setLessonResult(result);
      setCurrentExerciseFeedback(null);
      await refreshStudentData(session.token, lesson.courseId);
    } catch (error) {
      setMessage(error.message);
    }
  }

  function handleCheckCurrentExercise() {
    const exercise = lesson?.exercises?.[currentExerciseIndex];

    if (!exercise) {
      return;
    }

    const answer = answers[exercise.id];
    const isCorrect = evaluateLocalExercise(exercise, answer);

    setCurrentExerciseFeedback({
      isCorrect,
      explanation: exercise.explanation
    });
  }

  function handleAdvanceExercise() {
    if (!lesson) {
      return;
    }

    if (currentExerciseIndex < lesson.exercises.length - 1) {
      setCurrentExerciseIndex((current) => current + 1);
      setCurrentExerciseFeedback(null);
    }
  }

  async function handleSaveNotifications() {
    if (!session?.token) {
      return;
    }

    try {
      const settings = await api.updateNotifications(session.token, notifications);
      setNotifications(settings);
      await scheduleReminder(settings);
      setMessage("Notificacoes atualizadas.");
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function scheduleReminder(settings) {
    await Notifications.cancelAllScheduledNotificationsAsync();

    if (!settings.enabled) {
      return;
    }

    const [hour, minute] = settings.dailyReminderTime.split(":").map(Number);
    const permissions = await Notifications.requestPermissionsAsync();

    if (!permissions.granted) {
      return;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Hora de estudar",
        body: "Sua streak depende de uma licao hoje."
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute
      }
    });
  }

  async function handleReviewSession() {
    if (!session?.token) {
      return;
    }

    try {
      const sessionExercises = await api.getReviewSession(session.token, selectedCourseId);
      setReviewSession(sessionExercises);
      setTab("review");
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function handleUpdateProfile() {
    if (!session?.token) {
      return;
    }

    try {
      const user = await api.updateProfile(session.token, {
        name: profileForm.name || session.user.name,
        password: profileForm.password || undefined,
        rankingOptIn: profileForm.rankingOptIn
      });

      const nextSession = {
        ...session,
        user
      };

      setSession(nextSession);
      await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(nextSession));
      setProfileForm((current) => ({ ...current, password: "" }));
      setMessage("Perfil atualizado.");
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function handleLogout() {
    setSession(null);
    setDashboard(null);
    setTrack(null);
    setLesson(null);
    setLessonStartedAt(null);
    setHistory([]);
    setReviewSuggestions([]);
    setReviewSession([]);
    setProfileForm({ name: "", password: "", rankingOptIn: false });
    await AsyncStorage.removeItem(SESSION_KEY);
  }

  if (!session) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="dark" />
        <ScrollView contentContainerStyle={styles.authContainer}>
          <Text style={styles.eyebrow}>DuoTech</Text>
          <Text style={styles.heroTitle}>Aprenda Expo e AWS em microlições gamificadas.</Text>
          <Text style={styles.heroText}>Cadastro, login, recuperação de senha, progresso por curso e feedback imediato já entram no fluxo inicial.</Text>

          <View style={styles.card}>
            <View style={styles.toggleRow}>
              <ToggleChip active={authMode === "login"} label="Login" onPress={() => setAuthMode("login")} />
              <ToggleChip active={authMode === "register"} label="Cadastro" onPress={() => setAuthMode("register")} />
            </View>

            {authMode === "register" && (
              <Field
                label="Nome"
                value={authForm.name}
                onChangeText={(value) => setAuthForm((current) => ({ ...current, name: value }))}
              />
            )}
            <Field
              label="Email"
              value={authForm.email}
              onChangeText={(value) => setAuthForm((current) => ({ ...current, email: value }))}
              keyboardType="email-address"
            />
            <Field
              label="Senha"
              value={authForm.password}
              onChangeText={(value) => setAuthForm((current) => ({ ...current, password: value }))}
              secureTextEntry
            />

            {message ? <Text style={styles.errorText}>{message}</Text> : null}

            <PrimaryButton
              label={loading ? "Enviando..." : authMode === "register" ? "Criar conta" : "Entrar"}
              onPress={handleAuth}
            />

            <Pressable onPress={handleForgotPassword}>
              <Text style={styles.linkText}>Recuperar senha</Text>
            </Pressable>

            {showResetPanel ? (
              <View style={styles.resetPanel}>
                <Text style={styles.sectionTitle}>Redefinir senha</Text>
                <Field
                  label="Email"
                  value={resetForm.email}
                  onChangeText={(value) => setResetForm((current) => ({ ...current, email: value }))}
                />
                <Field
                  label="Token de recuperacao"
                  value={resetForm.token}
                  onChangeText={(value) => setResetForm((current) => ({ ...current, token: value }))}
                />
                <Field
                  label="Nova senha"
                  value={resetForm.password}
                  onChangeText={(value) => setResetForm((current) => ({ ...current, password: value }))}
                  secureTextEntry
                />
                <PrimaryButton label="Redefinir senha" onPress={handleResetPassword} compact />
              </View>
            ) : null}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.appContainer}>
        <View style={styles.headerCard}>
          <View>
            <Text style={styles.eyebrow}>Ola, {session.user.name}</Text>
            <Text style={styles.heroTitle}>Seu caminho hoje</Text>
          </View>
          <View style={styles.levelBadge}>
            <Text style={styles.levelBadgeText}>Nivel {dashboard?.user?.level ?? session.user.level}</Text>
          </View>
        </View>

        <View style={styles.kpisRow}>
          <StatCard title="XP" value={`${dashboard?.user?.xp ?? session.user.xp}`} />
          <StatCard title="Streak" value={`${dashboard?.user?.streak ?? session.user.streak} dias`} />
          <StatCard title="Conquistas" value={`${dashboard?.achievements?.length ?? 0}`} />
        </View>

        <View style={styles.tabRow}>
          {["home", "track", "lesson", "review", "profile"].map((item) => (
            <ToggleChip
              key={item}
              active={tab === item}
              label={item === "home" ? "Inicio" : item === "track" ? "Trilha" : item === "lesson" ? "Licao" : item === "review" ? "Revisao" : "Perfil"}
              onPress={() => setTab(item)}
            />
          ))}
        </View>

        {message ? <Text style={styles.infoText}>{message}</Text> : null}

        {tab === "home" && (
          <View style={styles.sectionStack}>
            <Section title="Cursos disponiveis" actionLabel="Ranking" onAction={() => setTab("review")}>
              {courses.map((course) => (
                <View key={course.id} style={styles.courseCard}>
                  <View style={styles.courseHeader}>
                    <Text style={styles.courseTitle}>{course.name}</Text>
                    <Text style={styles.courseMeta}>{course.lessonsCount} licoes</Text>
                  </View>
                  <Text style={styles.courseDescription}>{course.description}</Text>
                  <PrimaryButton
                    label={selectedCourseId === course.id ? "Continuar curso" : "Iniciar curso"}
                    onPress={() => handleStartCourse(course.id)}
                    compact
                  />
                </View>
              ))}
            </Section>

            <Section title="Progresso por curso">
              {(dashboard?.courseProgress ?? []).map((progress) => (
                <View key={progress.courseId} style={styles.progressCard}>
                  <Text style={styles.courseTitle}>{progress.courseId.toUpperCase()}</Text>
                  <ProgressBar value={progress.percentage} />
                  <Text style={styles.courseMeta}>{progress.completedLessons}/{progress.totalLessons} licoes concluidas</Text>
                </View>
              ))}
            </Section>

            <Section title="Historico recente">
              {history.slice(0, 4).map((item) => (
                <View key={`${item.courseId}-${item.lessonId}-${item.completedAt}`} style={styles.listRow}>
                  <Text style={styles.listTitle}>{item.title}</Text>
                  <Text style={styles.listMeta}>{Math.round(item.accuracyRate * 100)}% de acerto</Text>
                </View>
              ))}
            </Section>
          </View>
        )}

        {tab === "track" && (
          <View style={styles.sectionStack}>
            <Section
              title={activeCourse ? `Trilha ${activeCourse.name}` : "Trilha"}
              actionLabel="Revisar erros"
              onAction={handleReviewSession}
            >
              {!track?.track ? (
                <Text style={styles.emptyText}>Inicie um curso para liberar sua trilha.</Text>
              ) : (
                track.track.modules.map((module) => (
                  <View key={module.id} style={styles.moduleCard}>
                    <Text style={styles.moduleTitle}>{module.title}</Text>
                    {module.lessons.map((item) => (
                      <Pressable
                        key={item.id}
                        style={[
                          styles.lessonPill,
                          item.current && styles.lessonPillCurrent,
                          item.completed && styles.lessonPillDone,
                          !item.unlocked && styles.lessonPillLocked
                        ]}
                        onPress={() => item.unlocked && handleOpenLesson(item.id)}
                      >
                        <Text style={styles.lessonPillTitle}>{item.title}</Text>
                        <Text style={styles.lessonPillMeta}>
                          {item.completed ? "Concluida" : item.unlocked ? "Liberada" : "Bloqueada"}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                ))
              )}
            </Section>

            <Section title="Progresso por modulo">
              {(track?.progress?.modules ?? []).map((module) => (
                <View key={module.moduleId} style={styles.progressCard}>
                  <Text style={styles.listTitle}>{module.title}</Text>
                  <ProgressBar value={module.percentage} />
                </View>
              ))}
            </Section>
          </View>
        )}

        {tab === "lesson" && (
          <View style={styles.sectionStack}>
            {!lesson ? (
              <Section title="Licao">
                <Text style={styles.emptyText}>Escolha uma licao na trilha para comecar.</Text>
              </Section>
            ) : (
              <Section title={lesson.title}>
                <Text style={styles.lessonExplanation}>{lesson.explanation}</Text>
                <Text style={styles.lessonInfo}>Minimo de acertos para concluir: {lesson.minCorrectAnswers}</Text>
                <Text style={styles.listMeta}>
                  Questao {currentExerciseIndex + 1} de {lesson.exercises.length}
                </Text>

                <ExerciseCard
                  exercise={lesson.exercises[currentExerciseIndex]}
                  index={currentExerciseIndex}
                  answer={answers[lesson.exercises[currentExerciseIndex].id]}
                  onChange={(value) => setAnswers((current) => ({
                    ...current,
                    [lesson.exercises[currentExerciseIndex].id]: value
                  }))}
                />

                {!currentExerciseFeedback ? (
                  <PrimaryButton label="Verificar resposta" onPress={handleCheckCurrentExercise} />
                ) : (
                  <View style={styles.feedbackBox}>
                    <Text style={currentExerciseFeedback.isCorrect ? styles.successText : styles.errorText}>
                      {currentExerciseFeedback.isCorrect ? "Resposta correta." : "Resposta incorreta."}
                    </Text>
                    {!currentExerciseFeedback.isCorrect ? (
                      <Text style={styles.feedbackText}>{currentExerciseFeedback.explanation}</Text>
                    ) : null}
                    {currentExerciseIndex < lesson.exercises.length - 1 ? (
                      <PrimaryButton label="Proxima questao" onPress={handleAdvanceExercise} compact />
                    ) : (
                      <PrimaryButton label="Concluir licao" onPress={handleSubmitLesson} compact />
                    )}
                  </View>
                )}

                {lessonResult ? (
                  <View style={styles.feedbackBox}>
                    <Text style={styles.feedbackTitle}>
                      {lessonResult.submission.passed ? "Licao concluida" : "Tente novamente"}
                    </Text>
                    <Text style={styles.feedbackText}>
                      {lessonResult.submission.correctAnswers} de {lessonResult.submission.totalExercises} corretas
                    </Text>
                    <Text style={styles.feedbackText}>XP ganho: {lessonResult.submission.xpEarned}</Text>
                    {lessonResult.submission.results.filter((item) => !item.isCorrect).map((item) => (
                      <Text key={item.exerciseId} style={styles.errorText}>
                        Erro: {item.explanation}
                      </Text>
                    ))}
                    {lessonResult.unlockedAchievements?.map((achievement) => (
                      <Text key={achievement.id} style={styles.successText}>
                        Nova conquista: {achievement.title}
                      </Text>
                    ))}
                  </View>
                ) : null}
              </Section>
            )}
          </View>
        )}

        {tab === "review" && (
          <View style={styles.sectionStack}>
            <Section title="Topicos frageis" actionLabel="Gerar revisao" onAction={handleReviewSession}>
              {(reviewSuggestions ?? []).length === 0 ? (
                <Text style={styles.emptyText}>Sem erros recorrentes no momento.</Text>
              ) : (
                reviewSuggestions.map((item) => (
                  <View key={item.exerciseId} style={styles.listRow}>
                    <Text style={styles.listTitle}>{item.reviewTags.join(", ")}</Text>
                    <Text style={styles.listMeta}>Taxa de erro: {Math.round(item.errorRate * 100)}%</Text>
                  </View>
                ))
              )}
            </Section>

            <Section title="Sessao adaptativa">
              {(reviewSession ?? []).map((exercise) => (
                <View key={exercise.id} style={styles.reviewExercise}>
                  <Text style={styles.listTitle}>{exercise.prompt}</Text>
                  <Text style={styles.listMeta}>Tipo: {exercise.type}</Text>
                </View>
              ))}
            </Section>

            <Section title="Ranking opcional">
              {!profileForm.rankingOptIn ? (
                <Text style={styles.emptyText}>Ative a participacao no perfil para aparecer e visualizar o ranking.</Text>
              ) : (
                ranking.map((user, index) => (
                  <View key={user.id} style={styles.listRow}>
                    <Text style={styles.listTitle}>{index + 1}. {user.name}</Text>
                    <Text style={styles.listMeta}>{user.xp} XP</Text>
                  </View>
                ))
              )}
            </Section>
          </View>
        )}

        {tab === "profile" && (
          <View style={styles.sectionStack}>
            <Section title="Editar perfil">
              <Field
                label="Novo nome"
                value={profileForm.name}
                onChangeText={(value) => setProfileForm((current) => ({ ...current, name: value }))}
              />
              <Field
                label="Nova senha"
                value={profileForm.password}
                onChangeText={(value) => setProfileForm((current) => ({ ...current, password: value }))}
                secureTextEntry
              />
              <View style={styles.switchRow}>
                <Text style={styles.listTitle}>Participar do ranking</Text>
                <Switch
                  value={profileForm.rankingOptIn}
                  onValueChange={(value) => setProfileForm((current) => ({ ...current, rankingOptIn: value }))}
                />
              </View>
              <PrimaryButton label="Salvar perfil" onPress={handleUpdateProfile} />
            </Section>

            <Section title="Lembrete diario">
              <View style={styles.switchRow}>
                <Text style={styles.listTitle}>Ativar notificacoes</Text>
                <Switch
                  value={notifications.enabled}
                  onValueChange={(value) => setNotifications((current) => ({ ...current, enabled: value }))}
                />
              </View>
              <Field
                label="Horario do lembrete"
                value={notifications.dailyReminderTime}
                onChangeText={(value) => setNotifications((current) => ({ ...current, dailyReminderTime: value }))}
              />
              <PrimaryButton label="Salvar notificacoes" onPress={handleSaveNotifications} />
            </Section>

            <Section title="Sessao">
              <PrimaryButton label="Sair" onPress={handleLogout} compact tone="secondary" />
            </Section>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({ title, children, actionLabel, onAction }) {
  return (
    <View style={styles.card}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {actionLabel ? (
          <Pressable onPress={onAction}>
            <Text style={styles.linkText}>{actionLabel}</Text>
          </Pressable>
        ) : null}
      </View>
      {children}
    </View>
  );
}

function Field(props) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{props.label}</Text>
      <TextInput {...props} style={styles.input} placeholderTextColor={theme.colors.muted} />
    </View>
  );
}

function PrimaryButton({ label, onPress, compact = false, tone = "primary" }) {
  return (
    <Pressable
      style={[
        styles.button,
        compact && styles.buttonCompact,
        tone === "secondary" && styles.buttonSecondary
      ]}
      onPress={onPress}
    >
      <Text style={[styles.buttonLabel, tone === "secondary" && styles.buttonLabelSecondary]}>{label}</Text>
    </Pressable>
  );
}

function ToggleChip({ active, label, onPress }) {
  return (
    <Pressable style={[styles.chip, active && styles.chipActive]} onPress={onPress}>
      <Text style={[styles.chipLabel, active && styles.chipLabelActive]}>{label}</Text>
    </Pressable>
  );
}

function StatCard({ title, value }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statTitle}>{title}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

function ProgressBar({ value }) {
  return (
    <View style={styles.progressBar}>
      <View style={[styles.progressFill, { width: `${value}%` }]} />
    </View>
  );
}

function ExerciseCard({ exercise, index, answer, onChange }) {
  return (
    <View style={styles.exerciseCard}>
      <Text style={styles.exerciseStep}>Questao {index + 1}</Text>
      <Text style={styles.listTitle}>{exercise.prompt}</Text>

      {exercise.type === "multiple_choice" || exercise.type === "true_false" ? (
        exercise.options.map((option) => (
          <Pressable
            key={option}
            style={[styles.optionButton, answer === option && styles.optionButtonActive]}
            onPress={() => onChange(option)}
          >
            <Text style={styles.optionLabel}>{option}</Text>
          </Pressable>
        ))
      ) : null}

      {exercise.type === "fill_code" ? (
        <View>
          <Text style={styles.codeSnippet}>{exercise.snippet}</Text>
          <View style={styles.optionWrap}>
            {exercise.options.map((option) => (
              <Pressable
                key={option}
                style={[styles.optionButton, answer === option && styles.optionButtonActive]}
                onPress={() => onChange(option)}
              >
                <Text style={styles.optionLabel}>{option}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      ) : null}

      {exercise.type === "matching" ? (
        <View style={styles.optionWrap}>
          {exercise.options.map((pair) => {
            const selected = Array.isArray(answer) && answer.some((item) => item.left === pair.left);
            return (
              <Pressable
                key={pair.left}
                style={[styles.optionButton, selected && styles.optionButtonActive]}
                onPress={() => {
                  const next = Array.isArray(answer) ? answer.filter((item) => item.left !== pair.left) : [];
                  onChange(selected ? next : [...next, pair]);
                }}
              >
                <Text style={styles.optionLabel}>{pair.left} -> {pair.right}</Text>
              </Pressable>
            );
          })}
        </View>
      ) : null}

      {exercise.type === "order_steps" ? (
        <View>
          <Text style={styles.listMeta}>Toque nos passos na ordem correta.</Text>
          <View style={styles.optionWrap}>
            {exercise.options.map((step) => (
              <Pressable
                key={step}
                style={styles.optionButton}
                onPress={() => {
                  const current = Array.isArray(answer) ? answer : [];
                  if (!current.includes(step)) {
                    onChange([...current, step]);
                  }
                }}
              >
                <Text style={styles.optionLabel}>{step}</Text>
              </Pressable>
            ))}
          </View>
          <Text style={styles.listMeta}>Resposta: {(answer ?? []).join(" > ") || "Nenhuma ordem montada"}</Text>
          <Pressable onPress={() => onChange([])}>
            <Text style={styles.linkText}>Limpar ordem</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

function evaluateLocalExercise(exercise, answer) {
  if (exercise.type === "order_steps" || exercise.type === "matching") {
    return JSON.stringify(answer) === JSON.stringify(exercise.correctAnswer);
  }

  return answer === exercise.correctAnswer;
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background
  },
  authContainer: {
    padding: theme.spacing.lg,
    gap: theme.spacing.md
  },
  appContainer: {
    padding: theme.spacing.md,
    gap: theme.spacing.md
  },
  headerCard: {
    backgroundColor: "#e8f0df",
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  eyebrow: {
    color: theme.colors.primary,
    fontSize: 13,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 6
  },
  heroTitle: {
    color: theme.colors.ink,
    fontSize: 30,
    lineHeight: 36,
    fontWeight: "800"
  },
  heroText: {
    color: theme.colors.muted,
    marginTop: 12,
    fontSize: 16,
    lineHeight: 22
  },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: theme.spacing.sm
  },
  resetPanel: {
    marginTop: theme.spacing.sm,
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    gap: theme.spacing.sm
  },
  toggleRow: {
    flexDirection: "row",
    gap: 10,
    flexWrap: "wrap"
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: theme.colors.border
  },
  chipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary
  },
  chipLabel: {
    color: theme.colors.ink,
    fontWeight: "600"
  },
  chipLabelActive: {
    color: "#ffffff"
  },
  field: {
    gap: 6
  },
  fieldLabel: {
    color: theme.colors.ink,
    fontWeight: "700"
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: theme.colors.ink,
    backgroundColor: "#fffdfa"
  },
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    paddingVertical: 14,
    alignItems: "center"
  },
  buttonCompact: {
    paddingVertical: 12
  },
  buttonSecondary: {
    backgroundColor: "#f6e3cc"
  },
  buttonLabel: {
    color: "#ffffff",
    fontWeight: "800"
  },
  buttonLabelSecondary: {
    color: theme.colors.secondary
  },
  linkText: {
    color: theme.colors.secondary,
    fontWeight: "700"
  },
  errorText: {
    color: theme.colors.danger
  },
  successText: {
    color: theme.colors.success,
    fontWeight: "700"
  },
  infoText: {
    color: theme.colors.secondary,
    paddingHorizontal: 4
  },
  kpisRow: {
    flexDirection: "row",
    gap: 10
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border
  },
  statTitle: {
    color: theme.colors.muted,
    fontSize: 12,
    textTransform: "uppercase"
  },
  statValue: {
    marginTop: 8,
    color: theme.colors.ink,
    fontSize: 18,
    fontWeight: "800"
  },
  tabRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  sectionStack: {
    gap: theme.spacing.md
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4
  },
  sectionTitle: {
    color: theme.colors.ink,
    fontSize: 18,
    fontWeight: "800"
  },
  courseCard: {
    gap: 8,
    padding: theme.spacing.sm,
    borderRadius: theme.radius.md,
    backgroundColor: "#fbf8f1"
  },
  courseHeader: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  courseTitle: {
    color: theme.colors.ink,
    fontWeight: "800",
    fontSize: 16
  },
  courseMeta: {
    color: theme.colors.muted
  },
  courseDescription: {
    color: theme.colors.muted,
    lineHeight: 20
  },
  progressCard: {
    gap: 8
  },
  progressBar: {
    height: 10,
    backgroundColor: "#ece4d4",
    borderRadius: 999,
    overflow: "hidden"
  },
  progressFill: {
    height: "100%",
    backgroundColor: theme.colors.primary
  },
  listRow: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f1ebdd"
  },
  listTitle: {
    color: theme.colors.ink,
    fontWeight: "700"
  },
  listMeta: {
    color: theme.colors.muted,
    marginTop: 4
  },
  emptyText: {
    color: theme.colors.muted
  },
  moduleCard: {
    gap: 10,
    marginBottom: 12
  },
  moduleTitle: {
    color: theme.colors.ink,
    fontWeight: "800",
    fontSize: 16
  },
  lessonPill: {
    padding: theme.spacing.sm,
    borderRadius: theme.radius.md,
    backgroundColor: "#e8f7ef",
    borderWidth: 1,
    borderColor: "#b9e5c9"
  },
  lessonPillCurrent: {
    borderColor: theme.colors.secondary,
    backgroundColor: "#e8f1ff"
  },
  lessonPillDone: {
    backgroundColor: "#d8efe1"
  },
  lessonPillLocked: {
    backgroundColor: "#f4efe4",
    borderColor: "#e0d5be"
  },
  lessonPillTitle: {
    color: theme.colors.ink,
    fontWeight: "700"
  },
  lessonPillMeta: {
    color: theme.colors.muted,
    marginTop: 4
  },
  lessonExplanation: {
    color: theme.colors.ink,
    lineHeight: 22
  },
  lessonInfo: {
    color: theme.colors.secondary,
    fontWeight: "700"
  },
  exerciseCard: {
    backgroundColor: "#fbf8f1",
    borderRadius: theme.radius.md,
    padding: theme.spacing.sm,
    gap: 10
  },
  exerciseStep: {
    color: theme.colors.primary,
    fontWeight: "800",
    textTransform: "uppercase",
    fontSize: 12
  },
  optionButton: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    padding: 12,
    marginTop: 8
  },
  optionButtonActive: {
    borderColor: theme.colors.primary,
    backgroundColor: "#e8f7ef"
  },
  optionLabel: {
    color: theme.colors.ink
  },
  optionWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  codeSnippet: {
    backgroundColor: "#10231b",
    color: "#d6fbe7",
    borderRadius: theme.radius.md,
    padding: 12,
    overflow: "hidden"
  },
  feedbackBox: {
    backgroundColor: "#f8f2e3",
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    gap: 8
  },
  feedbackTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: theme.colors.ink
  },
  feedbackText: {
    color: theme.colors.ink
  },
  reviewExercise: {
    paddingVertical: 8
  },
  levelBadge: {
    backgroundColor: theme.colors.accent,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999
  },
  levelBadgeText: {
    color: "#493704",
    fontWeight: "800"
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  }
});
