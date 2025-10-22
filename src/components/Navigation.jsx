import { motion } from 'framer-motion';
import spaceTheme from '../theme';

const sections = [
  { id: 0, name: 'Overview' },
  { id: 1, name: 'Work Experience' },
  { id: 2, name: 'Education' },
  { id: 3, name: 'Testimonials' },
  { id: 4, name: 'Contact' },
];

const Navigation = ({ currentSection, onNavigate }) => {
  return (
    <motion.nav
      className="navigation-container"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      style={{
        position: 'fixed',
        right: '2rem',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: spaceTheme.zIndex.navigation,
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
      }}
    >
      {sections.map((section) => (
        <motion.div
          key={section.id}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            cursor: 'pointer',
          }}
          onClick={() => onNavigate(section.id)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* İsim */}
          <motion.span
            className="navigation-label"
            initial={{ opacity: 0, x: 20 }}
            animate={{
              opacity: currentSection === section.id ? 1 : 0,
              x: currentSection === section.id ? 0 : 20,
            }}
            transition={{ duration: 0.3 }}
            style={{
              fontFamily: spaceTheme.fonts.display,
              fontSize: spaceTheme.fontSizes.sm,
              fontWeight: 600,
              color: spaceTheme.colors.primary,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              whiteSpace: 'nowrap',
              textShadow: currentSection === section.id
                ? spaceTheme.shadows.glow
                : 'none',
            }}
          >
            {section.name}
          </motion.span>

          {/* Nokta */}
          <motion.div
            className={`navigation-dot ${currentSection === section.id ? 'active' : ''}`}
            style={{
              width: currentSection === section.id ? '12px' : '8px',
              height: currentSection === section.id ? '12px' : '8px',
              borderRadius: '50%',
              background: currentSection === section.id
                ? spaceTheme.gradients.primary
                : spaceTheme.colors.textMuted,
              boxShadow: currentSection === section.id
                ? spaceTheme.shadows.glow
                : 'none',
              transition: 'all 0.3s ease',
            }}
            whileHover={{
              scale: 1.5,
              boxShadow: spaceTheme.shadows.glow,
            }}
          />
        </motion.div>
      ))}

      {/* Dekoratif çizgi */}
      <div
        style={{
          position: 'absolute',
          right: '5px',
          top: 0,
          width: '2px',
          height: '100%',
          background: `linear-gradient(180deg, transparent 0%, ${spaceTheme.colors.primary}40 50%, transparent 100%)`,
          zIndex: -1,
        }}
      />
    </motion.nav>
  );
};

export default Navigation;
