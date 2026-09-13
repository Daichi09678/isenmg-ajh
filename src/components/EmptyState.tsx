import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useAppTheme } from "../store/themeStore";
import { Spacing, FontSize } from "../constants/theme";

export default function EmptyState({ title }: { title: string }) {
  const { colors } = useAppTheme();

  return (
    <View style={styles.container}>
      <Feather name="inbox" size={48} color={colors.border} />
      <Text style={[styles.title, { color: colors.textSecondary }]}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.xxl,
  },
  title: {
    marginTop: Spacing.md,
    fontSize: FontSize.md,
  },
});
