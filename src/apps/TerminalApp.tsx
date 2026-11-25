import { useEffect } from 'react';
import { AuthProvider } from '../contexts/AuthContext';
import { LanguageProvider } from '../contexts/LanguageContext';
import { DataProvider } from '../contexts/DataContext';
import Terminal from '../components/Terminal';
import { trackVisitor } from '../services/dataService';

export default function TerminalApp() {
  useEffect(() => { trackVisitor(); }, []);
  return (
    <AuthProvider>
      <LanguageProvider>
        <DataProvider>
          <div className="app">
            <Terminal />
          </div>
        </DataProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}
