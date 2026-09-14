import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Animated, Easing, Image } from "react-native";
import { router } from "expo-router";
import { useAppTheme } from "../store/themeStore";
import { Spacing, FontSize, Radius } from "../constants/theme";

const TAGLINE = "Kelola tugasmu, satu per satu.";
const TOTAL_DURATION = 2000;

export default function AnimatedSplashScreen() {
  const { colors } = useAppTheme();

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
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.center}>
        <Animated.View
          style={[
            styles.logoBox,
            {
              borderColor: colors.border,
              backgroundColor: colors.surface,
              opacity: logoOpacity,
              transform: [{ scale: logoScale }],
            },
          ]}
        >
          <Image 
            source={require("../../assets/images/iconsaja.png")} 
            style={{ width: 64, height: 64 }} 
            resizeMode="contain" 
          />
        </Animated.View>

        <Animated.Text
          style={[styles.appName, { color: colors.text, opacity: logoOpacity }]}
        >
          Task<Text style={{ color: colors.accent }}>GO</Text>
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
              { width: widthInterpolated, backgroundColor: colors.accent },
            ]}
          />
        </View>
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
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
  logoBox: {
    width: 104,
    height: 104,
    borderRadius: Radius.lg,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
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
