import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  FlatList,
  Modal,
} from "react-native";
import { useAppTheme } from "../store/themeStore";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

// Mock Data matching the web table
const workspaces = [
  { id: "1", title: "2026 - BKPM - DWS", desc: "-", createdBy: "Ferry Samsuhadi", status: "Not Requested" },
  { id: "2", title: "2026 Kemenlu - SIPPWNI", desc: "-", createdBy: "Ferry Samsuhadi", status: "Not Requested" },
  { id: "3", title: "808 testing", desc: "akun testing Product", createdBy: "Bob", status: "Not Requested" },
  { id: "4", title: "Admin Project", desc: "-", createdBy: "Masagus Muhammad Affandi Hidayat", status: "Not Requested" },
  { id: "5", title: "Aplikasi Desain Industri - DJKI", desc: "-", createdBy: "Muhammad Nurtannio", status: "Not Requested" },
  { id: "6", title: "ATR BPN presentation of tanahku mobile app", desc: "-", createdBy: "Dhiya Afwan Taufiq", status: "Not Requested" },
  { id: "7", title: "Bea cukai - Ceisa tahap VII", desc: "-", createdBy: "Hendrik Christian Emerson Saroinsong", status: "Not Requested" },
];

export default function JoinWorkspaceScreen() {
  const { colors } = useAppTheme();
  
  const COLORS = React.useMemo(() => ({
    bg: colors.background,
    card: colors.surface,
    border: colors.border,
    text: colors.text,
    textMuted: colors.textSecondary,
    primary: "#0f52ba", // A strong professional blue for Request button
    lightGray: "rgba(0,0,0,0.04)",
    white: "#ffffff",
  }), [colors]);

  const styles = React.useMemo(() => getStyles(COLORS), [COLORS]);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredWorkspaces = workspaces.filter(w => 
    w.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    w.createdBy.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const [requestedIds, setRequestedIds] = useState<string[]>([]);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [successWorkspaceTitle, setSuccessWorkspaceTitle] = useState("");

  const handleRequest = (item: typeof workspaces[0]) => {
    setSuccessWorkspaceTitle(item.title);
    setSuccessModalVisible(true);
    setRequestedIds(prev => [...prev, item.id]);
  };

  const renderItem = ({ item, index }: { item: typeof workspaces[0], index: number }) => {
    const isRequested = requestedIds.includes(item.id);
    
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.titleRow}>
            <Text style={styles.cardNumber}>{index + 1}.</Text>
            <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
          </View>
          <View style={[styles.statusBadge, isRequested && styles.statusBadgeRequested]}>
            <Text style={[styles.statusText, isRequested && styles.statusTextRequested]}>
              {isRequested ? "Requested" : item.status}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.cardBody}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Description</Text>
            <Text style={styles.infoValue} numberOfLines={2}>{item.desc}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Created By</Text>
            <Text style={styles.infoValue} numberOfLines={2}>{item.createdBy}</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.requestBtn, isRequested && styles.requestedBtn]} 
          onPress={() => !isRequested && handleRequest(item)}
          disabled={isRequested}
          activeOpacity={0.7}
        >
          <Ionicons name="paper-plane" size={16} color={isRequested ? COLORS.textMuted : COLORS.white} />
          <Text style={[styles.requestBtnText, isRequested && styles.requestedBtnText]}>
            {isRequested ? "Request Sent" : "Request"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Join Workspace</Text>
        </View>
      </View>

      {/* SEARCH BAR */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search workspace"
            placeholderTextColor={COLORS.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* LIST */}
      <FlatList
        data={filteredWorkspaces}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* FOOTER (Web Table Pagination Replica) */}
      <View style={styles.footerContainer}>
        <Text style={styles.footerInfo}>Showing 1 to 10 of 148 workspaces</Text>
        <View style={styles.paginationRow}>
          <TouchableOpacity style={styles.pageBtn}><Ionicons name="chevron-back-circle-outline" size={20} color={COLORS.textMuted} /></TouchableOpacity>
          <View style={styles.pageNumberActive}><Text style={styles.pageNumberActiveText}>1</Text></View>
          <TouchableOpacity style={styles.pageNumber}><Text style={styles.pageNumberText}>2</Text></TouchableOpacity>
          <TouchableOpacity style={styles.pageNumber}><Text style={styles.pageNumberText}>3</Text></TouchableOpacity>
          <TouchableOpacity style={styles.pageNumber}><Text style={styles.pageNumberText}>...</Text></TouchableOpacity>
          <TouchableOpacity style={styles.pageBtn}><Ionicons name="chevron-forward-circle-outline" size={20} color={COLORS.textMuted} /></TouchableOpacity>
        </View>
      </View>

      {/* CUSTOM SUCCESS MODAL */}
      <Modal visible={successModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalIconContainer}>
              <Ionicons name="checkmark-circle" size={64} color="#10b981" />
            </View>
            <Text style={styles.modalTitle}>Request Sent!</Text>
            <Text style={styles.modalMessage}>
              Permintaan Anda untuk bergabung dengan workspace{"\n"}
              <Text style={{ fontWeight: "bold", color: COLORS.text }}>"{successWorkspaceTitle}"</Text>{"\n"}
              telah berhasil dikirim ke Admin.
            </Text>
            <TouchableOpacity 
              style={styles.modalBtn} 
              onPress={() => setSuccessModalVisible(false)}
            >
              <Text style={styles.modalBtnText}>Awesome!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const getStyles = (COLORS: any) => StyleSheet.create({
  safe: { 
    flex: 1, 
    backgroundColor: COLORS.bg 
  },
  header: { 
    flexDirection: "row", 
    alignItems: "center", 
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  backBtn: {
    padding: 4,
    marginLeft: -4,
  },
  headerTitle: { 
    fontSize: 18, 
    fontWeight: "bold", 
    color: COLORS.text 
  },
  searchContainer: {
    padding: 16,
    backgroundColor: COLORS.bg,
    alignItems: "flex-end", // Align to right like web
  },
  searchBox: {
    width: "100%",
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 6,
    height: 40,
    paddingHorizontal: 12,
    justifyContent: "center",
  },
  searchInput: {
    fontSize: 14,
    color: COLORS.text,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 12,
  },
  card: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    padding: 16,
    elevation: 2, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: "row",
    flex: 1,
    paddingRight: 12,
  },
  cardNumber: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.textMuted,
    marginRight: 6,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.text,
    flexShrink: 1,
  },
  statusBadge: {
    backgroundColor: COLORS.lightGray,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statusBadgeRequested: {
    backgroundColor: "rgba(16, 185, 129, 0.1)", // Light green
    borderColor: "rgba(16, 185, 129, 0.3)",
  },
  statusText: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: "600",
  },
  statusTextRequested: {
    color: "#10b981", // Green
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginBottom: 12,
  },
  cardBody: {
    gap: 8,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
  },
  infoLabel: {
    width: 90,
    fontSize: 13,
    color: COLORS.textMuted,
    fontWeight: "500",
  },
  infoValue: {
    flex: 1,
    fontSize: 13,
    color: COLORS.text,
    fontWeight: "400",
  },
  requestBtn: {
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 6,
    gap: 8,
  },
  requestedBtn: {
    backgroundColor: COLORS.lightGray,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  requestBtnText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "bold",
  },
  requestedBtnText: {
    color: COLORS.textMuted,
  },
  footerContainer: {
    padding: 16,
    backgroundColor: COLORS.card,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    alignItems: "center",
    gap: 12,
  },
  footerInfo: {
    fontSize: 13,
    color: COLORS.textMuted,
  },
  paginationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  pageBtn: {
    padding: 4,
  },
  pageNumber: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
  },
  pageNumberText: {
    fontSize: 14,
    color: COLORS.textMuted,
  },
  pageNumberActive: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    backgroundColor: "rgba(16, 185, 129, 0.15)", // Light green highlight like web
  },
  pageNumberActiveText: {
    fontSize: 14,
    color: "#10b981", // Green text
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalContainer: {
    width: "100%",
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  modalIconContainer: {
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },
  modalBtn: {
    backgroundColor: "#10b981", // Success green
    width: "100%",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  modalBtnText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
  }
});
