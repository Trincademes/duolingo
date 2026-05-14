import { Platform } from "react-native";

export function configureNotifications() {
  if (Platform.OS === "web") {
    return;
  }

  import("expo-notifications").then((Notifications) => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldPlaySound: false,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true
      })
    });
  });
}

export async function scheduleDailyReminder(notification) {
  if (Platform.OS === "web") {
    return "Notificacoes locais nao estao disponiveis no navegador.";
  }

  const Notifications = await import("expo-notifications");

  await Notifications.cancelAllScheduledNotificationsAsync();

  if (!notification.enabled) {
    return "Lembrete desligado.";
  }

  const permissions = await Notifications.requestPermissionsAsync();

  if (!permissions.granted) {
    return "Permissao de notificacao nao concedida.";
  }

  const [hour, minute] = notification.time.split(":").map(Number);

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Hora do Expo",
      body: "Uma microlicao mantem sua ofensiva viva."
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute
    }
  });

  return "Lembrete diario configurado.";
}
