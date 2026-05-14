import { Pressable, Text, View } from "react-native";
import { EXPO_COURSE, EXPO_LESSONS } from "../data/expoCourse";
import { isLessonUnlocked } from "../utils/progress";
import { PrimaryButton, ProgressBar } from "../components/ui";
import { styles } from "../styles";

export function PathScreen({ achievements, completedLessons, courseProgress, nextLesson, onOpenLesson }) {
  return (
    <View style={styles.stack}>
      <View style={styles.heroCard}>
        <View style={styles.heroCopy}>
          <Text style={styles.heroLabel}>Curso unico</Text>
          <Text style={styles.heroTitle}>Expo para mobile, no estilo Duolingo.</Text>
          <Text style={styles.heroText}>{EXPO_COURSE.description}</Text>
        </View>
        <ProgressBar value={courseProgress} />
        <Text style={styles.progressText}>{courseProgress}% completo</Text>
        <PrimaryButton label={`Continuar: ${nextLesson.title}`} onPress={() => onOpenLesson(nextLesson.id)} />
      </View>

      {EXPO_COURSE.modules.map((module) => (
        <View key={module.id} style={styles.unitBlock}>
          <View style={styles.unitHeader}>
            <Text style={styles.unitTitle}>{module.title}</Text>
            <Text style={styles.unitSubtitle}>{module.subtitle}</Text>
          </View>

          <View style={styles.pathWrap}>
            {module.lessons.map((lesson, index) => {
              const unlocked = isLessonUnlocked(lesson.id, completedLessons);
              const done = completedLessons.includes(lesson.id);

              return (
                <PathNode
                  key={lesson.id}
                  done={done}
                  index={EXPO_LESSONS.findIndex((item) => item.id === lesson.id) + 1}
                  lesson={lesson}
                  offset={index % 2 === 0 ? "left" : "right"}
                  unlocked={unlocked}
                  onPress={() => onOpenLesson(lesson.id)}
                />
              );
            })}
          </View>
        </View>
      ))}

      <View style={styles.sectionPanel}>
        <Text style={styles.sectionTitle}>Conquistas</Text>
        {achievements.length === 0 ? (
          <Text style={styles.mutedText}>Complete sua primeira licao para liberar badges.</Text>
        ) : (
          achievements.map((achievement) => (
            <View key={achievement.id} style={styles.badgeRow}>
              <View style={styles.badgeIcon}>
                <Text style={styles.badgeIconText}>{achievement.short}</Text>
              </View>
              <View style={styles.flex}>
                <Text style={styles.badgeTitle}>{achievement.title}</Text>
                <Text style={styles.mutedText}>{achievement.description}</Text>
              </View>
            </View>
          ))
        )}
      </View>
    </View>
  );
}

function PathNode({ done, index, lesson, offset, onPress, unlocked }) {
  return (
    <View style={[styles.pathNodeRow, offset === "right" ? styles.pathNodeRight : styles.pathNodeLeft]}>
      <Pressable
        disabled={!unlocked}
        style={[
          styles.pathNode,
          done ? styles.pathNodeDone : null,
          unlocked && !done ? styles.pathNodeOpen : null,
          !unlocked ? styles.pathNodeLocked : null
        ]}
        onPress={onPress}
      >
        <Text style={styles.pathNodeText}>{done ? "OK" : unlocked ? String(index) : "--"}</Text>
      </Pressable>
      <View style={styles.pathNodeCopy}>
        <Text style={styles.pathLessonTitle}>{lesson.title}</Text>
        <Text style={styles.pathLessonMeta}>{lesson.xp} XP - minimo {lesson.minCorrect} acertos</Text>
      </View>
    </View>
  );
}
