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
import { Feather, Ionicons } from "@expo/vector-icons";
import { useAppTheme } from "../store/themeStore";
import { Spacing, Radius, FontSize } from "../constants/theme";

export default function ChangePasswordScreen() {
  const { mode, colors } = useAppTheme();
  const isDark = mode === "dark";

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
    <SafeAreaView edges={["top"]} style={[styles.safe, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Pressable
            style={[styles.backBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => router.back()}
          >
            <Feather name="chevron-left" size={22} color={colors.text} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Ubah Password</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.cardDesc, { color: colors.textSecondary }]}>
              Pastikan password baru Anda kuat dan belum pernah digunakan pada akun lain.
            </Text>

            {/* Error banner */}
            {errorMessage ? (
              <View style={[styles.errorBanner, { backgroundColor: "#fee2e2", borderColor: "#fca5a5" }]}>
                <Feather name="alert-circle" size={16} color="#b91c1c" />
                <Text style={styles.errorBannerText}>{errorMessage}</Text>
              </View>
            ) : null}

            {/* Input: Old Password */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Password Saat Ini</Text>
              <View style={[styles.inputBox, { borderColor: colors.border, backgroundColor: colors.background }]}>
                <Feather name="lock" size={18} color={colors.textSecondary} />
                <TextInput
                  value={oldPassword}
                  onChangeText={setOldPassword}
                  secureTextEntry={!showOld}
                  placeholder="Masukkan password saat ini"
                  placeholderTextColor={colors.textSecondary}
                  style={[styles.input, { color: colors.text }]}
                />
                <Pressable onPress={() => setShowOld(!showOld)} hitSlop={10}>
                  <Feather name={showOld ? "eye" : "eye-off"} size={18} color={colors.textSecondary} />
                </Pressable>
              </View>
            </View>

            {/* Input: New Password */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Password Baru</Text>
              <View style={[styles.inputBox, { borderColor: colors.border, backgroundColor: colors.background }]}>
                <Feather name="key" size={18} color={colors.textSecondary} />
                <TextInput
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry={!showNew}
                  placeholder="Masukkan password baru"
                  placeholderTextColor={colors.textSecondary}
                  style={[styles.input, { color: colors.text }]}
                />
                <Pressable onPress={() => setShowNew(!showNew)} hitSlop={10}>
                  <Feather name={showNew ? "eye" : "eye-off"} size={18} color={colors.textSecondary} />
                </Pressable>
              </View>
            </View>

            {/* Input: Confirm Password */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Konfirmasi Password Baru</Text>
              <View style={[styles.inputBox, { borderColor: colors.border, backgroundColor: colors.background }]}>
                <Feather name="check" size={18} color={colors.textSecondary} />
                <TextInput
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirm}
                  placeholder="Ketik ulang password baru"
                  placeholderTextColor={colors.textSecondary}
                  style={[styles.input, { color: colors.text }]}
                />
                <Pressable onPress={() => setShowConfirm(!showConfirm)} hitSlop={10}>
                  <Feather name={showConfirm ? "eye" : "eye-off"} size={18} color={colors.textSecondary} />
                </Pressable>
              </View>
            </View>

            {/* Checklist criteria */}
            <View style={[styles.criteriaBox, { backgroundColor: isDark ? "#241209" : "#fbf7ef", borderColor: colors.border }]}>
              <Text style={[styles.criteriaTitle, { color: colors.text }]}>Kriteria Password Kuat:</Text>
              <View style={styles.criteriaItem}>
                <Feather
                  name={hasMinLength ? "check-circle" : "circle"}
                  size={14}
                  color={hasMinLength ? "#10B981" : colors.textSecondary}
                />
                <Text style={[styles.criteriaText, { color: hasMinLength ? colors.text : colors.textSecondary }]}>
                  Minimal 8 karakter
                </Text>
              </View>
              <View style={styles.criteriaItem}>
                <Feather
                  name={hasNumber && hasLetter ? "check-circle" : "circle"}
                  size={14}
                  color={hasNumber && hasLetter ? "#10B981" : colors.textSecondary}
                />
                <Text style={[styles.criteriaText, { color: hasNumber && hasLetter ? colors.text : colors.textSecondary }]}>
                  Mengandung huruf dan angka
                </Text>
              </View>
              <View style={styles.criteriaItem}>
                <Feather
                  name={isMatching ? "check-circle" : "circle"}
                  size={14}
                  color={isMatching ? "#10B981" : colors.textSecondary}
                />
                <Text style={[styles.criteriaText, { color: isMatching ? colors.text : colors.textSecondary }]}>
                  Konfirmasi password sama persis
                </Text>
              </View>
            </View>

            {/* Submit Button */}
            <Pressable
              style={[styles.submitBtn, { backgroundColor: colors.accent }]}
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
          <View style={[styles.successModalSheet, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={[styles.successIconWrap, { backgroundColor: "rgba(16, 185, 129, 0.15)" }]}>
              <Feather name="check" size={32} color="#10B981" />
            </View>
            <Text style={[styles.successTitle, { color: colors.text }]}>Password Berhasil Diubah!</Text>
            <Text style={[styles.successSubtitle, { color: colors.textSecondary }]}>
              Kata sandi akun Anda telah diperbarui dengan aman. Silakan gunakan password baru ini untuk masuk berikutnya.
            </Text>
            <Pressable
              style={[styles.successBtn, { backgroundColor: colors.accent }]}
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

const styles = StyleSheet.create({
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
    color: "#b91c1c",
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
    backgroundColor: "rgba(0, 0, 0, 0.55)",
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
