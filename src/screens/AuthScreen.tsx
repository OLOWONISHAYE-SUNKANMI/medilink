import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radii } from '../theme';

type AuthStep = 'phone' | 'otp';
type AuthTab = 'login' | 'register';

interface AuthScreenProps {
  navigation: any;
}

const { width } = Dimensions.get('window');

export default function AuthScreen({ navigation }: AuthScreenProps) {
  const [tab, setTab] = useState<AuthTab>('login');
  const [step, setStep] = useState<AuthStep>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'patient' | 'doctor'>('patient');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'otp' && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const handlePhoneSubmit = () => {
    if (phone.length < 10) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep('otp'); setTimer(30); }, 1500);
  };

  const handleOtpSubmit = () => {
    if (otp.length < 4) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); navigation.replace('Main'); }, 1500);
  };

  const renderPhoneStep = () => (
    <View style={{ flex: 1 }}>
      {tab === 'register' && (
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>FULL NAME</Text>
          <View style={[styles.inputRow, focusedField === 'name' && styles.inputRowFocused]}>
            <Ionicons name="person-outline" size={18} color={focusedField === 'name' ? Colors.primary : Colors.textMuted} style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              value={name}
              onChangeText={setName}
              placeholder="Dr. John Smith"
              placeholderTextColor={Colors.textMuted}
              onFocus={() => setFocusedField('name')}
              onBlur={() => setFocusedField(null)}
            />
          </View>
        </View>
      )}

      {tab === 'register' && (
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>I AM A</Text>
          <View style={styles.roleRow}>
            {(['patient', 'doctor'] as const).map((r) => (
              <TouchableOpacity
                key={r}
                style={[styles.roleBtn, role === r && styles.roleBtnActive]}
                onPress={() => setRole(r)}
                activeOpacity={0.8}
              >
                <Ionicons name={r === 'patient' ? 'person' : 'medical'} size={18} color={role === r ? Colors.white : Colors.textSecondary} />
                <Text style={[styles.roleBtnText, role === r && styles.roleBtnTextActive]}>
                  {r === 'patient' ? 'Patient' : 'Doctor'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>PHONE NUMBER</Text>
        <View style={[styles.inputRow, focusedField === 'phone' && styles.inputRowFocused]}>
          <View style={styles.dialCode}>
            <Text style={styles.dialCodeText}>+234</Text>
          </View>
          <TextInput
            style={[styles.textInput, { paddingLeft: Spacing.md }]}
            value={phone}
            onChangeText={setPhone}
            placeholder="801 234 5678"
            placeholderTextColor={Colors.textMuted}
            keyboardType="phone-pad"
            onFocus={() => setFocusedField('phone')}
            onBlur={() => setFocusedField(null)}
            maxLength={11}
          />
        </View>
      </View>

      <TouchableOpacity
        style={[styles.primaryBtn, (phone.length < 10 || loading) && styles.primaryBtnDisabled]}
        onPress={handlePhoneSubmit}
        disabled={phone.length < 10 || loading}
        activeOpacity={0.85}
      >
        {loading ? <ActivityIndicator color={Colors.white} /> : (
          <>
            <Text style={styles.primaryBtnText}>Continue</Text>
            <Ionicons name="arrow-forward" size={20} color={Colors.white} />
          </>
        )}
      </TouchableOpacity>

      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>or continue with</Text>
        <View style={styles.dividerLine} />
      </View>

      <View style={styles.socialRow}>
        {['logo-google', 'logo-apple'].map((icon) => (
          <TouchableOpacity key={icon} style={styles.socialBtn} activeOpacity={0.8}>
            <Ionicons name={icon as any} size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderOtpStep = () => (
    <View style={{ flex: 1 }}>
      <View style={{ marginBottom: Spacing.xl }}>
        <Text style={styles.otpDesc}>
          Enter the 4-digit code sent to{'\n'}
          <Text style={{ color: Colors.textPrimary, fontWeight: '700' }}>+234 {phone}</Text>
        </Text>
        <TouchableOpacity onPress={() => setStep('phone')}>
          <Text style={styles.editLink}>Edit Number</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.otpBoxRow}>
        {[0, 1, 2, 3].map((i) => (
          <View key={i} style={[styles.otpBox, otp.length > i && styles.otpBoxFilled]}>
            <Text style={styles.otpDigit}>{otp[i] || ''}</Text>
          </View>
        ))}
        <TextInput
          style={StyleSheet.absoluteFillObject}
          value={otp}
          onChangeText={(val) => val.length <= 4 && setOtp(val)}
          keyboardType="number-pad"
          autoFocus
          maxLength={4}
          caretHidden
        />
      </View>

      <TouchableOpacity
        style={[styles.primaryBtn, { marginTop: Spacing.xl }, (otp.length < 4 || loading) && styles.primaryBtnDisabled]}
        onPress={handleOtpSubmit}
        disabled={otp.length < 4 || loading}
        activeOpacity={0.85}
      >
        {loading ? <ActivityIndicator color={Colors.white} /> : (
          <>
            <Text style={styles.primaryBtnText}>Verify & Continue</Text>
            <Ionicons name="checkmark-circle" size={20} color={Colors.white} />
          </>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.resendBtn} onPress={() => timer === 0 && setTimer(30)} disabled={timer > 0}>
        <Text style={[styles.resendText, timer > 0 ? { color: Colors.textMuted } : { color: Colors.primary }]}>
          Resend code {timer > 0 ? `in ${timer}s` : ''}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoRow}>
            <View style={styles.logoIcon}>
              <Ionicons name="pulse" size={20} color={Colors.white} />
            </View>
            <Text style={styles.logoText}>MediLink</Text>
          </View>
          <Text style={styles.heroTitle}>
            {step === 'phone' ? (tab === 'login' ? 'Welcome back 👋' : 'Create account 🎉') : 'Verification 🔐'}
          </Text>
          <Text style={styles.heroSub}>
            {step === 'phone'
              ? tab === 'login' ? 'Sign in to continue your healthcare journey' : 'Join thousands getting better care every day'
              : "We've sent a code to your phone"}
          </Text>
        </View>

        {step === 'phone' && (
          <View style={styles.tabRow}>
            {(['login', 'register'] as AuthTab[]).map((t) => (
              <TouchableOpacity
                key={t}
                style={[styles.tabBtn, tab === t && styles.tabBtnActive]}
                onPress={() => setTab(t)}
                activeOpacity={0.8}
              >
                <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
                  {t === 'login' ? 'Sign In' : 'Sign Up'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {step === 'phone' ? renderPhoneStep() : renderOtpStep()}

        {step === 'phone' && (
          <TouchableOpacity style={styles.switchRow} onPress={() => setTab(tab === 'login' ? 'register' : 'login')}>
            <Text style={styles.switchText}>{tab === 'login' ? "Don't have an account? " : 'Already have an account? '}</Text>
            <Text style={styles.switchLink}>{tab === 'login' ? 'Sign Up' : 'Sign In'}</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { flexGrow: 1, paddingHorizontal: Spacing.lg },
  header: { paddingTop: 64, paddingBottom: Spacing.xl },
  logoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.xl },
  logoIcon: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', marginRight: Spacing.sm,
  },
  logoText: { ...Typography.heading3, color: Colors.textPrimary },
  heroTitle: { ...Typography.heading1, color: Colors.textPrimary, marginBottom: Spacing.sm },
  heroSub: { ...Typography.body1, color: Colors.textSecondary },
  tabRow: {
    flexDirection: 'row', backgroundColor: Colors.surfaceElevated,
    borderRadius: Radii.lg, padding: 4, marginBottom: Spacing.lg,
  },
  tabBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: Radii.md },
  tabBtnActive: { backgroundColor: Colors.primary },
  tabText: { ...Typography.body2, fontWeight: '600', color: Colors.textSecondary },
  tabTextActive: { color: Colors.white },
  fieldGroup: { marginBottom: Spacing.md },
  fieldLabel: { ...Typography.caption, color: Colors.textSecondary, fontWeight: '700', letterSpacing: 1, marginBottom: 8 },
  inputRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.surfaceElevated, borderRadius: Radii.md,
    borderWidth: 1, borderColor: Colors.border, height: 52,
  },
  inputRowFocused: { borderColor: Colors.primary, backgroundColor: Colors.primaryGhost },
  inputIcon: { marginLeft: Spacing.md },
  textInput: { flex: 1, ...Typography.body1, color: Colors.textPrimary, height: '100%', paddingHorizontal: Spacing.sm },
  dialCode: { paddingHorizontal: Spacing.md, borderRightWidth: 1, borderRightColor: Colors.border, height: '100%', justifyContent: 'center' },
  dialCodeText: { ...Typography.body1, color: Colors.textPrimary, fontWeight: '700' },
  roleRow: { flexDirection: 'row', gap: Spacing.sm },
  roleBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    paddingVertical: 12, borderRadius: Radii.md, borderWidth: 1,
    backgroundColor: Colors.surfaceElevated, borderColor: Colors.border,
  },
  roleBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  roleBtnText: { ...Typography.body2, fontWeight: '600', color: Colors.textSecondary },
  roleBtnTextActive: { color: Colors.white },
  primaryBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: Colors.primary, borderRadius: Radii.lg, paddingVertical: 16, marginTop: Spacing.md,
  },
  primaryBtnDisabled: { opacity: 0.5 },
  primaryBtnText: { ...Typography.body1, color: Colors.white, fontWeight: '700' },
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: Spacing.lg },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.border },
  dividerText: { ...Typography.body2, color: Colors.textMuted, marginHorizontal: Spacing.md },
  socialRow: { flexDirection: 'row', justifyContent: 'center', gap: Spacing.md },
  socialBtn: {
    width: 52, height: 52, borderRadius: Radii.md,
    borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.surfaceElevated,
    alignItems: 'center', justifyContent: 'center',
  },
  otpDesc: { ...Typography.body1, color: Colors.textSecondary, lineHeight: 26, marginBottom: 8 },
  editLink: { ...Typography.body2, color: Colors.primary, fontWeight: '600' },
  otpBoxRow: { flexDirection: 'row', justifyContent: 'space-between', height: 64, marginBottom: Spacing.xl },
  otpBox: {
    width: '22%', height: '100%', backgroundColor: Colors.surfaceElevated,
    borderRadius: Radii.lg, borderWidth: 1, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  otpBoxFilled: { borderColor: Colors.primary, backgroundColor: Colors.primaryGhost },
  otpDigit: { ...Typography.heading2, color: Colors.primary },
  resendBtn: { alignSelf: 'center', marginTop: Spacing.lg },
  resendText: { ...Typography.body2, fontWeight: '600' },
  switchRow: { flexDirection: 'row', justifyContent: 'center', paddingVertical: Spacing.xl },
  switchText: { ...Typography.body2, color: Colors.textSecondary },
  switchLink: { ...Typography.body2, color: Colors.primary, fontWeight: '700' },
});
