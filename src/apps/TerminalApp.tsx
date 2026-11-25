import { useEffect } from 'react';
import { AuthProvider } from '../contexts/AuthContext';
import { LanguageProvider } from '../contexts/LanguageContext';
import { DataProvider } from '../contexts/DataContext';
import Terminal from '../components/Terminal';
import { trackVisitor } from '../services/dataService';

export default function TerminalApp() {
  useEffect(() => { trackVisitor(); }, []);

  // Lock the page itself while the terminal is on screen: the terminal body is
  // the ONLY scroll region, so there is no second (page) scrollbar on mobile,
  // and iOS can't rubber-band the whole document behind the terminal.
  useEffect(() => {
    const root = document.documentElement;
    const { body } = document;
    root.classList.add('terminal-active');
    body.classList.add('terminal-active');
    return () => {
      root.classList.remove('terminal-active');
      body.classList.remove('terminal-active');
    };
  }, []);

  return (
    <AuthProvider>
      <LanguageProvider>
        <DataProvider>
          <div className="app app--terminal">
            <Terminal />
          </div>
        </DataProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}
