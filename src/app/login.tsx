import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Image, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useUserStore } from "../store/userStore";
import Button from "../components/Button";
import { Spacing, FontSize, Radius, Shadows } from "../constants/theme";

const COLORS = {
  bg: "#0f172a",
  card: "#1e293b",
  border: "#334155",
  text: "#f8fafc",
  textMuted: "#94a3b8",
  accent: "#4ade80",
};

export default function LoginScreen() {
  const { name, updateProfile } = useUserStore();

  const [inputUsername, setInputUsername] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const handleLogin = () => {
    if (inputUsername) {
      updateProfile({ name: inputUsername });
    }
    router.replace("/(tabs)" as any);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: COLORS.bg }]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
          {/* Logo & Hero Section */}
          <View style={styles.heroContainer}>
            <Text style={[styles.title, { color: COLORS.text }]}>
              Task <Text style={{ color: COLORS.accent }}>Flow</Text>
            </Text>
            <Text style={[styles.subtitle, { color: COLORS.textMuted }]}>Selesaikan lebih banyak hal hari ini.</Text>
          </View>

          {/* Form Card */}
          <View style={[styles.card, { backgroundColor: COLORS.card, borderColor: COLORS.border }]}>
            <Text style={[styles.cardTitle, { color: COLORS.text }]}>Selamat Datang</Text>
            <Text style={[styles.cardSubtitle, { color: COLORS.textMuted }]}>
              Masuk untuk mengelola aktivitas Anda.
            </Text>
            
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: COLORS.text }]}>Email atau Username</Text>
              <View style={[
                styles.inputBox, 
                { borderColor: focusedInput === 'user' ? COLORS.accent : COLORS.border, backgroundColor: COLORS.bg }
              ]}>
                <Feather name="user" size={20} color={focusedInput === 'user' ? COLORS.accent : COLORS.textMuted} />
                <TextInput
                  value={inputUsername}
                  onChangeText={setInputUsername}
                  onFocus={() => setFocusedInput('user')}
                  onBlur={() => setFocusedInput(null)}
                  placeholder="Mis. amano / hello@contoh.com"
                  placeholderTextColor={COLORS.textMuted}
                  style={[styles.input, { color: COLORS.text }]}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: COLORS.text }]}>Password</Text>
              <View style={[
                styles.inputBox, 
                { borderColor: focusedInput === 'pass' ? COLORS.accent : COLORS.border, backgroundColor: COLORS.bg }
              ]}>
                <Feather name="lock" size={20} color={focusedInput === 'pass' ? COLORS.accent : COLORS.textMuted} />
                <TextInput
                  value={inputPassword}
                  onChangeText={setInputPassword}
                  onFocus={() => setFocusedInput('pass')}
                  onBlur={() => setFocusedInput(null)}
                  placeholder="••••••••"
                  placeholderTextColor={COLORS.textMuted}
                  secureTextEntry={true}
                  style={[styles.input, { color: COLORS.text }]}
                />
              </View>
            </View>

            <TouchableOpacity style={styles.forgotPassword} onPress={() => router.push('/forgot-password' as any)}>
              <Text style={[styles.forgotPasswordText, { color: COLORS.accent }]}>Lupa password?</Text>
            </TouchableOpacity>

            <Button 
              label="Masuk ke Aplikasi" 
              variant="primary" 
              onPress={handleLogin} 
              style={{ marginTop: Spacing.xs, backgroundColor: '#1e3a8a', borderColor: '#1e3a8a' }} 
            />

            <View style={styles.registerContainer}>
              <Text style={[styles.registerText, { color: COLORS.textMuted }]}>Belum punya akun? </Text>
              <TouchableOpacity onPress={() => router.push('/register' as any)}>
                <Text style={[styles.registerTextBold, { color: COLORS.accent }]}>Daftar di sini</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xxl * 1.5,
    paddingBottom: Spacing.xxl,
  },
  heroContainer: {
    alignItems: "center",
    marginBottom: Spacing.xxl,
  },
  title: {
    fontSize: FontSize.xxxl,
    fontWeight: "900",
    letterSpacing: 1,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSize.md,
    fontWeight: "500",
  },
  card: {
    borderRadius: Radius.lg,
    padding: Spacing.xl,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 3,
  },
  cardTitle: {
    fontSize: FontSize.xl + 2,
    fontWeight: "800",
    marginBottom: Spacing.xs,
    textAlign: "center",
  },
  cardSubtitle: {
    fontSize: FontSize.sm,
    fontWeight: "500",
    textAlign: "center",
    marginBottom: Spacing.xl,
    lineHeight: 20,
  },
  inputGroup: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: FontSize.sm,
    fontWeight: "700",
    marginBottom: Spacing.sm,
    marginLeft: 4,
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
    minHeight: 56,
  },
  input: {
    flex: 1,
    paddingVertical: Spacing.md,
    fontSize: FontSize.md,
    fontWeight: "500",
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: Spacing.lg,
  },
  forgotPasswordText: {
    fontSize: FontSize.sm,
    fontWeight: "600",
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: Spacing.xl,
  },
  registerText: {
    fontSize: FontSize.sm,
    fontWeight: "500",
  },
  registerTextBold: {
    fontSize: FontSize.sm,
    fontWeight: "700",
  },
});
