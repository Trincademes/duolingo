import { Component, useEffect, useMemo, useState } from "react";
import { SafeAreaView, ScrollView, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { BottomNav, TopBar } from "./src/components/AppChrome";
import { Message } from "./src/components/ui";
import { AuthScreen } from "./src/screens/AuthScreen";
import { LessonScreen } from "./src/screens/LessonScreen";
import { PathScreen } from "./src/screens/PathScreen";
import { PracticeScreen } from "./src/screens/PracticeScreen";
import { ProfileScreen } from "./src/screens/ProfileScreen";
import { getRanking, login, register, syncStats, updateProfile } from "./src/services/api";
import { configureNotifications, scheduleDailyReminder } from "./src/services/notifications";
import { clearProgress, INITIAL_STATE, loadProgress, saveProgress } from "./src/storage/appStorage";
import { styles } from "./src/styles";
import {
  completeLesson,
  findLesson,
  getAchievements,
  getCourseProgress,
  getNextLesson,
  getReviewItems,
  isCorrect,
  isLessonUnlocked,
  scoreLesson
} from "./src/utils/progress";

function confirmReset(onConfirm) {
  if (typeof window !== "undefined") {
    if (typeof window !== "undefined" && window.confirm("Apagar XP, streak e historico local?")) {
      onConfirm();
    }
    return;
  }

  onConfirm();
}

class AppErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <SafeAreaView style={styles.safeArea}>
          <StatusBar style="dark" />
          <View style={styles.centerScreen}>
            <View style={styles.sectionPanel}>
              <Text style={styles.sectionTitle}>O app falhou ao abrir</Text>
              <Text style={styles.mutedText}>{String(this.state.error?.message || this.state.error)}</Text>
            </View>
          </View>
        </SafeAreaView>
      );
    }

    return this.props.children;
  }
}

function AppContent() {
  const [appState, setAppState] = useState(INITIAL_STATE);
  const [authReady, setAuthReady] = useState(false);
  const [authForm, setAuthForm] = useState({ name: "", email: "", password: "" });
  const [authMode, setAuthMode] = useState("login");
  const [ranking, setRanking] = useState([]);
  const [tab, setTab] = useState("path");
  const [activeLessonId, setActiveLessonId] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [feedback, setFeedback] = useState(null);
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    try {
      configureNotifications();
    } catch (_error) {
      setMessage("Notificacoes indisponiveis neste ambiente.");
    }
  }, []);

  useEffect(() => {
    loadProgress()
      .then(setAppState)
      .catch(() => setAppState(INITIAL_STATE))
      .finally(() => setAuthReady(true));
  }, []);

  useEffect(() => {
    if (!authReady) {
      return;
    }

    saveProgress(appState).catch(() => {});
  }, [appState, authReady]);

  useEffect(() => {
    if (tab === "profile" && appState.token && appState.user.rankingOptIn) {
      refreshRanking(appState.token);
    }
  }, [tab, appState.token, appState.user.rankingOptIn]);

  const activeLesson = useMemo(() => findLesson(activeLessonId), [activeLessonId]);
  const currentExercise = activeLesson?.exercises[currentIndex] ?? null;
  const achievements = getAchievements(appState);
  const courseProgress = getCourseProgress(appState.completedLessons);
  const nextLesson = getNextLesson(appState.completedLessons);
  const reviewItems = getReviewItems(appState);

  async function handleEnter() {
    const name = authForm.name.trim() || "Aluno Expo";
    const email = authForm.email.trim();
    const password = authForm.password;

    if (!email) {
      setMessage("Informe um email para entrar.");
      return;
    }

    if (!password || password.length < 6) {
      setMessage("Informe uma senha com pelo menos 6 caracteres.");
      return;
    }

    try {
      const session = authMode === "register"
        ? await register({ name, email, password })
        : await login({ email, password });

      setAppState((current) => ({
        ...current,
        token: session.token,
        user: {
          ...current.user,
          ...session.user
        }
      }));
      setAuthForm({ name: "", email: "", password: "" });
      setMessage("");
      refreshRanking(session.token);
    } catch (error) {
      setMessage(error.message);
    }
  }

  function openLesson(lessonId) {
    const lesson = findLesson(lessonId);

    if (!lesson || !isLessonUnlocked(lesson.id, appState.completedLessons)) {
      setMessage("Complete a licao anterior para liberar esta etapa.");
      return;
    }

    setActiveLessonId(lessonId);
    setCurrentIndex(0);
    setAnswers({});
    setFeedback(null);
    setResult(null);
    setMessage("");
    setTab("lesson");
  }

  function selectAnswer(value) {
    if (!currentExercise || feedback) {
      return;
    }

    setAnswers((current) => ({
      ...current,
      [currentExercise.id]: value
    }));
  }

  function checkAnswer() {
    if (!currentExercise) {
      return;
    }

    const answer = answers[currentExercise.id];
    const empty = answer === undefined || answer === "" || (Array.isArray(answer) && answer.length === 0);

    if (empty) {
      setMessage("Escolha uma resposta antes de verificar.");
      return;
    }

    setMessage("");
    setFeedback({
      correct: isCorrect(currentExercise, answer),
      explanation: currentExercise.explanation
    });
  }

  function nextExercise() {
    if (!activeLesson) {
      return;
    }

    if (currentIndex < activeLesson.exercises.length - 1) {
      setCurrentIndex((current) => current + 1);
      setFeedback(null);
      return;
    }

    finishLesson();
  }

  function finishLesson() {
    if (!activeLesson) {
      return;
    }

    const score = scoreLesson(activeLesson, answers, appState.completedLessons);
    const nextState = completeLesson(appState, activeLesson, score);

    setAppState(nextState);
    setResult(score);
    setFeedback(null);

    if (nextState.token) {
      syncStats(nextState.token, nextState.user)
        .then((user) => {
          setAppState((current) => ({ ...current, user: { ...current.user, ...user } }));
          if (nextState.user.rankingOptIn) {
            refreshRanking(nextState.token);
          }
        })
        .catch(() => setMessage("Progresso salvo localmente. A API nao respondeu agora."));
    }
  }

  async function refreshRanking(token = appState.token) {
    try {
      const items = await getRanking(token);
      setRanking(items);
    } catch (_error) {
      setRanking([]);
    }
  }

  async function saveRankingOptIn(value) {
    const nextUser = { ...appState.user, rankingOptIn: value };
    setAppState((current) => ({ ...current, user: nextUser }));

    if (!appState.token) {
      return;
    }

    try {
      const user = await updateProfile(appState.token, { rankingOptIn: value });
      setAppState((current) => ({ ...current, user: { ...current.user, ...user } }));

      if (value) {
        await syncStats(appState.token, nextUser);
        refreshRanking(appState.token);
      } else {
        setRanking([]);
      }
    } catch (_error) {
      setMessage("Nao foi possivel atualizar o ranking na API.");
    }
  }

  async function saveNotification(nextNotification = appState.notification) {
    setAppState((current) => ({ ...current, notification: nextNotification }));

    try {
      const nextMessage = await scheduleDailyReminder(nextNotification);
      setMessage(nextMessage);
    } catch (_error) {
      setMessage("Nao foi possivel configurar notificacoes neste dispositivo.");
    }
  }

  async function resetProgress() {
    await clearProgress();
    setAppState(INITIAL_STATE);
    setAuthForm({ name: "", email: "", password: "" });
    setActiveLessonId(null);
    setTab("path");
    setMessage("");
  }

  if (!authReady) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="dark" />
        <View style={styles.centerScreen}>
          <Text style={styles.loadingText}>Carregando Expo...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!appState.token || !appState.user.email) {
    return (
      <AuthScreen
        authForm={authForm}
        authMode={authMode}
        message={message}
        setAuthForm={setAuthForm}
        setAuthMode={setAuthMode}
        onEnter={handleEnter}
      />
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.shell}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <TopBar user={appState.user} achievements={achievements} />

          {message ? <Message text={message} /> : null}

          {tab === "path" ? (
            <PathScreen
              achievements={achievements}
              completedLessons={appState.completedLessons}
              courseProgress={courseProgress}
              nextLesson={nextLesson}
              onOpenLesson={openLesson}
            />
          ) : null}

          {tab === "lesson" ? (
            <LessonScreen
              answers={answers}
              currentExercise={currentExercise}
              currentIndex={currentIndex}
              feedback={feedback}
              lesson={activeLesson}
              result={result}
              onBack={() => setTab("path")}
              onCheck={checkAnswer}
              onNext={nextExercise}
              onSelectAnswer={selectAnswer}
            />
          ) : null}

          {tab === "practice" ? (
            <PracticeScreen
              history={appState.history}
              reviewItems={reviewItems}
              onOpenLesson={openLesson}
            />
          ) : null}

          {tab === "profile" ? (
            <ProfileScreen
              appState={appState}
              ranking={ranking}
              onReset={() => confirmReset(resetProgress)}
              onSaveNotification={saveNotification}
              onSaveRankingOptIn={saveRankingOptIn}
            />
          ) : null}
        </ScrollView>

        <BottomNav currentTab={tab === "lesson" ? "path" : tab} onChange={setTab} />
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <AppErrorBoundary>
      <AppContent />
    </AppErrorBoundary>
  );
}
