import { SafeAreaView, ScrollView, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { BrandMark, Field, PrimaryButton } from "../components/ui";
import { styles } from "../styles";

export function AuthScreen({ authForm, message, setAuthForm, onEnter }) {
  return (
    <SafeAreaView style={styles.authSafeArea}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.authContent} showsVerticalScrollIndicator={false}>
        <View style={styles.authHero}>
          <BrandMark size={106} />
          <Text style={styles.authTitle}>Aprenda Expo em microlicoes.</Text>
          <Text style={styles.authText}>
            Trilha, feedback imediato, XP, nivel, ofensiva diaria e revisao rodam direto no app.
          </Text>
        </View>

        <View style={styles.authPanel}>
          <Text style={styles.panelTitle}>Comecar MVP mobile</Text>
          <Field
            autoCapitalize="words"
            label="Nome"
            value={authForm.name}
            onChangeText={(value) => setAuthForm((current) => ({ ...current, name: value }))}
          />
          <Field
            autoCapitalize="none"
            keyboardType="email-address"
            label="Email"
            value={authForm.email}
            onChangeText={(value) => setAuthForm((current) => ({ ...current, email: value }))}
          />
          {message ? <Text style={styles.errorText}>{message}</Text> : null}
          <PrimaryButton label="Entrar na trilha Expo" onPress={onEnter} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
