import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radii } from '../theme';

const STATS = [
  { label: 'Heart Rate', value: '72', unit: 'bpm', icon: 'heart', color: '#EF4444', trend: '+2 bpm', up: true },
  { label: 'Blood Pressure', value: '120/80', unit: 'mmHg', icon: 'pulse', color: '#8B5CF6', trend: 'Normal', up: null },
  { label: 'Weight', value: '74.2', unit: 'kg', icon: 'barbell', color: '#22C55E', trend: '−0.5 kg', up: false },
  { label: 'Steps Today', value: '8,432', unit: 'steps', icon: 'walk', color: '#3B82F6', trend: '+12%', up: true },
];

const RECORDS = [
  { title: 'Annual Check-up Report', date: 'Apr 2, 2025', type: 'PDF', icon: 'document-text', color: '#EF4444' },
  { title: 'Blood Panel Results', date: 'Mar 15, 2025', type: 'PDF', icon: 'flask', color: '#8B5CF6' },
  { title: 'Cardiology Consultation', date: 'Feb 28, 2025', type: 'Note', icon: 'heart', color: '#F59E0B' },
];

export default function HealthScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerSub}>Last updated: Today, 8:30 AM</Text>
            <Text style={styles.headerTitle}>Health Records</Text>
          </View>
          <TouchableOpacity style={styles.uploadBtn}>
            <Ionicons name="cloud-upload-outline" size={20} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Wellness Card */}
        <View style={styles.wellnessCard}>
          <View style={styles.wellnessGlow} />
          <View style={styles.wellnessLeft}>
            <Text style={styles.wellnessLabel}>Wellness Score</Text>
            <Text style={styles.wellnessScore}>84</Text>
            <Text style={styles.wellnessSub}>out of 100 — Great!</Text>
            <View style={styles.wellnessBarBg}>
              <View style={[styles.wellnessBarFill, { width: '84%' }]} />
            </View>
          </View>
          <View style={styles.wellnessRight}>
            <Ionicons name="ribbon" size={56} color={Colors.accent} />
          </View>
        </View>

        {/* Stats Grid */}
        <Text style={styles.sectionTitle}>Vitals Overview</Text>
        <View style={styles.statsGrid}>
          {STATS.map((stat) => (
            <View key={stat.label} style={styles.statCard}>
              <View style={[styles.statIconBox, { backgroundColor: stat.color + '20' }]}>
                <Ionicons name={stat.icon as any} size={20} color={stat.color} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statUnit}>{stat.unit}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
              <View style={[styles.trendBadge, { backgroundColor: stat.color + '15' }]}>
                {stat.up !== null && (
                  <Ionicons name={stat.up ? 'trending-up' : 'trending-down'} size={10} color={stat.color} />
                )}
                <Text style={[styles.trendText, { color: stat.color }]}>{stat.trend}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Records */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Medical Records</Text>
          <TouchableOpacity><Text style={styles.seeAll}>See all</Text></TouchableOpacity>
        </View>
        {RECORDS.map((rec) => (
          <TouchableOpacity key={rec.title} style={styles.recordCard} activeOpacity={0.85}>
            <View style={[styles.recordIcon, { backgroundColor: rec.color + '20' }]}>
              <Ionicons name={rec.icon as any} size={22} color={rec.color} />
            </View>
            <View style={styles.recordInfo}>
              <Text style={styles.recordTitle}>{rec.title}</Text>
              <Text style={styles.recordDate}>{rec.date}</Text>
            </View>
            <View style={styles.recordRight}>
              <View style={styles.typeBadge}>
                <Text style={styles.typeText}>{rec.type}</Text>
              </View>
              <Ionicons name="download-outline" size={18} color={Colors.textMuted} />
            </View>
          </TouchableOpacity>
        ))}

        {/* Medications */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Active Medications</Text>
          <TouchableOpacity style={styles.addMedBtn}>
            <Ionicons name="add" size={16} color={Colors.primary} />
            <Text style={styles.addMedText}>Add</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.medCard}>
          <View style={styles.medLeft}>
            <View style={styles.medIcon}>
              <Ionicons name="medical" size={22} color={Colors.accent} />
            </View>
            <View>
              <Text style={styles.medName}>Atorvastatin 20mg</Text>
              <Text style={styles.medSchedule}>Once daily · 8:00 PM</Text>
            </View>
          </View>
          <View style={styles.medBadge}>
            <Ionicons name="time-outline" size={12} color={Colors.warning} />
            <Text style={styles.medBadgeText}>12 days left</Text>
          </View>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingBottom: 100 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: Spacing.lg, paddingTop: 64, paddingBottom: Spacing.lg,
  },
  headerSub: { ...Typography.caption, color: Colors.textMuted, marginBottom: 4 },
  headerTitle: { ...Typography.heading1, color: Colors.textPrimary },
  uploadBtn: {
    width: 40, height: 40, borderRadius: Radii.md,
    backgroundColor: Colors.primaryGhost, alignItems: 'center', justifyContent: 'center',
  },
  wellnessCard: {
    marginHorizontal: Spacing.lg, marginBottom: Spacing.xl, padding: Spacing.lg,
    backgroundColor: Colors.surfaceElevated, borderRadius: Radii.xl,
    borderWidth: 1, borderColor: Colors.accent + '30',
    flexDirection: 'row', alignItems: 'center', overflow: 'hidden',
  },
  wellnessGlow: {
    position: 'absolute', width: 180, height: 180, borderRadius: 90,
    backgroundColor: Colors.accent + '08', bottom: -60, right: -30,
  },
  wellnessLeft: { flex: 1 },
  wellnessLabel: { ...Typography.body2, color: Colors.textSecondary, marginBottom: 4 },
  wellnessScore: { fontSize: 56, fontWeight: '800', color: Colors.textPrimary, lineHeight: 64 },
  wellnessSub: { ...Typography.body2, color: Colors.textSecondary, marginBottom: Spacing.md },
  wellnessBarBg: { height: 6, backgroundColor: Colors.border, borderRadius: Radii.full, overflow: 'hidden' },
  wellnessBarFill: { flex: 1, backgroundColor: Colors.accent, borderRadius: Radii.full },
  wellnessRight: { paddingLeft: Spacing.lg },
  sectionTitle: { ...Typography.heading4, color: Colors.textPrimary, paddingHorizontal: Spacing.lg, marginBottom: Spacing.md },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: Spacing.lg, marginTop: Spacing.lg, marginBottom: Spacing.md,
  },
  seeAll: { ...Typography.body2, color: Colors.primary },
  statsGrid: {
    flexDirection: 'row', flexWrap: 'wrap',
    gap: Spacing.sm, marginBottom: Spacing.lg, paddingHorizontal: Spacing.md,
  },
  statCard: {
    width: '47%', backgroundColor: Colors.surfaceElevated, borderRadius: Radii.lg,
    padding: Spacing.md, borderWidth: 1, borderColor: Colors.border,
  },
  statIconBox: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.sm },
  statValue: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary, lineHeight: 28 },
  statUnit: { ...Typography.caption, color: Colors.textMuted, marginBottom: 2 },
  statLabel: { ...Typography.caption, color: Colors.textSecondary, marginBottom: Spacing.sm },
  trendBadge: { flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: 8, paddingVertical: 3, borderRadius: Radii.full, alignSelf: 'flex-start' },
  trendText: { ...Typography.caption, fontWeight: '700', fontSize: 10 },
  recordCard: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    marginHorizontal: Spacing.lg, marginBottom: Spacing.sm,
    backgroundColor: Colors.surfaceElevated, borderRadius: Radii.lg, padding: Spacing.md,
    borderWidth: 1, borderColor: Colors.border,
  },
  recordIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  recordInfo: { flex: 1 },
  recordTitle: { ...Typography.body2, color: Colors.textPrimary, fontWeight: '600', marginBottom: 2 },
  recordDate: { ...Typography.caption, color: Colors.textSecondary },
  recordRight: { alignItems: 'flex-end', gap: 6 },
  typeBadge: { backgroundColor: Colors.surfaceHighlight, paddingHorizontal: 8, paddingVertical: 3, borderRadius: Radii.full },
  typeText: { ...Typography.caption, color: Colors.textSecondary, fontWeight: '600' },
  addMedBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.primaryGhost, paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radii.full },
  addMedText: { ...Typography.caption, color: Colors.primary, fontWeight: '700' },
  medCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginHorizontal: Spacing.lg, backgroundColor: Colors.surfaceElevated,
    borderRadius: Radii.lg, padding: Spacing.md, borderWidth: 1, borderColor: Colors.border,
  },
  medLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  medIcon: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.accentGhost,
    alignItems: 'center', justifyContent: 'center',
  },
  medName: { ...Typography.body2, color: Colors.textPrimary, fontWeight: '600' },
  medSchedule: { ...Typography.caption, color: Colors.textSecondary },
  medBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.warning + '20', paddingHorizontal: 10, paddingVertical: 5, borderRadius: Radii.full,
  },
  medBadgeText: { ...Typography.caption, color: Colors.warning, fontWeight: '600' },
});
