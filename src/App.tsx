import { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import GatePage from './pages/GatePage';
import './App.css';

// Everything except the landing gate loads on demand, so the gate (and its 3D
// scene) is the only thing in the initial payload — firebase, the terminal, the
// classic site and the blog are each their own lazy chunk.
const TerminalApp = lazy(() => import('./apps/TerminalApp'));
const ClassicApp = lazy(() => import('./apps/ClassicApp'));
const BlogApp = lazy(() => import('./apps/BlogApp'));

const Fallback = () => <div style={{ minHeight: '100vh', background: '#02050b' }} />;

/** Reset scroll to the top on every route change. */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function App() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<Fallback />}>
        <Routes>
          <Route path="/" element={<GatePage />} />
          <Route path="/terminal" element={<TerminalApp />} />
          <Route path="/classic" element={<ClassicApp />} />
          <Route path="/blog" element={<BlogApp />} />
          <Route path="/blog/:slug" element={<BlogApp single />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
