import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Image, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useAppTheme } from "../store/themeStore";
import { useUserStore } from "../store/userStore";
import Button from "../components/Button";
import { Spacing, FontSize, Radius } from "../constants/theme";

export default function RegisterScreen() {
  const { colors } = useAppTheme();
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
              Buat<Text style={{ color: colors.accent }}>Akun</Text>
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Mulai kelola tugasmu hari ini.</Text>
          </View>

          {/* Form Card */}
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Daftar Baru</Text>
            <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
              Lengkapi data di bawah untuk bergabung.
            </Text>
            
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Nama Lengkap</Text>
              <View style={[
                styles.inputBox, 
                { borderColor: focusedInput === 'name' ? colors.accent : colors.border, backgroundColor: colors.background }
              ]}>
                <Feather name="user" size={20} color={focusedInput === 'name' ? colors.accent : colors.textSecondary} />
                <TextInput
                  value={inputName}
                  onChangeText={setInputName}
                  onFocus={() => setFocusedInput('name')}
                  onBlur={() => setFocusedInput(null)}
                  placeholder="Mis. Amano"
                  placeholderTextColor={colors.textSecondary}
                  style={[styles.input, { color: colors.text }]}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Email</Text>
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

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Password</Text>
              <View style={[
                styles.inputBox, 
                { borderColor: focusedInput === 'pass' ? colors.accent : colors.border, backgroundColor: colors.background }
              ]}>
                <Feather name="lock" size={20} color={focusedInput === 'pass' ? colors.accent : colors.textSecondary} />
                <TextInput
                  value={inputPassword}
                  onChangeText={setInputPassword}
                  onFocus={() => setFocusedInput('pass')}
                  onBlur={() => setFocusedInput(null)}
                  placeholder="••••••••"
                  placeholderTextColor={colors.textSecondary}
                  secureTextEntry={true}
                  style={[styles.input, { color: colors.text }]}
                />
              </View>
            </View>

            <Button 
              label="Buat Akun Sekarang" 
              variant="primary" 
              onPress={handleRegister} 
              style={{ marginTop: Spacing.sm }} 
            />

            <View style={styles.registerContainer}>
              <Text style={[styles.registerText, { color: colors.textSecondary }]}>Sudah punya akun? </Text>
              <TouchableOpacity onPress={() => router.back()}>
                <Text style={[styles.registerTextBold, { color: colors.accent }]}>Masuk di sini</Text>
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
  registerText: {
    fontSize: FontSize.sm,
    fontWeight: "500",
  },
  registerTextBold: {
    fontSize: FontSize.sm,
    fontWeight: "700",
  },
});
