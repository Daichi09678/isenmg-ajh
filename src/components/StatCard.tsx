import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useAppTheme } from "../store/themeStore";
import { Spacing, Radius, FontSize, Shadows } from "../constants/theme";

interface StatCardProps {
  label: string;
  value: number;
  icon?: keyof typeof Feather.glyphMap;
}

export default function StatCard({ label, value, icon }: StatCardProps) {
  const { colors, mode } = useAppTheme();
  const currentShadow = mode === 'light' ? Shadows.light : {};

  return (
    <View
      style={[
        styles.card,
        { 
          backgroundColor: colors.surface, 
          borderColor: mode === 'dark' ? colors.border : "transparent",
        },
        currentShadow
      ]}
    >
      <View style={[styles.iconBox, { backgroundColor: `${colors.accent}15` }]}>
        {icon && <Feather name={icon} size={18} color={colors.accent} />}
      </View>
      <View style={styles.content}>
        <Text style={[styles.value, { color: colors.text }]}>{value}</Text>
        <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderWidth: 1,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    alignItems: "flex-start",
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.sm,
  },
  content: {
    alignItems: "flex-start",
  },
  value: {
    fontSize: FontSize.xl,
    fontWeight: "800",
    marginBottom: 2,
  },
  label: {
    fontSize: FontSize.xs,
    fontWeight: "500",
  },
});
