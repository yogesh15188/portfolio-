export interface Project {
  id: string;
  num: string;
  title: string;
  description: string;
  tags: string[];
  icon: string; // Lucide icon name
  githubUrl: string;
  liveUrl: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  date: string;
  highlights: string[];
}

export interface SkillCategory {
  id: string;
  name: string;
  percentage: string;
  icon: string;
  description: string;
}

export interface SocialLinks {
  github: string;
  linkedin: string;
  email: string;
}

export interface ProfileConfig {
  name: string;
  titleBadge: string;
  role: string;
  education: string;
  bio: string;
  projectsBuilt: number;
  technologiesCount: number;
  yearsOfExperience: number;
}

// Default profile configurations
export const defaultProfile: ProfileConfig = {
  name: "Yogesh P",
  titleBadge: "Full-Stack Developer",
  role: "Full-Stack Developer",
  education: "B.E. Computer Science Graduate",
  bio: "For years, I've crafted end-to-end digital products — from responsive frontends to robust backends. My B.E. Computer Science background combined with hands-on development experience allows me to turn complex engineering problems into clean, scalable, high-impact software solutions.",
  projectsBuilt: 15,
  technologiesCount: 18,
  yearsOfExperience: 3,
};

// Default social links
export const defaultSocials: SocialLinks = {
  github: "https://github.com/yogeshyogesh15189-max",
  linkedin: "https://www.linkedin.com/in/p-yogesh-691411308",
  email: "yogeshyogesh15189@gmail.com",
};

// Default skill categories
export const defaultSkillCategories: SkillCategory[] = [
  {
    id: "frontend",
    name: "Frontend Development",
    percentage: "45%",
    icon: "Layout",
    description: "HTML, CSS, JavaScript, React, and Tailwind come together to craft polished, responsive, and highly animated interfaces. Every pixel serves a purpose — smooth interactions, dynamic loading, and fully accessible components define the user-centric frontends I deliver."
  },
  {
    id: "backend",
    name: "Backend Systems",
    percentage: "30%",
    icon: "Server",
    description: "Node.js, Express, and Python power robust, secure, and fast APIs and server-side processing modules. I design systems that handle data, file uploads, authentication, session routing, and real-time sockets with stability and performance."
  },
  {
    id: "db",
    name: "Databases",
    percentage: "15%",
    icon: "Database",
    description: "MongoDB for flexible schema-less structured document storage and PostgreSQL/SQL databases for highly relational data integrity. I craft optimized indexes, custom aggregation pipelines, and secure schemas."
  },
  {
    id: "devops",
    name: "Infrastructure & DevOps",
    percentage: "10%",
    icon: "Cloud",
    description: "Docker containerization, custom CI/CD build actions, and smooth cloud host operations on AWS, Vercel, and Cloud Run ensure scalable delivery and high availability of cloud-native solutions."
  }
];

// Default projects
export const defaultProjects: Project[] = [
  {
    id: "project-1",
    num: "01",
    title: "Navigation & Safety for Travelers",
    description: "Real-time travel navigation system with safety alerts, customized itinerary routes, and instant emergency features for travelers, built with robust full-stack architecture.",
    tags: ["React", "Node", "MongoDB", "Maps API"],
    icon: "MapPinned",
    githubUrl: "https://github.com/yogeshyogesh15189-max",
    liveUrl: "https://github.com/yogeshyogesh15189-max"
  },
  {
    id: "project-2",
    num: "02",
    title: "Task Manager Pro",
    description: "Productive task management application featuring category boards, priority ranking, visual progress tracking, and intelligent reminder notifications for seamless workflow execution.",
    tags: ["React", "Node", "SQL", "Tailwind"],
    icon: "CheckSquare",
    githubUrl: "https://github.com/yogeshyogesh15189-max",
    liveUrl: "https://github.com/yogeshyogesh15189-max"
  },
  {
    id: "project-3",
    num: "03",
    title: "Political Sentiment Analysis Platform",
    description: "Data-driven political analysis and research tool leveraging natural language processing for sentiment analysis, complete with gorgeous real-time trend visualizations.",
    tags: ["Python", "D3.js", "Flask", "NLP"],
    icon: "BarChart3",
    githubUrl: "https://github.com/yogeshyogesh15189-max",
    liveUrl: "https://github.com/yogeshyogesh15189-max"
  },
  {
    id: "project-4",
    num: "04",
    title: "E-Commerce Core",
    description: "High-performance online store complete with persistent shopping carts, secure custom checkouts, and a modern seller analytics dashboard for intuitive business tracking.",
    tags: ["React", "Node", "MongoDB", "Stripe"],
    icon: "ShoppingBag",
    githubUrl: "https://github.com/yogeshyogesh15189-max",
    liveUrl: "https://github.com/yogeshyogesh15189-max"
  },
  {
    id: "project-5",
    num: "05",
    title: "AI Chat Assistant",
    description: "Real-time chat platform with natural language AI-powered responses, interactive context memories, full WebSocket live integration, and secure JWT-based auth.",
    tags: ["Python", "React", "WebSockets", "Gemini API"],
    icon: "MessageSquare",
    githubUrl: "https://github.com/yogeshyogesh15189-max",
    liveUrl: "https://github.com/yogeshyogesh15189-max"
  },
  {
    id: "project-6",
    num: "06",
    title: "Secure File Storage & Upload Service",
    description: "Encrypted file upload and management server supporting multi-format files, real-time chunk upload tracking, and secure cloud bucket storage distribution.",
    tags: ["Python", "AWS S3", "React", "Crypto"],
    icon: "Upload",
    githubUrl: "https://github.com/yogeshyogesh15189-max",
    liveUrl: "https://github.com/yogeshyogesh15189-max"
  }
];

// Default experiences
export const defaultExperience: Experience[] = [
  {
    id: "exp-1",
    role: "Software Development Intern",
    company: "Tech Solutions Inc.",
    date: "2025 — 2026",
    highlights: [
      "Developed and maintained full-stack web applications using React, Node.js, and MongoDB.",
      "Engineered high-performance RESTful APIs serving 1,000+ daily developer requests with 99.9% uptime.",
      "Collaborated actively with cross-functional product teams in Agile sprints to ship features ahead of schedule.",
      "Optimized query aggregation pipelines and indexed collection structures, reducing database response times by 40%."
    ]
  }
];

// Local Storage Helper Functions
export const getStoredData = () => {
  if (typeof window === "undefined") {
    return {
      profile: defaultProfile,
      socials: defaultSocials,
      projects: defaultProjects,
      experience: defaultExperience
    };
  }

  try {
    const profile = localStorage.getItem("yog_profile") 
      ? JSON.parse(localStorage.getItem("yog_profile")!) 
      : defaultProfile;
    const socials = localStorage.getItem("yog_socials")
      ? JSON.parse(localStorage.getItem("yog_socials")!)
      : defaultSocials;
    const projects = localStorage.getItem("yog_projects")
      ? JSON.parse(localStorage.getItem("yog_projects")!)
      : defaultProjects;
    const experience = localStorage.getItem("yog_experience")
      ? JSON.parse(localStorage.getItem("yog_experience")!)
      : defaultExperience;

    return { profile, socials, projects, experience };
  } catch (error) {
    console.error("Failed to load portfolio storage:", error);
    return {
      profile: defaultProfile,
      socials: defaultSocials,
      projects: defaultProjects,
      experience: defaultExperience
    };
  }
};

export const saveStoredData = (data: {
  profile?: ProfileConfig;
  socials?: SocialLinks;
  projects?: Project[];
  experience?: Experience[];
}) => {
  if (typeof window === "undefined") return;

  try {
    if (data.profile) localStorage.setItem("yog_profile", JSON.stringify(data.profile));
    if (data.socials) localStorage.setItem("yog_socials", JSON.stringify(data.socials));
    if (data.projects) localStorage.setItem("yog_projects", JSON.stringify(data.projects));
    if (data.experience) localStorage.setItem("yog_experience", JSON.stringify(data.experience));
  } catch (error) {
    console.error("Failed to write portfolio storage:", error);
  }
};
