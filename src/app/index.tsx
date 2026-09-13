import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Animated, Easing, Image } from "react-native";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useAppTheme } from "../store/themeStore";
import { Spacing, FontSize, Radius } from "../constants/theme";

const TAGLINE = "Kelola tugasmu, satu per satu.";
const TOTAL_DURATION = 2000; // 2 detik sesuai spesifikasi

export default function AnimatedSplashScreen() {
  const { colors } = useAppTheme();

  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.7)).current;
  const progressWidth = useRef(new Animated.Value(0)).current;
  const [typedText, setTypedText] = useState("");

  useEffect(() => {
    // Animasi fade-in + scale-up logo
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 5,
        tension: 60,
        useNativeDriver: true,
      }),
    ]).start();

    // Animasi progress bar loading monochrome
    Animated.timing(progressWidth, {
      toValue: 100,
      duration: TOTAL_DURATION,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();

    // Efek typewriter untuk tagline
    let index = 0;
    const typeInterval = setInterval(() => {
      index += 1;
      setTypedText(TAGLINE.slice(0, index));
      if (index >= TAGLINE.length) clearInterval(typeInterval);
    }, TOTAL_DURATION / (TAGLINE.length * 1.5));

    // Auto redirect ke Login setelah durasi selesai
    const redirectTimer = setTimeout(() => {
      router.replace("/login" as any);
    }, TOTAL_DURATION + 300);

    return () => {
      clearInterval(typeInterval);
      clearTimeout(redirectTimer);
    };
  }, []);

  const widthInterpolated = progressWidth.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.center}>
        <Animated.View
          style={[
            styles.logoBox,
            {
              borderColor: colors.text,
              opacity: logoOpacity,
              transform: [{ scale: logoScale }],
            },
          ]}
        >
          <Image 
            source={require("../../assets/images/task.png")} 
            style={{ width: 64, height: 64 }} 
            resizeMode="contain" 
          />
        </Animated.View>

        <Animated.Text
          style={[styles.appName, { color: colors.text, opacity: logoOpacity }]}
        >
          <Text style={{ color: "#10B981" }}>Task</Text>Flow
        </Animated.Text>

        <Text style={[styles.tagline, { color: colors.textSecondary }]}>
          {typedText}
          <Text style={{ opacity: typedText.length < TAGLINE.length ? 1 : 0 }}>
            |
          </Text>
        </Text>
      </View>

      <View style={styles.progressSection}>
        <View style={[styles.progressTrack, { backgroundColor: colors.border }]}>
          <Animated.View
            style={[
              styles.progressFill,
              { width: widthInterpolated, backgroundColor: colors.text },
            ]}
          />
        </View>
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
          Memuat task kamu...
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingVertical: Spacing.xxl,
    paddingHorizontal: Spacing.xl,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logoBox: {
    width: 96,
    height: 96,
    borderRadius: Radius.lg,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.lg,
  },
  appName: {
    fontSize: FontSize.xxl,
    fontWeight: "800",
    letterSpacing: 1,
    marginBottom: Spacing.sm,
  },
  tagline: {
    fontSize: FontSize.sm,
    minHeight: 20,
  },
  progressSection: {
    alignItems: "center",
    gap: Spacing.sm,
  },
  progressTrack: {
    width: "70%",
    height: 4,
    borderRadius: Radius.full,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: Radius.full,
  },
  loadingText: {
    fontSize: FontSize.xs,
  },
});
