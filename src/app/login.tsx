import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { useAppTheme } from "../store/themeStore";
import { useUserStore } from "../store/userStore";
import Button from "../components/Button";
import { Spacing, FontSize, Radius, Shadows } from "../constants/theme";

export default function LoginScreen() {
  const { colors, mode } = useAppTheme();
  const { name, email, updateProfile } = useUserStore();

  const [inputUsername, setInputUsername] = useState("");
  const [inputPassword, setInputPassword] = useState("");

  const handleLogin = () => {
    if (inputUsername) {
      updateProfile({ name: inputUsername });
    }
    // Masuk ke Home
    router.replace("/(tabs)" as any);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={colors.gradientPrimary}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <SafeAreaView edges={["top"]} style={styles.headerSafeArea}>
          <View style={styles.logoContainer}>
            <Image 
              source={require("../../assets/images/task.png")} 
              style={styles.logo} 
              resizeMode="contain" 
            />
            <Text style={styles.title}>
              <Text style={{ color: "#10B981" }}>Task</Text>Flow
            </Text>
            <Text style={styles.subtitle}>Selesaikan lebih banyak hal hari ini.</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <View style={styles.content}>
        <View style={[styles.card, Shadows.medium, { backgroundColor: colors.surface, borderColor: mode === 'dark' ? colors.border : "transparent" }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Selamat Datang</Text>
          <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
            Masuk untuk melanjutkan dan mengelola task Anda.
          </Text>
          
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Email atau Username</Text>
            <View style={[styles.inputBox, { borderColor: colors.border, backgroundColor: colors.background }]}>
              <Feather name="user" size={20} color={colors.textSecondary} />
              <TextInput
                value={inputUsername}
                onChangeText={setInputUsername}
                placeholder="Mis. amano / hello@contoh.com"
                placeholderTextColor={colors.textSecondary}
                style={[styles.input, { color: colors.text }]}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Password</Text>
            <View style={[styles.inputBox, { borderColor: colors.border, backgroundColor: colors.background }]}>
              <Feather name="lock" size={20} color={colors.textSecondary} />
              <TextInput
                value={inputPassword}
                onChangeText={setInputPassword}
                placeholder="••••••••"
                placeholderTextColor={colors.textSecondary}
                secureTextEntry={true}
                style={[styles.input, { color: colors.text }]}
              />
            </View>
          </View>

          <Button 
            label="Masuk ke Aplikasi" 
            variant="primary" 
            onPress={handleLogin} 
            style={{ marginTop: Spacing.md }} 
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerGradient: {
    borderBottomLeftRadius: Radius.xl * 1.5,
    borderBottomRightRadius: Radius.xl * 1.5,
    paddingBottom: Spacing.xxl + Spacing.xl, // Memberikan ruang agar card bisa overlap
  },
  headerSafeArea: {
    paddingHorizontal: Spacing.lg,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  logo: {
    width: 72,
    height: 72,
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: FontSize.xxxl + 4,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: 1,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: FontSize.md,
    color: "rgba(255,255,255,0.8)",
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    marginTop: -Spacing.xxl - Spacing.md, // Membuat card sedikit naik menimpa header
  },
  card: {
    borderRadius: Radius.lg,
    padding: Spacing.xl,
    borderWidth: 1,
  },
  cardTitle: {
    fontSize: FontSize.xl,
    fontWeight: "800",
    marginBottom: Spacing.xs,
    textAlign: "center",
  },
  cardSubtitle: {
    fontSize: FontSize.sm,
    textAlign: "center",
    marginBottom: Spacing.xl,
    lineHeight: 20,
  },
  inputGroup: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: FontSize.sm,
    fontWeight: "600",
    marginBottom: Spacing.sm,
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  input: {
    flex: 1,
    paddingVertical: Spacing.md,
    fontSize: FontSize.md,
  },
});
