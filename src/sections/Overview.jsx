import { motion } from 'framer-motion';
import spaceTheme from '../theme';

const Overview = ({ data }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
      },
    },
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Dekoratif gradient arka plan */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.3, scale: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className="gradient-orb"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px',
          height: '600px',
          background: spaceTheme.gradients.glow,
          borderRadius: '50%',
          filter: 'blur(100px)',
        }}
      />

      {/* Additional gradient orbs */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.25, scale: 1 }}
        transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
        className="gradient-orb"
        style={{
          position: 'absolute',
          top: '20%',
          right: '10%',
          width: '300px',
          height: '300px',
          background: `radial-gradient(circle, ${spaceTheme.colors.accentPurple}60 0%, transparent 70%)`,
          borderRadius: '50%',
          filter: 'blur(80px)',
        }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.2, scale: 1 }}
        transition={{ duration: 1, ease: 'easeOut', delay: 0.4 }}
        className="gradient-orb"
        style={{
          position: 'absolute',
          bottom: '15%',
          left: '15%',
          width: '250px',
          height: '250px',
          background: `radial-gradient(circle, ${spaceTheme.colors.accentBlue}50 0%, transparent 70%)`,
          borderRadius: '50%',
          filter: 'blur(70px)',
        }}
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{
          maxWidth: '1200px',
          width: '100%',
          textAlign: 'center',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Greeting */}
        <motion.p
          variants={itemVariants}
          className="overview-greeting"
          style={{
            fontSize: spaceTheme.fontSizes.xl,
            color: spaceTheme.colors.textSecondary,
            marginBottom: '1rem',
            fontWeight: 300,
            letterSpacing: '0.1em',
          }}
        >
          {data.overview.greeting}
        </motion.p>

        {/* Name */}
        <motion.h1
          variants={itemVariants}
          className="glow-text overview-name"
          style={{
            fontSize: spaceTheme.fontSizes['7xl'],
            fontFamily: spaceTheme.fonts.display,
            fontWeight: 900,
            background: spaceTheme.gradients.nebula,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '1.5rem',
            lineHeight: 1.2,
          }}
        >
          {data.personal.name}
        </motion.h1>

        {/* Title */}
        <motion.h2
          variants={itemVariants}
          className="overview-title"
          style={{
            fontSize: spaceTheme.fontSizes['3xl'],
            color: spaceTheme.colors.primary,
            fontWeight: 600,
            marginBottom: '2rem',
            textShadow: spaceTheme.shadows.glow,
          }}
        >
          {data.personal.title}
        </motion.h2>

        {/* Description */}
        <motion.p
          variants={itemVariants}
          className="overview-description"
          style={{
            fontSize: spaceTheme.fontSizes.lg,
            color: spaceTheme.colors.textSecondary,
            lineHeight: 1.8,
            maxWidth: '800px',
            margin: '0 auto 4rem',
          }}
        >
          {data.overview.description}
        </motion.p>

        {/* Stats */}
        <motion.div
          variants={itemVariants}
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '4rem',
            flexWrap: 'wrap',
          }}
        >
          {[
            { label: 'Years Experience', value: data.overview.yearsOfExperience + '+' },
            { label: 'Projects Completed', value: data.overview.projectsCompleted + '+' },
          ].map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.1 }}
              style={{
                textAlign: 'center',
              }}
            >
              <div
                className="overview-stat-value"
                style={{
                  fontSize: spaceTheme.fontSizes['5xl'],
                  fontFamily: spaceTheme.fonts.display,
                  fontWeight: 800,
                  background: spaceTheme.gradients.primary,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  marginBottom: '0.5rem',
                }}
              >
                {stat.value}
              </div>
              <div
                className="overview-stat-label"
                style={{
                  fontSize: spaceTheme.fontSizes.sm,
                  color: spaceTheme.colors.textMuted,
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  fontWeight: 600,
                }}
              >
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          style={{
            position: 'absolute',
            bottom: '3rem',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <div
            style={{
              width: '2px',
              height: '30px',
              background: `linear-gradient(180deg, ${spaceTheme.colors.primary} 0%, transparent 100%)`,
            }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Overview;
