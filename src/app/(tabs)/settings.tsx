import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Animated,
  LayoutAnimation,
  UIManager,
  Platform,
  StatusBar,
  ScrollView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../store/themeStore';
import { useUserStore } from '../../store/userStore';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// ---------- Sample data ----------
const INITIAL_TASKS = [
  { id: 'ABR-651', name: 'UAT Asabri', project: '-', workspace: 'Mobile Asabri', board: 'Doing', assigner: 'Muhammad Ifrozin Farhan', assignee: 'Muhammad Ifrozin Farhan', assignmentAt: 'Doing', status: 'Doing', date: '17 Sep 2026 09:16', planDur: '-', actualStart: '17 Sep 2026 09:16', actualDur: '00:01:05', live: true },
  { id: 'ABR-652', name: 'Setup Database Server', project: 'Backend System', workspace: 'Infrastructure', board: 'Doing', assigner: 'Eko Prasetyo', assignee: 'Budi Santoso', assignmentAt: 'Doing', status: 'Doing', date: '17 Sep 2026 10:00', planDur: '04:00:00', actualStart: '17 Sep 2026 10:30', actualDur: '02:15:00', live: true },
  { id: 'ABR-653', name: 'API Integration Payment', project: 'Mobile App', workspace: 'Development', board: 'Doing', assigner: 'Ade Arman Wijaya', assignee: 'Achmad Asrofi', assignmentAt: 'Doing', status: 'Doing', date: '16 Sep 2026 13:00', planDur: '08:00:00', actualStart: '16 Sep 2026 13:10', actualDur: '04:20:00', live: false },
  { id: null, name: 'Melakukan Pengecekan Saldo', project: '-', workspace: '-', board: 'Backlog', assigner: '-', assignee: '-', assignmentAt: '-', status: 'Backlog', date: '17 Sep 2026 09:07', planDur: '-', actualStart: '-', actualDur: '-' },
  { id: null, name: 'Membuat Pengajuan Marketing', project: '-', workspace: '-', board: 'Backlog', assigner: '-', assignee: '-', assignmentAt: '-', status: 'Backlog', date: '17 Sep 2026 09:06', planDur: '-', actualStart: '-', actualDur: '-' },
  { id: null, name: 'Memposting Pengajuan Dari Tim GA', project: '-', workspace: '-', board: 'Backlog', assigner: '-', assignee: '-', assignmentAt: '-', status: 'Backlog', date: '17 Sep 2026 09:06', planDur: '-', actualStart: '-', actualDur: '-' },
  { id: null, name: 'Melakukan rekonsiliasi Bank', project: '-', workspace: '-', board: 'Backlog', assigner: '-', assignee: '-', assignmentAt: '-', status: 'Backlog', date: '17 Sep 2026 09:05', planDur: '-', actualStart: '-', actualDur: '-' },
  { id: null, name: 'Upload Mutasi Rekening Seluruh Bank BRI', project: '-', workspace: '-', board: 'Backlog', assigner: '-', assignee: '-', assignmentAt: '-', status: 'Backlog', date: '17 Sep 2026 09:01', planDur: '-', actualStart: '-', actualDur: '-' },
  { id: 'UI-001', name: 'Desain UI/UX Dashboard', project: 'Web Admin', workspace: 'Design', board: 'Backlog', assigner: 'Dewi Lestari', assignee: '-', assignmentAt: '-', status: 'Backlog', date: '15 Sep 2026 10:00', planDur: '16:00:00', actualStart: '-', actualDur: '-' },
  { id: 'BUG-042', name: 'Bugfixing User Profile Error', project: 'Mobile App', workspace: 'Maintenance', board: 'Backlog', assigner: 'Cakra Khan', assignee: '-', assignmentAt: '-', status: 'Backlog', date: '15 Sep 2026 15:30', planDur: '02:00:00', actualStart: '-', actualDur: '-' },
  { id: null, name: 'Recap Stok ATK di ruangan arsip', project: '-', workspace: '-', board: 'Doing', assigner: '-', assignee: '-', assignmentAt: 'Doing', status: 'Doing', date: '17 Sep 2026 09:00', planDur: '-', actualStart: '-', actualDur: '-' },
  { id: 'ABR-650', name: 'UAT lanjutan pasca perbaikan UAT', project: '-', workspace: 'Mobile Asabri', board: 'Doing', assigner: '-', assignee: '-', assignmentAt: 'Doing', status: 'Doing', date: '17 Sep 2026 08:52', planDur: '-', actualStart: '-', actualDur: '-' },
];

const RESOURCE_DATA = [
  { id: 1, member: 'Achmad Asrofi', project: '-', plannedAssign: 16, completeAssign: 0, pctAssign: 0, plannedBeing: 12, completeBeing: 4, pctBeing: 25, duration: 482 },
  { id: 2, member: 'Ade Arman Wijaya', project: '-', plannedAssign: 2, completeAssign: 22, pctAssign: 92, plannedBeing: 11, completeBeing: 23, pctBeing: 68, duration: 4807 },
  { id: 3, member: 'Ade Hary Setiawan', project: '-', plannedAssign: 0, completeAssign: 0, pctAssign: 0, plannedBeing: 1, completeBeing: 0, pctBeing: 0, duration: 0 },
  { id: 4, member: 'Agus Susanto', project: '-', plannedAssign: 29, completeAssign: 35, pctAssign: 55, plannedBeing: 22, completeBeing: 36, pctBeing: 62, duration: 4031 },
  { id: 5, member: 'Ahmad Dian Harsa Suaka', project: '-', plannedAssign: 3, completeAssign: 12, pctAssign: 80, plannedBeing: 3, completeBeing: 12, pctBeing: 80, duration: 8864 },
  { id: 6, member: 'Ahmad Hizqil', project: '-', plannedAssign: 0, completeAssign: 0, pctAssign: 0, plannedBeing: 0, completeBeing: 0, pctBeing: 0, duration: 0 },
  { id: 7, member: 'Aji Rusmayran', project: '-', plannedAssign: 0, completeAssign: 0, pctAssign: 0, plannedBeing: 12, completeBeing: 7, pctBeing: 37, duration: 0 },
  { id: 8, member: 'Akhdiat Munggaran', project: '-', plannedAssign: 0, completeAssign: 0, pctAssign: 0, plannedBeing: 1, completeBeing: 6, pctBeing: 86, duration: 94 },
  { id: 9, member: 'Budi Santoso', project: 'Backend System', plannedAssign: 10, completeAssign: 8, pctAssign: 80, plannedBeing: 5, completeBeing: 5, pctBeing: 100, duration: 1240 },
  { id: 10, member: 'Cakra Khan', project: 'Mobile App', plannedAssign: 15, completeAssign: 5, pctAssign: 33, plannedBeing: 20, completeBeing: 10, pctBeing: 50, duration: 2315 },
  { id: 11, member: 'Dewi Lestari', project: 'Web Admin', plannedAssign: 5, completeAssign: 5, pctAssign: 100, plannedBeing: 8, completeBeing: 2, pctBeing: 25, duration: 870 },
  { id: 12, member: 'Eko Prasetyo', project: 'Infrastructure', plannedAssign: 20, completeAssign: 18, pctAssign: 90, plannedBeing: 15, completeBeing: 12, pctBeing: 80, duration: 5600 },
];

const STATUS_FILTERS = [
  { key: 'all', label: 'Semua' },
  { key: 'Doing', label: 'Doing' },
  { key: 'Backlog', label: 'Backlog' },
  { key: 'In Progress', label: 'In Progress' },
];

function fmt(totalSeconds: number) {
  const h = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const s = String(Math.floor(totalSeconds % 60)).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

function initials(name: string) {
  if (!name || name === '-') return '—';
  return name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();
}

function statusStyle(status: string, colors: any) {
  switch (status) {
    case 'Doing':
      return { bg: colors.brandSoft, fg: colors.brand };
    case 'Backlog':
      return { bg: colors.slateSoft, fg: colors.slate };
    case 'In Progress':
      return { bg: colors.amberSoft, fg: colors.amber };
    default:
      return { bg: colors.tealSoft, fg: colors.teal };
  }
}

function getBarColor(pct: number, colors: any) {
  if (pct === 0) return colors.borderSoft;
  if (pct < 30) return colors.red;
  if (pct < 70) return colors.amber;
  return colors.green;
}

export default function MonitoringScreen() {
  const { colors: themeColors, mode } = useAppTheme();
  const { name, avatarUrl } = useUserStore();
  const isDark = mode === 'dark';

  const C = useMemo(() => ({
    bg: themeColors.background,
    surface: themeColors.surface,
    surface2: isDark ? '#1A2233' : '#F3F4F6',
    surface3: isDark ? '#212B40' : '#E5E7EB',
    border: themeColors.border,
    borderSoft: isDark ? '#1B2334' : '#E5E7EB',
    text1: themeColors.text,
    text2: themeColors.textSecondary,
    text3: isDark ? '#6B7488' : '#9CA3AF',
    brand: themeColors.accent || '#5B7FFF',
    brandSoft: isDark ? 'rgba(91,127,255,0.14)' : 'rgba(91,127,255,0.1)',
    amber: '#F5A623',
    amberSoft: isDark ? 'rgba(245,166,35,0.14)' : 'rgba(245,166,35,0.1)',
    teal: '#33D6C0',
    tealSoft: isDark ? 'rgba(51,214,192,0.14)' : 'rgba(51,214,192,0.1)',
    slate: '#8891A6',
    slateSoft: isDark ? 'rgba(136,145,166,0.12)' : 'rgba(136,145,166,0.1)',
    green: '#4ADE80',
    red: '#F2555A',
  }), [themeColors, isDark]);

  const styles = useMemo(() => getStyles(C), [C]);

  const [activeTab, setActiveTab] = useState<'Task' | 'Resource'>('Task');
  const [showMenu, setShowMenu] = useState(false);

  const [tasks] = useState(INITIAL_TASKS);
  const [search, setSearch] = useState('');
  const [activeStatus, setActiveStatus] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [liveSeconds, setLiveSeconds] = useState(65);
  const [topSeconds, setTopSeconds] = useState(24 * 60 + 3);
  const toastAnim = useRef(new Animated.Value(0)).current;
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    const t = setInterval(() => {
      setLiveSeconds((s) => s + 1);
      setTopSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const counts: any = useMemo(() => ({
    all: tasks.length,
    Doing: tasks.filter((t) => t.status === 'Doing').length,
    Backlog: tasks.filter((t) => t.status === 'Backlog').length,
    'In Progress': tasks.filter((t) => t.live).length,
  }), [tasks]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return tasks.filter((t) => {
      const statusOk =
        activeStatus === 'all' ||
        (activeStatus === 'In Progress' ? !!t.live : t.status === activeStatus);
      const searchOk =
        !q ||
        t.name.toLowerCase().includes(q) ||
        (t.workspace && t.workspace.toLowerCase().includes(q)) ||
        (t.id && t.id.toLowerCase().includes(q));
      return statusOk && searchOk;
    });
  }, [tasks, search, activeStatus]);

  const actualTotal = '00:24:57';

  function toggleExpand(idKey: string) {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId((prev) => (prev === idKey ? null : idKey));
  }

  function showToast(msg: string) {
    setToastMsg(msg);
    Animated.sequence([
      Animated.timing(toastAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.delay(1800),
      Animated.timing(toastAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start();
  }

  function renderTask({ item, index }: any) {
    const rowKey = item.id || `row-${index}`;
    const isExpanded = expandedId === rowKey;
    const badgeLabel = item.live ? 'In Progress' : item.status;
    const sStyle = statusStyle(item.live ? 'In Progress' : item.status, C);

    return (
      <View style={[styles.card, item.live && styles.cardActive]}>
        <TouchableOpacity activeOpacity={0.7} onPress={() => toggleExpand(rowKey)}>
          <View style={styles.cardTop}>
            <View style={{ flex: 1, paddingRight: 10 }}>
              {item.id ? <Text style={styles.taskId}>{item.id}</Text> : null}
              <Text style={styles.taskName}>{item.name}</Text>
            </View>
            <View style={[styles.pill, { backgroundColor: sStyle.bg }]}>
              <View style={[styles.pillDot, { backgroundColor: sStyle.fg }]} />
              <Text style={[styles.pillText, { color: sStyle.fg }]}>{badgeLabel}</Text>
            </View>
          </View>

          <View style={styles.metaRow}>
            <Text style={styles.metaText}>📅 {item.date}</Text>
            <Text style={styles.metaText}>🗂 {item.workspace}</Text>
            {item.project && <Text style={styles.metaText}>📁 {item.project}</Text>}
          </View>

          <View style={styles.cardFoot}>
            <View style={styles.assigneeRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{initials(item.assignee)}</Text>
              </View>
              <Text style={styles.assigneeText}>
                {item.assignee === '-' ? 'Belum ditugaskan' : item.assignee.split(' ')[0]}
              </Text>
            </View>
            {item.live ? (
              <View style={styles.liveDurRow}>
                <View style={styles.liveDot} />
                <Text style={styles.liveDurText}>{fmt(liveSeconds)}</Text>
              </View>
            ) : (
              <Text style={styles.chevron}>{isExpanded ? '︿' : '﹀'}</Text>
            )}
          </View>
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.detailWrap}>
            <View style={styles.detailGrid}>
              <View style={styles.detailCol}>
                <Text style={styles.detailColTitle}>Plan</Text>
                <View style={styles.detailLine}>
                  <Text style={styles.detailLabel}>Start</Text>
                  <Text style={styles.detailValue}>{item.date}</Text>
                </View>
                <View style={styles.detailLine}>
                  <Text style={styles.detailLabel}>Durasi</Text>
                  <Text style={styles.detailValue}>{item.planDur}</Text>
                </View>
              </View>
              <View style={[styles.detailCol, { borderLeftWidth: 1, borderLeftColor: C.borderSoft }]}>
                <Text style={styles.detailColTitle}>Actual</Text>
                <View style={styles.detailLine}>
                  <Text style={styles.detailLabel}>Start</Text>
                  <Text style={styles.detailValue}>{item.actualStart}</Text>
                </View>
                <View style={styles.detailLine}>
                  <Text style={styles.detailLabel}>Durasi</Text>
                  <Text style={styles.detailValue}>{item.live ? fmt(liveSeconds) : item.actualDur}</Text>
                </View>
              </View>
            </View>
            <Text style={styles.detailNote}>
              Assigner: {item.assigner === '-' ? 'Belum ditentukan' : item.assigner} · Board: {item.board} · Assignment At: {item.assignmentAt || '-'}
            </Text>
          </View>
        )}
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={C.surface} />

      {/* Top bar */}
      <View style={styles.topbar}>
        <View style={styles.topbarRow}>
          <TouchableOpacity 
             style={styles.brandBlock} 
             onPress={() => setShowMenu(!showMenu)}
             activeOpacity={0.7}
          >
            <Text style={styles.brandText}>{activeTab === 'Task' ? 'Monitoring Task' : 'Monitoring Resource'}</Text>
            <Ionicons name={showMenu ? "chevron-up" : "chevron-down"} size={16} color={C.text1} />
          </TouchableOpacity>
          
          <View style={styles.headerActions}>
            {/* Same notification and profile icons from home */}
            <TouchableOpacity style={styles.notifBtn}>
              <Ionicons name="notifications-outline" size={22} color={C.text1} />
              <View style={styles.notifBadge} />
            </TouchableOpacity>
            
            <View style={styles.avatarContainer}>
              {avatarUrl ? (
                <Image source={{ uri: avatarUrl }} style={{ width: "100%", height: "100%" }} />
              ) : (
                <Text style={{ color: C.text1, fontWeight: "bold", fontSize: 14 }}>{name ? name.charAt(0).toUpperCase() : "?"}</Text>
              )}
            </View>
          </View>
        </View>

        {activeTab === 'Task' && (
          <View style={[styles.liveChip, { backgroundColor: isDark ? 'rgba(74, 222, 128, 0.15)' : 'rgba(74, 222, 128, 0.2)' }]}>
            <TouchableOpacity style={styles.recBtn}>
               <Ionicons name="pause" size={10} color="white" />
            </TouchableOpacity>
            <Text style={[styles.liveCode, { color: C.green, fontWeight: 'bold' }]}>DGM-234 - {fmt(topSeconds)}</Text>
          </View>
        )}
      </View>

      {/* Dropdown Menu for Tab Switching */}
      {showMenu && (
        <View style={styles.dropdownMenu}>
          <TouchableOpacity 
             style={[styles.dropdownItem, activeTab === 'Task' && { backgroundColor: C.surface3 }]}
             onPress={() => { setActiveTab('Task'); setShowMenu(false); }}
          >
             <Text style={styles.dropdownItemText}>Monitoring Task</Text>
          </TouchableOpacity>
          <TouchableOpacity 
             style={[styles.dropdownItem, activeTab === 'Resource' && { backgroundColor: C.surface3 }]}
             onPress={() => { setActiveTab('Resource'); setShowMenu(false); }}
          >
             <Text style={styles.dropdownItemText}>Monitoring Resource</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ================= MONITORING TASK VIEW ================= */}
      {activeTab === 'Task' && (
        <>
          <FlatList
            data={filtered}
            keyExtractor={(item, i) => item.id || `row-${i}`}
            renderItem={renderTask}
            contentContainerStyle={{ paddingBottom: (Platform.OS === 'ios' ? 88 : 70) + 20 }}
            ListHeaderComponent={
              <>
                <View style={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 4, gap: 10 }}>
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    <TouchableOpacity style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10, paddingVertical: 8, backgroundColor: C.surface, borderWidth: 1, borderColor: C.borderSoft, borderRadius: 8 }}>
                       <Text style={{ color: C.text2, fontSize: 11 }}>Filter Category</Text>
                       <Ionicons name="chevron-down" size={14} color={C.text3} />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10, paddingVertical: 8, backgroundColor: C.surface, borderWidth: 1, borderColor: C.borderSoft, borderRadius: 8 }}>
                       <Text style={{ color: C.text2, fontSize: 11 }}>Assigner</Text>
                       <Ionicons name="chevron-down" size={14} color={C.text3} />
                    </TouchableOpacity>
                  </View>
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    <TouchableOpacity style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10, paddingVertical: 8, backgroundColor: C.surface, borderWidth: 1, borderColor: C.borderSoft, borderRadius: 8 }}>
                       <Text style={{ color: C.text2, fontSize: 11 }}>Assignee</Text>
                       <Ionicons name="chevron-down" size={14} color={C.text3} />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10, paddingVertical: 8, backgroundColor: C.surface, borderWidth: 1, borderColor: C.borderSoft, borderRadius: 8 }}>
                       <Text style={{ color: C.text2, fontSize: 11 }}>Status</Text>
                       <Ionicons name="chevron-down" size={14} color={C.text3} />
                    </TouchableOpacity>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <View style={{ flexDirection: 'row', backgroundColor: C.surface2, borderRadius: 8, borderWidth: 1, borderColor: C.borderSoft, overflow: 'hidden' }}>
                      <TouchableOpacity style={{ paddingHorizontal: 12, paddingVertical: 8, backgroundColor: C.surface, borderRightWidth: 1, borderColor: C.borderSoft }}><Text style={{ color: C.text1, fontSize: 11, fontWeight: 'bold' }}>Date</Text></TouchableOpacity>
                      <TouchableOpacity style={{ paddingHorizontal: 12, paddingVertical: 8 }}><Text style={{ color: C.text3, fontSize: 11 }}>Timer</Text></TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={() => setSheetOpen(true)} style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10, paddingVertical: 8, backgroundColor: C.surface, borderWidth: 1, borderColor: C.borderSoft, borderRadius: 8 }}>
                       <Text style={{ color: C.text2, fontSize: 11 }}>17 Aug - 17 Sep 2026</Text>
                       <Ionicons name="calendar-outline" size={14} color={C.text3} />
                    </TouchableOpacity>
                  </View>
                  {/* Search Input */}
                  <View style={{ marginTop: 4, flexDirection: 'row', alignItems: 'center', backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8 }}>
                    <Ionicons name="search" size={16} color={C.text3} style={{ marginRight: 6 }} />
                    <TextInput
                      style={{ flex: 1, color: C.text1, fontSize: 13, paddingVertical: 0 }}
                      placeholder="Search Workspace, Task, Board..."
                      placeholderTextColor={C.text3}
                      value={search}
                      onChangeText={setSearch}
                    />
                  </View>
                  {/* Action Buttons */}
                  <View style={{ flexDirection: 'row', gap: 8, marginTop: 4 }}>
                    <TouchableOpacity style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: C.brand, borderRadius: 8, paddingVertical: 10 }}>
                      <Ionicons name="search" size={16} color="white" style={{ marginRight: 6 }} />
                      <Text style={{ color: 'white', fontSize: 13, fontWeight: 'bold' }}>Search</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => showToast('Laporan berhasil diexport')} style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: C.green, borderRadius: 8, paddingVertical: 10 }}>
                      <Ionicons name="download-outline" size={16} color={C.surface} style={{ marginRight: 6 }} />
                      <Text style={{ color: C.surface, fontSize: 13, fontWeight: 'bold' }}>Export</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.listHead}>
                  <Text style={styles.listTitle}>Daftar Task</Text>
                </View>
              </>
            }
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={{ fontSize: 30, marginBottom: 10 }}>🔍</Text>
                <Text style={styles.emptyTitle}>Tidak ada task ditemukan</Text>
                <Text style={styles.emptySub}>Coba ubah kata kunci atau filter status</Text>
              </View>
            }
            ListFooterComponent={
              filtered.length > 0 ? (
                <View style={{ marginHorizontal: 16, marginTop: 10, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, borderRadius: 12, overflow: 'hidden' }}>
                   <View style={{ flexDirection: 'row', padding: 12, borderBottomWidth: 1, borderBottomColor: C.borderSoft, justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text style={{ color: C.text1, fontWeight: 'bold', fontSize: 13 }}>Total</Text>
                      <View style={{ flexDirection: 'row', gap: 24 }}>
                         <View style={{ alignItems: 'flex-end' }}>
                            <Text style={{ color: C.text3, fontSize: 10, marginBottom: 2 }}>Plan Duration</Text>
                            <Text style={[styles.mono, { color: C.text1, fontWeight: 'bold' }]}>00:00:00</Text>
                         </View>
                         <View style={{ alignItems: 'flex-end' }}>
                            <Text style={{ color: C.text3, fontSize: 10, marginBottom: 2 }}>Actual Duration</Text>
                            <Text style={[styles.mono, { color: C.teal, fontWeight: 'bold' }]}>{actualTotal}</Text>
                         </View>
                      </View>
                   </View>
                   <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12, gap: 12 }}>
                      <TouchableOpacity style={{ padding: 4 }}><Ionicons name="chevron-back" size={14} color={C.text2} /></TouchableOpacity>
                      <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: C.brandSoft, alignItems: 'center', justifyContent: 'center' }}>
                         <Text style={{ color: C.brand, fontSize: 12, fontWeight: 'bold' }}>1</Text>
                      </View>
                      <Text style={{ color: C.text2, fontSize: 12 }}>2</Text>
                      <Text style={{ color: C.text2, fontSize: 12 }}>3</Text>
                      <Text style={{ color: C.text2, fontSize: 12 }}>...</Text>
                      <TouchableOpacity style={{ padding: 4 }}><Ionicons name="chevron-forward" size={14} color={C.text2} /></TouchableOpacity>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginLeft: 16 }}>
                         <Text style={{ color: C.text3, fontSize: 11 }}>10</Text>
                         <Ionicons name="chevron-down" size={12} color={C.text3} />
                      </View>
                   </View>
                </View>
              ) : null
            }
            style={{ paddingHorizontal: 0 }}
          />
        </>
      )}

      {/* ================= MONITORING RESOURCE VIEW ================= */}
      {activeTab === 'Resource' && (
        <ScrollView contentContainerStyle={{ paddingBottom: (Platform.OS === 'ios' ? 88 : 70) + 20 }} style={{ flex: 1 }}>
           <View style={{ flexDirection: 'row', gap: 10, paddingHorizontal: 16, paddingVertical: 12 }}>
             <TouchableOpacity style={{ paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: C.surface2, borderWidth: 1, borderColor: C.border }}>
                <Text style={{ color: C.text1, fontSize: 13, fontWeight: '600' }}>View by Member</Text>
             </TouchableOpacity>
             <TouchableOpacity style={{ paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 }}>
                <Text style={{ color: C.text3, fontSize: 13, fontWeight: '600' }}>View by Project</Text>
             </TouchableOpacity>
           </View>

           <View style={{ backgroundColor: C.surface, marginHorizontal: 16, borderRadius: 12, borderWidth: 1, borderColor: C.border, overflow: 'hidden' }}>
             
             {/* Toolbar */}
             <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12, borderBottomWidth: 1, borderBottomColor: C.borderSoft }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                   <Text style={{ color: C.text2, fontSize: 12, fontWeight: '600' }}>Workspaces:</Text>
                   <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: C.bg, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: C.borderSoft }}>
                      <Text style={{ color: C.text3, fontSize: 12 }}>Select Workspaces</Text>
                      <Ionicons name="chevron-down" size={14} color={C.text3} />
                   </TouchableOpacity>
                </View>
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                   <Text style={{ color: C.text1, fontSize: 12, fontWeight: '600' }}>More Filter</Text>
                   <Ionicons name="chevron-down" size={14} color={C.text1} />
                </TouchableOpacity>
             </View>

             {/* Table container horizontally scrollable */}
             <ScrollView horizontal showsHorizontalScrollIndicator={false}>
               <View>
                 {/* Table Header */}
                 <View style={{ flexDirection: 'row', padding: 12, borderBottomWidth: 1, borderColor: C.borderSoft }}>
                    <Text style={{ width: 170, color: C.text1, fontWeight: 'bold', fontSize: 12 }}>Member ^</Text>
                    <Text style={{ width: 100, color: C.text1, fontWeight: 'bold', fontSize: 12 }}>Project ↑↓</Text>
                    
                    <View style={{ width: 270 }}>
                       <Text style={{ color: C.text1, fontWeight: 'bold', fontSize: 12, textAlign: 'center', marginBottom: 8 }}>Assigning Task</Text>
                       <View style={{ flexDirection: 'row' }}>
                          <Text style={{ flex: 1, color: C.text1, fontSize: 11, textAlign: 'center' }}>Planned ↑↓</Text>
                          <Text style={{ flex: 1, color: C.text1, fontSize: 11, textAlign: 'center' }}>Complete ↑↓</Text>
                          <Text style={{ flex: 1, color: C.text1, fontSize: 11, textAlign: 'center' }}>% ↑↓</Text>
                       </View>
                    </View>
                    
                    <View style={{ width: 270 }}>
                       <Text style={{ color: C.text1, fontWeight: 'bold', fontSize: 12, textAlign: 'center', marginBottom: 8 }}>Being Assigned</Text>
                       <View style={{ flexDirection: 'row' }}>
                          <Text style={{ flex: 1, color: C.text1, fontSize: 11, textAlign: 'center' }}>Planned ↑↓</Text>
                          <Text style={{ flex: 1, color: C.text1, fontSize: 11, textAlign: 'center' }}>Complete ↑↓</Text>
                          <Text style={{ flex: 1, color: C.text1, fontSize: 11, textAlign: 'center' }}>% ↑↓</Text>
                       </View>
                    </View>

                    <Text style={{ width: 110, color: C.text1, fontWeight: 'bold', fontSize: 12, textAlign: 'right' }}>Work Duration ↑↓</Text>
                 </View>

                 {/* Table Rows */}
                 {RESOURCE_DATA.map((row, i) => (
                    <View key={row.id} style={{ flexDirection: 'row', padding: 12, borderBottomWidth: 1, borderColor: C.borderSoft, alignItems: 'center' }}>
                       <View style={{ width: 170, flexDirection: 'row', alignItems: 'center' }}>
                          <Ionicons name="chevron-down" size={14} color={C.text3} style={{ marginRight: 8 }} />
                          <Text style={{ color: C.text2, fontSize: 11 }}>{row.member}</Text>
                       </View>
                       <Text style={{ width: 100, color: C.text3, fontSize: 11 }}>{row.project}</Text>
                       
                       {/* Assigning Task cols */}
                       <View style={{ width: 270, flexDirection: 'row', alignItems: 'center' }}>
                          <Text style={{ flex: 1, color: C.text2, fontSize: 11, textAlign: 'center' }}>{row.plannedAssign}</Text>
                          <Text style={{ flex: 1, color: C.text2, fontSize: 11, textAlign: 'center' }}>{row.completeAssign}</Text>
                          <View style={{ flex: 1, paddingHorizontal: 12 }}>
                             <Text style={{ color: C.text2, fontSize: 10, textAlign: 'right', marginBottom: 4 }}>{row.pctAssign}%</Text>
                             <View style={{ height: 3, backgroundColor: C.borderSoft, borderRadius: 2 }}>
                                <View style={{ width: `${row.pctAssign}%`, height: '100%', backgroundColor: getBarColor(row.pctAssign, C), borderRadius: 2 }} />
                             </View>
                          </View>
                       </View>
                       
                       {/* Being Assigned cols */}
                       <View style={{ width: 270, flexDirection: 'row', alignItems: 'center' }}>
                          <Text style={{ flex: 1, color: C.text2, fontSize: 11, textAlign: 'center' }}>{row.plannedBeing}</Text>
                          <Text style={{ flex: 1, color: C.text2, fontSize: 11, textAlign: 'center' }}>{row.completeBeing}</Text>
                          <View style={{ flex: 1, paddingHorizontal: 12 }}>
                             <Text style={{ color: C.text2, fontSize: 10, textAlign: 'right', marginBottom: 4 }}>{row.pctBeing}%</Text>
                             <View style={{ height: 3, backgroundColor: C.borderSoft, borderRadius: 2 }}>
                                <View style={{ width: `${row.pctBeing}%`, height: '100%', backgroundColor: getBarColor(row.pctBeing, C), borderRadius: 2 }} />
                             </View>
                          </View>
                       </View>

                       <Text style={{ width: 110, color: C.text2, fontSize: 11, textAlign: 'right' }}>{row.duration} min</Text>
                    </View>
                 ))}
               </View>
             </ScrollView>

             {/* Table Footer */}
             <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12, backgroundColor: C.surface }}>
                <Text style={{ color: C.text3, fontSize: 11 }}>Showing 1 to 10 of 131 results</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                   <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Text style={{ color: C.text3, fontSize: 11 }}>Rows per page</Text>
                      <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, borderWidth: 1, borderColor: C.borderSoft }}>
                         <Text style={{ color: C.text2, fontSize: 11 }}>10</Text>
                         <Ionicons name="chevron-down" size={10} color={C.text3} />
                      </TouchableOpacity>
                   </View>
                   <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      <TouchableOpacity style={{ padding: 4, opacity: 0.5 }}><Ionicons name="chevron-back-circle-outline" size={16} color={C.text3} /></TouchableOpacity>
                      <TouchableOpacity style={{ padding: 4 }}><Ionicons name="chevron-back" size={14} color={C.text2} /></TouchableOpacity>
                      <Text style={{ color: C.text2, fontSize: 11, marginHorizontal: 4 }}>Page 1 of 14</Text>
                      <TouchableOpacity style={{ padding: 4 }}><Ionicons name="chevron-forward" size={14} color={C.text2} /></TouchableOpacity>
                      <TouchableOpacity style={{ padding: 4 }}><Ionicons name="chevron-forward-circle-outline" size={16} color={C.text2} /></TouchableOpacity>
                   </View>
                </View>
             </View>

           </View>
        </ScrollView>
      )}

      {/* Date filter modal (bottom sheet style) */}
      <Modal visible={sheetOpen} transparent animationType="slide" onRequestClose={() => setSheetOpen(false)}>
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setSheetOpen(false)}>
          <View />
        </TouchableOpacity>
        <View style={styles.sheet}>
          <View style={styles.sheetHandle} />
          <Text style={styles.sheetTitle}>Rentang Tanggal</Text>
          <View style={styles.sheetOptions}>
            {['17 Agu – 17 Sep', 'Hari ini', 'Minggu ini', 'Bulan ini', 'Kustom'].map((label, i) => (
              <View key={label} style={[styles.sheetOpt, i === 0 && styles.sheetOptOn]}>
                <Text style={[styles.sheetOptText, i === 0 && styles.sheetOptTextOn]}>{label}</Text>
              </View>
            ))}
          </View>
          <TouchableOpacity
            style={styles.sheetApply}
            onPress={() => {
              setSheetOpen(false);
              showToast('Rentang tanggal diperbarui');
            }}
          >
            <Text style={styles.sheetApplyText}>Terapkan</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Toast */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.toast,
          {
            opacity: toastAnim,
            transform: [
              {
                translateY: toastAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }),
              },
            ],
          },
        ]}
      >
        <Text style={{ color: C.green, marginRight: 8 }}>✓</Text>
        <Text style={styles.toastText}>{toastMsg}</Text>
      </Animated.View>
    </SafeAreaView>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  mono: { fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' },

  topbar: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSoft,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
    zIndex: 5,
  },
  topbarRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  brandBlock: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  brandText: { color: colors.text1, fontSize: 18, fontWeight: '700' },
  headerActions: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  notifBtn: { position: "relative", marginRight: 8 },
  notifBadge: {
    position: "absolute", top: 2, right: 2, width: 8, height: 8, borderRadius: 4,
    backgroundColor: colors.red, borderWidth: 1, borderColor: colors.surface,
  },
  avatarContainer: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: colors.surface3,
    alignItems: "center", justifyContent: "center", overflow: "hidden",
  },
  
  dropdownMenu: {
    position: 'absolute', top: 55, left: 16, backgroundColor: colors.surface2, 
    borderRadius: 8, padding: 4, zIndex: 10, borderWidth: 1, borderColor: colors.borderSoft,
    shadowColor: '#000', shadowOffset: {width: 0, height: 4}, shadowOpacity: 0.15, shadowRadius: 10, elevation: 5,
  },
  dropdownItem: { paddingHorizontal: 16, paddingVertical: 12, borderRadius: 6 },
  dropdownItemText: { color: colors.text1, fontSize: 14, fontWeight: '600' },

  liveChip: {
    flexDirection: 'row', alignItems: 'center', gap: 7, backgroundColor: colors.surface2,
    borderWidth: 1, borderColor: colors.borderSoft, borderRadius: 20, paddingVertical: 6,
    paddingHorizontal: 10, marginTop: 12, alignSelf: 'flex-start',
  },
  recBtn: { width: 20, height: 20, borderRadius: 10, backgroundColor: colors.red, alignItems: 'center', justifyContent: 'center' },
  pulseDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.green },
  liveCode: { fontSize: 12, fontWeight: '600', color: colors.text2 },
  liveTimer: { fontSize: 12.5, fontWeight: '700', color: colors.text1 },

  searchWrap: { paddingHorizontal: 16, paddingTop: 12 },
  searchBox: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface,
    borderWidth: 1, borderColor: colors.border, borderRadius: 13, paddingHorizontal: 13, paddingVertical: 11,
  },
  searchInput: { flex: 1, color: colors.text1, fontSize: 14, paddingVertical: 0 },

  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 8, paddingHorizontal: 13,
    borderRadius: 10, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
  },
  chipActive: { backgroundColor: colors.brandSoft, borderColor: 'rgba(91,127,255,0.4)' },
  chipText: { fontSize: 12.5, fontWeight: '600', color: colors.text2 },
  chipTextActive: { color: colors.brand },
  chipCount: { backgroundColor: colors.surface3, borderRadius: 6, paddingHorizontal: 5, paddingVertical: 1 },
  chipCountActive: { backgroundColor: 'rgba(91,127,255,0.25)' },
  chipCountText: { fontSize: 10.5, fontWeight: '700', color: colors.text2 },
  chipCountTextActive: { color: colors.brand },

  dateRange: {
    marginHorizontal: 16, marginTop: 10, padding: 12, borderRadius: 12,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  dateRangeText: { color: colors.text1, fontSize: 13, fontWeight: '500' },

  summaryStrip: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingTop: 14 },
  sumCard: { flex: 1, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 13, padding: 11 },
  sumLabel: { fontSize: 9.5, color: colors.text3, fontWeight: '700', letterSpacing: 0.3 },
  sumValue: { fontSize: 17, fontWeight: '700', color: colors.text1, marginTop: 4 },

  listHead: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 8 },
  listTitle: { fontSize: 13, fontWeight: '700', color: colors.text2 },

  card: {
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 15,
    marginHorizontal: 16, marginBottom: 10, padding: 13, overflow: 'hidden',
  },
  cardActive: { borderColor: 'rgba(51,214,192,0.4)' },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  taskId: { fontSize: 11, color: colors.brand, fontWeight: '700' },
  taskName: { fontSize: 14, fontWeight: '600', color: colors.text1, marginTop: 2, lineHeight: 19 },
  pill: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingVertical: 4, paddingHorizontal: 9, borderRadius: 7 },
  pillDot: { width: 5, height: 5, borderRadius: 3 },
  pillText: { fontSize: 10.5, fontWeight: '700' },

  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 14, marginTop: 9 },
  metaText: { fontSize: 11.5, color: colors.text3 },

  cardFoot: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 9 },
  assigneeRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  avatar: { width: 16, height: 16, borderRadius: 8, backgroundColor: colors.surface3, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 8, fontWeight: '700', color: colors.text2 },
  assigneeText: { fontSize: 11.5, color: colors.text2 },
  liveDurRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  liveDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: colors.teal },
  liveDurText: { fontSize: 13, fontWeight: '700', color: colors.teal },
  chevron: { color: colors.text3, fontSize: 14 },

  detailWrap: { borderTopWidth: 1, borderTopColor: colors.borderSoft, marginTop: 12, paddingTop: 12 },
  detailGrid: { flexDirection: 'row' },
  detailCol: { flex: 1, paddingHorizontal: 4 },
  detailColTitle: { fontSize: 10, fontWeight: '700', color: colors.text3, marginBottom: 8, letterSpacing: 0.3 },
  detailLine: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  detailLabel: { fontSize: 12, color: colors.text3 },
  detailValue: { fontSize: 11.5, color: colors.text1, fontWeight: '600' },
  detailNote: { fontSize: 11.5, color: colors.text3, marginTop: 8 },

  emptyState: { paddingVertical: 50, alignItems: 'center' },
  emptyTitle: { fontSize: 13.5, fontWeight: '600', color: colors.text2, marginBottom: 4 },
  emptySub: { fontSize: 12, color: colors.text3 },

  bottomBar: {
    position: 'absolute', left: 0, right: 0, bottom: Platform.OS === 'ios' ? 88 : 70, backgroundColor: colors.surface,
    borderTopWidth: 1, borderTopColor: colors.border, paddingHorizontal: 16, paddingTop: 11, paddingBottom: 20,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  bbLabel: { fontSize: 9.5, color: colors.text3, fontWeight: '700', letterSpacing: 0.3 },
  bbValue: { fontSize: 14.5, fontWeight: '700', marginTop: 2 },
  exportBtn: { backgroundColor: colors.brand, borderRadius: 11, paddingVertical: 11, paddingHorizontal: 17 },
  exportBtnText: { color: 'white', fontWeight: '700', fontSize: 13 },

  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)' },
  sheet: {
    position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: colors.surface,
    borderTopLeftRadius: 20, borderTopRightRadius: 20, borderWidth: 1, borderColor: colors.border,
    borderBottomWidth: 0, padding: 18, paddingBottom: 34,
  },
  sheetHandle: { width: 36, height: 4, backgroundColor: colors.surface3, borderRadius: 3, alignSelf: 'center', marginBottom: 14 },
  sheetTitle: { fontSize: 15.5, fontWeight: '700', color: colors.text1, marginBottom: 14 },
  sheetOptions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 18 },
  sheetOpt: { paddingVertical: 9, paddingHorizontal: 14, borderRadius: 10, backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.borderSoft },
  sheetOptOn: { backgroundColor: colors.brand, borderColor: colors.brand },
  sheetOptText: { fontSize: 12.5, fontWeight: '600', color: colors.text2 },
  sheetOptTextOn: { color: 'white' },
  sheetApply: { backgroundColor: colors.brand, borderRadius: 12, paddingVertical: 13, alignItems: 'center' },
  sheetApplyText: { color: 'white', fontWeight: '700', fontSize: 14 },

  toast: {
    position: 'absolute', left: '50%', bottom: 100, transform: [{ translateX: -110 }],
    backgroundColor: colors.surface3, borderWidth: 1, borderColor: colors.border,
    borderRadius: 11, paddingVertical: 11, paddingHorizontal: 18, flexDirection: 'row', alignItems: 'center',
    width: 220, justifyContent: 'center',
  },
  toastText: { color: colors.text1, fontSize: 12.5, fontWeight: '600' },
});
