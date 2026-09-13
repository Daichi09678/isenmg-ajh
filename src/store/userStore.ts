import { create } from "zustand";

interface UserState {
  name: string;
  email: string;
  backgroundUrl: string;
  avatarUrl: string;
  updateProfile: (data: Partial<UserState>) => void;
}

export const useUserStore = create<UserState>((set) => ({
  name: "Amano",
  email: "hello@amano.com",
  backgroundUrl: "",
  avatarUrl: "",
  updateProfile: (data) => set((state) => ({ ...state, ...data })),
}));
