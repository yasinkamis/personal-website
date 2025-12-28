import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  query,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import type { PortfolioData, Message, Translations, WorkExperience, Testimonial, Education } from '../types';

// Collection names
const COLLECTIONS = {
  DATA: 'portfolioData',
  MESSAGES: 'messages',
  TRANSLATIONS: 'translations',
};

// Get portfolio data
export const getPortfolioData = async (): Promise<PortfolioData | null> => {
  try {
    const docRef = doc(db, COLLECTIONS.DATA, 'main');
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as PortfolioData;
    }
    return null;
  } catch (error) {
    console.error('Error getting portfolio data:', error);
    return null;
  }
};

// Update portfolio data
export const updatePortfolioData = async (data: Partial<PortfolioData>): Promise<boolean> => {
  try {
    const docRef = doc(db, COLLECTIONS.DATA, 'main');
    await updateDoc(docRef, data);
    return true;
  } catch (error) {
    console.error('Error updating portfolio data:', error);
    return false;
  }
};

// Set initial portfolio data
export const setPortfolioData = async (data: PortfolioData): Promise<boolean> => {
  try {
    const docRef = doc(db, COLLECTIONS.DATA, 'main');
    await setDoc(docRef, data);
    return true;
  } catch (error) {
    console.error('Error setting portfolio data:', error);
    return false;
  }
};

// Work Experience CRUD
export const addWorkExperience = async (experience: Omit<WorkExperience, 'id'>): Promise<boolean> => {
  try {
    const data = await getPortfolioData();
    if (!data) return false;

    const newId = Math.max(...data.workExperience.map(e => e.id), 0) + 1;
    const newExperience = { ...experience, id: newId };
    data.workExperience.unshift(newExperience);

    return await updatePortfolioData({ workExperience: data.workExperience });
  } catch (error) {
    console.error('Error adding work experience:', error);
    return false;
  }
};

export const updateWorkExperience = async (id: number, experience: Partial<WorkExperience>): Promise<boolean> => {
  try {
    const data = await getPortfolioData();
    if (!data) return false;

    const index = data.workExperience.findIndex(e => e.id === id);
    if (index === -1) return false;

    data.workExperience[index] = { ...data.workExperience[index], ...experience };
    return await updatePortfolioData({ workExperience: data.workExperience });
  } catch (error) {
    console.error('Error updating work experience:', error);
    return false;
  }
};

export const deleteWorkExperience = async (id: number): Promise<boolean> => {
  try {
    const data = await getPortfolioData();
    if (!data) return false;

    data.workExperience = data.workExperience.filter(e => e.id !== id);
    return await updatePortfolioData({ workExperience: data.workExperience });
  } catch (error) {
    console.error('Error deleting work experience:', error);
    return false;
  }
};

// Testimonials CRUD
export const addTestimonial = async (testimonial: Omit<Testimonial, 'id'>): Promise<boolean> => {
  try {
    const data = await getPortfolioData();
    if (!data) return false;

    const newId = Math.max(...data.testimonials.map(t => t.id), 0) + 1;
    const newTestimonial = { ...testimonial, id: newId };
    data.testimonials.push(newTestimonial);

    return await updatePortfolioData({ testimonials: data.testimonials });
  } catch (error) {
    console.error('Error adding testimonial:', error);
    return false;
  }
};

export const updateTestimonial = async (id: number, testimonial: Partial<Testimonial>): Promise<boolean> => {
  try {
    const data = await getPortfolioData();
    if (!data) return false;

    const index = data.testimonials.findIndex(t => t.id === id);
    if (index === -1) return false;

    data.testimonials[index] = { ...data.testimonials[index], ...testimonial };
    return await updatePortfolioData({ testimonials: data.testimonials });
  } catch (error) {
    console.error('Error updating testimonial:', error);
    return false;
  }
};

export const deleteTestimonial = async (id: number): Promise<boolean> => {
  try {
    const data = await getPortfolioData();
    if (!data) return false;

    data.testimonials = data.testimonials.filter(t => t.id !== id);
    return await updatePortfolioData({ testimonials: data.testimonials });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    return false;
  }
};

// Education CRUD
export const addEducation = async (education: Omit<Education, 'id'>): Promise<boolean> => {
  try {
    const data = await getPortfolioData();
    if (!data) return false;

    const newId = Math.max(...data.education.map(e => e.id), 0) + 1;
    const newEducation = { ...education, id: newId };
    data.education.push(newEducation);

    return await updatePortfolioData({ education: data.education });
  } catch (error) {
    console.error('Error adding education:', error);
    return false;
  }
};

export const updateEducation = async (id: number, education: Partial<Education>): Promise<boolean> => {
  try {
    const data = await getPortfolioData();
    if (!data) return false;

    const index = data.education.findIndex(e => e.id === id);
    if (index === -1) return false;

    data.education[index] = { ...data.education[index], ...education };
    return await updatePortfolioData({ education: data.education });
  } catch (error) {
    console.error('Error updating education:', error);
    return false;
  }
};

export const deleteEducation = async (id: number): Promise<boolean> => {
  try {
    const data = await getPortfolioData();
    if (!data) return false;

    data.education = data.education.filter(e => e.id !== id);
    return await updatePortfolioData({ education: data.education });
  } catch (error) {
    console.error('Error deleting education:', error);
    return false;
  }
};

// Messages
export const getMessages = async (): Promise<Message[]> => {
  try {
    const q = query(collection(db, COLLECTIONS.MESSAGES), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
    })) as Message[];
  } catch (error) {
    console.error('Error getting messages:', error);
    return [];
  }
};

export const addMessage = async (message: Omit<Message, 'id' | 'createdAt' | 'read'>): Promise<boolean> => {
  try {
    await addDoc(collection(db, COLLECTIONS.MESSAGES), {
      ...message,
      createdAt: Timestamp.now(),
      read: false,
    });
    return true;
  } catch (error) {
    console.error('Error adding message:', error);
    return false;
  }
};

export const markMessageAsRead = async (id: string): Promise<boolean> => {
  try {
    const docRef = doc(db, COLLECTIONS.MESSAGES, id);
    await updateDoc(docRef, { read: true });
    return true;
  } catch (error) {
    console.error('Error marking message as read:', error);
    return false;
  }
};

export const deleteMessage = async (id: string): Promise<boolean> => {
  try {
    const docRef = doc(db, COLLECTIONS.MESSAGES, id);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error('Error deleting message:', error);
    return false;
  }
};

// Translations
export const getTranslations = async (): Promise<Translations | null> => {
  try {
    const docRef = doc(db, COLLECTIONS.TRANSLATIONS, 'main');
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as Translations;
    }
    return null;
  } catch (error) {
    console.error('Error getting translations:', error);
    return null;
  }
};

export const updateTranslations = async (translations: Translations): Promise<boolean> => {
  try {
    const docRef = doc(db, COLLECTIONS.TRANSLATIONS, 'main');
    await setDoc(docRef, translations);
    return true;
  } catch (error) {
    console.error('Error updating translations:', error);
    return false;
  }
};

// Stats & Analytics
export interface SiteStats {
  totalVisitors: number;
  todayVisitors: number;
  totalMessages: number;
  unreadMessages: number;
  lastMessageDate: Date | null;
  totalCommands: number;
  popularCommands: { command: string; count: number }[];
}

export const trackVisitor = async (): Promise<void> => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const statsRef = doc(db, 'stats', 'visitors');
    const statsSnap = await getDoc(statsRef);

    if (statsSnap.exists()) {
      const data = statsSnap.data();
      const todayCount = data.daily?.[today] || 0;
      await updateDoc(statsRef, {
        total: (data.total || 0) + 1,
        [`daily.${today}`]: todayCount + 1,
        lastVisit: Timestamp.now(),
      });
    } else {
      await setDoc(statsRef, {
        total: 1,
        daily: { [today]: 1 },
        lastVisit: Timestamp.now(),
      });
    }
  } catch (error) {
    console.error('Error tracking visitor:', error);
  }
};

export const trackCommand = async (command: string): Promise<void> => {
  try {
    const statsRef = doc(db, 'stats', 'commands');
    const statsSnap = await getDoc(statsRef);

    if (statsSnap.exists()) {
      const data = statsSnap.data();
      await updateDoc(statsRef, {
        total: (data.total || 0) + 1,
        [`commands.${command}`]: (data.commands?.[command] || 0) + 1,
      });
    } else {
      await setDoc(statsRef, {
        total: 1,
        commands: { [command]: 1 },
      });
    }
  } catch (error) {
    console.error('Error tracking command:', error);
  }
};

export const getStats = async (): Promise<SiteStats> => {
  try {
    const today = new Date().toISOString().split('T')[0];

    // Get visitor stats
    const visitorRef = doc(db, 'stats', 'visitors');
    const visitorSnap = await getDoc(visitorRef);
    const visitorData = visitorSnap.exists() ? visitorSnap.data() : { total: 0, daily: {} };

    // Get command stats
    const commandRef = doc(db, 'stats', 'commands');
    const commandSnap = await getDoc(commandRef);
    const commandData = commandSnap.exists() ? commandSnap.data() : { total: 0, commands: {} };

    // Get messages
    const messages = await getMessages();
    const unreadMessages = messages.filter(m => !m.read).length;
    const lastMessage = messages.length > 0 ? messages[0].createdAt : null;

    // Get popular commands
    const commandCounts = commandData.commands || {};
    const popularCommands = Object.entries(commandCounts)
      .map(([command, count]) => ({ command, count: count as number }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalVisitors: visitorData.total || 0,
      todayVisitors: visitorData.daily?.[today] || 0,
      totalMessages: messages.length,
      unreadMessages,
      lastMessageDate: lastMessage,
      totalCommands: commandData.total || 0,
      popularCommands,
    };
  } catch (error) {
    console.error('Error getting stats:', error);
    return {
      totalVisitors: 0,
      todayVisitors: 0,
      totalMessages: 0,
      unreadMessages: 0,
      lastMessageDate: null,
      totalCommands: 0,
      popularCommands: [],
    };
  }
};
