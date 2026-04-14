import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, StatusBar, SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radii } from '../theme';

export default function ConsultationRoom({ navigation, route }: { navigation: any; route: any }) {
  const doctor = route.params?.doctor || { name: 'Dr. Sarah Chen' };
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setDuration((d) => d + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const fmt = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Remote video mock */}
      <View style={styles.remoteVideo}>
        <View style={styles.avatarCircle}>
          <Ionicons name="person" size={100} color={Colors.surfaceHighlight} />
        </View>
        <View style={styles.glowTop} />
        <View style={styles.glowBottom} />
      </View>

      {/* Overlay */}
      <SafeAreaView style={StyleSheet.absoluteFillObject}>
        {/* Top bar */}
        <View style={styles.topBar}>
          <View>
            <View style={styles.livePill}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>LIVE</Text>
            </View>
            <Text style={styles.docName}>{doctor.name}</Text>
            <Text style={styles.duration}>{fmt(duration)}</Text>
          </View>
          <TouchableOpacity style={styles.chatBtn}>
            <Ionicons name="chatbubble-ellipses" size={22} color={Colors.white} />
            <View style={styles.chatNotif} />
          </TouchableOpacity>
        </View>

        {/* Quality badge */}
        <View style={styles.qualityBadge}>
          <Ionicons name="wifi" size={12} color={Colors.success} />
          <Text style={styles.qualityText}>HD</Text>
        </View>

        <View style={styles.bottom}>
          {/* Local preview */}
          <View style={styles.localPreview}>
            {!videoOn ? (
              <View style={styles.localOff}>
                <Ionicons name="videocam-off" size={22} color={Colors.textMuted} />
              </View>
            ) : (
              <View style={styles.localPlaceholder}>
                <Ionicons name="person" size={36} color={Colors.surfaceHighlight} />
              </View>
            )}
            <View style={styles.localBorder} />
            <View style={styles.localYouLabel}>
              <Text style={styles.localYouText}>You</Text>
            </View>
          </View>

          {/* Controls */}
          <View style={styles.controls}>
            <TouchableOpacity
              style={[styles.controlBtn, !micOn && styles.controlBtnOff]}
              onPress={() => setMicOn(!micOn)}
            >
              <Ionicons name={micOn ? 'mic' : 'mic-off'} size={24} color={Colors.white} />
              <Text style={styles.controlLabel}>{micOn ? 'Mute' : 'Unmute'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.controlBtn, !videoOn && styles.controlBtnOff]}
              onPress={() => setVideoOn(!videoOn)}
            >
              <Ionicons name={videoOn ? 'videocam' : 'videocam-off'} size={24} color={Colors.white} />
              <Text style={styles.controlLabel}>{videoOn ? 'Video' : 'No Video'}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.controlBtn}>
              <Ionicons name="volume-high" size={24} color={Colors.white} />
              <Text style={styles.controlLabel}>Speaker</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.endCallBtn} onPress={() => navigation.goBack()}>
              <View style={styles.endCallIcon}>
                <Ionicons name="call" size={28} color={Colors.white} style={{ transform: [{ rotate: '135deg' }] }} />
              </View>
              <Text style={styles.controlLabel}>End</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0C14' },
  remoteVideo: { flex: 1, backgroundColor: '#12152A', alignItems: 'center', justifyContent: 'center' },
  avatarCircle: {
    width: 180, height: 180, borderRadius: 90,
    backgroundColor: Colors.surfaceElevated, alignItems: 'center', justifyContent: 'center',
  },
  glowTop: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 200,
    backgroundColor: 'rgba(26, 111, 232, 0.12)',
  },
  glowBottom: {
    position: 'absolute', bottom: 0, left: 0, right: 0, height: 350,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  topBar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
    paddingHorizontal: Spacing.lg, paddingTop: 20,
  },
  livePill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(239, 68, 68, 0.2)', paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 6, marginBottom: 8, alignSelf: 'flex-start',
  },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.danger },
  liveText: { ...Typography.caption, color: Colors.danger, fontWeight: '800', fontSize: 10, letterSpacing: 1 },
  docName: { ...Typography.heading3, color: Colors.white },
  duration: { ...Typography.body2, color: 'rgba(255,255,255,0.6)', marginTop: 4 },
  chatBtn: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center',
  },
  chatNotif: {
    position: 'absolute', top: 10, right: 10, width: 10, height: 10, borderRadius: 5,
    backgroundColor: Colors.accent, borderWidth: 2, borderColor: '#12152A',
  },
  qualityBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-end',
    marginRight: Spacing.lg, backgroundColor: 'rgba(34, 197, 94, 0.15)',
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: Radii.full,
  },
  qualityText: { ...Typography.caption, color: Colors.success, fontWeight: '700' },
  bottom: { flex: 1, justifyContent: 'flex-end', paddingBottom: 30, paddingHorizontal: Spacing.lg },
  localPreview: {
    width: 100, height: 140, borderRadius: Radii.lg, backgroundColor: '#1E2130',
    alignSelf: 'flex-end', marginBottom: Spacing.xl, overflow: 'hidden',
  },
  localOff: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  localPlaceholder: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  localBorder: {
    ...StyleSheet.absoluteFillObject, borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.15)', borderRadius: Radii.lg,
  },
  localYouLabel: {
    position: 'absolute', bottom: 6, left: 0, right: 0, alignItems: 'center',
  },
  localYouText: { ...Typography.caption, color: 'rgba(255,255,255,0.6)', fontSize: 10 },
  controls: {
    flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 36, padding: 12,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
  },
  controlBtn: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center',
    gap: 4,
  },
  controlBtnOff: { backgroundColor: Colors.danger },
  controlLabel: { ...Typography.caption, color: 'rgba(255,255,255,0.6)', fontSize: 9, marginTop: 2 },
  endCallBtn: { alignItems: 'center', gap: 4 },
  endCallIcon: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: Colors.danger, alignItems: 'center', justifyContent: 'center',
  },
});
