import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radii, Shadows } from '../theme';

const { width } = Dimensions.get('window');

const CATEGORIES = [
  { id: '1', title: 'General', icon: 'medical', color: '#1A6FE8' },
  { id: '2', title: 'Cardiology', icon: 'heart', color: '#EF4444' },
  { id: '3', title: 'Dental', icon: 'sunny', color: '#F59E0B' },
  { id: '4', title: 'Mental', icon: 'leaf', color: '#22C55E' },
  { id: '5', title: 'Neuro', icon: 'flash', color: '#8B5CF6' },
];

const DOCTORS = [
  { id: '1', name: 'Dr. Sarah Chen', specialty: 'Cardiologist', rating: 4.9, reviews: 312, icon: 'heart', color: '#EF4444', experience: '12 yrs' },
  { id: '2', name: 'Dr. James Okoro', specialty: 'Dermatologist', rating: 4.8, reviews: 204, icon: 'flask', color: '#8B5CF6', experience: '8 yrs' },
  { id: '3', name: 'Dr. Amina Bello', specialty: 'Pediatrician', rating: 5.0, reviews: 189, icon: 'happy', color: '#22C55E', experience: '10 yrs' },
];

const UPCOMING = { doctor: 'Dr. Sarah Chen', specialty: 'Cardiologist', time: 'Today, 4:30 PM' };

export default function HomeScreen({ navigation }: { navigation: any }) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, Sunkanmi 👋</Text>
            <Text style={styles.heroTitle}>Your Health First</Text>
          </View>
          <TouchableOpacity style={styles.notifBtn}>
            <Ionicons name="notifications-outline" size={24} color={Colors.textPrimary} />
            <View style={styles.notifDot} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <TouchableOpacity style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color={Colors.textMuted} />
          <Text style={styles.searchText}>Search doctors, specialties...</Text>
          <View style={styles.filterBtn}>
            <Ionicons name="options-outline" size={18} color={Colors.primary} />
          </View>
        </TouchableOpacity>

        {/* Upcoming Banner */}
        <View style={styles.upcomingCard}>
          <View style={styles.upcomingTop}>
            <View style={styles.upcomingIconBox}>
              <Ionicons name="videocam" size={24} color={Colors.white} />
            </View>
            <View>
              <Text style={styles.upcomingLabel}>UPCOMING CONSULT</Text>
              <Text style={styles.upcomingTime}>{UPCOMING.time}</Text>
            </View>
          </View>
          <View style={styles.upcomingBottom}>
            <View>
              <Text style={styles.upcomingDoctor}>{UPCOMING.doctor}</Text>
              <Text style={styles.upcomingSpecialty}>{UPCOMING.specialty}</Text>
            </View>
            <TouchableOpacity
              style={styles.joinBtn}
              onPress={() => navigation.navigate('Consultation', { doctor: { name: UPCOMING.doctor } })}
            >
              <Ionicons name="videocam" size={16} color={Colors.white} />
              <Text style={styles.joinBtnText}>Join Now</Text>
            </TouchableOpacity>
          </View>
          {/* Glow overlay */}
          <View style={styles.cardGlowTopLeft} />
          <View style={styles.cardGlowBottomRight} />
        </View>

        {/* Categories */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <TouchableOpacity><Text style={styles.seeAll}>See all</Text></TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesScroll}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity key={cat.id} style={styles.categoryItem}>
              <View style={[styles.categoryIcon, { backgroundColor: cat.color + '20' }]}>
                <Ionicons name={cat.icon as any} size={28} color={cat.color} />
              </View>
              <Text style={styles.categoryLabel}>{cat.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Top Doctors */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Top Doctors</Text>
          <TouchableOpacity><Text style={styles.seeAll}>See all</Text></TouchableOpacity>
        </View>

        {DOCTORS.map((doc) => (
          <TouchableOpacity
            key={doc.id}
            style={styles.doctorCard}
            onPress={() => navigation.navigate('DoctorDetail', { doctor: doc })}
            activeOpacity={0.85}
          >
            <View style={[styles.doctorAvatar, { backgroundColor: doc.color + '20' }]}>
              <Ionicons name={doc.icon as any} size={32} color={doc.color} />
            </View>
            <View style={styles.doctorInfo}>
              <Text style={styles.doctorName}>{doc.name}</Text>
              <Text style={styles.doctorSpecialty}>{doc.specialty}</Text>
              <View style={styles.doctorMeta}>
                <Ionicons name="star" size={13} color="#F59E0B" />
                <Text style={styles.doctorRating}>{doc.rating}</Text>
                <Text style={styles.doctorReviews}>· {doc.reviews} reviews</Text>
                <View style={styles.expBadge}>
                  <Text style={styles.expText}>{doc.experience}</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity style={styles.bookQuickBtn}>
              <Ionicons name="calendar" size={18} color={Colors.primary} />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingBottom: 100 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg, paddingTop: 64, paddingBottom: Spacing.lg,
  },
  greeting: { ...Typography.body1, color: Colors.textSecondary },
  heroTitle: { ...Typography.heading1, color: Colors.textPrimary },
  notifBtn: {
    width: 50, height: 50, borderRadius: 25,
    backgroundColor: Colors.surfaceElevated, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: Colors.border,
  },
  notifDot: {
    position: 'absolute', top: 10, right: 10,
    width: 10, height: 10, borderRadius: 5,
    backgroundColor: Colors.primary, borderWidth: 2, borderColor: Colors.surfaceElevated,
  },
  searchBar: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: Spacing.lg, height: 56,
    backgroundColor: Colors.surfaceElevated, borderRadius: Radii.xl,
    paddingLeft: Spacing.md, paddingRight: Spacing.sm,
    borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.xl,
    gap: Spacing.sm,
  },
  searchText: { ...Typography.body1, color: Colors.textMuted, flex: 1 },
  filterBtn: {
    width: 36, height: 36, borderRadius: Radii.md,
    backgroundColor: Colors.primaryGhost, alignItems: 'center', justifyContent: 'center',
  },
  upcomingCard: {
    marginHorizontal: Spacing.lg, borderRadius: Radii.xl, padding: Spacing.lg,
    backgroundColor: Colors.primary, marginBottom: Spacing.xl, overflow: 'hidden',
    ...Shadows.md,
  },
  upcomingTop: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.lg },
  upcomingIconBox: {
    width: 48, height: 48, borderRadius: Radii.md,
    backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center',
  },
  upcomingLabel: { ...Typography.caption, color: 'rgba(255,255,255,0.65)', fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' },
  upcomingTime: { ...Typography.body1, color: Colors.white, fontWeight: '700' },
  upcomingBottom: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: Radii.lg, padding: Spacing.md,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)',
  },
  upcomingDoctor: { ...Typography.body1, color: Colors.white, fontWeight: '700' },
  upcomingSpecialty: { ...Typography.caption, color: 'rgba(255,255,255,0.7)' },
  joinBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: Colors.primaryDark, paddingVertical: 10, paddingHorizontal: Spacing.md, borderRadius: Radii.md,
  },
  joinBtnText: { ...Typography.body2, color: Colors.white, fontWeight: '700' },
  cardGlowTopLeft: {
    position: 'absolute', width: 100, height: 100, borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.08)', top: -30, left: -20,
  },
  cardGlowBottomRight: {
    position: 'absolute', width: 150, height: 150, borderRadius: 75,
    backgroundColor: 'rgba(255,255,255,0.05)', bottom: -60, right: -30,
  },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: Spacing.lg, marginBottom: Spacing.md,
  },
  sectionTitle: { ...Typography.heading4, color: Colors.textPrimary },
  seeAll: { ...Typography.body2, color: Colors.primary },
  categoriesScroll: { paddingHorizontal: Spacing.lg, gap: 16, paddingBottom: Spacing.xl },
  categoryItem: { alignItems: 'center' },
  categoryIcon: {
    width: 64, height: 64, borderRadius: Radii.lg, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.sm,
    borderWidth: 1, borderColor: Colors.border,
  },
  categoryLabel: { ...Typography.caption, color: Colors.textSecondary, fontWeight: '600' },
  doctorCard: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: Spacing.lg, marginBottom: Spacing.sm,
    backgroundColor: Colors.surfaceElevated, borderRadius: Radii.lg, padding: Spacing.md,
    borderWidth: 1, borderColor: Colors.border,
  },
  doctorAvatar: {
    width: 64, height: 64, borderRadius: Radii.md, alignItems: 'center', justifyContent: 'center',
  },
  doctorInfo: { flex: 1, marginLeft: Spacing.md },
  doctorName: { ...Typography.body1, color: Colors.textPrimary, fontWeight: '700' },
  doctorSpecialty: { ...Typography.body2, color: Colors.textSecondary },
  doctorMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 4 },
  doctorRating: { ...Typography.caption, color: '#F59E0B', fontWeight: '700' },
  doctorReviews: { ...Typography.caption, color: Colors.textMuted },
  expBadge: {
    marginLeft: 6, backgroundColor: Colors.primaryGhost,
    paddingHorizontal: 8, paddingVertical: 2, borderRadius: Radii.full,
  },
  expText: { ...Typography.caption, color: Colors.primaryLight, fontWeight: '600' },
  bookQuickBtn: {
    width: 40, height: 40, borderRadius: Radii.md,
    backgroundColor: Colors.primaryGhost, alignItems: 'center', justifyContent: 'center',
  },
});
