import { Pressable, Text, TextInput, View } from "react-native";
import { styles } from "../styles";
import { theme } from "../theme";

export function BrandMark({ size }) {
  const eye = Math.round(size * 0.2);

  return (
    <View style={[styles.brand, { width: size, height: size, borderRadius: Math.round(size * 0.3) }]}>
      <View style={styles.brandEyes}>
        <View style={[styles.brandEye, { width: eye, height: eye }]} />
        <View style={[styles.brandEye, { width: eye, height: eye }]} />
      </View>
      <View style={[styles.brandBeak, { width: eye, height: eye }]} />
    </View>
  );
}

export function Field({ label, ...props }) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput placeholderTextColor={theme.colors.muted} style={styles.input} {...props} />
    </View>
  );
}

export function PrimaryButton({ disabled, ghost, label, onPress, secondary }) {
  return (
    <Pressable
      disabled={disabled}
      style={[
        styles.button,
        secondary ? styles.buttonSecondary : null,
        ghost ? styles.buttonGhost : null,
        disabled ? styles.buttonDisabled : null
      ]}
      onPress={onPress}
    >
      <Text style={[styles.buttonText, secondary || ghost ? styles.buttonTextDark : null]}>{label}</Text>
    </Pressable>
  );
}

export function AnswerOption({ active, disabled, label, onPress }) {
  return (
    <Pressable
      disabled={disabled}
      style={[styles.answerOption, active ? styles.answerOptionActive : null]}
      onPress={onPress}
    >
      <View style={[styles.answerDot, active ? styles.answerDotActive : null]} />
      <Text style={[styles.answerText, active ? styles.answerTextActive : null]}>{label}</Text>
    </Pressable>
  );
}

export function StatPill({ label, tone, value }) {
  return (
    <View style={[styles.statPill, styles[`stat_${tone}`]]}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export function ProgressBar({ value }) {
  return (
    <View style={styles.progressTrack}>
      <View style={[styles.progressFill, { width: `${Math.max(0, Math.min(100, value))}%` }]} />
    </View>
  );
}

export function Message({ text }) {
  return (
    <View style={styles.message}>
      <Text style={styles.messageText}>{text}</Text>
    </View>
  );
}
