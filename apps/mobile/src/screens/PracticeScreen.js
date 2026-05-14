import { Pressable, Text, View } from "react-native";
import { styles } from "../styles";

export function PracticeScreen({ history, onOpenLesson, reviewItems }) {
  return (
    <View style={styles.stack}>
      <View style={styles.sectionPanel}>
        <Text style={styles.sectionTitle}>Revisao adaptativa</Text>
        {reviewItems.length === 0 ? (
          <Text style={styles.mutedText}>Quando errar uma questao, ela aparece aqui para reforco.</Text>
        ) : (
          reviewItems.map((item) => (
            <Pressable key={item.exerciseId} style={styles.reviewRow} onPress={() => onOpenLesson(item.lessonId)}>
              <View style={styles.reviewIcon}>
                <Text style={styles.reviewIconText}>{item.count}</Text>
              </View>
              <View style={styles.flex}>
                <Text style={styles.reviewTitle}>{item.lessonTitle}</Text>
                <Text style={styles.mutedText}>{item.prompt}</Text>
              </View>
            </Pressable>
          ))
        )}
      </View>

      <View style={styles.sectionPanel}>
        <Text style={styles.sectionTitle}>Historico</Text>
        {history.length === 0 ? (
          <Text style={styles.mutedText}>Complete uma licao para registrar desempenho.</Text>
        ) : (
          history.slice(0, 6).map((item) => (
            <View key={`${item.lessonId}-${item.completedAt}`} style={styles.historyRow}>
              <Text style={styles.historyTitle}>{item.lessonTitle}</Text>
              <Text style={styles.mutedText}>{item.accuracy}% - {item.xp} XP</Text>
            </View>
          ))
        )}
      </View>
    </View>
  );
}
