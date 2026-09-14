import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const COLORS = {
  bg: "#0f172a",
  card: "#1e293b",
  border: "#334155",
  text: "#f8fafc",
  textMuted: "#94a3b8",
  primary: "#3b82f6",
  green: "#10b981",
};

export default function ExportTasksScreen() {
  const [format, setFormat] = useState<"CSV" | "JSON">("CSV");
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    // Simulasi proses ekspor
    setTimeout(() => {
      setIsExporting(false);
      Alert.alert(
        "Export Berhasil",
        `Data task Anda berhasil diekspor dalam format ${format}. (Simulasi)`,
        [{ text: "OK", onPress: () => router.back() }]
      );
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
          <Ionicons name="close" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Export Tasks</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.label}>Pilih Format Data</Text>
        <View style={styles.formatOptions}>
          <TouchableOpacity 
            style={[styles.formatCard, format === "CSV" && styles.formatCardActive]}
            onPress={() => setFormat("CSV")}
          >
            <Ionicons name="document-text-outline" size={32} color={format === "CSV" ? COLORS.primary : COLORS.textMuted} />
            <Text style={[styles.formatText, format === "CSV" && styles.formatTextActive]}>CSV</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.formatCard, format === "JSON" && styles.formatCardActive]}
            onPress={() => setFormat("JSON")}
          >
            <Ionicons name="code-slash-outline" size={32} color={format === "JSON" ? COLORS.primary : COLORS.textMuted} />
            <Text style={[styles.formatText, format === "JSON" && styles.formatTextActive]}>JSON</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.infoText}>
          Semua task yang sudah selesai dan task aktif akan diekspor sesuai format pilihan Anda untuk keperluan pelaporan atau integrasi dengan sistem lain.
        </Text>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.submitBtn} 
          onPress={handleExport}
          disabled={isExporting}
        >
          {isExporting ? (
            <ActivityIndicator color={COLORS.text} />
          ) : (
            <>
              <Ionicons name="download-outline" size={20} color={COLORS.text} />
              <Text style={styles.submitText}>Export Sekarang</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
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
  content: { flex: 1, padding: 20 },
  label: { fontSize: 16, fontWeight: "600", color: COLORS.text, marginBottom: 16 },
  formatOptions: { flexDirection: "row", gap: 16, marginBottom: 24 },
  formatCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    gap: 12
  },
  formatCardActive: { borderColor: COLORS.primary },
  formatText: { fontSize: 16, fontWeight: "600", color: COLORS.textMuted },
  formatTextActive: { color: COLORS.primary },
  infoText: { fontSize: 14, color: COLORS.textMuted, lineHeight: 22 },
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
  submitText: { fontSize: 16, fontWeight: "bold", color: COLORS.text }
});
