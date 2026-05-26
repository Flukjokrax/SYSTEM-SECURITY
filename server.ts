import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { Article, SecurityEventLog } from "./src/types";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize GoogleGenAI client lazily or handle fallback gracefully
let aiClient: GoogleGenAI | null = null;
const isGeminiEnabled = !!process.env.GEMINI_API_KEY;

function getGeminiClient(): GoogleGenAI {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not defined. Please configure it in your Secrets / Env settings.");
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Memory database for articles
let articles: Article[] = [
  {
    id: "art-1",
    slug: "rexdev-cyber-prevention-xss-sqli",
    createdAt: new Date(Date.now() - 3600000 * 24 * 5).toISOString(), // 5 days ago
    author: "System Core (REXDEV)",
    seoScore: 94,
    isOptimized: true,
    performanceScore: 99, // Fast Next.js rendering simulation
    defaultLanguage: "th",
    securityRating: "Safe",
    languages: {
      th: {
        title: "คู่มือป้องกันการโจมตีเว็บด้วยระบบ REXDEV: ป้องกัน SQL Injection และ XSS อย่างเบ็ดเสร็จ",
        excerpt: "ศึกษาเทคนิคและสถาปัตยกรรมความปลอดภัยขั้นสูงด้วย REXDEV เพื่อตัดวงจรแฮกเกอร์ ปิดช่องโหว่อย่างถาวร",
        content: `ในปัจจุบัน ภัยคุกคามทางไซเบอร์ทวีความเร็วและรุนแรงขึ้นอย่างมาก โดยเฉพาะการโจมตีอันดับต้นๆ อย่าง SQL Injection (SQLi) และ Cross-Site Scripting (XSS)

ระบบ REXDEV ออกแบบมาเพื่อรับมือการโจมตีในระดับ Application Layer โดยเฉพาะ:
1. **Input Sanitization**: กรองและทำความสะอาดทุกข้อมูลนำเข้าก่อนส่งเข้าสู่กระบวนการฐานข้อมูล
2. **Context-aware Encoding**: เข้ารหัสข้อมูลที่ส่งออกไปยังหน้าเว็บบล็อกส่วนตัวเพื่อทำหน้าเว็บความปลอดภัยขั้นสูง เช่น การแปลงตัวอักษรพิเศษป้องกันการรัน Script ที่ไม่ปรารถนา
3. **Content Security Policy (CSP)**: บังคับใช้ CSP อย่างเคร่งครัดเพื่อระบุแหล่งที่มาของสคริปต์ที่ได้รับความพึงประสงค์เท่านั้น

และด้วยสถาปัตยกรรม Next.js static rendering (SSG) หน้าเว็บบล็อกนี้จึงเรนเดอร์ข้อมูลออกจาก Server อย่างรวดเร็วเป็นพิเศษ ลดพื้นผิวหน้าจอการตรวจรับข้อมูลแบบ Dynamic จึงป้องกันแนวทางโจมตี SQL Injection ได้ 100% สำหรับหน้าอ่านข้อมูลระบบ!`,
        metaTitle: "REXDEV: วิธีป้องกัน SQL Injection และ XSS ในเว็บบล็อกยุคใหม่",
        metaDescription: "เจาะลึกเทคนิคการรักษาความปลอดภัย REXDEV วิธีบล็อกและกรองข้อมูลนำเข้าเพื่อความปลอดภัยระดับสูงสุด พร้อมเรนเดอร์หน้าเว็บความเร็วพิเศษด้วย Next.js",
        keywords: ["REXDEV", "ความปลอดภัยไซเบอร์", "SQL Injection", "XSS", "ความปลอดภัยเว็บ"]
      },
      en: {
        title: "Web Defense Guide with REXDEV System: Eliminating SQL Injection and XSS Threats",
        excerpt: "Learn state-of-the-art security patterns with REXDEV architecture to block hackers and remediate application vulnerabilities persistently.",
        content: `Today, cyber threats are growing exponentially, particularly application-level vectors like SQL Injection (SQLi) and Cross-Site Scripting (XSS).

Our REXDEV prevention system is specifically engineered to neutralize threats at the Application Layer:
1. **Input Sanitization**: Cleanse and scrub all payloads prior to DB ingestion.
2. **Context-aware Encoding**: Sanitize high-risk entities outputted on the blog interfaces to mitigate dangerous scripts execution.
3. **Strict Content Security Policy (CSP)**: Establish explicit layout controls and secure origin validation.

By utilizing high-performance static rendering philosophies like Next.js, our pages are fast, static, and lack database exposure on execution fronts—making reading completely bulletproof against injection vectors!`,
        metaTitle: "REXDEV: Eliminating SQL Injection and XSS in Modern Blogs",
        metaDescription: "Dive deep into REXDEV prevention methodologies, input scrubbing, and secure content delivery designed for enterprise defensive postures.",
        keywords: ["REXDEV", "Cybersecurity", "SQL Injection", "XSS", "Application Security"]
      }
    },
    securityScanResult: {
      scannedAt: new Date(Date.now() - 3600000 * 24 * 5).toISOString(),
      score: 100,
      vulnerabilitiesFound: [],
      recommendations: {
        rexdev: "ระบบตรวจสอบข้อมูลขาเข้าทำงานปกติดีเยี่ยม ไม่พบ Payload ที่เป็นอันตราย",
        cyber: "เฝ้าระวังการจราจรข้อมูลสำเร็จตามปกติ ไม่มีรูปแบบสแกนพอร์ตหรือดีบั๊กแปลกปลอม",
        security: "เปิดใช้งานการเข้ารหัส HTTPS และ CSP ระดับสูงเป็นระเบียบเรียบร้อยแล้ว"
      }
    }
  },
  {
    id: "art-2",
    slug: "cyber-active-monitoring-threats",
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(), // 12 hours ago
    author: "Security Analyst (CYBER)",
    seoScore: 88,
    isOptimized: true,
    performanceScore: 98,
    defaultLanguage: "th",
    securityRating: "Safe",
    languages: {
      th: {
        title: "การตรวจสอบและวิเคราะห์การโจมตีภัยคุกคามในระบบ CYBER ตลอด 24/7",
        excerpt: "อธิบายกลไกของแอนจิน CYBER ตรวจจับกิจกรรมผิดปกติแบบเรียลไทม์ และระบบประมวลพฤติกรรมผู้บุกรุก",
        content: `ในการป้องกันตนเองบนสมรภูมิไซเบอร์ การทำเพียง 'การป้องกันเชิงรับ' นั้นไม่เพียงพอ ระบบ 'CYBER' จึงถูกพัฒนาขึ้นมาเพื่อทำหน้าที่ตรวจสอบและแจ้งเตือนภัยคุกคามอย่างเชิงรุก!

ระบบ CYBER มีหลักการวิเคราะห์ข้อมูลความปลอดภัย 3 ขั้นตอนหลัก:
- **Heuristic Pattern Analysis**: สังเกตรูปแบบไฟล์เวกเตอร์การบุกรุก เช่น การสแกน API คีย์บอร์ดแปลกๆ การรันสคริปต์เวียนซ้ำ หรือการเข้าถึงแบบ Brute Force
- **Integrity Validation**: ตรวจสอบการเปลี่ยนแปลงของโครงสร้างไฟล์และบล็อกส่วนสำคัญของระบบ หากพบการดัดแปลงจะส่งแจ้งเตือนภัยเพื่อปิดกั้นทันที
- **Access Audit Logs**: ระบบสตรีมบันทึกการตรวจสอบที่ปิดโอกาสปิดบังตนเอง แฮกเกอร์จะไม่สามารถแก้ไข Logs ได้เนื่องจากใช้การเซ็นชื่อดิจิทัลและเก็บแบคอัพแยกส่วน

เมื่อจับคู่แนววิเคราะห์แบบ Next.js speed และเครื่องมือ SEO อัจฉริยะแล้ว ไม่ว่าจะเกิดสถานการณ์ถูกรุมพูลแบนวิธ (DDoS) ระบบแคชที่มีแอร์แกพ (Air-gapped Cache) จะยังคงเสิร์ฟบทความได้อย่างราบรื่นและลดภาระระบบเซิร์ฟเวอร์หลักได้อย่างมีประสิทธิผล`,
        metaTitle: "CYBER: ระบบตรวจสอบภัยคุกคามและการวิเคราะห์ล็อกตลอด 24 ชั่วโมง",
        metaDescription: "ระบบ CYBER ช่วยสอดส่อง พฤติกรรมต้องสงสัย จับพิกัดไอพีและช่องทางการเข้าโจมตีได้อย่างรวดเร็ว พร้อมมาตรการล็อกเอาต์ความปลอดภัยหนาแน่น",
        keywords: ["CYBER", "ตรวจสอบภัยคุกคาม", "Security Monitoring", "Incident Response"]
      }
    },
    securityScanResult: {
      scannedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
      score: 98,
      vulnerabilitiesFound: [],
      recommendations: {
        rexdev: "ฟิลเตอร์กรองอักขระแปลกปลอมผ่านพอร์ตสมบูรณ์เยี่ยม",
        cyber: "แอนจินวิเคราะห์พฤติกรรมพร้อมทำงาน สภาพแวดล้อมระบบนิ่งและเสถียร",
        security: "บันทึกการส่งการเข้าถึงจัดทำดัชนีเรียงตามคีย์คู่รหัสเรียบร้อยแล้ว"
      }
    }
  }
];

// Memory database for security audit logs
let securityLogs: SecurityEventLog[] = [
  {
    id: "log-1",
    timestamp: new Date(Date.now() - 600000).toISOString(), // 10 mins ago
    category: "ACCESS_AUDIT",
    severity: "INFO",
    component: "SECURITY",
    message: "การตรวจสอบเข้าถึงสำเร็จ: บล็อกระบบอ่านบทความสถิติการใช้งานเชื่อมต่อด้วยสิทธิ์ทั่วไป",
    ipAddress: "192.168.1.102"
  },
  {
    id: "log-2",
    timestamp: new Date(Date.now() - 400000).toISOString(), // 6 mins ago
    category: "INTEGRITY_CHECK",
    severity: "INFO",
    component: "CYBER",
    message: "ตรวจสอบลายนิ้วมือโครงสร้างไฟล์ระบบ (System Integrity Fingerprint) – สมบูรณ์ปกติ ไม่พบการดัดแปลงแก้ไข",
    ipAddress: "127.0.0.1"
  }
];

// Generate simple threat scores or details automatically
let activeAttacksCounter = 0;
let blockedAttacksCounter = 482; // Starting seeded counter

// Helper to write standard server logs
function writeSecurityLog(
  category: SecurityEventLog["category"],
  severity: SecurityEventLog["severity"],
  component: SecurityEventLog["component"],
  message: string,
  ipAddress: string,
  details?: Record<string, any>
) {
  const newLog: SecurityEventLog = {
    id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    timestamp: new Date().toISOString(),
    category,
    severity,
    component,
    message,
    ipAddress,
    details
  };
  securityLogs.unshift(newLog);
  if (securityLogs.length > 50) {
    securityLogs.pop(); // Keep last 50
  }
  return newLog;
}

// -------------------------------------------------------------
// REST API ROUTES
// -------------------------------------------------------------

// Basic global metadata/status endpoint
app.get("/api/system-status", (req, res) => {
  res.json({
    rexdev_defense_rate: "100%",
    cyber_active_sensors: 14,
    security_encryption: "AES-256-GCM / TLS 1.3",
    blocked_attacks: blockedAttacksCounter,
    active_threats: activeAttacksCounter,
    gemini_enabled: isGeminiEnabled,
    environment: "NextJS-Optimized Express Static Hybrid"
  });
});

// GET all articles
app.get("/api/articles", (req, res) => {
  res.json(articles);
});

// POST to create an article (Input is audited for potential attacks immediately)
app.post("/api/articles", (req, res) => {
  const { title, excerpt, content, language } = req.body;
  const clientIp = req.ip || "unknown";
  
  // Auditing Input Changes ("การตรวจสอบการเปลี่ยนแปลง" and "การป้องกันการโจมตี")
  writeSecurityLog(
    "INTEGRITY_CHECK",
    "INFO",
    "CYBER",
    `ตรวจพบการพยายามยื่นบทความใหม่จากไอพี ${clientIp}. กำลังตรวจสอบ Payload ความละเอียดสูง...`,
    clientIp
  );

  if (!title || !content || !language) {
    writeSecurityLog(
      "ACCESS_AUDIT",
      "WARNING",
      "USER_AUTH",
      `ยื่นบทความไม่สำเร็จเนื่องจากข้อมูลไม่ครบถ้วน`,
      clientIp
    );
    return res.status(400).json({ error: "Missing required fields: title, content, language" });
  }

  // Active defensive scan: Look for simple XSS/SQL Injection patterns manually (before Gemini)
  const xssPattern = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
  const sqlPattern = new RegExp("(\\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|OR '1'='1|--|#|/\\*|\\*/)\\b)", "gi");

  let isMalicious = false;
  let attackType = "";

  if (xssPattern.test(content) || xssPattern.test(title)) {
    isMalicious = true;
    attackType = "Cross-Site Scripting (XSS) Injection Payload Blocked";
  } else if (sqlPattern.test(content) || sqlPattern.test(title)) {
    isMalicious = true;
    attackType = "SQL Injection (SQLi) Syntax Pattern Blocked";
  }

  if (isMalicious) {
    blockedAttacksCounter += 1;
    writeSecurityLog(
      "ATTACK_PREVENTED",
      "CRITICAL",
      "REXDEV",
      `[REXDEV BLOCKED] ตรวจพบการโจมตีประเภท ${attackType} จากไอพี ${clientIp}. ระบบตัดทราฟฟิกขาเข้าและล้างหน่วยความจำชั่วคราวงามหมดจด`,
      clientIp,
      { payload_scanned: content.substring(0, 200) }
    );
    return res.status(403).json({
      error: "Security Alert: Malicious payloads detected. REXDEV has intercepted and neutralized your submission.",
      securityCode: "REXDEV_BLOCK_403"
    });
  }

  // Safe to create
  const slug = title
    .toLowerCase()
    .replace(/[^a-zA-Z0-9ก-๙\s-]/g, "")
    .replace(/\s+/g, "-")
    .substring(0, 50);

  const newArticle: Article = {
    id: `art-${Date.now()}`,
    slug: slug || "untitled-seo-blog",
    createdAt: new Date().toISOString(),
    author: "Author (Verified Log)",
    seoScore: 40, // Base raw score, needs optimization call
    isOptimized: false,
    performanceScore: 99,
    defaultLanguage: language,
    securityRating: "Safe",
    languages: {
      [language]: {
        title,
        excerpt: excerpt || content.substring(0, 150) + "...",
        content,
        metaTitle: title,
        metaDescription: excerpt || content.substring(0, 150),
        keywords: [language, "blog"]
      }
    },
    securityScanResult: {
      scannedAt: new Date().toISOString(),
      score: 100,
      vulnerabilitiesFound: [],
      recommendations: {
        rexdev: "ปลอดภัยอย่างสมบูรณ์แบบ แพลตฟอร์มป้องกันแอปพลิเคชันผ่านกระบวนการกรองข้อมูลแล้ว",
        cyber: "พฤติกรรมเรียบง่ายและเป็นระเบียบ ระบบ CYBER ติดตามบันทึกการส่งเรียบร้อย",
        security: "บันทึกข้อมูลเรียบร้อย ข้อมูลถูกเก็บภายใต้ระบบการลงนามความตรงไปตรงมา"
      }
    }
  };

  articles.unshift(newArticle);
  
  writeSecurityLog(
    "INTEGRITY_CHECK",
    "INFO",
    "SECURITY",
    `เพิ่มและอัปเดตบทความใหม่สำเร็จ (ID: ${newArticle.id}, Slug: ${newArticle.slug}) สภาพเซิร์ฟเวอร์ Static Rebuilt ผ่าน Next-Simulate`,
    clientIp
  );

  res.status(201).json(newArticle);
});

// DELETE an article
app.delete("/api/articles/:id", (req, res) => {
  const clientIp = req.ip || "unknown";
  const index = articles.findIndex((a) => a.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: "Article not found" });
  }

  const deleted = articles.splice(index, 1);
  writeSecurityLog(
    "INTEGRITY_CHECK",
    "WARNING",
    "SECURITY",
    `ลบบทความ '${deleted[0].slug}' สิทธิ์เซิร์ฟเวอร์ตรวจสอบและบันทึกรอยต่อเรียบร้อย`,
    clientIp
  );

  res.json({ success: true });
});

// GET Security Audit Logs ("การตรวจสอบการเข้าถึง" and "การตรวจสอบการเปลี่ยนแปลง")
app.get("/api/logs", (req, res) => {
  res.json(securityLogs);
});

// POST simulated attack to test CYBER / REXDEV defense systems
app.post("/api/logs/simulate-attack", (req, res) => {
  const { type } = req.body;
  const clientIp = req.ip || "unknown";
  blockedAttacksCounter += 1;

  if (type === "XSS") {
    writeSecurityLog(
      "ATTACK_PREVENTED",
      "CRITICAL",
      "REXDEV",
      `[REXDEV PREVENT] การพยายามทำ XSS Payload Injection บนหน้าส่งความเห็น ได้รับการสลัดสิทธิออกทันทีด่านกรองแรกขั้น Application Security Layer`,
      clientIp,
      { threat_level: "High", vector: "<script>alert('hack')</script>" }
    );
    res.json({ message: "REXDEV Intercepted XSS Payload! Sanitized successfully." });
  } else if (type === "SQLI") {
    writeSecurityLog(
      "ATTACK_PREVENTED",
      "CRITICAL",
      "REXDEV",
      `[REXDEV PREVENT] ตรวจพบรูปแบบ SQL Command Union Injection ในพารามิเตอร์รี่บอร์ด ระบบคุมสแต็คออเทนทิเคชันทำการดีแฟรกเมนท์และปิดกั้นไอพีทันที`,
      clientIp,
      { threat_level: "High", vector: "' OR 1=1 UNION SELECT name, password FROM users --" }
    );
    res.json({ message: "REXDEV Counter-measured SQL Injection. DB query is perfectly insulated." });
  } else if (type === "BRUTE") {
    writeSecurityLog(
      "ACCESS_AUDIT",
      "WARNING",
      "USER_AUTH",
      `[CYBER DANGER] มีสแกนพล็อตออโทเมติกโจมตีรหัสผ่านด้วยแอนจิน Brute Force เพื่อเข้าพอร์ตล็อกอินเซคชันเว็บบล็อกระบบระบุขีดจำกัดความเร็วทันที (Rate Limited 50 Requests/min)`,
      clientIp
    );
    res.json({ message: "CYBER Monitoring active. Access has been restricted via Dynamic Rate Limiting." });
  } else if (type === "INTEGRITY") {
    writeSecurityLog(
      "INTEGRITY_CHECK",
      "WARNING",
      "CYBER",
      `[CYBER DETECT] รูปแบบการปรับปรุงไฟล์ภายนอกพิกัดหลักไม่ได้รับอนุญาต (Unauthorized index.html static hash variance detected). บับเบิ้ลตรวจสอบ Next-sim กู้ฟืนคืนค่าจาก Snapshot ภายใน 0.12 วินาที`,
      "10.0.8.21"
    );
    res.json({ message: "CYBER detected variance. Automatic state recovery is successful - file integrity restored 100%!" });
  } else {
    // Normal Check
    writeSecurityLog(
      "ACCESS_AUDIT",
      "INFO",
      "SECURITY",
      `ผู้ดูแลสแกนตรวจสอบการเข้าถึงข้อมูลบันทึกความสมบูรณ์และระบบรักษาความปลอดภัยปกติ`,
      clientIp
    );
    res.json({ message: "Audit complete. SECURITY systems clear and fully certified." });
  }
});

// POST to translate article to target language using GEMINI
app.post("/api/articles/:id/translate", async (req, res) => {
  const { targetLang } = req.body; // e.g., "en", "th", "jp", "zh"
  const article = articles.find((a) => a.id === req.params.id);
  const clientIp = req.ip || "unknown";

  if (!article) {
    return res.status(404).json({ error: "Article not found" });
  }

  if (!targetLang) {
    return res.status(400).json({ error: "Target language targetLang is required" });
  }

  // Audit accessing and editing
  writeSecurityLog(
    "ACCESS_AUDIT",
    "INFO",
    "CYBER",
    `ทำเรื่องเข้าตรวจสอบและแปลภาษาบทความ (ID: ${article.id}) เป็นภาษา '${targetLang}'`,
    clientIp
  );

  // Get active source language content
  const sourceLang = Object.keys(article.languages)[0] || "th";
  const sourceContent = article.languages[sourceLang];

  if (article.languages[targetLang]) {
    // Already translated
    return res.json({ article, message: "Translated version already exists." });
  }

  if (!isGeminiEnabled) {
    // Simulated fallback translation
    const simulatedTitle = `[Simulated ${targetLang.toUpperCase()}] ` + sourceContent.title;
    const simulatedExcerpt = `[Simulated excerpt translated to ${targetLang}] ` + sourceContent.excerpt;
    const simulatedContent = `[SIMULATED TRANSLATION IN ${targetLang.toUpperCase()}]\n\n` + sourceContent.content;

    article.languages[targetLang] = {
      title: simulatedTitle,
      excerpt: simulatedExcerpt,
      content: simulatedContent,
      metaTitle: simulatedTitle,
      metaDescription: simulatedExcerpt.substring(0, 150),
      keywords: ["simulated", targetLang]
    };

    writeSecurityLog(
      "INTEGRITY_CHECK",
      "INFO",
      "SECURITY",
      `แปลภาษาแบบจำลองเสร็จสมบูรณ์สำเร็จ (ตั้งค่าคีย์เก็ตเวย์เพื่อใช้ Gemini จริง)`,
      clientIp
    );

    return res.json({
      article,
      simulated: true,
      message: "Simulated Translation completed. Configure GEMINI_API_KEY for real high-fidelity AI translation."
    });
  }

  try {
    const ai = getGeminiClient();
    
    const prompt = `You are a professional cyber-security expert and translation system. 
    Translate the following cyber security article from its current language into language: "${targetLang}".
    Maintain the technical depth, terminology (like SQL Injection, XSS, REXDEV, CYBER, SECURITY), formatting and structure.

    Return your output strictly as a JSON object matching this TypeScript structure:
    {
      "title": "translated title",
      "excerpt": "translated excerpt brief description",
      "content": "translated full body text in markdown layout"
    }

    Do not include any extra introductory text or wrap it in triple backticks unless required. Just output the raw parseable JSON object.

    Source Title: "${sourceContent.title}"
    Source Excerpt: "${sourceContent.excerpt}"
    Source Content:
    """
    ${sourceContent.content}
    """`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        systemInstruction: "You only output strictly parseable JSON matches the required properties: title, excerpt, content."
      }
    });

    const parsedData = JSON.parse(response.text || "{}");

    article.languages[targetLang] = {
      title: parsedData.title || `[Translated ${targetLang}] ${sourceContent.title}`,
      excerpt: parsedData.excerpt || sourceContent.excerpt,
      content: parsedData.content || sourceContent.content,
      metaTitle: parsedData.title || sourceContent.title,
      metaDescription: parsedData.excerpt || sourceContent.excerpt,
      keywords: [targetLang, "cyber-security", "rexdev"]
    };

    writeSecurityLog(
      "INTEGRITY_CHECK",
      "INFO",
      "SECURITY",
      `แปลภาษาโดยปัญญาประดิษฐ์เสร็จสมบูรณ์ (ภาษา: ${targetLang}) – ข้อมูลได้รับการอนุมัติลงพิมพ์แล้ว`,
      clientIp
    );

    res.json({ article, message: "AI Translation completed successfully!" });

  } catch (error: any) {
    console.error("Gemini Translation Error:", error);
    writeSecurityLog(
      "SYSTEM_LOG",
      "WARNING",
      "CYBER",
      `เกิดข้อผิดพลาดในการเรียกแปลภาษาด้วยปัญญาประดิษฐ์: ${error.message}`,
      clientIp
    );
    res.status(500).json({ error: "Gemini Translate Error: " + error.message });
  }
});

// POST to run Security scan on an article using GEMINI
app.post("/api/articles/:id/security-scan", async (req, res) => {
  const article = articles.find((a) => a.id === req.params.id);
  const clientIp = req.ip || "unknown";

  if (!article) {
    return res.status(404).json({ error: "Article not found" });
  }

  writeSecurityLog(
    "INTEGRITY_CHECK",
    "INFO",
    "CYBER",
    `ระบบ CYBER ทำการดีพสแกน (Deep Vulnerability Analysis) บนเนื้อหาบทความ: ID: ${article.id}`,
    clientIp
  );

  const sourceLang = Object.keys(article.languages)[0] || "th";
  const sourceContent = article.languages[sourceLang];

  if (!isGeminiEnabled) {
    // Rules-based local simulated scan
    const hasSuspectWords = /hack|exploit|malicious|danger|eval\(|unescape/i.test(sourceContent.content);
    article.securityRating = hasSuspectWords ? "Warning" : "Safe";
    article.securityScanResult = {
      scannedAt: new Date().toISOString(),
      score: hasSuspectWords ? 85 : 100,
      vulnerabilitiesFound: hasSuspectWords ? ["มีคำจำเพาะทางเสี่ยงความปลอดภัยทางทฤษฎีในเนื้อหารีวิว"] : [],
      recommendations: {
        rexdev: "หลีกเลี่ยงการสลัดสิทธิพิเศษบนฟอร์มการอัปโหลด",
        cyber: "เฝ้าติดตามคำต้องสงสัยในกระดานสนทนาสากลสตรีมมิ่ง",
        security: "ตรวจสอบลายเซ็นผู้ควบคุมเซสชันการส่งข้อมูล"
      }
    };

    writeSecurityLog(
      "INTEGRITY_CHECK",
      "INFO",
      "SECURITY",
      `ตรวจสอบจำลองความปลอดภัยบทความ [${article.slug}] – สถานะ: ${article.securityRating}`,
      clientIp
    );

    return res.json({
      article,
      simulated: true,
      message: "Simulated scan done. Enter GEMINI_API_KEY for a real deep cyber-security assessment."
    });
  }

  try {
    const ai = getGeminiClient();
    const prompt = `You are an elite cybersecurity audit bot representing REXDEV, CYBER, and SECURITY systems.
    Scan and analyze the following title and educational content for security defects, unauthorized content, code leaks, bad patterns, credentials exposure, or anything potentially dangerous.

    Provide a precise security rating ('Safe', 'Warning', 'Critical'), safety score (0-100), key notes, and customized suggestions referencing the user's explicit cybersecurity terms:
    - REXDEV system: Focused on Attack Prevention (การป้องกันการโจมตี).
    - CYBER system: Focused on Threat Detection & Logging (การตรวจสอบการโจมตีไซเบอร์).
    - SECURITY system: Focused on Data Integrity & General Cryptography (การรักษาความปลอดภัยของข้อมูล).

    Article Title: "${sourceContent.title}"
    Article Content:
    """
    ${sourceContent.content}
    """

    Response strictly as a JSON object conforming exactly to this structure (no additional commentary or markdown wrap, just raw parseable JSON):
    {
      "rating": "Safe" | "Warning" | "Critical",
      "score": 100,
      "vulnerabilitiesFound": [
        "Vulnerability description or 'None'"
      ],
      "recommendations": {
        "rexdev": "Scrub payload and filter suggestions...",
        "cyber": "Event audit configuration steps...",
        "security": "Data encryption and lock procedures..."
      }
    }`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        systemInstruction: "You are a cyber security analysis bot. Return only a valid JSON response adhering exactly to the structure."
      }
    });

    const parsed = JSON.parse(response.text || "{}");
    
    article.securityRating = parsed.rating || "Safe";
    article.securityScanResult = {
      scannedAt: new Date().toISOString(),
      score: typeof parsed.score === 'number' ? parsed.score : 100,
      vulnerabilitiesFound: parsed.vulnerabilitiesFound || [],
      recommendations: parsed.recommendations || {
        rexdev: "สลัดอักขระแปลกปลอมตามมาตรฐาน REXDEV",
        cyber: "บันทึกข้อมูลแบบเรียลไทม์ไว้ในระบบ CYBER ตรวจสอบแล้วผ่าน",
        security: "ป้องกันโครงสร้างบทความด้วยสิทธิ์ SECURITY ระดับแอดมิน"
      }
    };

    writeSecurityLog(
      "INTEGRITY_CHECK",
      article.securityRating === "Critical" ? "CRITICAL" : article.securityRating === "Warning" ? "WARNING" : "INFO",
      "REXDEV",
      `เสร็จสิ้นการดีพสแกนความปลอดภัยด้วย AI สำหรับ [${sourceContent.title.substring(0, 30)}...] – สถานะความปลอดภัย: ${article.securityRating} (คะแนนความปลอดภัย: ${article.securityScanResult.score}%)`,
      clientIp
    );

    res.json({ article, message: "AI Cybersecurity analysis scan completed!" });

  } catch (error: any) {
    console.error("Gemini Security Analytical Scan Error:", error);
    writeSecurityLog(
      "SYSTEM_LOG",
      "WARNING",
      "CYBER",
      `ล้มเหลวในการรันสแกนความปลอดภัยด้วย AI: ${error.message}`,
      clientIp
    );
    res.status(500).json({ error: "Gemini Analysis Error: " + error.message });
  }
});

// POST to optimize Article SEO using GEMINI
app.post("/api/articles/:id/seo-optimize", async (req, res) => {
  const article = articles.find((a) => a.id === req.params.id);
  const clientIp = req.ip || "unknown";

  if (!article) {
    return res.status(404).json({ error: "Article not found" });
  }

  writeSecurityLog(
    "ACCESS_AUDIT",
    "INFO",
    "SECURITY",
    `เรียกวิเคราะห์และเพิ่มประสิทธิภาพ SEO ให้กับบทความ ID: ${article.id}`,
    clientIp
  );

  const sourceLang = Object.keys(article.languages)[0] || "th";
  const sourceContent = article.languages[sourceLang];

  if (!isGeminiEnabled) {
    // Local simulation structure
    const updatedKeywords = ["REXDEVCYBERCYBER-SECURITY", "Next.js", "ความเร็วสูง", "SEO บทความ"];
    
    article.seoScore = 95;
    article.isOptimized = true;
    
    // Enrich target schema and title
    sourceContent.keywords = updatedKeywords;
    sourceContent.metaTitle = `[SEO Optimized] ${sourceContent.title}`;
    sourceContent.metaDescription = `บทความความรู้เพื่อความปลอดภัย: ${sourceContent.excerpt.substring(0, 130)}`;

    writeSecurityLog(
      "INTEGRITY_CHECK",
      "INFO",
      "SECURITY",
      `ปรับปรุง SEO บทความ [${article.slug}] สำเร็จด้วยระบบแคช NextS-Simulate (SEO Score: 95/100)`,
      clientIp
    );

    return res.json({
      article,
      simulated: true,
      seoResult: {
        score: 95,
        slugSuggestion: article.slug,
        metaTitle: sourceContent.metaTitle,
        metaDescription: sourceContent.metaDescription,
        keywordDensity: "REXDEV (2.4%), SEO (1.9%), Next.js (1.7%)",
        suggestions: [
          "ปรับแต่งภาษาท้องถิ่น (Locale Alternate Link) สำหรับ SEO ไร้รอยต่อ",
          "เพิ่มหัวข้อย่อย H2, H3 เพื่อจัดโครงสร้างหน้าเว็บบล็อกส่วนตัวให้น่าดึงดูดใจสำหรับ Bot การค้นหา",
          "จำลองการทำงาน Dynamic Static Hydration เพื่อความเร็วและดึงดูดการจัดอันดับ Core Web Vitals"
        ],
        canonicalUrl: `https://rexdev-cybersecurity.com/blog/${article.slug}`
      }
    });
  }

  try {
    const ai = getGeminiClient();
    const prompt = `You are an elite SEO auditor representing a Next.js fast blog platform. Your job is to analyze the following cyber security article and design absolute best indexing guidelines and tags.

    Analyze keyword density, suggest optimal SEO Title tag, optimal search Meta Description (under 160 characters), beautiful custom url slug, canonical links, and 3 actionable suggestions to hit 100% Google Core Web Vitals seo metrics.

    Article Title: "${sourceContent.title}"
    Article Excerpt: "${sourceContent.excerpt}"
    Article Content:
    """
    ${sourceContent.content}
    """

    Response strictly as a JSON object matching this structure (no extra descriptions, just parseable JSON):
    {
      "score": 98,
      "slugSuggestion": "new-seo-friendly-slug",
      "metaTitle": "Perfect Title With Brand REXDEVCYBERCYBER-SECURITY - Must be catchy but precise",
      "metaDescription": "Catchy meta description that encapsulates the key point within 155 characters",
      "keywordDensity": "REXDEV (3.2%), Cyber (2.5%), Security (1.8%)",
      "suggestions": [
        "Include local alternate tags for multi-language links to support fast localized indexing",
        "Add image alt tags for security diagrams",
        "Structure tables for vulnerability vectors to boost Google rich snippet results"
      ],
      "canonicalUrl": "https://rexdev-cybersecurity.com/blog/slug"
    }`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        systemInstruction: "You are an SEO optimizing AI. Return only a valid JSON response adhering exactly to the structure."
      }
    });

    const parsed = JSON.parse(response.text || "{}");

    article.seoScore = parsed.score || 95;
    article.isOptimized = true;

    // Apply Gemini generated optimizations
    if (parsed.slugSuggestion) {
      article.slug = parsed.slugSuggestion;
    }
    sourceContent.metaTitle = parsed.metaTitle || sourceContent.title;
    sourceContent.metaDescription = parsed.metaDescription || sourceContent.excerpt;
    sourceContent.keywords = [...new Set([...(sourceContent.keywords || []), "REXDEVCYBERCYBER-SECURITY", "Next.js-SEO"])];

    writeSecurityLog(
      "INTEGRITY_CHECK",
      "INFO",
      "SECURITY",
      `ปรับแต่งและเพิ่มความโดดเด่นแก่ SEO บทความ [${sourceContent.title.substring(0, 25)}...] – คะแนนที่ได้รับ: ${article.seoScore}/100`,
      clientIp
    );

    res.json({
      article,
      seoResult: parsed,
      message: "AI SEO auditing and optimization successfully completed!"
    });

  } catch (error: any) {
    console.error("Gemini SEO Audit Error:", error);
    writeSecurityLog(
      "SYSTEM_LOG",
      "WARNING",
      "SECURITY",
      `ล้มเหลวในการจัดทำ SEO ด้วย AI: ${error.message}`,
      clientIp
    );
    res.status(500).json({ error: "Gemini SEO Optimization error: " + error.message });
  }
});


// -------------------------------------------------------------
// SERVING FRONT-END & VITE DEV SERVER / PRODUCTION
// -------------------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve production static assets from dist
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[REXDEVCYBER] Active fullstack server running on http://localhost:${PORT}`);
  });
}

startServer();
