import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaEnvelope, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';
import spaceTheme from '../theme';

const Contact = ({ data }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const socialLinks = [
    {
      name: 'GitHub',
      icon: FaGithub,
      url: data.contact.social.github,
      color: spaceTheme.colors.text,
    },
    {
      name: 'LinkedIn',
      icon: FaLinkedin,
      url: data.contact.social.linkedin,
      color: '#0A66C2',
    },
    {
      name: 'Email',
      icon: FaEnvelope,
      url: `mailto:${data.contact.email}`,
      color: spaceTheme.colors.accent,
    },
  ];

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
      {/* Dekoratif arka plan efektleri */}
      <motion.div
        className="gradient-orb"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.35, scale: 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        style={{
          position: 'absolute',
          top: '30%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '500px',
          height: '500px',
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
          right: '15%',
          width: '350px',
          height: '350px',
          background: `radial-gradient(circle, ${spaceTheme.colors.accent}40 0%, transparent 70%)`,
          borderRadius: '50%',
          filter: 'blur(100px)',
        }}
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{
          maxWidth: '1000px',
          width: '100%',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Title */}
        <motion.h2
          className="contact-title"
          variants={itemVariants}
          style={{
            fontSize: spaceTheme.fontSizes['6xl'],
            fontFamily: spaceTheme.fonts.display,
            fontWeight: 900,
            background: spaceTheme.gradients.nebula,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '1rem',
            textAlign: 'center',
          }}
        >
          Let's Connect
        </motion.h2>

        <motion.p
          variants={itemVariants}
          style={{
            fontSize: spaceTheme.fontSizes.xl,
            color: spaceTheme.colors.textSecondary,
            textAlign: 'center',
            marginBottom: '4rem',
            maxWidth: '600px',
            margin: '0 auto 4rem',
          }}
        >
          Ready to start your next project? Let's build something amazing together.
        </motion.p>

        {/* Contact Grid */}
        <div
          className="contact-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
            marginBottom: '4rem',
          }}
        >
          {/* Email Card */}
          <motion.a
            href={`mailto:${data.contact.email}`}
            variants={itemVariants}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.98 }}
            style={{
              padding: '2rem',
              background: `linear-gradient(135deg, ${spaceTheme.colors.backgroundAlt}90 0%, ${spaceTheme.colors.background}50 100%)`,
              borderRadius: spaceTheme.borderRadius.lg,
              border: `1px solid ${spaceTheme.colors.primary}40`,
              boxShadow: spaceTheme.shadows.card,
              backdropFilter: 'blur(10px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem',
              cursor: 'pointer',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
            }}
          >
            <FaEnvelope
              style={{
                fontSize: '3rem',
                color: spaceTheme.colors.accent,
              }}
            />
            <h3
              style={{
                fontSize: spaceTheme.fontSizes.xl,
                color: spaceTheme.colors.text,
                fontWeight: 600,
              }}
            >
              Email
            </h3>
            <p
              style={{
                fontSize: spaceTheme.fontSizes.base,
                color: spaceTheme.colors.primary,
                textAlign: 'center',
              }}
            >
              {data.contact.email}
            </p>
            <p
              style={{
                fontSize: spaceTheme.fontSizes.sm,
                color: spaceTheme.colors.textMuted,
                textAlign: 'center',
              }}
            >
              {data.contact.responseTime}
            </p>
          </motion.a>

          {/* Location Card */}
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.05, y: -5 }}
            style={{
              padding: '2rem',
              background: `linear-gradient(135deg, ${spaceTheme.colors.backgroundAlt}90 0%, ${spaceTheme.colors.background}50 100%)`,
              borderRadius: spaceTheme.borderRadius.lg,
              border: `1px solid ${spaceTheme.colors.primary}40`,
              boxShadow: spaceTheme.shadows.card,
              backdropFilter: 'blur(10px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem',
              transition: 'all 0.3s ease',
            }}
          >
            <FaMapMarkerAlt
              style={{
                fontSize: '3rem',
                color: spaceTheme.colors.accentBlue,
              }}
            />
            <h3
              style={{
                fontSize: spaceTheme.fontSizes.xl,
                color: spaceTheme.colors.text,
                fontWeight: 600,
              }}
            >
              Location
            </h3>
            <p
              style={{
                fontSize: spaceTheme.fontSizes.base,
                color: spaceTheme.colors.primary,
                textAlign: 'center',
              }}
            >
              {data.contact.location}
            </p>
            <p
              style={{
                fontSize: spaceTheme.fontSizes.sm,
                color: spaceTheme.colors.textMuted,
                textAlign: 'center',
              }}
            >
              {data.contact.availability}
            </p>
          </motion.div>
        </div>

        {/* Social Links */}
        <motion.div
          variants={itemVariants}
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '2rem',
            marginTop: '3rem',
          }}
        >
          {socialLinks.map((social, index) => (
            <motion.a
              key={index}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.2, y: -5 }}
              whileTap={{ scale: 0.95 }}
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${spaceTheme.colors.primary}30 0%, ${spaceTheme.colors.primaryDark}20 100%)`,
                border: `2px solid ${spaceTheme.colors.primary}60`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                boxShadow: spaceTheme.shadows.card,
              }}
            >
              <social.icon
                style={{
                  fontSize: '2.5rem',
                  color: social.color,
                }}
              />
            </motion.a>
          ))}
        </motion.div>

        {/* Call to action */}
        <motion.div
          variants={itemVariants}
          style={{
            marginTop: '4rem',
            textAlign: 'center',
          }}
        >
          <motion.a
            className="contact-cta-button"
            href={`mailto:${data.contact.email}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            style={{
              display: 'inline-block',
              padding: '1.5rem 3rem',
              fontSize: spaceTheme.fontSizes.xl,
              fontWeight: 700,
              fontFamily: spaceTheme.fonts.display,
              background: spaceTheme.gradients.primary,
              color: spaceTheme.colors.text,
              borderRadius: spaceTheme.borderRadius.full,
              boxShadow: spaceTheme.shadows.glowStrong,
              textDecoration: 'none',
              transition: 'all 0.3s ease',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}
          >
            Get In Touch
          </motion.a>
        </motion.div>

        {/* Footer note */}
        <motion.p
          variants={itemVariants}
          style={{
            marginTop: '3rem',
            textAlign: 'center',
            fontSize: spaceTheme.fontSizes.sm,
            color: spaceTheme.colors.textMuted,
            fontStyle: 'italic',
          }}
        >
          Yasin Kamış @2025
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Contact;
