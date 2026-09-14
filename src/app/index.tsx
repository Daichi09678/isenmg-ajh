import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Animated, Easing, Image } from "react-native";
import { router } from "expo-router";
import { Spacing, FontSize, Radius } from "../constants/theme";

const TAGLINE = "Kelola tugasmu, satu per satu.";
const TOTAL_DURATION = 2000;

export default function AnimatedSplashScreen() {
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.7)).current;
  const progressWidth = useRef(new Animated.Value(0)).current;
  const [typedText, setTypedText] = useState("");

  useEffect(() => {
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

    Animated.timing(progressWidth, {
      toValue: 100,
      duration: TOTAL_DURATION,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();

    let index = 0;
    const typeInterval = setInterval(() => {
      index += 1;
      setTypedText(TAGLINE.slice(0, index));
      if (index >= TAGLINE.length) clearInterval(typeInterval);
    }, TOTAL_DURATION / (TAGLINE.length * 1.5));

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
    <View style={[styles.container, { backgroundColor: "#0f172a" }]}>
      <View style={styles.center}>
        <Animated.View
          style={{
            opacity: logoOpacity,
            transform: [{ scale: logoScale }],
            marginBottom: Spacing.sm,
          }}
        >
          <Text style={[styles.appName, { color: "#f8fafc" }]}>
            Task <Text style={{ color: "#4ade80" }}>Flow</Text>
          </Text>
        </Animated.View>

        <Text style={[styles.tagline, { color: "#94a3b8" }]}>
          {typedText}
          <Text style={{ opacity: typedText.length < TAGLINE.length ? 1 : 0 }}>
            |
          </Text>
        </Text>
      </View>

      <View style={styles.progressSection}>
        <View style={[styles.progressTrack, { backgroundColor: "#334155" }]}>
          <Animated.View
            style={[
              styles.progressFill,
              { width: widthInterpolated, backgroundColor: "#4ade80" },
            ]}
          />
        </View>
        <Text style={[styles.loadingText, { color: "#94a3b8" }]}>
          Memuat aktivitas kamu...
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
  appName: {
    fontSize: FontSize.xxxl,
    fontWeight: "900",
    letterSpacing: 1,
    marginBottom: Spacing.sm,
  },
  tagline: {
    fontSize: FontSize.sm,
    fontWeight: "500",
    minHeight: 20,
  },
  progressSection: {
    alignItems: "center",
    gap: Spacing.md,
  },
  progressTrack: {
    width: "60%",
    height: 6,
    borderRadius: Radius.full,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: Radius.full,
  },
  loadingText: {
    fontSize: FontSize.xs,
    fontWeight: "600",
  },
});
