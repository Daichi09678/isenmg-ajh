import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Modal, TextInput, ImageBackground, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import { useAppTheme } from "../../store/themeStore";
import { useUserStore } from "../../store/userStore";
import { useTaskStore } from "../../store/taskStore";
import Button from "../../components/Button";
import TaskCard from "../../components/TaskCard";
import { Spacing, FontSize, Radius, Shadows } from "../../constants/theme";

export default function ProfileScreen() {
  const { colors, mode } = useAppTheme();
  const { name, email, backgroundUrl, avatarUrl, updateProfile } = useUserStore();
  
  // Ambil data task dari store (untuk Riwayat)
  const tasks = useTaskStore((s) => s.tasks);
  const toggleDone = useTaskStore((s) => s.toggleDone);
  const deleteTask = useTaskStore((s) => s.deleteTask);
  
  // Ambil hanya 3 task terakhir yang sudah selesai
  const historyTasks = tasks.filter((t) => t.isDone).slice(-3);

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(name);
  const [editEmail, setEditEmail] = useState(email);
  const [editBg, setEditBg] = useState(backgroundUrl);
  const [editAvatar, setEditAvatar] = useState(avatarUrl);

  const pickImage = async (type: "avatar" | "background") => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: type === "avatar" ? [1, 1] : [16, 9],
      quality: 0.8,
    });

    if (!result.canceled) {
      if (type === "avatar") {
        setEditAvatar(result.assets[0].uri);
      } else {
        setEditBg(result.assets[0].uri);
      }
    }
  };

  const handleSave = () => {
    updateProfile({ name: editName, email: editEmail, backgroundUrl: editBg, avatarUrl: editAvatar });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditName(name);
    setEditEmail(email);
    setEditBg(backgroundUrl);
    setEditAvatar(avatarUrl);
    setIsEditing(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header Melengkung dengan Gradient & Background */}
      <View style={styles.headerWrapper}>
        <LinearGradient
          colors={colors.gradientPrimary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          {backgroundUrl ? (
            <ImageBackground 
              source={{ uri: backgroundUrl }} 
              style={StyleSheet.absoluteFill}
              imageStyle={{ 
                opacity: 0.4, 
                borderBottomLeftRadius: Radius.xl * 1.5, 
                borderBottomRightRadius: Radius.xl * 1.5 
              }}
            />
          ) : null}
          <SafeAreaView edges={["top"]} style={styles.headerSafeArea}>
            <View style={styles.headerTop}>
              <Text style={styles.headerTitle}>Profil Saya</Text>
              <Pressable 
                onPress={() => setIsEditing(true)} 
                style={[styles.editBtn, { backgroundColor: "rgba(255,255,255,0.2)" }]}
              >
                <Feather name="edit-3" size={18} color="#FFFFFF" />
              </Pressable>
            </View>
            
            <View style={styles.profileHeader}>
              <View style={[styles.avatarBox, Shadows.medium, { backgroundColor: colors.surface }]}>
                {avatarUrl ? (
                  <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
                ) : (
                  <Text style={[styles.avatarText, { color: colors.accent }]}>
                    {name ? name.charAt(0).toUpperCase() : "?"}
                  </Text>
                )}
              </View>
              <Text style={styles.name}>{name || "Tanpa Nama"}</Text>
              <Text style={styles.email}>{email || "Belum ada email"}</Text>
            </View>
          </SafeAreaView>
        </LinearGradient>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Kartu Statistik Profil */}
        <View style={[styles.card, Shadows.light, { backgroundColor: colors.surface, borderColor: mode === 'dark' ? colors.border : "transparent" }]}>
          <View style={styles.cardItem}>
            <View style={[styles.iconBox, { backgroundColor: "rgba(79, 70, 229, 0.1)" }]}>
              <Feather name="check-circle" size={24} color={colors.accent} />
            </View>
            <View style={styles.cardTextContent}>
              <Text style={[styles.cardTitle, { color: colors.textSecondary }]}>Total Diselesaikan</Text>
              <Text style={[styles.cardValue, { color: colors.text }]}>{tasks.filter(t => t.isDone).length} Task</Text>
            </View>
          </View>
          
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          
          <View style={styles.cardItem}>
            <View style={[styles.iconBox, { backgroundColor: "rgba(245, 158, 11, 0.1)" }]}>
              <Feather name="zap" size={24} color="#F59E0B" />
            </View>
            <View style={styles.cardTextContent}>
              <Text style={[styles.cardTitle, { color: colors.textSecondary }]}>Streak Harian</Text>
              <Text style={[styles.cardValue, { color: colors.text }]}>3 Hari</Text>
            </View>
          </View>
        </View>

        {/* Bagian Riwayat Laporan */}
        <View style={styles.historySection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Riwayat Laporan Terakhir</Text>
          {historyTasks.length > 0 ? (
            historyTasks.map((task) => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onToggleDone={toggleDone} 
                onDelete={deleteTask} 
              />
            ))
          ) : (
            <View style={[styles.emptyHistory, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Feather name="inbox" size={32} color={colors.textSecondary} />
              <Text style={[styles.emptyHistoryText, { color: colors.textSecondary }]}>Belum ada riwayat task yang diselesaikan.</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Modal Edit Profil */}
      <Modal visible={isEditing} animationType="fade" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, Shadows.medium, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Edit Profil</Text>

            <ScrollView style={{ maxHeight: 400 }} showsVerticalScrollIndicator={false}>
              <View style={styles.fieldGroup}>
                <View style={styles.field}>
                  <Text style={[styles.label, { color: colors.text }]}>Foto Profil</Text>
                  <View style={styles.imagePickerRow}>
                    <View style={[styles.previewBox, { backgroundColor: colors.background, borderColor: colors.border }]}>
                      {editAvatar ? <Image source={{ uri: editAvatar }} style={styles.previewImg} /> : <Feather name="user" size={24} color={colors.textSecondary} />}
                    </View>
                    <Button label="Pilih dari Galeri" variant="outline" onPress={() => pickImage("avatar")} style={{ flex: 1 }} />
                  </View>
                </View>

                <View style={styles.field}>
                  <Text style={[styles.label, { color: colors.text }]}>Foto Background Header</Text>
                  <View style={styles.imagePickerRow}>
                    <View style={[styles.previewBoxBg, { backgroundColor: colors.background, borderColor: colors.border }]}>
                      {editBg ? <Image source={{ uri: editBg }} style={styles.previewImg} /> : <Feather name="image" size={24} color={colors.textSecondary} />}
                    </View>
                    <Button label="Pilih dari Galeri" variant="outline" onPress={() => pickImage("background")} style={{ flex: 1 }} />
                  </View>
                </View>

                <View style={styles.field}>
                  <Text style={[styles.label, { color: colors.text }]}>Nama</Text>
                  <TextInput
                    value={editName}
                    onChangeText={setEditName}
                    placeholder="Masukkan nama"
                    placeholderTextColor={colors.textSecondary}
                    style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.background }]}
                  />
                </View>

                <View style={styles.field}>
                  <Text style={[styles.label, { color: colors.text }]}>Email</Text>
                  <TextInput
                    value={editEmail}
                    onChangeText={setEditEmail}
                    keyboardType="email-address"
                    placeholder="Masukkan email"
                    placeholderTextColor={colors.textSecondary}
                    style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.background }]}
                  />
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <Button label="Batal" variant="outline" onPress={handleCancel} style={{ flex: 1 }} />
              <Button label="Simpan" variant="primary" onPress={handleSave} style={{ flex: 1 }} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerWrapper: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 10,
  },
  headerGradient: {
    borderBottomLeftRadius: Radius.xl * 1.5,
    borderBottomRightRadius: Radius.xl * 1.5,
    paddingBottom: Spacing.xxl,
    overflow: "hidden", 
  },
  headerSafeArea: {
    paddingHorizontal: Spacing.lg,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: Spacing.md,
  },
  headerTitle: { 
    fontSize: FontSize.xxl, 
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  editBtn: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  profileHeader: { 
    alignItems: "center", 
    marginTop: Spacing.lg,
  },
  avatarBox: { 
    width: 90, 
    height: 90, 
    borderRadius: Radius.full, 
    alignItems: "center", 
    justifyContent: "center", 
    marginBottom: Spacing.md,
    borderWidth: 4,
    borderColor: "rgba(255,255,255,0.2)",
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  avatarText: { 
    fontSize: 36, 
    fontWeight: "bold",
  },
  name: { 
    fontSize: FontSize.xxl, 
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  email: { 
    fontSize: FontSize.sm, 
    color: "rgba(255,255,255,0.8)",
    fontWeight: "500",
  },
  content: { 
    padding: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: 120, // Extra space for Bottom Tabs
  },
  card: { 
    borderRadius: Radius.lg, 
    borderWidth: 1, 
    padding: Spacing.lg,
    marginTop: -Spacing.md, // Overlap
  },
  cardItem: { 
    flexDirection: "row", 
    alignItems: "center", 
    gap: Spacing.md, 
    paddingVertical: Spacing.xs 
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: Radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  cardTextContent: {
    flex: 1,
  },
  cardTitle: { 
    fontSize: FontSize.sm, 
    fontWeight: "600",
    marginBottom: 2,
  },
  cardValue: { 
    fontSize: FontSize.lg, 
    fontWeight: "800" 
  },
  divider: { 
    height: 1, 
    marginVertical: Spacing.md 
  },
  historySection: {
    marginTop: Spacing.xl,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: "700",
    marginBottom: Spacing.md,
  },
  emptyHistory: {
    padding: Spacing.xl,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: Radius.lg,
    borderStyle: "dashed",
    gap: Spacing.sm,
  },
  emptyHistoryText: {
    fontSize: FontSize.sm,
    textAlign: "center",
  },
  
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    padding: Spacing.lg,
  },
  modalContent: {
    borderRadius: Radius.lg,
    padding: Spacing.xl,
  },
  modalTitle: {
    fontSize: FontSize.xl,
    fontWeight: "800",
    marginBottom: Spacing.lg,
  },
  fieldGroup: {
    gap: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  field: {
    gap: Spacing.sm,
  },
  label: {
    fontSize: FontSize.sm,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: FontSize.md,
  },
  imagePickerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  previewBox: {
    width: 60,
    height: 60,
    borderRadius: Radius.full,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  previewBoxBg: {
    width: 80,
    height: 50,
    borderRadius: Radius.sm,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  previewImg: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  modalActions: {
    flexDirection: "row",
    gap: Spacing.md,
    marginTop: Spacing.lg,
  },
});
