import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radii } from '../theme';

interface SettingsItem {
  icon: string;
  label: string;
  chevron?: boolean;
  toggle?: boolean;
  value?: string | boolean;
}

interface SettingsSection {
  title: string;
  items: SettingsItem[];
}

const SETTINGS_SECTIONS: SettingsSection[] = [
  {
    title: 'Account',
    items: [
      { icon: 'person-outline', label: 'Personal Information', chevron: true },
      { icon: 'card-outline', label: 'Payment Methods', chevron: true, value: '2 cards' },
      { icon: 'shield-checkmark-outline', label: 'Privacy & Security', chevron: true },
    ],
  },
  {
    title: 'Preferences',
    items: [
      { icon: 'notifications-outline', label: 'Push Notifications', toggle: true, value: true },
      { icon: 'moon-outline', label: 'Dark Mode', toggle: true, value: true },
      { icon: 'globe-outline', label: 'Language', chevron: true, value: 'English' },
    ],
  },
  {
    title: 'Support',
    items: [
      { icon: 'help-circle-outline', label: 'Help Center', chevron: true },
      { icon: 'chatbubble-outline', label: 'Contact Us', chevron: true },
      { icon: 'star-outline', label: 'Rate MediLink', chevron: true },
    ],
  },
];

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity style={styles.editBtn}>
            <Ionicons name="create-outline" size={20} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Avatar Card */}
        <View style={styles.avatarCard}>
          <View style={styles.avatarBg} />
          <View style={styles.avatarCircle}>
            <Ionicons name="person" size={42} color={Colors.primary} />
          </View>
          <TouchableOpacity style={styles.cameraBtn}>
            <Ionicons name="camera" size={14} color={Colors.white} />
          </TouchableOpacity>
          <Text style={styles.profileName}>Alex Johnson</Text>
          <Text style={styles.profileEmail}>alex@medilink.app</Text>
          <View style={styles.badgeRow}>
            <View style={styles.patientBadge}>
              <Ionicons name="person" size={12} color={Colors.primary} />
              <Text style={styles.patientBadgeText}>Patient</Text>
            </View>
            <View style={styles.verifiedBadge}>
              <Ionicons name="shield-checkmark" size={12} color={Colors.accent} />
              <Text style={styles.verifiedText}>Verified</Text>
            </View>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsRow}>
          {[{ label: 'Visits', value: '12' }, { label: 'Doctors', value: '4' }, { label: 'Records', value: '8' }].map((s, i) => (
            <React.Fragment key={s.label}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
              {i < 2 ? <View style={styles.statDiv} /> : null}
            </React.Fragment>
          ))}
        </View>

        {/* Settings */}
        {SETTINGS_SECTIONS.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title.toUpperCase()}</Text>
            <View style={styles.sectionCard}>
              {section.items.map((item, i) => (
                <TouchableOpacity
                  key={item.label}
                  style={[styles.row, i < section.items.length - 1 && styles.rowBorder]}
                  activeOpacity={item.toggle ? 1 : 0.7}
                >
                  <View style={styles.rowLeft}>
                    <View style={styles.rowIcon}>
                      <Ionicons name={item.icon as any} size={18} color={Colors.primary} />
                    </View>
                    <Text style={styles.rowLabel}>{item.label}</Text>
                  </View>
                  <View style={styles.rowRight}>
                    {item.value && !item.toggle && (
                      <Text style={styles.rowValue}>{String(item.value)}</Text>
                    )}
                    {item.toggle ? (
                      <Switch
                        value={item.value as boolean}
                        trackColor={{ false: Colors.border, true: Colors.primary }}
                        thumbColor={Colors.white}
                      />
                    ) : (
                      <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn}>
          <Ionicons name="log-out-outline" size={20} color={Colors.danger} />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>

        <Text style={styles.version}>MediLink v1.0.0 · Made with ❤️ for better healthcare</Text>
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
  headerTitle: { ...Typography.heading1, color: Colors.textPrimary },
  editBtn: {
    width: 40, height: 40, borderRadius: Radii.md,
    backgroundColor: Colors.primaryGhost, alignItems: 'center', justifyContent: 'center',
  },
  avatarCard: {
    alignItems: 'center', marginHorizontal: Spacing.lg, backgroundColor: Colors.surfaceElevated,
    borderRadius: Radii.xl, paddingTop: Spacing.xl, paddingBottom: Spacing.lg,
    paddingHorizontal: Spacing.lg, borderWidth: 1, borderColor: Colors.border,
    marginBottom: Spacing.lg, overflow: 'hidden',
  },
  avatarBg: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 80,
    backgroundColor: Colors.primaryDark + '60',
  },
  avatarCircle: {
    width: 90, height: 90, borderRadius: 45, backgroundColor: Colors.primaryGhost,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 3, borderColor: Colors.primary + '50', marginBottom: Spacing.md,
  },
  cameraBtn: {
    position: 'absolute', width: 28, height: 28, borderRadius: 14,
    backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center',
    top: 120, right: 80, borderWidth: 2, borderColor: Colors.surfaceElevated,
  },
  profileName: { ...Typography.heading3, color: Colors.textPrimary, marginBottom: 4 },
  profileEmail: { ...Typography.body2, color: Colors.textSecondary, marginBottom: Spacing.md },
  badgeRow: { flexDirection: 'row', gap: Spacing.sm },
  patientBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radii.full,
    backgroundColor: Colors.primaryGhost,
  },
  patientBadgeText: { ...Typography.caption, color: Colors.primary, fontWeight: '600' },
  verifiedBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radii.full,
    backgroundColor: Colors.accentGhost,
  },
  verifiedText: { ...Typography.caption, color: Colors.accent, fontWeight: '600' },
  statsRow: {
    flexDirection: 'row', marginHorizontal: Spacing.lg, backgroundColor: Colors.surfaceElevated,
    borderRadius: Radii.lg, borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.lg,
  },
  statItem: { flex: 1, alignItems: 'center', paddingVertical: Spacing.md },
  statValue: { ...Typography.heading3, color: Colors.textPrimary },
  statLabel: { ...Typography.caption, color: Colors.textSecondary, marginTop: 2 },
  statDiv: { width: 1, backgroundColor: Colors.border, marginVertical: Spacing.sm },
  section: { marginBottom: Spacing.sm },
  sectionTitle: {
    ...Typography.caption, color: Colors.textMuted, fontWeight: '700',
    letterSpacing: 1, paddingHorizontal: Spacing.lg, marginBottom: Spacing.sm,
  },
  sectionCard: {
    marginHorizontal: Spacing.lg, backgroundColor: Colors.surfaceElevated,
    borderRadius: Radii.lg, borderWidth: 1, borderColor: Colors.border, overflow: 'hidden',
  },
  row: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.md, paddingVertical: 14,
  },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  rowIcon: {
    width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.primaryGhost,
    alignItems: 'center', justifyContent: 'center',
  },
  rowLabel: { ...Typography.body2, color: Colors.textPrimary },
  rowRight: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  rowValue: { ...Typography.body2, color: Colors.textSecondary },
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm,
    marginHorizontal: Spacing.lg, paddingVertical: 14, borderRadius: Radii.lg,
    borderWidth: 1, borderColor: Colors.danger + '40', backgroundColor: Colors.danger + '10',
    marginTop: Spacing.md, marginBottom: Spacing.lg,
  },
  logoutText: { ...Typography.body1, color: Colors.danger, fontWeight: '700' },
  version: { ...Typography.caption, color: Colors.textMuted, textAlign: 'center', paddingBottom: Spacing.md },
});
