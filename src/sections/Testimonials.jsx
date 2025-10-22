import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { FaQuoteLeft, FaStar } from 'react-icons/fa';
import spaceTheme from '../theme';

const Testimonials = ({ data }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % data.testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + data.testimonials.length) % data.testimonials.length);
  };

  const currentTestimonial = data.testimonials[currentIndex];

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
      {/* Dekoratif arka plan */}
      <motion.div
        className="gradient-orb"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.2, scale: 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        style={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          width: '400px',
          height: '400px',
          background: spaceTheme.gradients.glow,
          borderRadius: '50%',
          filter: 'blur(120px)',
        }}
      />
      <motion.div
        className="gradient-orb"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.25, scale: 1 }}
        transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
        style={{
          position: 'absolute',
          bottom: '20%',
          right: '10%',
          width: '300px',
          height: '300px',
          background: `radial-gradient(circle, ${spaceTheme.colors.accentPurple}40 0%, transparent 70%)`,
          borderRadius: '50%',
          filter: 'blur(100px)',
        }}
      />

      <motion.div
        className="gradient-orb"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.2, scale: 1 }}
        transition={{ duration: 1, ease: 'easeOut', delay: 0.4 }}
        style={{
          position: 'absolute',
          top: '10%',
          left: '8%',
          width: '250px',
          height: '250px',
          background: `radial-gradient(circle, ${spaceTheme.colors.accentBlue}45 0%, transparent 70%)`,
          borderRadius: '50%',
          filter: 'blur(85px)',
          zIndex: 0,
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{
          maxWidth: '900px',
          width: '100%',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Title */}
        <motion.h2
          className="testimonial-title"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            fontSize: spaceTheme.fontSizes['5xl'],
            fontFamily: spaceTheme.fonts.display,
            fontWeight: 800,
            background: spaceTheme.gradients.primary,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '4rem',
            textAlign: 'center',
          }}
        >
          Testimonials
        </motion.h2>

        {/* Testimonial Card */}
        <div style={{ position: 'relative', minHeight: '400px' }}>
          <AnimatePresence mode="wait">
            <motion.div
              className="testimonial-card"
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              style={{
                padding: '3rem',
                background: `linear-gradient(135deg, ${spaceTheme.colors.backgroundAlt}90 0%, ${spaceTheme.colors.background}50 100%)`,
                borderRadius: spaceTheme.borderRadius.xl,
                border: `1px solid ${spaceTheme.colors.primary}40`,
                boxShadow: spaceTheme.shadows.cardHover,
                backdropFilter: 'blur(20px)',
                position: 'relative',
              }}
            >
              {/* Quote icon */}
              <FaQuoteLeft
                style={{
                  fontSize: '4rem',
                  color: spaceTheme.colors.primary,
                  opacity: 0.2,
                  position: 'absolute',
                  top: '2rem',
                  left: '2rem',
                }}
              />

              {/* Testimonial text */}
              <p
                className="testimonial-text"
                style={{
                  fontSize: spaceTheme.fontSizes['lg'],
                  color: spaceTheme.colors.text,
                  lineHeight: 1.8,
                  fontStyle: 'italic',
                  marginBottom: '2rem',
                  marginTop: '2rem',
                  textAlign: 'center',
                }}
              >
                "{currentTestimonial.text}"
              </p>

              {/* Author info */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <h4
                  style={{
                    fontSize: spaceTheme.fontSizes['2xl'],
                    fontWeight: 700,
                    color: spaceTheme.colors.primary,
                    marginBottom: '0.25rem',
                  }}
                >
                  {currentTestimonial.name}
                </h4>
                <p
                  style={{
                    fontSize: spaceTheme.fontSizes.lg,
                    color: spaceTheme.colors.textSecondary,
                  }}
                >
                  {currentTestimonial.position}
                </p>
                <p
                  style={{
                    fontSize: spaceTheme.fontSizes.base,
                    color: spaceTheme.colors.textMuted,
                  }}
                >
                  {currentTestimonial.company}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation buttons */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '2rem',
              marginTop: '3rem',
            }}
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={prevTestimonial}
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: spaceTheme.gradients.primary,
                border: 'none',
                color: spaceTheme.colors.text,
                fontSize: spaceTheme.fontSizes['2xl'],
                cursor: 'pointer',
                boxShadow: spaceTheme.shadows.glow,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              ‹
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={nextTestimonial}
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: spaceTheme.gradients.primary,
                border: 'none',
                color: spaceTheme.colors.text,
                fontSize: spaceTheme.fontSizes['2xl'],
                cursor: 'pointer',
                boxShadow: spaceTheme.shadows.glow,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              ›
            </motion.button>
          </div>

          {/* Indicators */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '1rem',
              marginTop: '2rem',
            }}
          >
            {data.testimonials.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setCurrentIndex(index)}
                whileHover={{ scale: 1.2 }}
                style={{
                  width: currentIndex === index ? '40px' : '12px',
                  height: '12px',
                  borderRadius: spaceTheme.borderRadius.full,
                  background:
                    currentIndex === index
                      ? spaceTheme.gradients.primary
                      : spaceTheme.colors.textMuted,
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow:
                    currentIndex === index ? spaceTheme.shadows.glow : 'none',
                }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Testimonials;
