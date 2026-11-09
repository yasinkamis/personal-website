import { useEffect, lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { DataProvider } from './contexts/DataContext';
import Terminal from './components/Terminal';
import GatePage from './pages/GatePage';
const ClassicSite = lazy(() => import('./pages/ClassicSite'));
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
        <Suspense fallback={<div style={{ minHeight: '100vh', background: '#02050b' }} />}>
          <ClassicSite />
        </Suspense>
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
