import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Modal, TextInput, ImageBackground, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Feather, Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useUserStore } from "../../store/userStore";
import { useTaskStore } from "../../store/taskStore";

const COLORS = {
  bg: "#0f172a", // Dark slate background
  card: "#1e293b", 
  cardAlt: "#334155",
  border: "#475569",
  dark: "#0f172a",
  darkBg: "#020617",
  accent: "#3b82f6",
  accentSoft: "#60a5fa",
  muted: "#64748b",
  mutedLight: "#94a3b8",
  white: "#f8fafc",
  danger: "#ef4444",
};

export default function ProfileScreen() {
  const { name, email, backgroundUrl, avatarUrl, updateProfile } = useUserStore();
  const tasks = useTaskStore((s) => s.tasks);
  
  const themeBg = COLORS.bg;
  const themeText = COLORS.white;

  const totalDone = tasks.filter(t => t.isDone).length;

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(name);
  const [editEmail, setEditEmail] = useState(email);
  const [editBg, setEditBg] = useState(backgroundUrl);
  const [editAvatar, setEditAvatar] = useState(avatarUrl);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    setShowLogoutModal(false);
    router.replace("/login" as any);
  };

  const pickImage = async (type: "avatar" | "background") => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: type === "avatar" ? [1, 1] : [16, 9],
      quality: 0.8,
    });
    if (!result.canceled) {
      if (type === "avatar") setEditAvatar(result.assets[0].uri);
      else setEditBg(result.assets[0].uri);
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
    <SafeAreaView edges={["top"]} style={[styles.safe, { backgroundColor: themeBg }]}>
      {/* HEADER */}
      <View style={[styles.header, { borderBottomColor: COLORS.border }]}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <View style={styles.logoBox}>
            <Ionicons name="person" size={14} color={COLORS.bg} />
          </View>
          <Text style={[styles.logoText, { color: themeText }]}>Profil</Text>
        </View>
        <Pressable onPress={() => setIsEditing(true)}>
          <Feather name="edit-3" size={20} color={COLORS.mutedLight} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.contentPad} showsVerticalScrollIndicator={false}>
        
        {/* Profile Hero Card */}
        <View style={styles.heroCard}>
          {backgroundUrl ? (
            <ImageBackground source={{ uri: backgroundUrl }} style={StyleSheet.absoluteFill} imageStyle={{ opacity: 0.2, borderRadius: 18 }} />
          ) : null}
          
          <View style={styles.heroContent}>
            <View style={styles.avatarWrap}>
              {avatarUrl ? (
                <Image source={{ uri: avatarUrl }} style={styles.avatarImg} />
              ) : (
                <Text style={styles.avatarText}>{name ? name.charAt(0).toUpperCase() : "?"}</Text>
              )}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.profileName} numberOfLines={1}>{name || "Tanpa Nama"}</Text>
              <Text style={styles.profileEmail} numberOfLines={1}>{email || "Belum ada email"}</Text>
            </View>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <View style={[styles.iconWrap, { backgroundColor: "rgba(59,130,246,0.2)" }]}>
              <Feather name="check-circle" size={20} color={COLORS.accent} />
            </View>
            <View style={{ marginTop: 8 }}>
              <Text style={styles.statVal}>{totalDone}</Text>
              <Text style={styles.statLab}>Tugas Selesai</Text>
            </View>
          </View>

          <View style={styles.statBox}>
            <View style={[styles.iconWrap, { backgroundColor: "rgba(245,158,11,0.2)" }]}>
              <Feather name="zap" size={20} color="#F59E0B" />
            </View>
            <View style={{ marginTop: 8 }}>
              <Text style={styles.statVal}>3 Hari</Text>
              <Text style={styles.statLab}>Streak Harian</Text>
            </View>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          <Text style={[styles.sectionTitle, { color: themeText }]}>Aktivitas</Text>
          <View style={[styles.menuList, { backgroundColor: COLORS.card }]}>
            <Pressable
              style={styles.menuItem}
              onPress={() => router.push("/performance-report" as any)}
            >
              <View style={[styles.menuIconWrap, { backgroundColor: COLORS.cardAlt }]}>
                <Feather name="bar-chart-2" size={16} color={COLORS.mutedLight} />
              </View>
              <Text style={[styles.menuText, { color: themeText }]}>Laporan Kinerja</Text>
              <Feather name="chevron-right" size={16} color={COLORS.border} />
            </Pressable>
            <View style={styles.menuDivider} />
            <Pressable
              style={styles.menuItem}
              onPress={() => router.push("/achievements" as any)}
            >
              <View style={[styles.menuIconWrap, { backgroundColor: COLORS.cardAlt }]}>
                <Feather name="star" size={16} color={COLORS.mutedLight} />
              </View>
              <Text style={[styles.menuText, { color: themeText }]}>Pencapaian & Badge</Text>
              <Feather name="chevron-right" size={16} color={COLORS.border} />
            </Pressable>
          </View>
        </View>

        <View style={styles.menuSection}>
          <Text style={[styles.sectionTitle, { color: themeText }]}>Akun</Text>
          <View style={[styles.menuList, { backgroundColor: COLORS.card }]}>
            <Pressable
              style={styles.menuItem}
              onPress={() => router.push("/change-password" as any)}
            >
              <View style={[styles.menuIconWrap, { backgroundColor: COLORS.cardAlt }]}>
                <Feather name="lock" size={16} color={COLORS.mutedLight} />
              </View>
              <Text style={[styles.menuText, { color: themeText }]}>Ubah Password</Text>
              <Feather name="chevron-right" size={16} color={COLORS.border} />
            </Pressable>
            <View style={styles.menuDivider} />
            <Pressable
              style={styles.menuItem}
              onPress={() => setShowLogoutModal(true)}
            >
              <View style={[styles.menuIconWrap, { backgroundColor: "rgba(239, 68, 68, 0.2)" }]}>
                <Feather name="log-out" size={16} color={COLORS.danger} />
              </View>
              <Text style={[styles.menuText, { color: COLORS.danger }]}>Keluar Akun</Text>
            </Pressable>
          </View>
        </View>

      </ScrollView>

      {/* MODAL EDIT */}
      <Modal visible={isEditing} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheet, { backgroundColor: themeBg }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: themeText }]}>Edit Profil</Text>
              <Pressable onPress={handleCancel}>
                <Ionicons name="close" size={20} color={COLORS.mutedLight} />
              </Pressable>
            </View>

            <ScrollView contentContainerStyle={{ gap: 16 }} showsVerticalScrollIndicator={false}>
              
              <View>
                <Text style={styles.modalLabel}>Foto Profil</Text>
                <View style={styles.imagePickerRow}>
                  <View style={styles.previewBox}>
                    {editAvatar ? <Image source={{ uri: editAvatar }} style={styles.previewImg} /> : <Feather name="user" size={24} color={COLORS.mutedLight} />}
                  </View>
                  <Pressable style={styles.outlineBtn} onPress={() => pickImage("avatar")}>
                    <Text style={styles.outlineBtnText}>Pilih Foto</Text>
                  </Pressable>
                </View>
              </View>

              <View>
                <Text style={styles.modalLabel}>Background Profil</Text>
                <View style={styles.imagePickerRow}>
                  <View style={styles.previewBoxBg}>
                    {editBg ? <Image source={{ uri: editBg }} style={styles.previewImg} /> : <Feather name="image" size={24} color={COLORS.mutedLight} />}
                  </View>
                  <Pressable style={styles.outlineBtn} onPress={() => pickImage("background")}>
                    <Text style={styles.outlineBtnText}>Pilih Latar</Text>
                  </Pressable>
                </View>
              </View>

              <View>
                <Text style={styles.modalLabel}>Nama Lengkap</Text>
                <TextInput
                  value={editName}
                  onChangeText={setEditName}
                  style={[styles.modalInput, { backgroundColor: COLORS.card, color: themeText }]}
                />
              </View>

              <View>
                <Text style={styles.modalLabel}>Email</Text>
                <TextInput
                  value={editEmail}
                  onChangeText={setEditEmail}
                  keyboardType="email-address"
                  style={[styles.modalInput, { backgroundColor: COLORS.card, color: themeText }]}
                />
              </View>

              <Pressable style={styles.modalSubmit} onPress={handleSave}>
                <Text style={styles.modalSubmitText}>Simpan Perubahan</Text>
              </Pressable>
              
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* MODAL LOGOUT */}
      <Modal visible={showLogoutModal} transparent animationType="fade">
        <View style={styles.logoutModalOverlay}>
          <View style={[styles.logoutSheet, { backgroundColor: themeBg, borderColor: COLORS.border }]}>
            <View style={styles.logoutIconBox}>
              <Feather name="log-out" size={28} color={COLORS.danger} />
            </View>
            <Text style={[styles.logoutTitle, { color: themeText }]}>Keluar dari Akun?</Text>
            <Text style={[styles.logoutDesc, { color: COLORS.mutedLight }]}>
              Anda perlu masuk kembali dengan akun Anda untuk mengakses tugas dan aktivitas.
            </Text>

            <View style={styles.logoutBtnRow}>
              <Pressable
                style={[styles.cancelBtn, { borderColor: COLORS.border }]}
                onPress={() => setShowLogoutModal(false)}
              >
                <Text style={[styles.cancelBtnText, { color: themeText }]}>Batal</Text>
              </Pressable>

              <Pressable
                style={[styles.confirmLogoutBtn, { backgroundColor: COLORS.danger }]}
                onPress={handleLogout}
              >
                <Text style={styles.confirmLogoutBtnText}>Keluar</Text>
              </Pressable>
            </View>
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
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  logoBox: {
    width: 22,
    height: 22,
    borderRadius: 7,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    fontSize: 14,
    fontWeight: "600",
  },
  contentPad: {
    padding: 14,
    gap: 14,
    paddingBottom: 40,
  },
  heroCard: {
    backgroundColor: COLORS.card,
    borderRadius: 18,
    padding: 20,
    overflow: "hidden",
  },
  heroContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  avatarWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.accent,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: COLORS.bg,
    overflow: "hidden",
  },
  avatarImg: { width: "100%", height: "100%", resizeMode: "cover" },
  avatarText: { fontSize: 24, fontWeight: "800", color: COLORS.white },
  profileName: { fontSize: 18, fontWeight: "600", color: COLORS.white, marginBottom: 4 },
  profileEmail: { fontSize: 12, color: COLORS.mutedLight },

  statsRow: { flexDirection: "row", gap: 10 },
  statBox: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
  },
  iconWrap: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  statVal: { fontSize: 16, fontWeight: "700", color: COLORS.white, marginBottom: 2 },
  statLab: { fontSize: 11, color: COLORS.mutedLight },

  menuSection: { marginTop: 10 },
  sectionTitle: { fontSize: 14, fontWeight: "500", marginBottom: 10 },
  menuList: { borderRadius: 16, overflow: "hidden" },
  menuItem: { flexDirection: "row", alignItems: "center", padding: 14 },
  menuIconWrap: { width: 32, height: 32, borderRadius: 10, alignItems: "center", justifyContent: "center", marginRight: 12 },
  menuText: { flex: 1, fontSize: 13, fontWeight: "500" },
  menuDivider: { height: 1, backgroundColor: COLORS.border, marginLeft: 58 },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalSheet: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, maxHeight: "90%", borderWidth: 1, borderColor: COLORS.border },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  modalTitle: { fontSize: 16, fontWeight: "800" },
  modalLabel: { fontSize: 11, fontWeight: "700", color: COLORS.mutedLight, marginBottom: 6 },
  imagePickerRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  previewBox: { width: 56, height: 56, borderRadius: 28, backgroundColor: COLORS.cardAlt, alignItems: "center", justifyContent: "center", overflow: "hidden" },
  previewBoxBg: { width: 80, height: 56, borderRadius: 12, backgroundColor: COLORS.cardAlt, alignItems: "center", justifyContent: "center", overflow: "hidden" },
  previewImg: { width: "100%", height: "100%", resizeMode: "cover" },
  outlineBtn: { borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 999 },
  outlineBtnText: { fontSize: 12, fontWeight: "600", color: COLORS.white },
  modalInput: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, fontSize: 12 },
  modalSubmit: { marginTop: 20, backgroundColor: COLORS.accent, paddingVertical: 14, borderRadius: 999, alignItems: "center" },
  modalSubmitText: { color: COLORS.white, fontWeight: "700", fontSize: 13 },

  // Logout Modal
  logoutModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  logoutSheet: {
    width: "100%",
    borderRadius: 20,
    borderWidth: 1,
    padding: 24,
    alignItems: "center",
    gap: 12,
  },
  logoutIconBox: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(239, 68, 68, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  logoutTitle: {
    fontSize: 18,
    fontWeight: "800",
    textAlign: "center",
  },
  logoutDesc: {
    fontSize: 13,
    textAlign: "center",
    lineHeight: 18,
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  logoutBtnRow: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
    marginTop: 4,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: "center",
  },
  cancelBtnText: {
    fontSize: 13,
    fontWeight: "700",
  },
  confirmLogoutBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 999,
    alignItems: "center",
  },
  confirmLogoutBtnText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "700",
  },
});
