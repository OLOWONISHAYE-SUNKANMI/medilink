import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radii, Shadows } from '../theme';

interface DoctorProfileScreenProps {
  navigation: any;
  route: any;
}

export default function DoctorProfileScreen({ navigation, route }: DoctorProfileScreenProps) {
  const doctor = route.params?.doctor || {
    id: '1', name: 'Dr. Sarah Chen', specialty: 'Cardiologist',
    rating: 4.9, reviews: 312, icon: 'heart', color: '#EF4444',
  };

  const fee = '₦15,000';

  const STATS = [
    { label: 'Exp. Years', value: '12+', icon: 'briefcase' },
    { label: 'Patients', value: '8.5k', icon: 'people' },
    { label: 'Reviews', value: String(doctor.reviews), icon: 'star' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Hero */}
      <View style={styles.hero}>
        <View style={styles.heroGlow} />
        {/* Nav */}
        <View style={styles.heroNav}>
          <TouchableOpacity style={styles.navBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color={Colors.white} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navBtn}>
            <Ionicons name="heart-outline" size={22} color={Colors.white} />
          </TouchableOpacity>
        </View>
        {/* Avatar */}
        <View style={styles.avatarWrapper}>
          <View style={[styles.avatar, { borderColor: doctor.color + '60' }]}>
            <Ionicons name={doctor.icon as any} size={64} color={doctor.color} />
          </View>
          <View style={styles.onlineBadge} />
        </View>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent} showsVerticalScrollIndicator={false}>

        {/* Name & specialty */}
        <Text style={styles.docName}>{doctor.name}</Text>
        <Text style={styles.docSpecialty}>{doctor.specialty} · LASUTH, Lagos</Text>

        {/* Rating */}
        <View style={styles.ratingRow}>
          <View style={styles.ratingPill}>
            <Ionicons name="star" size={14} color={Colors.warning} />
            <Text style={styles.ratingValue}>{doctor.rating}</Text>
          </View>
          <Text style={styles.ratingCount}>({doctor.reviews} reviews)</Text>
        </View>

        {/* Stats Row */}
        <View style={styles.statsCard}>
          {STATS.map((s, i) => (
            <React.Fragment key={s.label}>
              <View style={styles.statItem}>
                <View style={styles.statIconBox}>
                  <Ionicons name={s.icon as any} size={16} color={Colors.primary} />
                </View>
                <Text style={styles.statValue}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
              {i < STATS.length - 1 && <View style={styles.statDivider} />}
            </React.Fragment>
          ))}
        </View>

        {/* Services */}
        <View style={styles.serviceRow}>
          {['Video Call', 'Audio Call', 'Chat'].map((s) => (
            <View key={s} style={styles.servicePill}>
              <Ionicons
                name={s === 'Video Call' ? 'videocam' : s === 'Audio Call' ? 'call' : 'chatbox-ellipses'}
                size={13} color={Colors.primary}
              />
              <Text style={styles.serviceText}>{s}</Text>
            </View>
          ))}
        </View>

        {/* About */}
        <Text style={styles.sectionTitle}>About Doctor</Text>
        <Text style={styles.aboutText}>
          {doctor.name} is a top-tier {doctor.specialty} with over 12 years of clinical experience,
          specialising in preventative care and chronic condition management at LASUTH.
          She is highly rated for her patient-centred approach and clear communication.
        </Text>

        {/* Fee Card */}
        <View style={styles.feeCard}>
          <View>
            <Text style={styles.feeLabel}>CONSULTATION FEE</Text>
            <Text style={styles.feeAmount}>{fee}</Text>
          </View>
          <View style={styles.hmoBadge}>
            <Ionicons name="shield-checkmark" size={14} color={Colors.accent} />
            <Text style={styles.hmoText}>HMO Accepted</Text>
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, { paddingBottom: Platform.OS === 'ios' ? 40 : 24 }]}>
        <View>
          <Text style={styles.footerFeeLabel}>Consultation Fee</Text>
          <Text style={styles.footerFee}>{fee}</Text>
        </View>
        <TouchableOpacity
          style={styles.bookBtn}
          onPress={() => navigation.navigate('Booking', { doctor })}
        >
          <Text style={styles.bookBtnText}>Book Appointment</Text>
          <Ionicons name="calendar" size={18} color={Colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  hero: { height: 260, backgroundColor: Colors.primaryDark, overflow: 'hidden' },
  heroGlow: {
    position: 'absolute', width: 300, height: 300, borderRadius: 150,
    backgroundColor: Colors.primary + '30', top: -80, right: -80,
  },
  heroNav: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg, paddingTop: 60,
  },
  navBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center',
  },
  avatarWrapper: { alignItems: 'center', marginTop: Spacing.lg },
  avatar: {
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: Colors.surfaceElevated, alignItems: 'center', justifyContent: 'center',
    borderWidth: 4,
  },
  onlineBadge: {
    position: 'absolute', bottom: 4, right: '35%',
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: Colors.success, borderWidth: 3, borderColor: Colors.primaryDark,
  },
  body: { flex: 1, backgroundColor: Colors.background, borderTopLeftRadius: 32, borderTopRightRadius: 32, marginTop: -24 },
  bodyContent: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.xl },
  docName: { ...Typography.heading1, color: Colors.textPrimary, textAlign: 'center' },
  docSpecialty: { ...Typography.body1, color: Colors.textSecondary, textAlign: 'center', marginTop: 4, marginBottom: Spacing.md },
  ratingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, marginBottom: Spacing.xl },
  ratingPill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.warning + '20', paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radii.full,
  },
  ratingValue: { ...Typography.caption, color: Colors.warning, fontWeight: '700' },
  ratingCount: { ...Typography.caption, color: Colors.textMuted },
  statsCard: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: Colors.surfaceElevated, borderRadius: Radii.lg, padding: Spacing.lg,
    borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.xl,
    ...Shadows.sm,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statIconBox: {
    width: 36, height: 36, borderRadius: Radii.md, backgroundColor: Colors.primaryGhost,
    alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.sm,
  },
  statValue: { ...Typography.heading3, color: Colors.primaryLight },
  statLabel: { ...Typography.caption, color: Colors.textSecondary, marginTop: 2 },
  statDivider: { width: 1, height: 50, backgroundColor: Colors.border },
  serviceRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.xl },
  servicePill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: Colors.primaryGhost, paddingHorizontal: Spacing.sm, paddingVertical: 6,
    borderRadius: Radii.full, borderWidth: 1, borderColor: Colors.primary + '30',
  },
  serviceText: { ...Typography.caption, color: Colors.primaryLight, fontWeight: '600' },
  sectionTitle: { ...Typography.heading4, color: Colors.textPrimary, marginBottom: Spacing.sm },
  aboutText: { ...Typography.body2, color: Colors.textSecondary, lineHeight: 22, marginBottom: Spacing.xl },
  feeCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: Colors.primaryGhost, borderRadius: Radii.lg, padding: Spacing.lg,
    borderWidth: 1, borderColor: Colors.primary + '30',
  },
  feeLabel: { ...Typography.caption, color: Colors.primaryLight, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' },
  feeAmount: { ...Typography.heading2, color: Colors.textPrimary },
  hmoBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: Colors.accentGhost, paddingHorizontal: 12, paddingVertical: 6, borderRadius: Radii.md,
  },
  hmoText: { ...Typography.caption, color: Colors.accent, fontWeight: '600' },
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: Colors.surface, paddingHorizontal: Spacing.lg, paddingTop: Spacing.md,
    borderTopWidth: 1, borderTopColor: Colors.border,
  },
  footerFeeLabel: { ...Typography.caption, color: Colors.textSecondary },
  footerFee: { ...Typography.heading3, color: Colors.textPrimary },
  bookBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    flex: 1, marginLeft: Spacing.lg, backgroundColor: Colors.primary,
    paddingVertical: 14, borderRadius: Radii.lg, justifyContent: 'center',
    ...Shadows.md,
  },
  bookBtnText: { ...Typography.body1, color: Colors.white, fontWeight: '700' },
});
