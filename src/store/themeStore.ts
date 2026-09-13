import { create } from "zustand";

type ThemeMode = "light" | "dark";

interface ThemeColors {
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  accent: string;
  accentText: string;
  gradientPrimary: readonly [string, string];
  gradientSecondary: readonly [string, string];
}

interface ThemeState {
  mode: ThemeMode;
  colors: ThemeColors;
  toggleTheme: () => void;
}

const lightColors: ThemeColors = {
  background: "#F4F7FB", // Softer, premium background
  surface: "#FFFFFF",
  text: "#1F2937",
  textSecondary: "#6B7280",
  border: "#E5E7EB",
  accent: "#4F46E5", // Indigo 600
  accentText: "#FFFFFF",
  gradientPrimary: ["#4F46E5", "#7C3AED"], // Indigo to Purple
  gradientSecondary: ["#3B82F6", "#2DD4BF"], // Blue to Teal
};

const darkColors: ThemeColors = {
  background: "#0F172A", // Slate 900
  surface: "#1E293B", // Slate 800
  text: "#F8FAFC",
  textSecondary: "#94A3B8",
  border: "#334155",
  accent: "#6366F1", // Indigo 500
  accentText: "#FFFFFF",
  gradientPrimary: ["#6366F1", "#8B5CF6"],
  gradientSecondary: ["#60A5FA", "#34D399"],
};

export const useAppTheme = create<ThemeState>((set) => ({
  mode: "light",
  colors: lightColors,
  toggleTheme: () =>
    set((state) => {
      const newMode = state.mode === "light" ? "dark" : "light";
      return {
        mode: newMode,
        colors: newMode === "light" ? lightColors : darkColors,
      };
    }),
}));
