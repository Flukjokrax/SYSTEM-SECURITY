import React, { useState, useEffect } from "react";
import {
  Shield,
  Activity,
  Terminal,
  Globe,
  Search,
  Sparkles,
  PlusCircle,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Clock,
  User,
  RefreshCw,
  Cpu,
  Layers,
  Database,
  Lock,
  ArrowRight,
  Maximize2
} from "lucide-react";
import { Analytics } from "@vercel/analytics/react";
import { Article, SecurityEventLog } from "./types";

export default function App() {
  // Navigation / Tabs
  const [activeTab, setActiveTab] = useState<"articles" | "create" | "sandbox" | "dashboard">("articles");
  const [uiLanguage, setUiLanguage] = useState<"th" | "en">("th");
  
  // Data State
  const [articles, setArticles] = useState<Article[]>([]);
  const [logs, setLogs] = useState<SecurityEventLog[]>([]);
  const [systemStatus, setSystemStatus] = useState({
    rexdev_defense_rate: "100%",
    cyber_active_sensors: 14,
    security_encryption: "AES-256-GCM / TLS 1.3",
    blocked_attacks: 482,
    active_threats: 0,
    gemini_enabled: true,
    environment: "NextJS-Optimized Express Static Hybrid"
  });

  // Selected state
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [selectedArticleLang, setSelectedArticleLang] = useState<string>("th");

  // Input states for new post
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newExcerpt, setNewExcerpt] = useState("");
  const [newLanguage, setNewLanguage] = useState("th");

  // UI Interactive state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTranslating, setIsTranslating] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<string | null>(null);
  const [isOptimizing, setIsOptimizing] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Security Sanitizer analysis overlay on the fly
  const [liveSanitizerAlert, setLiveSanitizerAlert] = useState<{
    secure: boolean;
    threatFound: string | null;
  }>({ secure: true, threatFound: null });

  // Security interactive alerts custom toast
  const [toast, setToast] = useState<{
    show: boolean;
    title: string;
    message: string;
    type: "success" | "warning" | "alert";
  } | null>(null);

  // Auto latency indicator
  const [latency, setLatency] = useState<number>(14);

  // Localized Labels
  const dict = {
    th: {
      title: "ระบบ REXDEV CYBER SECURITY",
      tagline: "หน้าเว็บบล็อกส่วนตัวหลายภาษาและแดชบอร์ดป้องกันภัยคุกคามไซเบอร์",
      securedLabel: "ระบบป้องกันความปลอดภัยทำงานนิ่ง",
      latencyText: "ความล่าช้าส่งข้อมูล",
      articlesTab: "บทความทั้งหมด",
      createTab: "เขียนบทความใหม่",
      sandboxTab: "การตรวจสอบและจำลองการโจมตี",
      dashboardTab: "แดชบอร์ดความปลอดภัยไซเบอร์",
      readMore: "อ่านต่อ",
      newPost: "สร้างบทความใหม่",
      submitPost: "เผยแพร่บทความเข้าระบบความปลอดภัย",
      author: "พนักงานตรวจสอบหลัก",
      unauthorizedAlert: "ตรวจพบข้อมูลต้องสงสัยใน Payload ดักระบบป้องกันทันที!",
      threatDetected: "ระงับการเข้าถึงชั่วคราว REXDEV ทำงาน",
      simulateTitle: "ระบบ REXDEV-CYBER-SECURITY Sandboxเชิงรุก",
      simulateSubtitle: "กดปุ่มด้านล่างเพื่อส่งข้อมูลโจมตีไซเบอร์จำลอง และทดสอบประสิทธิภาพการเฝ้าระวังสตรีมและดับบล็อกเกอร์ REXDEV",
      sqlSim: "ยิง SQL Injection",
      xssSim: "ยิง XSS Tag Shell",
      bruteSim: "ยิง Brute Force Login",
      integritySim: "เจาะดึงทับโครงสร้างไฟล์",
      logsTitle: "สตรีมบันทึกการตรวจสอบข้อมูล (Live Access & Changes Audit Log)",
      logsSubtitle: "บันทึกการตรวจสอบการเข้าถึงและการเปลี่ยนแปลงข้อมูลแบบอัจฉริยะ (การตรวจสอบการเข้าถึง 24 ชั่วโมง)",
      seoAuditing: "วิเคราะห์จัดทำ SEO ด้วย AI",
      aiTranslate: "แปลภาษาด้วยปัญญาประดิษฐ์",
      aiDeepScan: "ดีพสแกนความปลอดภัยด้วย AI (REXDEV SYSTEM)",
      vulnerabilityAlert: "พบปมประเด็นช่องโหว่ความเสี่ยง",
      noVulnerability: "ไม่พบข้อมูลอ่อนไหวที่อันตราย ปลอดภัยสมบูรณ์",
      recommendations: "ข้อเสนอแนะความปลอดภัยไซเบอร์จากระบบ REXDEVCYBER",
      performanceMetric: "ประสิทธิภาพความเร็วแบบ Next.js"
    },
    en: {
      title: "REXDEV CYBER SECURITY PORTAL",
      tagline: "Multilingual Blog Platform & Advanced Cyber Threat Defense Dashboard",
      securedLabel: "Security Systems Live & Active",
      latencyText: "Network Latency",
      articlesTab: "Secure Articles",
      createTab: "New Safe Entry",
      sandboxTab: "Vulnerability Simulation",
      dashboardTab: "Security Telemetry Board",
      readMore: "Read Entry",
      newPost: "Draft New Article",
      submitPost: "Securely Publish Submission",
      author: "Lead Cyber Inspector",
      unauthorizedAlert: "Suspicious pattern filtered on input processing hook!",
      threatDetected: "Interception Active - REXDEV Layer Interrupted",
      simulateTitle: "Active Attacks Simulation Console",
      simulateSubtitle: "Trigger safe simulated threat models to test REXDEV input scrubbers, security audits, and live CYBER log capturing pipelines.",
      sqlSim: "SQL Injection Probe",
      xssSim: "XSS Payload Execution",
      bruteSim: "Brute Force Scanner",
      integritySim: "Tamper File Integrity",
      logsTitle: "System Security Audit Log Core System",
      logsSubtitle: "Live streaming monitoring capturing access requests and modifications (24/7 Access Verification)",
      seoAuditing: "Audit & Boost SEO with AI",
      aiTranslate: "AI Translation Engine",
      aiDeepScan: "Deep AI Vulnerability Scan",
      vulnerabilityAlert: "Potential security defects identified",
      noVulnerability: "Clear of known threat factors. Core secure status verified.",
      recommendations: "System Cyber-security Remediation Directives",
      performanceMetric: "Next.js Rendering Velocity Score"
    }
  };

  const currentDict = dict[uiLanguage];

  // Load Initial Data
  const fetchData = async () => {
    try {
      const articlesRes = await fetch("/api/articles");
      if (articlesRes.ok) {
        const data = await articlesRes.json();
        setArticles(data);
        if (data.length > 0 && !selectedArticleId) {
          setSelectedArticleId(data[0].id);
          setSelectedArticleLang(data[0].defaultLanguage);
        }
      }

      const logsRes = await fetch("/api/logs");
      if (logsRes.ok) {
        const data = await logsRes.json();
        setLogs(data);
      }

      const statusRes = await fetch("/api/system-status");
      if (statusRes.ok) {
        const data = await statusRes.json();
        setSystemStatus(data);
      }
    } catch (e) {
      console.error("Failed to load initial server components: ", e);
    }
  };

  useEffect(() => {
    fetchData();
    // Simulate random light latency change
    const interval = setInterval(() => {
      setLatency(prev => Math.max(8, Math.min(28, prev + (Math.random() > 0.5 ? 1 : -1))));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Live checker input handler (การตรวจสอบการเข้าถึง / การป้องกันการโจมตี)
  useEffect(() => {
    const textToCheck = `${newTitle} ${newContent}`;
    const xssPattern = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
    const sqlPattern = new RegExp("(\\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|OR '1'='1|--|#|/\\*|\\*/)\\b)", "gi");

    if (xssPattern.test(textToCheck)) {
      setLiveSanitizerAlert({
        secure: false,
        threatFound: "Cross-Site Scripting (XSS) Script Invocation Detected"
      });
    } else if (sqlPattern.test(textToCheck)) {
      setLiveSanitizerAlert({
        secure: false,
        threatFound: "SQL Query Injection Pattern (Escape Sequence Triggered)"
      });
    } else {
      setLiveSanitizerAlert({
        secure: true,
        threatFound: null
      });
    }
  }, [newTitle, newContent]);

  // Show Toast Alert helper
  const triggerToast = (title: string, message: string, type: "success" | "warning" | "alert") => {
    setToast({ show: true, title, message, type });
    setTimeout(() => {
      setToast(null);
    }, 5500);
  };

  // Create article action
  const handleCreateArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) {
      triggerToast("ข้อผิดพลาด", "กรุณากรอกข้อมูลให้ครบถ้วนก่อนส่งเข้าสแกน", "warning");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          excerpt: newExcerpt || newContent.substring(0, 150) + "...",
          content: newContent,
          language: newLanguage
        })
      });

      const result = await response.json();

      if (!response.ok) {
        // Attack prevented
        triggerToast(
          "REXDEV โจมตีระงับทันควัน!",
          result.error || "ระบบทำการบล็อกเนื่องจากตรวจพบตัวแปรที่มีนัยความเสี่ยงระดับสูง",
          "alert"
        );
        // Refresh logs to see current REXDEV capture log live
        const logsRes = await fetch("/api/logs");
        if (logsRes.ok) {
          setLogs(await logsRes.json());
        }
        // Refresh status counters too
        const statusRes = await fetch("/api/system-status");
        if (statusRes.ok) {
          setSystemStatus(await statusRes.json());
        }
      } else {
        // Success
        triggerToast(
          "อัปโหลดสำเร็จปลอดภัย",
          `บทความความแข็งแกร่งความปลอดภัยได้ลงทะเบียนในฐานข้อมูล (Slug: ${result.slug})`,
          "success"
        );
        setNewTitle("");
        setNewContent("");
        setNewExcerpt("");
        
        // Refresh & show the newly created piece
        await fetchData();
        setSelectedArticleId(result.id);
        setSelectedArticleLang(result.defaultLanguage);
        setActiveTab("articles");
      }
    } catch (err) {
      triggerToast("ความล้มเหลวในการเชื่อมต่อ", "เซิร์ฟเวอร์ยังไม่พร้อมใช้งานหรือถูกจำกัดสิทธิ์", "warning");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete article action
  const handleDeleteArticle = async (id: string) => {
    const confirmDelete = window.confirm("คุณแน่ใจหรือไม่ที่จะลบบทความและบันทึกรหัสตรวจสอบนี้ออกจากระบบหลัก?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`/api/articles/${id}`, {
        method: "DELETE"
      });
      if (response.ok) {
        triggerToast("ระบบทำลายข้อมูลเสร็จสิ้น", "ลบและสตรีมแจ้งเหตุการณ์ความตรงไปตรงมาเข้ารายการบันทึกแล้ว", "success");
        setSelectedArticleId(null);
        await fetchData();
      }
    } catch (e) {
      triggerToast("Error", "ไม่สามารถลบบทความได้", "warning");
    }
  };

  // Simulate Cyber Attack action ("การป้องกันการโจมตี")
  const handleSimulateAttack = async (type: string) => {
    try {
      const res = await fetch("/api/logs/simulate-attack", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type })
      });
      const data = await res.json();
      
      triggerToast(
        "แจ้งสัญญาณเตือนภัยการบุกรุก!",
        data.message || "เฝ้าระวังความเร็วสูงตรวจจับได้ทันที",
        type === "INTEGRITY" || type === "SQLI" || type === "XSS" ? "alert" : "warning"
      );

      // Refresh audits and dashboard immediately to view the real logs from Node express container
      const logsRes = await fetch("/api/logs");
      if (logsRes.ok) {
        setLogs(await logsRes.json());
      }
      const statusRes = await fetch("/api/system-status");
      if (statusRes.ok) {
        setSystemStatus(await statusRes.json());
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Trigger Deep AI scan
  const handleAISecurityScan = async (id: string) => {
    setIsScanning(id);
    triggerToast("เอนจิน REXDEV แสวงหาช่องโหว่", "ส่งคำประสานงานอัจฉริยะไปให้คอร์ Gemini ตรวจสอบโค้ดและภัยซ่อนเร้น...", "success");
    try {
      const res = await fetch(`/api/articles/${id}/security-scan`, {
        method: "POST"
      });
      if (res.ok) {
        const data = await res.json();
        triggerToast("การดีพสแกนเสร็จสมบูรณ์", `ผลการวิเคราะห์ระดับ: ${data.article.securityRating}`, "success");
        await fetchData();
      } else {
        triggerToast("การรันช่องโหว่ล้มเหลว", "กรุณาเช็กการคีย์ GEMINI_API_KEY", "warning");
      }
    } catch (e) {
      triggerToast("มีข้อผิดพลาดระบบวิเคราะห์", "ล้มเหลวในการเชื่อมต่อ", "warning");
    } finally {
      setIsScanning(null);
    }
  };

  // Trigger Gemini SEO optimization
  const handleAISEOOptimize = async (id: string) => {
    setIsOptimizing(id);
    triggerToast("ปรับวิถีทางเว็บบล็อ��ส่วนตัว", "Gemini กำลังคำนวณอัตราคำดัชนี จัดโครงสร้างหน้าเว็บ และปรับ Core Web Vitals...", "success");
    try {
      const res = await fetch(`/api/articles/${id}/seo-optimize`, {
        method: "POST"
      });
      if (res.ok) {
        const data = await res.json();
        triggerToast(
          "เพิ่มประสิทธิภาพ SEO สำเร็จ!",
          `คะแนนความเร็วและ SEO ได้รับการยกระดับขึ้นเป็น ${data.article.seoScore}/100`,
          "success"
        );
        await fetchData();
      } else {
        triggerToast("SEO Optimize Failed", "การติดต่อกับโมเดล Gemini ล้มเหลว", "warning");
      }
    } catch (e) {
      triggerToast("เกิดความล่าช้า", "ล้มเหลวในการปรับปรุง", "warning");
    } finally {
      setIsOptimizing(null);
    }
  };

  // Translate article to target languages using Gemini
  const handleAITranslate = async (id: string, targetLanguage: string) => {
    setIsTranslating(id);
    setSelectedArticleLang(targetLanguage);
    triggerToast("ระบบแปลหลายภาษากำลังประมวลผล", `กำลังข้ามผ่านสถาปัตยกรรมแปลโพสต์เป็นภาษา [${targetLanguage.toUpperCase()}] ด้วย Gemini...`, "success");
    try {
      const res = await fetch(`/api/articles/${id}/translate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetLang: targetLanguage })
      });
      if (res.ok) {
        triggerToast("การแปลหลายภาษาสำเร็จลุล่วง", `ลงทะเบียนบทความภาษา '${targetLanguage}' และสร้างเส้นทาง Static URL สำหรับบอทค้นหาเป็นระเบียบ`, "success");
        await fetchData();
      } else {
        // Fallback simulated or error
        triggerToast("แปลภาษาไม่สำเร็จ", "กรุณาเซ็ทเชื่อมต่อ Gemini คีย์ระบบ", "warning");
      }
    } catch (e) {
      triggerToast("ข้อผิดพลาด", "ไม่สามารถทำงานได้", "warning");
    } finally {
      setIsTranslating(null);
    }
  };

  const getRatingColor = (rating: string) => {
    if (rating === "Safe") return "text-green-400 bg-green-500/10 border-green-500/20";
    if (rating === "Warning") return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
    return "text-red-400 bg-red-500/10 border-red-500/20";
  };

  const activeArticle = articles.find(a => a.id === selectedArticleId);
  const activeArticleContent = activeArticle?.languages[selectedArticleLang] || 
    (activeArticle ? Object.values(activeArticle.languages)[0] : null);

  // Search filtered articles
  const filteredArticles = articles.filter(art => {
    const q = searchQuery.toLowerCase();
    if (!q) return true;
    return Object.values(art.languages).some((lang: any) => 
      lang.title.toLowerCase().includes(q) || 
      lang.content.toLowerCase().includes(q) ||
      (lang.keywords && lang.keywords.some((k: string) => k.toLowerCase().includes(q)))
    );
  });

  return (
    <div className="min-h-screen bg-[#070708] text-slate-100 flex flex-col font-sans select-none relative overflow-x-hidden">
      
      {/* Background Decorative Neon Spheres */}
      <div className="absolute top-0 right-0 w-[551px] h-[551px] bg-blue-600/10 rounded-full blur-[130px] -mr-64 -mt-64 pointer-events-none z-0"></div>
      <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-indigo-600/5 rounded-full blur-[110px] -ml-48 -mb-48 pointer-events-none z-0"></div>
      
      {/* Floating Interactive Toast Alert */}
      {toast?.show && (
        <div 
          style={{ zIndex: 9999 }}
          className={`fixed bottom-6 right-6 max-w-md p-5 rounded-2xl border backdrop-blur-xl animate-bounce shadow-2xl flex items-start space-x-3 transition-transform duration-300 ${
            toast.type === "success" 
              ? "bg-[#0f1d13]/90 border-green-500/40 text-green-300" 
              : toast.type === "alert"
              ? "bg-[#250d12]/90 border-red-500/40 text-red-200"
              : "bg-[#251b0d]/90 border-yellow-500/40 text-yellow-200"
          }`}
        >
          <div className="mt-1">
            {toast.type === "success" && <CheckCircle2 className="w-5 h-5 text-green-400" />}
            {toast.type === "alert" && <AlertTriangle className="w-5 h-5 text-red-400" />}
            {toast.type === "warning" && <AlertTriangle className="w-5 h-5 text-yellow-400" />}
          </div>
          <div className="flex-1">
            <h4 className="font-extrabold text-sm tracking-tight mb-1">{toast.title}</h4>
            <p className="text-xs text-slate-300 leading-relaxed font-mono">{toast.message}</p>
          </div>
          <button 
            onClick={() => setToast(null)}
            className="text-slate-400 hover:text-white text-xs font-bold px-1"
          >
            ×
          </button>
        </div>
      )}

      {/* Header Navigation Section */}
      <header className="border-b border-white/5 bg-[#0a0a0b]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab("articles")}>
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center font-black text-xl text-white shadow-lg shadow-blue-500/20">
              R
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-white leading-none">
                REXDEV<span className="text-blue-500">CYBER</span>
              </span>
              <span className="text-[9px] uppercase tracking-widest text-[#6366f1] font-mono font-bold mt-0.5">
                Cybersecurity Multi-Lang Engine
              </span>
            </div>
          </div>

          {/* Navigation Menu Tabs */}
          <nav className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <button
              id="tab-articles"
              onClick={() => setActiveTab("articles")}
              className={`px-4 py-2 rounded-xl transition-all ${
                activeTab === "articles"
                  ? "bg-blue-600/10 text-blue-400 border border-blue-500/20"
                  : "hover:text-white hover:bg-white/5"
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                {currentDict.articlesTab}
              </span>
            </button>
            <button
              id="tab-create"
              onClick={() => setActiveTab("create")}
              className={`px-4 py-2 rounded-xl transition-all ${
                activeTab === "create"
                  ? "bg-blue-600/10 text-blue-400 border border-blue-500/20"
                  : "hover:text-white hover:bg-white/5"
              }`}
            >
              <span className="flex items-center gap-1.5">
                <PlusCircle className="w-3.5 h-3.5" />
                {currentDict.createTab}
              </span>
            </button>
            <button
              id="tab-sandbox"
              onClick={() => setActiveTab("sandbox")}
              className={`px-4 py-2 rounded-xl transition-all ${
                activeTab === "sandbox"
                  ? "bg-blue-600/10 text-blue-400 border border-blue-500/20"
                  : "hover:text-white hover:bg-white/5"
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5" />
                {currentDict.sandboxTab}
              </span>
            </button>
            <button
              id="tab-dashboard"
              onClick={() => setActiveTab("dashboard")}
              className={`px-4 py-2 rounded-xl transition-all ${
                activeTab === "dashboard"
                  ? "bg-blue-600/10 text-blue-400 border border-blue-500/20"
                  : "hover:text-white hover:bg-white/5"
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5" />
                {currentDict.dashboardTab}
              </span>
            </button>
          </nav>

          {/* Quick Stats / Language Controls */}
          <div className="flex items-center space-x-4">
            {/* UI Localization Switcher */}
            <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 text-[11px] font-mono font-bold">
              <button 
                onClick={() => setUiLanguage("th")}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  uiLanguage === "th" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                TH
              </button>
              <button 
                onClick={() => setUiLanguage("en")}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  uiLanguage === "en" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                EN
              </button>
            </div>

            {/* Pulsating Security Indicator */}
            <div className="flex items-center space-x-2 bg-green-500/5 px-3 py-1.5 rounded-xl border border-green-500/20">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-green-400 font-mono hidden sm:inline">
                {currentDict.securedLabel}
              </span>
            </div>
          </div>

        </div>
      </header>

      {/* Hero Performance Overview Strip */}
      <section className="bg-gradient-to-r from-blue-950/10 via-indigo-950/5 to-transparent border-b border-white/5 py-3 text-slate-400 font-mono text-[11px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 text-blue-500" />
              <span>Next.js rendering: <strong className="text-white">Static SSG Hybrid</strong></span>
            </span>
            <span className="h-3 w-px bg-white/10 hidden md:block"></span>
            <span className="flex items-center gap-1">
              <Database className="w-3.5 h-3.5 text-indigo-500" />
              <span>Integrity DB: <strong className="text-white">Audit Memory Logs Ready</strong></span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-green-500" />
              <span>{currentDict.latencyText}: <strong className="text-white">{latency}ms</strong></span>
            </span>
            <span className="bg-white/10 text-white py-0.5 px-2 rounded text-[10px] font-bold">
              SSL / TLS 1.3 ACTIVE
            </span>
          </div>
        </div>
      </section>

      {/* Main Body */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full z-10 relative">
        
        {/* TAB 1: ARTICLES VIEW & PREVIEW & ENHANCEMENT SUITE */}
        {activeTab === "articles" && (
          <div className="space-y-8 animate-fade-in">
            
            {/* Upper Content Hero with REXDEV Architecture representation */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Highlight Featured Area */}
              <div className="lg:col-span-8 bg-gradient-to-br from-blue-900/10 to-transparent p-6 sm:p-10 rounded-3xl border border-white/5 flex flex-col justify-end relative overflow-hidden min-h-[300px]">
                <div className="absolute top-6 right-6 flex flex-col items-end text-right font-mono">
                  <span className="text-[10px] text-blue-400 font-bold mb-1 tracking-widest uppercase">
                    #SEO-OPTIMIZED #MULTI-LANG #REXDEV
                  </span>
                  <p className="text-[11px] text-slate-500 uppercase tracking-widest mt-1">
                    Next.js Speed Performance Rendering 
                  </p>
                </div>
                
                <div className="relative z-10 mt-12">
                  <div className="bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.25em] px-3 py-1.5 rounded-lg w-max mb-4">
                    Featured Technology 
                  </div>
                  <h1 className="text-3xl sm:text-5xl font-black leading-tight tracking-tight text-white mb-4">
                    {uiLanguage === "th" 
                      ? "สถาปัตยกรรมความเร็วสูงและความปลอดภัยไซเบอร์" 
                      : "High-Speed Architecture with Next-Gen Cyber Defenses"}
                  </h1>
                  <p className="text-slate-400 text-sm sm:text-[15px] leading-relaxed max-w-2xl">
                    {uiLanguage === "th"
                      ? "เว็บบล็อกส่วนตัวที่ออกแบบโครงสร้างให้ดึงดูดบอทค้นหา (Search Engine SEO Optimization) ช่วยให้ติดอันดับง่ายและรวดเร็ว พร้อมบูรณาการระบบเฝ้าระวัง REXDEV เพื่อกรอง SQL Injection และการเจาะระบบเครือข่าย"
                      : "Personal blog designed for lightning-fast speeds and high-impact SEO search ranking positioning, fully fortified against injection and cross-site scripting attack threats."}
                  </p>
                </div>
                {/* Visual grid overlay effect */}
                <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>
              </div>

              {/* REXDEV Core System components representation sidebar */}
              <div className="lg:col-span-4 flex flex-col justify-between gap-4">
                
                <div className="bg-white/5 rounded-2xl border border-white/5 p-5 flex-1 flex flex-col justify-center border-l-4 border-l-blue-500">
                  <div className="flex items-center space-x-2 text-blue-400 text-xs font-black uppercase tracking-widest mb-1">
                    <Shield className="w-4   h-4 text-blue-400" />
                    <span>1. REXDEV system</span>
                  </div>
                  <h3 className="text-base font-bold text-white mb-1">การป้องกันการโจมตี</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    ยับยั้งภัยคุกคามในระบบทันที กรองข้อมูลนำเข้า (Input Sanitization) ป้องกัน Payload ที่เป็นอันตรายระดับ Application Layer
                  </p>
                </div>

                <div className="bg-white/5 rounded-2xl border border-white/5 p-5 flex-1 flex flex-col justify-center border-l-4 border-l-indigo-500">
                  <div className="flex items-center space-x-2 text-indigo-400 text-xs font-black uppercase tracking-widest mb-1">
                    <Terminal className="w-4 h-4 text-indigo-400" />
                    <span>2. CYBER system</span>
                  </div>
                  <h3 className="text-base font-bold text-white mb-1">การตรวจสอบการโจมตีไซเบอร์</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    เฝ้าระวังสตรีมข้อมูล บันทึกข้อมูลการเข้าถึง ดักจับสัญญาณเตือนภัยการแฮก และตรวจตราความคงอยู่ของระบบอย่างเรียลไทม์
                  </p>
                </div>

                <div className="bg-white/5 rounded-2xl border border-white/5 p-5 flex-1 flex flex-col justify-center border-l-4 border-l-purple-500">
                  <div className="flex items-center space-x-2 text-purple-400 text-xs font-black uppercase tracking-widest mb-1">
                    <Lock className="w-4 h-4 text-purple-400" />
                    <span>3. SECURITY system</span>
                  </div>
                  <h3 className="text-base font-bold text-white mb-1">การรักษาความปลอดภัยของข้อมูล</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    จัดทำแบคอัพความเสี่ยง เข้ารหัสข้อมูลที่ส่งออกไปยังหน้าเว็บบล็อกส่วนตัว เฝ้าระวังสิทธิ์เข้าใช้งาน และลงนามรหัสตรวจสอบไฟล์
                  </p>
                </div>

              </div>

            </div>

            {/* SEARCH AND ARTICLES LAYOUT */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
              
              {/* LEFT SIDEBAR: Article Index List */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Search Bar Input Container */}
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder={uiLanguage === "th" ? "ค้นหาบทความ..." : "Search secure repository..."}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-[#0a0a0b] text-slate-100 placeholder-slate-500 text-xs font-medium py-3 px-4 pl-10 rounded-xl border border-white/10 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                    <Search className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
                  </div>
                </div>

                {/* Article Cards List Grid */}
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                  
                  {filteredArticles.length === 0 ? (
                    <div className="text-center py-10 bg-white/5 rounded-2xl border border-white/5 border-dashed">
                      <p className="text-slate-500 text-xs font-mono">No articles verified on this domain.</p>
                    </div>
                  ) : (
                    filteredArticles.map((art) => {
                      const displayLang = art.languages[uiLanguage] ? uiLanguage : art.defaultLanguage;
                      const contentItem = art.languages[displayLang] || Object.values(art.languages)[0];
                      const isSelected = art.id === selectedArticleId;

                      return (
                        <div
                          key={art.id}
                          onClick={() => {
                            setSelectedArticleId(art.id);
                            setSelectedArticleLang(displayLang);
                          }}
                          className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                            isSelected
                              ? "bg-gradient-to-r from-blue-900/20 to-indigo-900/20 border-blue-500/50"
                              : "bg-white/5 border-white/5 hover:border-white/20"
                          }`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1 bg-[#131316] py-1 px-2.5 rounded-lg border border-white/5">
                              <Globe className="w-3 h-3 text-indigo-400" />
                              {Object.keys(art.languages).map(k => k.toUpperCase()).join(" / ")}
                            </span>
                            <span className={`text-[9px] font-mono font-bold tracking-widest px-2 py-0.5 rounded border ${getRatingColor(art.securityRating)}`}>
                              {art.securityRating}
                            </span>
                          </div>

                          <h4 className="text-sm font-extrabold text-white mb-1.5 line-clamp-1">
                            {contentItem ? contentItem.title : "Untitled Secure Doc"}
                          </h4>

                          <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed mb-3">
                            {contentItem ? contentItem.excerpt : ""}
                          </p>

                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
                            <span className="text-[9px] text-slate-500 font-mono">
                              By {art.author.split(" ")[0]}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] font-mono text-indigo-400">
                                SEO: {art.seoScore}%
                              </span>
                              <span className="text-[9px] font-mono text-emerald-400">
                                Fast Perf: {art.performanceScore}/100
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}

                </div>

              </div>
              
              {/* RIGHT WORKSPACE: Selected Article Viewer & Dynamic Controls */}
              <div className="lg:col-span-8 bg-white/5 rounded-3xl border border-white/5 p-6 space-y-6">
                
                {activeArticle && activeArticleContent ? (
                  <div className="space-y-6">
                    
                    {/* Active Article Metadata Header */}
                    <div className="border-b border-white/5 pb-4 space-y-4">
                      
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        
                        {/* Target Language Toggle for currently read Article */}
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-slate-400 font-bold font-mono">
                            Language Target:
                          </span>
                          <div className="flex bg-[#0a0a0b] p-1 rounded-xl border border-white/10 font-mono text-[11px] font-bold">
                            {["th", "en", "jp", "zh"].map((lang) => {
                              const exists = !!activeArticle.languages[lang];
                              return (
                                <button
                                  key={lang}
                                  onClick={() => setSelectedArticleLang(lang)}
                                  className={`px-3 py-1 rounded-lg transition-all ${
                                    selectedArticleLang === lang
                                      ? "bg-indigo-600 text-white"
                                      : exists
                                      ? "text-slate-300 hover:text-white hover:bg-white/5"
                                      : "text-slate-600 hover:text-slate-400 hover:bg-white/5"
                                  }`}
                                >
                                  {lang.toUpperCase()} {!exists && "+"}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Delete Article Button */}
                        <button
                          onClick={() => handleDeleteArticle(activeArticle.id)}
                          className="text-xs text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 px-3 py-1.5 rounded-lg border border-red-500/20 transition-all font-semibold flex items-center gap-1.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          ลบบทความ
                        </button>

                      </div>

                      {/* Display performance meter */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                        
                        <div className="bg-[#0a0a0b]/60 p-3 rounded-xl border border-white/5">
                          <div className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">{currentDict.performanceMetric}</div>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-lg font-black text-emerald-400 font-mono">{activeArticle.performanceScore} ms</span>
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                          </div>
                        </div>

                        <div className="bg-[#0a0a0b]/60 p-3 rounded-xl border border-white/5">
                          <div className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">SEO INDEXING RATING</div>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-lg font-black text-indigo-400 font-mono">{activeArticle.seoScore} / 100</span>
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
                          </div>
                        </div>

                        <div className="bg-[#0a0a0b]/60 p-3 rounded-xl border border-white/5">
                          <div className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">REXDEV RATING</div>
                          <div className="flex items-center justify-between mt-1">
                            <span className={`text-sm font-black font-mono ${activeArticle.securityRating === 'Safe' ? 'text-green-400' : 'text-red-400'}`}>
                              {activeArticle.securityRating.toUpperCase()}
                            </span>
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                          </div>
                        </div>

                        <div className="bg-[#0a0a0b]/60 p-3 rounded-xl border border-white/5">
                          <div className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">STATIC URL PERMANENT</div>
                          <div className="text-xs font-mono font-bold text-white mt-1.5 truncate">
                            /{activeArticle.slug}
                          </div>
                        </div>

                      </div>

                    </div>

                    {/* AI CO-PILOT ACTIONS SUITE (AI Tools) */}
                    <div className="bg-gradient-to-r from-blue-950/20 to-indigo-950/20 p-5 rounded-2xl border border-blue-500/10 space-y-4">
                      
                      <div className="flex items-center space-x-2 text-xs font-bold text-blue-400 font-mono uppercase tracking-widest">
                        <Sparkles className="w-4 h-4 animate-spin text-blue-400" />
                        <span>REXDEVCYBER AI Audit Suite (ขับเคลื่อนด้วย Gemini AI)</span>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        
                        {/* Translate using AI button */}
                        <button
                          disabled={isTranslating !== null}
                          onClick={() => {
                            const target = selectedArticleLang;
                            handleAITranslate(activeArticle.id, target);
                          }}
                          className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 text-xs font-bold tracking-tight text-white py-2 px-3.5 rounded-xl border border-white/10 cursor-pointer disabled:opacity-50"
                        >
                          <Globe className="w-3.5 h-3.5 text-indigo-400" />
                          {isTranslating === activeArticle.id ? "กำลังแปลภาษาโดย AI..." : `แปลภาษาเป็น [${selectedArticleLang.toUpperCase()}] ด้วย AI`}
                        </button>

                        {/* SEO Auditor using AI Button */}
                        <button
                          disabled={isOptimizing !== null}
                          onClick={() => handleAISEOOptimize(activeArticle.id)}
                          className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 text-xs font-bold tracking-tight text-white py-2 px-3.5 rounded-xl border border-white/10 cursor-pointer disabled:opacity-50"
                        >
                          <Search className="w-3.5 h-3.5 text-amber-400" />
                          {isOptimizing === activeArticle.id ? "กำลังวิเคราะห์คำดัชนี..." : currentDict.seoAuditing}
                        </button>

                        {/* Cyber Security Audit scan button */}
                        <button
                          disabled={isScanning !== null}
                          onClick={() => handleAISecurityScan(activeArticle.id)}
                          className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-xs font-bold tracking-tight text-white py-2  px-4 rounded-xl border border-white/10 cursor-pointer disabled:opacity-50 shadow-inner"
                        >
                          <Shield className="w-3.5 h-3.5" />
                          {isScanning === activeArticle.id ? "สแกนสแกมตรวจจับ..." : currentDict.aiDeepScan}
                        </button>

                      </div>

                    </div>

                    {/* Deep AI scan result drawer display */}
                    {activeArticle.securityScanResult && (
                      <div className="bg-[#121217] p-5 rounded-2xl border border-white/5 space-y-4">
                        <div className="flex items-center justify-between border-b border-white/5 pb-2">
                          <span className="text-xs text-slate-400 font-bold font-mono uppercase tracking-widest flex items-center gap-1.5">
                            <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
                            Security deep vulnerability assessment record
                          </span>
                          <span className="text-[10px] font-mono text-slate-500">
                            Scanned at: {new Date(activeArticle.securityScanResult.scannedAt).toLocaleTimeString()}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          
                          {/* Threat findings */}
                          <div className="bg-[#0a0a0b] p-4 rounded-xl border border-white/5">
                            <h4 className="text-xs text-[#f43f5e] font-black uppercase tracking-wider mb-2 flex items-center gap-1">
                              <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                              {currentDict.vulnerabilityAlert}
                            </h4>
                            
                            {activeArticle.securityScanResult.vulnerabilitiesFound && activeArticle.securityScanResult.vulnerabilitiesFound.length > 0 ? (
                              <ul className="space-y-1">
                                {activeArticle.securityScanResult.vulnerabilitiesFound.map((v, idx) => (
                                  <li key={idx} className="text-xs text-[#fda4af] font-mono leading-relaxed pl-3 border-l-2 border-red-500">
                                    {v}
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-xs font-mono text-slate-500">
                                {currentDict.noVulnerability}
                              </p>
                            )}
                          </div>

                          {/* Security Index Rate */}
                          <div className="bg-[#0a0a0b] p-4 rounded-xl border border-white/5 flex flex-col justify-center text-center">
                            <span className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">
                              DATA INTEGRITY HEALTH INDEX
                            </span>
                            <span className="text-4xl font-black text-white font-mono mt-1">
                              {activeArticle.securityScanResult.score} %
                            </span>
                            <span className="text-[11px] text-[#818cf8] mt-1 font-semibold">
                              Certificated securely by REXDEVCYBER
                            </span>
                          </div>

                        </div>

                        {/* REXDEV Recommendations Suite */}
                        <div className="space-y-3 pt-2">
                          <h4 className="text-xs font-black uppercase tracking-widest text-[#a5b4fc]">
                            {currentDict.recommendations}
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="bg-blue-950/20 p-3 rounded-lg border border-blue-500/10">
                              <div className="text-[9px] font-black uppercase tracking-widest text-blue-400">REXDEV / PREVENTION (การป้องกัน)</div>
                              <p className="text-[11.5px] text-slate-300 mt-1 leading-relaxed">
                                {activeArticle.securityScanResult.recommendations.rexdev}
                              </p>
                            </div>
                            <div className="bg-indigo-950/20 p-3 rounded-lg border border-indigo-500/10">
                              <div className="text-[9px] font-black uppercase tracking-widest text-indigo-400">CYBER / MONITOR (การตรวจสอบด้านไซเบอร์)</div>
                              <p className="text-[11.5px] text-slate-300 mt-1 leading-relaxed">
                                {activeArticle.securityScanResult.recommendations.cyber}
                              </p>
                            </div>
                            <div className="bg-purple-950/20 p-3 rounded-lg border border-purple-500/10">
                              <div className="text-[9px] font-black uppercase tracking-widest text-purple-400">SECURITY / INTEGRITY (การรักษาความปลอดภัย)</div>
                              <p className="text-[11.5px] text-slate-300 mt-1 leading-relaxed">
                                {activeArticle.securityScanResult.recommendations.security}
                              </p>
                            </div>
                          </div>
                        </div>

                      </div>
                    )}

                    {/* Active Main Article Content */}
                    <div className="space-y-4 border-t border-white/5 pt-6 select-text">
                      
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="bg-white/5 text-[10px] text-slate-400 py-1 px-2.5 rounded-lg border border-white/5 font-mono">
                          Slug Alternate Link: /blog/{activeArticle.slug}
                        </span>
                        {activeArticleContent.keywords && activeArticleContent.keywords.map((k: string, i: number) => (
                          <span key={i} className="bg-indigo-950/20 text-[10px] text-indigo-400 py-1 px-2.5 rounded-lg border border-indigo-500/15 font-mono">
                            #{k}
                          </span>
                        ))}
                      </div>

                      <h2 className="text-2xl sm:text-3.5xl font-extrabold tracking-tight text-white leading-tight">
                        {activeArticleContent.title}
                      </h2>

                      <div className="flex items-center space-x-3 text-xs text-slate-400 py-1 font-mono">
                        <span className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-blue-500" />
                          {activeArticle.author}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {new Date(activeArticle.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      {/* Excerpt Display Box */}
                      <div className="bg-white/5 p-4 rounded-xl border-l-[3.5px] border-l-blue-600 border-white/5">
                        <p className="text-xs text-slate-300 leading-relaxed italic">
                          {activeArticleContent.excerpt}
                        </p>
                      </div>

                      {/* Full Markdown/Plaintext content */}
                      <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-sans space-y-4 pt-2">
                        {activeArticleContent.content}
                      </div>

                      {/* SEO meta representation tags dashboard bottom preview */}
                      <div className="mt-8 pt-6 border-t border-white/5">
                        <div className="bg-[#0b0b0e] p-5 rounded-2xl border border-white/5 font-mono space-y-3">
                          <div className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest flex items-center gap-1">
                            <Search className="w-3.5 h-3.5" />
                            Google SEO Search Engine Snippet Preview Indexed (Next.js Simulated Web Bot Meta)
                          </div>
                          
                          <div className="space-y-1.5 p-3.5 bg-[#131316] rounded-xl border border-white/5">
                            <span className="text-[11px] text-slate-500 flex items-center gap-1">
                              https://rexdevcybersecurity.com › blog › {activeArticle.slug}
                            </span>
                            <div className="text-sm font-semibold text-blue-400 hover:underline cursor-pointer">
                              {activeArticleContent.metaTitle}
                            </div>
                            <p className="text-[12px] text-slate-400 max-w-2xl leading-relaxed">
                              {activeArticleContent.metaDescription}
                            </p>
                          </div>

                          <div className="flex flex-wrap items-center justify-between pt-1 gap-2">
                            <span className="text-[10px] text-slate-500 font-mono">
                              Canonical: <strong className="text-white">{"<link rel='canonical' href='https://rexdev-cybersecurity.com/blog/" + activeArticle.slug + "' />"}</strong>
                            </span>
                            <span className="text-[10px] text-emerald-400 py-0.5 px-2 bg-emerald-500/10 rounded font-semibold border border-emerald-500/10">
                              Core Indexing Ready
                            </span>
                          </div>
                        </div>
                      </div>

                    </div>

                  </div>
                ) : (
                  <div className="text-center py-24">
                    <Shield className="w-12 h-12 text-slate-600 mx-auto mb-4 animate-pulse" />
                    <p className="text-sm text-slate-500 font-mono">Select a safe checked document from the list directory inside the database.</p>
                  </div>
                )}

              </div>

            </div>

          </div>
        )}

        {/* TAB 2: WRITE SECURE ARTICLE ("การตรวจสอบการเปลี่ยนแปลง" และ "การป้องกันการโจมตี") */}
        {activeTab === "create" && (
          <div className="max-w-4xl mx-auto bg-white/5 rounded-3xl border border-white/5 p-6 sm:p-8 space-y-6 animate-fade-in">
            
            <div className="border-b border-white/5 pb-4">
              <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                <PlusCircle className="w-6 h-6 text-blue-500" />
                {currentDict.newPost}
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm mt-1">
                เขียนบทความใหม่และส่งเข้าระบบตรวจป้อง SQL-Injection / XSS อัตโนมัติ (เฝ้าระวังการตรวจสอบข้อมูลการเข้าถึงการสแกนความลึกซึ้ง)
              </p>
            </div>

            {/* Live Security Inspect Indicator Panel (การตรวจสอบการเปลี่ยนแปลงและการลักลอบโจมตี) */}
            <div className={`p-4 rounded-2xl border transition-all duration-300 font-mono ${
              liveSanitizerAlert.secure
                ? "bg-green-950/20 border-green-500/20 text-green-300"
                : "bg-red-950/20 border-red-500/30 text-red-300"
            }`}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs leading-relaxed">
                <div className="flex items-center space-x-2.5">
                  <div className={`w-3 h-3 rounded-full ${liveSanitizerAlert.secure ? 'bg-green-500 animate-pulse' : 'bg-red-500 animate-ping'}`}></div>
                  <div>
                    <span className="font-extrabold block text-[11px] uppercase tracking-widest text-white">
                      REXDEV REAL-TIME ACTIVE PAYLOAD INSPECTOR INPUT
                    </span>
                    <span className="text-[11.5px] mt-0.5 block font-serif">
                      {liveSanitizerAlert.secure 
                        ? "สถานะข้อความ: สมบูรณ์ปลอดภัยดีเยี่ยม ไม่พบลักษณะอักขระ SQL Injection / XSS"
                        : `[ตรวจพบความสอดคล้องความเสี่ยง]: ${liveSanitizerAlert.threatFound}`}
                    </span>
                  </div>
                </div>
                {!liveSanitizerAlert.secure && (
                  <span className="bg-red-500/20 text-red-400 font-bold px-3 py-1.5 rounded-lg border border-red-500/10 text-[10px] tracking-wider uppercase animate-pulse">
                    REXDEV INTERCEPT ACTIVE
                  </span>
                )}
              </div>
            </div>

            <form onSubmit={handleCreateArticle} className="space-y-5">
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                    ภาษาเริ่มต้นของบทความ (Source Language)
                  </label>
                  <select
                    value={newLanguage}
                    onChange={(e) => setNewLanguage(e.target.value)}
                    className="w-full bg-[#0a0a0b] text-slate-100 rounded-xl border border-white/10 text-xs font-bold py-3 px-4 focus:outline-none focus:border-blue-500"
                  >
                    <option value="th">ภาษาไทย (TH)</option>
                    <option value="en">English (EN)</option>
                    <option value="jp">日本語 (JP)</option>
                    <option value="zh">中文 (ZH)</option>
                  </select>
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                    หัวข้อบทความ (Article SEO Title)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ป้อนชื่อหัวข้อบทความ..."
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-[#0a0a0b] text-slate-100 rounded-xl border border-white/10 text-xs font-medium py-3 px-4 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                  คำโปรยนำสั้นสำหรับผู้ค้า��้นหา (Meta Excerpt Description) - ตัวเลือกเพิ่มเติม
                </label>
                <input
                  type="text"
                  placeholder="กรอกข้อความสรุปเพื่อให้ผู้ใช้หรือ Google นำไปแสดง..."
                  value={newExcerpt}
                  onChange={(e) => setNewExcerpt(e.target.value)}
                  className="w-full bg-[#0a0a0b] text-slate-100 rounded-xl border border-white/10 text-xs font-medium py-3 px-4 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                  เนื้อหาบทความความปลอดภัย (Educational Security Content)
                </label>
                <textarea
                  required
                  rows={8}
                  placeholder={`เขียนข้อความหรือคัดลอกบทความความปลอดภัยของคุณลงที่นี่\n(คุณสามารถทดลองป้อนสคริปต์แฝงตัวอย่างเช่น <script> เพื่อทดสอบความคงทนของระบบ REXDEV ปลั๊กอิน)`}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full bg-[#0a0a0b] text-slate-100 placeholder-slate-600 rounded-xl border border-white/10 text-xs font-mono py-3.5 px-4 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              {/* Security code review confirmation seal before submitting */}
              <div className="bg-[#101014] p-4 rounded-xl border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="text-[11.5px] leading-relaxed text-slate-400 font-mono">
                  เมื่อคุณคลิก ตรวจสอบและลงประกาศ ระบบจะวิเคราะห์หาช่องโหว่ทันที และบันทึกรหัสไอพีการเข้าถึงและแก้ไขหน้าบล็อกนี้เป็นพัสดุดิจิทัล
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs uppercase tracking-wide px-6 py-3.5 rounded-xl cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-500/10"
                >
                  <Shield className="w-4 h-4" />
                  {isSubmitting ? "กำลังตรวจสอบความปลอดภัยและพิมพ์..." : currentDict.submitPost}
                </button>
              </div>

            </form>

          </div>
        )}

        {/* TAB 3: THREAT MONITOR LIVE SANDBOX ("การตรวจสอบการโจมตีไซเบอร์" และ "การเข้าถึง") */}
        {activeTab === "sandbox" && (
          <div className="space-y-8 animate-fade-in">
            
            {/* Simulation Header Block */}
            <div className="bg-gradient-to-br from-[#121217] via-[#0e0e11] to-transparent p-6 sm:p-8 rounded-3xl border border-white/5 space-y-4">
              <div className="flex items-center space-x-3 text-red-400 font-bold font-mono tracking-widest text-xs uppercase">
                <Terminal className="w-5 h-5 text-red-500 animate-pulse" />
                <span>REXDEV & CYBER INTEGRATED ACTIVE CYBER-DEFENSE SANDBOX</span>
              </div>
              <h2 className="text-xl sm:text-2.5xl font-extrabold text-white leading-tight">
                {currentDict.simulateTitle}
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-3xl">
                {currentDict.simulateSubtitle}
              </p>

              {/* Action Simulation buttons layout */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                
                <button
                  onClick={() => handleSimulateAttack("SQLI")}
                  className="bg-white/5 hover:bg-white/10 text-slate-100 p-4 rounded-2xl border border-white/10 hover:border-red-500/40 text-left transition-all group pointer-events-auto"
                >
                  <div className="w-9 h-9 bg-red-500/15 text-red-400 rounded-xl flex items-center justify-center font-bold text-xs mb-3 font-mono">
                    UNION
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1">{currentDict.sqlSim}</h4>
                  <p className="text-[10.5px] text-slate-500 group-hover:text-slate-300 leading-normal">
                    ส่งคิวรีสคริปต์เจาะฐานข้อมูลระบบ REXDEV บล็อก
                  </p>
                </button>

                <button
                  onClick={() => handleSimulateAttack("XSS")}
                  className="bg-white/5 hover:bg-white/10 text-slate-100 p-4 rounded-2xl border border-white/10 hover:border-red-500/40 text-left transition-all group pointer-events-auto"
                >
                  <div className="w-9 h-9 bg-red-500/15 text-red-400 rounded-xl flex items-center justify-center font-bold text-xs mb-3 font-mono">
                    &lt;SCR&gt;
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1">{currentDict.xssSim}</h4>
                  <p className="text-[10.5px] text-slate-500 group-hover:text-slate-300 leading-normal">
                    ยิงแท็ก Script เพื่อละเมิดสิทธิ์อ่านคุกกี้ระบบ
                  </p>
                </button>

                <button
                  onClick={() => handleSimulateAttack("BRUTE")}
                  className="bg-white/5 hover:bg-white/10 text-slate-100 p-4 rounded-2xl border border-white/10 hover:border-orange-500/40 text-left transition-all group pointer-events-auto"
                >
                  <div className="w-9 h-9 bg-orange-500/15 text-orange-400 rounded-xl flex items-center justify-center font-bold text-xs mb-3 font-mono text-center">
                    AUTH
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1">{currentDict.bruteSim}</h4>
                  <p className="text-[10.5px] text-slate-500 group-hover:text-slate-300 leading-normal">
                    จำลองแฮกเกอร์แก๊งบุกสุ่มพอร์ตล็อกอิน
                  </p>
                </button>

                <button
                  onClick={() => handleSimulateAttack("INTEGRITY")}
                  className="bg-white/5 hover:bg-white/10 text-slate-100 p-4 rounded-2xl border border-white/10 hover:border-indigo-500/40 text-left transition-all group pointer-events-auto"
                >
                  <div className="w-9 h-9 bg-indigo-500/15 text-indigo-400 rounded-xl flex items-center justify-center font-bold text-xs mb-3 font-mono">
                    HASH
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1">{currentDict.integritySim}</h4>
                  <p className="text-[10.5px] text-slate-500 group-hover:text-slate-300 leading-normal">
                    แอบเปลี่ยนแก้ไขโค้ด Next.js โฮสต์หลักภายนอก
                  </p>
                </button>

              </div>

            </div>

            {/* AUDIT LOG STREAM SECTION ("การตรวจสอบการเข้าถึง" และ "การตรวจสอบบันทึกการเปลี่ยนแปลง") */}
            <div className="bg-[#0a0a0b] rounded-3xl border border-white/5 p-6 space-y-4">
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
                <div>
                  <h3 className="text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
                    <Activity className="w-5 h-5 text-indigo-400 animate-pulse" />
                    {currentDict.logsTitle}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {currentDict.logsSubtitle}
                  </p>
                </div>

                <div className="flex items-center space-x-3 text-xs">
                  <span className="font-mono text-slate-500">
                    Active sensors: <strong className="text-emerald-400">{systemStatus.cyber_active_sensors}</strong>
                  </span>
                  <span className="h-4 w-px bg-white/10"></span>
                  <button
                    onClick={async () => {
                      const res = await fetch("/api/logs");
                      if (res.ok) setLogs(await res.json());
                      triggerToast("รีเฟรชบันทึกเรียบร้อย", "ดึงข้อมูลการสตรีมความจริงข้อมูลล่าสุดเสร็จสมบูรณ์", "success");
                    }}
                    className="text-slate-400 hover:text-white flex items-center gap-1.5 bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/5"
                  >
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                    ดึงบันทึกล่าสุด
                  </button>
                </div>
              </div>

              {/* Logs Content Output Screen */}
              <div className="bg-[#050507] p-5 rounded-2xl border border-white/5 font-mono text-xs overflow-x-auto max-h-[480px] overflow-y-auto space-y-2.5 custom-scrollbar select-text leading-relaxed">
                {logs.length === 0 ? (
                  <div className="text-center py-12 text-slate-600">
                    No active connections logged. Security systems clear.
                  </div>
                ) : (
                  logs.map((log) => {
                    const isPrevented = log.category === "ATTACK_PREVENTED";
                    const isIntegrity = log.category === "INTEGRITY_CHECK";
                    const isAccess = log.category === "ACCESS_AUDIT";
                    
                    let prefixColor = "text-slate-400";
                    let rowBg = "hover:bg-white/5";
                    if (isPrevented) { prefixColor = "text-red-400 font-extrabold"; rowBg = "bg-red-500/5 hover:bg-red-500/10 border-red-500/10 border"; }
                    else if (isIntegrity) { prefixColor = "text-indigo-400"; }
                    else if (isAccess) { prefixColor = "text-blue-400"; }

                    return (
                      <div key={log.id} className={`p-3 rounded-lg transition-all ${rowBg} flex flex-col sm:flex-row items-start font-mono gap-2`}>
                        <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
                          <span className="text-[10px] text-slate-500 font-semibold bg-white/5 py-0.5 px-2 rounded">
                            {new Date(log.timestamp).toLocaleTimeString()}
                          </span>
                          <span className={`text-[9.5px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded ${
                            log.severity === 'CRITICAL' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                            log.severity === 'WARNING' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' :
                            'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          }`}>
                            {log.severity}
                          </span>
                          <span className={`text-[10px] font-bold ${prefixColor}`}>
                            [{log.category}]
                          </span>
                        </div>

                        <div className="flex-1 text-slate-300">
                          <span className="text-white font-semibold">({log.component})</span> {log.message}
                        </div>

                        <div className="text-[10px] text-slate-500 bg-[#0a0a0c] px-2 py-0.5 rounded border border-white/5 flex-shrink-0 self-end sm:self-center">
                          IP: {log.ipAddress}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

            </div>

          </div>
        )}

        {/* TAB 4: ADVANCED SECURITY TELEMETRY BOARD / DASHBOARD ("การป้องกันการโจมตี") */}
        {activeTab === "dashboard" && (
          <div className="space-y-8 animate-fade-in">
            
            {/* Top Stats Overview Panel Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="bg-gradient-to-br from-blue-900/10 to-transparent p-6 rounded-3xl border border-white/5 flex flex-col justify-between relative overflow-hidden">
                <div className="text-slate-400 font-mono text-xs uppercase tracking-widest">
                  REXDEV PROTECTION RATE
                </div>
                <div className="text-4xl font-black text-white font-mono my-4">
                  {systemStatus.rexdev_defense_rate}
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  Application Layer Shield Active
                </div>
                {/* Accent mini block */}
                <div className="absolute top-4 right-4 text-blue-500 font-bold text-lg">⬢</div>
              </div>

              <div className="bg-gradient-to-br from-indigo-900/10 to-transparent p-6 rounded-3xl border border-white/5 flex flex-col justify-between relative overflow-hidden">
                <div className="text-slate-400 font-mono text-xs uppercase tracking-widest">
                  CYBER SECURITY ACTIVE SENSORS
                </div>
                <div className="text-4xl font-black text-white font-mono my-4">
                  {systemStatus.cyber_active_sensors}
                </div>
                <div className="text-[11px] text-indigo-400 font-mono">
                  Threat Scanners Multi-Nodes live
                </div>
                <div className="absolute top-4 right-4 text-indigo-500 font-bold text-lg">⬢</div>
              </div>

              <div className="bg-gradient-to-br from-purple-900/10 to-transparent p-6 rounded-3xl border border-white/5 flex flex-col justify-between relative overflow-hidden">
                <div className="text-slate-400 font-mono text-xs uppercase tracking-widest">
                  SECURITY ENCRYPTION LEVEL
                </div>
                <div className="text-sm font-black text-[#cbd5e1] font-mono my-6 leading-tight">
                  {systemStatus.security_encryption}
                </div>
                <div className="text-[11px] text-[#c084fc] font-mono">
                  Dynamic Session Tokens verified
                </div>
                <div className="absolute top-4 right-4 text-purple-500 font-bold text-lg">⬢</div>
              </div>

              <div className="bg-gradient-to-br from-rose-900/10 to-transparent p-6 rounded-3xl border border-white/10 flex flex-col justify-between relative overflow-hidden border-l-[3.5px] border-l-red-500">
                <div className="text-red-400 font-mono text-xs uppercase tracking-widest font-extrabold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  BLOCKED MALICIOUS ATTACKS
                </div>
                <div className="text-4xl font-black text-white font-mono my-4">
                  {systemStatus.blocked_attacks}
                </div>
                <div className="text-[11px] text-red-400 font-mono">
                  Intrusion probes intercepted
                </div>
                <div className="absolute top-4 right-4 text-rose-500 font-bold text-lg">⬢</div>
              </div>

            </div>

            {/* Middle Section: Security Telemetry Graphical Chart ("การตรวจสอบการเปลี่ยนแปลง") */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              <div className="lg:col-span-8 bg-[#0a0a0b] rounded-3xl border border-white/5 p-6 space-y-6">
                <div>
                  <h3 className="text-base font-extrabold text-white font-mono uppercase tracking-widest">
                    CYBER SENSORS SCANS & INTRUSION DETECTION METRICS OVER TIME
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    กราฟแสดงแนวโน้มและปริมาณภัยคุกคามไซเบอร์ที่ตรวจจับได้สำเร็จในระบบ REXDEVCYBER
                  </p>
                </div>

                {/* Cyber-defense Custom SVG Glowing Telemetry Graph Line chart */}
                <div className="relative bg-[#050507] p-4 rounded-2xl border border-white/5 h-[300px] flex items-end justify-between overflow-hidden">
                  
                  {/* Decorative faint horizontal grids */}
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none p-6">
                    <div className="border-b border-white/5 w-full"></div>
                    <div className="border-b border-white/5 w-full"></div>
                    <div className="border-b border-white/5 w-full"></div>
                    <div className="border-b border-white/5 w-full"></div>
                  </div>

                  {/* SVG glowing graph representing security data trend */}
                  <svg className="absolute inset-0 w-full h-[300px] z-10 p-6" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    
                    {/* Fill Area */}
                    <path
                      d="M 0 250 L 50 200 L 120 220 L 190 140 L 260 180 L 330 110 L 400 130 L 470 60 L 540 90 L 610 40 L 680 70 L 750 30"
                      fill="none"
                      stroke="#4f46e5"
                      strokeWidth="2.5"
                    />
                    
                    <path
                      d="M 0 250 L 50 200 L 120 220 L 190 140 L 260 180 L 330 110 L 400 130 L 470 60 L 540 90 L 610 40 L 680 70 L 750 30 L 750 300 L 0 300 Z"
                      fill="url(#gradient)"
                      opacity="0.5"
                    />

                    {/* Cyber telemetry points circles */}
                    {[
                      { x: 50, y: 200, label: "Jan" },
                      { x: 120, y: 220, label: "Feb" },
                      { x: 190, y: 140, label: "Mar" },
                      { x: 260, y: 180, label: "Apr" },
                      { x: 330, y: 110, label: "May" },
                      { x: 400, y: 130, label: "Jun" },
                      { x: 470, y: 60, label: "Jul" },
                      { x: 540, y: 90, label: "Aug" },
                      { x: 610, y: 40, label: "Sep" },
                      { x: 680, y: 70, label: "Oct" },
                      { x: 750, y: 30, label: "Nov" }
                    ].map((pt, i) => (
                      <g key={i}>
                        <circle cx={pt.x} cy={pt.y} r="4" fill="#6366f1" className="animate-pulse" />
                        <text x={pt.x - 10} y="220" fill="#94a3b8" fontSize="8" fontFamily="monospace">
                          {pt.label}
                        </text>
                      </g>
                    ))}
                  </svg>

                  {/* Latency text tag on graph corner */}
                  <div className="absolute bottom-4 right-4 z-20 bg-[#0a0a0c]/80 py-1.5 px-3 rounded-lg border border-white/5 text-[9.5px] text-slate-400 font-mono">
                    SENSOR TELEMETRY SCAN FREQUENCY: 1.2 MILLION / SEC
                  </div>

                </div>

              </div>
              
              {/* Telemetry Diagnostic Sidebar */}
              <div className="lg:col-span-4 bg-[#0a0a0b] rounded-3xl border border-white/5 p-6 flex flex-col justify-between">
                
                <div className="space-y-4">
                  <h3 className="text-base font-extrabold text-white font-mono uppercase tracking-widest">
                    SYSTEMS CERTIFICATION
                  </h3>
                  <div className="h-0.5 bg-gradient-to-r from-blue-500 to-transparent"></div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    ระบบความปลอดภัยไซเบอร์ REXDEVCYBER ได้รับการตรวจสอบการเข้าถึงและการเปลี่ยนแปลงข้อมูลตลอดเวลา 24 ชั่วโมง ได้มาตรฐานความมั่นคงทางไซเบอร์
                  </p>
                </div>

                <div className="space-y-3 my-6">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Next.js Rendering Velocity:</span>
                    <strong className="text-green-400 font-mono">99 / 100</strong>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">SEO Crawler Visibility:</span>
                    <strong className="text-blue-400 font-mono">Excellent (100%)</strong>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">SQLi Input Scrubbing Rate:</span>
                    <strong className="text-semibold text-white font-mono">AES-Grade (Perfect)</strong>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Intrusion Audit Memory:</span>
                    <strong className="text-indigo-400 font-mono">Live Sync Engine</strong>
                  </div>
                </div>

                <button
                  onClick={() => alert("ระบบ Security Certification ตรวจตราความหนาแน่นเรียบร้อยแล้ว")}
                  className="w-full bg-[#131316] hover:bg-[#1b1b22] text-xs font-bold text-white tracking-wide py-3.5 rounded-2xl border border-white/10 transition-colors uppercase font-mono cursor-pointer"
                >
                  ประทับรหัสดิจิตอล (Signature Check)
                </button>

              </div>

            </div>

          </div>
        )}

      </main>

      {/* FOOTER METRICS SYSTEM STATUS BAR */}
      <footer className="px-4 sm:px-8 py-5 bg-[#0a0a0b] border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 z-15 relative mt-auto">
        <div className="flex flex-wrap items-center justify-center gap-4 text-[10px] uppercase font-bold tracking-[0.15em] text-slate-500 font-mono">
          <span>Latency Node: APAC-BANGKOK-01</span>
          <span>•</span>
          <span>Core Integrity: 100% Verified</span>
          <span>•</span>
          <span>SEO Engine Build: Fast Next.js rendering simulation</span>
        </div>
        <div className="text-[10px] text-white/25 font-mono text-center">
          &copy; {new Date().getFullYear()} REXDEVCYBERCYBER-SECURITY PLATFORM. ALL RIGHTS RESERVED.
        </div>
      </footer>

      <Analytics />
    </div>
  );
}
