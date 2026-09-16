import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Pressable,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useAppTheme } from "../store/themeStore";
import { Feather } from "@expo/vector-icons";
import { Spacing, Radius } from "../constants/theme";


export default function ChangePasswordScreen() {
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

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Criteria validation
  const hasMinLength = newPassword.length >= 8;
  const hasNumber = /\d/.test(newPassword);
  const hasLetter = /[a-zA-Z]/.test(newPassword);
  const isMatching = newPassword !== "" && newPassword === confirmPassword;

  const handleSubmit = () => {
    setErrorMessage("");

    if (!oldPassword) {
      setErrorMessage("Silakan masukkan password saat ini.");
      return;
    }

    if (!hasMinLength) {
      setErrorMessage("Password baru minimal harus 8 karakter.");
      return;
    }

    if (!hasNumber || !hasLetter) {
      setErrorMessage("Password baru harus mengandung kombinasi huruf dan angka.");
      return;
    }

    if (!isMatching) {
      setErrorMessage("Konfirmasi password baru tidak cocok.");
      return;
    }

    // Success simulation
    setShowSuccessModal(true);
  };

  const handleFinish = () => {
    setShowSuccessModal(false);
    router.back();
  };
  return (
    <SafeAreaView edges={["top"]} style={[styles.safe, { backgroundColor: COLORS.bg }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: COLORS.border, backgroundColor: COLORS.bg }]}>
          <Pressable
            style={[styles.backBtn, { backgroundColor: COLORS.card, borderColor: COLORS.border }]}
            onPress={() => router.back()}
          >
            <Feather name="chevron-left" size={22} color={COLORS.text} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: COLORS.text }]}>Ubah Password</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[styles.card, { backgroundColor: COLORS.card, borderColor: COLORS.border }]}>
            <Text style={[styles.cardDesc, { color: COLORS.textMuted }]}>
              Pastikan password baru Anda kuat dan belum pernah digunakan pada akun lain.
            </Text>

            {/* Error banner */}
            {errorMessage ? (
              <View style={[styles.errorBanner, { backgroundColor: "rgba(244, 63, 94, 0.15)", borderColor: "rgba(244, 63, 94, 0.3)" }]}>
                <Feather name="alert-circle" size={16} color={COLORS.rose} />
                <Text style={[styles.errorBannerText, { color: COLORS.rose }]}>{errorMessage}</Text>
              </View>
            ) : null}

            {/* Input: Old Password */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: COLORS.text }]}>Password Saat Ini</Text>
              <View style={[styles.inputBox, { borderColor: COLORS.border, backgroundColor: COLORS.bg }]}>
                <Feather name="lock" size={18} color={COLORS.textMuted} />
                <TextInput
                  value={oldPassword}
                  onChangeText={setOldPassword}
                  secureTextEntry={!showOld}
                  placeholder="Masukkan password saat ini"
                  placeholderTextColor={COLORS.textMuted}
                  style={[styles.input, { color: COLORS.text }]}
                />
                <Pressable onPress={() => setShowOld(!showOld)} hitSlop={10}>
                  <Feather name={showOld ? "eye" : "eye-off"} size={18} color={COLORS.textMuted} />
                </Pressable>
              </View>
            </View>

            {/* Input: New Password */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: COLORS.text }]}>Password Baru</Text>
              <View style={[styles.inputBox, { borderColor: COLORS.border, backgroundColor: COLORS.bg }]}>
                <Feather name="key" size={18} color={COLORS.textMuted} />
                <TextInput
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry={!showNew}
                  placeholder="Masukkan password baru"
                  placeholderTextColor={COLORS.textMuted}
                  style={[styles.input, { color: COLORS.text }]}
                />
                <Pressable onPress={() => setShowNew(!showNew)} hitSlop={10}>
                  <Feather name={showNew ? "eye" : "eye-off"} size={18} color={COLORS.textMuted} />
                </Pressable>
              </View>
            </View>

            {/* Input: Confirm Password */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: COLORS.text }]}>Konfirmasi Password Baru</Text>
              <View style={[styles.inputBox, { borderColor: COLORS.border, backgroundColor: COLORS.bg }]}>
                <Feather name="check" size={18} color={COLORS.textMuted} />
                <TextInput
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirm}
                  placeholder="Ketik ulang password baru"
                  placeholderTextColor={COLORS.textMuted}
                  style={[styles.input, { color: COLORS.text }]}
                />
                <Pressable onPress={() => setShowConfirm(!showConfirm)} hitSlop={10}>
                  <Feather name={showConfirm ? "eye" : "eye-off"} size={18} color={COLORS.textMuted} />
                </Pressable>
              </View>
            </View>

            {/* Checklist criteria */}
            <View style={[styles.criteriaBox, { backgroundColor: COLORS.bg, borderColor: COLORS.border }]}>
              <Text style={[styles.criteriaTitle, { color: COLORS.text }]}>Kriteria Password Kuat:</Text>
              <View style={styles.criteriaItem}>
                <Feather
                  name={hasMinLength ? "check-circle" : "circle"}
                  size={14}
                  color={hasMinLength ? COLORS.green : COLORS.textMuted}
                />
                <Text style={[styles.criteriaText, { color: hasMinLength ? COLORS.text : COLORS.textMuted }]}>
                  Minimal 8 karakter
                </Text>
              </View>
              <View style={styles.criteriaItem}>
                <Feather
                  name={hasNumber && hasLetter ? "check-circle" : "circle"}
                  size={14}
                  color={hasNumber && hasLetter ? COLORS.green : COLORS.textMuted}
                />
                <Text style={[styles.criteriaText, { color: hasNumber && hasLetter ? COLORS.text : COLORS.textMuted }]}>
                  Mengandung huruf dan angka
                </Text>
              </View>
              <View style={styles.criteriaItem}>
                <Feather
                  name={isMatching ? "check-circle" : "circle"}
                  size={14}
                  color={isMatching ? COLORS.green : COLORS.textMuted}
                />
                <Text style={[styles.criteriaText, { color: isMatching ? COLORS.text : COLORS.textMuted }]}>
                  Konfirmasi password sama persis
                </Text>
              </View>
            </View>

            {/* Submit Button */}
            <Pressable
              style={[styles.submitBtn, { backgroundColor: COLORS.blue }]}
              onPress={handleSubmit}
            >
              <Text style={styles.submitBtnText}>Simpan Password Baru</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Success Modal */}
      <Modal visible={showSuccessModal} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={[styles.successModalSheet, { backgroundColor: COLORS.card, borderColor: COLORS.border }]}>
            <View style={[styles.successIconWrap, { backgroundColor: "rgba(16, 185, 129, 0.15)" }]}>
              <Feather name="check" size={32} color={COLORS.green} />
            </View>
            <Text style={[styles.successTitle, { color: COLORS.text }]}>Password Berhasil Diubah!</Text>
            <Text style={[styles.successSubtitle, { color: COLORS.textMuted }]}>
              Kata sandi akun Anda telah diperbarui dengan aman. Silakan gunakan password baru ini untuk masuk berikutnya.
            </Text>
            <Pressable
              style={[styles.successBtn, { backgroundColor: COLORS.blue }]}
              onPress={handleFinish}
            >
              <Text style={styles.successBtnText}>Selesai</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const getStyles = (COLORS: any) => StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 4,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: 40,
  },
  card: {
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    gap: Spacing.md,
  },
  cardDesc: {
    fontSize: 13,
    lineHeight: 18,
  },
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 10,
    borderRadius: Radius.sm,
    borderWidth: 1,
  },
  errorBannerText: {
    fontSize: 12,
    fontWeight: "600",
    flex: 1,
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: 14,
    gap: 10,
    minHeight: 48,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 13,
  },
  criteriaBox: {
    borderRadius: Radius.md,
    padding: 14,
    borderWidth: 1,
    gap: 8,
    marginTop: 4,
  },
  criteriaTitle: {
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 2,
  },
  criteriaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  criteriaText: {
    fontSize: 12,
  },
  submitBtn: {
    borderRadius: Radius.full,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: Spacing.xs,
  },
  submitBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  successModalSheet: {
    width: "100%",
    borderRadius: Radius.lg,
    padding: 24,
    borderWidth: 1,
    alignItems: "center",
    gap: 12,
  },
  successIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: "800",
    textAlign: "center",
  },
  successSubtitle: {
    fontSize: 13,
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 8,
  },
  successBtn: {
    width: "100%",
    borderRadius: Radius.full,
    paddingVertical: 12,
    alignItems: "center",
  },
  successBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
});

