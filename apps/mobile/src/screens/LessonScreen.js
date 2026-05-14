import { Text, View } from "react-native";
import { AnswerOption, PrimaryButton, ProgressBar } from "../components/ui";
import { styles } from "../styles";

export function LessonScreen({
  answers,
  currentExercise,
  currentIndex,
  feedback,
  lesson,
  onBack,
  onCheck,
  onNext,
  onSelectAnswer,
  result
}) {
  if (!lesson) {
    return (
      <View style={styles.sectionPanel}>
        <Text style={styles.sectionTitle}>Escolha uma licao na trilha.</Text>
        <PrimaryButton label="Voltar" onPress={onBack} />
      </View>
    );
  }

  if (result) {
    return (
      <View style={styles.stack}>
        <View style={[styles.resultPanel, result.passed ? styles.resultPassed : styles.resultFailed]}>
          <Text style={styles.resultTitle}>{result.passed ? "Licao concluida" : "Tente novamente"}</Text>
          <Text style={styles.resultMeta}>
            {result.correctCount}/{result.total} corretas - {result.accuracy}% - {result.earnedXp} XP
          </Text>
          <Text style={styles.resultText}>
            {result.passed
              ? "Seu progresso foi salvo localmente e a proxima etapa foi liberada."
              : "Revise as respostas marcadas e refaca a licao para liberar o caminho."}
          </Text>
        </View>
        <PrimaryButton label="Voltar para trilha" onPress={onBack} />
      </View>
    );
  }

  const progress = Math.round(((currentIndex + (feedback ? 1 : 0)) / lesson.exercises.length) * 100);

  return (
    <View style={styles.stack}>
      <View style={styles.lessonHeader}>
        <Text style={styles.eyebrow}>Licao {currentIndex + 1} de {lesson.exercises.length}</Text>
        <Text style={styles.lessonTitle}>{lesson.title}</Text>
        <Text style={styles.mutedText}>{lesson.summary}</Text>
        <ProgressBar value={progress} />
      </View>

      <ExerciseCard
        answer={answers[currentExercise.id]}
        exercise={currentExercise}
        feedback={feedback}
        onSelectAnswer={onSelectAnswer}
      />

      {feedback ? (
        <View style={[styles.feedbackPanel, feedback.correct ? styles.feedbackOk : styles.feedbackNo]}>
          <Text style={styles.feedbackTitle}>{feedback.correct ? "Correto" : "Quase"}</Text>
          <Text style={styles.feedbackText}>{feedback.explanation}</Text>
          <PrimaryButton
            label={currentIndex < lesson.exercises.length - 1 ? "Continuar" : "Finalizar"}
            onPress={onNext}
          />
        </View>
      ) : (
        <PrimaryButton label="Verificar" onPress={onCheck} />
      )}
    </View>
  );
}

function ExerciseCard({ answer, exercise, feedback, onSelectAnswer }) {
  if (!exercise) {
    return null;
  }

  const options = exercise.type === "order" ? exercise.options : exercise.options ?? [true, false];
  const selectedOrder = Array.isArray(answer) ? answer : [];

  return (
    <View style={styles.exerciseCard}>
      <Text style={styles.exerciseType}>{exercise.type === "blank" ? "Complete" : exercise.type === "order" ? "Ordene" : "Escolha"}</Text>
      <Text style={styles.exercisePrompt}>{exercise.prompt}</Text>

      {exercise.type === "order" ? (
        <View style={styles.stackSmall}>
          <View style={styles.orderBox}>
            <Text style={styles.orderLabel}>
              {selectedOrder.length ? selectedOrder.join(" -> ") : "Toque nos passos na ordem correta"}
            </Text>
          </View>
          {options.map((option) => (
            <AnswerOption
              key={option}
              active={selectedOrder.includes(option)}
              disabled={Boolean(feedback)}
              label={option}
              onPress={() => {
                if (selectedOrder.includes(option)) {
                  onSelectAnswer(selectedOrder.filter((item) => item !== option));
                  return;
                }

                onSelectAnswer([...selectedOrder, option]);
              }}
            />
          ))}
        </View>
      ) : (
        <View style={styles.stackSmall}>
          {options.map((option) => (
            <AnswerOption
              key={String(option)}
              active={answer === option}
              disabled={Boolean(feedback)}
              label={typeof option === "boolean" ? (option ? "Verdadeiro" : "Falso") : option}
              onPress={() => onSelectAnswer(option)}
            />
          ))}
        </View>
      )}
    </View>
  );
}
