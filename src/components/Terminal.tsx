import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useData } from '../contexts/DataContext';
import { commands } from '../commands';
import { trackCommand } from '../services/dataService';
import type { TerminalOutput, CommandContext } from '../types';
import './Terminal.css';

const Terminal: React.FC = () => {
  const [input, setInput] = useState('');
  const [outputs, setOutputs] = useState<TerminalOutput[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isProcessing, setIsProcessing] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

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
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [outputs]);

  // Focus input on click
  const handleTerminalClick = () => {
    inputRef.current?.focus();
  };

  // Welcome message
  useEffect(() => {
    const welcomeOutput: TerminalOutput = {
      id: generateId(),
      output: (
        <div className="welcome-message">
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
          <p className="welcome-version">v1.0.0 | React Vite + TypeScript + Firebase</p>
        </div>
      ),
      timestamp: new Date(),
    };
    setOutputs([welcomeOutput]);
  }, [t]);

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
  }), [isAuthenticated, currentUser, language, setLanguage, t, clearTerminal, addOutput, data, setData, refreshData, logout]);

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
              <span className="success-icon">🔓</span>
              <span>{t('loginSuccess')}</span>
            </div>
          ) : (
            <div className="login-failed">
              <span className="error-icon">🔒</span>
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
        setInput(commandHistory[commandHistory.length - 1 - newIndex] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex] || '');
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
    <div className="terminal-container" onClick={handleTerminalClick}>
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
        </div>
      </div>

      <div className="terminal-body" ref={terminalRef}>
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

        <div className="input-line">
          {getPrompt()}
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="terminal-input"
            autoFocus
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            disabled={isProcessing}
          />
          <span className="cursor"></span>
        </div>
      </div>

      <div className="terminal-footer">
        <span className="footer-info">
          {isProcessing ? '⏳ Processing...' : '✓ Ready'}
        </span>
        <span className="footer-stats">
          {data?.personal.skills.length || 0} skills | {data?.workExperience.length || 0} jobs | {data?.testimonials.length || 0} testimonials
        </span>
      </div>
    </div>
  );
};

export default Terminal;
