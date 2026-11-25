import { useEffect } from 'react';
import { LanguageProvider } from '../contexts/LanguageContext';
import { DataProvider } from '../contexts/DataContext';
import { trackVisitor } from '../services/dataService';
import ClassicSite from '../pages/ClassicSite';

export default function ClassicApp() {
  useEffect(() => { trackVisitor(); }, []);
  return (
    <LanguageProvider>
      <DataProvider>
        <ClassicSite />
      </DataProvider>
    </LanguageProvider>
  );
}
