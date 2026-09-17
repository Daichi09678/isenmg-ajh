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
  { id: 13, member: 'Fajar Hidayat', project: 'Mobile App', plannedAssign: 8, completeAssign: 6, pctAssign: 75, plannedBeing: 10, completeBeing: 7, pctBeing: 70, duration: 3200 },
  { id: 14, member: 'Galih Permana', project: '-', plannedAssign: 12, completeAssign: 4, pctAssign: 33, plannedBeing: 6, completeBeing: 2, pctBeing: 33, duration: 1450 },
  { id: 15, member: 'Hendra Gunawan', project: 'Web Admin', plannedAssign: 18, completeAssign: 15, pctAssign: 83, plannedBeing: 9, completeBeing: 9, pctBeing: 100, duration: 6100 },
  { id: 16, member: 'Irfan Maulana', project: '-', plannedAssign: 5, completeAssign: 1, pctAssign: 20, plannedBeing: 14, completeBeing: 3, pctBeing: 21, duration: 780 },
  { id: 17, member: 'Joko Widodo', project: 'Backend System', plannedAssign: 22, completeAssign: 20, pctAssign: 91, plannedBeing: 18, completeBeing: 16, pctBeing: 89, duration: 7200 },
  { id: 18, member: 'Kurniawan Saputra', project: '-', plannedAssign: 0, completeAssign: 0, pctAssign: 0, plannedBeing: 3, completeBeing: 1, pctBeing: 33, duration: 120 },
  { id: 19, member: 'Lukman Hakim', project: 'Infrastructure', plannedAssign: 7, completeAssign: 7, pctAssign: 100, plannedBeing: 4, completeBeing: 4, pctBeing: 100, duration: 2950 },
  { id: 20, member: 'Muhammad Rizky', project: '-', plannedAssign: 11, completeAssign: 3, pctAssign: 27, plannedBeing: 8, completeBeing: 5, pctBeing: 63, duration: 1870 },
  { id: 21, member: 'Naufal Ghifari', project: 'Mobile App', plannedAssign: 14, completeAssign: 10, pctAssign: 71, plannedBeing: 7, completeBeing: 7, pctBeing: 100, duration: 4500 },
  { id: 22, member: 'Oscar Pratama', project: '-', plannedAssign: 6, completeAssign: 2, pctAssign: 33, plannedBeing: 15, completeBeing: 8, pctBeing: 53, duration: 2100 },
  { id: 23, member: 'Putra Mahendra', project: 'Web Admin', plannedAssign: 9, completeAssign: 9, pctAssign: 100, plannedBeing: 11, completeBeing: 6, pctBeing: 55, duration: 3600 },
  { id: 24, member: 'Qodir Zulkarnain', project: '-', plannedAssign: 0, completeAssign: 0, pctAssign: 0, plannedBeing: 2, completeBeing: 0, pctBeing: 0, duration: 0 },
  { id: 25, member: 'Rahmat Syahputra', project: 'Backend System', plannedAssign: 17, completeAssign: 12, pctAssign: 71, plannedBeing: 13, completeBeing: 10, pctBeing: 77, duration: 5400 },
  { id: 26, member: 'Surya Dharma', project: '-', plannedAssign: 4, completeAssign: 4, pctAssign: 100, plannedBeing: 6, completeBeing: 3, pctBeing: 50, duration: 1600 },
  { id: 27, member: 'Taufik Ismail', project: 'Infrastructure', plannedAssign: 13, completeAssign: 7, pctAssign: 54, plannedBeing: 19, completeBeing: 14, pctBeing: 74, duration: 4200 },
  { id: 28, member: 'Umar Fauzi', project: '-', plannedAssign: 1, completeAssign: 0, pctAssign: 0, plannedBeing: 5, completeBeing: 1, pctBeing: 20, duration: 300 },
  { id: 29, member: 'Vino Bastian', project: 'Mobile App', plannedAssign: 10, completeAssign: 8, pctAssign: 80, plannedBeing: 10, completeBeing: 9, pctBeing: 90, duration: 3800 },
  { id: 30, member: 'Wahyu Setiawan', project: '-', plannedAssign: 3, completeAssign: 1, pctAssign: 33, plannedBeing: 7, completeBeing: 2, pctBeing: 29, duration: 640 },
  { id: 31, member: 'Xaverius Rendi', project: 'Web Admin', plannedAssign: 8, completeAssign: 5, pctAssign: 63, plannedBeing: 4, completeBeing: 4, pctBeing: 100, duration: 2200 },
  { id: 32, member: 'Yoga Aditama', project: '-', plannedAssign: 19, completeAssign: 14, pctAssign: 74, plannedBeing: 16, completeBeing: 11, pctBeing: 69, duration: 5100 },
  { id: 33, member: 'Zainal Abidin', project: 'Backend System', plannedAssign: 6, completeAssign: 6, pctAssign: 100, plannedBeing: 3, completeBeing: 3, pctBeing: 100, duration: 2800 },
  { id: 34, member: 'Arief Rachman', project: '-', plannedAssign: 14, completeAssign: 9, pctAssign: 64, plannedBeing: 8, completeBeing: 5, pctBeing: 63, duration: 3400 },
  { id: 35, member: 'Bambang Suryono', project: 'Infrastructure', plannedAssign: 21, completeAssign: 19, pctAssign: 90, plannedBeing: 17, completeBeing: 15, pctBeing: 88, duration: 6800 },
  { id: 36, member: 'Cahyo Nugroho', project: '-', plannedAssign: 2, completeAssign: 0, pctAssign: 0, plannedBeing: 9, completeBeing: 4, pctBeing: 44, duration: 950 },
  { id: 37, member: 'Dimas Anggara', project: 'Mobile App', plannedAssign: 11, completeAssign: 7, pctAssign: 64, plannedBeing: 13, completeBeing: 8, pctBeing: 62, duration: 3100 },
  { id: 38, member: 'Erwanto Pujiarto', project: '-', plannedAssign: 0, completeAssign: 0, pctAssign: 0, plannedBeing: 4, completeBeing: 0, pctBeing: 0, duration: 0 },
  { id: 39, member: 'Firdaus Harahap', project: 'Web Admin', plannedAssign: 7, completeAssign: 3, pctAssign: 43, plannedBeing: 11, completeBeing: 6, pctBeing: 55, duration: 1700 },
  { id: 40, member: 'Gilang Ramadhan', project: '-', plannedAssign: 16, completeAssign: 11, pctAssign: 69, plannedBeing: 5, completeBeing: 5, pctBeing: 100, duration: 4100 },
  { id: 41, member: 'Hafidz Mubarok', project: 'Backend System', plannedAssign: 9, completeAssign: 9, pctAssign: 100, plannedBeing: 7, completeBeing: 7, pctBeing: 100, duration: 3900 },
  { id: 42, member: 'Imam Fauzan', project: '-', plannedAssign: 5, completeAssign: 2, pctAssign: 40, plannedBeing: 10, completeBeing: 3, pctBeing: 30, duration: 890 },
  { id: 43, member: 'Jefri Sihotang', project: 'Infrastructure', plannedAssign: 12, completeAssign: 8, pctAssign: 67, plannedBeing: 14, completeBeing: 10, pctBeing: 71, duration: 3700 },
  { id: 44, member: 'Kevin Anggara', project: '-', plannedAssign: 0, completeAssign: 0, pctAssign: 0, plannedBeing: 1, completeBeing: 1, pctBeing: 100, duration: 45 },
  { id: 45, member: 'Luthfi Hamdani', project: 'Mobile App', plannedAssign: 18, completeAssign: 13, pctAssign: 72, plannedBeing: 20, completeBeing: 15, pctBeing: 75, duration: 5800 },
  { id: 46, member: 'Malik Ibrahim', project: '-', plannedAssign: 4, completeAssign: 4, pctAssign: 100, plannedBeing: 2, completeBeing: 2, pctBeing: 100, duration: 1100 },
  { id: 47, member: 'Nanda Pratama', project: 'Web Admin', plannedAssign: 15, completeAssign: 10, pctAssign: 67, plannedBeing: 12, completeBeing: 9, pctBeing: 75, duration: 4300 },
  { id: 48, member: 'Oktaviano Slamet', project: '-', plannedAssign: 3, completeAssign: 1, pctAssign: 33, plannedBeing: 6, completeBeing: 2, pctBeing: 33, duration: 520 },
  { id: 49, member: 'Prasetya Aji', project: 'Backend System', plannedAssign: 20, completeAssign: 16, pctAssign: 80, plannedBeing: 9, completeBeing: 8, pctBeing: 89, duration: 6400 },
  { id: 50, member: 'Ridwan Kamil', project: '-', plannedAssign: 1, completeAssign: 0, pctAssign: 0, plannedBeing: 3, completeBeing: 0, pctBeing: 0, duration: 0 },
  { id: 51, member: 'Satria Nugraha', project: 'Infrastructure', plannedAssign: 8, completeAssign: 6, pctAssign: 75, plannedBeing: 11, completeBeing: 7, pctBeing: 64, duration: 2700 },
  { id: 52, member: 'Teguh Prasetyo', project: '-', plannedAssign: 13, completeAssign: 10, pctAssign: 77, plannedBeing: 8, completeBeing: 6, pctBeing: 75, duration: 3500 },
  { id: 53, member: 'Udin Saepudin', project: 'Mobile App', plannedAssign: 6, completeAssign: 3, pctAssign: 50, plannedBeing: 15, completeBeing: 10, pctBeing: 67, duration: 2400 },
  { id: 54, member: 'Viktor Manurung', project: '-', plannedAssign: 0, completeAssign: 0, pctAssign: 0, plannedBeing: 5, completeBeing: 2, pctBeing: 40, duration: 380 },
  { id: 55, member: 'Wawan Hermawan', project: 'Web Admin', plannedAssign: 10, completeAssign: 10, pctAssign: 100, plannedBeing: 6, completeBeing: 6, pctBeing: 100, duration: 4800 },
  { id: 56, member: 'Yanto Sugiarto', project: '-', plannedAssign: 7, completeAssign: 2, pctAssign: 29, plannedBeing: 9, completeBeing: 4, pctBeing: 44, duration: 1300 },
  { id: 57, member: 'Zulfikar Ramadhan', project: 'Backend System', plannedAssign: 14, completeAssign: 11, pctAssign: 79, plannedBeing: 7, completeBeing: 5, pctBeing: 71, duration: 4600 },
  { id: 58, member: 'Andri Setiawan', project: '-', plannedAssign: 9, completeAssign: 5, pctAssign: 56, plannedBeing: 13, completeBeing: 8, pctBeing: 62, duration: 2900 },
  { id: 59, member: 'Bayu Krisna', project: 'Infrastructure', plannedAssign: 17, completeAssign: 14, pctAssign: 82, plannedBeing: 10, completeBeing: 10, pctBeing: 100, duration: 5500 },
  { id: 60, member: 'Chairul Anwar', project: '-', plannedAssign: 2, completeAssign: 2, pctAssign: 100, plannedBeing: 4, completeBeing: 1, pctBeing: 25, duration: 700 },
  { id: 61, member: 'Deni Firmansyah', project: 'Mobile App', plannedAssign: 11, completeAssign: 8, pctAssign: 73, plannedBeing: 16, completeBeing: 12, pctBeing: 75, duration: 3800 },
  { id: 62, member: 'Erwin Saputra', project: '-', plannedAssign: 0, completeAssign: 0, pctAssign: 0, plannedBeing: 2, completeBeing: 0, pctBeing: 0, duration: 0 },
  { id: 63, member: 'Faisal Abdillah', project: 'Web Admin', plannedAssign: 15, completeAssign: 12, pctAssign: 80, plannedBeing: 8, completeBeing: 6, pctBeing: 75, duration: 4400 },
  { id: 64, member: 'Guntur Wibowo', project: '-', plannedAssign: 4, completeAssign: 1, pctAssign: 25, plannedBeing: 7, completeBeing: 3, pctBeing: 43, duration: 900 },
  { id: 65, member: 'Hasan Basri', project: 'Backend System', plannedAssign: 19, completeAssign: 17, pctAssign: 89, plannedBeing: 14, completeBeing: 13, pctBeing: 93, duration: 7100 },
  { id: 66, member: 'Iwan Setiawan', project: '-', plannedAssign: 6, completeAssign: 4, pctAssign: 67, plannedBeing: 5, completeBeing: 3, pctBeing: 60, duration: 1800 },
  { id: 67, member: 'Jajang Nurjaman', project: 'Infrastructure', plannedAssign: 8, completeAssign: 5, pctAssign: 63, plannedBeing: 11, completeBeing: 7, pctBeing: 64, duration: 2600 },
  { id: 68, member: 'Khoirul Anam', project: '-', plannedAssign: 1, completeAssign: 0, pctAssign: 0, plannedBeing: 3, completeBeing: 1, pctBeing: 33, duration: 150 },
  { id: 69, member: 'Lutfi Ramadhan', project: 'Mobile App', plannedAssign: 13, completeAssign: 9, pctAssign: 69, plannedBeing: 17, completeBeing: 12, pctBeing: 71, duration: 4000 },
  { id: 70, member: 'Mulyadi Pranoto', project: '-', plannedAssign: 10, completeAssign: 7, pctAssign: 70, plannedBeing: 6, completeBeing: 4, pctBeing: 67, duration: 3100 },
  { id: 71, member: 'Nur Rohman', project: 'Web Admin', plannedAssign: 5, completeAssign: 3, pctAssign: 60, plannedBeing: 9, completeBeing: 5, pctBeing: 56, duration: 1600 },
  { id: 72, member: 'Oki Setiawan', project: '-', plannedAssign: 0, completeAssign: 0, pctAssign: 0, plannedBeing: 1, completeBeing: 0, pctBeing: 0, duration: 0 },
  { id: 73, member: 'Pandu Wiratama', project: 'Backend System', plannedAssign: 16, completeAssign: 13, pctAssign: 81, plannedBeing: 12, completeBeing: 10, pctBeing: 83, duration: 5200 },
  { id: 74, member: 'Rizal Fakhri', project: '-', plannedAssign: 7, completeAssign: 4, pctAssign: 57, plannedBeing: 8, completeBeing: 5, pctBeing: 63, duration: 2100 },
  { id: 75, member: 'Slamet Riyadi', project: 'Infrastructure', plannedAssign: 12, completeAssign: 10, pctAssign: 83, plannedBeing: 15, completeBeing: 11, pctBeing: 73, duration: 4700 },
  { id: 76, member: 'Tri Wibowo', project: '-', plannedAssign: 3, completeAssign: 2, pctAssign: 67, plannedBeing: 4, completeBeing: 2, pctBeing: 50, duration: 800 },
  { id: 77, member: 'Ujang Darmawan', project: 'Mobile App', plannedAssign: 9, completeAssign: 6, pctAssign: 67, plannedBeing: 10, completeBeing: 8, pctBeing: 80, duration: 3300 },
  { id: 78, member: 'Vicky Prasetyo', project: '-', plannedAssign: 2, completeAssign: 1, pctAssign: 50, plannedBeing: 6, completeBeing: 3, pctBeing: 50, duration: 600 },
  { id: 79, member: 'Wisnu Wardana', project: 'Web Admin', plannedAssign: 18, completeAssign: 15, pctAssign: 83, plannedBeing: 13, completeBeing: 11, pctBeing: 85, duration: 6200 },
  { id: 80, member: 'Yudha Permana', project: '-', plannedAssign: 5, completeAssign: 3, pctAssign: 60, plannedBeing: 7, completeBeing: 4, pctBeing: 57, duration: 1500 },
  { id: 81, member: 'Zaenal Mustafa', project: 'Backend System', plannedAssign: 11, completeAssign: 8, pctAssign: 73, plannedBeing: 9, completeBeing: 7, pctBeing: 78, duration: 3600 },
  { id: 82, member: 'Aris Munandar', project: '-', plannedAssign: 14, completeAssign: 10, pctAssign: 71, plannedBeing: 11, completeBeing: 8, pctBeing: 73, duration: 4100 },
  { id: 83, member: 'Basuki Rahmat', project: 'Infrastructure', plannedAssign: 20, completeAssign: 18, pctAssign: 90, plannedBeing: 16, completeBeing: 14, pctBeing: 88, duration: 6900 },
  { id: 84, member: 'Candra Wijaya', project: '-', plannedAssign: 1, completeAssign: 0, pctAssign: 0, plannedBeing: 2, completeBeing: 1, pctBeing: 50, duration: 200 },
  { id: 85, member: 'Dian Nugroho', project: 'Mobile App', plannedAssign: 8, completeAssign: 6, pctAssign: 75, plannedBeing: 14, completeBeing: 10, pctBeing: 71, duration: 3500 },
  { id: 86, member: 'Edy Purwanto', project: '-', plannedAssign: 0, completeAssign: 0, pctAssign: 0, plannedBeing: 3, completeBeing: 0, pctBeing: 0, duration: 0 },
  { id: 87, member: 'Firman Hidayat', project: 'Web Admin', plannedAssign: 6, completeAssign: 4, pctAssign: 67, plannedBeing: 5, completeBeing: 3, pctBeing: 60, duration: 1900 },
  { id: 88, member: 'Gandi Sulistyo', project: '-', plannedAssign: 13, completeAssign: 9, pctAssign: 69, plannedBeing: 10, completeBeing: 7, pctBeing: 70, duration: 3800 },
  { id: 89, member: 'Handoko Santoso', project: 'Backend System', plannedAssign: 7, completeAssign: 5, pctAssign: 71, plannedBeing: 8, completeBeing: 6, pctBeing: 75, duration: 2500 },
  { id: 90, member: 'Indra Lesmana', project: '-', plannedAssign: 4, completeAssign: 2, pctAssign: 50, plannedBeing: 12, completeBeing: 5, pctBeing: 42, duration: 1100 },
  { id: 91, member: 'Jaya Kusuma', project: 'Infrastructure', plannedAssign: 15, completeAssign: 12, pctAssign: 80, plannedBeing: 11, completeBeing: 9, pctBeing: 82, duration: 5000 },
  { id: 92, member: 'Karman Sopyan', project: '-', plannedAssign: 2, completeAssign: 1, pctAssign: 50, plannedBeing: 4, completeBeing: 2, pctBeing: 50, duration: 450 },
  { id: 93, member: 'Lukito Wibowo', project: 'Mobile App', plannedAssign: 10, completeAssign: 7, pctAssign: 70, plannedBeing: 13, completeBeing: 9, pctBeing: 69, duration: 3400 },
  { id: 94, member: 'Miftahul Huda', project: '-', plannedAssign: 0, completeAssign: 0, pctAssign: 0, plannedBeing: 1, completeBeing: 0, pctBeing: 0, duration: 0 },
  { id: 95, member: 'Nugroho Prasetyo', project: 'Web Admin', plannedAssign: 17, completeAssign: 14, pctAssign: 82, plannedBeing: 9, completeBeing: 8, pctBeing: 89, duration: 5700 },
  { id: 96, member: 'Oky Rahmawan', project: '-', plannedAssign: 5, completeAssign: 3, pctAssign: 60, plannedBeing: 7, completeBeing: 4, pctBeing: 57, duration: 1400 },
  { id: 97, member: 'Prayoga Utama', project: 'Backend System', plannedAssign: 12, completeAssign: 10, pctAssign: 83, plannedBeing: 6, completeBeing: 5, pctBeing: 83, duration: 4200 },
  { id: 98, member: 'Rendi Saputra', project: '-', plannedAssign: 3, completeAssign: 1, pctAssign: 33, plannedBeing: 8, completeBeing: 3, pctBeing: 38, duration: 720 },
  { id: 99, member: 'Sugeng Hartono', project: 'Infrastructure', plannedAssign: 9, completeAssign: 7, pctAssign: 78, plannedBeing: 10, completeBeing: 8, pctBeing: 80, duration: 3200 },
  { id: 100, member: 'Toni Sucipto', project: '-', plannedAssign: 6, completeAssign: 4, pctAssign: 67, plannedBeing: 5, completeBeing: 3, pctBeing: 60, duration: 1700 },
  { id: 101, member: 'Unang Supriatna', project: 'Mobile App', plannedAssign: 14, completeAssign: 11, pctAssign: 79, plannedBeing: 18, completeBeing: 13, pctBeing: 72, duration: 5100 },
  { id: 102, member: 'Vandy Pratama', project: '-', plannedAssign: 1, completeAssign: 0, pctAssign: 0, plannedBeing: 2, completeBeing: 0, pctBeing: 0, duration: 0 },
  { id: 103, member: 'Wawan Kurniawan', project: 'Web Admin', plannedAssign: 8, completeAssign: 6, pctAssign: 75, plannedBeing: 7, completeBeing: 5, pctBeing: 71, duration: 2800 },
  { id: 104, member: 'Yogi Firmansyah', project: '-', plannedAssign: 11, completeAssign: 8, pctAssign: 73, plannedBeing: 9, completeBeing: 6, pctBeing: 67, duration: 3400 },
  { id: 105, member: 'Zubaedi Muttaqin', project: 'Backend System', plannedAssign: 16, completeAssign: 14, pctAssign: 88, plannedBeing: 12, completeBeing: 11, pctBeing: 92, duration: 5900 },
  { id: 106, member: 'Anwar Ibrahim', project: '-', plannedAssign: 7, completeAssign: 3, pctAssign: 43, plannedBeing: 6, completeBeing: 2, pctBeing: 33, duration: 1200 },
  { id: 107, member: 'Budiman Sujatmiko', project: 'Infrastructure', plannedAssign: 13, completeAssign: 11, pctAssign: 85, plannedBeing: 15, completeBeing: 12, pctBeing: 80, duration: 4800 },
  { id: 108, member: 'Cecep Suhendar', project: '-', plannedAssign: 0, completeAssign: 0, pctAssign: 0, plannedBeing: 4, completeBeing: 1, pctBeing: 25, duration: 180 },
  { id: 109, member: 'Dodi Iskandar', project: 'Mobile App', plannedAssign: 10, completeAssign: 7, pctAssign: 70, plannedBeing: 11, completeBeing: 8, pctBeing: 73, duration: 3600 },
  { id: 110, member: 'Endang Supriyadi', project: '-', plannedAssign: 5, completeAssign: 2, pctAssign: 40, plannedBeing: 3, completeBeing: 1, pctBeing: 33, duration: 680 },
  { id: 111, member: 'Ferry Irawan', project: 'Web Admin', plannedAssign: 18, completeAssign: 15, pctAssign: 83, plannedBeing: 14, completeBeing: 12, pctBeing: 86, duration: 6300 },
  { id: 112, member: 'Gunawan Wicaksono', project: '-', plannedAssign: 4, completeAssign: 3, pctAssign: 75, plannedBeing: 8, completeBeing: 5, pctBeing: 63, duration: 1500 },
  { id: 113, member: 'Heri Susanto', project: 'Backend System', plannedAssign: 9, completeAssign: 6, pctAssign: 67, plannedBeing: 7, completeBeing: 5, pctBeing: 71, duration: 2700 },
  { id: 114, member: 'Ilham Maulana', project: '-', plannedAssign: 2, completeAssign: 1, pctAssign: 50, plannedBeing: 5, completeBeing: 2, pctBeing: 40, duration: 420 },
  { id: 115, member: 'Johan Permadi', project: 'Infrastructure', plannedAssign: 15, completeAssign: 13, pctAssign: 87, plannedBeing: 10, completeBeing: 9, pctBeing: 90, duration: 5400 },
  { id: 116, member: 'Kiki Saputra', project: '-', plannedAssign: 6, completeAssign: 4, pctAssign: 67, plannedBeing: 9, completeBeing: 6, pctBeing: 67, duration: 2000 },
  { id: 117, member: 'Landi Ramadhan', project: 'Mobile App', plannedAssign: 12, completeAssign: 9, pctAssign: 75, plannedBeing: 16, completeBeing: 11, pctBeing: 69, duration: 4100 },
  { id: 118, member: 'Marwan Effendi', project: '-', plannedAssign: 0, completeAssign: 0, pctAssign: 0, plannedBeing: 2, completeBeing: 1, pctBeing: 50, duration: 90 },
  { id: 119, member: 'Nanang Hermawan', project: 'Web Admin', plannedAssign: 8, completeAssign: 5, pctAssign: 63, plannedBeing: 6, completeBeing: 4, pctBeing: 67, duration: 2300 },
  { id: 120, member: 'Opik Santoso', project: '-', plannedAssign: 14, completeAssign: 10, pctAssign: 71, plannedBeing: 11, completeBeing: 8, pctBeing: 73, duration: 4200 },
  { id: 121, member: 'Purnomo Anggoro', project: 'Backend System', plannedAssign: 7, completeAssign: 5, pctAssign: 71, plannedBeing: 4, completeBeing: 3, pctBeing: 75, duration: 2100 },
  { id: 122, member: 'Rudy Hartono', project: '-', plannedAssign: 3, completeAssign: 2, pctAssign: 67, plannedBeing: 7, completeBeing: 4, pctBeing: 57, duration: 850 },
  { id: 123, member: 'Soleh Hidayat', project: 'Infrastructure', plannedAssign: 11, completeAssign: 9, pctAssign: 82, plannedBeing: 13, completeBeing: 10, pctBeing: 77, duration: 4000 },
  { id: 124, member: 'Tommy Kurniawan', project: '-', plannedAssign: 1, completeAssign: 0, pctAssign: 0, plannedBeing: 3, completeBeing: 0, pctBeing: 0, duration: 0 },
  { id: 125, member: 'Usman Hakim', project: 'Mobile App', plannedAssign: 16, completeAssign: 12, pctAssign: 75, plannedBeing: 19, completeBeing: 14, pctBeing: 74, duration: 5300 },
  { id: 126, member: 'Veri Setiawan', project: '-', plannedAssign: 5, completeAssign: 3, pctAssign: 60, plannedBeing: 8, completeBeing: 5, pctBeing: 63, duration: 1600 },
  { id: 127, member: 'Widi Nugroho', project: 'Web Admin', plannedAssign: 10, completeAssign: 8, pctAssign: 80, plannedBeing: 7, completeBeing: 6, pctBeing: 86, duration: 3500 },
  { id: 128, member: 'Yanto Purnomo', project: '-', plannedAssign: 4, completeAssign: 2, pctAssign: 50, plannedBeing: 6, completeBeing: 3, pctBeing: 50, duration: 900 },
  { id: 129, member: 'Zaki Mubarak', project: 'Backend System', plannedAssign: 13, completeAssign: 10, pctAssign: 77, plannedBeing: 10, completeBeing: 8, pctBeing: 80, duration: 4500 },
  { id: 130, member: 'Asep Sunandar', project: 'Infrastructure', plannedAssign: 19, completeAssign: 16, pctAssign: 84, plannedBeing: 14, completeBeing: 12, pctBeing: 86, duration: 6100 },
  { id: 131, member: 'Benny Prasetyo', project: '-', plannedAssign: 2, completeAssign: 1, pctAssign: 50, plannedBeing: 5, completeBeing: 2, pctBeing: 40, duration: 550 },
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

  // Resource state
  const [resourcePage, setResourcePage] = useState(1);
  const [resourceRowsPerPage, setResourceRowsPerPage] = useState(10);
  const [showRowsMenu, setShowRowsMenu] = useState(false);
  const [resourceViewMode, setResourceViewMode] = useState<'Member' | 'Project'>('Member');
  const [showWorkspaceDropdown, setShowWorkspaceDropdown] = useState(false);
  const [selectedWorkspaces, setSelectedWorkspaces] = useState<string[]>([]);
  const [showMoreFilter, setShowMoreFilter] = useState(false);
  const [resourceSearch, setResourceSearch] = useState('');
  const [minPct, setMinPct] = useState('');
  const [maxPct, setMaxPct] = useState('');
  const [minDuration, setMinDuration] = useState('');
  const [maxDuration, setMaxDuration] = useState('');
  const [resourceSortKey, setResourceSortKey] = useState<string>('member');
  const [resourceSortAsc, setResourceSortAsc] = useState(true);

  const ALL_WORKSPACES = useMemo(() => {
    const ws = new Set(RESOURCE_DATA.map(r => r.project).filter(p => p !== '-'));
    return Array.from(ws).sort();
  }, []);

  const toggleWorkspace = (ws: string) => {
    setSelectedWorkspaces(prev =>
      prev.includes(ws) ? prev.filter(w => w !== ws) : [...prev, ws]
    );
    setResourcePage(1);
  };

  // Grouped by project for "View by Project"
  const groupedByProject = useMemo(() => {
    const groups: Record<string, typeof RESOURCE_DATA> = {};
    RESOURCE_DATA.forEach(r => {
      const key = r.project === '-' ? 'Unassigned' : r.project;
      if (!groups[key]) groups[key] = [];
      groups[key].push(r);
    });
    return groups;
  }, []);

  const filteredResource = useMemo(() => {
    let data = [...RESOURCE_DATA];
    // workspace filter
    if (selectedWorkspaces.length > 0) {
      data = data.filter(r => selectedWorkspaces.includes(r.project) || (selectedWorkspaces.includes('Unassigned') && r.project === '-'));
    }
    // search filter
    if (resourceSearch.trim()) {
      const q = resourceSearch.toLowerCase();
      data = data.filter(r => r.member.toLowerCase().includes(q) || r.project.toLowerCase().includes(q));
    }
    // pct filter (uses average of pctAssign & pctBeing)
    if (minPct !== '') {
      const min = parseInt(minPct);
      if (!isNaN(min)) data = data.filter(r => Math.max(r.pctAssign, r.pctBeing) >= min);
    }
    if (maxPct !== '') {
      const max = parseInt(maxPct);
      if (!isNaN(max)) data = data.filter(r => Math.min(r.pctAssign, r.pctBeing) <= max);
    }
    // duration filter
    if (minDuration !== '') {
      const min = parseInt(minDuration);
      if (!isNaN(min)) data = data.filter(r => r.duration >= min);
    }
    if (maxDuration !== '') {
      const max = parseInt(maxDuration);
      if (!isNaN(max)) data = data.filter(r => r.duration <= max);
    }
    // sort
    data.sort((a, b) => {
      let va: any, vb: any;
      switch (resourceSortKey) {
        case 'member': va = a.member; vb = b.member; break;
        case 'project': va = a.project; vb = b.project; break;
        case 'plannedAssign': va = a.plannedAssign; vb = b.plannedAssign; break;
        case 'completeAssign': va = a.completeAssign; vb = b.completeAssign; break;
        case 'pctAssign': va = a.pctAssign; vb = b.pctAssign; break;
        case 'plannedBeing': va = a.plannedBeing; vb = b.plannedBeing; break;
        case 'completeBeing': va = a.completeBeing; vb = b.completeBeing; break;
        case 'pctBeing': va = a.pctBeing; vb = b.pctBeing; break;
        case 'duration': va = a.duration; vb = b.duration; break;
        default: va = a.member; vb = b.member;
      }
      if (typeof va === 'string') {
        return resourceSortAsc ? va.localeCompare(vb) : vb.localeCompare(va);
      }
      return resourceSortAsc ? va - vb : vb - va;
    });
    return data;
  }, [selectedWorkspaces, resourceSearch, minPct, maxPct, minDuration, maxDuration, resourceSortKey, resourceSortAsc]);

  const totalResourcePages = Math.ceil(filteredResource.length / resourceRowsPerPage);
  const paginatedResource = useMemo(() => {
    const start = (resourcePage - 1) * resourceRowsPerPage;
    return filteredResource.slice(start, start + resourceRowsPerPage);
  }, [filteredResource, resourcePage, resourceRowsPerPage]);

  const handleSort = (key: string) => {
    if (resourceSortKey === key) {
      setResourceSortAsc(!resourceSortAsc);
    } else {
      setResourceSortKey(key);
      setResourceSortAsc(true);
    }
    setResourcePage(1);
  };

  const sortIcon = (key: string) => {
    if (resourceSortKey === key) return resourceSortAsc ? ' ▲' : ' ▼';
    return ' ↕';
  };

  const clearAllFilters = () => {
    setSelectedWorkspaces([]);
    setResourceSearch('');
    setMinPct('');
    setMaxPct('');
    setMinDuration('');
    setMaxDuration('');
    setResourcePage(1);
  };

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
           {/* View Mode Toggle */}
           <View style={{ flexDirection: 'row', gap: 10, paddingHorizontal: 16, paddingVertical: 12 }}>
             <TouchableOpacity
               style={{ paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: resourceViewMode === 'Member' ? C.surface2 : 'transparent', borderWidth: resourceViewMode === 'Member' ? 1 : 0, borderColor: C.border }}
               onPress={() => { setResourceViewMode('Member'); setResourcePage(1); }}
             >
                <Text style={{ color: resourceViewMode === 'Member' ? C.text1 : C.text3, fontSize: 13, fontWeight: '600' }}>View by Member</Text>
             </TouchableOpacity>
             <TouchableOpacity
               style={{ paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: resourceViewMode === 'Project' ? C.surface2 : 'transparent', borderWidth: resourceViewMode === 'Project' ? 1 : 0, borderColor: C.border }}
               onPress={() => { setResourceViewMode('Project'); setResourcePage(1); }}
             >
                <Text style={{ color: resourceViewMode === 'Project' ? C.text1 : C.text3, fontSize: 13, fontWeight: '600' }}>View by Project</Text>
             </TouchableOpacity>
           </View>

           {/* Active filter indicator */}
           {(selectedWorkspaces.length > 0 || resourceSearch || minPct || maxPct || minDuration || maxDuration) && (
             <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 8, gap: 8, flexWrap: 'wrap' }}>
               <Ionicons name="filter" size={14} color={C.brand} />
               <Text style={{ color: C.brand, fontSize: 11, fontWeight: '600' }}>Filters active</Text>
               {selectedWorkspaces.map(ws => (
                 <TouchableOpacity key={ws} onPress={() => toggleWorkspace(ws)} style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: C.brandSoft, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12 }}>
                   <Text style={{ color: C.brand, fontSize: 10, fontWeight: '600' }}>{ws}</Text>
                   <Ionicons name="close" size={10} color={C.brand} />
                 </TouchableOpacity>
               ))}
               {resourceSearch ? (
                 <View style={{ backgroundColor: C.tealSoft, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12 }}>
                   <Text style={{ color: C.teal, fontSize: 10, fontWeight: '600' }}>Search: {resourceSearch}</Text>
                 </View>
               ) : null}
               <TouchableOpacity onPress={clearAllFilters} style={{ paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12, backgroundColor: C.slateSoft }}>
                 <Text style={{ color: C.red, fontSize: 10, fontWeight: '600' }}>Clear All</Text>
               </TouchableOpacity>
             </View>
           )}

           <View style={{ backgroundColor: C.surface, marginHorizontal: 16, borderRadius: 12, borderWidth: 1, borderColor: C.border, overflow: 'visible' }}>
             
             {/* Toolbar */}
             <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12, borderBottomWidth: 1, borderBottomColor: C.borderSoft }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, position: 'relative', zIndex: 20 }}>
                   <Text style={{ color: C.text2, fontSize: 12, fontWeight: '600' }}>Workspaces:</Text>
                   <TouchableOpacity
                     style={{ flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: C.bg, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: selectedWorkspaces.length > 0 ? C.brand : C.borderSoft }}
                     onPress={() => { setShowWorkspaceDropdown(!showWorkspaceDropdown); setShowMoreFilter(false); }}
                   >
                      <Text style={{ color: selectedWorkspaces.length > 0 ? C.brand : C.text3, fontSize: 12 }}>
                        {selectedWorkspaces.length > 0 ? `${selectedWorkspaces.length} selected` : 'All Workspaces'}
                      </Text>
                      <Ionicons name={showWorkspaceDropdown ? "chevron-up" : "chevron-down"} size={14} color={selectedWorkspaces.length > 0 ? C.brand : C.text3} />
                   </TouchableOpacity>

                   {/* Workspace Dropdown */}
                   {showWorkspaceDropdown && (
                     <View style={{ position: 'absolute', top: 36, left: 0, backgroundColor: C.surface, borderRadius: 12, borderWidth: 1, borderColor: C.border, zIndex: 999, width: 240, maxHeight: 320, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 8 }}>
                       <View style={{ padding: 12, borderBottomWidth: 1, borderBottomColor: C.borderSoft }}>
                         <Text style={{ color: C.text1, fontSize: 13, fontWeight: 'bold', marginBottom: 8 }}>Select Workspaces</Text>
                         <TouchableOpacity
                           onPress={() => { setSelectedWorkspaces([]); setResourcePage(1); }}
                           style={{ paddingVertical: 6 }}
                         >
                           <Text style={{ color: C.brand, fontSize: 12, fontWeight: '600' }}>Show All</Text>
                         </TouchableOpacity>
                       </View>
                       <ScrollView style={{ maxHeight: 220 }} nestedScrollEnabled>
                         {/* Unassigned option */}
                         <TouchableOpacity
                           onPress={() => toggleWorkspace('Unassigned')}
                           style={{ flexDirection: 'row', alignItems: 'center', padding: 12, gap: 10, borderBottomWidth: 1, borderBottomColor: C.borderSoft }}
                         >
                           <View style={{ width: 20, height: 20, borderRadius: 4, borderWidth: 1.5, borderColor: selectedWorkspaces.includes('Unassigned') ? C.brand : C.text3, backgroundColor: selectedWorkspaces.includes('Unassigned') ? C.brand : 'transparent', alignItems: 'center', justifyContent: 'center' }}>
                             {selectedWorkspaces.includes('Unassigned') && <Ionicons name="checkmark" size={14} color={C.bg} />}
                           </View>
                           <Text style={{ color: C.text2, fontSize: 12 }}>Unassigned (-)</Text>
                         </TouchableOpacity>
                         {ALL_WORKSPACES.map(ws => (
                           <TouchableOpacity
                             key={ws}
                             onPress={() => toggleWorkspace(ws)}
                             style={{ flexDirection: 'row', alignItems: 'center', padding: 12, gap: 10, borderBottomWidth: 1, borderBottomColor: C.borderSoft }}
                           >
                             <View style={{ width: 20, height: 20, borderRadius: 4, borderWidth: 1.5, borderColor: selectedWorkspaces.includes(ws) ? C.brand : C.text3, backgroundColor: selectedWorkspaces.includes(ws) ? C.brand : 'transparent', alignItems: 'center', justifyContent: 'center' }}>
                               {selectedWorkspaces.includes(ws) && <Ionicons name="checkmark" size={14} color={C.bg} />}
                             </View>
                             <Text style={{ color: C.text2, fontSize: 12 }}>{ws}</Text>
                           </TouchableOpacity>
                         ))}
                       </ScrollView>
                       <TouchableOpacity
                         onPress={() => setShowWorkspaceDropdown(false)}
                         style={{ padding: 12, borderTopWidth: 1, borderTopColor: C.borderSoft, alignItems: 'center' }}
                       >
                         <Text style={{ color: C.brand, fontSize: 12, fontWeight: 'bold' }}>Done</Text>
                       </TouchableOpacity>
                     </View>
                   )}
                </View>
                <TouchableOpacity
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}
                  onPress={() => { setShowMoreFilter(!showMoreFilter); setShowWorkspaceDropdown(false); }}
                >
                   <Ionicons name="options-outline" size={14} color={showMoreFilter ? C.brand : C.text1} />
                   <Text style={{ color: showMoreFilter ? C.brand : C.text1, fontSize: 12, fontWeight: '600' }}>More Filter</Text>
                   <Ionicons name={showMoreFilter ? "chevron-up" : "chevron-down"} size={14} color={showMoreFilter ? C.brand : C.text1} />
                </TouchableOpacity>
             </View>

             {/* More Filter Panel */}
             {showMoreFilter && (
               <View style={{ padding: 12, borderBottomWidth: 1, borderBottomColor: C.borderSoft, backgroundColor: C.surface2, gap: 12 }}>
                 {/* Search */}
                 <View>
                   <Text style={{ color: C.text2, fontSize: 11, fontWeight: '600', marginBottom: 6 }}>Search Member / Project</Text>
                   <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: C.bg, borderRadius: 8, borderWidth: 1, borderColor: C.borderSoft, paddingHorizontal: 10, height: 36 }}>
                     <Ionicons name="search" size={14} color={C.text3} style={{ marginRight: 8 }} />
                     <TextInput
                       value={resourceSearch}
                       onChangeText={(t) => { setResourceSearch(t); setResourcePage(1); }}
                       placeholder="Cari nama member atau project..."
                       placeholderTextColor={C.text3}
                       style={{ flex: 1, color: C.text1, fontSize: 12 }}
                     />
                     {resourceSearch ? (
                       <TouchableOpacity onPress={() => { setResourceSearch(''); setResourcePage(1); }}>
                         <Ionicons name="close-circle" size={16} color={C.text3} />
                       </TouchableOpacity>
                     ) : null}
                   </View>
                 </View>

                 {/* Percentage & Duration filters in row */}
                 <View style={{ flexDirection: 'row', gap: 12 }}>
                   {/* Completion % */}
                   <View style={{ flex: 1 }}>
                     <Text style={{ color: C.text2, fontSize: 11, fontWeight: '600', marginBottom: 6 }}>Completion %</Text>
                     <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                       <View style={{ flex: 1, backgroundColor: C.bg, borderRadius: 8, borderWidth: 1, borderColor: C.borderSoft, paddingHorizontal: 8, height: 32, justifyContent: 'center' }}>
                         <TextInput
                           value={minPct}
                           onChangeText={(t) => { setMinPct(t.replace(/[^0-9]/g, '')); setResourcePage(1); }}
                           placeholder="Min"
                           placeholderTextColor={C.text3}
                           keyboardType="numeric"
                           style={{ color: C.text1, fontSize: 11 }}
                         />
                       </View>
                       <Text style={{ color: C.text3, fontSize: 11 }}>–</Text>
                       <View style={{ flex: 1, backgroundColor: C.bg, borderRadius: 8, borderWidth: 1, borderColor: C.borderSoft, paddingHorizontal: 8, height: 32, justifyContent: 'center' }}>
                         <TextInput
                           value={maxPct}
                           onChangeText={(t) => { setMaxPct(t.replace(/[^0-9]/g, '')); setResourcePage(1); }}
                           placeholder="Max"
                           placeholderTextColor={C.text3}
                           keyboardType="numeric"
                           style={{ color: C.text1, fontSize: 11 }}
                         />
                       </View>
                     </View>
                   </View>

                   {/* Duration */}
                   <View style={{ flex: 1 }}>
                     <Text style={{ color: C.text2, fontSize: 11, fontWeight: '600', marginBottom: 6 }}>Duration (min)</Text>
                     <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                       <View style={{ flex: 1, backgroundColor: C.bg, borderRadius: 8, borderWidth: 1, borderColor: C.borderSoft, paddingHorizontal: 8, height: 32, justifyContent: 'center' }}>
                         <TextInput
                           value={minDuration}
                           onChangeText={(t) => { setMinDuration(t.replace(/[^0-9]/g, '')); setResourcePage(1); }}
                           placeholder="Min"
                           placeholderTextColor={C.text3}
                           keyboardType="numeric"
                           style={{ color: C.text1, fontSize: 11 }}
                         />
                       </View>
                       <Text style={{ color: C.text3, fontSize: 11 }}>–</Text>
                       <View style={{ flex: 1, backgroundColor: C.bg, borderRadius: 8, borderWidth: 1, borderColor: C.borderSoft, paddingHorizontal: 8, height: 32, justifyContent: 'center' }}>
                         <TextInput
                           value={maxDuration}
                           onChangeText={(t) => { setMaxDuration(t.replace(/[^0-9]/g, '')); setResourcePage(1); }}
                           placeholder="Max"
                           placeholderTextColor={C.text3}
                           keyboardType="numeric"
                           style={{ color: C.text1, fontSize: 11 }}
                         />
                       </View>
                     </View>
                   </View>
                 </View>

                 {/* Clear button */}
                 <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8 }}>
                   <TouchableOpacity onPress={clearAllFilters} style={{ flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, backgroundColor: C.slateSoft }}>
                     <Ionicons name="trash-outline" size={12} color={C.red} />
                     <Text style={{ color: C.red, fontSize: 11, fontWeight: '600' }}>Clear All</Text>
                   </TouchableOpacity>
                   <TouchableOpacity onPress={() => setShowMoreFilter(false)} style={{ flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, backgroundColor: C.brandSoft }}>
                     <Ionicons name="checkmark" size={12} color={C.brand} />
                     <Text style={{ color: C.brand, fontSize: 11, fontWeight: '600' }}>Apply</Text>
                   </TouchableOpacity>
                 </View>
               </View>
             )}

             {/* VIEW BY MEMBER: Table with sorting */}
             {resourceViewMode === 'Member' && (
               <>
               {/* Table container horizontally scrollable */}
               <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View>
                  {/* Table Header - Sortable */}
                  <View style={{ flexDirection: 'row', padding: 12, borderBottomWidth: 1, borderColor: C.borderSoft }}>
                     <TouchableOpacity onPress={() => handleSort('member')} style={{ width: 170 }}>
                       <Text style={{ color: C.text1, fontWeight: 'bold', fontSize: 12 }}>Member{sortIcon('member')}</Text>
                     </TouchableOpacity>
                     <TouchableOpacity onPress={() => handleSort('project')} style={{ width: 100 }}>
                       <Text style={{ color: C.text1, fontWeight: 'bold', fontSize: 12 }}>Project{sortIcon('project')}</Text>
                     </TouchableOpacity>
                     
                     <View style={{ width: 270 }}>
                        <Text style={{ color: C.text1, fontWeight: 'bold', fontSize: 12, textAlign: 'center', marginBottom: 8 }}>Assigning Task</Text>
                        <View style={{ flexDirection: 'row' }}>
                           <TouchableOpacity onPress={() => handleSort('plannedAssign')} style={{ flex: 1 }}>
                             <Text style={{ color: C.text1, fontSize: 11, textAlign: 'center' }}>Planned{sortIcon('plannedAssign')}</Text>
                           </TouchableOpacity>
                           <TouchableOpacity onPress={() => handleSort('completeAssign')} style={{ flex: 1 }}>
                             <Text style={{ color: C.text1, fontSize: 11, textAlign: 'center' }}>Complete{sortIcon('completeAssign')}</Text>
                           </TouchableOpacity>
                           <TouchableOpacity onPress={() => handleSort('pctAssign')} style={{ flex: 1 }}>
                             <Text style={{ color: C.text1, fontSize: 11, textAlign: 'center' }}>%{sortIcon('pctAssign')}</Text>
                           </TouchableOpacity>
                        </View>
                     </View>
                     
                     <View style={{ width: 270 }}>
                        <Text style={{ color: C.text1, fontWeight: 'bold', fontSize: 12, textAlign: 'center', marginBottom: 8 }}>Being Assigned</Text>
                        <View style={{ flexDirection: 'row' }}>
                           <TouchableOpacity onPress={() => handleSort('plannedBeing')} style={{ flex: 1 }}>
                             <Text style={{ color: C.text1, fontSize: 11, textAlign: 'center' }}>Planned{sortIcon('plannedBeing')}</Text>
                           </TouchableOpacity>
                           <TouchableOpacity onPress={() => handleSort('completeBeing')} style={{ flex: 1 }}>
                             <Text style={{ color: C.text1, fontSize: 11, textAlign: 'center' }}>Complete{sortIcon('completeBeing')}</Text>
                           </TouchableOpacity>
                           <TouchableOpacity onPress={() => handleSort('pctBeing')} style={{ flex: 1 }}>
                             <Text style={{ color: C.text1, fontSize: 11, textAlign: 'center' }}>%{sortIcon('pctBeing')}</Text>
                           </TouchableOpacity>
                        </View>
                     </View>

                     <TouchableOpacity onPress={() => handleSort('duration')} style={{ width: 110 }}>
                       <Text style={{ color: C.text1, fontWeight: 'bold', fontSize: 12, textAlign: 'right' }}>Duration{sortIcon('duration')}</Text>
                     </TouchableOpacity>
                  </View>

                  {/* Table Rows */}
                  {paginatedResource.length === 0 ? (
                    <View style={{ padding: 24, alignItems: 'center' }}>
                      <Ionicons name="search-outline" size={32} color={C.text3} />
                      <Text style={{ color: C.text3, fontSize: 13, marginTop: 8 }}>No results found</Text>
                      <TouchableOpacity onPress={clearAllFilters} style={{ marginTop: 8 }}>
                        <Text style={{ color: C.brand, fontSize: 12, fontWeight: '600' }}>Clear Filters</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                  paginatedResource.map((row, i) => (
                     <View key={row.id} style={{ flexDirection: 'row', padding: 12, borderBottomWidth: 1, borderColor: C.borderSoft, alignItems: 'center', backgroundColor: i % 2 === 0 ? 'transparent' : C.surface2 + '40' }}>
                        <View style={{ width: 170, flexDirection: 'row', alignItems: 'center' }}>
                           <Ionicons name="chevron-down" size={14} color={C.text3} style={{ marginRight: 8 }} />
                           <Text style={{ color: C.text2, fontSize: 11 }}>{row.member}</Text>
                        </View>
                        <Text style={{ width: 100, color: row.project === '-' ? C.text3 : C.brand, fontSize: 11, fontWeight: row.project === '-' ? '400' : '600' }}>{row.project}</Text>
                        
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
                  )))}
                </View>
              </ScrollView>
              </>
             )}

             {/* VIEW BY PROJECT: Grouped cards */}
             {resourceViewMode === 'Project' && (
               <ScrollView style={{ maxHeight: 500 }} nestedScrollEnabled>
                 {Object.entries(groupedByProject)
                   .filter(([projName]) => {
                     if (selectedWorkspaces.length === 0) return true;
                     return selectedWorkspaces.includes(projName) || (selectedWorkspaces.includes('Unassigned') && projName === 'Unassigned');
                   })
                   .map(([projName, members]) => {
                     // Apply search filter
                     let filtered = members;
                     if (resourceSearch.trim()) {
                       const q = resourceSearch.toLowerCase();
                       filtered = filtered.filter(r => r.member.toLowerCase().includes(q));
                     }
                     if (filtered.length === 0) return null;

                     const totalPlanned = filtered.reduce((s, m) => s + m.plannedAssign, 0);
                     const totalComplete = filtered.reduce((s, m) => s + m.completeAssign, 0);
                     const avgPct = filtered.length > 0 ? Math.round(filtered.reduce((s, m) => s + m.pctAssign, 0) / filtered.length) : 0;
                     const totalDuration = filtered.reduce((s, m) => s + m.duration, 0);

                     return (
                       <View key={projName} style={{ borderBottomWidth: 1, borderBottomColor: C.borderSoft }}>
                         {/* Project Header */}
                         <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12, backgroundColor: C.surface2 }}>
                           <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                             <Ionicons name="folder-outline" size={16} color={projName === 'Unassigned' ? C.text3 : C.brand} />
                             <Text style={{ color: C.text1, fontSize: 13, fontWeight: 'bold' }}>{projName}</Text>
                             <View style={{ backgroundColor: C.brandSoft, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 }}>
                               <Text style={{ color: C.brand, fontSize: 10, fontWeight: 'bold' }}>{filtered.length} members</Text>
                             </View>
                           </View>
                           <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                             <View style={{ alignItems: 'center' }}>
                               <Text style={{ color: C.text3, fontSize: 9 }}>Planned</Text>
                               <Text style={{ color: C.text1, fontSize: 12, fontWeight: 'bold' }}>{totalPlanned}</Text>
                             </View>
                             <View style={{ alignItems: 'center' }}>
                               <Text style={{ color: C.text3, fontSize: 9 }}>Complete</Text>
                               <Text style={{ color: C.green, fontSize: 12, fontWeight: 'bold' }}>{totalComplete}</Text>
                             </View>
                             <View style={{ alignItems: 'center' }}>
                               <Text style={{ color: C.text3, fontSize: 9 }}>Avg %</Text>
                               <Text style={{ color: getBarColor(avgPct, C), fontSize: 12, fontWeight: 'bold' }}>{avgPct}%</Text>
                             </View>
                             <View style={{ alignItems: 'center' }}>
                               <Text style={{ color: C.text3, fontSize: 9 }}>Duration</Text>
                               <Text style={{ color: C.text2, fontSize: 12, fontWeight: 'bold' }}>{totalDuration} min</Text>
                             </View>
                           </View>
                         </View>
                         {/* Members under this project */}
                         {filtered.map((m, mi) => (
                           <View key={m.id} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 16, paddingLeft: 36, borderBottomWidth: mi < filtered.length - 1 ? 1 : 0, borderBottomColor: C.borderSoft + '60' }}>
                             <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: C.brandSoft, alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
                               <Text style={{ color: C.brand, fontSize: 11, fontWeight: 'bold' }}>{m.member.charAt(0)}</Text>
                             </View>
                             <View style={{ flex: 1 }}>
                               <Text style={{ color: C.text2, fontSize: 11, fontWeight: '500' }}>{m.member}</Text>
                             </View>
                             <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                               <View style={{ width: 50, alignItems: 'center' }}>
                                 <View style={{ width: 40, height: 3, backgroundColor: C.borderSoft, borderRadius: 2 }}>
                                   <View style={{ width: `${m.pctAssign}%`, height: '100%', backgroundColor: getBarColor(m.pctAssign, C), borderRadius: 2 }} />
                                 </View>
                                 <Text style={{ color: C.text3, fontSize: 9, marginTop: 2 }}>{m.pctAssign}%</Text>
                               </View>
                               <Text style={{ color: C.text3, fontSize: 10, width: 60, textAlign: 'right' }}>{m.duration} min</Text>
                             </View>
                           </View>
                         ))}
                       </View>
                     );
                   })}
               </ScrollView>
             )}

             {/* Table Footer with working pagination (only in Member view) */}
             {resourceViewMode === 'Member' && (
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12, backgroundColor: C.surface }}>
                 <Text style={{ color: C.text3, fontSize: 11 }}>
                   {filteredResource.length === 0 ? 'No results' : `Showing ${((resourcePage - 1) * resourceRowsPerPage) + 1} to ${Math.min(resourcePage * resourceRowsPerPage, filteredResource.length)} of ${filteredResource.length} results`}
                 </Text>
                 <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, position: 'relative' }}>
                       <Text style={{ color: C.text3, fontSize: 11 }}>Rows per page</Text>
                       <TouchableOpacity
                          style={{ flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, borderWidth: 1, borderColor: C.borderSoft }}
                          onPress={() => setShowRowsMenu(!showRowsMenu)}
                       >
                          <Text style={{ color: C.text2, fontSize: 11 }}>{resourceRowsPerPage}</Text>
                          <Ionicons name="chevron-down" size={10} color={C.text3} />
                       </TouchableOpacity>
                       {showRowsMenu && (
                          <View style={{ position: 'absolute', bottom: 28, right: 0, backgroundColor: C.surface2, borderRadius: 8, borderWidth: 1, borderColor: C.border, zIndex: 100, minWidth: 60 }}>
                             {[10, 25, 50].map(n => (
                                <TouchableOpacity
                                   key={n}
                                   style={{ paddingHorizontal: 12, paddingVertical: 8, backgroundColor: resourceRowsPerPage === n ? C.surface3 : 'transparent' }}
                                   onPress={() => { setResourceRowsPerPage(n); setResourcePage(1); setShowRowsMenu(false); }}
                                >
                                   <Text style={{ color: C.text2, fontSize: 11 }}>{n}</Text>
                                </TouchableOpacity>
                             ))}
                          </View>
                       )}
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                       <TouchableOpacity style={{ padding: 4, opacity: resourcePage === 1 ? 0.3 : 1 }} disabled={resourcePage === 1} onPress={() => setResourcePage(1)}><Ionicons name="chevron-back-circle-outline" size={16} color={C.text3} /></TouchableOpacity>
                       <TouchableOpacity style={{ padding: 4, opacity: resourcePage === 1 ? 0.3 : 1 }} disabled={resourcePage === 1} onPress={() => setResourcePage(p => Math.max(1, p - 1))}><Ionicons name="chevron-back" size={14} color={C.text2} /></TouchableOpacity>
                       <Text style={{ color: C.text2, fontSize: 11, marginHorizontal: 4 }}>Page {resourcePage} of {totalResourcePages || 1}</Text>
                       <TouchableOpacity style={{ padding: 4, opacity: resourcePage >= totalResourcePages ? 0.3 : 1 }} disabled={resourcePage >= totalResourcePages} onPress={() => setResourcePage(p => Math.min(totalResourcePages, p + 1))}><Ionicons name="chevron-forward" size={14} color={C.text2} /></TouchableOpacity>
                       <TouchableOpacity style={{ padding: 4, opacity: resourcePage >= totalResourcePages ? 0.3 : 1 }} disabled={resourcePage >= totalResourcePages} onPress={() => setResourcePage(totalResourcePages)}><Ionicons name="chevron-forward-circle-outline" size={16} color={C.text2} /></TouchableOpacity>
                    </View>
                 </View>
              </View>
             )}

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
