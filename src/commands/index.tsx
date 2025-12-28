import type { Command } from '../types';
import { addMessage, getMessages, markMessageAsRead, deleteMessage, getStats } from '../services/dataService';

// ASCII Art for neofetch
const asciiArt = `
   ██╗   ██╗██╗  ██╗
   ╚██╗ ██╔╝██║ ██╔╝
    ╚████╔╝ █████╔╝
     ╚██╔╝  ██╔═██╗
      ██║   ██║  ██╗
      ╚═╝   ╚═╝  ╚═╝
`;

const cowAscii = (message: string) => `
  ${'_'.repeat(message.length + 2)}
 < ${message} >
  ${'-'.repeat(message.length + 2)}
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||
`;

const coffeeAscii = `
       ( (
        ) )
      ........
      |      |]
      \\      /
       \`----'
`;

const matrixChars = '日ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ012345789Z';

// Helper function to generate random string
const randomString = (length: number): string => {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += matrixChars.charAt(Math.floor(Math.random() * matrixChars.length));
  }
  return result;
};

// Commands
export const commands: Record<string, Command> = {
  help: {
    name: 'help',
    description: 'helpDesc',
    execute: (_args, ctx) => {
      const isAdmin = ctx.isAuthenticated;
      const regularCommands = [
        { cmd: 'help', desc: ctx.t('helpDesc') },
        { cmd: 'about', desc: ctx.t('aboutDesc') },
        { cmd: 'skills', desc: ctx.t('skillsDesc') },
        { cmd: 'experience', desc: ctx.t('experienceDesc') },
        { cmd: 'education', desc: ctx.t('educationDesc') },
        { cmd: 'contact', desc: ctx.t('contactDesc') },
        { cmd: 'testimonials', desc: ctx.t('testimonialsDesc') },
        { cmd: 'message', desc: ctx.t('messageDesc') + ' --name "Name" --email "Email" --subject "Subject" --body "Message"' },
        { cmd: 'clear', desc: ctx.t('clearDesc') },
        { cmd: 'lang', desc: ctx.t('langDesc') },
        { cmd: 'su', desc: ctx.t('suDesc') },
      ];

      const funCommands = [
        { cmd: 'neofetch', desc: ctx.t('neofetchDesc') },
        { cmd: 'cowsay', desc: ctx.t('cowsayDesc') + ' <message>' },
        { cmd: 'fortune', desc: ctx.t('fortuneDesc') },
        { cmd: 'matrix', desc: ctx.t('matrixDesc') },
        { cmd: 'date', desc: ctx.t('dateDesc') },
        { cmd: 'whoami', desc: ctx.t('whoamiDesc') },
        { cmd: 'history', desc: ctx.t('historyDesc') },
        { cmd: 'echo', desc: ctx.t('echoDesc') + ' <message>' },
        { cmd: 'cat', desc: ctx.t('catDesc') + ' <file>' },
        { cmd: 'ls', desc: ctx.t('lsDesc') },
        { cmd: 'pwd', desc: ctx.t('pwdDesc') },
        { cmd: 'uptime', desc: ctx.t('uptimeDesc') },
        { cmd: 'ping', desc: ctx.t('pingDesc') + ' <host>' },
        { cmd: 'curl', desc: ctx.t('curlDesc') + ' <profile>' },
        { cmd: 'hack', desc: ctx.t('hackDesc') },
        { cmd: 'coffee', desc: ctx.t('coffeeDesc') },
        { cmd: 'sudo', desc: ctx.t('sudoDesc') },
        { cmd: 'rm', desc: ctx.t('rmDesc') },
      ];

      const adminCommands = [
        { cmd: 'messages', desc: ctx.t('messagesDesc') },
        { cmd: 'stats', desc: ctx.t('statsDesc') },
        { cmd: 'exit', desc: ctx.t('exitDesc') },
      ];

      return {
        output: (
          <div className="help-output">
            <div className="help-section">
              <span className="section-title">📋 {ctx.t('availableCommands')}</span>
              <div className="commands-grid">
                {regularCommands.map(({ cmd, desc }) => (
                  <div key={cmd} className="command-item">
                    <span className="cmd-name">{cmd}</span>
                    <span className="cmd-desc">{desc}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="help-section">
              <span className="section-title">🎮 {ctx.t('funCommands')}</span>
              <div className="commands-grid">
                {funCommands.map(({ cmd, desc }) => (
                  <div key={cmd} className="command-item">
                    <span className="cmd-name">{cmd}</span>
                    <span className="cmd-desc">{desc}</span>
                  </div>
                ))}
              </div>
            </div>
            {isAdmin && (
              <div className="help-section admin-section">
                <span className="section-title">🔐 {ctx.t('adminCommands')}</span>
                <div className="commands-grid">
                  {adminCommands.map(({ cmd, desc }) => (
                    <div key={cmd} className="command-item">
                      <span className="cmd-name">{cmd}</span>
                      <span className="cmd-desc">{desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ),
      };
    },
  },

  about: {
    name: 'about',
    description: 'aboutDesc',
    execute: (_args, ctx) => {
      if (!ctx.data) return { output: ctx.t('loading'), isError: true };

      const { personal, overview } = ctx.data;
      return {
        output: (
          <div className="about-output">
            <div className="about-header">
              <pre className="ascii-avatar">{asciiArt}</pre>
              <div className="about-info">
                <h2>{overview.greeting} <span className="highlight">{personal.name}</span></h2>
                <p className="title">{personal.title}</p>
                <p className="location">📍 {personal.location}</p>
                <div className="stats">
                  <span>💼 {overview.yearsOfExperience}+ {ctx.t('yearsExperience')}</span>
                  <span>🚀 {overview.projectsCompleted}+ {ctx.t('projects')}</span>
                </div>
              </div>
            </div>
            <div className="about-bio">
              <p>{personal.bio}</p>
            </div>
          </div>
        ),
      };
    },
  },

  skills: {
    name: 'skills',
    description: 'skillsDesc',
    execute: (_args, ctx) => {
      if (!ctx.data) return { output: ctx.t('loading'), isError: true };

      const { skills } = ctx.data.personal;

      return {
        output: (
          <div className="skills-output">
            <h3>⚡ {ctx.t('mySkills')}</h3>
            <div className="skills-tags">
              {skills.map((skill) => (
                <span key={skill} className="skill-tag">{skill}</span>
              ))}
            </div>
          </div>
        ),
      };
    },
  },

  experience: {
    name: 'experience',
    description: 'experienceDesc',
    execute: (_args, ctx) => {
      if (!ctx.data) return { output: ctx.t('loading'), isError: true };

      const { workExperience } = ctx.data;
      return {
        output: (
          <div className="experience-output">
            <h3>💼 {ctx.t('workExperience')}</h3>
            {workExperience.map((exp, index) => (
              <div key={exp.id} className="exp-item">
                <div className="exp-header">
                  <span className="exp-position">{exp.position}</span>
                  <span className="exp-company">@ {exp.company}</span>
                </div>
                <div className="exp-meta">
                  <span>📅 {exp.duration}</span>
                  <span>📍 {exp.location}</span>
                </div>
                <p className="exp-desc">{exp.description}</p>
                <div className="exp-tech">
                  {exp.technologies.map(tech => (
                    <span key={tech} className="tech-tag">{tech}</span>
                  ))}
                </div>
                {index < workExperience.length - 1 && <hr className="exp-divider" />}
              </div>
            ))}
          </div>
        ),
      };
    },
  },

  education: {
    name: 'education',
    description: 'educationDesc',
    execute: (_args, ctx) => {
      if (!ctx.data) return { output: ctx.t('loading'), isError: true };

      const { education } = ctx.data;
      return {
        output: (
          <div className="education-output">
            <h3>🎓 {ctx.t('myEducation')}</h3>
            {education.map(edu => (
              <div key={edu.id} className="edu-item">
                <div className="edu-header">
                  <span className="edu-school">{edu.school}</span>
                </div>
                <p className="edu-degree">{edu.degree}</p>
                <div className="edu-meta">
                  <span>📅 {edu.duration}</span>
                  <span>📍 {edu.location}</span>
                  <span>📊 GPA: {edu.gpa}</span>
                </div>
                <p className="edu-desc">{edu.description}</p>
                <div className="edu-courses">
                  {edu.courses.map(course => (
                    <span key={course} className="course-tag">{course}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ),
      };
    },
  },

  contact: {
    name: 'contact',
    description: 'contactDesc',
    execute: (_args, ctx) => {
      if (!ctx.data) return { output: ctx.t('loading'), isError: true };

      const { contact } = ctx.data;
      return {
        output: (
          <div className="contact-output">
            <h3>📬 {ctx.t('contactInfo')}</h3>
            <div className="contact-list">
              <div className="contact-item">
                <span className="contact-icon">📧</span>
                <span className="contact-label">Email:</span>
                <a href={`mailto:${contact.email}`} className="contact-value">{contact.email}</a>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📍</span>
                <span className="contact-label">{ctx.t('locationLabel')}:</span>
                <span className="contact-value">{contact.location}</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">🐙</span>
                <span className="contact-label">GitHub:</span>
                <a href={contact.social.github} target="_blank" rel="noopener noreferrer" className="contact-value">{contact.social.github}</a>
              </div>
              <div className="contact-item">
                <span className="contact-icon">💼</span>
                <span className="contact-label">LinkedIn:</span>
                <a href={contact.social.linkedin} target="_blank" rel="noopener noreferrer" className="contact-value">{contact.social.linkedin}</a>
              </div>
              <div className="contact-item">
                <span className="contact-icon">✈️</span>
                <span className="contact-label">{ctx.t('availabilityLabel')}:</span>
                <span className="contact-value">{contact.availability}</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">⏰</span>
                <span className="contact-label">{ctx.t('responseTimeLabel')}:</span>
                <span className="contact-value">{contact.responseTime}</span>
              </div>
            </div>
            <p className="contact-tip">
              💡 {ctx.t('contactTip')}
            </p>
          </div>
        ),
      };
    },
  },

  testimonials: {
    name: 'testimonials',
    description: 'testimonialsDesc',
    execute: (_args, ctx) => {
      if (!ctx.data) return { output: ctx.t('loading'), isError: true };

      const { testimonials } = ctx.data;
      return {
        output: (
          <div className="testimonials-output">
            <h3>💬 {ctx.t('whatPeopleSay')}</h3>
            {testimonials.map((test, index) => (
              <div key={test.id} className="testimonial-item">
                <p className="testimonial-text">"{test.text}"</p>
                <div className="testimonial-author">
                  <span className="author-name">— {test.name}</span>
                  <span className="author-position">{test.position} @ {test.company}</span>
                </div>
                {index < testimonials.length - 1 && <hr className="testimonial-divider" />}
              </div>
            ))}
          </div>
        ),
      };
    },
  },

  clear: {
    name: 'clear',
    description: 'clearDesc',
    execute: (_args, ctx) => {
      ctx.clearTerminal();
      return { output: '' };
    },
  },

  lang: {
    name: 'lang',
    description: 'langDesc',
    usage: 'lang <en|tr>',
    execute: (args, ctx) => {
      const lang = args[0]?.toLowerCase();
      if (lang === 'en' || lang === 'tr') {
        ctx.setLanguage(lang);
        return {
          output: lang === 'en'
            ? '🌐 Language changed to English!'
            : '🌐 Dil Türkçe olarak değiştirildi!',
        };
      }
      return {
        output: `Usage: lang <en|tr>\nCurrent language: ${ctx.language}`,
        isError: true,
      };
    },
  },

  su: {
    name: 'su',
    description: 'suDesc',
    execute: (_args, ctx) => {
      return {
        output: (
          <div className="su-prompt">
            <p>🔐 {ctx.t('enterCredentials')}</p>
            <p className="su-hint">
              {ctx.t('suUsage')}
            </p>
          </div>
        ),
        isAsync: true,
      };
    },
  },

  exit: {
    name: 'exit',
    description: 'exitDesc',
    execute: (_args, ctx) => {
      if (!ctx.isAuthenticated) {
        return { output: ctx.t('notLoggedIn'), isError: true };
      }
      ctx.setIsAuthenticated(false);
      return { output: ctx.t('logoutSuccess') };
    },
  },

  // Fun Commands
  neofetch: {
    name: 'neofetch',
    description: 'neofetchDesc',
    execute: (_args, ctx) => {
      if (!ctx.data) return { output: ctx.t('loading'), isError: true };

      const { personal } = ctx.data;
      const startTime = new Date('2021-07-01');
      const now = new Date();
      const uptime = Math.floor((now.getTime() - startTime.getTime()) / (1000 * 60 * 60 * 24));

      return {
        output: (
          <div className="neofetch-output">
            <pre className="neofetch-ascii">{asciiArt}</pre>
            <div className="neofetch-info">
              <div className="neofetch-title">
                <span className="neofetch-user">{personal.name.toLowerCase().replace(' ', '@')}</span>
              </div>
              <div className="neofetch-separator">------------------------</div>
              <div className="neofetch-item"><span className="label">{ctx.t('os')}:</span> Human OS 1.0</div>
              <div className="neofetch-item"><span className="label">{ctx.t('host')}:</span> {personal.location}</div>
              <div className="neofetch-item"><span className="label">{ctx.t('kernel')}:</span> Brain v4.0 (Coffee Powered)</div>
              <div className="neofetch-item"><span className="label">{ctx.t('uptime')}:</span> {uptime} days (as a developer)</div>
              <div className="neofetch-item"><span className="label">{ctx.t('packages')}:</span> {personal.skills.length} (npm)</div>
              <div className="neofetch-item"><span className="label">{ctx.t('shell')}:</span> bash 5.0 (zsh-pretender)</div>
              <div className="neofetch-item"><span className="label">{ctx.t('resolution')}:</span> 1920x1080 (ultrawide dreams)</div>
              <div className="neofetch-item"><span className="label">{ctx.t('terminal')}:</span> Portfolio Terminal v1.0</div>
              <div className="neofetch-item"><span className="label">{ctx.t('cpu')}:</span> Caffeine-Fueled Processor</div>
              <div className="neofetch-item"><span className="label">{ctx.t('memory')}:</span> 16GB (8GB used by Chrome)</div>
              <div className="neofetch-colors">
                <span className="color-block red">███</span>
                <span className="color-block green">███</span>
                <span className="color-block yellow">███</span>
                <span className="color-block blue">███</span>
                <span className="color-block magenta">███</span>
                <span className="color-block cyan">███</span>
              </div>
            </div>
          </div>
        ),
      };
    },
  },

  cowsay: {
    name: 'cowsay',
    description: 'cowsayDesc',
    usage: 'cowsay <message>',
    execute: (args, ctx) => {
      const message = args.join(' ') || ctx.t('mooHireMe');
      return {
        output: <pre className="cowsay-output">{cowAscii(message)}</pre>,
      };
    },
  },

  fortune: {
    name: 'fortune',
    description: 'fortuneDesc',
    execute: (_args, ctx) => {
      const fortunes = [
        ctx.t('fortune1'),
        ctx.t('fortune2'),
        ctx.t('fortune3'),
        ctx.t('fortune4'),
        ctx.t('fortune5'),
        ctx.t('fortune6'),
        ctx.t('fortune7'),
        ctx.t('fortune8'),
        ctx.t('fortune9'),
        ctx.t('fortune10'),
      ];
      const randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
      return {
        output: (
          <div className="fortune-output">
            <span className="fortune-icon">🔮</span>
            <p className="fortune-text">{randomFortune}</p>
          </div>
        ),
      };
    },
  },

  matrix: {
    name: 'matrix',
    description: 'matrixDesc',
    execute: (_args, ctx) => {
      return {
        output: (
          <div className="matrix-output">
            <p className="matrix-text">{ctx.t('matrixWelcome')}</p>
            <div className="matrix-rain">
              {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className="matrix-column" style={{ animationDelay: `${Math.random() * 2}s` }}>
                  {randomString(30)}
                </div>
              ))}
            </div>
            <p className="matrix-follow">{ctx.t('followWhiteRabbit')}</p>
          </div>
        ),
      };
    },
  },

  date: {
    name: 'date',
    description: 'dateDesc',
    execute: () => {
      const now = new Date();
      return {
        output: now.toString(),
      };
    },
  },

  whoami: {
    name: 'whoami',
    description: 'whoamiDesc',
    execute: (_args, ctx) => {
      return {
        output: ctx.isAuthenticated ? 'root' : 'visitor',
      };
    },
  },

  history: {
    name: 'history',
    description: 'historyDesc',
    execute: () => {
      return {
        output: (
          <div className="history-output">
            <p>1  help</p>
            <p>2  about</p>
            <p>3  skills</p>
            <p>4  neofetch</p>
            <p>5  cowsay "Hire me!"</p>
            <p>6  fortune</p>
            <p>7  coffee</p>
            <p>8  history</p>
          </div>
        ),
      };
    },
  },

  echo: {
    name: 'echo',
    description: 'echoDesc',
    usage: 'echo <message>',
    execute: (args) => {
      return { output: args.join(' ') || '' };
    },
  },

  cat: {
    name: 'cat',
    description: 'catDesc',
    usage: 'cat <file>',
    execute: (args, ctx) => {
      const file = args[0];
      const files: Record<string, string> = {
        'readme.txt': ctx.t('readmeContent'),
        'secret.txt': ctx.t('secretContent'),
        '.bashrc': `
# ~/.bashrc
export PS1="\\u@portfolio:\\w\\$ "
alias ll='ls -la'
alias vim='echo "Real developers use VS Code... just kidding!"'
alias please='sudo'

# The best code is the one you don't have to write
`,
        'todo.txt': ctx.t('todoContent'),
      };

      if (!file) {
        return { output: 'Usage: cat <filename>', isError: true };
      }

      if (files[file]) {
        return { output: <pre>{files[file]}</pre> };
      }

      return { output: `cat: ${file}: No such file or directory`, isError: true };
    },
  },

  ls: {
    name: 'ls',
    description: 'lsDesc',
    execute: (args) => {
      const showHidden = args.includes('-a') || args.includes('-la');
      const files = [
        { name: 'readme.txt', size: '1.2K', type: '-rw-r--r--' },
        { name: 'todo.txt', size: '256', type: '-rw-r--r--' },
        { name: 'secret.txt', size: '128', type: '-rw-------' },
        { name: 'projects/', size: '4.0K', type: 'drwxr-xr-x' },
        { name: 'skills/', size: '4.0K', type: 'drwxr-xr-x' },
      ];

      const hiddenFiles = [
        { name: '.bashrc', size: '512', type: '-rw-r--r--' },
        { name: '.gitconfig', size: '256', type: '-rw-r--r--' },
        { name: '.vimrc', size: '128', type: '-rw-r--r--' },
      ];

      const allFiles = showHidden ? [...hiddenFiles, ...files] : files;

      return {
        output: (
          <div className="ls-output">
            {allFiles.map(file => (
              <div key={file.name} className="ls-item">
                <span className="ls-type">{file.type}</span>
                <span className="ls-size">{file.size}</span>
                <span className={`ls-name ${file.name.endsWith('/') ? 'dir' : ''}`}>{file.name}</span>
              </div>
            ))}
          </div>
        ),
      };
    },
  },

  pwd: {
    name: 'pwd',
    description: 'pwdDesc',
    execute: () => {
      return { output: '/home/visitor/yasin-portfolio' };
    },
  },

  uptime: {
    name: 'uptime',
    description: 'uptimeDesc',
    execute: () => {
      const startTime = new Date('2021-07-01');
      const now = new Date();
      const diff = now.getTime() - startTime.getTime();
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      return {
        output: `up ${days} days, ${hours}:${minutes.toString().padStart(2, '0')}, 1 user, load average: ☕☕☕`,
      };
    },
  },

  ping: {
    name: 'ping',
    description: 'pingDesc',
    usage: 'ping <host>',
    execute: (args) => {
      const host = args[0];
      if (!host) {
        return { output: 'Usage: ping <host>', isError: true };
      }

      const responses = [
        `PING ${host}: 64 bytes, time=1ms (lightning fast!)`,
        `PING ${host}: 64 bytes, time=42ms (the answer to everything)`,
        `PING ${host}: 64 bytes, time=404ms (not found... just kidding!)`,
        `PING ${host}: 64 bytes, time=∞ms (still waiting for that API response...)`,
      ];

      return {
        output: (
          <div className="ping-output">
            <p>PING {host} (127.0.0.1) 56(84) bytes of data.</p>
            {responses.map((resp, i) => (
              <p key={i}>{resp}</p>
            ))}
            <p>--- {host} ping statistics ---</p>
            <p>4 packets transmitted, 4 received, 0% packet loss</p>
          </div>
        ),
      };
    },
  },

  curl: {
    name: 'curl',
    description: 'curlDesc',
    usage: 'curl <github|linkedin>',
    execute: (args, ctx) => {
      const profile = args[0]?.toLowerCase();
      if (!ctx.data) return { output: ctx.t('loading'), isError: true };

      const { contact } = ctx.data;

      if (profile === 'github') {
        return {
          output: (
            <div className="curl-output">
              <p>Fetching GitHub profile...</p>
              <p className="curl-url">GET {contact.social.github}</p>
              <p className="curl-success">✓ 200 OK</p>
              <a href={contact.social.github} target="_blank" rel="noopener noreferrer">
                {ctx.t('clickToViewProfile')}
              </a>
            </div>
          ),
        };
      }

      if (profile === 'linkedin') {
        return {
          output: (
            <div className="curl-output">
              <p>Fetching LinkedIn profile...</p>
              <p className="curl-url">GET {contact.social.linkedin}</p>
              <p className="curl-success">✓ 200 OK</p>
              <a href={contact.social.linkedin} target="_blank" rel="noopener noreferrer">
                {ctx.t('clickToViewProfile')}
              </a>
            </div>
          ),
        };
      }

      return {
        output: 'Usage: curl <github|linkedin>',
        isError: true,
      };
    },
  },

  hack: {
    name: 'hack',
    description: 'hackDesc',
    execute: (_args, ctx) => {
      return {
        output: (
          <div className="hack-output">
            <p className="hack-line">{ctx.t('hackingStart')}</p>
            <p className="hack-line delay-1">{'>'} Accessing mainframe...</p>
            <p className="hack-line delay-2">{'>'} {ctx.t('hackingProgress')}</p>
            <p className="hack-line delay-3">{'>'} Decrypting passwords...</p>
            <p className="hack-line delay-4">{'>'} Downloading database...</p>
            <p className="hack-line delay-5">{'>'} Just kidding! 😄</p>
            <p className="hack-result">{ctx.t('hackingComplete')}</p>
          </div>
        ),
      };
    },
  },

  coffee: {
    name: 'coffee',
    description: 'coffeeDesc',
    execute: (_args, ctx) => {
      return {
        output: (
          <div className="coffee-output">
            <p>{ctx.t('coffeeBrewStart')}</p>
            <pre className="coffee-ascii">{coffeeAscii}</pre>
            <p>{ctx.t('coffeeBrewComplete')} ☕</p>
            <p className="coffee-tip">
              {ctx.t('coffeeFunFact')}
            </p>
          </div>
        ),
      };
    },
  },

  sudo: {
    name: 'sudo',
    description: 'sudoDesc',
    execute: (args, ctx) => {
      const command = args.join(' ');
      if (command.includes('rm -rf')) {
        return {
          output: (
            <div className="sudo-output danger">
              <p>🚨 ALERT! ALERT! 🚨</p>
              <p>{ctx.t('rmJoke')}</p>
            </div>
          ),
        };
      }
      return {
        output: (
          <div className="sudo-output">
            <p>{ctx.t('sudoJoke')}</p>
            <p className="sudo-tip">
              {ctx.t('sudoTip')}
            </p>
          </div>
        ),
      };
    },
  },

  rm: {
    name: 'rm',
    description: 'rmDesc',
    execute: (args, ctx) => {
      if (args.includes('-rf') && args.includes('/')) {
        return {
          output: (
            <div className="rm-output danger">
              <p>🔥 INITIATING SYSTEM DESTRUCTION... 🔥</p>
              <p className="rm-progress">Deleting system files... 0%</p>
              <p className="rm-progress">Deleting system files... 25%</p>
              <p className="rm-progress">Deleting system files... 50%</p>
              <p className="rm-progress">Deleting system files... 75%</p>
              <p className="rm-progress">Deleting system files... 99%</p>
              <p className="rm-joke">Just kidding! 😜 {ctx.t('rmJoke')}</p>
            </div>
          ),
        };
      }
      return {
        output: ctx.t('rmReadOnly'),
        isError: true,
      };
    },
  },

  // Message command
  message: {
    name: 'message',
    description: 'messageDesc',
    usage: 'message --name "Name" --email "Email" --subject "Subject" --body "Message"',
    execute: async (args, ctx) => {
      // Parse arguments
      const argString = args.join(' ');
      const nameMatch = argString.match(/--name\s+"([^"]+)"/);
      const emailMatch = argString.match(/--email\s+"([^"]+)"/);
      const subjectMatch = argString.match(/--subject\s+"([^"]+)"/);
      const bodyMatch = argString.match(/--body\s+"([^"]+)"/);

      if (!nameMatch || !emailMatch || !subjectMatch || !bodyMatch) {
        return {
          output: (
            <div className="message-usage">
              <p className="error">{ctx.t('missingArguments')}</p>
              <p>{ctx.t('usageMessage')}</p>
              <p className="example">{ctx.t('exampleMessage')}</p>
            </div>
          ),
          isError: true,
        };
      }

      const name = nameMatch[1];
      const email = emailMatch[1];
      const subject = subjectMatch[1];
      const message = bodyMatch[1];

      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return {
          output: ctx.t('invalidEmail'),
          isError: true,
        };
      }

      try {
        const success = await addMessage({ name, email, subject, message });
        if (success) {
          return {
            output: (
              <div className="message-success">
                <p>✅ {ctx.t('messageSuccess')}</p>
                <div className="message-details">
                  <p><strong>{ctx.t('from')}:</strong> {name} ({email})</p>
                  <p><strong>{ctx.t('subject')}:</strong> {subject}</p>
                </div>
              </div>
            ),
          };
        }
        return { output: ctx.t('messageFailed'), isError: true };
      } catch {
        return { output: ctx.t('messageFailed'), isError: true };
      }
    },
  },

  // Admin Commands
  messages: {
    name: 'messages',
    description: 'messagesDesc',
    execute: async (args, ctx) => {
      if (!ctx.isAuthenticated) {
        return { output: ctx.t('accessDenied'), isError: true };
      }

      try {
        const messages = await getMessages();

        if (messages.length === 0) {
          return { output: ctx.t('noMessages') };
        }

        // Check for subcommands
        if (args[0] === 'read' && args[1]) {
          await markMessageAsRead(args[1]);
          return { output: ctx.t('messageMarkedRead') };
        }

        if (args[0] === 'delete' && args[1]) {
          await deleteMessage(args[1]);
          return { output: ctx.t('messageDeleted') };
        }

        return {
          output: (
            <div className="messages-output">
              <h3>📬 {ctx.t('inbox')} ({messages.length})</h3>
              {messages.map((msg, index) => (
                <div key={msg.id} className={`message-item ${msg.read ? 'read' : 'unread'}`}>
                  <div className="message-header">
                    <span className="message-status">{msg.read ? '📭' : '📫'}</span>
                    <span className="message-from">{msg.name} ({msg.email})</span>
                    <span className="message-date">{new Date(msg.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="message-subject"><strong>Subject:</strong> {msg.subject}</div>
                  <div className="message-body">{msg.message}</div>
                  <div className="message-actions">
                    <span className="action-hint">ID: {msg.id}</span>
                    <span className="action-hint">• messages read {msg.id}</span>
                    <span className="action-hint">• messages delete {msg.id}</span>
                  </div>
                  {index < messages.length - 1 && <hr />}
                </div>
              ))}
            </div>
          ),
        };
      } catch {
        return { output: ctx.t('error'), isError: true };
      }
    },
  },

  // Stats command (Admin only)
  stats: {
    name: 'stats',
    description: 'statsDesc',
    execute: async (_args, ctx) => {
      if (!ctx.isAuthenticated) {
        return { output: ctx.t('accessDenied'), isError: true };
      }

      try {
        const stats = await getStats();
        const lastMsgDate = stats.lastMessageDate
          ? new Date(stats.lastMessageDate).toLocaleString()
          : ctx.t('noMessagesYet');

        return {
          output: (
            <div className="stats-output">
              <h3>📊 {ctx.t('siteStatistics')}</h3>

              <div className="stats-section">
                <h4>👥 {ctx.t('visitors')}</h4>
                <div className="stats-grid">
                  <div className="stat-item">
                    <span className="stat-value">{stats.totalVisitors}</span>
                    <span className="stat-label">{ctx.t('totalVisitors')}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value">{stats.todayVisitors}</span>
                    <span className="stat-label">{ctx.t('today')}</span>
                  </div>
                </div>
              </div>

              <div className="stats-section">
                <h4>💬 {ctx.t('messagesLabel')}</h4>
                <div className="stats-grid">
                  <div className="stat-item">
                    <span className="stat-value">{stats.totalMessages}</span>
                    <span className="stat-label">{ctx.t('totalMessages')}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value highlight">{stats.unreadMessages}</span>
                    <span className="stat-label">{ctx.t('unread')}</span>
                  </div>
                </div>
                <p className="stats-info">
                  📅 {ctx.t('lastMessage')}: {lastMsgDate}
                </p>
              </div>

              <div className="stats-section">
                <h4>⌨️ {ctx.t('commandsLabel')}</h4>
                <div className="stats-grid">
                  <div className="stat-item">
                    <span className="stat-value">{stats.totalCommands}</span>
                    <span className="stat-label">{ctx.t('totalCommands')}</span>
                  </div>
                </div>
                {stats.popularCommands.length > 0 && (
                  <div className="popular-commands">
                    <p className="stats-subtitle">{ctx.t('mostUsed')}</p>
                    {stats.popularCommands.map((cmd, i) => (
                      <div key={cmd.command} className="popular-item">
                        <span className="rank">#{i + 1}</span>
                        <span className="cmd">{cmd.command}</span>
                        <span className="count">{cmd.count}x</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="stats-section">
                <h4>📁 {ctx.t('content')}</h4>
                <div className="stats-grid">
                  <div className="stat-item">
                    <span className="stat-value">{ctx.data?.personal.skills.length || 0}</span>
                    <span className="stat-label">{ctx.t('skillsCount')}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value">{ctx.data?.workExperience.length || 0}</span>
                    <span className="stat-label">{ctx.t('jobsCount')}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value">{ctx.data?.testimonials.length || 0}</span>
                    <span className="stat-label">{ctx.t('testimonialsCount')}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value">{ctx.data?.education.length || 0}</span>
                    <span className="stat-label">{ctx.t('educationCount')}</span>
                  </div>
                </div>
              </div>
            </div>
          ),
        };
      } catch {
        return { output: ctx.t('error'), isError: true };
      }
    },
  },
};

export default commands;
