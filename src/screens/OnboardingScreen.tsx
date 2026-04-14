import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Animated,
  StatusBar,
  ViewToken,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radii } from '../theme';

const { width, height } = Dimensions.get('window');

interface Slide {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  title: string;
  subtitle: string;
  bg: string;
}

const slides: Slide[] = [
  {
    id: '1',
    icon: 'medkit',
    iconColor: Colors.primary,
    title: 'Your Health,\nOur Priority',
    subtitle: 'Connect with certified doctors and get expert medical care from the comfort of your home.',
    bg: Colors.primary,
  },
  {
    id: '2',
    icon: 'people',
    iconColor: Colors.accent,
    title: 'Find the Right\nDoctor',
    subtitle: 'Browse specialists across dozens of fields. Book appointments in seconds.',
    bg: Colors.accent,
  },
  {
    id: '3',
    icon: 'shield-checkmark',
    iconColor: '#F59E0B',
    title: 'Secure &\nPrivate',
    subtitle: 'Your medical data is encrypted and protected. Share only what you choose.',
    bg: '#F59E0B',
  },
];

interface OnboardingScreenProps {
  navigation: any;
}

export default function OnboardingScreen({ navigation }: OnboardingScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef<FlatList>(null);

  const viewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems[0]) setCurrentIndex(Number(viewableItems[0].index));
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const scrollTo = (index: number) => {
    slidesRef.current?.scrollToIndex({ index });
  };

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      scrollTo(currentIndex + 1);
    } else {
      navigation.replace('Auth');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      {/* Logo */}
      <View style={styles.header}>
        <View style={styles.logoMark}>
          <Ionicons name="pulse" size={20} color={Colors.white} />
        </View>
        <Text style={styles.logoText}>MediLink</Text>
      </View>

      {/* Slides */}
      <Animated.FlatList
        data={slides}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
          useNativeDriver: false,
        })}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={viewConfig}
        ref={slidesRef}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            {/* Icon bubble */}
            <View style={[styles.iconWrapper, { borderColor: item.bg + '40' }]}>
              <View style={[styles.iconInner, { backgroundColor: item.bg + '20' }]}>
                <Ionicons name={item.icon} size={72} color={item.bg} />
              </View>
            </View>

            {/* Decorative circles */}
            <View style={[styles.circle1, { backgroundColor: item.bg + '08' }]} />
            <View style={[styles.circle2, { backgroundColor: item.bg + '05' }]} />

            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
          </View>
        )}
      />

      {/* Dots */}
      <View style={styles.dotsRow}>
        {slides.map((_, i) => {
          const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
          const dotWidth = scrollX.interpolate({ inputRange, outputRange: [8, 24, 8], extrapolate: 'clamp' });
          const opacity = scrollX.interpolate({ inputRange, outputRange: [0.3, 1, 0.3], extrapolate: 'clamp' });
          return (
            <Animated.View
              key={i}
              style={[styles.dot, { width: dotWidth, opacity, backgroundColor: slides[i].bg }]}
            />
          );
        })}
      </View>

      {/* CTA */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.skipBtn}
          onPress={() => navigation.replace('Auth')}
        >
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.nextBtn} onPress={handleNext} activeOpacity={0.85}>
          <Ionicons
            name={currentIndex === slides.length - 1 ? 'checkmark' : 'arrow-forward'}
            size={22}
            color={Colors.white}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: 60,
    paddingBottom: Spacing.md,
  },
  logoMark: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  logoText: {
    ...Typography.heading3,
    color: Colors.textPrimary,
    fontWeight: '800',
  },
  slide: {
    width,
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
  },
  iconWrapper: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  iconInner: {
    width: 160,
    height: 160,
    borderRadius: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle1: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    top: height * 0.05,
    right: -80,
  },
  circle2: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    bottom: height * 0.1,
    left: -50,
  },
  title: { ...Typography.heading1, color: Colors.textPrimary, textAlign: 'center', marginBottom: Spacing.md },
  subtitle: {
    ...Typography.body1,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 26,
  },
  dotsRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginVertical: Spacing.lg },
  dot: { height: 8, borderRadius: 4, marginHorizontal: 4 },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingBottom: 48,
  },
  skipBtn: { padding: Spacing.md },
  skipText: { ...Typography.body1, color: Colors.textSecondary },
  nextBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
});
