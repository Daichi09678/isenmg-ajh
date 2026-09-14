import React from "react";
import { Pressable, Text, StyleSheet, PressableProps, ViewStyle } from "react-native";
import { useAppTheme } from "../store/themeStore";
import { Spacing, Radius, FontSize } from "../constants/theme";

interface ButtonProps extends PressableProps {
  label: string;
  variant?: "primary" | "outline" | "danger" | "secondary";
  style?: ViewStyle;
}

export default function Button({ label, variant = "primary", style, ...props }: ButtonProps) {
  const { colors } = useAppTheme();

  // Primary defaults to the Dark Brown ConcertGo color for high contrast CTA
  let bg = colors.text;
  let text = colors.background;
  let border = colors.text;

  if (variant === "secondary") {
    bg = colors.accent; // Orange CTA
    text = "#FFFFFF";
    border = colors.accent;
  } else if (variant === "outline") {
    bg = "transparent";
    text = colors.text;
    border = colors.border;
  } else if (variant === "danger") {
    bg = "#EF4444";
    text = "#FFFFFF";
    border = "#EF4444";
  }

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: bg,
          borderColor: border,
          opacity: pressed ? 0.85 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
        style,
      ]}
      {...props}
    >
      <Text style={[styles.label, { color: text }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: Radius.full,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: FontSize.md,
    fontWeight: "700",
  },
});
