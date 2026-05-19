import { SafeAreaView, ScrollView, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { BrandMark, Field, PrimaryButton } from "../components/ui";
import { styles } from "../styles";

export function AuthScreen({ authForm, authMode, message, setAuthForm, setAuthMode, onEnter }) {
  const isRegister = authMode === "register";

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
          <Text style={styles.panelTitle}>{isRegister ? "Criar conta" : "Entrar"}</Text>
          {isRegister ? (
            <Field
              autoCapitalize="words"
              label="Nome"
              value={authForm.name}
              onChangeText={(value) => setAuthForm((current) => ({ ...current, name: value }))}
            />
          ) : null}
          <Field
            autoCapitalize="none"
            keyboardType="email-address"
            label="Email"
            value={authForm.email}
            onChangeText={(value) => setAuthForm((current) => ({ ...current, email: value }))}
          />
          <Field
            autoCapitalize="none"
            label="Senha"
            secureTextEntry
            value={authForm.password}
            onChangeText={(value) => setAuthForm((current) => ({ ...current, password: value }))}
          />
          {message ? <Text style={styles.messageText}>{message}</Text> : null}
          <PrimaryButton label={isRegister ? "Cadastrar e entrar" : "Entrar na trilha"} onPress={onEnter} />
          <PrimaryButton
            label={isRegister ? "Ja tenho conta" : "Criar nova conta"}
            secondary
            onPress={() => {
              setAuthMode(isRegister ? "login" : "register");
              clearPassword(setAuthForm);
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function clearPassword(setAuthForm) {
  setAuthForm((current) => ({ ...current, password: "" }));
}
