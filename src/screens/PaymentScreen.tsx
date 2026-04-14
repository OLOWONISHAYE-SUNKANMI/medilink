import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, StatusBar, ActivityIndicator, Platform, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radii, Shadows } from '../theme';

export default function PaymentScreen({ navigation, route }: { navigation: any; route: any }) {
  const { doctor, date, time, type, price } = route.params;
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('card');

  const handlePay = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setSuccess(true); }, 2500);
  };

  const handleFinish = () => {
    navigation.popToTop();
    navigation.navigate('Main', { screen: 'Appointments' });
  };

  if (success) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.successContainer}>
          <View style={styles.successIconOuter}>
            <View style={styles.successIconInner}>
              <Ionicons name="checkmark" size={48} color={Colors.white} />
            </View>
            <View style={styles.successGlow} />
          </View>
          <Text style={styles.successTitle}>Payment Successful!</Text>
          <Text style={styles.successSub}>Your appointment with {doctor.name} has been confirmed.</Text>

          <View style={styles.successCard}>
            <View style={styles.successRow}>
              <Text style={styles.successRowLabel}>Booked with</Text>
              <Text style={styles.successRowValue}>{doctor.name}</Text>
            </View>
            <View style={styles.successDivider} />
            <View style={styles.successRow}>
              <Text style={styles.successRowLabel}>Date & Time</Text>
              <Text style={styles.successRowValue}>{date}, {time}</Text>
            </View>
            <View style={styles.successDivider} />
            <View style={styles.successRow}>
              <Text style={styles.successRowLabel}>Consult Type</Text>
              <Text style={styles.successRowValue}>{type}</Text>
            </View>
            <View style={styles.successDivider} />
            <View style={styles.successRow}>
              <Text style={styles.successRowLabel}>Amount Paid</Text>
              <Text style={[styles.successRowValue, { color: Colors.success, fontWeight: '700' }]}>{price}</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.finishBtn} onPress={handleFinish}>
            <Text style={styles.finishBtnText}>View Appointments</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const METHODS = [
    { id: 'card', label: 'Debit / Credit Card', desc: 'Pay securely with your card', icon: 'card-outline' },
    { id: 'ussd', label: 'USSD Transfer', desc: 'Pay via your bank shortcode', icon: 'phone-portrait-outline' },
    { id: 'wallet', label: 'MediLink Wallet', desc: 'Balance: ₦3,500', icon: 'wallet-outline' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Summary */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Text style={styles.summaryTitle}>Checkout Summary</Text>
            <View style={styles.secureBadge}>
              <Ionicons name="lock-closed" size={12} color={Colors.accent} />
              <Text style={styles.secureText}>Secured</Text>
            </View>
          </View>

          {[
            { label: 'Consultation with', value: doctor.name },
            { label: 'Date', value: date },
            { label: 'Time', value: time },
            { label: 'Type', value: type },
          ].map((r) => (
            <View key={r.label} style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>{r.label}</Text>
              <Text style={styles.summaryValue}>{r.value}</Text>
            </View>
          ))}

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalAmount}>{price}</Text>
          </View>
        </View>

        <Text style={styles.methodsTitle}>Payment Method</Text>
        {METHODS.map((method) => (
          <TouchableOpacity
            key={method.id}
            style={[styles.methodCard, selectedMethod === method.id && styles.methodCardActive]}
            onPress={() => setSelectedMethod(method.id)}
            activeOpacity={0.8}
          >
            <View style={[styles.methodIcon, selectedMethod === method.id && styles.methodIconActive]}>
              <Ionicons name={method.icon as any} size={22} color={selectedMethod === method.id ? Colors.primary : Colors.textSecondary} />
            </View>
            <View style={styles.methodInfo}>
              <Text style={[styles.methodLabel, selectedMethod === method.id && styles.methodLabelActive]}>{method.label}</Text>
              <Text style={styles.methodDesc}>{method.desc}</Text>
            </View>
            <View style={[styles.radioOuter, selectedMethod === method.id && styles.radioOuterActive]}>
              {selectedMethod === method.id && <View style={styles.radioInner} />}
            </View>
          </TouchableOpacity>
        ))}

        <View style={{ height: 110 }} />
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Platform.OS === 'ios' ? 40 : 24 }]}>
        <TouchableOpacity
          style={[styles.payBtn, loading && styles.payBtnLoading]}
          onPress={handlePay}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <>
              <Ionicons name="lock-closed" size={18} color={Colors.white} />
              <Text style={styles.payBtnText}>Pay {price} Securely</Text>
            </>
          )}
        </TouchableOpacity>
        <Text style={styles.poweredBy}>Powered by Paystack</Text>
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
  scroll: { paddingHorizontal: Spacing.lg },
  summaryCard: {
    backgroundColor: Colors.surfaceElevated, borderRadius: Radii.lg, padding: Spacing.lg,
    borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.xl,
  },
  summaryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  summaryTitle: { ...Typography.heading4, color: Colors.textPrimary },
  secureBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.accentGhost, paddingHorizontal: 8, paddingVertical: 4, borderRadius: Radii.full,
  },
  secureText: { ...Typography.caption, color: Colors.accent, fontWeight: '600' },
  summaryRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  summaryLabel: { ...Typography.body2, color: Colors.textSecondary },
  summaryValue: { ...Typography.body2, color: Colors.textPrimary, fontWeight: '600' },
  totalRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: Spacing.md,
  },
  totalLabel: { ...Typography.body1, color: Colors.textPrimary, fontWeight: '700' },
  totalAmount: { ...Typography.heading2, color: Colors.primaryLight },
  methodsTitle: { ...Typography.heading4, color: Colors.textPrimary, marginBottom: Spacing.md },
  methodCard: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.surfaceElevated, borderRadius: Radii.lg, padding: Spacing.md,
    borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.sm,
  },
  methodCardActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryGhost },
  methodIcon: {
    width: 48, height: 48, borderRadius: Radii.md,
    backgroundColor: Colors.surfaceHighlight, alignItems: 'center', justifyContent: 'center',
  },
  methodIconActive: { backgroundColor: Colors.white },
  methodInfo: { flex: 1 },
  methodLabel: { ...Typography.body2, color: Colors.textPrimary, fontWeight: '600' },
  methodLabelActive: { color: Colors.primary },
  methodDesc: { ...Typography.caption, color: Colors.textMuted, marginTop: 2 },
  radioOuter: {
    width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  radioOuterActive: { borderColor: Colors.primary },
  radioInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: Colors.primary },
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: Colors.background, paddingHorizontal: Spacing.lg, paddingTop: Spacing.md,
    borderTopWidth: 1, borderTopColor: Colors.border,
  },
  payBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: Colors.primary, borderRadius: Radii.lg, paddingVertical: 18,
    ...Shadows.md,
  },
  payBtnLoading: { opacity: 0.7 },
  payBtnText: { ...Typography.body1, color: Colors.white, fontWeight: '700' },
  poweredBy: { ...Typography.caption, color: Colors.textMuted, textAlign: 'center', marginTop: 10 },
  // Success styles
  successContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: Spacing.xl },
  successIconOuter: { alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.xl },
  successIconInner: {
    width: 96, height: 96, borderRadius: 48, backgroundColor: Colors.success,
    alignItems: 'center', justifyContent: 'center',
  },
  successGlow: {
    position: 'absolute', width: 130, height: 130, borderRadius: 65,
    backgroundColor: Colors.success + '20', zIndex: -1,
  },
  successTitle: { ...Typography.heading1, color: Colors.textPrimary, textAlign: 'center', marginBottom: Spacing.sm },
  successSub: { ...Typography.body1, color: Colors.textSecondary, textAlign: 'center', marginBottom: Spacing.xl },
  successCard: {
    width: '100%', backgroundColor: Colors.surfaceElevated, borderRadius: Radii.lg, padding: Spacing.lg,
    borderWidth: 1, borderColor: Colors.success + '30', marginBottom: Spacing.xl,
  },
  successRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10 },
  successDivider: { height: 1, backgroundColor: Colors.border },
  successRowLabel: { ...Typography.body2, color: Colors.textSecondary },
  successRowValue: { ...Typography.body2, color: Colors.textPrimary, fontWeight: '600' },
  finishBtn: {
    width: '100%', backgroundColor: Colors.surfaceHighlight,
    paddingVertical: 16, borderRadius: Radii.lg, alignItems: 'center',
    borderWidth: 1, borderColor: Colors.border,
  },
  finishBtnText: { ...Typography.body1, color: Colors.textPrimary, fontWeight: '700' },
});
