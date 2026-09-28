import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  ToastAndroid,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useAppTheme } from "../store/themeStore";

export default function InviteWorkspaceModal() {
  const { colors, mode } = useAppTheme();
  
  // Refined palette based on the clean web UI
  const COLORS = {
    bg: mode === 'dark' ? '#121212' : '#ffffff',
    text: mode === 'dark' ? '#f1f5f9' : '#334155',
    textMuted: mode === 'dark' ? '#94a3b8' : '#94a3b8',
    border: mode === 'dark' ? '#334155' : '#e2e8f0',
    inputBg: mode === 'dark' ? '#1e293b' : '#ffffff',
    primary: '#10b981', // green for copy link button
    surfaceAlt: mode === 'dark' ? '#1e293b' : '#f8fafc',
  };

  const [searchInvite, setSearchInvite] = useState("");
  const [searchInactive, setSearchInactive] = useState("");

  const handleCopyLink = () => {
    // In a real app, this would use expo-clipboard
    if (Platform.OS === 'android') {
       ToastAndroid.show('Link copied to clipboard!', ToastAndroid.SHORT);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: COLORS.bg }]} edges={["top", "bottom"]}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* HEADER */}
          <View style={styles.headerRow}>
            <Text style={[styles.headerTitle, { color: COLORS.text }]}>Invite to Workspace</Text>
            <TouchableOpacity 
              style={[styles.closeButton, { borderColor: COLORS.textMuted }]} 
              onPress={() => router.back()}
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={20} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>

          {/* MAIN SEARCH INPUT */}
          <View style={[styles.inputContainer, { backgroundColor: COLORS.inputBg, borderColor: COLORS.border, marginBottom: 16 }]}>
             <Ionicons name="search-outline" size={20} color={COLORS.textMuted} style={styles.inputIcon} />
             <TextInput 
                placeholder="Search by name or email to invite"
                placeholderTextColor={COLORS.textMuted}
                style={[styles.input, { color: COLORS.text }]}
                value={searchInvite}
                onChangeText={setSearchInvite}
             />
          </View>

          {/* INVITE LINK CARD */}
          <View style={[styles.linkCard, { backgroundColor: COLORS.surfaceAlt, borderColor: COLORS.border }]}>
             <View style={styles.linkCardLeft}>
                <Feather name="link" size={18} color={COLORS.textMuted} />
                <Text style={[styles.linkCardText, { color: COLORS.textMuted }]}>Invite to workspace with a link</Text>
             </View>
             <TouchableOpacity 
                style={[styles.copyBtn, { borderColor: COLORS.primary }]} 
                onPress={handleCopyLink}
                activeOpacity={0.7}
             >
                <Feather name="copy" size={16} color={COLORS.primary} style={{ marginRight: 6 }} />
                <Text style={[styles.copyBtnText, { color: COLORS.primary }]}>Copy link</Text>
             </TouchableOpacity>
          </View>

          {/* DIVIDER */}
          <View style={[styles.divider, { backgroundColor: COLORS.border }]} />

          {/* INACTIVE MEMBERS SECTION */}
          <Text style={[styles.sectionTitle, { color: COLORS.text }]}>Inactive Members</Text>
          
          <View style={[styles.inputContainer, { backgroundColor: COLORS.inputBg, borderColor: COLORS.border, marginBottom: 24 }]}>
             <TextInput 
                placeholder="Search inactive members by name..."
                placeholderTextColor={COLORS.textMuted}
                style={[styles.input, { color: COLORS.text, paddingLeft: 16 }]}
                value={searchInactive}
                onChangeText={setSearchInactive}
             />
          </View>

          {/* TABLE HEADER (Adapted for Mobile) */}
          <View style={styles.tableHeaderRow}>
            <Text style={[styles.tableHeaderText, { color: COLORS.text, flex: 2 }]}>Name</Text>
            <Text style={[styles.tableHeaderText, { color: COLORS.text, flex: 1.5, textAlign: 'center' }]}>Role</Text>
            <Text style={[styles.tableHeaderText, { color: COLORS.text, flex: 1.5, textAlign: 'right' }]}>Position</Text>
          </View>
          <View style={[styles.tableDivider, { backgroundColor: COLORS.border }]} />

          {/* EMPTY STATE */}
          <View style={styles.emptyState}>
             <Text style={[styles.emptyStateText, { color: COLORS.textMuted }]}>Data not found</Text>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  inputIcon: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 14,
    paddingRight: 16,
  },
  linkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 32,
  },
  linkCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  linkCardText: {
    fontSize: 14,
    marginLeft: 10,
    fontWeight: '500',
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#ffffff', // Ensures the button is always white/solid
  },
  copyBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    width: '100%',
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  tableHeaderText: {
    fontSize: 14,
    fontWeight: '700',
  },
  tableDivider: {
    height: 1,
    width: '100%',
    marginBottom: 32,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  emptyStateText: {
    fontSize: 15,
    fontWeight: '500',
  },
});
