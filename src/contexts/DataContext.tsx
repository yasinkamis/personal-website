import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { getPortfolioData } from '../services/dataService';
import { useLanguage } from './LanguageContext';
import type { PortfolioData } from '../types';

// English data
const initialDataEN: PortfolioData = {
  personal: {
    name: "Yasin Kamis",
    title: "Frontend Developer",
    bio: "I have more than four years of software development experience. I embarked on this journey starting with Python, followed by C++, C#, and JavaScript, and later developed an interest in Adobe Design Programs. This led me to enter the field of Frontend Development, where software and design converge. Producing high-quality content is of great importance to me. I am still eagerly developing myself in this field and learning the latest technologies.",
    avatar: "/assets/avatar.jpg",
    location: "Turkey",
    skills: ["React", "Next.js", "Vite.js", "JavaScript", "TypeScript", "Redux", "Zustand", "React Query", "styled-components", "MUI", "Ant Design", "Tailwind", "Bootstrap", "SCSS", "CSS3", "HTML5", "Framer Motion", "GraphQL", "REST", "Node.js", "Java", "Spring Boot", "Spring MVC", "Git", "Docker", "Jenkins", "Webpack", "Vite", "Figma", "Photoshop", "Illustrator", "Adobe XD", "Eslint", "Jira"]
  },
  overview: {
    greeting: "Hello, I'm",
    description: "I have more than four years of software development experience. I embarked on this journey starting with Python, followed by C++, C#, and JavaScript, and later developed an interest in Adobe Design Programs. This led me to enter the field of Frontend Development, where software and design converge. Producing high-quality content is of great importance to me. I am still eagerly developing myself in this field and learning the latest technologies.",
    yearsOfExperience: 4,
    projectsCompleted: 20
  },
  workExperience: [
    {
      id: 1,
      company: "32bit",
      position: "Frontend Developer",
      duration: "Jan 2023 – Present",
      location: "Remote",
      description: "As a team leader, I support professional projects in web development and UI design.\n • Fişçek: An AI-integrated accounting application. Users can upload receipts, and AI processes them to extract expense details. The system allows expense requests to be created and managed through approval stages.\n • BAM (Business Automation Manager): A business automation platform containing 30+ React projects. It manages business processes and follows strict coding standards with shared UI components in a theme library.\n • BAM includes Hub, a social media platform where users can create communities, share posts and announcements, and interact through likes and comments.\n • Defined project direction and standards.\n • Led the development process from start to finish.\n • Provided mentorship to the team and guided interns.\n • Vakko Web Kasa: Contributed to screen designs and project development for POS applications used in Vakko stores.",
      technologies: ["React", "TypeScript", "JavaScript", "styled-components", "MUI", "Next.js", "GraphQL", "Node.js", "Ant Design", "SCSS", "Webpack", "Bootstrap", "Tailwind", "Docker", "Jenkins", "Git", "Figma", "Photoshop", "Eslint", "Jira"],
      achievements: [
        "Led end-to-end development and defined project standards for multiple professional web and UI projects.",
        "Supported and mentored the frontend team, including guiding interns and ensuring adherence to best practices.",
        "Developed AI-integrated accounting application (Fişçek) and POS screens for Vakko Web Kasa",
        "Managed and contributed to BAM platform, including 30+ React projects and the Hub social media module with shared UI components and strict coding standards."
      ]
    },
    {
      id: 2,
      company: "Sakarya University",
      position: "Student Assistant – Frontend Developer",
      duration: "Sep 2022 – Jan 2023",
      location: "Sakarya",
      description: "Worked on web projects used by students and faculty at the university.",
      technologies: ["Next.js", "React", "JavaScript", "styled-components", "REST", "Eslint", "Git"],
      achievements: [
        "Developed and maintained web applications used by students and faculty at the university."
      ]
    },
    {
      id: 3,
      company: "90Pixel",
      position: "Frontend Developer",
      duration: "Feb 2022 – Sep 2022",
      location: "Remote",
      description: "I participated in various projects and worked in an environment where the team continuously improved itself. We researched and learned new technologies while providing training to each other. We followed strict coding standards in software development. I also gained experience in client relations, actively participating in analysis and presentation processes.\n • Tipstory: A micro-learning platform that allows knowledge sharing in a social media-style interface.\n • TİSAŞ (Trabzon Silah Sanayi A.Ş.): A firearm sales website developed with a dynamic frontend (CMS). Users could manage content via the admin panel.\n • Aragez: A map-based restaurant discovery application; I worked on the admin panel.\n • Turkish Islamic Encyclopedia: Developed an admin panel for content editing and categorization.\n • TUA (Turkish Space Agency): Reviewed and supported the CMS system improvements.",
      technologies: ["Next.js", "React", "JavaScript", "TypeScript", "styled-components", "GraphQL", "Node.js", "Ant Design", "REST", "Git", "Eslint", "Figma"],
      achievements: [
        "Contributed to multiple frontend projects while fostering a culture of continuous learning and team-led training.",
        "Gained hands-on experience in client communication, analysis, and presentation processes.",
        "Ensured high-quality software through adherence to strict coding standards and modern development practices.",
        "Developed and maintained dynamic frontend systems for diverse clients, including TİSAŞ, TUA, and the Turkish Islamic Encyclopedia."
      ]
    },
    {
      id: 4,
      company: "JobSwire",
      position: "Frontend Developer",
      duration: "Jul 2021 – Jun 2022",
      location: "Remote",
      description: "As a startup, we developed an application that helps people find jobs more easily. Users could complete surveys to receive the best job matches and share their results. I worked as a React developer and team lead. Defined project standards and managed the project's progress. Maintained the structure of the frontend team and managed the workflow. Participated in interviews for new frontend developers, prepared case studies, and played an active role in team selection.",
      technologies: ["React", "JavaScript", "SCSS", "Webpack", "Node.js", "Bootstrap", "JQuery", "Eslint", "REST", "Git", "Figma"],
      achievements: [
        "Led the frontend team and defined React development standards for a scalable job-matching platform.",
        "Managed project workflow and delivery, ensuring timely progress and high code quality.",
        "Conducted interviews and prepared case studies to build a strong frontend team."
      ]
    }
  ],
  testimonials: [
    {
      id: 1,
      name: "Erhan Akyel",
      position: "Frontend Developer",
      company: "90Pixel",
      text: "I worked with Yasin on various projects. Yasin stands out with his ability to produce creative and quick solutions to problems. He also has an extremely disciplined and organized work style. Working with him was a reassuring and enjoyable experience. I believe there is no problem Yasin can't solve."
    },
    {
      id: 2,
      name: "Ceren Aktaş",
      position: "Backend Developer",
      company: "90Pixel",
      text: "Yasin is a responsible teammate with excellent communication skills. He always shows the value he places on our work and constantly strives to improve himself. Working with him was truly enjoyable."
    },
    {
      id: 3,
      name: "Aydoğan Sarı",
      position: "Frontend Developer",
      company: "90Pixel",
      text: "I worked with Yasin on many projects. He was always a teammate I could rely on. He has strong communication skills, is open to learning, and has the competence to produce quick solutions to problems."
    },
    {
      id: 4,
      name: "Sercan Gündoğan",
      position: "Fullstack Developer",
      company: "JobSwire",
      text: "I've been working with Yasin on the same project for about 6 months. He is quite competent and knowledgeable in Frontend Development. At the same time, he is very eager to learn new technologies and use them. We had no problems with team communication. I definitely recommend working with Yasin."
    },
    {
      id: 5,
      name: "Sena Gümüşer",
      position: "Founder",
      company: "JobSwire",
      text: "We have been working with Yasin Kamış for a long time. His discipline, his ability to handle tasks practically and quickly, and his approach to every problem with 'I can solve this' are among his most important qualities. He also took on the management of our Frontend team and contributed to the planned and orderly progress of the project. His questioning and researching nature and his enthusiasm for learning excites us as a team. For this reason, I definitely recommend working with Yasin Kamış."
    }
  ],
  education: [
    {
      id: 1,
      school: "Sakarya University",
      degree: "Bachelor's Degree in Computer Systems Engineering",
      duration: "2020 – 2024",
      location: "Sakarya, Turkey",
      description: "Graduated with a strong foundation in software development, algorithms, and system design.",
      gpa: "2.58/4.0",
      courses: ["Data Structures & Algorithms", "Web Development", "Database Systems", "Software Engineering", "Operating Systems", "Computer Networks"]
    }
  ],
  contact: {
    email: "yasin-kamis90@outlook.com",
    location: "Turkey",
    social: {
      github: "https://github.com/yasinkamis",
      linkedin: "https://linkedin.com/in/yasinkamis"
    },
    availability: "Open to relocation.",
    responseTime: "Usually responds within 24 hours"
  }
};

// Turkish data
const initialDataTR: PortfolioData = {
  personal: {
    name: "Yasin Kamış",
    title: "Frontend Geliştirici",
    bio: "Dört yılı aşkın yazılım geliştirme deneyimim var. Bu yolculuğa Python ile başladım, ardından C++, C# ve JavaScript ile devam ettim ve daha sonra Adobe Tasarım Programlarına ilgi duymaya başladım. Bu da beni yazılım ve tasarımın birleştiği Frontend Geliştirme alanına yöneltti. Yüksek kaliteli içerik üretmek benim için büyük önem taşıyor. Bu alanda kendimi hâlâ hevesle geliştiriyor ve en son teknolojileri öğreniyorum.",
    avatar: "/assets/avatar.jpg",
    location: "Türkiye",
    skills: ["React", "Next.js", "Vite.js", "JavaScript", "TypeScript", "Redux", "Zustand", "React Query", "styled-components", "MUI", "Ant Design", "Tailwind", "Bootstrap", "SCSS", "CSS3", "HTML5", "Framer Motion", "GraphQL", "REST", "Node.js", "Java", "Spring Boot", "Spring MVC", "Git", "Docker", "Jenkins", "Webpack", "Vite", "Figma", "Photoshop", "Illustrator", "Adobe XD", "Eslint", "Jira"]
  },
  overview: {
    greeting: "Merhaba, ben",
    description: "Dört yılı aşkın yazılım geliştirme deneyimim var. Bu yolculuğa Python ile başladım, ardından C++, C# ve JavaScript ile devam ettim ve daha sonra Adobe Tasarım Programlarına ilgi duymaya başladım. Bu da beni yazılım ve tasarımın birleştiği Frontend Geliştirme alanına yöneltti. Yüksek kaliteli içerik üretmek benim için büyük önem taşıyor. Bu alanda kendimi hâlâ hevesle geliştiriyor ve en son teknolojileri öğreniyorum.",
    yearsOfExperience: 4,
    projectsCompleted: 20
  },
  workExperience: [
    {
      id: 1,
      company: "32bit",
      position: "Frontend Geliştirici",
      duration: "Oca 2023 – Halen",
      location: "Uzaktan",
      description: "Takım lideri olarak web geliştirme ve UI tasarımı alanında profesyonel projeleri destekliyorum.\n • Fişçek: Yapay zeka entegreli bir muhasebe uygulaması. Kullanıcılar fişleri yükleyebilir ve yapay zeka bunları işleyerek harcama detaylarını çıkarır. Sistem, masraf taleplerinin oluşturulmasına ve onay aşamalarından geçirilmesine olanak tanır.\n • BAM (Business Automation Manager): 30'dan fazla React projesi içeren bir iş otomasyon platformu. İş süreçlerini yönetir ve tema kütüphanesindeki ortak UI bileşenleriyle sıkı kodlama standartlarını takip eder.\n • BAM, kullanıcıların topluluklar oluşturabildiği, paylaşımlar ve duyurular yayınlayabildiği, beğeni ve yorumlarla etkileşimde bulunabildiği bir sosyal medya platformu olan Hub'ı içerir.\n • Proje yönünü ve standartlarını belirledim.\n • Geliştirme sürecini baştan sona yönettim.\n • Takıma mentorluk yaptım ve stajyerlere rehberlik ettim.\n • Vakko Web Kasa: Vakko mağazalarında kullanılan POS uygulamaları için ekran tasarımlarına ve proje geliştirmesine katkıda bulundum.",
      technologies: ["React", "TypeScript", "JavaScript", "styled-components", "MUI", "Next.js", "GraphQL", "Node.js", "Ant Design", "SCSS", "Webpack", "Bootstrap", "Tailwind", "Docker", "Jenkins", "Git", "Figma", "Photoshop", "Eslint", "Jira"],
      achievements: [
        "Birden fazla profesyonel web ve UI projesinde uçtan uca geliştirmeyi yönettim ve proje standartlarını belirledim.",
        "Stajyerlere rehberlik etmek ve en iyi uygulamalara uyumu sağlamak dahil frontend ekibini destekledim ve mentorluk yaptım.",
        "Yapay zeka entegreli muhasebe uygulaması (Fişçek) ve Vakko Web Kasa için POS ekranları geliştirdim.",
        "30'dan fazla React projesi ve ortak UI bileşenleri ile sıkı kodlama standartlarına sahip Hub sosyal medya modülü dahil BAM platformunu yönettim ve katkıda bulundum."
      ]
    },
    {
      id: 2,
      company: "Sakarya Üniversitesi",
      position: "Öğrenci Asistanı – Frontend Geliştirici",
      duration: "Eyl 2022 – Oca 2023",
      location: "Sakarya",
      description: "Üniversitede öğrenciler ve akademisyenler tarafından kullanılan web projeleri üzerinde çalıştım.",
      technologies: ["Next.js", "React", "JavaScript", "styled-components", "REST", "Eslint", "Git"],
      achievements: [
        "Üniversitede öğrenciler ve akademisyenler tarafından kullanılan web uygulamalarını geliştirdim ve bakımını yaptım."
      ]
    },
    {
      id: 3,
      company: "90Pixel",
      position: "Frontend Geliştirici",
      duration: "Şub 2022 – Eyl 2022",
      location: "Uzaktan",
      description: "Çeşitli projelerde yer aldım ve takımın sürekli kendini geliştirdiği bir ortamda çalıştım. Birbirimize eğitim verirken yeni teknolojileri araştırdık ve öğrendik. Yazılım geliştirmede sıkı kodlama standartlarını takip ettik. Ayrıca müşteri ilişkilerinde deneyim kazandım, analiz ve sunum süreçlerine aktif olarak katıldım.\n • Tipstory: Sosyal medya tarzı bir arayüzde bilgi paylaşımına olanak tanıyan bir mikro-öğrenme platformu.\n • TİSAŞ (Trabzon Silah Sanayi A.Ş.): Dinamik frontend (CMS) ile geliştirilmiş bir silah satış web sitesi. Kullanıcılar admin paneli üzerinden içeriği yönetebiliyordu.\n • Aragez: Harita tabanlı bir restoran keşif uygulaması; admin paneli üzerinde çalıştım.\n • Türk İslam Ansiklopedisi: İçerik düzenleme ve kategorilendirme için admin paneli geliştirdim.\n • TUA (Türkiye Uzay Ajansı): CMS sistem iyileştirmelerini inceledim ve destekledim.",
      technologies: ["Next.js", "React", "JavaScript", "TypeScript", "styled-components", "GraphQL", "Node.js", "Ant Design", "REST", "Git", "Eslint", "Figma"],
      achievements: [
        "Sürekli öğrenme ve takım içi eğitim kültürünü desteklerken birden fazla frontend projesine katkıda bulundum.",
        "Müşteri iletişimi, analiz ve sunum süreçlerinde uygulamalı deneyim kazandım.",
        "Sıkı kodlama standartlarına ve modern geliştirme pratiklerine bağlı kalarak yüksek kaliteli yazılım sağladım.",
        "TİSAŞ, TUA ve Türk İslam Ansiklopedisi dahil çeşitli müşteriler için dinamik frontend sistemleri geliştirdim ve bakımını yaptım."
      ]
    },
    {
      id: 4,
      company: "JobSwire",
      position: "Frontend Geliştirici",
      duration: "Tem 2021 – Haz 2022",
      location: "Uzaktan",
      description: "Bir startup olarak insanların daha kolay iş bulmasına yardımcı olan bir uygulama geliştirdik. Kullanıcılar anketleri tamamlayarak en iyi iş eşleşmelerini alabilir ve sonuçlarını paylaşabilirdi. React geliştirici ve takım lideri olarak çalıştım. Proje standartlarını belirledim ve projenin ilerleyişini yönettim. Frontend takımının yapısını korudum ve iş akışını yönettim. Yeni frontend geliştiriciler için mülakatlara katıldım, vaka çalışmaları hazırladım ve takım seçiminde aktif rol oynadım.",
      technologies: ["React", "JavaScript", "SCSS", "Webpack", "Node.js", "Bootstrap", "JQuery", "Eslint", "REST", "Git", "Figma"],
      achievements: [
        "Ölçeklenebilir bir iş eşleştirme platformu için frontend ekibini yönettim ve React geliştirme standartlarını belirledim.",
        "Zamanında ilerleme ve yüksek kod kalitesi sağlayarak proje iş akışını ve teslimini yönettim.",
        "Güçlü bir frontend ekibi oluşturmak için mülakatlar yaptım ve vaka çalışmaları hazırladım."
      ]
    }
  ],
  testimonials: [
    {
      id: 1,
      name: "Erhan Akyel",
      position: "Frontend Geliştirici",
      company: "90Pixel",
      text: "Yasin ile çeşitli projelerde bir araya geldik. Yasin, sorunlara yaratıcı ve hızlı çözümler üretme yeteneği ile dikkat çeken biri. Ayrıca son derece disiplinli ve planlı bir çalışma tarzına sahip. Onunla çalışmak güven verici ve keyifli bir deneyimdi. Yasin'in üzerinde çalışıp çözemeyeceği bir problem olmadığına inanıyorum."
    },
    {
      id: 2,
      name: "Ceren Aktaş",
      position: "Backend Geliştirici",
      company: "90Pixel",
      text: "Yasin sorumluluk sahibi ve iyi iletişim becerilerine sahip bir takım arkadaşı. İşimize verdiği değeri her zaman gösterir ve kendini geliştirmek için sürekli çaba sarf eder. Onunla çalışmak gerçekten keyifliydi."
    },
    {
      id: 3,
      name: "Aydoğan Sarı",
      position: "Frontend Geliştirici",
      company: "90Pixel",
      text: "Yasin ile birçok projede beraber çalıştık. Her zaman güvenebileceğim bir takım arkadaşı oldu. İletişimi kuvvetli, öğrenmeye açık ve problemlere karşı hızlı çözümler üretebilecek yetkinliğe sahip."
    },
    {
      id: 4,
      name: "Sercan Gündoğan",
      position: "Fullstack Geliştirici",
      company: "JobSwire",
      text: "Yasin ile beraber yaklaşık 6 aydır aynı proje üzerinde çalışıyoruz. Kendisi Frontend Development anlamında oldukça yetkin ve bilgili. Aynı zamanda yeni teknolojileri öğrenmek, onları kullanmak konusunda fazlasıyla hevesli, öğrenmeye açık. Takım içi iletişimde de kendisi ile hiçbir problem yaşamadık. Yasin ile çalışılmasını kesinlikle tavsiye ederim."
    },
    {
      id: 5,
      name: "Sena Gümüşer",
      position: "Kurucu",
      company: "JobSwire",
      text: "Uzun süredir Yasin Kamış ile birlikte çalışmaktayız. Kendisinin disiplinli oluşu, işleri pratik ve hızlı bir şekilde halletmesi ve her probleme 'bunu çözebilirim' şeklinde yaklaşması bizler için sahip olduğu en önemli özelliklerdendir. Aynı zamanda Frontend ekibimizin yönetimini üstlenerek projenin planlı ve düzenli bir şekilde ilerlemesine katkılar sağlamıştır. Sürekli sorgulayan ve araştıran kimliğiyle öğrenmeyi seven heyecanı ekip olarak bizleri de heyecanlandırmaktadır. Bu sebeple Yasin Kamış ile çalışılmasını kesinlikle tavsiye ederim."
    }
  ],
  education: [
    {
      id: 1,
      school: "Sakarya Üniversitesi",
      degree: "Bilgisayar ve Bilişim Mühendisliği Lisans",
      duration: "2020 – 2024",
      location: "Sakarya, Türkiye",
      description: "Yazılım geliştirme, algoritmalar ve sistem tasarımı alanlarında güçlü bir temel ile mezun oldum.",
      gpa: "2.58/4.0",
      courses: ["Veri Yapıları ve Algoritmalar", "Web Geliştirme", "Veritabanı Sistemleri", "Yazılım Mühendisliği", "İşletim Sistemleri", "Bilgisayar Ağları"]
    }
  ],
  contact: {
    email: "yasin-kamis90@outlook.com",
    location: "Türkiye",
    social: {
      github: "https://github.com/yasinkamis",
      linkedin: "https://linkedin.com/in/yasinkamis"
    },
    availability: "Yer değiştirmeye açık.",
    responseTime: "Genellikle 24 saat içinde yanıt verir"
  }
};

// Get initial data based on language
const getInitialData = (language: 'en' | 'tr'): PortfolioData => {
  return language === 'tr' ? initialDataTR : initialDataEN;
};

interface DataContextType {
  data: PortfolioData | null;
  setData: (data: PortfolioData) => void;
  refreshData: () => Promise<void>;
  loading: boolean;
}

const DataContext = createContext<DataContextType | null>(null);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const { language } = useLanguage();
  const [data, setData] = useState<PortfolioData | null>(getInitialData(language));
  const [loading, setLoading] = useState(true);

  const refreshData = useCallback(async () => {
    setLoading(true);
    try {
      const firebaseData = await getPortfolioData();
      if (firebaseData) {
        setData(firebaseData);
      } else {
        // Use initial data based on language if Firebase data is not available
        setData(getInitialData(language));
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
      setData(getInitialData(language));
    } finally {
      setLoading(false);
    }
  }, [language]);

  // Update data when language changes
  useEffect(() => {
    // Only update to local data if Firebase data is not available
    setData(getInitialData(language));
  }, [language]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const value: DataContextType = {
    data,
    setData,
    refreshData,
    loading,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export { initialDataEN, initialDataTR, getInitialData };
