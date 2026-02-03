import React, { useEffect, useRef } from "react";
import { Animated, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export function SplashScreen() {
  const glow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glow, {
          toValue: 1,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(glow, {
          toValue: 0,
          duration: 1800,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [glow]);

  const opacity = glow.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 1],
  });

  return (
    <LinearGradient
      colors={["#0B0B16", "#14132B", "#1F1C3F"]}
      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
    >
      <View style={{ alignItems: "center" }}>
        <Animated.View style={{ opacity }}>
          <Text style={{ color: "white", fontSize: 48, fontWeight: "600" }}>veas</Text>
        </Animated.View>
        <Text style={{ color: "#D4C2FC", fontSize: 10, marginTop: 16, letterSpacing: 4, textTransform: "uppercase" }}>
          Astrology, grounded in the real sky
        </Text>
      </View>
    </LinearGradient>
  );
}
