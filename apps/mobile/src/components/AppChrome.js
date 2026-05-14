import { Pressable, Text, View } from "react-native";
import { BrandMark, StatPill } from "./ui";
import { styles } from "../styles";

export const TABS = [
  { id: "path", label: "Trilha", icon: "1" },
  { id: "practice", label: "Revisao", icon: "2" },
  { id: "profile", label: "Perfil", icon: "3" }
];

export function TopBar({ achievements, user }) {
  return (
    <View style={styles.topBar}>
      <View style={styles.profileLine}>
        <BrandMark size={56} />
        <View style={styles.profileCopy}>
          <Text style={styles.eyebrow}>Ola, {user.name}</Text>
          <Text style={styles.screenTitle}>Trilha Expo</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <StatPill label="Nivel" value={String(user.level)} tone="blue" />
        <StatPill label="XP" value={String(user.xp)} tone="gold" />
        <StatPill label="Dias" value={String(user.streak)} tone="green" />
        <StatPill label="Badges" value={String(achievements.length)} tone="red" />
      </View>
    </View>
  );
}

export function BottomNav({ currentTab, onChange }) {
  return (
    <View style={styles.bottomNav}>
      {TABS.map((item) => {
        const active = currentTab === item.id;

        return (
          <Pressable
            key={item.id}
            style={[styles.navItem, active ? styles.navItemActive : null]}
            onPress={() => onChange(item.id)}
          >
            <Text style={[styles.navIcon, active ? styles.navIconActive : null]}>{item.icon}</Text>
            <Text style={[styles.navText, active ? styles.navTextActive : null]}>{item.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
