import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../store/themeStore';

type CustomModalProps = {
  visible: boolean;
  type?: 'success' | 'error' | 'info';
  title: string;
  message: string;
  onClose: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
};

export default function CustomModal({ 
  visible, 
  type = 'info', 
  title, 
  message, 
  onClose, 
  onConfirm,
  confirmText = "Ya, Lanjutkan",
  cancelText = "Batal"
}: CustomModalProps) {
  const { colors } = useAppTheme();

  const getIcon = () => {
    switch(type) {
      case 'success': return 'checkmark-circle';
      case 'error': return 'close-circle';
      case 'info': return 'information-circle';
      default: return 'information-circle';
    }
  };

  const getColor = () => {
    switch(type) {
      case 'success': return '#10b981';
      case 'error': return '#ef4444';
      case 'info': return '#3b82f6';
      default: return '#3b82f6';
    }
  };

  const color = getColor();

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: colors.surface }]}>
          <View style={styles.iconContainer}>
            <Ionicons name={getIcon()} size={64} color={color} />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
          <Text style={[styles.message, { color: colors.textSecondary }]}>{message}</Text>
          
          {onConfirm ? (
            <View style={styles.btnRow}>
               <TouchableOpacity style={[styles.btnOutline, { borderColor: colors.border }]} onPress={onClose}>
                 <Text style={[styles.btnTextOutline, { color: colors.textSecondary }]}>{cancelText}</Text>
               </TouchableOpacity>
               <TouchableOpacity style={[styles.btn, { backgroundColor: color }]} onPress={onConfirm}>
                 <Text style={styles.btnText}>{confirmText}</Text>
               </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={[styles.btnFull, { backgroundColor: color }]} onPress={onClose}>
              <Text style={styles.btnText}>OK</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  container: {
    width: "100%",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center"
  },
  message: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },
  btnRow: {
    flexDirection: "row",
    gap: 12,
    width: "100%"
  },
  btnOutline: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
  },
  btnTextOutline: {
    fontSize: 16,
    fontWeight: "bold",
  },
  btn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  btnFull: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  }
});
