import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type { Analysis } from '@/lib/analysis';

const STORAGE_KEY = 'scamlens.analysis-history.v1';
const MAX_HISTORY_ITEMS = 50;

type AnalysisContextValue = {
  analyses: Analysis[];
  isReady: boolean;
  storageWarning: string | null;
  addAnalysis: (analysis: Analysis) => void;
  clearHistory: () => Promise<void>;
};

const AnalysisContext = createContext<AnalysisContextValue | null>(null);

export function AnalysisProvider({ children }: { children: ReactNode }) {
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [storageWarning, setStorageWarning] = useState<string | null>(null);
  const analysesRef = useRef<Analysis[]>([]);

  useEffect(() => {
    let active = true;

    AsyncStorage.getItem(STORAGE_KEY)
      .then((saved) => {
        if (!active || !saved) return;
        const parsed: unknown = JSON.parse(saved);
        if (!Array.isArray(parsed)) {
          throw new Error('Saved history has an unexpected format.');
        }
        const valid = parsed.filter(
          (item): item is Analysis =>
            typeof item === 'object' &&
            item !== null &&
            typeof item.id === 'string' &&
            typeof item.content === 'string' &&
            ['Low', 'Medium', 'High'].includes(item.risk) &&
            Array.isArray(item.signals) &&
            typeof item.createdAt === 'string',
        );
        analysesRef.current = valid.slice(0, MAX_HISTORY_ITEMS);
        setAnalyses(analysesRef.current);
      })
      .catch(() => {
        if (active) {
          setStorageWarning('Saved history could not be read on this device.');
        }
      })
      .finally(() => {
        if (active) setIsReady(true);
      });

    return () => {
      active = false;
    };
  }, []);

  const addAnalysis = useCallback((analysis: Analysis) => {
    const next = [analysis, ...analysesRef.current].slice(0, MAX_HISTORY_ITEMS);
    analysesRef.current = next;
    setAnalyses(next);
    void AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {
      setStorageWarning('This result is visible now but could not be saved to history.');
    });
  }, []);

  const clearHistory = useCallback(async () => {
    analysesRef.current = [];
    setAnalyses([]);
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setStorageWarning(null);
    } catch {
      setStorageWarning('History was cleared for this session but could not be removed from this device.');
    }
  }, []);

  const value = useMemo(
    () => ({ analyses, isReady, storageWarning, addAnalysis, clearHistory }),
    [analyses, isReady, storageWarning, addAnalysis, clearHistory],
  );

  return <AnalysisContext.Provider value={value}>{children}</AnalysisContext.Provider>;
}

export function useAnalysisHistory() {
  const value = useContext(AnalysisContext);
  if (!value) {
    throw new Error('useAnalysisHistory must be used inside AnalysisProvider.');
  }
  return value;
}
