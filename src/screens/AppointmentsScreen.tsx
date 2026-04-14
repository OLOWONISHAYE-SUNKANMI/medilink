import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radii } from '../theme';

type FilterTab = 'Upcoming' | 'Past' | 'Cancelled';

const APPOINTMENTS = [
  { id: '1', doctor: 'Dr. Sarah Chen', specialty: 'Cardiologist', time: '4:30 PM', date: 'Apr 14, 2025', type: 'Video Call', status: 'Upcoming', icon: 'heart', color: '#EF4444' },
  { id: '2', doctor: 'Dr. James Okoro', specialty: 'Dermatologist', time: '10:00 AM', date: 'Apr 16, 2025', type: 'In-person', status: 'Upcoming', icon: 'flask', color: '#8B5CF6' },
  { id: '3', doctor: 'Dr. Amina Bello', specialty: 'Pediatrician', time: '02:00 PM', date: 'Mar 28, 2025', type: 'Video Call', status: 'Past', icon: 'happy', color: '#22C55E' },
];

export default function AppointmentsScreen({ navigation }: { navigation: any }) {
  const [filter, setFilter] = useState<FilterTab>('Upcoming');
  const filtered = APPOINTMENTS.filter((a) => a.status === filter);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Appointments</Text>
        <TouchableOpacity style={styles.addBtn}>
          <Ionicons name="add" size={22} color={Colors.white} />
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        {(['Upcoming', 'Past', 'Cancelled'] as FilterTab[]).map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterTab, filter === f && styles.filterTabActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons name="calendar-outline" size={48} color={Colors.textMuted} />
            </View>
            <Text style={styles.emptyTitle}>No {filter} Appointments</Text>
            <Text style={styles.emptyDesc}>Book a consultation with a doctor to get started</Text>
            <TouchableOpacity style={styles.emptyBtn}>
              <Text style={styles.emptyBtnText}>Find a Doctor</Text>
            </TouchableOpacity>
          </View>
        ) : (
          filtered.map((appt) => (
            <View key={appt.id} style={styles.card}>
              <View style={styles.cardTop}>
                <View style={[styles.apptIcon, { backgroundColor: appt.color + '20' }]}>
                  <Ionicons name={appt.icon as any} size={24} color={appt.color} />
                </View>
                <View style={styles.apptInfo}>
                  <Text style={styles.apptDoctor}>{appt.doctor}</Text>
                  <Text style={styles.apptSpecialty}>{appt.specialty}</Text>
                </View>
                <View style={[styles.typePill, { backgroundColor: appt.type === 'Video Call' ? Colors.primaryGhost : Colors.surfaceHighlight }]}>
                  <Ionicons
                    name={appt.type === 'Video Call' ? 'videocam' : 'location'}
                    size={11} color={appt.type === 'Video Call' ? Colors.primaryLight : Colors.textSecondary}
                  />
                  <Text style={[styles.typeText, appt.type === 'Video Call' && { color: Colors.primaryLight }]}>{appt.type}</Text>
                </View>
              </View>

              <View style={styles.cardDivider} />

              <View style={styles.cardMeta}>
                <View style={styles.metaItem}>
                  <Ionicons name="calendar-outline" size={14} color={Colors.textSecondary} />
                  <Text style={styles.metaText}>{appt.date}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Ionicons name="time-outline" size={14} color={Colors.textSecondary} />
                  <Text style={styles.metaText}>{appt.time}</Text>
                </View>
              </View>

              {appt.status === 'Upcoming' && (
                <View style={styles.cardActions}>
                  <TouchableOpacity style={styles.cancelBtn}>
                    <Text style={styles.cancelBtnText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.joinBtn}
                    onPress={() => appt.type === 'Video Call' && navigation.navigate('Consultation', { doctor: { name: appt.doctor } })}
                  >
                    <Ionicons name={appt.type === 'Video Call' ? 'videocam' : 'navigate'} size={16} color={Colors.white} />
                    <Text style={styles.joinBtnText}>{appt.type === 'Video Call' ? 'Join Call' : 'Directions'}</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: Spacing.lg, paddingTop: 64, paddingBottom: Spacing.lg,
  },
  headerTitle: { ...Typography.heading1, color: Colors.textPrimary },
  addBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center',
  },
  filterRow: {
    flexDirection: 'row', marginHorizontal: Spacing.lg,
    backgroundColor: Colors.surfaceElevated, borderRadius: Radii.lg, padding: 4, marginBottom: Spacing.lg,
    borderWidth: 1, borderColor: Colors.border,
  },
  filterTab: { flex: 1, paddingVertical: 9, alignItems: 'center', borderRadius: Radii.md },
  filterTabActive: { backgroundColor: Colors.surfaceHighlight },
  filterText: { ...Typography.body2, fontWeight: '600', color: Colors.textSecondary },
  filterTextActive: { color: Colors.primaryLight },
  scroll: { paddingHorizontal: Spacing.lg, paddingBottom: 100 },
  card: {
    backgroundColor: Colors.surfaceElevated, borderRadius: Radii.xl,
    borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.md, padding: Spacing.lg,
  },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  apptIcon: { width: 52, height: 52, borderRadius: Radii.md, alignItems: 'center', justifyContent: 'center' },
  apptInfo: { flex: 1 },
  apptDoctor: { ...Typography.body1, color: Colors.textPrimary, fontWeight: '700' },
  apptSpecialty: { ...Typography.caption, color: Colors.textSecondary },
  typePill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: Radii.full,
  },
  typeText: { ...Typography.caption, color: Colors.textSecondary, fontWeight: '600' },
  cardDivider: { height: 1, backgroundColor: Colors.border, marginVertical: Spacing.md },
  cardMeta: { flexDirection: 'row', gap: Spacing.xl },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaText: { ...Typography.body2, color: Colors.textSecondary },
  cardActions: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.md },
  cancelBtn: {
    flex: 1, paddingVertical: 12, alignItems: 'center',
    borderRadius: Radii.md, borderWidth: 1, borderColor: Colors.border,
  },
  cancelBtnText: { ...Typography.body2, color: Colors.textSecondary, fontWeight: '600' },
  joinBtn: {
    flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    backgroundColor: Colors.primary, paddingVertical: 12, borderRadius: Radii.md,
  },
  joinBtnText: { ...Typography.body2, color: Colors.white, fontWeight: '700' },
  emptyState: { flex: 1, alignItems: 'center', paddingTop: 80 },
  emptyIcon: {
    width: 96, height: 96, borderRadius: 48,
    backgroundColor: Colors.surfaceElevated, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.lg,
    borderWidth: 1, borderColor: Colors.border,
  },
  emptyTitle: { ...Typography.heading3, color: Colors.textPrimary, marginBottom: Spacing.sm },
  emptyDesc: { ...Typography.body2, color: Colors.textSecondary, textAlign: 'center', paddingHorizontal: Spacing.xl, lineHeight: 22 },
  emptyBtn: {
    marginTop: Spacing.xl, backgroundColor: Colors.surfaceHighlight, paddingVertical: 12,
    paddingHorizontal: Spacing.xl, borderRadius: Radii.lg, borderWidth: 1, borderColor: Colors.border,
  },
  emptyBtnText: { ...Typography.body1, color: Colors.textPrimary, fontWeight: '700' },
});
