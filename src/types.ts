/**
 * Shared Types for REXDEVCYBERCYBER-SECURITY Platform
 */

export interface Article {
  id: string;
  slug: string;
  createdAt: string;
  author: string;
  seoScore: number; // 0 to 100
  isOptimized: boolean;
  performanceScore: number; // simulated Next.js performance
  
  // Multi-language content
  languages: {
    [langCode: string]: {
      title: string;
      excerpt: string;
      content: string;
      metaTitle: string;
      metaDescription: string;
      keywords: string[];
    };
  };
  
  defaultLanguage: string;
  securityRating: "Safe" | "Warning" | "Critical";
  securityScanResult?: {
    scannedAt: string;
    score: number; // 0-100 safety score
    vulnerabilitiesFound: string[];
    recommendations: {
      rexdev: string; // Prevention action
      cyber: string;  // Monitoring action
      security: string; // General integrity action
    };
  };
}

export interface SecurityEventLog {
  id: string;
  timestamp: string;
  category: "ACCESS_AUDIT" | "INTEGRITY_CHECK" | "ATTACK_PREVENTED" | "SYSTEM_LOG";
  severity: "INFO" | "WARNING" | "CRITICAL";
  component: "REXDEV" | "CYBER" | "SECURITY" | "USER_AUTH";
  message: string;
  ipAddress: string;
  details?: Record<string, any>;
}

export interface SEORecommendation {
  score: number;
  slugSuggestion: string;
  metaTitle: string;
  metaDescription: string;
  keywordDensity: string;
  suggestions: string[];
  canonicalUrl: string;
}
