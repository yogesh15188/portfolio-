import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, Send, X, Bot, Sparkles, AlertCircle, Key, Trash2, Check, RefreshCw, HelpCircle } from "lucide-react";

interface Message {
  sender: "user" | "ai";
  text: string;
}

export const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showKeyConfig, setShowKeyConfig] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "ai",
      text: "Hi! I am Yogesh's virtual AI Assistant. I can tell you all about his full-stack skills, experience, BE Computer Science degree, or key projects! Ask me anything, or pick a suggestion below. ✨",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Load API Key from localStorage on mount
  useEffect(() => {
    const savedKey = localStorage.getItem("yog_gemini_api_key") || "";
    setApiKey(savedKey);
  }, []);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const suggestions = [
    { label: "⚡ Tech Stack", prompt: "What is your core programming stack and skills?" },
    { label: "🗺️ Maps Project", prompt: "Tell me about your Navigation & Safety for Travelers project." },
    { label: "🎓 Education", prompt: "What is your educational background and degree?" },
    { label: "💼 Experience", prompt: "Do you have any commercial or internship experience?" },
    { label: "📧 Contact & Hire", prompt: "How can I contact or hire you?" },
  ];

  // Robust offline local response engine for the static web page
  const getOfflineResponse = (query: string): string => {
    const q = query.toLowerCase();

    if (q.includes("hi") || q.includes("hello") || q.includes("hey") || q.includes("greetings")) {
      return "Hello! Great to meet you. I can help you navigate Yogesh's portfolio, check out his technical skills, look over his projects, or help you contact him. What would you like to explore first?";
    }

    if (q.includes("stack") || q.includes("skill") || q.includes("technolog") || q.includes("languages") || q.includes("code")) {
      return "Yogesh is a Full-Stack Developer with expertise in:\n\n" +
             "• Frontend: HTML, CSS, JavaScript, React.js (React 19), Tailwind CSS, Framer Motion\n" +
             "• Backend: Node.js, Express, Python scripting, RESTful APIs, JWT Auth\n" +
             "• Databases: MongoDB (documents) and PostgreSQL/SQL (relational design)\n" +
             "• DevOps/Cloud: Docker, AWS S3, Vercel, and Cloud Run deployments.\n\n" +
             "He builds clean, secure, and highly optimized apps!";
    }

    if (q.includes("navigation") || q.includes("safety") || q.includes("travel") || q.includes("map")) {
      return "Yogesh's 'Navigation & Safety for Travelers' is a featured full-stack project!\n\n" +
             "• Goal: A real-time navigation platform with instant safety alerts and dynamic emergency tools for travelers.\n" +
             "• Tech Stack: React, Node.js, MongoDB, and integrated Google Maps Platform/Places APIs.\n" +
             "• Key Feature: Custom responsive mapping, user location validation, and offline contingency tips.";
    }

    if (q.includes("task") || q.includes("todo") || q.includes("manager")) {
      return "Yogesh's 'Task Manager Pro' is a productivity system featuring:\n\n" +
             "• Visual category boards and priority scheduling.\n" +
             "• Responsive progress tracking dashboard.\n" +
             "• Tech Stack: React, Node.js, SQL database, and custom Tailwind components.";
    }

    if (q.includes("sentiment") || q.includes("political") || q.includes("nlp") || q.includes("analysis")) {
      return "Yogesh's 'Political Sentiment Analysis Platform' is an advanced analytical project:\n\n" +
             "• Features NLP algorithms to analyze news and public sentiments with real-time feedback.\n" +
             "• Tech Stack: Python, Flask, D3.js, and specialized sentiment scoring models.";
    }

    if (q.includes("ecommerce") || q.includes("shop") || q.includes("store") || q.includes("commerce")) {
      return "Yogesh's 'E-Commerce Core' is a performance storefront featuring:\n\n" +
             "• Persistent client-side shopping carts, secure checkout flows, and complete seller dashboards.\n" +
             "• Tech Stack: React, Node.js, MongoDB, and Stripe API integration.";
    }

    if (q.includes("education") || q.includes("college") || q.includes("degree") || q.includes("graduate") || q.includes("qualification")) {
      return "Yogesh is a B.E. (Bachelor of Engineering) in Computer Science Graduate.\n\n" +
             "His structured university curriculum combined with heavy independent project building has given him solid foundations in software engineering, algorithms, database systems, and modern web application patterns.";
    }

    if (q.includes("experience") || q.includes("work") || q.includes("intern") || q.includes("job") || q.includes("career")) {
      return "Yogesh served as a Software Development Intern at Tech Solutions Inc. (2025 - 2026), where he:\n\n" +
             "• Built and maintained full-stack React & Node.js/MongoDB web systems.\n" +
             "• Engineered REST APIs serving 1,000+ daily developer calls with 99.9% uptime.\n" +
             "• Optimized complex database schemas and indexes, reducing backend API latency by 40%.";
    }

    if (q.includes("contact") || q.includes("hire") || q.includes("email") || q.includes("reach") || q.includes("mail") || q.includes("linkedin") || q.includes("github")) {
      return "You can easily contact or hire Yogesh through these direct options:\n\n" +
             "• Email: yogeshyogesh15189@gmail.com (or click the 'Send an Email' button in the contact section)\n" +
             "• LinkedIn: https://www.linkedin.com/in/p-yogesh-691411308\n" +
             "• GitHub: https://github.com/yogeshyogesh15189-max\n\n" +
             "He is currently actively looking for Full-Stack Developer opportunities!";
    }

    if (q.includes("who") || q.includes("about") || q.includes("yogesh")) {
      return "Yogesh P is an enthusiastic, B.E. Computer Science graduate and Full-Stack Developer. He specializes in React, Node.js, databases, and DevOps, transforming complex challenges into high-quality digital products!";
    }

    // Default polite conversational reply with guidance
    return "I appreciate your question! Since this is running as a lightweight client-side static web page, I am doing my best to answer you. You can ask about:\n" +
           "• Yogesh's Core Tech Stack / Skills\n" +
           "• His B.E. Computer Science degree\n" +
           "• Featured projects (like the Maps or Sentiment analysis system)\n" +
           "• Internship experience at Tech Solutions\n" +
           "• How to contact/hire him\n\n" +
           "💡 TIP: You can also plug in your own Gemini API Key in the chat settings panel to enable real, unrestricted conversational AI!";
  };

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    setError(null);
    const userMessage: Message = { sender: "user", text: textToSend };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // If an API Key is saved, we can call Gemini directly from the client!
    if (apiKey.trim()) {
      try {
        const payload = {
          contents: [
            {
              role: "user",
              parts: [{ text: `You are Yogesh's portfolio assistant. Here is the user query: "${textToSend}". Answer politely and professionally about Yogesh P (Full Stack Developer, B.E. CS graduate, built Maps project, Task Manager, Sentiment analysis platform, interned at Tech Solutions Inc.). Keep it positive, clean, and concise.` }]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 300,
          }
        };

        // Call the direct public Google Gemini API endpoint safely from the client-side static application
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload)
          }
        );

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData?.error?.message || "Gemini API key is invalid or expired.");
        }

        const data = await response.json();
        const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response received.";
        
        setMessages((prev) => [...prev, { sender: "ai", text: responseText }]);
      } catch (err: any) {
        console.error("Client-side Gemini Error:", err);
        setError(`Gemini Error: ${err.message}. Falling back to offline response mode.`);
        
        // Instant graceful fallback to offline model so the user never gets stuck
        setTimeout(() => {
          const fallbackText = getOfflineResponse(textToSend);
          setMessages((prev) => [...prev, { sender: "ai", text: fallbackText }]);
        }, 800);
      } finally {
        setIsTyping(false);
      }
    } else {
      // Offline pattern matcher fallback (instant & works anywhere on any static host)
      setTimeout(() => {
        const reply = getOfflineResponse(textToSend);
        setMessages((prev) => [...prev, { sender: "ai", text: reply }]);
        setIsTyping(false);
      }, 700);
    }
  };

  const handleSaveKey = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("yog_gemini_api_key", apiKey.trim());
    setShowKeyConfig(false);
    setError(null);
    setMessages((prev) => [
      ...prev,
      {
        sender: "ai",
        text: apiKey.trim() 
          ? "Successfully unlocked real Gemini AI engine! Your questions will now be processed directly through Google Gemini. 🚀" 
          : "Switched back to super-fast local response mode. Offline queries are active."
      }
    ]);
  };

  const handleClearKey = () => {
    localStorage.removeItem("yog_gemini_api_key");
    setApiKey("");
    setShowKeyConfig(false);
    setError(null);
    setMessages((prev) => [
      ...prev,
      { sender: "ai", text: "Gemini API key removed. Running in offline expert mode." }
    ]);
  };

  return (
    <div id="ai-chatbot-widget" className="fixed bottom-24 right-6 z-[1001] font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 50, x: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 50, x: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="w-[360px] sm:w-[400px] h-[550px] bg-[#0c0c0cf7] border border-gold/25 rounded-2xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl mb-4"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#0d0d0d] to-[#151515] p-4 border-b border-gold/15 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full border border-gold/35 bg-gold/5 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-gold animate-pulse" />
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border border-dark-bg rounded-full" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white tracking-wide uppercase">Yogesh's Assistant</h4>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
                    <span className="text-[9px] font-mono tracking-wider text-green-400 uppercase">
                      {apiKey.trim() ? "REAL AI CONNECTED" : "LOCAL EXPERT ACTIVE"}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowKeyConfig(!showKeyConfig)}
                  className={`p-1.5 rounded border transition-colors cursor-pointer ${
                    apiKey.trim() 
                      ? "border-gold/30 text-gold bg-gold/5 hover:bg-gold/10" 
                      : "border-white/[0.06] text-gray-400 hover:text-white"
                  }`}
                  title="Configure Gemini API Key"
                >
                  <Key className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded border border-white/[0.06] hover:border-gold/30 text-gray-400 hover:text-gold transition-colors cursor-pointer"
                  title="Close Assistant"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* API Key Panel overlay */}
            <AnimatePresence>
              {showKeyConfig && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-[#121212] border-b border-gold/15 p-4 text-left"
                >
                  <div className="flex items-center gap-2 mb-2 text-xs font-mono text-gold uppercase">
                    <Key className="w-3.5 h-3.5" />
                    <span>Gemini API Key (Optional)</span>
                  </div>
                  <p className="text-[10px] text-gray-400 leading-relaxed mb-3">
                    Unlock true Gemini AI power! This page runs 100% on the client-side. Enter your own API key to ask any custom questions. Your key is saved locally in your own browser storage.
                  </p>
                  
                  <form onSubmit={handleSaveKey} className="flex gap-2">
                    <input
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="Paste AI Studio API Key..."
                      className="flex-1 bg-black border border-white/[0.1] focus:border-gold/50 rounded px-2.5 py-1.5 text-xs text-white placeholder-gray-600 focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="px-3 bg-gold hover:bg-gold-hover text-dark-bg text-xs font-bold rounded transition-colors cursor-pointer flex items-center justify-center"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    {localStorage.getItem("yog_gemini_api_key") && (
                      <button
                        type="button"
                        onClick={handleClearKey}
                        className="px-3 bg-red-950/30 hover:bg-red-950/60 border border-red-500/20 text-red-400 text-xs font-bold rounded transition-colors cursor-pointer"
                        title="Remove Key"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Chat Body */}
            <div
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-[#09090940]"
            >
              <div className="text-center py-2">
                <span className="text-[9px] font-mono tracking-[3px] text-gray-500 uppercase px-2.5 py-1 border border-white/[0.04] bg-white/[0.01] rounded">
                  Static web page certified
                </span>
              </div>

              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                  className={`flex items-start gap-2.5 ${msg.sender === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold border shrink-0 ${
                      msg.sender === "user"
                        ? "border-gold/25 bg-gold/5 text-gold"
                        : "border-white/[0.06] bg-white/[0.02] text-gray-300"
                    }`}
                  >
                    {msg.sender === "user" ? "U" : <Bot className="w-3.5 h-3.5 text-gold/80" />}
                  </div>

                  <div
                    className={`max-w-[75%] p-3.5 rounded-xl text-xs leading-relaxed font-light ${
                      msg.sender === "user"
                        ? "bg-gold/10 border border-gold/20 text-gold rounded-tr-none"
                        : "bg-white/[0.02] border border-white/[0.04] text-[#e0e0e0] rounded-tl-none shadow-md"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  </div>
                </motion.div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-start gap-2.5"
                >
                  <div className="w-7 h-7 rounded-full border border-white/[0.06] bg-white/[0.02] text-gray-300 flex items-center justify-center">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                  <div className="bg-white/[0.01] border border-white/[0.04] p-3.5 rounded-xl rounded-tl-none flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-gold/60 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-gold animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </motion.div>
              )}

              {/* Error State */}
              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-start gap-2 text-red-400 bg-red-950/10 border border-red-500/20 p-3 rounded-lg text-xs font-light"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <p>{error}</p>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggestion Chips */}
            <div className="p-3 bg-[#0a0a0a99] border-t border-white/[0.04] flex flex-wrap gap-1.5 max-h-[110px] overflow-y-auto custom-scrollbar">
              {suggestions.map((item, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.02, borderColor: "rgba(212, 175, 55, 0.4)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSendMessage(item.prompt)}
                  className="text-[10px] text-gray-400 hover:text-gold bg-white/[0.02] hover:bg-gold/5 border border-white/[0.04] px-2.5 py-1 rounded-full cursor-pointer transition-all flex items-center gap-1"
                >
                  <Sparkles className="w-2.5 h-2.5 text-gold/60" />
                  {item.label}
                </motion.button>
              ))}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(input);
              }}
              className="p-3 bg-[#0d0d0d] border-t border-gold/15 flex gap-2 items-center"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={apiKey.trim() ? "Ask Gemini anything about Yogesh..." : "Ask locally, e.g., 'What is his stack?'..."}
                disabled={isTyping}
                className="flex-1 bg-[#050505] border border-white/[0.08] focus:border-gold/50 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="p-2 bg-gold hover:bg-gold-hover disabled:bg-gray-800 text-dark-bg disabled:text-gray-500 rounded-lg transition-colors cursor-pointer flex items-center justify-center shrink-0 shadow-lg shadow-gold/5"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        className="w-14 h-14 bg-gradient-to-r from-[#0d0d0d] to-[#151515] border border-gold/45 hover:border-gold text-gold rounded-full flex items-center justify-center shadow-2xl backdrop-blur-md cursor-pointer group relative overflow-hidden"
        title="Chat with AI Companion"
      >
        <span className="absolute -inset-1 bg-gradient-to-r from-gold/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-lg" />
        {isOpen ? (
          <X className="w-6 h-6 transition-transform duration-300 rotate-90" />
        ) : (
          <MessageSquare className="w-6 h-6 transition-transform duration-300 group-hover:scale-105" />
        )}
        <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#151515] animate-pulse" />
      </motion.button>
    </div>
  );
};
