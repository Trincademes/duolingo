import { Switch, Text, View } from "react-native";
import { PrimaryButton } from "../components/ui";
import { styles } from "../styles";

export function ProfileScreen({ appState, ranking, onReset, onSaveNotification, onSaveRankingOptIn }) {
  const notification = appState.notification;

  return (
    <View style={styles.stack}>
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{appState.user.name.slice(0, 1).toUpperCase()}</Text>
        </View>
        <View style={styles.flex}>
          <Text style={styles.profileName}>{appState.user.name}</Text>
          <Text style={styles.mutedText}>Nivel {appState.user.level} - {appState.user.xp} XP - {appState.user.streak} dias</Text>
        </View>
      </View>

      <View style={styles.sectionPanel}>
        <Text style={styles.sectionTitle}>Preferencias</Text>
        <View style={styles.switchRow}>
          <View style={styles.flex}>
            <Text style={styles.switchTitle}>Ranking opcional</Text>
            <Text style={styles.mutedText}>Mostra seu XP no ranking salvo pela API.</Text>
          </View>
          <Switch
            value={appState.user.rankingOptIn}
            onValueChange={onSaveRankingOptIn}
          />
        </View>

        <View style={styles.switchRow}>
          <View style={styles.flex}>
            <Text style={styles.switchTitle}>Lembrete diario</Text>
            <Text style={styles.mutedText}>Agenda uma notificacao local as {notification.time}.</Text>
          </View>
          <Switch
            value={notification.enabled}
            onValueChange={(value) => onSaveNotification({ ...notification, enabled: value })}
          />
        </View>

        <PrimaryButton label="Salvar lembrete" secondary onPress={() => onSaveNotification(notification)} />
      </View>

      {appState.user.rankingOptIn ? (
        <View style={styles.sectionPanel}>
          <Text style={styles.sectionTitle}>Ranking de lideres</Text>
          {(ranking.length > 0 ? ranking : [{ name: appState.user.name, xp: appState.user.xp, level: appState.user.level }])
            .map((item, index) => (
              <View key={`${item.name}-${item.xp}`} style={styles.rankingRow}>
                <Text style={styles.rankingPlace}>{index + 1}</Text>
                <Text style={styles.rankingName}>{item.name}</Text>
                <Text style={styles.rankingXp}>{item.xp} XP</Text>
              </View>
            ))}
        </View>
      ) : null}

      <PrimaryButton label="Resetar progresso local" ghost onPress={onReset} />
    </View>
  );
}
