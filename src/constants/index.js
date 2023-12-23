import {
  mobile,
  backend,
  creator,
  web,
  javascript,
  typescript,
  html,
  css,
  reactjs,
  redux,
  tailwind,
  git,
  figma,
  bit32,
  jobswire,
  saü,
  pixel90,
  threejs,
  ai,
  antd,
  bootstrap,
  next,
  ps,
  sass,
  xd,
} from "../assets";

export const navLinks = [
  {
    id: "about",
    title: "About",
  },
  {
    id: "work",
    title: "Work",
  },
  {
    id: "contact",
    title: "Contact",
  },
];

const services = [
  {
    title: "Web Developer",
    icon: web,
  },
  {
    title: "Front End Developer",
    icon: mobile,
  },
  {
    title: "Javascript Developer",
    icon: backend,
  },
  {
    title: "UI & UX Design",
    icon: creator,
  },
];

const technologies = [
  {
    name: "HTML 5",
    icon: html,
  },
  {
    name: "JavaScript",
    icon: javascript,
  },
  {
    name: "React JS",
    icon: reactjs,
  },
  {
    name: "next",
    icon: next,
  },
  {
    name: "sass",
    icon: sass,
  },
  {
    name: "Redux Toolkit",
    icon: redux,
  },
  {
    name: "Tailwind CSS",
    icon: tailwind,
  }
];

const technologies2 = [
  {
    name: "git",
    icon: git,
  },
  {
    name: "figma",
    icon: figma,
  },
  {
    name: "ai",
    icon: ai,
  },
  {
    name: "antd",
    icon: antd,
  },
  {
    name: "bootstrap",
    icon: bootstrap,
  },
  {
    name: "xd",
    icon: xd,
  }
];

const experiences = [
  {
    title: "Front End Developer",
    company_name: "JobSwire",
    icon: jobswire,
    iconBg: "#FFF",
    date: "Jul 2021 - May 2022",
  },
  {
    title: "Front End Developer",
    company_name: "90Pixel",
    icon: pixel90,
    iconBg: "#FFF",
    date: "Feb 2022 - Sep 2022",
  },
  {
    title: "Front End Developer",
    company_name: "Sakarya Üniversitesi",
    icon: saü,
    iconBg: "#FFF",
    date: "Nov 2022 - Jan 2023",
  },
  {
    title: "Front End Developer",
    company_name: "32bit Bilgisayar Hizmetleri Ltd. Şti.",
    icon: bit32,
    iconBg: "#FFF",
    date: "Jan 2023 - Present",
  },
];

const testimonials = [
  {
    testimonial:
      "Yasin ile çeşitli projelerde bir araya geldik. Yasin, sorunlara yaratıcı ve hızlı çözümler üretme yeteneği ile dikkat çeken biri. Ayrıca son derece disiplinli ve planlı bir çalışma tarzına sahip. Onunla çalışmak güven verici ve keyifli bir deneyimdi. Yasin'in üzerinde çalışıp çözemeyeceği bir problem olmadığına inanıyorum.",
    name: "Erhan Akyel",
    designation: "Front End Developer",
    company: "90Pixel",
    image:
      "https://media.licdn.com/dms/image/D4D03AQGHQMf_26_q_g/profile-displayphoto-shrink_100_100/0/1679835318572?e=1708560000&v=beta&t=SKLTOb9HFLNBj2WGMxRs9JxMRQapBswjqcHkKSGKpsQ",
  },
  {
    testimonial:
      "Yasin sorumluluk sahibi ve iyi iletişim becerilerine sahip bir takım arkadaşı. İşimize verdiği değeri her zaman gösterir ve kendini geliştirmek için sürekli çaba sarf eder. Onunla çalışmak gerçekten keyifliydi.",
    name: "Ceren Aktaş",
    designation: "Back End Developer",
    company: "90Pixel",
    image:
      "https://media.licdn.com/dms/image/C5603AQFT6GiSt-d0Hw/profile-displayphoto-shrink_100_100/0/1655315100073?e=1708560000&v=beta&t=lmwoOG5VyaOj0MSGTHiwpxnW2N_ZRFVPjrAWdM26JUs",
  },
  {
    testimonial:
      "Yasin ile birçok projede beraber çalıştık. Her zaman güvenebileceğim bir takım arkadaşı oldu. İletişimi kuvvetli, öğrenmeye açık ve problemlere karşı hızlı çözümler üretebilecek yetkinliğe sahip.",
    name: "Aydoğan Sarı",
    designation: "Front End Developer",
    company: "90Pixel",
    image:
      "https://media.licdn.com/dms/image/D4D03AQFsli2lbFu9tA/profile-displayphoto-shrink_100_100/0/1696856253852?e=1708560000&v=beta&t=MuMAqXSbk-0D91dGkqE9OmjUKYLW1GWC-SUz5aTPy2k",
  },
  {
    testimonial:
      "Yasin ile beraber yaklaşık 6 aydır aynı proje üzerinde çalışıyoruz. Kendisi Frontend Development anlamında oldukça yetkin ve bilgili. Ayni zamanda yeni teknojileri öğrenmek, onları kullanmak konusunda fazlasıyla hevesli, öğrenmeye açık. Takım içi iletişimde de kendisi ile hiçbir problem yaşamadık. Yasin ile çalışılmasını kesinlikle tavsiye ederim.",
    name: "Sercan Gündoğan",
    designation: "Full Stack Developer",
    company: "JobSwire",
    image:
      "https://media.licdn.com/dms/image/D4D03AQEduEfBjnH17A/profile-displayphoto-shrink_100_100/0/1690783930265?e=1708560000&v=beta&t=kw-MTe3lP1bbgYa2jQA1AzLw1RiY21Ys-vOtn5MY_Ak",
  },
  {
    testimonial:
      "Uzun süredir Yasin Kamış ile birlikte çalışmaktayız. Kendisinin disiplinli oluşu, işleri pratik ve hızlı bir şekilde halletmesi ve her probleme 'bunu çözebilirim' şeklinde yaklaşması bizler için sahip olduğu en önemli özelliklerdendir. Aynı zamanda Frontend ekibimizin yönetimini üstlenerek projenin planlı ve düzenli bir şekilde ilerlemesine katkılar sağlamıştır. Sürekli sorgulayan ve araştıran kimliğiyle öğrenmeyi seven heyecanı ekip olarak bizleri de heyecanlandırmaktadır. Bu sebeple Yasin Kamış ile çalışılmasını kesinlikte tavsiye ederim.",
    name: "Sena Gümüşer",
    designation: "Founder",
    company: "JobSwire",
    image:
      "https://media.licdn.com/dms/image/D4D03AQGwoeboJjDBYA/profile-displayphoto-shrink_100_100/0/1666618662602?e=1708560000&v=beta&t=b_1mB5vSZVLLJpNs-l8kl_hvosOAdS61peA37btdCnc",
  },
];

export { services, technologies, experiences, testimonials, technologies2 };
