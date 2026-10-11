import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
  Alert,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAnalysisHistory } from '@/context/AnalysisContext';
import { riskColorKey, type Analysis } from '@/lib/analysis';
import { useColors } from '@/hooks/useColors';

function formatDate(date: string) {
  return new Date(date).toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function HistoryScreen() {
  const colors = useColors();
  const { analyses, clearHistory, isReady, storageWarning } = useAnalysisHistory();

  const confirmClear = () => {
    Alert.alert('Clear analysis history?', 'This removes saved results from this device.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear history', style: 'destructive', onPress: () => void clearHistory() },
    ]);
  };

  const renderItem = ({ item }: { item: Analysis }) => {
    const tone = riskColorKey(item.risk);
    const riskColor = colors[tone];
    const riskBackground = colors[`${tone}Bg` as 'riskLowBg' | 'riskMediumBg' | 'riskHighBg'];
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${item.risk} risk analysis, ${formatDate(item.createdAt)}`}
        testID={`history-item-${item.id}`}
        onPress={() => router.push({ pathname: '/result', params: { id: item.id } })}
        style={({ pressed }) => [
          styles.historyCard,
          { backgroundColor: colors.card, borderColor: colors.border },
          pressed && styles.pressed,
        ]}
      >
        <View style={styles.cardTopLine}>
          <View style={[styles.riskPill, { backgroundColor: riskBackground }]}>
            <View style={[styles.riskDot, { backgroundColor: riskColor }]} />
            <Text style={[styles.riskText, { color: riskColor }]}>{item.risk} risk</Text>
          </View>
          <Text style={[styles.dateText, { color: colors.mutedForeground }]}>
            {formatDate(item.createdAt)}
          </Text>
        </View>
        <Text numberOfLines={2} style={[styles.contentPreview, { color: colors.foreground }]}>
          {item.content}
        </Text>
        <View style={styles.cardBottomLine}>
          <Text style={[styles.signalCount, { color: colors.mutedForeground }]}>
            {item.signals.length} {item.signals.length === 1 ? 'signal' : 'signals'} noted
          </Text>
          <Feather name="arrow-up-right" size={16} color={colors.primary} />
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      style={[
        styles.safeArea,
        { backgroundColor: colors.background },
        Platform.OS === 'web' && { paddingTop: 67, paddingBottom: 34 },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.titleGroup}>
          <Text style={[styles.eyebrow, { color: colors.primary }]}>YOUR DEVICE</Text>
          <Text style={[styles.title, { color: colors.foreground }]}>Recent checks</Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            Your past results, saved locally
          </Text>
        </View>
        {analyses.length > 0 && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Clear analysis history"
            testID="clear-history"
            onPress={confirmClear}
            hitSlop={10}
            style={styles.clearHistoryButton}
          >
            <Feather name="trash-2" size={17} color={colors.destructive} />
          </Pressable>
        )}
      </View>

      {storageWarning && (
        <View style={[styles.warning, { backgroundColor: colors.riskMediumBg }]}>
          <Feather name="alert-circle" size={15} color={colors.riskMedium} />
          <Text style={[styles.warningText, { color: colors.riskMedium }]}>{storageWarning}</Text>
        </View>
      )}

      {!isReady ? (
        <View style={styles.emptyState}>
          <Text style={[styles.emptyTitle, { color: colors.foreground }]}>Loading your history</Text>
        </View>
      ) : analyses.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={[styles.emptyIcon, { backgroundColor: colors.secondary }]}>
            <Feather name="clock" size={23} color={colors.primary} />
          </View>
          <Text style={[styles.emptyTitle, { color: colors.foreground }]}>No checks yet</Text>
          <Text style={[styles.emptyCopy, { color: colors.mutedForeground }]}>
            Analyze a message and its result will appear here on this device.
          </Text>
          <Pressable
            accessibilityRole="button"
            testID="start-first-check"
            onPress={() => router.navigate('/(tabs)')}
            style={({ pressed }) => [
              styles.startButton,
              { backgroundColor: colors.primary },
              pressed && styles.pressed,
            ]}
          >
            <Text style={[styles.startButtonText, { color: colors.primaryForeground }]}>
              Check a message
            </Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={analyses}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          scrollEnabled={analyses.length > 0}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: {
    paddingHorizontal: 21,
    paddingTop: 14,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleGroup: { flex: 1 },
  eyebrow: { fontFamily: 'Inter_700Bold', fontSize: 10, letterSpacing: 1.6, marginBottom: 8 },
  title: { fontFamily: 'Inter_700Bold', fontSize: 27, letterSpacing: -0.7 },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 13, marginTop: 5 },
  clearHistoryButton: { padding: 12, marginRight: -8 },
  warning: {
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 12,
    borderRadius: 12,
    flexDirection: 'row',
    gap: 8,
  },
  warningText: { flex: 1, fontFamily: 'Inter_500Medium', fontSize: 11, lineHeight: 16 },
  listContent: { paddingHorizontal: 20, paddingBottom: 110, gap: 10 },
  historyCard: { borderWidth: 1, borderRadius: 17, padding: 14, gap: 12 },
  cardTopLine: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  riskPill: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 9, paddingVertical: 6, borderRadius: 20 },
  riskDot: { width: 6, height: 6, borderRadius: 3 },
  riskText: { fontFamily: 'Inter_600SemiBold', fontSize: 10 },
  dateText: { fontFamily: 'Inter_400Regular', fontSize: 10 },
  contentPreview: { fontFamily: 'Inter_500Medium', fontSize: 13, lineHeight: 19 },
  cardBottomLine: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  signalCount: { fontFamily: 'Inter_400Regular', fontSize: 10 },
  pressed: { opacity: 0.76 },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 34, paddingBottom: 48 },
  emptyIcon: { height: 62, width: 62, borderRadius: 21, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  emptyTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 17 },
  emptyCopy: { fontFamily: 'Inter_400Regular', textAlign: 'center', fontSize: 13, lineHeight: 20, marginTop: 8 },
  startButton: { minHeight: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 18, marginTop: 19 },
  startButtonText: { fontFamily: 'Inter_600SemiBold', fontSize: 13 },
});
