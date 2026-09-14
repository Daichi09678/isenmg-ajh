import React from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useUserStore } from "../../store/userStore";

const COLORS = {
  bg: "#0f172a", // Dark slate background
  card: "#1e293b", // Card background
  border: "#334155",
  text: "#f8fafc",
  textMuted: "#94a3b8",
  primary: "#3b82f6", // Blue for buttons
  primaryLight: "#0ea5e9",
  green: "#10b981", // Create button
  yellow: "#fbbf24", // Star icon
  purple: "#8b5cf6",
};

export default function WorkspaceScreen() {
  const { name, avatarUrl } = useUserStore();
  return (
    <SafeAreaView edges={["top"]} style={styles.safe}>
      {/* HEADER: PT Mitreka Solusi Indonesia */}
      <View style={styles.topHeader}>
        <View style={styles.companyHeader}>
          <View style={styles.companyIconBox}>
            <Image 
              source={require("../../../assets/images/mitreka.png")}
              style={{ width: 40, height: 40, resizeMode: 'contain' }}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.companyTitle}>PT Mitreka Solusi Indonesia</Text>
            <Text style={styles.companySub}>Company Industry</Text>
          </View>
          <View style={styles.avatarContainer}>
            {avatarUrl ? (
              <Image source={{ uri: avatarUrl }} style={{ width: "100%", height: "100%" }} />
            ) : (
              <Text style={{ color: COLORS.text, fontWeight: "bold", fontSize: 16 }}>{name ? name.charAt(0).toUpperCase() : "?"}</Text>
            )}
          </View>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity 
            style={[styles.actionBtn, { backgroundColor: COLORS.primary }]}
            onPress={() => router.push("/export-tasks")}
          >
            <Ionicons name="download-outline" size={14} color={COLORS.text} />
            <Text style={styles.actionText}>Export</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionBtn, { backgroundColor: COLORS.green }]}
            onPress={() => router.push("/create-workspace")}
          >
            <Ionicons name="add" size={14} color={COLORS.text} />
            <Text style={styles.actionText}>Create</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionBtn, { backgroundColor: COLORS.primaryLight }]}
            onPress={() => router.push("/join-workspace")}
          >
            <Ionicons name="person-add-outline" size={14} color={COLORS.text} />
            <Text style={styles.actionText}>Join</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.contentPad} showsVerticalScrollIndicator={false}>
        {/* Favorite Workspaces */}
        <CollapsibleSection title="Favorite Workspaces" count={8} icon="star" color={COLORS.yellow} initiallyCollapsed={false}>
          <WorkspaceCard title="Asabri Yandu Next-Gen" subtitle="2026-Yandu Nextgen Asabri" bg="#60a5fa" />
          <WorkspaceCard title="Mobile Asabri" subtitle="ASABRI" bg="#ffffff" textColor="#0f172a" />
          <WorkspaceCard title="PIR 2025" subtitle="" bg="#34d399" />
          <WorkspaceCard title="Design Manager" subtitle="" bg="#0f172a" />
        </CollapsibleSection>

        {/* Personal Workspaces */}
        <CollapsibleSection title="Personal Workspaces" count={1} icon="person" color={COLORS.green} initiallyCollapsed={false}>
           <WorkspaceCard title="Personal Workspace" subtitle="" bg="#1e293b" isUpload />
        </CollapsibleSection>

        {/* Other Categories */}
        <CollapsibleSection title="Asabri" count={2} icon="cube" color={COLORS.purple} initiallyCollapsed={true}>
          <WorkspaceCard title="Asabri Portal" subtitle="Internal" bg="#60a5fa" />
          <WorkspaceCard title="Asabri Mobile" subtitle="App" bg="#34d399" />
        </CollapsibleSection>
        <CollapsibleSection title="ESDM" count={1} icon="cube" color={COLORS.purple} initiallyCollapsed={true}>
           <WorkspaceCard title="ESDM Reporting" subtitle="Dashboard" bg="#f43f5e" />
        </CollapsibleSection>
        <CollapsibleSection title="Internal" count={1} icon="cube" color={COLORS.purple} initiallyCollapsed={true}>
           <WorkspaceCard title="Internal Tools" subtitle="Admin" bg="#a855f7" />
        </CollapsibleSection>
        <CollapsibleSection title="Your Workspaces" count={5} icon="layers" color={COLORS.primaryLight} initiallyCollapsed={true}>
           <WorkspaceCard title="My Project 1" subtitle="" bg="#1e293b" />
           <WorkspaceCard title="My Project 2" subtitle="" bg="#1e293b" />
           <WorkspaceCard title="My Project 3" subtitle="" bg="#1e293b" />
           <WorkspaceCard title="My Project 4" subtitle="" bg="#1e293b" />
           <WorkspaceCard title="My Project 5" subtitle="" bg="#1e293b" />
        </CollapsibleSection>
        <CollapsibleSection title="Archived Workspaces" count={0} icon="archive" color={COLORS.textMuted} initiallyCollapsed={true}>
           <View style={{ width: 240, height: 140, justifyContent: 'center', alignItems: 'center' }}>
             <Text style={{ color: COLORS.textMuted }}>No archived workspaces</Text>
           </View>
        </CollapsibleSection>
      </ScrollView>
    </SafeAreaView>
  );
}

function CollapsibleSection({ title, count, icon, color, initiallyCollapsed = false, children }: any) {
  const [isCollapsed, setIsCollapsed] = React.useState(initiallyCollapsed);

  return (
    <View style={{ marginBottom: isCollapsed ? 16 : 0 }}>
      <TouchableOpacity 
        style={styles.sectionHeader} 
        onPress={() => setIsCollapsed(!isCollapsed)}
        activeOpacity={0.7}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Ionicons name={icon as any} size={16} color={color} />
          <Text style={[styles.sectionTitle, { color: color || COLORS.text }]}>{title}</Text>
          <Text style={styles.sectionCount}>({count})</Text>
        </View>
        <Ionicons name={isCollapsed ? "chevron-down" : "chevron-up"} size={16} color={COLORS.textMuted} />
      </TouchableOpacity>
      {!isCollapsed && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
          {children}
        </ScrollView>
      )}
    </View>
  );
}

function WorkspaceCard({ title, subtitle, bg, textColor = COLORS.text, isUpload }: any) {
  return (
    <TouchableOpacity 
      style={[styles.workspaceCard, { backgroundColor: bg }]}
      activeOpacity={0.8}
      onPress={() => router.push("/(tabs)/settings")}
    >
      {isUpload ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
           <Ionicons name="cloud-upload-outline" size={32} color={COLORS.textMuted} />
        </View>
      ) : (
        <View style={{ flex: 1, padding: 12 }}>
          {/* Card Content */}
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: 'flex-start' }}>
             <View style={styles.bookmarkIcon}>
               <Ionicons name="bookmark" size={16} color={COLORS.text} />
             </View>
             <View style={{ flexDirection: "row", gap: 4 }}>
               <View style={styles.cardIconBox}><Ionicons name="person" size={12} color={COLORS.text} /></View>
               <View style={styles.cardIconBox}><Ionicons name="star" size={12} color={COLORS.yellow} /></View>
             </View>
          </View>
          {subtitle ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={[styles.cardSubtitle, { color: textColor }]}>{subtitle}</Text>
            </View>
          ) : null}
        </View>
      )}
      <View style={styles.cardFooter}>
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  topHeader: { padding: 20, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  companyHeader: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 16 },
  companyIconBox: { width: 48, height: 48, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  avatarContainer: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.card, alignItems: "center", justifyContent: "center", overflow: "hidden" },
  companyTitle: { fontSize: 20, fontWeight: "bold", color: COLORS.text },
  companySub: { fontSize: 13, color: COLORS.textMuted },
  actionRow: { flexDirection: "row", justifyContent: "flex-end", gap: 8 },
  actionBtn: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 6 },
  actionText: { fontSize: 13, fontWeight: "600", color: COLORS.text },
  contentPad: { padding: 20, paddingBottom: 100 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 8, marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: "600" },
  sectionCount: { fontSize: 14, color: COLORS.textMuted },
  horizontalList: { gap: 12, paddingBottom: 16 },
  workspaceCard: { width: 240, height: 140, borderRadius: 12, overflow: "hidden", borderWidth: 1, borderColor: COLORS.border },
  cardFooter: { backgroundColor: COLORS.card, padding: 12, borderTopWidth: 1, borderTopColor: COLORS.border },
  cardTitle: { fontSize: 13, fontWeight: "600", color: COLORS.text },
  cardSubtitle: { fontSize: 12, fontWeight: "bold", textAlign: 'center' },
  cardIconBox: { width: 24, height: 24, borderRadius: 4, backgroundColor: "rgba(0,0,0,0.3)", alignItems: "center", justifyContent: "center" },
  bookmarkIcon: { width: 24, height: 32, backgroundColor: 'rgba(0,0,0,0.3)', alignItems: 'center', justifyContent: 'center', borderBottomLeftRadius: 4, borderBottomRightRadius: 4, marginTop: -12 },
});
