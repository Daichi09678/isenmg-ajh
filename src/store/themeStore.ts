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
  background: "#f1f5f9",
  surface: "#ffffff",
  text: "#0f172a",
  textSecondary: "#64748b",
  border: "#e2e8f0",
  accent: "#10b981", 
  accentText: "#ffffff",
  gradientPrimary: ["#10b981", "#059669"],
  gradientSecondary: ["#34d399", "#10b981"],
};

const darkColors: ThemeColors = {
  background: "#0f172a",
  surface: "#1e293b",
  text: "#f8fafc",
  textSecondary: "#94a3b8",
  border: "#334155",
  accent: "#10b981",
  accentText: "#ffffff",
  gradientPrimary: ["#10b981", "#059669"],
  gradientSecondary: ["#34d399", "#10b981"],
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
