import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Image, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useAppTheme } from "../store/themeStore";
import Button from "../components/Button";
import { Spacing, FontSize, Radius } from "../constants/theme";

export default function ForgotPasswordScreen() {
  const { colors } = useAppTheme();
  
  const [inputEmail, setInputEmail] = useState("");
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const handleReset = () => {
    // Dummy reset action, just go back to login
    router.back();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient 
        colors={['#241608', 'transparent']} 
        style={styles.topGradient} 
      />
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
            <View style={[styles.logoBox, { borderColor: colors.border, backgroundColor: colors.surface }]}>
              <Image 
                source={require("../../assets/images/iconsaja.png")} 
                style={styles.logo} 
                resizeMode="contain" 
              />
            </View>
            <Text style={[styles.title, { color: colors.text }]}>
              Lupa<Text style={{ color: colors.accent }}>Password</Text>
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Jangan khawatir, mari atur ulang.</Text>
          </View>

          {/* Form Card */}
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Atur Ulang</Text>
            <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
              Masukkan email yang terdaftar untuk menerima tautan reset password.
            </Text>
            
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Alamat Email</Text>
              <View style={[
                styles.inputBox, 
                { borderColor: focusedInput === 'email' ? colors.accent : colors.border, backgroundColor: colors.background }
              ]}>
                <Feather name="mail" size={20} color={focusedInput === 'email' ? colors.accent : colors.textSecondary} />
                <TextInput
                  value={inputEmail}
                  onChangeText={setInputEmail}
                  onFocus={() => setFocusedInput('email')}
                  onBlur={() => setFocusedInput(null)}
                  placeholder="hello@contoh.com"
                  keyboardType="email-address"
                  placeholderTextColor={colors.textSecondary}
                  style={[styles.input, { color: colors.text }]}
                />
              </View>
            </View>

            <Button 
              label="Kirim Tautan Reset" 
              variant="primary" 
              onPress={handleReset} 
              style={{ marginTop: Spacing.sm }} 
            />

            <View style={styles.registerContainer}>
              <TouchableOpacity onPress={() => router.back()}>
                <Text style={[styles.registerTextBold, { color: colors.accent }]}>Kembali ke Login</Text>
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
  logoBox: {
    width: 80,
    height: 80,
    borderRadius: Radius.lg,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  logo: {
    width: 48,
    height: 48,
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
