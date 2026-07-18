import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, View } from "react-native";

// On Android, children of LinearGradient get broken flex layout
// (rows collapse and stick to the right edge), so the gradient is
// rendered as an absolutely positioned background inside a plain View.
const RADIUS_KEYS = [
  "borderRadius",
  "borderTopLeftRadius",
  "borderTopRightRadius",
  "borderBottomLeftRadius",
  "borderBottomRightRadius",
];

const GradientBackground = ({
  colors,
  locations,
  start,
  end,
  style,
  children,
  ...props
}) => {
  const flatStyle = StyleSheet.flatten(style) ?? {};
  const radiusStyle = {};
  for (const key of RADIUS_KEYS) {
    if (flatStyle[key] !== undefined) {
      radiusStyle[key] = flatStyle[key];
    }
  }

  return (
    <View style={style} {...props}>
      <LinearGradient
        colors={colors}
        locations={locations}
        start={start}
        end={end}
        style={[StyleSheet.absoluteFill, radiusStyle]}
        pointerEvents="none"
      />
      {children}
    </View>
  );
};

export default GradientBackground;
