// Terminal Types
export interface CommandResult {
  output: string | React.ReactNode;
  isError?: boolean;
  isHTML?: boolean;
  isAsync?: boolean;
}

export interface Command {
  name: string;
  description: string;
  usage?: string;
  execute: (args: string[], context: CommandContext) => CommandResult | Promise<CommandResult>;
}

export interface CommandContext {
  setIsAuthenticated: (value: boolean) => void;
  isAuthenticated: boolean;
  currentUser: User | null;
  language: 'en' | 'tr';
  setLanguage: (lang: 'en' | 'tr') => void;
  t: (key: string) => string;
  clearTerminal: () => void;
  addOutput: (output: TerminalOutput) => void;
  data: PortfolioData | null;
  setData: (data: PortfolioData) => void;
  refreshData: () => Promise<void>;
}

export interface TerminalOutput {
  id: string;
  command?: string;
  output: string | React.ReactNode;
  isError?: boolean;
  timestamp: Date;
  isHTML?: boolean;
}

export interface User {
  uid: string;
  email: string | null;
}

// Portfolio Data Types
export interface Personal {
  name: string;
  title: string;
  bio: string;
  avatar: string;
  location: string;
  skills: string[];
}

export interface Overview {
  greeting: string;
  description: string;
  yearsOfExperience: number;
  projectsCompleted: number;
}

export interface WorkExperience {
  id: number;
  company: string;
  position: string;
  duration: string;
  location: string;
  description: string;
  technologies: string[];
  achievements: string[];
}

export interface Testimonial {
  id: number;
  name: string;
  position: string;
  company: string;
  text: string;
}

export interface Education {
  id: number;
  school: string;
  degree: string;
  duration: string;
  location: string;
  description: string;
  gpa: string;
  courses: string[];
}

export interface Contact {
  email: string;
  location: string;
  social: {
    github: string;
    linkedin: string;
  };
  availability: string;
  responseTime: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: Date;
  read: boolean;
}

export interface PortfolioData {
  personal: Personal;
  overview: Overview;
  workExperience: WorkExperience[];
  testimonials: Testimonial[];
  education: Education[];
  contact: Contact;
}

export interface Translations {
  [key: string]: {
    en: string;
    tr: string;
  };
}
