import React, { useState } from 'react';
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

const DATES = [
  { day: 'Mon', date: '14' }, { day: 'Tue', date: '15' }, { day: 'Wed', date: '16' },
  { day: 'Thu', date: '17' }, { day: 'Fri', date: '18' }, { day: 'Sat', date: '19' },
];

const TIME_SLOTS = [
  { id: '1', time: '09:00 AM', period: 'Morning' }, { id: '2', time: '10:30 AM', period: 'Morning' },
  { id: '3', time: '12:00 PM', period: 'Afternoon' }, { id: '4', time: '02:30 PM', period: 'Afternoon' },
  { id: '5', time: '04:00 PM', period: 'Afternoon' }, { id: '6', time: '06:30 PM', period: 'Evening' },
];

const TYPES = [
  { id: 'video', label: 'Video Call', icon: 'videocam', price: '₦15,000', desc: 'HD video consultation' },
  { id: 'audio', label: 'Audio Call', icon: 'call', price: '₦10,000', desc: 'Standard voice call' },
  { id: 'chat', label: 'Chat', icon: 'chatbox-ellipses', price: '₦5,000', desc: 'Messaging & prescription' },
];

export default function BookingScreen({ navigation, route }: { navigation: any; route: any }) {
  const doctor = route.params?.doctor;
  const [selectedDate, setSelectedDate] = useState('14');
  const [selectedSlot, setSelectedSlot] = useState('2');
  const [selectedType, setSelectedType] = useState('video');

  const handleConfirm = () => {
    navigation.navigate('Payment', {
      doctor,
      date: `Apr ${selectedDate}`,
      time: TIME_SLOTS.find(s => s.id === selectedSlot)?.time,
      type: TYPES.find(t => t.id === selectedType)?.label,
      price: TYPES.find(t => t.id === selectedType)?.price,
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Book Appointment</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Doctor mini card */}
        {doctor && (
          <View style={styles.doctorMiniCard}>
            <View style={[styles.doctorMiniAvatar, { backgroundColor: (doctor.color || Colors.primary) + '20' }]}>
              <Ionicons name={(doctor.icon || 'person') as any} size={28} color={doctor.color || Colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.doctorMiniName}>{doctor.name}</Text>
              <Text style={styles.doctorMiniSpecialty}>{doctor.specialty}</Text>
            </View>
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={12} color={Colors.warning} />
              <Text style={styles.ratingText}>{doctor.rating}</Text>
            </View>
          </View>
        )}

        {/* Date */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Select Date</Text>
          <Text style={styles.monthLabel}>April 2025</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.datesScroll}>
          {DATES.map((d) => (
            <TouchableOpacity
              key={d.date}
              style={[styles.dateCard, selectedDate === d.date && styles.dateCardActive]}
              onPress={() => setSelectedDate(d.date)}
            >
              <Text style={[styles.dateDay, selectedDate === d.date && styles.dateDayActive]}>{d.day}</Text>
              <Text style={[styles.dateNum, selectedDate === d.date && styles.dateNumActive]}>{d.date}</Text>
              {selectedDate === d.date && <View style={styles.dateDot} />}
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Time */}
        <Text style={[styles.sectionTitle, { marginTop: Spacing.xl, paddingHorizontal: Spacing.lg }]}>Select Time</Text>
        <View style={styles.timeGrid}>
          {TIME_SLOTS.map((slot) => (
            <TouchableOpacity
              key={slot.id}
              style={[styles.timeSlot, selectedSlot === slot.id && styles.timeSlotActive]}
              onPress={() => setSelectedSlot(slot.id)}
            >
              <Text style={[styles.timeSlotText, selectedSlot === slot.id && styles.timeSlotTextActive]}>{slot.time}</Text>
              <Text style={[styles.timeSlotPeriod, selectedSlot === slot.id && styles.timeSlotPeriodActive]}>{slot.period}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Consult Type */}
        <Text style={[styles.sectionTitle, { paddingHorizontal: Spacing.lg }]}>Consultation Type</Text>
        <View style={styles.typeList}>
          {TYPES.map((type) => (
            <TouchableOpacity
              key={type.id}
              style={[styles.typeCard, selectedType === type.id && styles.typeCardActive]}
              onPress={() => setSelectedType(type.id)}
              activeOpacity={0.85}
            >
              <View style={[styles.typeIcon, selectedType === type.id && styles.typeIconActive]}>
                <Ionicons name={type.icon as any} size={22} color={selectedType === type.id ? Colors.primary : Colors.textSecondary} />
              </View>
              <View style={styles.typeInfo}>
                <Text style={[styles.typeLabel, selectedType === type.id && styles.typeLabelActive]}>{type.label}</Text>
                <Text style={[styles.typeDesc, selectedType === type.id && styles.typeDescActive]}>{type.desc}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={[styles.typePrice, selectedType === type.id && styles.typePriceActive]}>{type.price}</Text>
                <View style={[styles.radioOuter, selectedType === type.id && styles.radioOuterActive]}>
                  {selectedType === type.id && <View style={styles.radioInner} />}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 110 }} />
      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, { paddingBottom: Platform.OS === 'ios' ? 40 : 24 }]}>
        <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm}>
          <Text style={styles.confirmBtnText}>Confirm Appointment</Text>
          <Ionicons name="chevron-forward" size={18} color={Colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg, paddingTop: 60, paddingBottom: Spacing.lg,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: Radii.md,
    backgroundColor: Colors.surfaceElevated, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: Colors.border,
  },
  headerTitle: { ...Typography.heading3, color: Colors.textPrimary },
  scroll: { paddingTop: Spacing.sm },
  doctorMiniCard: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    marginHorizontal: Spacing.lg, backgroundColor: Colors.surfaceElevated,
    borderRadius: Radii.lg, padding: Spacing.md, borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.xl,
  },
  doctorMiniAvatar: { width: 52, height: 52, borderRadius: Radii.md, alignItems: 'center', justifyContent: 'center' },
  doctorMiniName: { ...Typography.body1, color: Colors.textPrimary, fontWeight: '700' },
  doctorMiniSpecialty: { ...Typography.body2, color: Colors.textSecondary },
  ratingBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.warning + '20', paddingHorizontal: 8, paddingVertical: 4, borderRadius: Radii.full,
  },
  ratingText: { ...Typography.caption, color: Colors.warning, fontWeight: '700' },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: Spacing.lg, marginBottom: Spacing.md,
  },
  sectionTitle: { ...Typography.heading4, color: Colors.textPrimary, marginBottom: Spacing.md },
  monthLabel: { ...Typography.body2, color: Colors.primaryLight, fontWeight: '600' },
  datesScroll: { paddingHorizontal: Spacing.lg, gap: 10, paddingBottom: Spacing.md },
  dateCard: {
    width: 64, height: 90, borderRadius: Radii.lg, alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.surfaceElevated, borderWidth: 1, borderColor: Colors.border,
  },
  dateCardActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  dateDay: { ...Typography.caption, color: Colors.textSecondary, marginBottom: 4 },
  dateDayActive: { color: 'rgba(255,255,255,0.75)' },
  dateNum: { ...Typography.heading3, color: Colors.textPrimary },
  dateNumActive: { color: Colors.white },
  dateDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.6)', position: 'absolute', bottom: 8 },
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: Spacing.lg, gap: 10, marginBottom: Spacing.xl },
  timeSlot: {
    width: '31%', borderRadius: Radii.md, paddingVertical: 12, alignItems: 'center',
    backgroundColor: Colors.surfaceElevated, borderWidth: 1, borderColor: Colors.border,
  },
  timeSlotActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  timeSlotText: { ...Typography.body2, color: Colors.textPrimary, fontWeight: '700' },
  timeSlotTextActive: { color: Colors.white },
  timeSlotPeriod: { ...Typography.caption, color: Colors.textMuted, marginTop: 2 },
  timeSlotPeriodActive: { color: 'rgba(255,255,255,0.7)' },
  typeList: { paddingHorizontal: Spacing.lg, gap: Spacing.sm, marginBottom: Spacing.lg },
  typeCard: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.surfaceElevated, borderRadius: Radii.lg, padding: Spacing.md,
    borderWidth: 1, borderColor: Colors.border,
  },
  typeCardActive: { backgroundColor: Colors.primaryGhost, borderColor: Colors.primary },
  typeIcon: {
    width: 48, height: 48, borderRadius: Radii.md,
    backgroundColor: Colors.surfaceHighlight, alignItems: 'center', justifyContent: 'center',
  },
  typeIconActive: { backgroundColor: Colors.white },
  typeInfo: { flex: 1 },
  typeLabel: { ...Typography.body1, color: Colors.textPrimary, fontWeight: '600' },
  typeLabelActive: { color: Colors.primary, fontWeight: '700' },
  typeDesc: { ...Typography.caption, color: Colors.textMuted },
  typeDescActive: { color: Colors.primaryLight },
  typePrice: { ...Typography.caption, color: Colors.textSecondary, fontWeight: '600' },
  typePriceActive: { color: Colors.primary, fontWeight: '700' },
  radioOuter: {
    width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center', marginTop: 6,
  },
  radioOuterActive: { borderColor: Colors.primary },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.primary },
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: Colors.background, paddingHorizontal: Spacing.lg, paddingTop: Spacing.md,
    borderTopWidth: 1, borderTopColor: Colors.border,
  },
  confirmBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: Colors.primary, borderRadius: Radii.lg, paddingVertical: 18,
    ...Shadows.md,
  },
  confirmBtnText: { ...Typography.body1, color: Colors.white, fontWeight: '700' },
});
