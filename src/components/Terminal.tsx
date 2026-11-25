import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useData } from '../contexts/DataContext';
import { commands } from '../commands';
import { trackCommand } from '../services/dataService';
import type { TerminalOutput, CommandContext, TerminalTheme } from '../types';
import './Terminal.css';
import Icon from './Icon';

const Terminal: React.FC = () => {
  const [input, setInput] = useState('');
  const [outputs, setOutputs] = useState<TerminalOutput[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isProcessing, setIsProcessing] = useState(false);

  const [isFocused, setIsFocused] = useState(false);

  // Terminal color theme (persisted)
  const [theme, setThemeState] = useState<TerminalTheme>(() => {
    const saved = localStorage.getItem('terminal-theme');
    return saved === 'matrix' || saved === 'dracula' || saved === 'light' || saved === 'dark'
      ? saved
      : 'dark';
  });
  const setTheme = useCallback((next: TerminalTheme) => {
    setThemeState(next);
    localStorage.setItem('terminal-theme', next);
  }, []);

  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const processCommandRef = useRef<(cmd: string) => void>(() => {});

  const { currentUser, isAuthenticated, login, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { data, setData, refreshData } = useData();

  // Generate unique ID
  const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Add output to terminal
  const addOutput = useCallback((output: TerminalOutput) => {
    setOutputs(prev => [...prev, output]);
  }, []);

  // Clear terminal
  const clearTerminal = useCallback(() => {
    setOutputs([]);
  }, []);

  // Scroll to bottom
  const scrollToBottom = useCallback(() => {
    const el = terminalRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [outputs, scrollToBottom]);

  // Keep the layout pinned to the *visible* viewport. When the mobile keyboard
  // opens, visualViewport shrinks; we mirror that into --tvh so the terminal
  // resizes to the space above the keyboard and the input never hides behind it.
  useEffect(() => {
    const vv = window.visualViewport;
    const root = document.documentElement;
    const apply = () => {
      const h = vv ? vv.height : window.innerHeight;
      root.style.setProperty('--tvh', `${Math.round(h)}px`);
    };
    apply();
    if (vv) {
      vv.addEventListener('resize', apply);
      vv.addEventListener('scroll', apply);
    }
    window.addEventListener('resize', apply);
    window.addEventListener('orientationchange', apply);
    return () => {
      if (vv) {
        vv.removeEventListener('resize', apply);
        vv.removeEventListener('scroll', apply);
      }
      window.removeEventListener('resize', apply);
      window.removeEventListener('orientationchange', apply);
      root.style.removeProperty('--tvh');
    };
  }, []);

  // Focus input on click (ignore clicks that are really text selections so
  // users can still copy output on both desktop and mobile).
  const handleTerminalClick = () => {
    const selection = window.getSelection?.();
    if (selection && selection.toString().length > 0) return;
    inputRef.current?.focus();
  };

  // When the field gains focus (e.g. keyboard opens), make sure the prompt is
  // in view after the viewport settles.
  const handleInputFocus = () => {
    setIsFocused(true);
    window.setTimeout(scrollToBottom, 100);
  };


  // Welcome message
  useEffect(() => {
    const welcomeOutput: TerminalOutput = {
      id: generateId(),
      output: (
        <div className="welcome-message">
          <div className="welcome-boot">
            <span className="wb-line wb-1"><span className="wb-ok">[&nbsp;OK&nbsp;]</span> {t('bootInit')}</span>
            <span className="wb-line wb-2"><span className="wb-ok">[&nbsp;OK&nbsp;]</span> {t('bootModules')}</span>
            <span className="wb-line wb-3"><span className="wb-ok">[&nbsp;OK&nbsp;]</span> {t('bootReady')}</span>
          </div>
          <pre className="welcome-ascii">{`
██╗   ██╗ █████╗ ███████╗██╗███╗   ██╗
╚██╗ ██╔╝██╔══██╗██╔════╝██║████╗  ██║
 ╚████╔╝ ███████║███████╗██║██╔██╗ ██║
  ╚██╔╝  ██╔══██║╚════██║██║██║╚██╗██║
   ██║   ██║  ██║███████║██║██║ ╚████║
   ╚═╝   ╚═╝  ╚═╝╚══════╝╚═╝╚═╝  ╚═══╝
          `}</pre>
          <p className="welcome-text">{t('welcome')}</p>
          <p className="welcome-hint">{t('typeHelp')}</p>
          <p className="welcome-version">v1.1.0 | React Vite + TypeScript + Firebase</p>
        </div>
      ),
      timestamp: new Date(),
    };
    setOutputs([welcomeOutput]);
  }, [t]);

  // Run a command programmatically (clickable help entries, deep links).
  const runCommand = useCallback((cmd: string) => {
    processCommandRef.current(cmd);
    inputRef.current?.focus();
  }, []);

  // Create command context
  const createContext = useCallback((): CommandContext => ({
    setIsAuthenticated: async (value: boolean) => {
      if (!value) {
        await logout();
      }
    },
    isAuthenticated,
    currentUser,
    language,
    setLanguage,
    t,
    clearTerminal,
    addOutput,
    data,
    setData,
    refreshData,
    commandHistory,
    runCommand,
    theme,
    setTheme,
  }), [isAuthenticated, currentUser, language, setLanguage, t, clearTerminal, addOutput, data, setData, refreshData, logout, commandHistory, runCommand, theme, setTheme]);

  // Process command
  const processCommand = useCallback(async (cmd: string) => {
    const trimmedCmd = cmd.trim();
    if (!trimmedCmd) return;

    // Add command to history
    setCommandHistory(prev => [...prev, trimmedCmd]);
    setHistoryIndex(-1);

    // Parse command and arguments
    const parts = trimmedCmd.split(/\s+/);
    const commandName = parts[0].toLowerCase();
    const args = parts.slice(1);

    // Add command echo to output
    const commandOutput: TerminalOutput = {
      id: generateId(),
      command: trimmedCmd,
      output: '',
      timestamp: new Date(),
    };
    setOutputs(prev => [...prev, commandOutput]);

    // Handle special commands
    if (commandName === 'su' && args.length > 0) {
      // Parse su command with credentials
      const argString = args.join(' ');
      const userMatch = argString.match(/--user\s+(\S+)/);
      const passMatch = argString.match(/--pass\s+(\S+)/);

      if (userMatch && passMatch) {
        setIsProcessing(true);
        const success = await login(userMatch[1], passMatch[1]);
        setIsProcessing(false);

        const resultOutput: TerminalOutput = {
          id: generateId(),
          output: success ? (
            <div className="login-success">
              <span className="success-icon"><Icon name="unlock" /></span>
              <span>{t('loginSuccess')}</span>
            </div>
          ) : (
            <div className="login-failed">
              <span className="error-icon"><Icon name="lock" /></span>
              <span>{t('loginFailed')}</span>
            </div>
          ),
          isError: !success,
          timestamp: new Date(),
        };
        setOutputs(prev => [...prev, resultOutput]);
        return;
      }
    }

    // Find and execute command
    const command = commands[commandName];
    const ctx = createContext();

    // Track command usage
    trackCommand(commandName);

    if (command) {
      setIsProcessing(true);
      try {
        const result = await command.execute(args, ctx);

        if (result.output !== '') {
          const resultOutput: TerminalOutput = {
            id: generateId(),
            output: result.output,
            isError: result.isError,
            timestamp: new Date(),
          };
          setOutputs(prev => [...prev, resultOutput]);
        }
      } catch (error) {
        const errorOutput: TerminalOutput = {
          id: generateId(),
          output: t('error'),
          isError: true,
          timestamp: new Date(),
        };
        setOutputs(prev => [...prev, errorOutput]);
      }
      setIsProcessing(false);
    } else {
      // Command not found
      const notFoundOutput: TerminalOutput = {
        id: generateId(),
        output: (
          <div className="error-output">
            <span>{t('commandNotFound')}: {commandName}</span>
            <span className="error-hint">{t('tryHelp')}</span>
          </div>
        ),
        isError: true,
        timestamp: new Date(),
      };
      setOutputs(prev => [...prev, notFoundOutput]);
    }
  }, [createContext, login, t]);

  // Keep the ref pointing at the latest processCommand so runCommand (stable)
  // can call it without a circular dependency.
  useEffect(() => {
    processCommandRef.current = processCommand;
  }, [processCommand]);

  // Deep link: /terminal?cmd=about runs that command once data is ready.
  useEffect(() => {
    const cmd = new URLSearchParams(window.location.search).get('cmd');
    if (!cmd) return;
    const id = window.setTimeout(() => runCommand(cmd), 450);
    return () => window.clearTimeout(id);
  }, [runCommand]);

  // Inline autocomplete hint — the completion of the first matching command,
  // shown as dim ghost text after what the user typed (single token only).
  const hint = (() => {
    if (!input || /\s/.test(input)) return '';
    const lower = input.toLowerCase();
    const match = Object.keys(commands).find(c => c.startsWith(lower) && c !== lower);
    return match ? match.slice(input.length) : '';
  })();

  // Handle key press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isProcessing) {
      processCommand(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex;
        setHistoryIndex(newIndex);
        const value = commandHistory[commandHistory.length - 1 - newIndex] || '';
        setInput(value);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        const value = commandHistory[commandHistory.length - 1 - newIndex] || '';
        setInput(value);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // Simple tab completion
      const cmdNames = Object.keys(commands);
      const matches = cmdNames.filter(cmd => cmd.startsWith(input.toLowerCase()));
      if (matches.length === 1) {
        setInput(matches[0]);
      } else if (matches.length > 1) {
        // Show possible completions
        const completionOutput: TerminalOutput = {
          id: generateId(),
          output: matches.join('  '),
          timestamp: new Date(),
        };
        setOutputs(prev => [...prev, completionOutput]);
      }
    } else if (e.key === 'ArrowRight' && hint) {
      // Accept the inline suggestion when the caret is at the very end.
      const el = e.currentTarget;
      if (el.selectionStart === input.length && el.selectionEnd === input.length) {
        e.preventDefault();
        setInput(input + hint);
      }
    } else if (e.ctrlKey && e.key === 'l') {
      e.preventDefault();
      clearTerminal();
    } else if (e.ctrlKey && e.key === 'c') {
      e.preventDefault();
      setInput('');
      const interruptOutput: TerminalOutput = {
        id: generateId(),
        command: input + '^C',
        output: '',
        timestamp: new Date(),
      };
      setOutputs(prev => [...prev, interruptOutput]);
    }
  };

  // Get prompt string
  const getPrompt = () => {
    const user = isAuthenticated ? 'root' : 'visitor';
    const host = 'yasin-portfolio';
    const symbol = isAuthenticated ? '#' : '$';
    return (
      <span className="prompt">
        <span className="prompt-user">{user}</span>
        <span className="prompt-at">@</span>
        <span className="prompt-host">{host}</span>
        <span className="prompt-colon">:</span>
        <span className="prompt-path">~</span>
        <span className="prompt-symbol">{symbol}</span>
      </span>
    );
  };

  return (
    <div className={`terminal-container theme-${theme}`} onClick={handleTerminalClick}>
      <div className="terminal-header">
        <div className="terminal-buttons">
          <span className="btn-close"></span>
          <span className="btn-minimize"></span>
          <span className="btn-maximize"></span>
        </div>
        <div className="terminal-title">
          {isAuthenticated ? 'root@yasin-portfolio: ~' : 'visitor@yasin-portfolio: ~'}
        </div>
        <div className="terminal-actions">
          <span className="lang-badge" onClick={(e) => {
            e.stopPropagation();
            setLanguage(language === 'en' ? 'tr' : 'en');
          }}>
            {language.toUpperCase()}
          </span>
          <Link
            to="/"
            className="mode-switch-btn"
            onClick={(e) => e.stopPropagation()}
            title={language === 'tr' ? 'Mod Değiştir' : 'Change Mode'}
          >
            <span className="mode-switch-icon">⊞</span>
            {language === 'tr' ? 'Mod Değiştir' : 'Change Mode'}
          </Link>
        </div>
      </div>

      <div className="terminal-body" ref={terminalRef}>
        <div className="terminal-output" aria-live="polite">
          {outputs.map((output) => (
            <div key={output.id} className="output-line">
              {output.command !== undefined && (
                <div className="command-line">
                  {getPrompt()}
                  <span className="command-text">{output.command}</span>
                </div>
              )}
              {output.output && (
                <div className={`output-content ${output.isError ? 'error' : ''}`}>
                  {output.output}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className={`input-line${isFocused && !isProcessing ? ' is-focused' : ''}${input.length === 0 ? ' is-empty' : ''}`}>
          {getPrompt()}
          <span className="input-wrap">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={handleInputFocus}
              onBlur={() => setIsFocused(false)}
              className="terminal-input"
              autoFocus
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              inputMode="text"
              enterKeyHint="send"
              aria-label="Terminal command input"
              disabled={isProcessing}
            />
            {/* Inline autocomplete hint: an invisible copy of the typed text
                reserves the exact width, then the dim suffix shows right after. */}
            {hint && (
              <span className="input-hint" aria-hidden="true">
                <span className="input-hint-typed">{input}</span>
                <span className="input-hint-suffix">{hint}</span>
              </span>
            )}
            {/* Resting block cursor: shown only when the field is empty & focused,
                so the prompt looks "alive". Once typing starts the native accent
                caret takes over — always perfectly aligned, on every device. */}
            <span className="rest-cursor" aria-hidden="true" />
          </span>
        </div>
      </div>

      <div className="terminal-footer">
        <span className="footer-info">
          {isProcessing ? <><Icon name="hourglass" /> {t('processing')}</> : <><Icon name="check" /> {t('ready')}</>}
        </span>
        <span className="footer-stats">
          {data?.personal.skills.length || 0} {t('skillsLabel')} | {data?.workExperience.length || 0} {t('jobsLabel')} | {data?.testimonials.length || 0} {t('testimonialsLabel')}
        </span>
      </div>
    </div>
  );
};

export default Terminal;
