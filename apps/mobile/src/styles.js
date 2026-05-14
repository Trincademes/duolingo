import { Platform, StyleSheet } from "react-native";
import { theme } from "./theme";

const heroShadow = Platform.select({
  web: {
    boxShadow: `0px 10px 18px ${theme.colors.primaryShadow}`
  },
  default: {
    shadowColor: theme.colors.primaryShadow,
    shadowOpacity: 0.18,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 5
  }
});

const brandShadow = Platform.select({
  web: {
    boxShadow: `0px 6px 10px ${theme.colors.primaryShadow}`
  },
  default: {
    shadowColor: theme.colors.primaryShadow,
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4
  }
});

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background
  },
  authSafeArea: {
    flex: 1,
    backgroundColor: theme.colors.backgroundStrong
  },
  shell: {
    flex: 1
  },
  content: {
    padding: theme.spacing.md,
    paddingBottom: 120,
    gap: theme.spacing.md
  },
  centerScreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  loadingText: {
    color: theme.colors.primaryDark,
    fontWeight: "900"
  },
  authContent: {
    padding: theme.spacing.lg,
    gap: theme.spacing.lg
  },
  authHero: {
    minHeight: 330,
    justifyContent: "center",
    gap: theme.spacing.md
  },
  authTitle: {
    color: theme.colors.ink,
    fontSize: 38,
    lineHeight: 42,
    fontWeight: "900"
  },
  authText: {
    color: theme.colors.muted,
    fontSize: 17,
    lineHeight: 25
  },
  authPanel: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: theme.spacing.md
  },
  topBar: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    gap: theme.spacing.md
  },
  profileLine: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm
  },
  profileCopy: {
    flex: 1
  },
  eyebrow: {
    color: theme.colors.muted,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  screenTitle: {
    color: theme.colors.ink,
    fontSize: 26,
    fontWeight: "900"
  },
  statsRow: {
    flexDirection: "row",
    gap: 8
  },
  statPill: {
    flex: 1,
    borderRadius: theme.radius.lg,
    paddingVertical: 10,
    alignItems: "center"
  },
  stat_green: {
    backgroundColor: "#eaf8d2"
  },
  stat_blue: {
    backgroundColor: theme.colors.blueSoft
  },
  stat_gold: {
    backgroundColor: "#fff3bf"
  },
  stat_red: {
    backgroundColor: "#ffe9e7"
  },
  statValue: {
    color: theme.colors.ink,
    fontSize: 18,
    fontWeight: "900"
  },
  statLabel: {
    color: theme.colors.muted,
    fontSize: 10,
    fontWeight: "800",
    textTransform: "uppercase"
  },
  stack: {
    gap: theme.spacing.md
  },
  stackSmall: {
    gap: theme.spacing.sm
  },
  heroCard: {
    backgroundColor: theme.colors.primary,
    borderRadius: 30,
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
    ...heroShadow
  },
  heroCopy: {
    gap: 8
  },
  heroLabel: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  heroTitle: {
    color: "#ffffff",
    fontSize: 30,
    lineHeight: 34,
    fontWeight: "900"
  },
  heroText: {
    color: "rgba(255,255,255,0.9)",
    lineHeight: 22
  },
  progressText: {
    color: "#ffffff",
    fontWeight: "900"
  },
  unitBlock: {
    gap: theme.spacing.md
  },
  unitHeader: {
    backgroundColor: theme.colors.blue,
    borderRadius: 22,
    padding: theme.spacing.md
  },
  unitTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "900"
  },
  unitSubtitle: {
    color: "rgba(255,255,255,0.88)",
    marginTop: 4
  },
  pathWrap: {
    gap: theme.spacing.sm
  },
  pathNodeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm
  },
  pathNodeLeft: {
    justifyContent: "flex-start"
  },
  pathNodeRight: {
    justifyContent: "flex-end"
  },
  pathNode: {
    width: 76,
    height: 76,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4
  },
  pathNodeDone: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primaryDark
  },
  pathNodeOpen: {
    backgroundColor: theme.colors.blue,
    borderColor: theme.colors.blueDark
  },
  pathNodeLocked: {
    backgroundColor: theme.colors.border,
    borderColor: theme.colors.borderStrong
  },
  pathNodeText: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "900"
  },
  pathNodeCopy: {
    maxWidth: 220,
    backgroundColor: theme.colors.surface,
    borderRadius: 18,
    padding: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border
  },
  pathLessonTitle: {
    color: theme.colors.ink,
    fontWeight: "900"
  },
  pathLessonMeta: {
    color: theme.colors.muted,
    marginTop: 3
  },
  sectionPanel: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    gap: theme.spacing.md
  },
  sectionTitle: {
    color: theme.colors.ink,
    fontSize: 22,
    fontWeight: "900"
  },
  panelTitle: {
    color: theme.colors.ink,
    fontSize: 24,
    fontWeight: "900"
  },
  mutedText: {
    color: theme.colors.muted,
    lineHeight: 21
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm
  },
  badgeIcon: {
    width: 52,
    height: 52,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff3bf"
  },
  badgeIconText: {
    color: "#8b6500",
    fontWeight: "900"
  },
  badgeTitle: {
    color: theme.colors.ink,
    fontWeight: "900"
  },
  lessonHeader: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    gap: 10
  },
  lessonTitle: {
    color: theme.colors.ink,
    fontSize: 28,
    fontWeight: "900"
  },
  exerciseCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.lg,
    gap: theme.spacing.md
  },
  exerciseType: {
    color: theme.colors.blueDark,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  exercisePrompt: {
    color: theme.colors.ink,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: "900"
  },
  answerOption: {
    minHeight: 62,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: theme.colors.borderStrong,
    backgroundColor: "#ffffff",
    paddingHorizontal: theme.spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm
  },
  answerOptionActive: {
    borderColor: theme.colors.blue,
    backgroundColor: theme.colors.blueSoft
  },
  answerDot: {
    width: 18,
    height: 18,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: theme.colors.borderStrong
  },
  answerDotActive: {
    backgroundColor: theme.colors.blue,
    borderColor: theme.colors.blue
  },
  answerText: {
    flex: 1,
    color: theme.colors.ink,
    fontWeight: "800",
    lineHeight: 20
  },
  answerTextActive: {
    color: theme.colors.blueDark
  },
  orderBox: {
    minHeight: 58,
    borderRadius: 18,
    backgroundColor: theme.colors.surfaceMuted,
    justifyContent: "center",
    paddingHorizontal: theme.spacing.md
  },
  orderLabel: {
    color: theme.colors.ink,
    fontWeight: "800"
  },
  feedbackPanel: {
    borderRadius: theme.radius.xl,
    padding: theme.spacing.md,
    gap: theme.spacing.sm
  },
  feedbackOk: {
    backgroundColor: "#eaf8d2"
  },
  feedbackNo: {
    backgroundColor: "#ffe9e7"
  },
  feedbackTitle: {
    color: theme.colors.ink,
    fontSize: 24,
    fontWeight: "900"
  },
  feedbackText: {
    color: theme.colors.ink,
    lineHeight: 22
  },
  resultPanel: {
    borderRadius: 30,
    padding: theme.spacing.lg,
    gap: theme.spacing.sm
  },
  resultPassed: {
    backgroundColor: "#eaf8d2"
  },
  resultFailed: {
    backgroundColor: "#ffe9e7"
  },
  resultTitle: {
    color: theme.colors.ink,
    fontSize: 30,
    fontWeight: "900"
  },
  resultMeta: {
    color: theme.colors.ink,
    fontWeight: "900"
  },
  resultText: {
    color: theme.colors.ink,
    lineHeight: 22
  },
  reviewRow: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    alignItems: "center",
    backgroundColor: theme.colors.surfaceMuted,
    borderRadius: 18,
    padding: theme.spacing.sm
  },
  reviewIcon: {
    width: 46,
    height: 46,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffe9b7"
  },
  reviewIconText: {
    color: "#9c6500",
    fontWeight: "900"
  },
  reviewTitle: {
    color: theme.colors.ink,
    fontWeight: "900"
  },
  historyRow: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingBottom: theme.spacing.sm
  },
  historyTitle: {
    color: theme.colors.ink,
    fontWeight: "900"
  },
  profileCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 24,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center"
  },
  avatarText: {
    color: "#ffffff",
    fontSize: 26,
    fontWeight: "900"
  },
  profileName: {
    color: theme.colors.ink,
    fontSize: 24,
    fontWeight: "900"
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    justifyContent: "space-between"
  },
  switchTitle: {
    color: theme.colors.ink,
    fontWeight: "900"
  },
  rankingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm
  },
  rankingPlace: {
    width: 36,
    color: theme.colors.blueDark,
    fontWeight: "900"
  },
  rankingName: {
    flex: 1,
    color: theme.colors.ink,
    fontWeight: "900"
  },
  rankingXp: {
    color: theme.colors.primaryDark,
    fontWeight: "900"
  },
  field: {
    gap: 8
  },
  fieldLabel: {
    color: theme.colors.ink,
    fontWeight: "900"
  },
  input: {
    minHeight: 54,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.borderStrong,
    backgroundColor: "#ffffff",
    color: theme.colors.ink,
    paddingHorizontal: theme.spacing.md
  },
  button: {
    minHeight: 56,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: theme.spacing.md
  },
  buttonSecondary: {
    backgroundColor: theme.colors.blueSoft
  },
  buttonGhost: {
    backgroundColor: theme.colors.surfaceMuted
  },
  buttonDisabled: {
    opacity: 0.5
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "900",
    fontSize: 15
  },
  buttonTextDark: {
    color: theme.colors.blueDark
  },
  message: {
    backgroundColor: "#fff5d9",
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: "#f4dd95",
    padding: theme.spacing.sm
  },
  messageText: {
    color: "#8d5d00",
    fontWeight: "800"
  },
  progressTrack: {
    height: 14,
    borderRadius: 999,
    backgroundColor: "rgba(0,0,0,0.12)",
    overflow: "hidden"
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: theme.colors.gold
  },
  bottomNav: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: theme.spacing.md,
    paddingTop: 10,
    paddingBottom: 18,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.surface
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    borderRadius: 18,
    paddingVertical: 9
  },
  navItemActive: {
    backgroundColor: theme.colors.surfaceMuted
  },
  navIcon: {
    color: theme.colors.muted,
    fontWeight: "900"
  },
  navIconActive: {
    color: theme.colors.primaryDark
  },
  navText: {
    color: theme.colors.muted,
    fontSize: 11,
    fontWeight: "900"
  },
  navTextActive: {
    color: theme.colors.primaryDark
  },
  brand: {
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    ...brandShadow
  },
  brandEyes: {
    flexDirection: "row",
    gap: 10
  },
  brandEye: {
    backgroundColor: "#ffffff",
    borderRadius: 999
  },
  brandBeak: {
    position: "absolute",
    bottom: 17,
    backgroundColor: theme.colors.gold,
    transform: [{ rotate: "45deg" }]
  },
  flex: {
    flex: 1
  }
});
