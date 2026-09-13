import React from "react";
import { Pressable, Text, StyleSheet, PressableProps, ViewStyle } from "react-native";
import { useAppTheme } from "../store/themeStore";
import { Spacing, Radius, FontSize } from "../constants/theme";

interface ButtonProps extends PressableProps {
  label: string;
  variant?: "primary" | "outline" | "danger";
  style?: ViewStyle;
}

export default function Button({ label, variant = "primary", style, ...props }: ButtonProps) {
  const { colors } = useAppTheme();

  let bg = colors.accent;
  let text = colors.accentText;
  let border = colors.accent;

  if (variant === "outline") {
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
          opacity: pressed ? 0.8 : 1,
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
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.md,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: FontSize.md,
    fontWeight: "600",
  },
});
