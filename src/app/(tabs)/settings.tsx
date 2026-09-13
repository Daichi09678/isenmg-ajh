import React from "react";
import { View, Text, StyleSheet, ScrollView, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useAppTheme } from "../../store/themeStore";
import { Spacing, FontSize, Radius } from "../../constants/theme";

export default function SettingsScreen() {
  const { colors, mode, toggleTheme } = useAppTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={colors.gradientPrimary}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <SafeAreaView edges={["top"]} style={styles.headerSafeArea}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Pengaturan</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>TAMPILAN</Text>
          
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Feather name={mode === "dark" ? "moon" : "sun"} size={20} color={colors.text} />
              <Text style={[styles.rowLabel, { color: colors.text }]}>Mode Gelap (Dark Mode)</Text>
            </View>
            <Switch
              value={mode === "dark"}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.border, true: colors.accent }}
            />
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>NOTIFIKASI</Text>
          
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Feather name="bell" size={20} color={colors.text} />
              <Text style={[styles.rowLabel, { color: colors.text }]}>Pengingat Harian</Text>
            </View>
            <Switch value={true} trackColor={{ false: colors.border, true: colors.accent }} />
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Feather name="clock" size={20} color={colors.text} />
              <Text style={[styles.rowLabel, { color: colors.text }]}>Pengingat Deadline</Text>
            </View>
            <Switch value={true} trackColor={{ false: colors.border, true: colors.accent }} />
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>TENTANG APLIKASI</Text>
          
          <View style={styles.row}>
            <Text style={[styles.rowLabel, { color: colors.text }]}>Versi Aplikasi</Text>
            <Text style={[styles.rowValue, { color: colors.textSecondary }]}>v1.0.0</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerGradient: {
    borderBottomLeftRadius: Radius.xl * 1.5,
    borderBottomRightRadius: Radius.xl * 1.5,
    paddingBottom: Spacing.xl,
  },
  headerSafeArea: {
    paddingHorizontal: Spacing.lg,
  },
  headerContent: {
    marginTop: Spacing.md,
    alignItems: "flex-start",
  },
  headerTitle: {
    fontSize: FontSize.xxxl,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  content: { padding: Spacing.lg, gap: Spacing.lg },
  section: { borderRadius: Radius.lg, borderWidth: 1, overflow: "hidden" },
  sectionTitle: { fontSize: FontSize.xs, fontWeight: "700", paddingHorizontal: Spacing.md, paddingTop: Spacing.md, paddingBottom: Spacing.sm },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: Spacing.md, paddingVertical: Spacing.md },
  rowLeft: { flexDirection: "row", alignItems: "center", gap: Spacing.md },
  rowLabel: { fontSize: FontSize.md, fontWeight: "500" },
  rowValue: { fontSize: FontSize.sm },
  divider: { height: 1, marginHorizontal: Spacing.md },
});
