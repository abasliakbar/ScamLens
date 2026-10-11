import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAnalysisHistory } from '@/context/AnalysisContext';
import { analyzeText, EXAMPLE_MESSAGES, type Analysis } from '@/lib/analysis';
import { useColors } from '@/hooks/useColors';

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { addAnalysis, isReady } = useAnalysisHistory();
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const canAnalyze = text.trim().length > 0 && isReady && !isAnalyzing;

  const runAnalysis = async () => {
    const content = text.trim();
    if (!content || !isReady || isAnalyzing) return;

    setIsAnalyzing(true);
    Keyboard.dismiss();
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    const result = analyzeText(content);
    const analysis: Analysis = {
      ...result,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt: new Date().toISOString(),
    };
    addAnalysis(analysis);
    setIsAnalyzing(false);
    router.push({ pathname: '/result', params: { id: analysis.id } });
  };

  const applyExample = (example: string) => {
    setText(example);
  };

  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      style={[
        styles.safeArea,
        { backgroundColor: colors.background },
        Platform.OS === 'web' && {
          paddingTop: 67,
          paddingBottom: 34,
        },
      ]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topBar}>
          <View style={[styles.brandMark, { backgroundColor: colors.secondary }]}>
            <Feather name="shield" size={19} color={colors.primary} />
          </View>
          <View style={styles.brandText}>
            <Text style={[styles.brandName, { color: colors.foreground }]}>ScamLens</Text>
            <Text style={[styles.brandTagline, { color: colors.mutedForeground }]}>
              Pause. Check. Decide.
            </Text>
          </View>
          <View style={styles.localPill}>
            <View style={[styles.localDot, { backgroundColor: colors.riskLow }]} />
            <Text style={[styles.localLabel, { color: colors.secondaryForeground }]}>
              On-device
            </Text>
          </View>
        </View>

        <View style={styles.intro}>
          <Text style={[styles.eyebrow, { color: colors.primary }]}>MESSAGE CHECK</Text>
          <Text style={[styles.headline, { color: colors.foreground }]}>
            Something feel off?
          </Text>
          <Text style={[styles.description, { color: colors.mutedForeground }]}>
            Paste a message or link to see the warning signs this demo can spot.
          </Text>
        </View>

        <View
          style={[
            styles.composer,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <View style={styles.composerHeading}>
            <Feather name="message-square" size={17} color={colors.primary} />
            <Text style={[styles.composerLabel, { color: colors.foreground }]}>
              Message or URL
            </Text>
            <Text style={[styles.optionalLabel, { color: colors.mutedForeground }]}>
              PRIVATE
            </Text>
          </View>
          <TextInput
            accessibilityLabel="Message or URL to analyze"
            testID="message-input"
            value={text}
            onChangeText={setText}
            placeholder="Paste the full message or link here…"
            placeholderTextColor={colors.mutedForeground}
            multiline
            maxLength={4000}
            textAlignVertical="top"
            style={[
              styles.input,
              {
                color: colors.foreground,
                backgroundColor: colors.background,
                borderColor: colors.border,
              },
            ]}
            returnKeyType="default"
          />
          <View style={styles.composerFooter}>
            <Text style={[styles.charCount, { color: colors.mutedForeground }]}>
              {text.length}/4,000
            </Text>
            {text.length > 0 && (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Clear message"
                testID="clear-message"
                hitSlop={8}
                onPress={() => setText('')}
                style={styles.clearButton}
              >
                <Feather name="x-circle" size={17} color={colors.mutedForeground} />
                <Text style={[styles.clearText, { color: colors.mutedForeground }]}>
                  Clear
                </Text>
              </Pressable>
            )}
          </View>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: !canAnalyze, busy: isAnalyzing }}
          testID="analyze-button"
          disabled={!canAnalyze}
          onPress={runAnalysis}
          style={({ pressed }) => [
            styles.analyzeButton,
            { backgroundColor: colors.primary },
            !canAnalyze && { opacity: 0.48 },
            pressed && canAnalyze && styles.pressed,
          ]}
        >
          {isAnalyzing ? (
            <ActivityIndicator color={colors.primaryForeground} />
          ) : (
            <>
              <Feather name="search" size={19} color={colors.primaryForeground} />
              <Text style={[styles.analyzeText, { color: colors.primaryForeground }]}>
                Analyze message
              </Text>
              <Feather name="arrow-right" size={18} color={colors.primaryForeground} />
            </>
          )}
        </Pressable>

        <View style={styles.privacyNote}>
          <Feather name="lock" size={14} color={colors.mutedForeground} />
          <Text style={[styles.privacyText, { color: colors.mutedForeground }]}>
            Your text stays on this device. Analysis uses simple demo rules.
          </Text>
        </View>

        <View style={styles.examplesHeader}>
          <View>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Try an example
            </Text>
            <Text style={[styles.sectionHint, { color: colors.mutedForeground }]}>
              Tap one to fill the checker
            </Text>
          </View>
          <Feather name="arrow-down-left" size={18} color={colors.mutedForeground} />
        </View>

        <View style={styles.examples}>
          {EXAMPLE_MESSAGES.map((example, index) => (
            <Pressable
              key={example.label}
              accessibilityRole="button"
              accessibilityLabel={`Use example: ${example.label}`}
              testID={`example-${index + 1}`}
              onPress={() => applyExample(example.message)}
              style={({ pressed }) => [
                styles.exampleCard,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
                pressed && styles.pressed,
              ]}
            >
              <View style={[styles.exampleIcon, { backgroundColor: colors.accent }]}>
                <Feather
                  name={index === 0 ? 'alert-triangle' : index === 1 ? 'package' : 'user'}
                  size={16}
                  color={colors.accentForeground}
                />
              </View>
              <View style={styles.exampleCopy}>
                <Text style={[styles.exampleTitle, { color: colors.foreground }]}>
                  {example.label}
                </Text>
                <Text
                  numberOfLines={1}
                  style={[styles.examplePreview, { color: colors.mutedForeground }]}
                >
                  {example.message}
                </Text>
              </View>
              <Feather name="plus" size={18} color={colors.primary} />
            </Pressable>
          ))}
        </View>

        <View
          style={[
            styles.disclaimer,
            { backgroundColor: colors.secondary, borderColor: colors.border },
          ]}
        >
          <Feather name="info" size={17} color={colors.primary} />
          <Text style={[styles.disclaimerText, { color: colors.secondaryForeground }]}>
            ScamLens is an educational risk indicator, not a security scanner. No result
            can guarantee a message or link is safe or unsafe.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 112 },
  topBar: { flexDirection: 'row', alignItems: 'center', marginBottom: 29 },
  brandMark: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandText: { marginLeft: 10, flex: 1 },
  brandName: { fontFamily: 'Inter_700Bold', fontSize: 17, letterSpacing: -0.3 },
  brandTagline: { fontFamily: 'Inter_400Regular', fontSize: 11, marginTop: 2 },
  localPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: 'rgba(40, 118, 95, 0.10)',
  },
  localDot: { width: 6, height: 6, borderRadius: 3 },
  localLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 11 },
  intro: { marginBottom: 20 },
  eyebrow: { fontFamily: 'Inter_700Bold', fontSize: 10, letterSpacing: 1.8, marginBottom: 9 },
  headline: { fontFamily: 'Inter_700Bold', fontSize: 30, lineHeight: 37, letterSpacing: -1.1 },
  description: { fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 21, marginTop: 7 },
  composer: { borderWidth: 1, borderRadius: 20, padding: 15 },
  composerHeading: { flexDirection: 'row', alignItems: 'center', gap: 9, marginBottom: 12 },
  composerLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 13, flex: 1 },
  optionalLabel: { fontFamily: 'Inter_700Bold', fontSize: 9, letterSpacing: 1.1 },
  input: {
    minHeight: 126,
    maxHeight: 210,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 13,
    paddingTop: 12,
    paddingBottom: 12,
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    lineHeight: 21,
  },
  composerFooter: { minHeight: 29, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  charCount: { fontFamily: 'Inter_400Regular', fontSize: 10 },
  clearButton: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingVertical: 4 },
  clearText: { fontFamily: 'Inter_500Medium', fontSize: 11 },
  analyzeButton: {
    minHeight: 54,
    marginTop: 13,
    borderRadius: 16,
    paddingHorizontal: 17,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  analyzeText: { fontFamily: 'Inter_600SemiBold', fontSize: 15, flex: 1 },
  pressed: { opacity: 0.78, transform: [{ scale: 0.99 }] },
  privacyNote: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, marginTop: 12 },
  privacyText: { fontFamily: 'Inter_400Regular', fontSize: 11, lineHeight: 16 },
  examplesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 29,
    marginBottom: 12,
  },
  sectionTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 16 },
  sectionHint: { fontFamily: 'Inter_400Regular', fontSize: 11, marginTop: 3 },
  examples: { gap: 9 },
  exampleCard: {
    minHeight: 66,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
  },
  exampleIcon: { width: 35, height: 35, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  exampleCopy: { flex: 1, gap: 4 },
  exampleTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 12 },
  examplePreview: { fontFamily: 'Inter_400Regular', fontSize: 10 },
  disclaimer: {
    flexDirection: 'row',
    gap: 10,
    padding: 13,
    marginTop: 18,
    borderRadius: 15,
    borderWidth: 1,
    alignItems: 'flex-start',
  },
  disclaimerText: { flex: 1, fontFamily: 'Inter_400Regular', fontSize: 11, lineHeight: 17 },
});
