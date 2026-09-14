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
  background: "#f6efe1",
  surface: "#ffffff",
  text: "#241608",
  textSecondary: "#8a7a63",
  border: "#e6d9bf",
  accent: "#d9691f", // ConcertGo Orange
  accentText: "#FFFFFF",
  gradientPrimary: ["#d9691f", "#b45211"],
  gradientSecondary: ["#e67830", "#c45c16"],
};

const darkColors: ThemeColors = {
  background: "#241608",
  surface: "#33200c",
  text: "#f6efe1",
  textSecondary: "#b3a490",
  border: "#4a3219",
  accent: "#d9691f", // ConcertGo Orange
  accentText: "#FFFFFF",
  gradientPrimary: ["#d9691f", "#b45211"],
  gradientSecondary: ["#e67830", "#c45c16"],
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
