import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Image, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from "react-native";
import { useAppTheme } from "../store/themeStore";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import Button from "../components/Button";
import { Spacing, FontSize, Radius } from "../constants/theme";


export default function ForgotPasswordScreen() {
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

  
  const [inputEmail, setInputEmail] = useState("");
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const handleReset = () => {
    // Dummy reset action, just go back to login
    router.back();
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
              Lupa<Text style={{ color: COLORS.accent }}>Password</Text>
            </Text>
            <Text style={[styles.subtitle, { color: COLORS.textMuted }]}>Jangan khawatir, mari atur ulang.</Text>
          </View>

          {/* Form Card */}
          <View style={[styles.card, { backgroundColor: COLORS.card, borderColor: COLORS.border }]}>
            <Text style={[styles.cardTitle, { color: COLORS.text }]}>Atur Ulang</Text>
            <Text style={[styles.cardSubtitle, { color: COLORS.textMuted }]}>
              Masukkan email yang terdaftar untuk menerima tautan reset password.
            </Text>
            
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: COLORS.text }]}>Alamat Email</Text>
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

            <Button 
              label="Kirim Tautan Reset" 
              variant="primary" 
              onPress={handleReset} 
              style={{ marginTop: Spacing.sm, backgroundColor: '#1e3a8a', borderColor: '#1e3a8a' }} 
            />

            <View style={styles.registerContainer}>
              <TouchableOpacity onPress={() => router.back()}>
                <Text style={[styles.registerTextBold, { color: COLORS.accent }]}>Kembali ke Login</Text>
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
  topGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 320,
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: Spacing.xl,
  },
  registerTextBold: {
    fontSize: FontSize.sm,
    fontWeight: "700",
  },
});

