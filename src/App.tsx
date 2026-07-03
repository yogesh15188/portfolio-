import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  Layout,
  Server,
  Database,
  Cloud,
  MapPinned,
  CheckSquare,
  BarChart3,
  ShoppingBag,
  MessageSquare,
  Upload,
  Code2,
  Settings,
  Save,
  X,
  ChevronRight,
  GraduationCap,
  Sparkles,
  RefreshCw,
  Sliders,
  Check,
  Plus,
  Trash2,
  ArrowUpRight
} from "lucide-react";
import {
  getStoredData,
  saveStoredData,
  defaultProfile,
  defaultSocials,
  defaultProjects,
  defaultExperience,
  defaultSkillCategories,
  Project,
  SocialLinks,
  ProfileConfig,
  Experience,
  SkillCategory
} from "./data";
import { Chatbot } from "./components/Chatbot";

// Icon Mapper helper for rendering dynamic icons from strings safely
const renderIcon = (iconName: string, className = "w-6 h-6 text-gold") => {
  switch (iconName) {
    case "Layout": return <Layout className={className} />;
    case "Server": return <Server className={className} />;
    case "Database": return <Database className={className} />;
    case "Cloud": return <Cloud className={className} />;
    case "MapPinned": return <MapPinned className={className} />;
    case "CheckSquare": return <CheckSquare className={className} />;
    case "BarChart3": return <BarChart3 className={className} />;
    case "ShoppingBag": return <ShoppingBag className={className} />;
    case "MessageSquare": return <MessageSquare className={className} />;
    case "Upload": return <Upload className={className} />;
    case "GraduationCap": return <GraduationCap className={className} />;
    default: return <Code2 className={className} />;
  }
};

// Simple CountUp animation component using IntersectionObserver
const CountUp: React.FC<{ target: number; duration?: number }> = ({ target, duration = 1.5 }) => {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          let start = 0;
          const end = target;
          if (start === end) return;

          const totalMiliseconds = duration * 1000;
          const incrementTime = Math.min(30, Math.floor(totalMiliseconds / end));
          
          const timer = setInterval(() => {
            start += 1;
            setCount(start);
            if (start >= end) {
              clearInterval(timer);
              setCount(end);
            }
          }, incrementTime);
        }
      },
      { threshold: 0.2 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [target, duration]);

  return <div ref={elementRef}>{count}+</div>;
};

export default function App() {
  // Load stored user data or fall back to defaults
  const [profile, setProfile] = useState<ProfileConfig>(defaultProfile);
  const [socials, setSocials] = useState<SocialLinks>(defaultSocials);
  const [projects, setProjects] = useState<Project[]>(defaultProjects);
  const [experience, setExperience] = useState<Experience[]>(defaultExperience);

  // Load state on mount
  useEffect(() => {
    const data = getStoredData();
    setProfile(data.profile);
    setSocials(data.socials);
    setProjects(data.projects);
    setExperience(data.experience);
  }, []);

  // Theme configuration (Golden #D4AF37 and dark Charcoal)
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState<SkillCategory | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Administrative / Customization panel states
  const [customizerOpen, setCustomizerOpen] = useState(false);
  
  // Customizer form values
  const [editProfile, setEditProfile] = useState<ProfileConfig>(profile);
  const [editSocials, setEditSocials] = useState<SocialLinks>(socials);
  const [editProjects, setEditProjects] = useState<Project[]>(projects);
  const [notification, setNotification] = useState<string | null>(null);

  // Sync edit state when actual state changes (or is loaded)
  useEffect(() => {
    setEditProfile(profile);
    setEditSocials(socials);
    setEditProjects(projects);
  }, [profile, socials, projects]);

  // Monitor page scroll for header background and scroll progress bar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
      
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress((window.scrollY / totalHeight) * 100);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Save modified configurations to LocalStorage and update state
  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate links look reasonably formatted or are simple
    const cleanedSocials = {
      github: editSocials.github.trim() || defaultSocials.github,
      linkedin: editSocials.linkedin.trim() || defaultSocials.linkedin,
      email: editSocials.email.trim() || defaultSocials.email,
    };

    setProfile(editProfile);
    setSocials(cleanedSocials);
    setProjects(editProjects);

    saveStoredData({
      profile: editProfile,
      socials: cleanedSocials,
      projects: editProjects,
      experience
    });

    triggerNotification("Portfolio changes applied successfully! ✨");
    setCustomizerOpen(false);
  };

  // Reset to original code template defaults
  const handleResetToDefaults = () => {
    if (window.confirm("Are you sure you want to reset all portfolio links and statistics back to the original defaults?")) {
      setProfile(defaultProfile);
      setSocials(defaultSocials);
      setProjects(defaultProjects);

      saveStoredData({
        profile: defaultProfile,
        socials: defaultSocials,
        projects: defaultProjects,
        experience: defaultExperience
      });

      triggerNotification("Reset to original template defaults! 🔄");
      setCustomizerOpen(false);
    }
  };

  const triggerNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Helper to update a single project field in the edit screen
  const updateProjectField = (index: number, field: keyof Project, value: any) => {
    const updated = [...editProjects];
    updated[index] = { ...updated[index], [field]: value };
    setEditProjects(updated);
  };

  return (
    <div className="bg-dark-bg text-[#e0e0e0] font-sans antialiased min-h-screen relative selection:bg-gold selection:text-dark-bg overflow-x-hidden">
      
      {/* Dynamic Scroll Progress Indicator */}
      <div 
        className="fixed top-0 left-0 h-[2px] bg-gradient-to-r from-gold to-gold-hover z-[9999] transition-all duration-75"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Background radial atmosphere */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_45%,#151515_0%,#0a0a0a_70%)]" />
        <div className="grain-overlay" />
      </div>

      {/* Floating Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 left-6 z-[1000] bg-dark-card border border-gold/30 px-5 py-4 rounded-lg shadow-2xl flex items-center gap-3"
          >
            <div className="w-2 h-2 rounded-full bg-gold animate-ping" />
            <span className="text-sm font-mono tracking-wide text-gold">{notification}</span>
            <button onClick={() => setNotification(null)} className="ml-2 text-gray-500 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER & NAVIGATION */}
      <header 
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          isScrolled 
            ? "bg-[#0a0a0af2] backdrop-blur-md py-4 border-b border-white/[0.04] shadow-2xl" 
            : "bg-transparent py-7"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center relative">
          <motion.a 
            href="#hero" 
            className="font-mono font-bold text-xl tracking-tight text-gold hover:text-gold-hover transition-colors group"
            whileHover={{ scale: 1.02 }}
          >
            <span>&lt;</span>{profile.name.split(" ")[0]}<span className="text-white group-hover:text-gold transition-colors">/</span><span>&gt;</span>
          </motion.a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <ul className="flex items-center gap-8 list-none">
              {["hero", "about", "skills", "work", "experience", "contact"].map((item) => (
                <li key={item}>
                  <a 
                    href={`#${item}`}
                    className="text-gray-400 text-xs font-semibold tracking-[3px] uppercase hover:text-gold transition-colors relative py-1 block group"
                  >
                    {item}
                    <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-gold transition-all duration-350 group-hover:w-full" />
                  </a>
                </li>
              ))}
            </ul>
            <button
              onClick={() => setCustomizerOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 border border-gold/20 hover:border-gold rounded text-[10px] font-mono uppercase tracking-[2px] text-gold hover:bg-gold/5 transition-all cursor-pointer"
            >
              <Settings className="w-3 h-3 animate-spin-slow" />
              Edit Links
            </button>
          </nav>

          {/* Mobile Navigation Trigger */}
          <div className="flex md:hidden items-center gap-4">
            <button
              onClick={() => setCustomizerOpen(true)}
              className="p-1.5 border border-gold/20 rounded text-gold bg-gold/5 cursor-pointer"
              title="Edit Portfolio Links"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              className="flex flex-col gap-1.5 justify-center items-center w-8 h-8 focus:outline-none cursor-pointer"
              aria-label="Toggle menu"
            >
              <span className={`block w-6 h-[2px] bg-[#e0e0e0] transition-transform duration-300 ${mobileMenuOpen ? "transform rotate-45 translate-y-[8px]" : ""}`} />
              <span className={`block w-6 h-[2px] bg-[#e0e0e0] transition-opacity duration-300 ${mobileMenuOpen ? "opacity-0" : ""}`} />
              <span className={`block w-6 h-[2px] bg-[#e0e0e0] transition-transform duration-300 ${mobileMenuOpen ? "transform -rotate-45 -translate-y-[8px]" : ""}`} />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden w-full bg-[#0d0d0df8] backdrop-blur-lg border-b border-white/[0.04] overflow-hidden"
            >
              <div className="px-6 py-8 flex flex-col gap-6">
                <ul className="flex flex-col gap-4 list-none">
                  {["hero", "about", "skills", "work", "experience", "contact"].map((item) => (
                    <li key={item}>
                      <a 
                        href={`#${item}`} 
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-gray-300 text-sm font-semibold tracking-[4px] uppercase hover:text-gold block py-1"
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setCustomizerOpen(true);
                  }}
                  className="flex items-center justify-center gap-2 w-full py-3 border border-gold/30 hover:border-gold rounded text-xs font-mono uppercase tracking-[2px] text-gold hover:bg-gold/5 transition-all cursor-pointer"
                >
                  <Settings className="w-3 h-3" />
                  Customizer / Edit Links
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ===== HERO SECTION ===== */}
      <section 
        id="hero" 
        className="min-h-screen relative flex flex-col justify-center pt-24 pb-12 overflow-hidden z-10"
      >
        {/* Abstract background graphics */}
        <div className="absolute top-0 left-0 w-full h-[45%] bg-gradient-to-b from-gold/[0.05] to-transparent pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[70%] h-[40%] bg-gradient-to-t from-gold/[0.02] to-transparent pointer-events-none" />
        <div className="absolute top-[18%] left-[-5%] w-[350px] h-[350px] border border-gold/[0.06] rounded-full pointer-events-none" />
        <div className="absolute bottom-[12%] right-[-8%] w-[250px] h-[250px] border border-gold/[0.04] rounded-full pointer-events-none animate-pulse" />

        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 border border-gold/20 px-4 py-2 rounded bg-gold/[0.03] text-[10px] font-mono uppercase tracking-[4px] text-gold mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-ping" />
            {profile.titleBadge}
          </motion.div>

          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black uppercase tracking-tight leading-[0.95] select-none">
            <span className="block overflow-hidden">
              <motion.span 
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, cubicBezier: [0.22, 1, 0.36, 1] }}
                className="block"
              >
                {profile.name.split(" ")[0]}
              </motion.span>
            </span>
            <span className="block overflow-hidden">
              <motion.span 
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, delay: 0.1, cubicBezier: [0.22, 1, 0.36, 1] }}
                className="block text-gold"
              >
                {profile.name.split(" ")[1] || "P"}
              </motion.span>
            </span>
            <span className="block overflow-hidden">
              <motion.span 
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, cubicBezier: [0.22, 1, 0.36, 1] }}
                className="block text-transparent stroke-text"
                style={{ WebkitTextStroke: "1px rgba(224, 224, 224, 0.8)" }}
              >
                Build. Ship. Repeat.
              </motion.span>
            </span>
          </h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="max-w-2xl text-gray-400 mt-8 text-base md:text-lg leading-relaxed font-light"
          >
            {profile.bio}
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-wrap gap-4 mt-10"
          >
            <a 
              href="#work" 
              className="relative px-8 py-4 border border-gold text-gold font-bold text-xs uppercase tracking-[3px] overflow-hidden group transition-all duration-300 hover:text-dark-bg"
            >
              <span className="absolute top-0 left-[-100%] w-full h-full bg-gold transition-all duration-400 group-hover:left-0 z-0" />
              <span className="relative z-10 flex items-center gap-1.5">
                View My Work <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </a>
            <a 
              href="#contact" 
              className="px-8 py-4 border border-white/[0.08] text-gray-300 hover:text-white font-bold text-xs uppercase tracking-[3px] hover:bg-white/[0.04] transition-all duration-300"
            >
              Get In Touch
            </a>
          </motion.div>

          {/* Dynamic Counters Container */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="flex flex-wrap gap-12 mt-16 border-t border-white/[0.05] pt-10"
          >
            <motion.div 
              whileHover={{ scale: 1.05, y: -2 }}
              className="text-left cursor-default p-2 rounded-lg hover:bg-white/[0.01] hover:shadow-lg hover:shadow-gold/[0.02] transition-all duration-300"
            >
              <div className="font-mono text-3xl md:text-4xl font-extrabold text-gold flex items-center drop-shadow-[0_0_12px_rgba(212,175,55,0.25)]">
                <CountUp target={profile.projectsBuilt} />
              </div>
              <div className="text-[10px] text-gray-400 uppercase tracking-[2px] mt-1">Projects Built</div>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05, y: -2 }}
              className="text-left cursor-default p-2 rounded-lg hover:bg-white/[0.01] hover:shadow-lg hover:shadow-gold/[0.02] transition-all duration-300"
            >
              <div className="font-mono text-3xl md:text-4xl font-extrabold text-gold flex items-center drop-shadow-[0_0_12px_rgba(212,175,55,0.25)]">
                <CountUp target={profile.technologiesCount} />
              </div>
              <div className="text-[10px] text-gray-400 uppercase tracking-[2px] mt-1">Technologies</div>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05, y: -2 }}
              className="text-left cursor-default p-2 rounded-lg hover:bg-white/[0.01] hover:shadow-lg hover:shadow-gold/[0.02] transition-all duration-300"
            >
              <div className="font-mono text-3xl md:text-4xl font-extrabold text-gold flex items-center drop-shadow-[0_0_12px_rgba(212,175,55,0.25)]">
                <CountUp target={profile.yearsOfExperience} />
              </div>
              <div className="text-[10px] text-gray-400 uppercase tracking-[2px] mt-1">Years Coding</div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ===== INFINITE BADGE MARQUEE ===== */}
      <section className="py-6 border-y border-white/[0.04] overflow-hidden bg-[#080808]">
        <div className="flex whitespace-nowrap overflow-hidden relative">
          <div className="flex animate-marquee shrink-0">
            {["JavaScript", "React.js", "Node.js", "TypeScript", "Python", "SQL Databases", "MongoDB", "Docker & Containers", "AWS Cloud", "Git & CI/CD", "RESTful APIs", "Java Core"].map((tech, i) => (
              <React.Fragment key={i}>
                <span className="font-sans text-xl md:text-2xl font-black uppercase tracking-[3px] text-white/[0.02] px-8 select-none">
                  {tech}
                </span>
                <span className="font-sans text-xl md:text-2xl font-black uppercase tracking-[3px] text-gold/[0.05] stroke-text px-8 select-none" style={{ WebkitTextStroke: "1px rgba(212,175,55,0.08)" }}>
                  {tech}
                </span>
              </React.Fragment>
            ))}
          </div>
          <div className="flex animate-marquee shrink-0" aria-hidden="true">
            {["JavaScript", "React.js", "Node.js", "TypeScript", "Python", "SQL Databases", "MongoDB", "Docker & Containers", "AWS Cloud", "Git & CI/CD", "RESTful APIs", "Java Core"].map((tech, i) => (
              <React.Fragment key={`dup-${i}`}>
                <span className="font-sans text-xl md:text-2xl font-black uppercase tracking-[3px] text-white/[0.02] px-8 select-none">
                  {tech}
                </span>
                <span className="font-sans text-xl md:text-2xl font-black uppercase tracking-[3px] text-gold/[0.05] stroke-text px-8 select-none" style={{ WebkitTextStroke: "1px rgba(212,175,55,0.08)" }}>
                  {tech}
                </span>
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ABOUT SECTION with interactive triggers ===== */}
      <section id="about" className="py-24 md:py-32 relative bg-[#0d0d0d] overflow-hidden">
        <div className="absolute top-1/4 right-[-10%] w-[400px] h-[400px] bg-gold/[0.02] radial-gradient rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-mono text-[11px] tracking-[5px] uppercase text-gold mb-3"
          >
            Engineering Craft
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white mb-8"
          >
            Full-Stack <span className="text-gold">Developer</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="max-w-3xl mx-auto text-gray-400 text-base md:text-lg leading-relaxed font-light mb-16 text-center"
          >
            I am <strong className="text-white font-medium">{profile.name}</strong>, a <strong className="text-white font-medium">{profile.education}</strong> with hands-on internship experience building live web systems. My expertise bridges high-fidelity user experiences and reliable server-side architecture. Click any metric category below to unpack my specific workflow philosophy.
          </motion.p>

          {/* Interactive Skill Category Cards / Triggers */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto mb-16">
            {defaultSkillCategories.map((cat, index) => (
              <motion.button
                key={cat.id}
                onClick={() => setActiveTab(cat)}
                whileHover={{ y: -5, borderColor: "rgba(212, 175, 55, 0.3)" }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 bg-white/[0.01] border border-white/[0.04] hover:bg-white/[0.02] text-left rounded-lg transition-colors cursor-pointer relative overflow-hidden group"
              >
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gold scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-350" />
                <div className="mb-4">
                  {renderIcon(cat.icon, "w-6 h-6 text-gold")}
                </div>
                <div className="text-xs text-gray-500 font-mono tracking-wider uppercase mb-1">{cat.id}</div>
                <h4 className="text-sm font-bold tracking-wide uppercase text-white group-hover:text-gold transition-colors">{cat.name.split(" ")[0]}</h4>
                <div className="font-mono text-2xl font-black text-gold/80 mt-2">{cat.percentage}</div>
              </motion.button>
            ))}
          </div>

          {/* Framer-Motion Animated Skill Grid blocks matching their ROG-style custom border colors */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto pt-10 text-left">
            <div className="p-8 bg-white/[0.01] border border-white/[0.04] rounded-lg relative overflow-hidden group hover:border-gold/20 transition-all duration-300">
              <div className="absolute top-0 left-0 w-full h-[3px] bg-gray-400" />
              <div className="mb-4 text-gray-400">
                {renderIcon("Layout", "w-8 h-8")}
              </div>
              <h3 className="font-mono text-lg font-bold text-white mb-2 uppercase tracking-wider">React & UI</h3>
              <p className="text-xs text-gray-500 leading-relaxed font-light">Modular component-driven architectures, utilizing React 19, hooks, optimized re-renders, and custom Tailwind styling.</p>
            </div>

            <div className="p-8 bg-white/[0.01] border border-white/[0.04] rounded-lg relative overflow-hidden group hover:border-gold/20 transition-all duration-300">
              <div className="absolute top-0 left-0 w-full h-[3px] bg-red-600" />
              <div className="mb-4 text-red-600">
                {renderIcon("Server", "w-8 h-8 text-red-500")}
              </div>
              <h3 className="font-mono text-lg font-bold text-white mb-2 uppercase tracking-wider">Node & Express</h3>
              <p className="text-xs text-gray-500 leading-relaxed font-light">High-throughput REST APIs, secure token auth protocols, modular middleware pipelines, and Python scripting processors.</p>
            </div>

            <div className="p-8 bg-white/[0.01] border border-white/[0.04] rounded-lg relative overflow-hidden group hover:border-gold/20 transition-all duration-300">
              <div className="absolute top-0 left-0 w-full h-[3px] bg-blue-400" />
              <div className="mb-4 text-blue-400">
                {renderIcon("Database", "w-8 h-8 text-blue-400")}
              </div>
              <h3 className="font-mono text-lg font-bold text-white mb-2 uppercase tracking-wider">Structured DB</h3>
              <p className="text-xs text-gray-500 leading-relaxed font-light">Flexible schema modeling in MongoDB alongside structured query validation and strict referential integrity in relational SQL databases.</p>
            </div>

            <div className="p-8 bg-white/[0.01] border border-white/[0.04] rounded-lg relative overflow-hidden group hover:border-gold/20 transition-all duration-300">
              <div className="absolute top-0 left-0 w-full h-[3px] bg-gold" />
              <div className="mb-4 text-gold">
                {renderIcon("Cloud", "w-8 h-8 text-gold")}
              </div>
              <h3 className="font-mono text-lg font-bold text-white mb-2 uppercase tracking-wider">Containers & CI</h3>
              <p className="text-xs text-gray-500 leading-relaxed font-light">Docker containerization packages, custom deployment tasks, cloud hosting configs, and Git workflow controls.</p>
            </div>
          </div>
        </div>

        {/* Skill Detail Lightbox Modal powered by AnimatePresence */}
        <AnimatePresence>
          {activeTab && (
            <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setActiveTab(null)}
                className="absolute inset-0 bg-[#000000e0] backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 350 }}
                className="bg-dark-card border border-gold/20 p-8 md:p-12 max-w-xl w-full rounded-lg relative z-10 shadow-2xl text-left"
              >
                <button 
                  onClick={() => setActiveTab(null)}
                  className="absolute top-5 right-5 text-gray-500 hover:text-white transition-colors cursor-pointer p-1"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-3 mb-6">
                  {renderIcon(activeTab.icon, "w-8 h-8 text-gold")}
                  <div>
                    <span className="font-mono text-[10px] tracking-[3px] text-gold uppercase block">Module breakdown</span>
                    <h3 className="text-xl font-bold uppercase tracking-wide text-white">{activeTab.name}</h3>
                  </div>
                </div>

                <p className="text-gray-400 text-sm leading-relaxed mb-6 font-light">
                  {activeTab.description}
                </p>

                <div className="p-4 bg-[#0a0a0a] border border-white/[0.04] rounded flex justify-between items-center">
                  <span className="text-xs font-mono text-gray-500">Core Expertise Level</span>
                  <span className="text-gold font-mono font-bold text-lg">{activeTab.percentage}</span>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </section>

      {/* ===== CODE PROFILE CONFIGURATION SECTION ===== */}
      <section id="skills" className="py-24 md:py-32 relative bg-[#080808] border-t border-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-5 text-left">
              <span className="font-mono text-[11px] tracking-[5px] uppercase text-gold block mb-2">System Config</span>
              <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white mb-6">
                Developer <span className="text-gold">Schema</span>
              </h2>
              <p className="text-gray-400 leading-relaxed font-light mb-8">
                Every line of code I craft represents an iterative build in my active configuration schema. I view system architecture as a living repository that undergoes continuous improvement, strict unit optimization, and clean deployment cycles.
              </p>
              
              <div className="space-y-4">
                <div className="flex gap-4 items-start">
                  <div className="p-2 bg-gold/5 border border-gold/15 rounded text-gold shrink-0">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1">Architecture and Design</h4>
                    <p className="text-xs text-gray-500 leading-relaxed font-light">Favouring clean separation of model, view, controller, and components to minimize side-effects.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="p-2 bg-gold/5 border border-gold/15 rounded text-gold shrink-0">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1">Reliable Integration</h4>
                    <p className="text-xs text-gray-500 leading-relaxed font-light">Strict verification standards, TypeScript typing coverage, and robust backend handling logic.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Simulated Live IDE Code Block with custom lighting */}
            <div className="lg:col-span-7">
              <div className="bg-[#0c0c0c] border border-gold/10 p-6 md:p-8 rounded-lg shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full bg-white/[0.02] border-b border-white/[0.04] px-4 py-2 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500/80 block" />
                  </div>
                  <span className="text-[10px] font-mono text-gray-500 tracking-wider">yogesh_profile.json</span>
                  <div className="w-6" />
                </div>
                
                <pre className="text-left text-xs md:text-sm font-mono leading-relaxed overflow-x-auto text-gold pt-6 mt-2 max-h-[400px] select-all">
                  <code>
<span className="text-gray-600">// ===========================================</span>{"\n"}
<span className="text-gray-600">// File: yogesh_profile.json</span>{"\n"}
<span className="text-gray-600">// Status: ACTIVE // Build v3.5</span>{"\n"}
<span className="text-gray-600">// ===========================================</span>{"\n"}
{"{"}{"\n"}
  <span className="text-blue-400">"name"</span>: <span className="text-green-500">"{profile.name}"</span>,{"\n"}
  <span className="text-blue-400">"primary_role"</span>: <span className="text-green-500">"{profile.role}"</span>,{"\n"}
  <span className="text-blue-400">"credentials"</span>: <span className="text-green-500">"{profile.education}"</span>,{"\n"}
  <span className="text-blue-400">"stack"</span>: [{"\n"}
    <span className="text-green-500">    "React.js"</span>, <span className="text-green-500">"Node.js"</span>,{"\n"}
    <span className="text-green-500">    "TypeScript"</span>, <span className="text-green-500">"Python"</span>,{"\n"}
    <span className="text-green-500">    "MongoDB"</span>, <span className="text-green-500">"PostgreSQL"</span>{"\n"}
  ],{"\n"}
  <span className="text-blue-400">"metrics"</span>: {"{"}{"\n"}
    <span className="text-blue-400">    "projects_shipped"</span>: <span className="text-red-400">{profile.projectsBuilt}</span>,{"\n"}
    <span className="text-blue-400">    "years_coding"</span>: <span className="text-red-400">{profile.yearsOfExperience}</span>,{"\n"}
    <span className="text-blue-400">    "active_skills"</span>: <span className="text-red-400">{profile.technologiesCount}</span>{"\n"}
  {"}"},{"\n"}
  <span className="text-blue-400">"future"</span>: {"{"}{"\n"}
    <span className="text-blue-400">    "status"</span>: <span className="text-green-500">"READY"</span>,{"\n"}
    <span className="text-blue-400">    "mission"</span>: <span className="text-green-500">"ENGINEER_IMPACT"</span>{"\n"}
  {"}"}{"\n"}
{"}"}
                  </code>
                </pre>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ===== SELECTED PROJECTS GRID SECTION ===== */}
      <section id="work" className="py-24 md:py-32 relative bg-[#0d0d0d]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          <div className="text-center mb-16">
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="font-mono text-[11px] tracking-[5px] uppercase text-gold mb-3"
            >
              Hand-Coded Repositories
            </motion.p>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white mb-4"
            >
              Selected Projects
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="max-w-xl mx-auto text-gray-500 text-sm leading-relaxed font-light"
            >
              Below is a collection of full-stack projects featuring live web application links and source repositories. You can edit any of these URLs using the floating settings gear in the bottom-right!
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((proj, index) => (
              <motion.div
                key={proj.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                whileHover={{ y: -8, borderColor: "rgba(212, 175, 55, 0.35)", boxShadow: "0 10px 30px -10px rgba(212, 175, 55, 0.08)" }}
                className="bg-[#0a0a0a] border border-white/[0.04] p-8 rounded-lg relative overflow-hidden group flex flex-col justify-between transition-all duration-400 h-full"
              >
                {/* Visual ambient gold glow behind card on hover */}
                <div className="absolute inset-0 bg-radial from-gold/[0.02] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                {/* Gold glowing border accent */}
                <div className="absolute top-0 left-0 w-[3px] h-0 bg-gradient-to-b from-gold to-gold-hover transition-all duration-400 group-hover:h-full" />

                <div>
                  <div className="flex justify-between items-center mb-6">
                    <span className="font-mono text-[10px] text-gray-600 tracking-[2px]">ID: #{proj.num}</span>
                    <div className="p-2 border border-white/[0.04] bg-white/[0.01] rounded text-gold">
                      {renderIcon(proj.icon, "w-5 h-5 text-gold")}
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-3 uppercase tracking-wide group-hover:text-gold transition-colors">{proj.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed mb-6 font-light">{proj.description}</p>
                </div>

                <div>
                  {/* Dynamic Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-8">
                    {proj.tags.map((tag) => (
                      <span key={tag} className="text-[9px] font-mono tracking-wider border border-gold/10 px-2 py-0.5 rounded text-gold/80 bg-gold/[0.01]">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Portfolio Action Links */}
                  <div className="flex items-center gap-4 pt-4 border-t border-white/[0.04] w-full">
                    {proj.liveUrl && (
                      <a 
                        href={proj.liveUrl.startsWith("http") ? proj.liveUrl : `https://${proj.liveUrl}`}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[2px] text-gold hover:text-gold-hover transition-colors group/link cursor-pointer"
                      >
                        Live Demo
                        <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                      </a>
                    )}
                    {proj.githubUrl && (
                      <a 
                        href={proj.githubUrl.startsWith("http") ? proj.githubUrl : `https://${proj.githubUrl}`}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[2px] text-gray-400 hover:text-white transition-colors cursor-pointer"
                      >
                        Source Code
                        <Github className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>

              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* ===== EXPERIENCE SECTION ===== */}
      <section id="experience" className="py-24 md:py-32 relative bg-[#080808] border-t border-white/[0.01]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-mono text-[11px] tracking-[5px] uppercase text-gold mb-3"
          >
            Milestones & Career
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white mb-16"
          >
            Where I've <span className="text-gold">Worked</span>
          </motion.h2>

          {/* Timeline list */}
          <div className="space-y-8 text-left">
            {experience.map((exp, index) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ borderColor: "rgba(212, 175, 55, 0.2)", x: 4 }}
                className="p-8 bg-white/[0.005] border-l-4 border-l-gold border border-white/[0.04] rounded-r-lg transition-all"
              >
                <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white uppercase tracking-wide">{exp.role}</h3>
                    <div className="text-xs text-gold font-mono tracking-wider font-semibold mt-1">{exp.company}</div>
                  </div>
                  <span className="font-mono text-[10px] tracking-wider text-gray-500 bg-white/[0.02] border border-white/[0.04] px-3 py-1 rounded">
                    {exp.date}
                  </span>
                </div>

                <ul className="space-y-3 pl-4 list-none">
                  {exp.highlights.map((highlight, idx) => (
                    <li key={idx} className="text-xs text-gray-400 leading-relaxed relative pl-4 font-light">
                      <span className="absolute left-0 top-[3px] text-gold font-mono text-[10px]">&gt;</span>
                      {highlight}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CONTACT / FOOTER SECTION ===== */}
      <section id="contact" className="py-24 md:py-32 relative bg-[#050505] text-center border-t border-white/[0.01]">
        <div className="absolute top-0 left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
        
        <div className="max-w-3xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="inline-block font-mono text-[10px] tracking-[4px] uppercase text-gray-500 border border-white/[0.06] px-4 py-2 rounded mb-6"
          >
            &lt; Ready to partner /&gt;
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white mb-6"
          >
            Let's Build Something <span className="text-gold">Great</span>
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-gray-400 text-sm md:text-base leading-relaxed font-light max-w-lg mx-auto mb-10"
          >
            I am always open to considering exciting full-stack engineering roles, software projects, and tech collaborations. Reach out today!
          </motion.p>

          <motion.a 
            href={`mailto:${socials.email}`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="relative inline-flex items-center justify-center px-10 py-5 border border-gold text-gold font-bold text-xs uppercase tracking-[4px] transition-colors duration-300 hover:text-dark-bg cursor-pointer group"
          >
            <span className="absolute top-0 left-[-100%] w-full h-full bg-gold transition-all duration-400 group-hover:left-0 z-0" />
            <span className="relative z-10 flex items-center gap-2">
              Send an Email <Mail className="w-4 h-4" />
            </span>
          </motion.a>

          {/* Social Network Icon links */}
          <div className="flex gap-4 justify-center mt-12">
            {socials.github && (
              <motion.a 
                href={socials.github.startsWith("http") ? socials.github : `https://${socials.github}`}
                target="_blank" 
                rel="noopener noreferrer"
                whileHover={{ y: -3, borderColor: "#D4AF37", color: "#D4AF37", backgroundColor: "rgba(212, 175, 55, 0.05)" }}
                className="w-12 h-12 border border-white/[0.08] rounded flex items-center justify-center text-gray-500 hover:text-white transition-colors duration-300"
                aria-label="GitHub Repository Link"
              >
                <Github className="w-5 h-5" />
              </motion.a>
            )}
            {socials.linkedin && (
              <motion.a 
                href={socials.linkedin.startsWith("http") ? socials.linkedin : `https://${socials.linkedin}`}
                target="_blank" 
                rel="noopener noreferrer"
                whileHover={{ y: -3, borderColor: "#D4AF37", color: "#D4AF37", backgroundColor: "rgba(212, 175, 55, 0.05)" }}
                className="w-12 h-12 border border-white/[0.08] rounded flex items-center justify-center text-gray-500 hover:text-white transition-colors duration-300"
                aria-label="LinkedIn profile Link"
              >
                <Linkedin className="w-5 h-5" />
              </motion.a>
            )}
            {socials.email && (
              <motion.a 
                href={`mailto:${socials.email}`}
                whileHover={{ y: -3, borderColor: "#D4AF37", color: "#D4AF37", backgroundColor: "rgba(212, 175, 55, 0.05)" }}
                className="w-12 h-12 border border-white/[0.08] rounded flex items-center justify-center text-gray-500 hover:text-white transition-colors duration-300"
                aria-label="Email Link"
              >
                <Mail className="w-5 h-5" />
              </motion.a>
            )}
          </div>

          <div className="mt-16 opacity-35 max-w-sm mx-auto">
            <svg width="200" height="20" viewBox="0 0 600 40" xmlns="http://www.w3.org/2000/svg" className="mx-auto">
              <path d="M0 20 L50 5 L100 20 L150 5 L200 20 L250 5 L300 20 L350 5 L400 20 L450 5 L500 20 L550 5 L600 20" stroke="#D4AF37" strokeWidth="1" fill="none" opacity="0.4"/>
            </svg>
          </div>

          <p className="font-mono text-[10px] tracking-[2px] text-gray-600 mt-12 uppercase select-none">
            © 2026 <span className="text-gold">{profile.name}</span>. All rights reserved.
          </p>
        </div>
      </section>

      {/* ===== FLOATING CUSTOMIZATION SETTINGS TRIGGER ===== */}
      <div className="fixed bottom-6 right-6 z-[1001]">
        <motion.button
          onClick={() => setCustomizerOpen(true)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="w-14 h-14 bg-[#0a0a0ae6] border border-gold/40 hover:border-gold hover:shadow-gold/15 text-gold rounded-full flex items-center justify-center shadow-2xl backdrop-blur-md cursor-pointer group"
          title="Customize Portfolio Links"
        >
          <Settings className="w-6 h-6 animate-spin-slow group-hover:rotate-45" />
        </motion.button>
      </div>

      {/* ===== CUSTOMIZER SIDE-DRAWER PANEL DIALOG ===== */}
      <AnimatePresence>
        {customizerOpen && (
          <div className="fixed inset-0 z-[3000] flex justify-end">
            {/* Backdrop filter overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCustomizerOpen(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />
            
            {/* Setup Drawer panel */}
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="relative w-full max-w-2xl bg-dark-card border-l border-gold/15 h-full overflow-y-auto z-10 shadow-2xl p-6 md:p-8 text-left flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center pb-6 border-b border-white/[0.04]">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-gold" />
                    <h3 className="text-lg font-bold uppercase tracking-wide text-white">Portfolio Customizer</h3>
                  </div>
                  <button 
                    onClick={() => setCustomizerOpen(false)}
                    className="p-1 text-gray-500 hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="text-xs text-gray-400 mt-4 leading-relaxed p-4 bg-gold/5 border border-gold/15 rounded">
                  💡 <strong>Change Portfolio Links & Details Instantly!</strong> Edit your social networking profiles, B.E. statistics, and individual live site demo URLs or GitHub repository URLs. Changes are saved locally.
                </div>

                <form onSubmit={handleSaveChanges} className="space-y-6 mt-6">
                  
                  {/* CATEGORY: GENERAL INFORMATION */}
                  <div>
                    <h4 className="text-[10px] font-mono tracking-[3px] text-gold uppercase border-b border-gold/10 pb-1 mb-3">General Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-mono uppercase tracking-wider text-gray-400 mb-1">Developer Name</label>
                        <input 
                          type="text" 
                          required
                          value={editProfile.name}
                          onChange={(e) => setEditProfile({ ...editProfile, name: e.target.value })}
                          className="w-full bg-[#0a0a0a] border border-white/[0.08] px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-gold rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono uppercase tracking-wider text-gray-400 mb-1">Title Badge</label>
                        <input 
                          type="text" 
                          required
                          value={editProfile.titleBadge}
                          onChange={(e) => setEditProfile({ ...editProfile, titleBadge: e.target.value })}
                          className="w-full bg-[#0a0a0a] border border-white/[0.08] px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-gold rounded"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-mono uppercase tracking-wider text-gray-400 mb-1">Quick Bio Summary</label>
                        <textarea 
                          rows={3}
                          required
                          value={editProfile.bio}
                          onChange={(e) => setEditProfile({ ...editProfile, bio: e.target.value })}
                          className="w-full bg-[#0a0a0a] border border-white/[0.08] px-3 py-2 text-xs text-white focus:outline-none focus:border-gold rounded resize-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* CATEGORY: SYSTEM METRICS */}
                  <div>
                    <h4 className="text-[10px] font-mono tracking-[3px] text-gold uppercase border-b border-gold/10 pb-1 mb-3">Counter Metrics</h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[10px] font-mono uppercase tracking-wider text-gray-400 mb-1">Projects Built</label>
                        <input 
                          type="number" 
                          required
                          value={editProfile.projectsBuilt}
                          onChange={(e) => setEditProfile({ ...editProfile, projectsBuilt: parseInt(e.target.value) || 0 })}
                          className="w-full bg-[#0a0a0a] border border-white/[0.08] px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-gold rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono uppercase tracking-wider text-gray-400 mb-1">Tech Count</label>
                        <input 
                          type="number" 
                          required
                          value={editProfile.technologiesCount}
                          onChange={(e) => setEditProfile({ ...editProfile, technologiesCount: parseInt(e.target.value) || 0 })}
                          className="w-full bg-[#0a0a0a] border border-white/[0.08] px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-gold rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono uppercase tracking-wider text-gray-400 mb-1">Coding Years</label>
                        <input 
                          type="number" 
                          required
                          value={editProfile.yearsOfExperience}
                          onChange={(e) => setEditProfile({ ...editProfile, yearsOfExperience: parseInt(e.target.value) || 0 })}
                          className="w-full bg-[#0a0a0a] border border-white/[0.08] px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-gold rounded"
                        />
                      </div>
                    </div>
                  </div>

                  {/* CATEGORY: SOCIAL & CONTACT LINKS */}
                  <div>
                    <h4 className="text-[10px] font-mono tracking-[3px] text-gold uppercase border-b border-gold/10 pb-1 mb-3">Social networking links</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[10px] font-mono uppercase tracking-wider text-gray-400 mb-1">GitHub Account URL</label>
                        <input 
                          type="text" 
                          value={editSocials.github}
                          onChange={(e) => setEditSocials({ ...editSocials, github: e.target.value })}
                          className="w-full bg-[#0a0a0a] border border-white/[0.08] px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-gold rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono uppercase tracking-wider text-gray-400 mb-1">LinkedIn Profile URL</label>
                        <input 
                          type="text" 
                          value={editSocials.linkedin}
                          onChange={(e) => setEditSocials({ ...editSocials, linkedin: e.target.value })}
                          className="w-full bg-[#0a0a0a] border border-white/[0.08] px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-gold rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono uppercase tracking-wider text-gray-400 mb-1">Contact Email Address</label>
                        <input 
                          type="email" 
                          value={editSocials.email}
                          onChange={(e) => setEditSocials({ ...editSocials, email: e.target.value })}
                          className="w-full bg-[#0a0a0a] border border-white/[0.08] px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-gold rounded"
                        />
                      </div>
                    </div>
                  </div>

                  {/* CATEGORY: PORTFOLIO PROJECTS */}
                  <div>
                    <h4 className="text-[10px] font-mono tracking-[3px] text-gold uppercase border-b border-gold/10 pb-1 mb-3">Project Link Configurations</h4>
                    <div className="space-y-6 max-h-[350px] overflow-y-auto pr-2 divide-y divide-white/[0.04]">
                      {editProjects.map((proj, idx) => (
                        <div key={proj.id} className="pt-4 first:pt-0">
                          <span className="text-[9px] font-mono text-gold block mb-2">Project #{proj.num}: {proj.title}</span>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[8px] font-mono uppercase tracking-wider text-gray-500 mb-1">Live Demo Link</label>
                              <input 
                                type="text" 
                                value={proj.liveUrl}
                                onChange={(e) => updateProjectField(idx, "liveUrl", e.target.value)}
                                className="w-full bg-[#0a0a0a] border border-white/[0.08] px-2 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-gold rounded"
                              />
                            </div>
                            <div>
                              <label className="block text-[8px] font-mono uppercase tracking-wider text-gray-500 mb-1">GitHub Repo Link</label>
                              <input 
                                type="text" 
                                value={proj.githubUrl}
                                onChange={(e) => updateProjectField(idx, "githubUrl", e.target.value)}
                                className="w-full bg-[#0a0a0a] border border-white/[0.08] px-2 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-gold rounded"
                              />
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-[8px] font-mono uppercase tracking-wider text-gray-500 mb-1">Project Description Override</label>
                              <input 
                                type="text" 
                                value={proj.description}
                                onChange={(e) => updateProjectField(idx, "description", e.target.value)}
                                className="w-full bg-[#0a0a0a] border border-white/[0.08] px-2 py-1.5 text-xs text-white focus:outline-none focus:border-gold rounded"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </form>
              </div>

              {/* SAVE & RESET CONTROLS */}
              <div className="pt-6 border-t border-white/[0.04] mt-8 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleResetToDefaults}
                  className="w-full sm:w-auto px-4 py-3 border border-red-500/30 hover:border-red-500 text-red-400 hover:text-red-300 hover:bg-red-500/5 text-xs font-mono uppercase tracking-wider rounded transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Reset Defaults
                </button>
                <button
                  onClick={handleSaveChanges}
                  className="w-full sm:flex-1 px-4 py-3 bg-gold hover:bg-gold-hover text-dark-bg text-xs font-bold uppercase tracking-wider rounded transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-gold/10"
                >
                  <Save className="w-4 h-4" />
                  Apply Changes
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating AI Chatbot Companion */}
      <Chatbot />

    </div>
  );
}
