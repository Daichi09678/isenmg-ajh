import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal, Animated, TextInput, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTaskStore } from "../store/taskStore";
import { useUserStore } from "../store/userStore";

import { useAppTheme } from "../store/themeStore";

const ACTIVE_MEMBERS = [
  { id: "1", name: "Muhammad Ifrozin", initials: "MI", role: "Lead Developer", color: "#3b82f6" },
  { id: "2", name: "Vrika Nurrahman", initials: "VN", role: "QA Engineer", color: "#10b981" },
  { id: "3", name: "Farid Abdul Aziz", initials: "FA", role: "DevOps Engineer", color: "#8b5cf6" },
  { id: "4", name: "Puspita Sari", initials: "PS", role: "Backend Developer", color: "#f59e0b" },
];

const BlinkingDot = ({ COLORS }: any) => {
  const opacity = React.useRef(new Animated.Value(0.2)).current;
  
  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.2, duration: 800, useNativeDriver: true })
      ])
    ).start();
  }, []);

  return <Animated.View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.green, opacity }} />;
};

const BlinkingLiveDot = ({ isPaused, COLORS, styles }: { isPaused: boolean, COLORS: any, styles: any }) => {
  const opacity = React.useRef(new Animated.Value(0.3)).current;
  
  React.useEffect(() => {
    if (isPaused) {
      opacity.setValue(1);
      return;
    }
    
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 1000, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 1000, useNativeDriver: true })
      ])
    );
    animation.start();
    
    return () => animation.stop();
  }, [isPaused]);

  return (
    <Animated.View 
      style={[
        styles.liveDot, 
        isPaused && { backgroundColor: COLORS.yellow },
        { opacity }
      ]} 
    />
  );
};

export default function WorkspaceDetailScreen() {
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
    danger: "#ef4444",
    surfaceAlt: colors.surface,
  }), [colors]);

  const styles = React.useMemo(() => getStyles(COLORS), [COLORS]);

  const tasks = useTaskStore((s) => s.tasks);
  const updateTaskStatus = useTaskStore((s) => s.updateTaskStatus);
  const addComment = useTaskStore((s) => s.addComment);
  const { name } = useUserStore();

  const [isPaused, setIsPaused] = useState(false);
  const [activeProject, setActiveProject] = useState("Mobile Asabri");
  const [projectModalVisible, setProjectModalVisible] = useState(false);

  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const teamTasks = tasks.filter((t) => {
    if (t.taskType !== "Team") return false;
    if (searchQuery && !t.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });
  const backlogTasks = teamTasks.filter((t) => t.status === "Backlog");
  const doingTasks = teamTasks.filter((t) => t.status === "Doing");
  const mrTasks = teamTasks.filter((t) => t.status === "MR");
  const testingTasks = teamTasks.filter((t) => t.status === "Testing");
  const doneTasks = teamTasks.filter((t) => t.status === "Done");

  const backlogCount = backlogTasks.length;
  const doingCount = doingTasks.length;
  const mrCount = mrTasks.length;
  const testingCount = testingTasks.length;
  const doneCount = doneTasks.length;
  const totalCount = teamTasks.length;
  const progressPercent = totalCount === 0 ? 0 : Math.round((doneCount / totalCount) * 100);

  const [membersModalVisible, setMembersModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [taskDetail, setTaskDetail] = useState<any>(null);
  const [quickUpdateColumn, setQuickUpdateColumn] = useState<string | null>(null);
  const [quickUpdateText, setQuickUpdateText] = useState("");
  const [commentText, setCommentText] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);
  const [showToast, setShowToast] = useState(false);
  
  // Member Invite State
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Viewer");
  const [joinRequests, setJoinRequests] = useState([
     { id: '101', email: 'johndoe@gmail.com', name: 'John Doe', requestedRole: 'Viewer' }
  ]);

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    }, 1500);
  };

  const handleQuickUpdate = () => {
    if (!quickUpdateText.trim() || !quickUpdateColumn) return;
    
    useTaskStore.getState().addTask({
      title: quickUpdateText.trim(),
      description: "",
      deadline: new Date().toISOString(),
      category: "Kerja" as any,
      priority: "Sedang" as any,
      taskType: "Team",
      status: quickUpdateColumn as any,
      members: [name || "Anda"],
    });
    setQuickUpdateColumn(null);
    setQuickUpdateText("");
  };

  function BoardColumn({ title, count, color, children }: any) {
    return (
      <View style={styles.column}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <Text style={[styles.columnTitle, { color }]}>{title}</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countBadgeText}>{count}</Text>
          </View>
        </View>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
          {children}
        </ScrollView>
      </View>
    );
  }

  function TaskCard({ title, desc, tag, author, commentCount, onSelect, index = 1 }: any) {
    return (
      <TouchableOpacity 
        style={styles.taskCard}
        activeOpacity={0.8}
        onPress={onSelect}
      >
        <View style={styles.taskHeaderRow}>
          <View style={[styles.pauseBtn, { backgroundColor: index % 2 === 0 ? COLORS.danger : COLORS.green }]}>
            <Ionicons name={index % 2 === 0 ? "pause" : "play"} size={12} color={COLORS.bg} />
          </View>
          <Text style={styles.taskTagText}>[DGM-223]</Text>
          <Text style={styles.taskTitle} numberOfLines={1}>{title}</Text>
          <Ionicons name="ellipsis-vertical" size={14} color={COLORS.textMuted} style={{marginLeft: 'auto'}} />
        </View>

        {desc ? <Text style={styles.taskDesc} numberOfLines={2}>{desc}</Text> : null}

        <View style={styles.taskDetailsGrid}>
          <View style={styles.detailCell}>
            <Text style={styles.detailLabel}>Due Date</Text>
            <Text style={styles.detailValue}>Hari ini</Text>
          </View>
          <View style={styles.detailCell}>
            <Text style={styles.detailLabel}>Urgency</Text>
            <Text style={styles.detailValue}>High</Text>
          </View>
        </View>
        
        <View style={styles.taskFooter}>
          <View style={styles.taskAvatarGroup}>
             <View style={styles.miniAvatar}><Text style={styles.miniAvatarText}>{author ? author.charAt(0).toUpperCase() : "U"}</Text></View>
             <View style={[styles.miniAvatar, {marginLeft: -8, backgroundColor: COLORS.blue}]}><Text style={styles.miniAvatarText}>M</Text></View>
          </View>
          <View style={styles.tagGroup}>
             <Text style={styles.projectTag}>{tag}</Text>
             {commentCount > 0 && (
               <View style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
                 <Ionicons name="chatbubble-outline" size={10} color={COLORS.textMuted} />
                 <Text style={{ fontSize: 9, color: COLORS.textMuted }}>{commentCount}</Text>
               </View>
             )}
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView edges={["top"]} style={styles.safe}>
      {/* BAR MONITORING: Header, Avatar Anggota, Tools, & Progress Bar */}
      <View style={styles.monitoringBar}>
        {/* Top Row: Title + Project Status & Avatar Anggota in the top right */}
        <View style={styles.headerTop}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12, flex: 1 }}>
            <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 4 }}>
              <Ionicons name="arrow-back" size={24} color={COLORS.text} />
            </TouchableOpacity>

            {isSearching ? (
              <TextInput 
                autoFocus
                style={{ flex: 1, height: 36, backgroundColor: COLORS.card, borderRadius: 8, paddingHorizontal: 12, color: COLORS.text, borderWidth: 1, borderColor: COLORS.blue }}
                placeholder="Cari tugas..."
                placeholderTextColor={COLORS.textMuted}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            ) : (
              <>
                <TouchableOpacity 
                  style={{ flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: COLORS.card, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: COLORS.border }} 
                  onPress={() => setProjectModalVisible(true)}
                >
                  <Text style={styles.headerTitle}>{activeProject}</Text>
                  <Ionicons name="chevron-down" size={16} color={COLORS.text} />
                </TouchableOpacity>
                
                <View style={[styles.liveBadge, { backgroundColor: 'transparent', borderWidth: 0, paddingHorizontal: 0 }]}>
                  <BlinkingLiveDot isPaused={isPaused} COLORS={COLORS} styles={styles} />
                  <Text style={[styles.liveText, isPaused && { color: COLORS.yellow }]}>
                    {isPaused ? "Paused" : "Live"}
                  </Text>
                </View>
              </>
            )}
          </View>

          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <TouchableOpacity 
              style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: isSearching ? COLORS.blue : COLORS.card, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: isSearching ? COLORS.blue : COLORS.border }}
              activeOpacity={0.7}
              onPress={() => {
                if (isSearching) setSearchQuery("");
                setIsSearching(!isSearching);
              }}
            >
              <Ionicons name={isSearching ? "close" : "search"} size={16} color={isSearching ? COLORS.bg : COLORS.textMuted} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.avatarGroup, { paddingRight: 0 }]}
              activeOpacity={0.7}
              onPress={() => setMembersModalVisible(true)}
            >
              <View style={styles.avatarStack}>
                {ACTIVE_MEMBERS.map((member, idx) => (
                  <View 
                    key={member.id} 
                    style={[
                      styles.memberAvatar, 
                      { backgroundColor: member.color, marginLeft: idx === 0 ? 0 : -8, zIndex: 10 - idx }
                    ]}
                  >
                    <Text style={styles.avatarText}>{member.initials}</Text>
                  </View>
                ))}
                <View style={[styles.memberAvatar, styles.avatarMore, { marginLeft: -8, zIndex: 1 }]}>
                  <Text style={styles.avatarMoreText}>+2</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Progress Bar: Persentase kemajuan keseluruhan proyek/workspace */}
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Ionicons name="pie-chart-outline" size={14} color={COLORS.green} />
              <Text style={styles.progressLabel}>Kemajuan Proyek</Text>
            </View>
            <Text style={styles.progressPercent}>{progressPercent}% Selesai</Text>
          </View>
          
          <View style={styles.progressBarTrack}>
            <View 
              style={[
                styles.progressBarFill, 
                { width: `${progressPercent}%` }
              ]} 
            />
          </View>

          <View style={styles.statsRow}>
            <Text style={styles.statsSummary}>
              <Text style={{ color: COLORS.green, fontWeight: "700" }}>{doneCount}</Text> dari {totalCount} tasks
            </Text>
            <View style={{ flexDirection: "row", gap: 10 }}>
              <Text style={styles.statMini}><Text style={{ color: COLORS.blue }}>ΓùÅ</Text> Doing: {doingCount}</Text>
              <Text style={styles.statMini}><Text style={{ color: COLORS.yellow }}>ΓùÅ</Text> Test: {testingCount}</Text>
              <Text style={styles.statMini}><Text style={{ color: COLORS.green }}>ΓùÅ</Text> Done: {doneCount}</Text>
            </View>
          </View>
        </View>

        {/* Tools Row: Semua tools monitoring yang dibutuhkan langsung ada di sini */}
        <View style={styles.toolsRow}>
          <TouchableOpacity 
            style={[styles.toolBtn, { backgroundColor: COLORS.blue }]}
            onPress={() => router.push("/export-tasks")}
          >
            <Ionicons name="download-outline" size={14} color={COLORS.text} />
            <Text style={styles.toolBtnText}>Export</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.toolBtn, { backgroundColor: COLORS.green }]}
            onPress={() => router.push("/add-team-task" as any)}
          >
            <Ionicons name="add" size={15} color={COLORS.text} />
            <Text style={styles.toolBtnText}>New Task</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.toolBtnOutline, isPaused && { borderColor: COLORS.yellow }]}
            onPress={() => setIsPaused(!isPaused)}
          >
            <Ionicons name={isPaused ? "play" : "pause"} size={13} color={isPaused ? COLORS.yellow : COLORS.textMuted} />
            <Text style={[styles.toolBtnOutlineText, isPaused && { color: COLORS.yellow }]}>
              {isPaused ? "Resume" : "Pause"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.toolIconBtn}
            onPress={() => setFilterModalVisible(true)}
          >
            <Ionicons name="filter-outline" size={15} color={COLORS.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.toolIconBtn}
            onPress={handleSync}
            disabled={isSyncing}
          >
            <Ionicons name="refresh-outline" size={15} color={isSyncing ? COLORS.green : COLORS.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Sync Toast */}
        {showToast && (
          <View style={{ position: 'absolute', top: 16, right: 16, backgroundColor: COLORS.green, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 6, zIndex: 50, elevation: 5 }}>
            <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>Data tersinkronisasi</Text>
          </View>
        )}
      </View>

      {/* Kanban Board Columns */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.boardScroll}>
        <BoardColumn title="Backlog" count={backlogCount} color={COLORS.blue}>
          {backlogTasks.map((t) => (
            <TaskCard key={t.id} title={t.title} desc={t.description} tag={`T-${t.id}`} author={t.members?.[0] || 'Unknown'} commentCount={t.comments?.length || 0} onSelect={() => setTaskDetail(t)} />
          ))}
          <TouchableOpacity style={styles.newTaskBtn} onPress={() => setQuickUpdateColumn("Backlog")}>
            <Ionicons name="add" size={16} color={COLORS.textMuted} />
            <Text style={styles.newTaskText}>Update Progres</Text>
          </TouchableOpacity>
        </BoardColumn>
        
        <BoardColumn title="Doing" count={doingCount} color={COLORS.text}>
          {doingTasks.map((t) => (
            <TaskCard key={t.id} title={t.title} desc={t.description} tag={`T-${t.id}`} author={t.members?.[0] || 'Unknown'} commentCount={t.comments?.length || 0} onSelect={() => setTaskDetail(t)} />
          ))}
          <TouchableOpacity style={styles.newTaskBtn} onPress={() => setQuickUpdateColumn("Doing")}>
            <Ionicons name="add" size={16} color={COLORS.textMuted} />
            <Text style={styles.newTaskText}>Update Progres</Text>
          </TouchableOpacity>
        </BoardColumn>

        <BoardColumn title="MR" count={mrCount} color={COLORS.text}>
          {mrTasks.length === 0 && (
            <View style={styles.dropZone}>
              <Text style={styles.dropText}>Drop task here</Text>
            </View>
          )}
          {mrTasks.map((t) => (
            <TaskCard key={t.id} title={t.title} desc={t.description} tag={`T-${t.id}`} author={t.members?.[0] || 'Unknown'} commentCount={t.comments?.length || 0} onSelect={() => setTaskDetail(t)} />
          ))}
          <TouchableOpacity style={styles.newTaskBtn} onPress={() => setQuickUpdateColumn("MR")}>
            <Ionicons name="add" size={16} color={COLORS.textMuted} />
            <Text style={styles.newTaskText}>Update Progres</Text>
          </TouchableOpacity>
        </BoardColumn>
        
        <BoardColumn title="Testing" count={testingCount} color={COLORS.yellow}>
          {testingTasks.map((t) => (
            <TaskCard key={t.id} title={t.title} desc={t.description} tag={`T-${t.id}`} author={t.members?.[0] || 'Unknown'} commentCount={t.comments?.length || 0} onSelect={() => setTaskDetail(t)} />
          ))}
          <TouchableOpacity style={styles.newTaskBtn} onPress={() => setQuickUpdateColumn("Testing")}>
            <Ionicons name="add" size={16} color={COLORS.textMuted} />
            <Text style={styles.newTaskText}>Update Progres</Text>
          </TouchableOpacity>
        </BoardColumn>
        
        <BoardColumn title="Done" count={doneCount} color={COLORS.green}>
          {doneTasks.map((t) => (
            <TaskCard key={t.id} title={t.title} desc={t.description} tag={`T-${t.id}`} author={t.members?.[0] || 'Unknown'} commentCount={t.comments?.length || 0} onSelect={() => setTaskDetail(t)} />
          ))}
          <TouchableOpacity style={styles.newTaskBtn} onPress={() => setQuickUpdateColumn("Done")}>
            <Ionicons name="add" size={16} color={COLORS.textMuted} />
            <Text style={styles.newTaskText}>Update Progres</Text>
          </TouchableOpacity>
        </BoardColumn>
      </ScrollView>

      {/* CUSTOM MODALS */}
      {/* 1. Modal Anggota */}
      <Modal visible={membersModalVisible} animationType="fade" transparent onRequestClose={() => setMembersModalVisible(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Anggota Tergabung</Text>
              <TouchableOpacity onPress={() => setMembersModalVisible(false)}>
                <Ionicons name="close" size={24} color={COLORS.textMuted} />
              </TouchableOpacity>
            </View>
            <ScrollView style={{maxHeight: 400}} showsVerticalScrollIndicator={false}>
              
              {/* Join Requests Section */}
              {joinRequests.length > 0 && (
                 <View style={{marginBottom: 20}}>
                    <Text style={{color: COLORS.text, fontWeight: 'bold', marginBottom: 8}}>Permintaan Bergabung</Text>
                    {joinRequests.map(req => (
                       <View key={req.id} style={{backgroundColor: COLORS.bg, padding: 12, borderRadius: 8, marginBottom: 8}}>
                          <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                             <View>
                               <Text style={{color: COLORS.text, fontWeight: 'bold', fontSize: 13}}>{req.name}</Text>
                               <Text style={{color: COLORS.textMuted, fontSize: 11}}>{req.email}</Text>
                             </View>
                             <TouchableOpacity onPress={() => setJoinRequests(joinRequests.map(r => r.id === req.id ? {...r, requestedRole: r.requestedRole === 'Viewer' ? 'Editor' : 'Viewer'} : r))} style={{backgroundColor: COLORS.card, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, borderWidth: 1, borderColor: COLORS.border}}>
                               <Text style={{color: COLORS.textMuted, fontSize: 11}}>{req.requestedRole}</Text>
                             </TouchableOpacity>
                          </View>
                          <View style={{flexDirection: 'row', gap: 8, marginTop: 12}}>
                             <TouchableOpacity onPress={() => setJoinRequests(joinRequests.filter(r => r.id !== req.id))} style={{flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 6, borderWidth: 1, borderColor: COLORS.border}}>
                               <Text style={{color: COLORS.text, fontSize: 12, fontWeight: 'bold'}}>Tolak</Text>
                             </TouchableOpacity>
                             <TouchableOpacity onPress={() => setJoinRequests(joinRequests.filter(r => r.id !== req.id))} style={{flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 6, backgroundColor: COLORS.blue}}>
                               <Text style={{color: '#fff', fontSize: 12, fontWeight: 'bold'}}>Terima</Text>
                             </TouchableOpacity>
                          </View>
                       </View>
                    ))}
                 </View>
              )}

              {/* Invite Section */}
              <View style={{marginBottom: 20}}>
                <Text style={{color: COLORS.text, fontWeight: 'bold', marginBottom: 8}}>Undang Anggota</Text>
                <View style={{flexDirection: 'row', gap: 8, marginBottom: 8}}>
                   <TextInput
                     placeholder="Masukkan email..."
                     placeholderTextColor={COLORS.textMuted}
                     value={inviteEmail}
                     onChangeText={setInviteEmail}
                     style={{flex: 1, backgroundColor: COLORS.bg, borderWidth: 1, borderColor: COLORS.border, borderRadius: 8, paddingHorizontal: 12, color: COLORS.text, fontSize: 12}}
                   />
                   <TouchableOpacity onPress={() => setInviteRole(inviteRole === 'Viewer' ? 'Editor' : 'Viewer')} style={{backgroundColor: COLORS.bg, borderWidth: 1, borderColor: COLORS.border, borderRadius: 8, paddingHorizontal: 12, justifyContent: 'center'}}>
                     <Text style={{color: COLORS.textMuted, fontSize: 12}}>{inviteRole}</Text>
                   </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => {setInviteEmail("");}} style={{backgroundColor: COLORS.blue, paddingVertical: 10, borderRadius: 8, alignItems: 'center'}}>
                   <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 12}}>Kirim Undangan</Text>
                </TouchableOpacity>
              </View>

              <Text style={{color: COLORS.textMuted, fontSize: 12, marginBottom: 16}}>
                {ACTIVE_MEMBERS.length} Anggota sedang mengakses monitoring ini secara real-time.
              </Text>
              {ACTIVE_MEMBERS.map(m => (
                <View key={m.id} style={{flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 12}}>
                  <View style={[styles.memberAvatar, {backgroundColor: m.color, width: 36, height: 36, borderRadius: 18}]}>
                     <Text style={{color: '#fff', fontWeight: 'bold'}}>{m.initials}</Text>
                  </View>
                  <View style={{flex: 1}}>
                    <Text style={{color: COLORS.text, fontWeight: 'bold'}}>{m.name}</Text>
                    <Text style={{color: COLORS.textMuted, fontSize: 12}}>{m.role}</Text>
                  </View>
                  <View style={{flexDirection: 'row', alignItems: 'center', gap: 6}}>
                    <BlinkingDot COLORS={COLORS} />
                    <Text style={{color: COLORS.green, fontSize: 12}}>Online</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* 2. Modal Filter */}
      <Modal visible={filterModalVisible} animationType="slide" transparent onRequestClose={() => setFilterModalVisible(false)}>
        <View style={[styles.modalBackdrop, { justifyContent: 'flex-end' }]}>
          <View style={[styles.modalContent, { borderBottomLeftRadius: 0, borderBottomRightRadius: 0, paddingBottom: 40 }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter Task</Text>
              <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                <Ionicons name="close" size={24} color={COLORS.textMuted} />
              </TouchableOpacity>
            </View>
            <Text style={{color: COLORS.text, fontWeight: 'bold', marginBottom: 8, marginTop: 12}}>Prioritas</Text>
            <View style={{flexDirection: 'row', gap: 8, marginBottom: 16}}>
               <View style={styles.filterChip}><Text style={styles.filterChipText}>High</Text></View>
               <View style={styles.filterChip}><Text style={styles.filterChipText}>Medium</Text></View>
               <View style={styles.filterChip}><Text style={styles.filterChipText}>Low</Text></View>
            </View>
            <Text style={{color: COLORS.text, fontWeight: 'bold', marginBottom: 8}}>Status</Text>
            <View style={{flexDirection: 'row', gap: 8, marginBottom: 16, flexWrap: 'wrap'}}>
               <View style={styles.filterChip}><Text style={styles.filterChipText}>Backlog</Text></View>
               <View style={styles.filterChip}><Text style={styles.filterChipText}>Doing</Text></View>
               <View style={styles.filterChip}><Text style={styles.filterChipText}>Testing</Text></View>
               <View style={styles.filterChip}><Text style={styles.filterChipText}>Done</Text></View>
            </View>
            <TouchableOpacity style={styles.applyFilterBtn} onPress={() => setFilterModalVisible(false)}>
               <Text style={{color: '#fff', fontWeight: 'bold'}}>Terapkan Filter</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 3. Modal Task Detail */}
      <Modal visible={!!taskDetail} animationType="slide" transparent onRequestClose={() => setTaskDetail(null)}>
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalContent, { maxHeight: '90%' }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>T-{taskDetail?.id}</Text>
              <TouchableOpacity onPress={() => setTaskDetail(null)}>
                <Ionicons name="close" size={24} color={COLORS.textMuted} />
              </TouchableOpacity>
            </View>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={{color: COLORS.text, fontSize: 18, fontWeight: 'bold', marginBottom: 12}}>{taskDetail?.title}</Text>
              {taskDetail?.description ? <Text style={{color: COLORS.textMuted, marginBottom: 16}}>{taskDetail.description}</Text> : null}
              
              <View style={{flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 20}}>
                 <Ionicons name="person-circle" size={24} color={COLORS.textMuted} />
                 <Text style={{color: COLORS.text, fontSize: 14}}>Ditugaskan kepada <Text style={{fontWeight: 'bold'}}>{taskDetail?.members?.[0] || 'Unknown'}</Text></Text>
              </View>

              <Text style={{color: COLORS.text, fontWeight: 'bold', marginBottom: 8}}>Ubah Status</Text>
              <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24}}>
                {["Backlog", "Doing", "MR", "Testing", "Done"].map(status => (
                  <TouchableOpacity 
                    key={status}
                    style={[styles.filterChip, taskDetail?.status === status && { backgroundColor: COLORS.blue, borderColor: COLORS.blue }]}
                    onPress={() => {
                      updateTaskStatus(taskDetail.id, status as any);
                      setTaskDetail({ ...taskDetail, status });
                    }}
                  >
                    <Text style={[styles.filterChipText, taskDetail?.status === status && { color: '#fff' }]}>{status}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={{color: COLORS.text, fontWeight: 'bold', marginBottom: 12}}>Riwayat Progres & Komentar</Text>
              {taskDetail?.comments?.map((c: any) => (
                <View key={c.id} style={{backgroundColor: COLORS.taskBg, padding: 12, borderRadius: 8, marginBottom: 8}}>
                  <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4}}>
                    <Text style={{color: COLORS.blue, fontWeight: 'bold', fontSize: 13}}>{c.author}</Text>
                    <Text style={{color: COLORS.textMuted, fontSize: 11}}>{new Date(c.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</Text>
                  </View>
                  <Text style={{color: COLORS.text, fontSize: 14}}>{c.text}</Text>
                </View>
              ))}
              {(!taskDetail?.comments || taskDetail.comments.length === 0) && (
                <Text style={{color: COLORS.textMuted, fontSize: 13, fontStyle: 'italic', marginBottom: 16}}>Belum ada komentar.</Text>
              )}
            </ScrollView>

            <View style={{flexDirection: 'row', gap: 8, marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: COLORS.border}}>
              <TextInput 
                placeholder="Balas / Tulis update..."
                placeholderTextColor={COLORS.textMuted}
                style={{flex: 1, backgroundColor: COLORS.taskBg, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, color: COLORS.text}}
                value={commentText}
                onChangeText={setCommentText}
              />
              <TouchableOpacity 
                style={{backgroundColor: COLORS.green, borderRadius: 20, paddingHorizontal: 20, justifyContent: 'center'}}
                onPress={() => {
                  if (commentText.trim()) {
                    addComment(taskDetail.id, name || "Anda", commentText.trim());
                    // Optimistically update local task detail state
                    setTaskDetail({
                      ...taskDetail,
                      comments: [...(taskDetail.comments || []), { id: Date.now().toString(), author: name || "Anda", text: commentText.trim(), createdAt: new Date().toISOString() }]
                    });
                    setCommentText("");
                  }
                }}
              >
                <Ionicons name="send" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Project Switcher */}
      <Modal visible={projectModalVisible} animationType="fade" transparent onRequestClose={() => setProjectModalVisible(false)}>
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalContent, { width: "80%", alignSelf: 'center' }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Pilih Project</Text>
              <TouchableOpacity onPress={() => setProjectModalVisible(false)}>
                <Ionicons name="close" size={24} color={COLORS.textMuted} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity 
              style={[styles.filterChip, activeProject === "Mobile Asabri" && { backgroundColor: COLORS.blue, borderColor: COLORS.blue }, { marginBottom: 8 }]}
              onPress={() => { setActiveProject("Mobile Asabri"); setProjectModalVisible(false); }}
            >
              <Text style={[styles.filterChipText, activeProject === "Mobile Asabri" && { color: "#fff" }]}>Mobile Asabri</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.filterChip, activeProject === "Project ESDM" && { backgroundColor: COLORS.blue, borderColor: COLORS.blue }]}
              onPress={() => { setActiveProject("Project ESDM"); setProjectModalVisible(false); }}
            >
              <Text style={[styles.filterChipText, activeProject === "Project ESDM" && { color: "#fff" }]}>Project ESDM</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 4. Modal Quick Update Progres */}
      <Modal visible={!!quickUpdateColumn} animationType="slide" transparent onRequestClose={() => setQuickUpdateColumn(null)}>
        <View style={[styles.modalBackdrop, { justifyContent: 'flex-end' }]}>
          <View style={[styles.modalContent, { borderBottomLeftRadius: 0, borderBottomRightRadius: 0, paddingBottom: 40 }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Log Aktivitas: {quickUpdateColumn}</Text>
              <TouchableOpacity onPress={() => setQuickUpdateColumn(null)}>
                <Ionicons name="close" size={24} color={COLORS.textMuted} />
              </TouchableOpacity>
            </View>
            <Text style={{color: COLORS.textMuted, marginBottom: 12}}>Catat apa saja yang baru Anda lakukan untuk progres tim. Ini akan ditambahkan sebagai kartu baru di kolom {quickUpdateColumn}.</Text>
            
            <TextInput 
              placeholder="Saya baru saja menyelesaikan..."
              placeholderTextColor={COLORS.textMuted}
              style={{backgroundColor: COLORS.taskBg, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, color: COLORS.text, minHeight: 100, textAlignVertical: 'top', marginBottom: 16}}
              multiline
              value={quickUpdateText}
              onChangeText={setQuickUpdateText}
              autoFocus
            />
            
            <TouchableOpacity 
              style={[styles.applyFilterBtn, { backgroundColor: COLORS.green }]} 
              onPress={handleQuickUpdate}
            >
              <Text style={{color: '#fff', fontWeight: 'bold'}}>Simpan Progres</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}


const getStyles = (COLORS: any) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  monitoringBar: { 
    paddingHorizontal: 16, 
    paddingTop: 12, 
    paddingBottom: 16, 
    backgroundColor: COLORS.surface, 
    borderBottomWidth: 1, 
    borderBottomColor: COLORS.border 
  },
  headerTop: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center",
    marginBottom: 12
  },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: COLORS.text },
  headerSub: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
  liveBadge: { 
    flexDirection: "row", 
    alignItems: "center", 
    gap: 4, 
    backgroundColor: "rgba(16, 185, 129, 0.15)", 
    paddingHorizontal: 6, 
    paddingVertical: 2, 
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.3)"
  },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.green },
  liveText: { fontSize: 10, fontWeight: "bold", color: COLORS.green },
  
  // Avatar Anggota
  avatarGroup: { paddingLeft: 8 },
  avatarStack: { flexDirection: "row", alignItems: "center" },
  memberAvatar: { 
    width: 30, 
    height: 30, 
    borderRadius: 15, 
    borderWidth: 2, 
    borderColor: COLORS.surface, 
    alignItems: "center", 
    justifyContent: "center" 
  },
  avatarText: { fontSize: 10, fontWeight: "bold", color: "#fff" },
  avatarMore: { backgroundColor: COLORS.border },
  avatarMoreText: { fontSize: 10, fontWeight: "bold", color: COLORS.textMuted },

  // Progress Bar
  progressContainer: { 
    backgroundColor: COLORS.surfaceAlt || COLORS.bg, 
    borderRadius: 10, 
    padding: 10, 
    borderWidth: 1, 
    borderColor: COLORS.border,
    marginBottom: 12
  },
  progressHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  progressLabel: { fontSize: 11, fontWeight: "600", color: COLORS.textMuted },
  progressPercent: { fontSize: 12, fontWeight: "bold", color: COLORS.green },
  progressBarTrack: { height: 6, backgroundColor: COLORS.surfaceAlt || COLORS.border, borderRadius: 3, overflow: "hidden", marginBottom: 6 },
  progressBarFill: { height: "100%", backgroundColor: COLORS.green, borderRadius: 3 },
  statsRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  statsSummary: { fontSize: 10, color: COLORS.textMuted },
  statMini: { fontSize: 10, color: COLORS.textMuted },

  // Tools Row
  toolsRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  toolBtn: { 
    flexDirection: "row", 
    alignItems: "center", 
    gap: 4, 
    paddingHorizontal: 10, 
    paddingVertical: 6, 
    borderRadius: 6 
  },
  toolBtnText: { fontSize: 11, fontWeight: "600", color: COLORS.text },
  toolBtnOutline: { 
    flexDirection: "row", 
    alignItems: "center", 
    gap: 4, 
    paddingHorizontal: 10, 
    paddingVertical: 6, 
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surfaceAlt
  },
  toolBtnOutlineText: { fontSize: 11, fontWeight: "600", color: COLORS.textMuted },
  toolIconBtn: { 
    width: 28, 
    height: 28, 
    borderRadius: 6, 
    borderWidth: 1, 
    borderColor: COLORS.border, 
    backgroundColor: COLORS.surfaceAlt,
    alignItems: "center", 
    justifyContent: "center" 
  },

  // Board
  boardScroll: { padding: 16, gap: 16, paddingBottom: 100 },
  column: { width: 300, backgroundColor: COLORS.card, borderRadius: 8, padding: 12, maxHeight: "100%", borderWidth: 1, borderColor: COLORS.border },
  columnTitle: { fontSize: 13, fontWeight: "bold", color: COLORS.blue },
  countBadge: { backgroundColor: "rgba(0,0,0,0.3)", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10 },
  countBadgeText: { fontSize: 11, fontWeight: "bold", color: COLORS.textMuted },
  taskCard: { backgroundColor: COLORS.taskBg, borderRadius: 8, padding: 14, borderWidth: 1, borderColor: COLORS.blue, elevation: 3, shadowColor: COLORS.blue, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  taskHeaderRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  pauseBtn: { width: 20, height: 20, borderRadius: 6, alignItems: "center", justifyContent: "center", marginRight: 6 },
  taskTagText: { color: COLORS.textMuted, fontSize: 10, fontWeight: "500", marginRight: 6 },
  taskTitle: { flex: 1, fontSize: 13, fontWeight: "600", color: COLORS.blue },
  taskDesc: { fontSize: 11, color: COLORS.textMuted, marginBottom: 8 },
  taskDetailsGrid: { flexDirection: "row", justifyContent: "space-between", borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: 8, marginBottom: 8 },
  detailCell: { flex: 1 },
  detailLabel: { fontSize: 9, color: COLORS.textMuted, marginBottom: 2 },
  detailValue: { fontSize: 11, color: COLORS.text, fontWeight: "500" },
  taskFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: 8 },
  taskAvatarGroup: { flexDirection: "row", alignItems: "center" },
  miniAvatar: { width: 20, height: 20, borderRadius: 10, backgroundColor: COLORS.amber, alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: COLORS.card },
  miniAvatarText: { color: COLORS.bg, fontSize: 9, fontWeight: "bold" },
  tagGroup: { flexDirection: "row", gap: 6, alignItems: "center" },
  projectTag: { fontSize: 10, fontWeight: "600", color: COLORS.text },
  dropZone: { borderWidth: 1, borderColor: COLORS.border, borderStyle: "dashed", borderRadius: 8, padding: 16, alignItems: "center", marginBottom: 12 },
  dropText: { fontSize: 12, color: COLORS.textMuted },
  newTaskBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, backgroundColor: COLORS.bg, padding: 12, borderRadius: 8 },
  newTaskText: { fontSize: 12, color: COLORS.textMuted, fontWeight: "600" },
  
  // Custom Modals
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', padding: 16 },
  modalContent: { backgroundColor: COLORS.card, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: COLORS.border },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.text },
  filterChip: { backgroundColor: COLORS.bg, borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  filterChipText: { color: COLORS.textMuted, fontSize: 13, fontWeight: '600' },
  applyFilterBtn: { backgroundColor: COLORS.blue, padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 8 },
});
