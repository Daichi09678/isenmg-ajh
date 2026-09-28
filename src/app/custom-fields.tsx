import React, { useState } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  TextInput,
  Modal,
  FlatList,
  Switch,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAppTheme } from "../store/themeStore";

interface CustomField {
  id: string;
  name: string;
  type: string;
  isActive: boolean;
  showOnCard: boolean;
}

export default function CustomFieldsScreen() {
  const { colors } = useAppTheme();

  const COLORS = React.useMemo(() => ({
    bg: colors.background,
    card: colors.surface,
    border: colors.border,
    text: colors.text,
    textMuted: colors.textSecondary,
    primary: "#10b981", // Emerald green based on the "+ Add Field" image
    primaryDark: "#059669",
    saveBtn: "#0369a1", // Dark blue from the "Save" button image
    danger: "#ef4444",
    white: "#ffffff",
    lightGray: "rgba(0,0,0,0.04)",
  }), [colors]);

  const s = React.useMemo(() => getStyles(COLORS), [COLORS]);

  const [fields, setFields] = useState<CustomField[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [addModalVisible, setAddModalVisible] = useState(false);
  
  // Add Field Form State
  const [fieldName, setFieldName] = useState("");
  const [fieldType, setFieldType] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [showOnCard, setShowOnCard] = useState(false);

  // Field Type Dropdown Modal State
  const [typeDropdownVisible, setTypeDropdownVisible] = useState(false);
  const fieldTypes = ["Text", "Number", "Date", "Dropdown", "Checkbox"];

  const filteredFields = fields.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const resetForm = () => {
    setFieldName("");
    setFieldType("");
    setIsActive(true);
    setShowOnCard(false);
  };

  const handleSave = () => {
    if (!fieldName.trim() || !fieldType) return;
    const newField: CustomField = {
      id: Date.now().toString(),
      name: fieldName.trim(),
      type: fieldType,
      isActive,
      showOnCard,
    };
    setFields([...fields, newField]);
    resetForm();
    setAddModalVisible(false);
  };

  return (
    <SafeAreaView style={s.safe} edges={["top"]}>
      {/* HEADER */}
      <View style={s.header}>
        <Text style={s.headerTitle}>Custom Fields</Text>
        <TouchableOpacity onPress={() => router.back()} style={s.closeBtn}>
          <Ionicons name="close" size={24} color={COLORS.textMuted} />
        </TouchableOpacity>
      </View>

      <View style={s.content}>
        {/* TOP CONTROLS */}
        <View style={s.controlsRow}>
          <TouchableOpacity style={s.addBtn} onPress={() => setAddModalVisible(true)}>
            <Ionicons name="add" size={20} color={COLORS.white} />
            <Text style={s.addBtnText}>Add Field</Text>
          </TouchableOpacity>
          
          <View style={s.searchContainer}>
            <Ionicons name="search" size={18} color={COLORS.textMuted} style={s.searchIcon} />
            <TextInput
              style={s.searchInput}
              placeholder="Keyword Search"
              placeholderTextColor={COLORS.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* LIST HEADER */}
        <View style={s.listHeaderRow}>
          <Text style={[s.listHeaderCol, { flex: 2 }]}>Field Name</Text>
          <Text style={[s.listHeaderCol, { flex: 1 }]}>Field Type</Text>
          <Text style={[s.listHeaderCol, { width: 60, textAlign: 'center' }]}>Active</Text>
        </View>

        {/* LIST */}
        <FlatList
          data={filteredFields}
          keyExtractor={item => item.id}
          contentContainerStyle={fields.length === 0 ? s.listEmptyContainer : s.listContainer}
          ListEmptyComponent={() => (
            <View style={s.emptyState}>
              <Ionicons name="albums-outline" size={48} color={COLORS.border} />
              <Text style={s.emptyStateText}>No custom fields found.</Text>
            </View>
          )}
          renderItem={({ item }) => (
            <View style={s.listItem}>
              <Text style={[s.listItemText, { flex: 2, fontWeight: "600" }]} numberOfLines={1}>{item.name}</Text>
              <View style={[s.listItemBadge, { flex: 1 }]}>
                <Text style={s.listItemBadgeText} numberOfLines={1}>{item.type}</Text>
              </View>
              <View style={{ width: 60, alignItems: 'center' }}>
                <Ionicons name={item.isActive ? "checkmark-circle" : "close-circle"} size={22} color={item.isActive ? COLORS.primary : COLORS.textMuted} />
              </View>
            </View>
          )}
        />
      </View>

      {/* FOOTER */}
      <View style={s.footer}>
        <TouchableOpacity style={s.closeFooterBtn} onPress={() => router.back()}>
          <Text style={s.closeFooterBtnText}>Close</Text>
        </TouchableOpacity>
      </View>

      {/* ADD MODAL (BOTTOM SHEET STYLE) */}
      <Modal visible={addModalVisible} animationType="slide" transparent>
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={s.modalOverlay}
        >
          <View style={s.modalSheet}>
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>Add Custom Field</Text>
              <TouchableOpacity onPress={() => { setAddModalVisible(false); resetForm(); }} style={s.modalCloseBtn}>
                <Ionicons name="close" size={24} color={COLORS.textMuted} />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={s.modalContent} showsVerticalScrollIndicator={false}>
              
              <View style={s.formGroup}>
                <Text style={s.label}>Field Name</Text>
                <TextInput
                  style={s.input}
                  placeholder="Enter field name..."
                  placeholderTextColor={COLORS.textMuted}
                  value={fieldName}
                  onChangeText={setFieldName}
                />
              </View>

              <View style={s.formGroup}>
                <Text style={s.label}>Field Type</Text>
                <TouchableOpacity style={s.dropdown} onPress={() => setTypeDropdownVisible(true)}>
                  <Text style={fieldType ? s.dropdownText : s.dropdownTextMuted}>
                    {fieldType || "Select a Type"}
                  </Text>
                  <Ionicons name="chevron-down" size={18} color={COLORS.textMuted} />
                </TouchableOpacity>
              </View>

              <View style={s.switchGroupContainer}>
                <View style={s.switchRow}>
                  <Switch
                    value={isActive}
                    onValueChange={setIsActive}
                    trackColor={{ false: COLORS.border, true: COLORS.primary }}
                    thumbColor="#ffffff"
                  />
                  <Text style={s.switchLabel}>Is Active</Text>
                </View>

                <View style={s.switchRow}>
                  <Switch
                    value={showOnCard}
                    onValueChange={setShowOnCard}
                    trackColor={{ false: COLORS.border, true: COLORS.primary }}
                    thumbColor="#ffffff"
                  />
                  <Text style={s.switchLabel}>Show on Card</Text>
                </View>
              </View>

            </ScrollView>

            <View style={s.modalFooter}>
              <TouchableOpacity style={s.modalBtnOutline} onPress={() => { setAddModalVisible(false); resetForm(); }}>
                <Ionicons name="close" size={16} color={COLORS.text} style={{marginRight: 6}} />
                <Text style={s.modalBtnOutlineText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[s.modalBtnPrimary, (!fieldName.trim() || !fieldType) && s.modalBtnDisabled]} 
                onPress={handleSave}
                disabled={!fieldName.trim() || !fieldType}
              >
                <Ionicons name="save-outline" size={16} color={COLORS.white} style={{marginRight: 6}} />
                <Text style={s.modalBtnPrimaryText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* TYPE DROPDOWN MODAL */}
      <Modal visible={typeDropdownVisible} animationType="fade" transparent>
        <TouchableOpacity style={s.dropdownOverlay} activeOpacity={1} onPress={() => setTypeDropdownVisible(false)}>
          <View style={s.dropdownMenu}>
            <Text style={s.dropdownHeader}>Select Field Type</Text>
            {fieldTypes.map((type) => (
              <TouchableOpacity 
                key={type} 
                style={s.dropdownItem} 
                onPress={() => { setFieldType(type); setTypeDropdownVisible(false); }}
              >
                <Text style={[s.dropdownItemText, fieldType === type && { color: COLORS.primary, fontWeight: 'bold' }]}>{type}</Text>
                {fieldType === type && <Ionicons name="checkmark" size={18} color={COLORS.primary} />}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

    </SafeAreaView>
  );
}

const getStyles = (COLORS: any) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  header: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center", 
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.card,
  },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: COLORS.text },
  closeBtn: { 
    padding: 6, 
    borderRadius: 20, 
    borderWidth: 1, 
    borderColor: COLORS.border,
    backgroundColor: COLORS.bg,
  },
  content: { 
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  controlsRow: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
    alignItems: "center",
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    gap: 6,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  addBtnText: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: 14,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    height: 44,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
  },
  listHeaderRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.card,
  },
  listHeaderCol: {
    fontSize: 12,
    fontWeight: "bold",
    color: COLORS.textMuted,
    textTransform: "uppercase",
  },
  listContainer: {
    paddingBottom: 20,
  },
  listEmptyContainer: {
    flex: 1,
    justifyContent: "center",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    gap: 16,
  },
  emptyStateText: {
    fontSize: 15,
    color: COLORS.textMuted,
    fontWeight: "500",
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.card,
  },
  listItemText: {
    fontSize: 14,
    color: COLORS.text,
  },
  listItemBadge: {
    alignItems: 'flex-start'
  },
  listItemBadgeText: {
    backgroundColor: COLORS.lightGray,
    color: COLORS.textMuted,
    fontSize: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    overflow: 'hidden',
    fontWeight: "500",
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.card,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
    alignItems: "flex-end",
  },
  closeFooterBtn: {
    backgroundColor: COLORS.bg,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  closeFooterBtnText: {
    color: COLORS.text,
    fontWeight: "bold",
    fontSize: 14,
  },
  // Add Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "85%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.text,
  },
  modalCloseBtn: {
    padding: 4,
  },
  modalContent: {
    padding: 24,
    gap: 20,
  },
  formGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.text,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    backgroundColor: COLORS.bg,
    height: 48,
    paddingHorizontal: 16,
    fontSize: 15,
    color: COLORS.text,
  },
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    backgroundColor: COLORS.bg,
    height: 48,
    paddingHorizontal: 16,
  },
  dropdownText: {
    fontSize: 15,
    color: COLORS.text,
  },
  dropdownTextMuted: {
    fontSize: 15,
    color: COLORS.textMuted,
  },
  switchGroupContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  switchLabel: {
    fontSize: 15,
    fontWeight: "500",
    color: COLORS.text,
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.card,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  modalBtnOutline: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.bg,
  },
  modalBtnOutlineText: {
    color: COLORS.text,
    fontWeight: "bold",
    fontSize: 15,
  },
  modalBtnPrimary: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: COLORS.saveBtn,
  },
  modalBtnDisabled: {
    backgroundColor: COLORS.border,
  },
  modalBtnPrimaryText: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: 15,
  },
  // Dropdown Modal
  dropdownOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  dropdownMenu: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    width: "80%",
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  dropdownHeader: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  dropdownItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  dropdownItemText: {
    fontSize: 15,
    color: COLORS.text,
  },
});
