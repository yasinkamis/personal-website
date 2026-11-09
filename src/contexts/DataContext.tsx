import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { getPortfolioData } from '../services/dataService';
import { useLanguage } from './LanguageContext';
import type { PortfolioData } from '../types';
import { initialDataEN, initialDataTR, getInitialData } from '../data/defaultData';


interface DataContextType {
  data: PortfolioData | null;
  setData: (data: PortfolioData) => void;
  refreshData: () => Promise<void>;
  loading: boolean;
}

const DataContext = createContext<DataContextType | null>(null);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const { language } = useLanguage();
  const [data, setData] = useState<PortfolioData | null>(getInitialData(language));
  const [loading, setLoading] = useState(true);

  const refreshData = useCallback(async () => {
    /* local dev without Firebase env: use the built-in data, skip the network */
    if (import.meta.env.DEV && !import.meta.env.VITE_FIREBASE_API_KEY) {
      setData(getInitialData(language));
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const firebaseData = await getPortfolioData();
      if (firebaseData) {
        setData(firebaseData);
      } else {
        // Use initial data based on language if Firebase data is not available
        setData(getInitialData(language));
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
      setData(getInitialData(language));
    } finally {
      setLoading(false);
    }
  }, [language]);

  // Update data when language changes
  useEffect(() => {
    // Only update to local data if Firebase data is not available
    setData(getInitialData(language));
  }, [language]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const value: DataContextType = {
    data,
    setData,
    refreshData,
    loading,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export { initialDataEN, initialDataTR, getInitialData };
