import { motion } from "framer-motion";
import { FaGraduationCap, FaUniversity, FaBook, FaStar } from "react-icons/fa";
import spaceTheme from "../theme";

const Education = ({ data }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };


  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "4rem 2rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative gradient orbs */}
      <motion.div
        className="gradient-orb"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.25, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        style={{
          position: "absolute",
          top: "15%",
          left: "10%",
          width: "300px",
          height: "300px",
          background: `radial-gradient(circle, ${spaceTheme.colors.accentBlue}50 0%, transparent 70%)`,
          borderRadius: "50%",
          filter: "blur(90px)",
          zIndex: 0,
        }}
      />

      <motion.div
        className="gradient-orb"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.2, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
        style={{
          position: "absolute",
          bottom: "10%",
          right: "15%",
          width: "400px",
          height: "400px",
          background: `radial-gradient(circle, ${spaceTheme.colors.accentPurple}40 0%, transparent 70%)`,
          borderRadius: "50%",
          filter: "blur(100px)",
          zIndex: 0,
        }}
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{
          maxWidth: "1000px",
          width: "100%",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Title */}
        <motion.h2
          className="education-title"
          variants={itemVariants}
          initial={{ opacity: 0, scale: 0.8, y: -50 }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
          }}
          transition={{
            duration: 0.8,
            type: "spring",
            stiffness: 100,
          }}
          whileHover={{
            scale: 1.05,
            textShadow: "0 0 30px rgba(147, 51, 234, 0.8)",
          }}
          style={{
            fontSize: spaceTheme.fontSizes["5xl"],
            fontFamily: spaceTheme.fonts.display,
            fontWeight: 800,
            background: spaceTheme.gradients.primary,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            marginBottom: "4rem",
            textAlign: "center",
            position: "relative",
          }}
        >
          <motion.span
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              background: spaceTheme.gradients.nebula,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              backgroundSize: "200% 200%",
            }}
          >
            Education
          </motion.span>

          {/* Floating graduation cap */}
          <motion.span
            initial={{ opacity: 0, y: -20, rotate: -15 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.5,
              type: "spring",
              stiffness: 150,
            }}
            style={{
              position: "absolute",
              top: "-40px",
              right: "-50px",
              fontSize: "3rem",
            }}
          >
            <FaGraduationCap
              style={{
                color: spaceTheme.colors.primary,
                filter: "drop-shadow(0 0 10px rgba(147, 51, 234, 0.5))",
              }}
            />
          </motion.span>
        </motion.h2>

        {/* Education Cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {data.education.map((edu, index) => (
            <motion.div
              className="education-card"
              key={edu.id}
              variants={itemVariants}
              initial={{ opacity: 0, x: -100, rotateY: -20 }}
              animate={{
                opacity: 1,
                x: 0,
                rotateY: 0,
              }}
              transition={{
                duration: 0.8,
                delay: index * 0.2,
                type: "spring",
              }}
              whileHover={{
                scale: 1.02,
                y: -5,
                boxShadow: `0 20px 60px rgba(147, 51, 234, 0.3), 0 0 40px rgba(147, 51, 234, 0.2)`,
                borderColor: spaceTheme.colors.primary,
              }}
              style={{
                padding: "2.5rem",
                background: `linear-gradient(135deg, ${spaceTheme.colors.backgroundAlt}90 0%, ${spaceTheme.colors.background}50 100%)`,
                borderRadius: spaceTheme.borderRadius.lg,
                border: `1px solid ${spaceTheme.colors.primary}40`,
                boxShadow: spaceTheme.shadows.card,
                backdropFilter: "blur(10px)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Icon */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 0.1, scale: 1 }}
                transition={{
                  duration: 0.8,
                  delay: 0.2 + index * 0.1,
                }}
                style={{
                  position: "absolute",
                  top: "2rem",
                  right: "2rem",
                }}
              >
                <FaGraduationCap
                  style={{
                    fontSize: "8rem",
                    color: spaceTheme.colors.primary,
                  }}
                />
              </motion.div>

              {/* Header */}
              <div
                style={{
                  marginBottom: "1.5rem",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  <motion.div>
                    <FaUniversity
                      style={{
                        fontSize: spaceTheme.fontSizes["2xl"],
                        color: spaceTheme.colors.primary,
                      }}
                    />
                  </motion.div>
                  <motion.h3
                    className="education-school"
                    whileHover={{
                      scale: 1.02,
                      color: spaceTheme.colors.primary,
                    }}
                    style={{
                      fontSize: spaceTheme.fontSizes["3xl"],
                      fontWeight: 700,
                      color: spaceTheme.colors.text,
                      transition: "color 0.3s ease",
                    }}
                  >
                    {edu.school}
                  </motion.h3>
                </motion.div>

                <motion.p
                  className="education-degree"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                  whileHover={{
                    x: 5,
                    textShadow: "0 0 20px rgba(147, 51, 234, 0.6)",
                  }}
                  style={{
                    fontSize: spaceTheme.fontSizes.xl,
                    color: spaceTheme.colors.primary,
                    marginBottom: "0.5rem",
                    fontWeight: 600,
                  }}
                >
                  {edu.degree}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                  style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}
                >
                  <motion.p
                    whileHover={{
                      scale: 1.05,
                      color: spaceTheme.colors.text,
                    }}
                    style={{
                      fontSize: spaceTheme.fontSizes.base,
                      color: spaceTheme.colors.textMuted,
                      transition: "color 0.3s ease",
                    }}
                  >
                    {edu.duration}
                  </motion.p>
                  <motion.p
                    whileHover={{
                      scale: 1.05,
                      color: spaceTheme.colors.text,
                    }}
                    style={{
                      fontSize: spaceTheme.fontSizes.base,
                      color: spaceTheme.colors.textMuted,
                      transition: "color 0.3s ease",
                    }}
                  >
                    {edu.location}
                  </motion.p>
                  {edu.gpa && (
                    <motion.p
                      whileHover={{
                        scale: 1.08,
                        textShadow: "0 0 15px rgba(147, 51, 234, 0.5)",
                      }}
                      style={{
                        fontSize: spaceTheme.fontSizes.base,
                        color: spaceTheme.colors.primary,
                        fontWeight: 600,
                      }}
                    >
                      GPA: {edu.gpa}
                    </motion.p>
                  )}
                </motion.div>
              </div>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 + index * 0.1, duration: 0.7 }}
                style={{
                  fontSize: spaceTheme.fontSizes.lg,
                  color: spaceTheme.colors.textSecondary,
                  lineHeight: 1.8,
                  marginBottom: "2rem",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                {edu.description}
              </motion.p>

              {/* Courses */}
              {edu.courses && edu.courses.length > 0 && (
                <>
                  <motion.h4
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
                    whileHover={{
                      x: 5,
                      textShadow: "0 0 20px rgba(147, 51, 234, 0.6)",
                    }}
                    style={{
                      fontSize: spaceTheme.fontSizes.xl,
                      color: spaceTheme.colors.primary,
                      marginBottom: "1rem",
                      fontWeight: 600,
                      position: "relative",
                      zIndex: 1,
                    }}
                  >
                    Key Courses
                  </motion.h4>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "0.75rem",
                    }}
                  >
                    {edu.courses.map((course, idx) => (
                      <motion.span
                        key={idx}
                        initial={{ opacity: 0, scale: 0.5, rotateX: -90 }}
                        animate={{
                          opacity: 1,
                          scale: 1,
                          rotateX: 0,
                        }}
                        transition={{
                          delay: 0.8 + index * 0.1 + idx * 0.08,
                          duration: 0.5,
                          type: "spring",
                          stiffness: 200,
                        }}
                        whileHover={{
                          scale: 1.15,
                          y: -5,
                          boxShadow: `0 8px 20px ${spaceTheme.colors.accentBlue}60, 0 0 15px ${spaceTheme.colors.accentBlue}40`,
                          borderColor: spaceTheme.colors.accentBlue,
                        }}
                        style={{
                          padding: "0.5rem 1rem",
                          background: `${spaceTheme.colors.accentBlue}20`,
                          border: `1px solid ${spaceTheme.colors.accentBlue}40`,
                          borderRadius: spaceTheme.borderRadius.sm,
                          color: spaceTheme.colors.accentBlue,
                          fontSize: spaceTheme.fontSizes.sm,
                          fontWeight: 600,
                          cursor: "default",
                          position: "relative",
                          zIndex: 1,
                        }}
                      >
                        {course}
                      </motion.span>
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Education;
