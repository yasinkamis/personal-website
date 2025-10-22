import { motion } from 'framer-motion';
import { useState } from 'react';
import spaceTheme from '../theme';

const WorkExperience = ({ data, onScrollBlock }) => {
  const [selectedJob, setSelectedJob] = useState(0);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6 },
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
        padding: '4rem 2rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative gradient orbs */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.2, scale: 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        style={{
          position: 'absolute',
          top: '10%',
          right: '5%',
          width: '280px',
          height: '280px',
          background: `radial-gradient(circle, ${spaceTheme.colors.primaryLight}50 0%, transparent 70%)`,
          borderRadius: '50%',
          filter: 'blur(90px)',
          zIndex: 0,
        }}
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{
          maxWidth: '1200px',
          width: '100%',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Title */}
        <motion.h2
          variants={itemVariants}
          style={{
            fontSize: spaceTheme.fontSizes['5xl'],
            fontFamily: spaceTheme.fonts.display,
            fontWeight: 800,
            background: spaceTheme.gradients.primary,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '3rem',
            textAlign: 'center',
          }}
        >
          Work Experience
        </motion.h2>

        <div className="work-experience-container" style={{ display: 'flex', gap: '2rem', height: '500px' }}>
          {/* Company tabs */}
          <motion.div
            className="work-experience-tabs"
            variants={itemVariants}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              minWidth: '250px',
            }}
          >
            {data.workExperience.map((job, index) => (
              <motion.button
                className="work-experience-tab"
                key={job.id}
                onClick={() => setSelectedJob(index)}
                whileHover={{ x: 10 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  padding: '1.5rem',
                  textAlign: 'left',
                  background:
                    selectedJob === index
                      ? `linear-gradient(90deg, ${spaceTheme.colors.primary}20 0%, transparent 100%)`
                      : 'transparent',
                  border: 'none',
                  borderLeft: `3px solid ${
                    selectedJob === index
                      ? spaceTheme.colors.primary
                      : spaceTheme.colors.backgroundAlt
                  }`,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontFamily: spaceTheme.fonts.display,
                  color:
                    selectedJob === index
                      ? spaceTheme.colors.primary
                      : spaceTheme.colors.textMuted,
                  fontWeight: selectedJob === index ? 700 : 500,
                  fontSize: spaceTheme.fontSizes.lg,
                }}
              >
                {job.company}
              </motion.button>
            ))}
          </motion.div>

          {/* Job details */}
          <motion.div
            className="work-experience-details"
            key={selectedJob}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              flex: 1,
              padding: '2rem',
              background: `linear-gradient(135deg, ${spaceTheme.colors.backgroundAlt}80 0%, ${spaceTheme.colors.background}40 100%)`,
              borderRadius: spaceTheme.borderRadius.lg,
              border: `1px solid ${spaceTheme.colors.primary}30`,
              boxShadow: spaceTheme.shadows.card,
              backdropFilter: 'blur(10px)',
              overflowY: 'auto',
            }}
          >
            {/* Position & Duration */}
            <h3
              className="work-title"
              style={{
                fontSize: spaceTheme.fontSizes['3xl'],
                fontWeight: 700,
                color: spaceTheme.colors.text,
                marginBottom: '0.5rem',
              }}
            >
              {data.workExperience[selectedJob].position}
            </h3>
            <p
              style={{
                fontSize: spaceTheme.fontSizes.lg,
                color: spaceTheme.colors.primary,
                marginBottom: '0.5rem',
                fontWeight: 600,
              }}
            >
              {data.workExperience[selectedJob].company}
            </p>
            <p
              style={{
                fontSize: spaceTheme.fontSizes.base,
                color: spaceTheme.colors.textMuted,
                marginBottom: '2rem',
              }}
            >
              {data.workExperience[selectedJob].duration} • {data.workExperience[selectedJob].location}
            </p>

            {/* Description */}
            <p
              style={{
                fontSize: spaceTheme.fontSizes.lg,
                color: spaceTheme.colors.textSecondary,
                lineHeight: 1.8,
                marginBottom: '2rem',
              }}
            >
              {data.workExperience[selectedJob].description}
            </p>

            {/* Achievements */}
            <h4
              style={{
                fontSize: spaceTheme.fontSizes.xl,
                color: spaceTheme.colors.primary,
                marginBottom: '1rem',
                fontWeight: 600,
              }}
            >
              Key Achievements
            </h4>
            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                marginBottom: '2rem',
              }}
            >
              {data.workExperience[selectedJob].achievements.map((achievement, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  style={{
                    fontSize: spaceTheme.fontSizes.base,
                    color: spaceTheme.colors.textSecondary,
                    marginBottom: '0.75rem',
                    paddingLeft: '1.5rem',
                    position: 'relative',
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: '0.5em',
                      width: '8px',
                      height: '8px',
                      background: spaceTheme.gradients.primary,
                      borderRadius: '50%',
                      boxShadow: spaceTheme.shadows.glow,
                    }}
                  />
                  {achievement}
                </motion.li>
              ))}
            </ul>

            {/* Technologies */}
            <h4
              style={{
                fontSize: spaceTheme.fontSizes.xl,
                color: spaceTheme.colors.primary,
                marginBottom: '1rem',
                fontWeight: 600,
              }}
            >
              Technologies
            </h4>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.75rem',
              }}
            >
              {data.workExperience[selectedJob].technologies.map((tech, idx) => (
                <motion.span
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ scale: 1.1, y: -2 }}
                  style={{
                    padding: '0.5rem 1rem',
                    background: `${spaceTheme.colors.primary}20`,
                    border: `1px solid ${spaceTheme.colors.primary}40`,
                    borderRadius: spaceTheme.borderRadius.sm,
                    color: spaceTheme.colors.primary,
                    fontSize: spaceTheme.fontSizes.sm,
                    fontWeight: 600,
                    fontFamily: spaceTheme.fonts.mono,
                  }}
                >
                  {tech}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default WorkExperience;
