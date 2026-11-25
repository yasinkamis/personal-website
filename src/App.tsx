import { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { DataProvider } from './contexts/DataContext';
import Terminal from './components/Terminal';
import GatePage from './pages/GatePage';
const ClassicSite = lazy(() => import('./pages/ClassicSite'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
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

/** Reset scroll to the top on every route change. */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function BlogApp({ single }: { single?: boolean }) {
  return (
    <LanguageProvider>
      <Suspense fallback={<div style={{ minHeight: '100vh', background: '#02050b' }} />}>
        {single ? <BlogPost /> : <Blog />}
      </Suspense>
    </LanguageProvider>
  );
}

function App() {
  return (
    <>
    <ScrollToTop />
    <Routes>
      <Route path="/" element={<GatePage />} />
      <Route path="/terminal" element={<TerminalApp />} />
      <Route path="/classic" element={<ClassicApp />} />
      <Route path="/blog" element={<BlogApp />} />
      <Route path="/blog/:slug" element={<BlogApp single />} />
    </Routes>
    </>
  );
}

export default App;
