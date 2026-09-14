import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { FilterType } from "../types/task";
import { useAppTheme } from "../store/themeStore";
import { Spacing, Radius, FontSize } from "../constants/theme";

interface FilterTabsProps {
  active: FilterType;
  onChange: (filter: FilterType) => void;
}

const TABS: FilterType[] = ["All", "Active", "Completed"];

export default function FilterTabs({ active, onChange }: FilterTabsProps) {
  const { colors } = useAppTheme();

  return (
    <View style={styles.container}>
      {TABS.map((tab) => {
        const isActive = active === tab;
        return (
          <Pressable
            key={tab}
            onPress={() => onChange(tab)}
            style={[
              styles.tab,
              {
                backgroundColor: isActive ? colors.text : "transparent",
                borderColor: isActive ? colors.text : colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.tabText,
                { color: isActive ? colors.background : colors.textSecondary },
              ]}
            >
              {tab}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  tabText: {
    fontSize: FontSize.sm,
    fontWeight: "700",
  },
});
