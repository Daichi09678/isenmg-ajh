import React, { useState, useMemo } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Switch, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useAppTheme } from "../../store/themeStore";
import { useTaskStore } from "../../store/taskStore";
import CustomModal from "../../components/CustomModal";

export default function EditTaskScreen() {
  const { colors } = useAppTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const task = useTaskStore((s) => s.getTaskById(id));
  const updateTask = useTaskStore((s) => s.updateTask);

  const COLORS = useMemo(() => ({
    bg: colors.background,
    card: colors.surface,
    border: colors.border,
    text: colors.text,
    textMuted: colors.textSecondary,
    primary: colors.accent,
    danger: "#ef4444",
    green: "#10b981",
    orange: "#f59e0b",
    blue: "#3b82f6",
    surfaceAlt: colors.surface,
  }), [colors]);

  const styles = useMemo(() => getStyles(COLORS), [COLORS]);

  const [activeTab, setActiveTab] = useState<"Details" | "Comments" | "Activities">("Details");

  // Form states based on task or dummy
  const [title, setTitle] = useState(task?.title || "Membuat desain mobile TaskFlow");
  const [description, setDescription] = useState(task?.description || "Link figma:\nhttps://www.figma.com/file/xyz/TaskFlow-Mobile");
  const [priority, setPriority] = useState(task?.priority || "No Priority");
  const [dueDate, setDueDate] = useState(task?.deadline ? new Date(task.deadline).toLocaleDateString() : "No Due Date");
  const [isImportant, setIsImportant] = useState(task?.isImportant || false);
  const [isUrgent, setIsUrgent] = useState(task?.isUrgent || false);
  
  const [modalConfig, setModalConfig] = useState({ visible: false, title: "", message: "", type: "info" as any });

  const showAlert = (title: string, message: string, type: any = "info") => {
    setModalConfig({ visible: true, title, message, type });
  };

  const handleRelease = () => {
    if (task) {
      updateTask(task.id, {
        title,
        description,
        priority: priority as any,
        isImportant,
        isUrgent,
      });
    }
    showAlert("Sukses", "Task berhasil diupdate & dirilis!", "success");
    setTimeout(() => {
      setModalConfig(prev => ({...prev, visible: false}));
      if (router.canGoBack()) router.back();
    }, 1500);
  };

  const [comments, setComments] = useState(task?.comments || [
    {id: '1', author: 'Farid', text: 'Tolong segera selesaikan ya.', createdAt: new Date().toISOString()},
    {id: '2', author: 'Ihsan', text: 'Desain sudah sesuai figma.', createdAt: new Date().toISOString()}
  ]);
  const [commentInput, setCommentInput] = useState("");

  const handleAddComment = () => {
    if(commentInput.trim()) {
       setComments([...comments, {id: Date.now().toString(), author: 'Anda', text: commentInput.trim(), createdAt: new Date().toISOString()}]);
       if(task) {
           useTaskStore.getState().addComment(task.id, 'Anda', commentInput.trim());
       }
       setCommentInput("");
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
           <TouchableOpacity onPress={() => router.back()} style={{marginRight: 8}}>
             <Ionicons name="arrow-back" size={24} color={COLORS.text} />
           </TouchableOpacity>
           <Text style={styles.headerTitle}>Edit Task</Text>
        </View>
        <View style={styles.headerRight}>
           <TouchableOpacity style={[styles.btnSmall, {backgroundColor: COLORS.danger}]} onPress={() => router.back()}>
             <Ionicons name="close" size={14} color="#fff" />
             <Text style={styles.btnText}>Cancel</Text>
           </TouchableOpacity>
           <TouchableOpacity style={[styles.btnSmall, {backgroundColor: COLORS.blue}]} onPress={handleRelease}>
             <Ionicons name="checkmark" size={14} color="#fff" />
             <Text style={styles.btnText}>Release</Text>
           </TouchableOpacity>
        </View>
      </View>

      <View style={styles.taskIdRow}>
         <Ionicons name="git-network-outline" size={14} color={COLORS.textMuted} />
         <Text style={styles.taskIdText}>DGM-{task?.id || '225'}</Text>
         <TouchableOpacity onPress={() => showAlert("Copied", "Link task disalin ke clipboard", "success")}>
            <Ionicons name="link-outline" size={16} color={COLORS.blue} style={{marginLeft: 4}} />
         </TouchableOpacity>
      </View>

      {/* TABS */}
      <View style={styles.tabContainer}>
        {['Details', 'Comments', 'Activities'].map(tab => (
          <TouchableOpacity 
            key={tab} 
            style={[styles.tabButton, activeTab === tab && styles.tabButtonActive]}
            onPress={() => setActiveTab(tab as any)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* CONTENT */}
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        {activeTab === "Details" && (
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
             
             <Text style={styles.label}>Task Title</Text>
             <TextInput 
               style={styles.input} 
               value={title} 
               onChangeText={setTitle} 
               placeholder="Enter task title"
               placeholderTextColor={COLORS.textMuted}
             />

             <Text style={styles.label}>Description</Text>
             <TextInput 
               style={[styles.input, {height: 80, textAlignVertical: 'top'}]} 
               multiline 
               value={description} 
               onChangeText={setDescription} 
               placeholder="Enter description..."
               placeholderTextColor={COLORS.textMuted}
             />

             {/* GRID */}
             <View style={styles.grid}>
               <View style={styles.gridItem}>
                 <Text style={styles.label}>Priority</Text>
                 <TouchableOpacity style={styles.selector} onPress={() => {
                     setPriority(priority === "No Priority" ? "High" : "No Priority");
                 }}>
                   {priority !== "No Priority" && <View style={styles.priorityDot} />}
                   <Text style={styles.selectorText}>{priority}</Text>
                   <Ionicons name="pencil" size={12} color={COLORS.textMuted} style={{marginLeft: 'auto'}} />
                 </TouchableOpacity>
               </View>
               <View style={styles.gridItem}>
                 <Text style={styles.label}>Due Date</Text>
                 <TouchableOpacity style={styles.selector} onPress={() => showAlert("Date Picker", "Pilih tanggal akan terbuka", "info")}>
                   <Text style={styles.selectorText}>{dueDate}</Text>
                 </TouchableOpacity>
               </View>
               <View style={styles.gridItem}>
                 <Text style={styles.label}>Is Important?</Text>
                 <Switch value={isImportant} onValueChange={setIsImportant} trackColor={{ true: COLORS.blue }} />
               </View>
               <View style={styles.gridItem}>
                 <Text style={styles.label}>Is Urgent?</Text>
                 <Switch value={isUrgent} onValueChange={setIsUrgent} trackColor={{ true: COLORS.blue }} />
               </View>
             </View>

             {/* MEMBERS */}
             <View style={styles.section}>
               <Text style={styles.sectionTitle}>Members & Assigning</Text>
               <View style={styles.rowItem}>
                 <Text style={styles.rowLabel}>Members</Text>
                 <View style={styles.avatarGroup}>
                    <View style={styles.avatar}><Text style={styles.avatarText}>A</Text></View>
                    <View style={[styles.avatar, {marginLeft: -8, backgroundColor: COLORS.orange}]}><Text style={styles.avatarText}>B</Text></View>
                    <TouchableOpacity style={styles.addAvatarBtn} onPress={() => showAlert("Tambah Member", "Silakan pilih member", "info")}>
                      <Ionicons name="add" size={14} color={COLORS.text} />
                    </TouchableOpacity>
                 </View>
               </View>
               <View style={styles.rowItem}>
                 <Text style={styles.rowLabel}>Assigner</Text>
                 <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
                   <View style={[styles.avatar, {backgroundColor: COLORS.blue, width: 24, height: 24}]}><Text style={[styles.avatarText, {fontSize: 10}]}>I</Text></View>
                   <Text style={styles.valueText}>Ihsan</Text>
                 </View>
               </View>
               <View style={styles.rowItem}>
                 <Text style={styles.rowLabel}>Assignee</Text>
                 <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
                   <View style={[styles.avatar, {backgroundColor: COLORS.green, width: 24, height: 24}]}><Text style={[styles.avatarText, {fontSize: 10}]}>M</Text></View>
                   <Text style={styles.valueText}>Mukhamad Dwi Arfiudin</Text>
                 </View>
               </View>
             </View>

             {/* PLAN & ACTUAL */}
             <View style={styles.section}>
               <Text style={styles.sectionTitle}>Plan & Actual</Text>
               <View style={styles.rowItem}>
                 <Text style={styles.rowLabel}>Plan Start Date</Text>
                 <Text style={styles.valueTextMuted}>No Plan Start Date</Text>
               </View>
               <View style={styles.rowItem}>
                 <Text style={styles.rowLabel}>Target Duration</Text>
                 <Text style={styles.valueText}>1 minutes</Text>
               </View>
               <View style={styles.rowItem}>
                 <Text style={styles.rowLabel}>Actual Start Date</Text>
                 <Text style={styles.valueText}>11 Sep 2024 14:25</Text>
               </View>
             </View>

             {/* FLAGS & LABELS */}
             <View style={styles.section}>
               <Text style={styles.sectionTitle}>Flags</Text>
               <View style={styles.rowItem}>
                 <Text style={styles.rowLabel}>Story Point</Text>
                 <Text style={styles.valueTextMuted}>No Story Point</Text>
               </View>
               <Text style={[styles.sectionTitle, {marginTop: 12}]}>Labels</Text>
               <View style={{flexDirection: 'row', gap: 8, marginTop: 8}}>
                 <View style={styles.labelBadge}>
                   <Text style={styles.labelBadgeText}>Product Design</Text>
                   <Ionicons name="close" size={12} color="#fff" />
                 </View>
                 <TouchableOpacity style={styles.addLabelBtn} onPress={() => showAlert("Add Label", "Pilih label tersedia", "info")}>
                   <Ionicons name="add" size={14} color={COLORS.textMuted} />
                   <Text style={styles.addLabelText}>Add Label</Text>
                 </TouchableOpacity>
               </View>
             </View>

             {/* PARENT TASK */}
             <View style={styles.section}>
                <Text style={styles.sectionTitle}>Parent task</Text>
                <TouchableOpacity style={styles.selector} onPress={() => showAlert("Parent Task", "Pilih parent task", "info")}>
                   <Text style={styles.valueTextMuted}>Select Parent</Text>
                   <Ionicons name="chevron-down" size={16} color={COLORS.textMuted} style={{marginLeft: 'auto'}} />
                 </TouchableOpacity>
             </View>

             {/* CHECKLIST */}
             <View style={styles.section}>
               <Text style={styles.sectionTitle}>Checklist</Text>
               <TouchableOpacity style={styles.addBtnOutline} onPress={() => showAlert("Success", "Grup Subtask baru berhasil ditambahkan", "success")}>
                 <Ionicons name="add" size={14} color={COLORS.textMuted} />
                 <Text style={styles.addBtnOutlineText}>Add Subtask Group</Text>
               </TouchableOpacity>
               
               <View style={styles.checklistGroup}>
                 <View style={styles.checklistHeader}>
                   <Ionicons name="list" size={16} color={COLORS.textMuted} />
                   <Text style={styles.checklistTitle}>TaskFlow Mobile</Text>
                   <View style={styles.progressBadge}><Text style={styles.progressBadgeText}>16/16</Text></View>
                   <TouchableOpacity style={[styles.editIconBtn, {marginLeft: 'auto', backgroundColor: COLORS.orange}]}>
                      <Ionicons name="pencil" size={12} color="#fff" />
                   </TouchableOpacity>
                 </View>
                 
                 <TouchableOpacity style={styles.addSubtaskBtn} onPress={() => showAlert("Info", "Fitur tambah subtask", "info")}>
                   <Ionicons name="add" size={14} color={COLORS.blue} />
                   <Text style={[styles.addBtnOutlineText, {color: COLORS.blue}]}>Add Subtask</Text>
                 </TouchableOpacity>
                 
                 {['Onboarding', 'Login', 'Signup', 'Forgot Password', 'Home', 'Workspace', 'Monitoring Task'].map((sub, i) => (
                    <View key={i} style={styles.subtaskItem}>
                      <TouchableOpacity>
                        <Ionicons name="checkbox" size={20} color={COLORS.blue} />
                      </TouchableOpacity>
                      <Text style={styles.subtaskText}>{sub}</Text>
                      <View style={styles.subtaskActions}>
                        <View style={[styles.avatar, {width: 20, height: 20, backgroundColor: COLORS.primary}]}><Text style={[styles.avatarText, {fontSize: 10}]}>M</Text></View>
                        <TouchableOpacity><Ionicons name="person-add-outline" size={14} color={COLORS.textMuted} /></TouchableOpacity>
                        <TouchableOpacity style={[styles.editIconBtn, {backgroundColor: COLORS.orange}]}><Ionicons name="pencil" size={12} color="#fff" /></TouchableOpacity>
                      </View>
                    </View>
                 ))}
               </View>
             </View>

             {/* ATTACHMENTS */}
             <View style={styles.section}>
               <Text style={styles.sectionTitle}>Attachments</Text>
               <View style={styles.uploadBox}>
                 <TouchableOpacity style={styles.uploadBtn} onPress={() => showAlert("Upload", "Membuka file picker...", "info")}>
                    <Ionicons name="cloud-upload-outline" size={16} color="#fff" />
                    <Text style={{color: '#fff', fontSize: 12, fontWeight: 'bold', marginLeft: 6}}>Choose File</Text>
                 </TouchableOpacity>
                 <Text style={styles.uploadHint}>Or Drag and drop your file here</Text>
               </View>
             </View>

             <View style={{height: 40}} />
          </ScrollView>
        )}

        {/* COMMENTS TAB */}
        {activeTab === "Comments" && (
          <View style={{flex: 1}}>
            <ScrollView contentContainerStyle={styles.commentsTab}>
              {comments.map(c => (
                <View key={c.id} style={styles.commentItem}>
                  <View style={[styles.avatar, {width: 32, height: 32, backgroundColor: COLORS.primary}]}>
                     <Text style={{color: '#fff', fontSize: 14, fontWeight: 'bold'}}>{c.author.charAt(0)}</Text>
                  </View>
                  <View style={styles.commentBubble}>
                     <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4}}>
                        <Text style={styles.commentAuthor}>{c.author}</Text>
                        <Text style={styles.commentTime}>{new Date(c.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</Text>
                     </View>
                     <Text style={styles.commentText}>{c.text}</Text>
                  </View>
                </View>
              ))}
              {comments.length === 0 && (
                <Text style={{color: COLORS.textMuted, textAlign: 'center', marginTop: 20}}>Belum ada komentar.</Text>
              )}
            </ScrollView>
            
            {/* Input Komentar */}
            <View style={styles.commentInputRow}>
              <View style={[styles.avatar, {width: 32, height: 32, backgroundColor: COLORS.blue}]}>
                 <Text style={{color: '#fff', fontSize: 14, fontWeight: 'bold'}}>A</Text>
              </View>
              <TextInput 
                style={styles.commentInput} 
                placeholder="Add a comment..." 
                placeholderTextColor={COLORS.textMuted}
                value={commentInput}
                onChangeText={setCommentInput}
                onSubmitEditing={handleAddComment}
              />
              <TouchableOpacity style={styles.sendBtn} onPress={handleAddComment}>
                 <Ionicons name="send" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ACTIVITIES TAB */}
        {activeTab === "Activities" && (
           <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
              <Ionicons name="time-outline" size={48} color={COLORS.textMuted} />
              <Text style={{color: COLORS.textMuted, marginTop: 16}}>Belum ada log aktivitas.</Text>
           </View>
        )}
      </KeyboardAvoidingView>

      <CustomModal 
        visible={modalConfig.visible}
        type={modalConfig.type}
        title={modalConfig.title}
        message={modalConfig.message}
        onClose={() => setModalConfig(prev => ({...prev, visible: false}))}
      />
    </SafeAreaView>
  );
}

const getStyles = (COLORS: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: COLORS.bg,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: COLORS.text },
  btnSmall: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  btnText: { fontSize: 12, fontWeight: "bold", color: "#fff" },
  taskIdRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 16 },
  taskIdText: { fontSize: 14, color: COLORS.textMuted, marginLeft: 6, fontWeight: 'bold' },
  
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingHorizontal: 16,
  },
  tabButton: {
    paddingVertical: 12,
    marginRight: 24,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabButtonActive: { borderBottomColor: COLORS.blue },
  tabText: { fontSize: 14, fontWeight: "600", color: COLORS.textMuted },
  tabTextActive: { color: COLORS.blue },

  scrollContent: { padding: 16, gap: 16 },
  label: { fontSize: 12, fontWeight: "600", color: COLORS.text, marginBottom: 4 },
  input: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: COLORS.text,
    fontSize: 14,
  },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  gridItem: { width: '48%' },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  selectorText: { fontSize: 13, color: COLORS.text, flex: 1 },
  priorityDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.orange, marginRight: 8 },
  
  section: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 16,
  },
  sectionTitle: { fontSize: 14, fontWeight: "bold", color: COLORS.text, marginBottom: 12 },
  rowItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  rowLabel: { fontSize: 13, color: COLORS.textMuted },
  valueText: { fontSize: 13, color: COLORS.text, fontWeight: '500' },
  valueTextMuted: { fontSize: 13, color: COLORS.textMuted },

  avatarGroup: { flexDirection: "row", alignItems: "center" },
  avatar: { 
    width: 28, height: 28, borderRadius: 14, backgroundColor: COLORS.primary, 
    alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: COLORS.card 
  },
  avatarText: { fontSize: 12, fontWeight: "bold", color: "#fff" },
  addAvatarBtn: {
    width: 28, height: 28, borderRadius: 14, backgroundColor: COLORS.bg,
    alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: COLORS.border, borderStyle: 'dashed', marginLeft: 8
  },

  labelBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#a16207', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, gap: 4 },
  labelBadgeText: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
  addLabelBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.bg, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, gap: 4, borderWidth: 1, borderColor: COLORS.border },
  addLabelText: { color: COLORS.textMuted, fontSize: 11 },

  addBtnOutline: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 },
  addBtnOutlineText: { fontSize: 13, color: COLORS.textMuted, fontWeight: 'bold' },
  
  checklistGroup: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 8, padding: 12 },
  checklistHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  checklistTitle: { fontSize: 13, fontWeight: 'bold', color: COLORS.text },
  progressBadge: { backgroundColor: COLORS.border, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10 },
  progressBadgeText: { fontSize: 10, color: COLORS.text, fontWeight: 'bold' },
  
  editIconBtn: { backgroundColor: COLORS.blue, padding: 4, borderRadius: 4 },
  addSubtaskBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: COLORS.border, marginBottom: 8 },
  
  subtaskItem: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 6 },
  subtaskText: { fontSize: 13, color: COLORS.text, flex: 1 },
  subtaskActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },

  uploadBox: { borderWidth: 1, borderColor: COLORS.border, borderStyle: 'dashed', borderRadius: 8, alignItems: 'center', padding: 20 },
  uploadBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.orange, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 6, marginBottom: 12 },
  uploadHint: { fontSize: 12, color: COLORS.textMuted },

  commentsTab: { padding: 16, paddingBottom: 100 },
  commentItem: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  commentBubble: { flex: 1, backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border, borderRadius: 8, padding: 12 },
  commentAuthor: { fontSize: 13, fontWeight: 'bold', color: COLORS.text },
  commentTime: { fontSize: 11, color: COLORS.textMuted },
  commentText: { fontSize: 13, color: COLORS.text, marginTop: 4, lineHeight: 20 },
  
  commentInputRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, backgroundColor: COLORS.surface, borderTopWidth: 1, borderTopColor: COLORS.border },
  commentInput: { flex: 1, backgroundColor: COLORS.bg, borderWidth: 1, borderColor: COLORS.border, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, color: COLORS.text },
  sendBtn: { backgroundColor: COLORS.green, width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' }
});
