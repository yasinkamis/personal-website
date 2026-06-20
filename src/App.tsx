import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { DataProvider } from './contexts/DataContext';
import Terminal from './components/Terminal';
import GatePage from './pages/GatePage';
import ClassicSite from './pages/ClassicSite';
import { trackVisitor } from './services/dataService';
import './App.css';

function TerminalApp() {
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

function ClassicApp() {
  useEffect(() => {
    trackVisitor();
  }, []);

  return (
    <LanguageProvider>
      <DataProvider>
        <ClassicSite />
      </DataProvider>
    </LanguageProvider>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<GatePage />} />
      <Route path="/terminal" element={<TerminalApp />} />
      <Route path="/classic" element={<ClassicApp />} />
    </Routes>
  );
}

export default App;
