import { useState, useEffect, useRef } from 'react';
import StarField from './components/StarField';
import Navigation from './components/Navigation';
import Overview from './sections/Overview';
import WorkExperience from './sections/WorkExperience';
import Education from './sections/Education';
import Testimonials from './sections/Testimonials';
import Contact from './sections/Contact';
import portfolioData from './data/portfolio.json';

function App() {
  const [currentSection, setCurrentSection] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const containerRef = useRef(null);
  const touchStartY = useRef(0);

  const sections = [Overview, WorkExperience, Education, Testimonials, Contact];

  // Mouse wheel handler
  const handleWheel = (e) => {
    if (isScrolling) return;

    // Eğer scroll event'i scrollable bir element'ten geliyorsa, kontrol et
    let element = e.target;
    while (element && element !== containerRef.current) {
      const hasOverflow = element.scrollHeight > element.clientHeight;
      const overflowY = getComputedStyle(element).overflowY;
      const isScrollable = hasOverflow && (overflowY === 'auto' || overflowY === 'scroll');

      if (isScrollable) {
        // Element scrollable, ama scroll pozisyonunu kontrol et
        const { scrollTop, scrollHeight, clientHeight } = element;
        const isAtTop = scrollTop === 0;
        const isAtBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 1;

        // Yukarı scroll yapıyoruz ve üstte DEĞİLsek, sayfa geçişini engelle
        // Aşağı scroll yapıyoruz ve altta DEĞİLsek, sayfa geçişini engelle
        if ((e.deltaY < 0 && !isAtTop) || (e.deltaY > 0 && !isAtBottom)) {
          return; // Sayfa geçişini engelle, element scroll olsun
        }
      }
      element = element.parentElement;
    }

    e.preventDefault();

    const direction = e.deltaY > 0 ? 1 : -1;
    navigateSection(direction);
  };

  // Touch handlers for mobile
  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    if (isScrolling) return;

    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY.current - touchEndY;

    // Minimum swipe distance
    if (Math.abs(diff) > 50) {
      const direction = diff > 0 ? 1 : -1;
      navigateSection(direction);
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (isScrolling) return;

    if (e.key === 'ArrowDown' || e.key === 'PageDown') {
      e.preventDefault();
      navigateSection(1);
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault();
      navigateSection(-1);
    }
  };

  const navigateSection = (direction) => {
    const nextSection = currentSection + direction;

    if (nextSection >= 0 && nextSection < sections.length) {
      setIsScrolling(true);
      setCurrentSection(nextSection);

      // Prevent rapid scrolling
      setTimeout(() => {
        setIsScrolling(false);
      }, 1000);
    }
  };

  const handleNavigate = (sectionIndex) => {
    if (isScrolling || sectionIndex === currentSection) return;

    setIsScrolling(true);
    setCurrentSection(sectionIndex);

    setTimeout(() => {
      setIsScrolling(false);
    }, 1000);
  };

  useEffect(() => {
    const container = containerRef.current;

    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      container.addEventListener('touchstart', handleTouchStart, { passive: true });
      container.addEventListener('touchend', handleTouchEnd, { passive: true });
      window.addEventListener('keydown', handleKeyDown);

      return () => {
        container.removeEventListener('wheel', handleWheel);
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchend', handleTouchEnd);
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [currentSection, isScrolling]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Starfield arka plan */}
      <StarField />

      {/* Navigation */}
      <Navigation
        currentSection={currentSection}
        onNavigate={handleNavigate}
      />

      {/* Sections Container */}
      <div
        style={{
          width: '100%',
          height: '100vh',
          transform: `translateY(-${currentSection * 100}vh)`,
          transition: 'transform 0.8s cubic-bezier(0.65, 0, 0.35, 1)',
        }}
      >
        {sections.map((Section, index) => (
          <div
            key={index}
            style={{
              width: '100%',
              height: '100vh',
            }}
          >
            <Section data={portfolioData} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
