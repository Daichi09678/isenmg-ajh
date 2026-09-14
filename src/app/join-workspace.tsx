import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const COLORS = {
  bg: "#0f172a",
  card: "#1e293b",
  border: "#334155",
  text: "#f8fafc",
  textMuted: "#94a3b8",
  primary: "#0ea5e9", // Light blue for join
  danger: "#ef4444"
};

export default function JoinWorkspaceScreen() {
  const [inviteCode, setInviteCode] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState("");

  const handleJoin = () => {
    if (!inviteCode.trim()) {
      setError("Link atau kode invite tidak boleh kosong.");
      return;
    }
    
    setIsChecking(true);
    setError("");

    // Simulate checking the invite code
    setTimeout(() => {
      setIsChecking(false);
      
      if (inviteCode.toLowerCase() === "error") {
        setError("Kode invite tidak valid atau sudah kadaluarsa.");
      } else {
        Alert.alert(
          "Berhasil Bergabung", 
          `Anda telah berhasil bergabung dengan workspace menggunakan kode '${inviteCode}'. (Simulasi)`,
          [{ text: "OK", onPress: () => router.back() }]
        );
      }
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
            <Ionicons name="close" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Join Workspace</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <View style={styles.iconCircle}>
              <Ionicons name="link" size={40} color={COLORS.primary} />
            </View>
          </View>

          <Text style={styles.title}>Punya kode undangan?</Text>
          <Text style={styles.infoText}>
            Masukkan link invite atau kode unik yang diberikan oleh pemilik workspace untuk bergabung.
          </Text>

          <View style={styles.formGroup}>
            <TextInput
              style={[styles.input, error ? styles.inputError : null]}
              placeholder="Contoh: https://app.mitreka.com/join/XYZ123 atau XYZ123"
              placeholderTextColor={COLORS.textMuted}
              value={inviteCode}
              onChangeText={(text) => {
                setInviteCode(text);
                if (error) setError("");
              }}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </View>

        </View>

        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.submitBtn} 
            onPress={handleJoin}
            disabled={isChecking}
          >
            {isChecking ? (
              <ActivityIndicator color={COLORS.text} />
            ) : (
              <Text style={styles.submitText}>Check & Join</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  header: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center", 
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border
  },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: COLORS.text },
  closeBtn: { padding: 4 },
  content: { flex: 1, padding: 24 },
  iconContainer: { alignItems: "center", marginTop: 20, marginBottom: 24 },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(14, 165, 233, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  title: { fontSize: 22, fontWeight: "bold", color: COLORS.text, textAlign: "center", marginBottom: 8 },
  infoText: { fontSize: 14, color: COLORS.textMuted, textAlign: "center", marginBottom: 32, lineHeight: 20 },
  formGroup: { marginBottom: 20 },
  input: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 16,
    color: COLORS.text,
    fontSize: 16,
  },
  inputError: { borderColor: COLORS.danger },
  errorText: { color: COLORS.danger, fontSize: 13, marginTop: 8, textAlign: "center" },
  footer: { padding: 20, borderTopWidth: 1, borderTopColor: COLORS.border },
  submitBtn: {
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
  },
  submitText: { fontSize: 16, fontWeight: "bold", color: COLORS.text }
});
