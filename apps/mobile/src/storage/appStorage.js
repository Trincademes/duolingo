import AsyncStorage from "@react-native-async-storage/async-storage";

export const STORAGE_KEY = "expo-duo-mobile-mvp";

export const INITIAL_STATE = {
  token: "",
  user: {
    name: "Pedro",
    email: "",
    xp: 0,
    streak: 0,
    level: 1,
    rankingOptIn: false
  },
  completedLessons: [],
  history: [],
  mistakes: [],
  notification: {
    enabled: false,
    time: "19:00"
  }
};

export async function loadProgress() {
  const cached = await AsyncStorage.getItem(STORAGE_KEY);
  return cached ? { ...INITIAL_STATE, ...JSON.parse(cached) } : INITIAL_STATE;
}

export async function saveProgress(progress) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export async function clearProgress() {
  await AsyncStorage.removeItem(STORAGE_KEY);
}
