import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Image, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from "react-native";
import { useAppTheme } from "../store/themeStore";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useUserStore } from "../store/userStore";
import Button from "../components/Button";
import { Spacing, FontSize, Radius } from "../constants/theme";


export default function RegisterScreen() {
  const { colors } = useAppTheme();
  const COLORS = React.useMemo(() => ({
    bg: colors.background,
    card: colors.surface,
    taskBg: colors.background,
    border: colors.border,
    text: colors.text,
    textMuted: colors.textSecondary,
    blue: "#3b82f6",
    green: "#10b981",
    yellow: "#fbbf24",
    purple: "#8b5cf6",
    amber: "#f59e0b",
    rose: "#f43f5e",
    accent: colors.accent,
    white: colors.surface === "#ffffff" ? "#ffffff" : colors.text,
    danger: "#ef4444",
  }), [colors]);
  const styles = React.useMemo(() => getStyles(COLORS), [COLORS]);

  const { updateProfile } = useUserStore();

  const [inputName, setInputName] = useState("");
  const [inputEmail, setInputEmail] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const handleRegister = () => {
    if (inputName) {
      updateProfile({ name: inputName });
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
            <Text style={[styles.subtitle, { color: COLORS.textMuted }]}>Mulai kelola tugasmu hari ini.</Text>
          </View>

          {/* Form Card */}
          <View style={[styles.card, { backgroundColor: COLORS.card, borderColor: COLORS.border }]}>
            <Text style={[styles.cardTitle, { color: COLORS.text }]}>Daftar Baru</Text>
            <Text style={[styles.cardSubtitle, { color: COLORS.textMuted }]}>
              Lengkapi data di bawah untuk bergabung.
            </Text>
            
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: COLORS.text }]}>Nama Lengkap</Text>
              <View style={[
                styles.inputBox, 
                { borderColor: focusedInput === 'name' ? COLORS.accent : COLORS.border, backgroundColor: COLORS.bg }
              ]}>
                <Feather name="user" size={20} color={focusedInput === 'name' ? COLORS.accent : COLORS.textMuted} />
                <TextInput
                  value={inputName}
                  onChangeText={setInputName}
                  onFocus={() => setFocusedInput('name')}
                  onBlur={() => setFocusedInput(null)}
                  placeholder="Mis. Amano"
                  placeholderTextColor={COLORS.textMuted}
                  style={[styles.input, { color: COLORS.text }]}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: COLORS.text }]}>Email</Text>
              <View style={[
                styles.inputBox, 
                { borderColor: focusedInput === 'email' ? COLORS.accent : COLORS.border, backgroundColor: COLORS.bg }
              ]}>
                <Feather name="mail" size={20} color={focusedInput === 'email' ? COLORS.accent : COLORS.textMuted} />
                <TextInput
                  value={inputEmail}
                  onChangeText={setInputEmail}
                  onFocus={() => setFocusedInput('email')}
                  onBlur={() => setFocusedInput(null)}
                  placeholder="hello@contoh.com"
                  keyboardType="email-address"
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

            <Button 
              label="Buat Akun" 
              variant="primary" 
              onPress={handleRegister} 
              style={{ marginTop: Spacing.xs, backgroundColor: '#1e3a8a', borderColor: '#1e3a8a' }} 
            />

            <View style={styles.registerContainer}>
              <Text style={[styles.registerText, { color: COLORS.textMuted }]}>Sudah punya akun? </Text>
              <TouchableOpacity onPress={() => router.back()}>
                <Text style={[styles.registerTextBold, { color: COLORS.accent }]}>Masuk di sini</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const getStyles = (COLORS: any) => StyleSheet.create({
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

