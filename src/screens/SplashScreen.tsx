import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  StatusBar,
  Dimensions,
} from 'react-native';
import { Colors } from '../theme';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  navigation: any;
}

export default function SplashScreen({ navigation }: SplashScreenProps) {
  const logoScale = useRef(new Animated.Value(0.6)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleY = useRef(new Animated.Value(16)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const ringOpacity = useRef(new Animated.Value(0)).current;
  const ringScale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Pulse ring animation
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(ringOpacity, { toValue: 0.4, duration: 700, useNativeDriver: true }),
          Animated.timing(ringScale, { toValue: 1.4, duration: 700, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(ringOpacity, { toValue: 0, duration: 700, useNativeDriver: true }),
          Animated.timing(ringScale, { toValue: 0.8, duration: 700, useNativeDriver: true }),
        ]),
      ])
    ).start();

    // Logo entrance
    Animated.parallel([
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 60,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Subtitle fade-in after logo
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(subtitleOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(subtitleY, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    }, 400);

    // Pulse the logo icon
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.06, duration: 900, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
      ])
    ).start();

    // Navigate to Onboarding after 2.6s
    const timer = setTimeout(() => {
      navigation.replace('Onboarding');
    }, 2600);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      {/* Background radial glow */}
      <View style={styles.glowOuter} />
      <View style={styles.glowInner} />

      {/* Animated ring */}
      <Animated.View
        style={[
          styles.ring,
          { opacity: ringOpacity, transform: [{ scale: ringScale }] },
        ]}
      />

      {/* Logo block */}
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: logoOpacity,
            transform: [{ scale: logoScale }],
          },
        ]}
      >
        {/* Icon */}
        <Animated.View
          style={[styles.iconWrap, { transform: [{ scale: pulseAnim }] }]}
        >
          <View style={styles.crossH} />
          <View style={styles.crossV} />
        </Animated.View>

        {/* App name */}
        <View style={styles.titleRow}>
          <Text style={styles.titleMedi}>Medi</Text>
          <Text style={styles.titleLink}>Link</Text>
        </View>

        {/* Tagline */}
        <Animated.Text
          style={[
            styles.tagline,
            { opacity: subtitleOpacity, transform: [{ translateY: subtitleY }] },
          ]}
        >
          Care, anytime, anywhere.
        </Animated.Text>
      </Animated.View>

      {/* Bottom badge */}
      <Animated.View style={[styles.bottomBadge, { opacity: subtitleOpacity }]}>
        <View style={styles.dot} />
        <View style={[styles.dot, styles.dotActive]} />
        <View style={styles.dot} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowOuter: {
    position: 'absolute',
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: Colors.primary + '0D',
    top: height / 2 - 200,
    left: width / 2 - 200,
  },
  glowInner: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: Colors.primary + '18',
    top: height / 2 - 110,
    left: width / 2 - 110,
  },
  ring: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  logoContainer: {
    alignItems: 'center',
  },
  iconWrap: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 12,
  },
  crossH: {
    position: 'absolute',
    width: 40,
    height: 12,
    backgroundColor: '#fff',
    borderRadius: 6,
  },
  crossV: {
    position: 'absolute',
    width: 12,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 6,
  },
  titleRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  titleMedi: {
    fontSize: 42,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -1,
  },
  titleLink: {
    fontSize: 42,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: -1,
  },
  tagline: {
    fontSize: 15,
    color: Colors.textSecondary,
    fontWeight: '400',
    letterSpacing: 0.2,
  },
  bottomBadge: {
    position: 'absolute',
    bottom: 56,
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.textMuted,
  },
  dotActive: {
    width: 18,
    backgroundColor: Colors.primary,
  },
});
