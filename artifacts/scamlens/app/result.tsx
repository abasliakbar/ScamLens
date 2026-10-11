import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAnalysisHistory } from '@/context/AnalysisContext';
import { riskColorKey } from '@/lib/analysis';
import { useColors } from '@/hooks/useColors';

function formatDate(date: string) {
  return new Date(date).toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function ResultScreen() {
  const colors = useColors();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { analyses } = useAnalysisHistory();
  const analysis = analyses.find((item) => item.id === id);

  if (!analysis) {
    return (
      <SafeAreaView
        edges={['top', 'bottom']}
        style={[
          styles.safeArea,
          { backgroundColor: colors.background },
          Platform.OS === 'web' && { paddingTop: 67, paddingBottom: 34 },
        ]}
      >
        <View style={styles.notFound}>
          <View style={[styles.topBar, { borderBottomColor: colors.border }]}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Go back"
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <Feather name="arrow-left" size={20} color={colors.foreground} />
            </Pressable>
            <Text style={[styles.topTitle, { color: colors.foreground }]}>Analysis</Text>
          </View>
          <View style={styles.notFoundBody}>
            <Text style={[styles.resultTitle, { color: colors.foreground }]}>
              Result not found
            </Text>
            <Text style={[styles.bodyText, { color: colors.mutedForeground }]}>
              This result may have been cleared from this device.
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const tone = riskColorKey(analysis.risk);
  const riskColor = colors[tone];
  const riskBackground = colors[`${tone}Bg` as 'riskLowBg' | 'riskMediumBg' | 'riskHighBg'];

  return (
    <SafeAreaView
      edges={['top', 'bottom', 'left', 'right']}
      style={[
        styles.safeArea,
        { backgroundColor: colors.background },
        Platform.OS === 'web' && { paddingTop: 67, paddingBottom: 34 },
      ]}
    >
      <View style={[styles.topBar, { borderBottomColor: colors.border }]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          testID="result-back"
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.topTitle, { color: colors.foreground }]}>Analysis</Text>
        <View style={styles.topBarSpacer} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={[styles.eyebrow, { color: colors.primary }]}>DEMO INDICATOR</Text>
        <Text style={[styles.resultTitle, { color: colors.foreground }]}>
          Review the signals
        </Text>
        <Text style={[styles.timestamp, { color: colors.mutedForeground }]}>
          Checked {formatDate(analysis.createdAt)}
        </Text>

        <View
          accessibilityLabel={`${analysis.risk} risk indicator`}
          style={[styles.riskCard, { backgroundColor: riskBackground }]}
        >
          <View style={[styles.riskIcon, { backgroundColor: colors.card }]}>
            <Feather
              name={analysis.risk === 'Low' ? 'shield' : 'alert-triangle'}
              size={23}
              color={riskColor}
            />
          </View>
          <View style={styles.riskCopy}>
            <Text style={[styles.riskCaption, { color: riskColor }]}>INDICATED RISK</Text>
            <Text style={[styles.riskTitle, { color: riskColor }]}>{analysis.risk}</Text>
          </View>
          <View style={[styles.riskBadge, { borderColor: riskColor }]}>
            <Text style={[styles.riskBadgeText, { color: riskColor }]}>DEMO</Text>
          </View>
        </View>

        <View style={styles.sectionHeading}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            What stood out
          </Text>
          <View style={[styles.signalCountPill, { backgroundColor: colors.secondary }]}>
            <Text style={[styles.signalCountText, { color: colors.secondaryForeground }]}>
              {analysis.signals.length} {analysis.signals.length === 1 ? 'signal' : 'signals'}
            </Text>
          </View>
        </View>

        <View style={styles.signalList}>
          {analysis.signals.map((signal, index) => (
            <View
              key={signal.id}
              style={[
                styles.signalCard,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <View style={[styles.signalNumber, { backgroundColor: colors.secondary }]}>
                <Text style={[styles.signalNumberText, { color: colors.primary }]}>
                  {String(index + 1).padStart(2, '0')}
                </Text>
              </View>
              <View style={styles.signalCopy}>
                <Text style={[styles.signalTitle, { color: colors.foreground }]}>
                  {signal.title}
                </Text>
                <Text style={[styles.signalDetail, { color: colors.mutedForeground }]}>
                  {signal.detail}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View
          style={[
            styles.messageCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <View style={styles.messageHeading}>
            <Feather name="file-text" size={15} color={colors.mutedForeground} />
            <Text style={[styles.messageLabel, { color: colors.mutedForeground }]}>
              REVIEWED TEXT
            </Text>
          </View>
          <Text style={[styles.messageText, { color: colors.foreground }]}>
            {analysis.content}
          </Text>
        </View>

        <View
          style={[
            styles.cautionCard,
            { backgroundColor: colors.secondary, borderColor: colors.border },
          ]}
        >
          <Feather name="info" size={17} color={colors.primary} />
          <Text style={[styles.cautionText, { color: colors.secondaryForeground }]}>
            {analysis.risk === 'Low'
              ? 'Low means these limited demo rules found few warning signs. It does not mean this message or link is safe.'
              : 'This is an educational indicator, not proof that a message or link is a scam. Verify independently before acting.'}
          </Text>
        </View>

        <Pressable
          accessibilityRole="button"
          testID="back-to-check"
          onPress={() => router.replace('/(tabs)')}
          style={({ pressed }) => [
            styles.doneButton,
            { backgroundColor: colors.primary },
            pressed && styles.pressed,
          ]}
        >
          <Feather name="search" size={17} color={colors.primaryForeground} />
          <Text style={[styles.doneButtonText, { color: colors.primaryForeground }]}>
            Check another message
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  topBar: {
    minHeight: 54,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backButton: { width: 42, height: 42, alignItems: 'center', justifyContent: 'center', marginLeft: -8 },
  topTitle: { flex: 1, textAlign: 'center', fontFamily: 'Inter_600SemiBold', fontSize: 14 },
  topBarSpacer: { width: 34 },
  scrollContent: { padding: 20, paddingBottom: 36 },
  eyebrow: { fontFamily: 'Inter_700Bold', fontSize: 10, letterSpacing: 1.6, marginTop: 8 },
  resultTitle: { fontFamily: 'Inter_700Bold', fontSize: 27, letterSpacing: -0.7, marginTop: 7 },
  timestamp: { fontFamily: 'Inter_400Regular', fontSize: 11, marginTop: 5, marginBottom: 19 },
  riskCard: {
    minHeight: 102,
    borderRadius: 19,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
  },
  riskIcon: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  riskCopy: { flex: 1 },
  riskCaption: { fontFamily: 'Inter_700Bold', fontSize: 9, letterSpacing: 1.1 },
  riskTitle: { fontFamily: 'Inter_700Bold', fontSize: 25, marginTop: 2 },
  riskBadge: { borderWidth: 1, paddingHorizontal: 8, paddingVertical: 5, borderRadius: 8 },
  riskBadgeText: { fontFamily: 'Inter_700Bold', fontSize: 8, letterSpacing: 0.8 },
  sectionHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 25, marginBottom: 11 },
  sectionTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 16 },
  signalCountPill: { paddingHorizontal: 9, paddingVertical: 6, borderRadius: 12 },
  signalCountText: { fontFamily: 'Inter_600SemiBold', fontSize: 10 },
  signalList: { gap: 9 },
  signalCard: { borderWidth: 1, borderRadius: 16, padding: 13, flexDirection: 'row', alignItems: 'flex-start', gap: 11 },
  signalNumber: { width: 30, height: 30, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  signalNumberText: { fontFamily: 'Inter_700Bold', fontSize: 9 },
  signalCopy: { flex: 1, paddingTop: 1 },
  signalTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 12 },
  signalDetail: { fontFamily: 'Inter_400Regular', fontSize: 11, lineHeight: 17, marginTop: 5 },
  messageCard: { borderWidth: 1, borderRadius: 16, padding: 14, marginTop: 17 },
  messageHeading: { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 9 },
  messageLabel: { fontFamily: 'Inter_700Bold', fontSize: 9, letterSpacing: 1.1 },
  messageText: { fontFamily: 'Inter_400Regular', fontSize: 12, lineHeight: 19 },
  cautionCard: { flexDirection: 'row', gap: 10, padding: 13, marginTop: 12, borderRadius: 14, borderWidth: 1 },
  cautionText: { flex: 1, fontFamily: 'Inter_400Regular', fontSize: 11, lineHeight: 17 },
  doneButton: { minHeight: 51, borderRadius: 15, marginTop: 19, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9 },
  doneButtonText: { fontFamily: 'Inter_600SemiBold', fontSize: 13 },
  pressed: { opacity: 0.78 },
  notFound: { flex: 1 },
  notFoundBody: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 28 },
  bodyText: { fontFamily: 'Inter_400Regular', fontSize: 13, lineHeight: 19, textAlign: 'center', marginTop: 8 },
});
