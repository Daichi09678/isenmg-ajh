import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useAppTheme } from "../store/themeStore";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";


export default function CreateWorkspaceScreen() {
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

  const [name, setName] = useState("");
  const [industry, setIndustry] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<{name?: string}>({});

  const handleCreate = () => {
    if (!name.trim()) {
      setErrors({ name: "Nama Workspace wajib diisi" });
      return;
    }
    
    // Simulate creation
    Alert.alert(
      "Sukses", 
      `Workspace '${name}' berhasil dibuat! (Simulasi)`,
      [{ text: "OK", onPress: () => router.back() }]
    );
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
          <Text style={styles.headerTitle}>Create Workspace</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.content}>
          <Text style={styles.infoText}>
            Buat ruang kerja baru untuk tim Anda. Anda akan menjadi Admin dari workspace ini.
          </Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Nama Workspace / Proyek <Text style={{color: COLORS.danger}}>*</Text></Text>
            <TextInput
              style={[styles.input, errors.name && styles.inputError]}
              placeholder="Contoh: Proyek Revamp UI"
              placeholderTextColor={COLORS.textMuted}
              value={name}
              onChangeText={(text) => {
                setName(text);
                if (errors.name) setErrors({});
              }}
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Industri / Kategori</Text>
            <TextInput
              style={styles.input}
              placeholder="Contoh: Technology, Design, Marketing"
              placeholderTextColor={COLORS.textMuted}
              value={industry}
              onChangeText={setIndustry}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Deskripsi Singkat</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Jelaskan secara singkat tujuan workspace ini..."
              placeholderTextColor={COLORS.textMuted}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.submitBtn} onPress={handleCreate}>
            <Ionicons name="add-circle-outline" size={20} color={COLORS.bg} />
            <Text style={styles.submitText}>Create Workspace</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const getStyles = (COLORS: any) => StyleSheet.create({
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
  content: { flex: 1, padding: 20 },
  infoText: { fontSize: 14, color: COLORS.textMuted, marginBottom: 24, lineHeight: 20 },
  formGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: "600", color: COLORS.text, marginBottom: 8 },
  input: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 14,
    color: COLORS.text,
    fontSize: 16,
  },
  inputError: { borderColor: COLORS.danger },
  errorText: { color: COLORS.danger, fontSize: 12, marginTop: 4 },
  textArea: { minHeight: 100 },
  footer: { padding: 20, borderTopWidth: 1, borderTopColor: COLORS.border },
  submitBtn: {
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    gap: 8
  },
  submitText: { fontSize: 16, fontWeight: "bold", color: COLORS.bg }
});

