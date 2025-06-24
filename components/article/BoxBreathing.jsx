import React, { useEffect, useRef } from "react";
import { StyleSheet, View, Text, Animated, Easing } from "react-native";

export default function BoxBreathing({ color = "#7CB342" }) {
  // Animation values
  const minSize = 120;
  const maxSize = 240;
  const squareSize = useRef(new Animated.Value(minSize)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef([
    new Animated.Value(0), // Inhale
    new Animated.Value(0), // Hold
    new Animated.Value(0), // Exhale
    new Animated.Value(0), // Hold
  ]).current;

  // Duration for each phase (in ms)
  const phaseDuration = 4000;
  
  // Start the animation sequence
  useEffect(() => {
    // Fade in the component
    Animated.timing(opacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
    
    // Start the breathing cycle
    startBreathingCycle();
    
    // Cleanup
    return () => {
      squareSize.stopAnimation();
      opacity.stopAnimation();
      textOpacity.forEach(anim => anim.stopAnimation());
    };
  }, []);

  // Function to run the continuous breathing cycle
  const startBreathingCycle = () => {
    Animated.loop(
      Animated.sequence([
        // Phase 1: Inhale (expand)
        Animated.parallel([
          Animated.timing(squareSize, {
            toValue: maxSize,
            duration: phaseDuration,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
          Animated.timing(textOpacity[0], {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.delay(phaseDuration - 300),
            Animated.timing(textOpacity[0], {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }),
          ]),
        ]),
        
        // Phase 2: Hold (after inhale)
        Animated.parallel([
          Animated.timing(textOpacity[1], {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.delay(phaseDuration - 300),
            Animated.timing(textOpacity[1], {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }),
          ]),
        ]),
        
        // Phase 3: Exhale (contract)
        Animated.parallel([
          Animated.timing(squareSize, {
            toValue: minSize,
            duration: phaseDuration,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
          Animated.timing(textOpacity[2], {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.delay(phaseDuration - 300),
            Animated.timing(textOpacity[2], {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }),
          ]),
        ]),
        
        // Phase 4: Hold (after exhale)
        Animated.parallel([
          Animated.timing(textOpacity[3], {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.delay(phaseDuration - 300),
            Animated.timing(textOpacity[3], {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }),
          ]),
        ]),
      ])
    ).start();
  };

  return (
    <View style={styles.container}>      
      <View style={styles.animationContainer}>
        {/* Guide outlines */}
        <View style={[styles.guideSquare, { width: minSize, height: minSize, borderColor: `${color}30` }]} />
        <View style={[styles.guideSquare, { width: maxSize, height: maxSize, borderColor: `${color}30` }]} />
        
        {/* Animated square */}
        <Animated.View 
          style={[
            styles.square,
            { 
              width: squareSize, 
              height: squareSize,
              borderColor: color,
              backgroundColor: `${color}20`,
            }
          ]}
        />
        
        {/* Phase labels */}
        <Animated.Text style={[styles.phaseText, { opacity: textOpacity[0], color }]}>
          Вдох
        </Animated.Text>
        <Animated.Text style={[styles.phaseText, { opacity: textOpacity[1], color }]}>
          Задержка
        </Animated.Text>
        <Animated.Text style={[styles.phaseText, { opacity: textOpacity[2], color }]}>
          Выдох
        </Animated.Text>
        <Animated.Text style={[styles.phaseText, { opacity: textOpacity[3], color, width: maxSize - 20 }]}>
          Задержка
        </Animated.Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    alignItems: "center",
  },
  animationContainer: {
    height: 280,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  guideSquare: {
    position: "absolute",
    borderWidth: 1,
    borderRadius: 8,
    borderStyle: "dashed",
  },
  square: {
    borderWidth: 3,
    borderRadius: 8,
  },
  phaseText: {
    position: "absolute",
    fontSize: 20,
    fontWeight: "500",
    letterSpacing: 0.5,
    textAlign: "center",
  },
});
