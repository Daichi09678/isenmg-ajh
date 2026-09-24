import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Platform,
  Modal
} from "react-native";
import CustomModal from "../components/CustomModal";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAppTheme } from "../store/themeStore";

interface NotificationItem {
  id: string;
  taskName: string;
  time: string;
  isRead: boolean;
}

const mockNotifications: NotificationItem[] = [
  {
    id: "1",
    taskName: "Pembuatan desain banner ngantor",
    time: "24 Sep 2026 09:11",
    isRead: false,
  },
  {
    id: "2",
    taskName: "Pembuatan desain banner ngantor",
    time: "23 Sep 2026 17:36",
    isRead: false,
  },
  {
    id: "3",
    taskName: "Membuat desain mobile TaskFlow",
    time: "23 Sep 2026 14:51",
    isRead: false,
  },
  {
    id: "4",
    taskName: "Membuat desain mobile TaskFlow",
    time: "23 Sep 2026 12:22",
    isRead: false,
  },
];

export default function NotificationsScreen() {
  const router = useRouter();
  const { mode, colors } = useAppTheme();
  
  const [onlyShowUnread, setOnlyShowUnread] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);

  // Custom Modal States
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ title: "", message: "", type: "info" as "info"|"success"|"error" });

  const showAlert = (title: string, message: string, type: "info"|"success"|"error" = "info") => {
    setAlertConfig({ title, message, type });
    setAlertVisible(true);
  };

  const COLORS = useMemo(() => ({
    bg: colors.background,
    card: colors.surface,
    border: colors.border,
    text: colors.text,
    textMuted: colors.textSecondary,
    primary: colors.accent,
    blue: "#3b82f6",
    unreadBg: "rgba(59, 130, 246, 0.05)",
  }), [colors]);

  const styles = useMemo(() => getStyles(COLORS), [COLORS]);

  const filteredNotifications = useMemo(() => {
    if (onlyShowUnread) {
      return notifications.filter((n) => !n.isRead);
    }
    return notifications;
  }, [notifications, onlyShowUnread]);

  const toggleReadStatus = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: !n.isRead } : n))
    );
  };

  return (
    <SafeAreaView edges={["top"]} style={[styles.safe, { backgroundColor: COLORS.bg }]}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notifications</Text>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.toggleContainer}>
            <Text style={styles.toggleLabel}>Only show unread</Text>
            <Switch
              value={onlyShowUnread}
              onValueChange={setOnlyShowUnread}
              trackColor={{ false: COLORS.border, true: COLORS.primary }}
              thumbColor={Platform.OS === 'ios' ? '#FFFFFF' : (onlyShowUnread ? '#FFFFFF' : '#f4f3f4')}
              style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
            />
          </View>
          <TouchableOpacity style={styles.menuBtn} onPress={() => showAlert("Opsi", "Menu pilihan lainnya akan muncul di sini.", "info")}>
            <Ionicons name="ellipsis-vertical" size={20} color={COLORS.text} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContainer}>
        {filteredNotifications.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="notifications-off-outline" size={48} color={COLORS.border} />
            <Text style={styles.emptyText}>No notifications found</Text>
          </View>
        ) : (
          filteredNotifications.map((notif) => (
            <View 
              key={notif.id} 
              style={[
                styles.notifCard,
                !notif.isRead && { backgroundColor: COLORS.unreadBg }
              ]}
            >
              <View style={styles.notifIconContainer}>
                <Ionicons name="notifications" size={20} color={COLORS.blue} />
              </View>
              
              <View style={styles.notifContent}>
                <Text style={styles.notifMessage}>
                  Your running task <Text style={styles.taskLink}>{notif.taskName}</Text> has been paused due to inactivity.
                </Text>
                <Text style={styles.notifTime}>{notif.time}</Text>
              </View>

              <TouchableOpacity 
                style={styles.notifAction}
                onPress={() => toggleReadStatus(notif.id)}
              >
                <Ionicons 
                  name={notif.isRead ? "checkmark-circle" : "ellipse-outline"} 
                  size={24} 
                  color={notif.isRead ? COLORS.primary : COLORS.border} 
                />
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
      
      <CustomModal 
        visible={alertVisible}
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.message}
        onClose={() => setAlertVisible(false)}
      />
    </SafeAreaView>
  );
}

const getStyles = (COLORS: any) => StyleSheet.create({
  safe: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.card,
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
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.text,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  toggleLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  menuBtn: {
    padding: 4,
  },
  listContainer: {
    paddingBottom: 24,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
    gap: 12,
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: 14,
  },
  notifCard: {
    flexDirection: "row",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    alignItems: "flex-start",
  },
  notifIconContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  notifContent: {
    flex: 1,
    paddingRight: 12,
  },
  notifMessage: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.text,
  },
  taskLink: {
    color: COLORS.blue,
    fontWeight: "500",
    textDecorationLine: "underline",
  },
  notifTime: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 6,
  },
  notifAction: {
    padding: 4,
    marginLeft: "auto",
    alignSelf: "center",
  },
});
