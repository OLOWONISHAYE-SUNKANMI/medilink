import React, { useState, useEffect, useRef } from 'react';
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
  Animated,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, Typography, Spacing, Radii } from '../theme';

// ─── Types ────────────────────────────────────────────────────────────────────
type AuthTab  = 'login' | 'register';
// Login flow:    phone → biometric (if registered) | otp
// Register flow: phone → otp → setPassword
type LoginStep    = 'phone' | 'otp' | 'biometric';
type RegisterStep = 'phone' | 'otp' | 'setPassword';
type AuthStep = LoginStep | RegisterStep;

interface AuthScreenProps { navigation: any; }

const { width } = Dimensions.get('window');
const STORAGE_KEY_REGISTERED = 'medilink_registered_phones';
const STORAGE_KEY_PASSWORD    = 'medilink_password_';

// ─── Helpers ──────────────────────────────────────────────────────────────────
async function isPhoneRegistered(phone: string): Promise<boolean> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY_REGISTERED);
    const list: string[] = raw ? JSON.parse(raw) : [];
    return list.includes(phone);
  } catch { return false; }
}

async function registerPhone(phone: string, password: string) {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY_REGISTERED);
    const list: string[] = raw ? JSON.parse(raw) : [];
    if (!list.includes(phone)) list.push(phone);
    await AsyncStorage.setItem(STORAGE_KEY_REGISTERED, JSON.stringify(list));
    await AsyncStorage.setItem(STORAGE_KEY_PASSWORD + phone, password);
  } catch {}
}

async function getStoredPassword(phone: string): Promise<string | null> {
  try { return await AsyncStorage.getItem(STORAGE_KEY_PASSWORD + phone); }
  catch { return null; }
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function AuthScreen({ navigation }: AuthScreenProps) {
  const [tab,           setTab]           = useState<AuthTab>('login');
  const [step,          setStep]          = useState<AuthStep>('phone');
  const [phone,         setPhone]         = useState('');
  const [otp,           setOtp]           = useState('');
  const [name,          setName]          = useState('');
  const [role,          setRole]          = useState<'patient' | 'doctor'>('patient');
  const [password,      setPassword]      = useState('');
  const [confirmPwd,    setConfirmPwd]    = useState('');
  const [inputPwd,      setInputPwd]      = useState('');
  const [showPwd,       setShowPwd]       = useState(false);
  const [showConfirm,   setShowConfirm]   = useState(false);
  const [showInputPwd,  setShowInputPwd]  = useState(false);
  const [loading,       setLoading]       = useState(false);
  const [timer,         setTimer]         = useState(30);
  const [focusedField,  setFocusedField]  = useState<string | null>(null);
  const [biometricType, setBiometricType] = useState<'face' | 'fingerprint' | null>(null);
  const [biometricAvail,setBiometricAvail]= useState(false);

  // Pulse animation for biometric icon
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim  = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    checkBiometrics();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'otp' && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  useEffect(() => {
    if (step === 'biometric') {
      startPulse();
      triggerBiometric();
    }
  }, [step]);

  async function checkBiometrics() {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    const enrolled   = await LocalAuthentication.isEnrolledAsync();
    if (compatible && enrolled) {
      setBiometricAvail(true);
      const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
      if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
        setBiometricType('face');
      } else {
        setBiometricType('fingerprint');
      }
    }
  }

  function startPulse() {
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(pulseAnim, { toValue: 1.08, duration: 900, useNativeDriver: true }),
          Animated.timing(glowAnim,  { toValue: 1,    duration: 900, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(pulseAnim, { toValue: 1,    duration: 900, useNativeDriver: true }),
          Animated.timing(glowAnim,  { toValue: 0,    duration: 900, useNativeDriver: true }),
        ]),
      ])
    ).start();
  }

  async function triggerBiometric() {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage:  `MediLink — Verify your identity`,
        cancelLabel:    'Use Password',
        fallbackLabel:  'Use Password',
        disableDeviceFallback: false,
      });
      if (result.success) {
        setLoading(true);
        setTimeout(() => { setLoading(false); navigation.replace('Main'); }, 800);
      }
      // if cancelled / failed → user stays on biometric screen with "Use Password" option
    } catch {}
  }

  // ── Login flow ──────────────────────────────────────────────────────────────
  async function handleLoginPhoneSubmit() {
    if (phone.length < 10) return;
    setLoading(true);
    const registered = await isPhoneRegistered(phone);
    setTimeout(() => {
      setLoading(false);
      if (registered && biometricAvail) {
        setStep('biometric');
      } else {
        setStep('otp');
        setTimer(30);
      }
    }, 1000);
  }

  function handleLoginOtpSubmit() {
    if (otp.length < 4) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); navigation.replace('Main'); }, 1200);
  }

  async function handlePasswordLogin() {
    const stored = await getStoredPassword(phone);
    if (inputPwd === stored) {
      setLoading(true);
      setTimeout(() => { setLoading(false); navigation.replace('Main'); }, 800);
    } else {
      Alert.alert('Incorrect Password', 'The password you entered is wrong. Please try again.');
    }
  }

  // ── Register flow ───────────────────────────────────────────────────────────
  function handleRegisterPhoneSubmit() {
    if (phone.length < 10) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep('otp'); setTimer(30); }, 1200);
  }

  function handleRegisterOtpSubmit() {
    if (otp.length < 4) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep('setPassword'); }, 800);
  }

  async function handleSetPassword() {
    if (password.length < 6) {
      Alert.alert('Weak Password', 'Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPwd) {
      Alert.alert('Mismatch', 'Passwords do not match.');
      return;
    }
    setLoading(true);
    await registerPhone(phone, password);
    setTimeout(() => { setLoading(false); navigation.replace('Main'); }, 1000);
  }

  function handleTabSwitch(newTab: AuthTab) {
    setTab(newTab);
    setStep('phone');
    setOtp(''); setPassword(''); setConfirmPwd(''); setInputPwd('');
  }

  // ─── Render helpers ─────────────────────────────────────────────────────────

  // Shared phone input (login / register)
  const renderPhoneInput = () => (
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
  );

  // ── Login → phone step ──────────────────────────────────────────────────────
  const renderLoginPhone = () => (
    <View style={{ flex: 1 }}>
      {renderPhoneInput()}

      <TouchableOpacity
        style={[styles.primaryBtn, (phone.length < 10 || loading) && styles.primaryBtnDisabled]}
        onPress={handleLoginPhoneSubmit}
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
        {biometricAvail && (
          <TouchableOpacity
            style={styles.socialBtn}
            activeOpacity={0.8}
            onPress={() => {
              if (phone.length >= 10) {
                setStep('biometric');
              } else {
                Alert.alert('Enter Phone', 'Please enter your phone number first.');
              }
            }}
          >
            <Ionicons
              name={biometricType === 'face' ? 'scan-outline' : 'finger-print-outline'}
              size={22}
              color={Colors.primary}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  // ── Login → biometric step ──────────────────────────────────────────────────
  const renderBiometric = () => {
    const icon = biometricType === 'face' ? 'scan' : 'finger-print';
    const label = biometricType === 'face' ? 'Face ID' : 'Touch ID';

    const glowStyle = {
      opacity: glowAnim,
      shadowColor: Colors.primary,
      shadowRadius: 30,
      shadowOpacity: 1,
      shadowOffset: { width: 0, height: 0 },
    };

    return (
      <View style={styles.biometricContainer}>
        {/* Biometric icon with pulse */}
        <Animated.View style={[styles.biometricRing, glowStyle, { transform: [{ scale: pulseAnim }] }]}>
          <View style={styles.biometricIconWrap}>
            <Ionicons name={icon as any} size={52} color={Colors.primary} />
          </View>
        </Animated.View>

        <Text style={styles.biometricTitle}>{label} Verification</Text>
        <Text style={styles.biometricDesc}>
          Authenticate with your {label} to access your MediLink account securely.
        </Text>

        {loading ? (
          <ActivityIndicator color={Colors.primary} size="large" style={{ marginTop: Spacing.xl }} />
        ) : (
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={triggerBiometric}
            activeOpacity={0.85}
          >
            <Ionicons name={icon as any} size={20} color={Colors.white} />
            <Text style={styles.primaryBtnText}>Authenticate with {label}</Text>
          </TouchableOpacity>
        )}

        {/* Divider */}
        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Password fallback */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>PASSWORD</Text>
          <View style={[styles.inputRow, focusedField === 'inputPwd' && styles.inputRowFocused]}>
            <Ionicons name="lock-closed-outline" size={18} color={focusedField === 'inputPwd' ? Colors.primary : Colors.textMuted} style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              value={inputPwd}
              onChangeText={setInputPwd}
              placeholder="Enter your password"
              placeholderTextColor={Colors.textMuted}
              secureTextEntry={!showInputPwd}
              onFocus={() => setFocusedField('inputPwd')}
              onBlur={() => setFocusedField(null)}
            />
            <TouchableOpacity onPress={() => setShowInputPwd(!showInputPwd)} style={styles.eyeBtn}>
              <Ionicons name={showInputPwd ? 'eye-off-outline' : 'eye-outline'} size={18} color={Colors.textMuted} />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.outlineBtn, !inputPwd && styles.primaryBtnDisabled]}
          onPress={handlePasswordLogin}
          disabled={!inputPwd}
          activeOpacity={0.85}
        >
          <Ionicons name="lock-closed" size={18} color={Colors.primary} />
          <Text style={styles.outlineBtnText}>Sign in with Password</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.resendBtn} onPress={() => { setStep('phone'); setInputPwd(''); }}>
          <Ionicons name="arrow-back-outline" size={16} color={Colors.textMuted} />
          <Text style={[styles.resendText, { color: Colors.textMuted }]}>  Back to Phone</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // ── OTP Step ────────────────────────────────────────────────────────────────
  const renderOtp = (onSubmit: () => void) => (
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
        onPress={onSubmit}
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

  // ── Register → set password step ────────────────────────────────────────────
  const renderSetPassword = () => (
    <View style={{ flex: 1 }}>
      {/* Badge */}
      <View style={styles.successBadge}>
        <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
        <Text style={styles.successBadgeText}>Phone verified successfully!</Text>
      </View>

      <Text style={styles.setPwdSubtitle}>
        Create a secure password to protect your account. You'll also use Face ID or Touch ID on future logins.
      </Text>

      {/* Password field */}
      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>CREATE PASSWORD</Text>
        <View style={[styles.inputRow, focusedField === 'pwd' && styles.inputRowFocused]}>
          <Ionicons name="lock-closed-outline" size={18} color={focusedField === 'pwd' ? Colors.primary : Colors.textMuted} style={styles.inputIcon} />
          <TextInput
            style={styles.textInput}
            value={password}
            onChangeText={setPassword}
            placeholder="Min. 6 characters"
            placeholderTextColor={Colors.textMuted}
            secureTextEntry={!showPwd}
            onFocus={() => setFocusedField('pwd')}
            onBlur={() => setFocusedField(null)}
          />
          <TouchableOpacity onPress={() => setShowPwd(!showPwd)} style={styles.eyeBtn}>
            <Ionicons name={showPwd ? 'eye-off-outline' : 'eye-outline'} size={18} color={Colors.textMuted} />
          </TouchableOpacity>
        </View>
        {/* Strength indicator */}
        <View style={styles.strengthRow}>
          {[1, 2, 3, 4].map((lvl) => {
            const strength = Math.min(4, Math.floor(password.length / 3));
            const color = strength >= lvl
              ? strength >= 3 ? Colors.success : strength >= 2 ? Colors.warning : Colors.danger
              : Colors.border;
            return <View key={lvl} style={[styles.strengthBar, { backgroundColor: color }]} />;
          })}
          <Text style={styles.strengthLabel}>
            {password.length === 0 ? '' : password.length < 4 ? 'Weak' : password.length < 8 ? 'Fair' : password.length < 12 ? 'Good' : 'Strong'}
          </Text>
        </View>
      </View>

      {/* Confirm password field */}
      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>CONFIRM PASSWORD</Text>
        <View style={[styles.inputRow, focusedField === 'confirmPwd' && styles.inputRowFocused,
          confirmPwd.length > 0 && confirmPwd !== password && styles.inputRowError]}>
          <Ionicons name="shield-checkmark-outline" size={18}
            color={focusedField === 'confirmPwd' ? Colors.primary : Colors.textMuted} style={styles.inputIcon} />
          <TextInput
            style={styles.textInput}
            value={confirmPwd}
            onChangeText={setConfirmPwd}
            placeholder="Re-enter password"
            placeholderTextColor={Colors.textMuted}
            secureTextEntry={!showConfirm}
            onFocus={() => setFocusedField('confirmPwd')}
            onBlur={() => setFocusedField(null)}
          />
          <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)} style={styles.eyeBtn}>
            <Ionicons name={showConfirm ? 'eye-off-outline' : 'eye-outline'} size={18} color={Colors.textMuted} />
          </TouchableOpacity>
        </View>
        {confirmPwd.length > 0 && confirmPwd !== password && (
          <Text style={styles.errorText}>Passwords do not match</Text>
        )}
      </View>

      {/* Biometric hint */}
      {biometricAvail && (
        <View style={styles.biometricHintRow}>
          <Ionicons name={biometricType === 'face' ? 'scan-outline' : 'finger-print-outline'} size={18} color={Colors.accent} />
          <Text style={styles.biometricHintText}>
            {biometricType === 'face' ? 'Face ID' : 'Touch ID'} will be automatically enabled for future logins.
          </Text>
        </View>
      )}

      <TouchableOpacity
        style={[styles.primaryBtn, loading && styles.primaryBtnDisabled]}
        onPress={handleSetPassword}
        disabled={loading}
        activeOpacity={0.85}
      >
        {loading ? <ActivityIndicator color={Colors.white} /> : (
          <>
            <Text style={styles.primaryBtnText}>Create Account</Text>
            <Ionicons name="rocket-outline" size={20} color={Colors.white} />
          </>
        )}
      </TouchableOpacity>
    </View>
  );

  // ── Register → phone step ───────────────────────────────────────────────────
  const renderRegisterPhone = () => (
    <View style={{ flex: 1 }}>
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

      {renderPhoneInput()}

      <TouchableOpacity
        style={[styles.primaryBtn, (phone.length < 10 || loading) && styles.primaryBtnDisabled]}
        onPress={handleRegisterPhoneSubmit}
        disabled={phone.length < 10 || loading}
        activeOpacity={0.85}
      >
        {loading ? <ActivityIndicator color={Colors.white} /> : (
          <>
            <Text style={styles.primaryBtnText}>Send OTP</Text>
            <Ionicons name="arrow-forward" size={20} color={Colors.white} />
          </>
        )}
      </TouchableOpacity>
    </View>
  );

  // ── Step title helper ───────────────────────────────────────────────────────
  const heroContent = () => {
    if (step === 'biometric') {
      return { title: 'Secure Login 🔒', sub: 'Use biometrics or your password to sign in' };
    }
    if (step === 'setPassword') {
      return { title: 'Set Password 🛡️', sub: 'One last step to secure your account' };
    }
    if (tab === 'login') {
      return step === 'phone'
        ? { title: 'Welcome back 👋', sub: 'Sign in to continue your healthcare journey' }
        : { title: 'Verification 🔐', sub: "We've sent a code to your phone" };
    }
    return step === 'phone'
      ? { title: 'Create account 🎉', sub: 'Join thousands getting better care every day' }
      : step === 'otp'
      ? { title: 'Verification 🔐', sub: "We've sent a code to your phone" }
      : { title: 'Set Password 🛡️', sub: 'One last step to secure your account' };
  };

  const { title, sub } = heroContent();

  // ── Main render ─────────────────────────────────────────────────────────────
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
          <Text style={styles.heroTitle}>{title}</Text>
          <Text style={styles.heroSub}>{sub}</Text>
        </View>

        {/* Tab row — only on phone step */}
        {step === 'phone' && (
          <View style={styles.tabRow}>
            {(['login', 'register'] as AuthTab[]).map((t) => (
              <TouchableOpacity
                key={t}
                style={[styles.tabBtn, tab === t && styles.tabBtnActive]}
                onPress={() => handleTabSwitch(t)}
                activeOpacity={0.8}
              >
                <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
                  {t === 'login' ? 'Sign In' : 'Sign Up'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Step content */}
        {tab === 'login' && step === 'phone'    && renderLoginPhone()}
        {tab === 'login' && step === 'otp'      && renderOtp(handleLoginOtpSubmit)}
        {tab === 'login' && step === 'biometric' && renderBiometric()}

        {tab === 'register' && step === 'phone'       && renderRegisterPhone()}
        {tab === 'register' && step === 'otp'         && renderOtp(handleRegisterOtpSubmit)}
        {tab === 'register' && step === 'setPassword' && renderSetPassword()}

        {/* Switch tab footer */}
        {step === 'phone' && (
          <TouchableOpacity style={styles.switchRow} onPress={() => handleTabSwitch(tab === 'login' ? 'register' : 'login')}>
            <Text style={styles.switchText}>{tab === 'login' ? "Don't have an account? " : 'Already have an account? '}</Text>
            <Text style={styles.switchLink}>{tab === 'login' ? 'Sign Up' : 'Sign In'}</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: Colors.background },
  scroll:       { flexGrow: 1, paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xxl },
  header:       { paddingTop: 64, paddingBottom: Spacing.xl },
  logoRow:      { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.xl },
  logoIcon: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', marginRight: Spacing.sm,
  },
  logoText:     { ...Typography.heading3, color: Colors.textPrimary },
  heroTitle:    { ...Typography.heading1, color: Colors.textPrimary, marginBottom: Spacing.sm },
  heroSub:      { ...Typography.body1, color: Colors.textSecondary },

  tabRow: {
    flexDirection: 'row', backgroundColor: Colors.surfaceElevated,
    borderRadius: Radii.lg, padding: 4, marginBottom: Spacing.lg,
  },
  tabBtn:       { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: Radii.md },
  tabBtnActive: { backgroundColor: Colors.primary },
  tabText:      { ...Typography.body2, fontWeight: '600', color: Colors.textSecondary },
  tabTextActive:{ color: Colors.white },

  fieldGroup:   { marginBottom: Spacing.md },
  fieldLabel:   { ...Typography.caption, color: Colors.textSecondary, fontWeight: '700', letterSpacing: 1, marginBottom: 8 },
  inputRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.surfaceElevated, borderRadius: Radii.md,
    borderWidth: 1, borderColor: Colors.border, height: 52,
  },
  inputRowFocused: { borderColor: Colors.primary, backgroundColor: Colors.primaryGhost },
  inputRowError:   { borderColor: Colors.danger },
  inputIcon:       { marginLeft: Spacing.md },
  eyeBtn:          { paddingHorizontal: Spacing.md },
  textInput: {
    flex: 1, ...Typography.body1, color: Colors.textPrimary,
    height: '100%', paddingHorizontal: Spacing.sm,
  },
  dialCode: {
    paddingHorizontal: Spacing.md, borderRightWidth: 1, borderRightColor: Colors.border,
    height: '100%', justifyContent: 'center',
  },
  dialCodeText: { ...Typography.body1, color: Colors.textPrimary, fontWeight: '700' },

  roleRow:         { flexDirection: 'row', gap: Spacing.sm },
  roleBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    paddingVertical: 12, borderRadius: Radii.md, borderWidth: 1,
    backgroundColor: Colors.surfaceElevated, borderColor: Colors.border,
  },
  roleBtnActive:     { backgroundColor: Colors.primary, borderColor: Colors.primary },
  roleBtnText:       { ...Typography.body2, fontWeight: '600', color: Colors.textSecondary },
  roleBtnTextActive: { color: Colors.white },

  primaryBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: Colors.primary, borderRadius: Radii.lg, paddingVertical: 16, marginTop: Spacing.md,
  },
  primaryBtnDisabled: { opacity: 0.5 },
  primaryBtnText:     { ...Typography.body1, color: Colors.white, fontWeight: '700' },

  outlineBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    borderWidth: 1.5, borderColor: Colors.primary, borderRadius: Radii.lg, paddingVertical: 14, marginTop: Spacing.sm,
  },
  outlineBtnText: { ...Typography.body1, color: Colors.primary, fontWeight: '700' },

  dividerRow:  { flexDirection: 'row', alignItems: 'center', marginVertical: Spacing.lg },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.border },
  dividerText: { ...Typography.body2, color: Colors.textMuted, marginHorizontal: Spacing.md },

  socialRow: { flexDirection: 'row', justifyContent: 'center', gap: Spacing.md },
  socialBtn: {
    width: 52, height: 52, borderRadius: Radii.md,
    borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.surfaceElevated,
    alignItems: 'center', justifyContent: 'center',
  },

  otpDesc:    { ...Typography.body1, color: Colors.textSecondary, lineHeight: 26, marginBottom: 8 },
  editLink:   { ...Typography.body2, color: Colors.primary, fontWeight: '600' },
  otpBoxRow:  { flexDirection: 'row', justifyContent: 'space-between', height: 64, marginBottom: Spacing.xl },
  otpBox: {
    width: '22%', height: '100%', backgroundColor: Colors.surfaceElevated,
    borderRadius: Radii.lg, borderWidth: 1, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  otpBoxFilled: { borderColor: Colors.primary, backgroundColor: Colors.primaryGhost },
  otpDigit:     { ...Typography.heading2, color: Colors.primary },
  resendBtn:    { flexDirection: 'row', alignSelf: 'center', alignItems: 'center', marginTop: Spacing.lg },
  resendText:   { ...Typography.body2, fontWeight: '600' },

  // ── Biometric screen ──
  biometricContainer: { alignItems: 'center', paddingTop: Spacing.md, width: '100%' },
  biometricRing: {
    width: 140, height: 140, borderRadius: 70,
    borderWidth: 2, borderColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  biometricIconWrap: {
    width: 110, height: 110, borderRadius: 55,
    backgroundColor: Colors.primaryGhost,
    alignItems: 'center', justifyContent: 'center',
  },
  biometricTitle: {
    ...Typography.heading2, color: Colors.textPrimary,
    textAlign: 'center', marginBottom: Spacing.sm,
  },
  biometricDesc: {
    ...Typography.body1, color: Colors.textSecondary,
    textAlign: 'center', lineHeight: 24,
    marginBottom: Spacing.lg, paddingHorizontal: Spacing.md,
  },

  // ── Set password screen ──
  successBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: 'rgba(34, 197, 94, 0.1)', borderRadius: Radii.md,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
    marginBottom: Spacing.md, borderWidth: 1, borderColor: 'rgba(34, 197, 94, 0.25)',
  },
  successBadgeText: { ...Typography.body2, color: Colors.success, fontWeight: '600' },
  setPwdSubtitle: {
    ...Typography.body2, color: Colors.textSecondary, lineHeight: 20,
    marginBottom: Spacing.lg,
  },
  strengthRow: {
    flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 8,
  },
  strengthBar: {
    flex: 1, height: 3, borderRadius: 2,
  },
  strengthLabel: {
    ...Typography.caption, color: Colors.textMuted, marginLeft: 4, minWidth: 36,
  },
  errorText: {
    ...Typography.caption, color: Colors.danger, marginTop: 4,
  },
  biometricHintRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: Colors.accentGhost, borderRadius: Radii.md,
    padding: Spacing.md, marginBottom: Spacing.md,
    borderWidth: 1, borderColor: 'rgba(0,201,167,0.2)',
  },
  biometricHintText: {
    ...Typography.body2, color: Colors.accentLight, flex: 1, lineHeight: 18,
  },

  switchRow:  { flexDirection: 'row', justifyContent: 'center', paddingVertical: Spacing.xl },
  switchText: { ...Typography.body2, color: Colors.textSecondary },
  switchLink: { ...Typography.body2, color: Colors.primary, fontWeight: '700' },
});
