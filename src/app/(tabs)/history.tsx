import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useAppTheme } from "../../store/themeStore";
import { Spacing, FontSize, Radius } from "../../constants/theme";

export default function HistoryScreen() {
  const { colors } = useAppTheme();

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
            <Text style={styles.headerTitle}>Riwayat Laporan</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.emptyBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Feather name="bar-chart" size={48} color={colors.textSecondary} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>Belum ada Laporan</Text>
          <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
            Selesaikan lebih banyak task untuk melihat statistik dan riwayat kinerja Anda di sini.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
  content: {
    padding: Spacing.lg,
    flex: 1,
    justifyContent: "center",
  },
  emptyBox: {
    padding: Spacing.xl,
    borderRadius: Radius.lg,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.md,
  },
  emptyTitle: {
    fontSize: FontSize.lg,
    fontWeight: "700",
  },
  emptySubtitle: {
    fontSize: FontSize.sm,
    textAlign: "center",
    lineHeight: 22,
  },
});
