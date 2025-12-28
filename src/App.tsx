import { useEffect } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { DataProvider } from './contexts/DataContext';
import Terminal from './components/Terminal';
import { trackVisitor } from './services/dataService';
import './App.css';

function App() {
  // Track visitor on page load
  useEffect(() => {
    trackVisitor();
  }, []);

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

export default App;
