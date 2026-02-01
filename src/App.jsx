
import React, { useEffect, useMemo, useState } from "react";
import {
  Download,
  Loader2,
  CheckCircle2,
  Sparkles,
  Zap,
  RefreshCw,
  Monitor,
  Smartphone,
  Layout,
  Wand2,
  Settings2,
  ChevronRight,
  BrainCircuit,
  MessageSquareText,
  FileText,
  FileCode,
  Pencil,
  X,
  Palette,
  Eye,
  EyeOff,
  Save,
  Copy,
  HelpCircle,
  ExternalLink,
  Scale,
  GitCompare
} from "lucide-react";

/**
 * Studio Gen V4.1
 * - AI 설계 + 마스터 마크다운
 * - 테마 엔진, 실시간 개별 편집
 * - PDF / PPTX 고해상도 익스포트
 */

const STORAGE_KEY = "magic-slide-v4";

const THEMES = {
  modern: {
    name: "Modern Blue",
    primary: "#FFFFFF",
    secondary: "#0EA5E9",
    accent: "#FACC15",
    text: "#0F172A",
    muted: "#64748B",
    gradient: ["#F8FAFC", "#E2E8F0"],
    cardShadow: "rgba(15, 23, 42, 0.18)"
  },
  dark: {
    name: "Dark Pro",
    primary: "#0B1220",
    secondary: "#38BDF8",
    accent: "#FB7185",
    text: "#E2E8F0",
    muted: "#94A3B8",
    gradient: ["#0F172A", "#1F2937"],
    cardShadow: "rgba(0, 0, 0, 0.55)"
  },
  minimal: {
    name: "Minimalist",
    primary: "#FFFFFF",
    secondary: "#111827",
    accent: "#CBD5F5",
    text: "#1F2937",
    muted: "#9CA3AF",
    gradient: ["#FFFFFF", "#F1F5F9"],
    cardShadow: "rgba(15, 23, 42, 0.1)"
  }
};

const DEFAULT_MARKDOWN = `## Studio Gen V4.0 <!-- layout: title | accent: #0EA5E9 -->
AI 기반 엔터프라이즈 프레젠테이션 스튜디오

## 문제 정의 <!-- layout: bullets -->
- 사내 PPT 제작 시간이 평균 3.2일 이상 소요
- 디자인 가이드 불일치로 통일감 부족
- 고해상도 출력과 재편집 과정이 번거로움

## 핵심 지표 <!-- layout: metric | accent: #F97316 -->
85%

## 비주얼 스냅샷 <!-- layout: visual | image: https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1600&q=80 -->
테마 엔진과 자동 레이아웃으로 1600px 와이드 작업 환경을 제공합니다.

## 고객의 목소리 <!-- layout: quote | accent: #14B8A6 -->
"단 한 번의 클릭으로 모든 슬라이드가 통일되는 경험은 혁신적이었습니다."
- Director, Strategy Lab`;

const MODEL_ID = "gemini-3-flash-preview";

const generateImage = async (prompt) => {
  const seed = Math.floor(Math.random() * 1000000);
  const encoded = encodeURIComponent(prompt + " high quality, design asset, vector style, minimal, 8k");
  // Using Pollinations.ai for instant, free generation (Flux/SDXL based)
  return `https://image.pollinations.ai/prompt/${encoded}?width=1024&height=1024&nologo=true&seed=${seed}`;
};

const TEMPLATES = [
  {
    id: "auto",
    label: "자동 (Auto)",
    icon: Sparkles,
    desc: "AI가 내용에 맞춰 최적의 레이아웃을 자동 선택합니다.",
    prompt: "사용자의 아이디어를 분석하여 가장 적절한 슬라이드 구성을 제안하라."
  },
  {
    id: "swot",
    label: "SWOT 분석",
    icon: Layout,
    desc: "강점, 약점, 기회, 위협을 4분면으로 시각화합니다.",
    prompt: `SWOT 분석 전문가로서 내용을 분석하라. 
반드시 다음 구조를 따라야 한다:
## SWOT 분석 <!-- layout: swot | accent: #3B82F6 -->
- Strength: [강점 내용]
- Weakness: [약점 내용]
- Opportunity: [기회 내용]
- Threat: [위협 내용]`
  },
  {
    id: "timeline",
    label: "3단계 프로세스",
    icon: ChevronRight,
    desc: "순서가 있는 3단계 진행 과정을 타임라인으로 표현합니다.",
    prompt: `프로세스 설계자로서 내용을 3단계로 요약하라.
반드시 다음 구조를 따라야 한다:
## 프로세스 로드맵 <!-- layout: timeline | accent: #10B981 -->
- Step 1: [첫 번째 단계]
- Step 2: [두 번째 단계]
- Step 3: [세 번째 단계]`
  },
  {
    id: "feature",
    label: "3-Feature Grid",
    icon: Zap,
    desc: "3가지 핵심 기능을 강조하는 그리드 레이아웃입니다.",
    prompt: `제품 기획자로서 3가지 핵심 요소를 도출하라.
반드시 다음 구조를 따라야 한다:
## 핵심 기능 <!-- layout: feature | accent: #8B5CF6 -->
- Feature 1: [핵심 기능 1]
- Feature 2: [핵심 기능 2]
- Feature 3: [핵심 기능 3]`
  },
  {
    id: "hero",
    label: "자동 (Auto)",
    icon: Sparkles,
    desc: "AI가 내용에 맞춰 최적의 레이아웃을 자동 선택합니다.",
    prompt: "사용자의 아이디어를 분석하여 가장 적절한 슬라이드 구성을 제안하라."
  },
  {
    id: "swot",
    label: "SWOT 분석",
    icon: Layout,
    desc: "강점, 약점, 기회, 위협을 4분면으로 시각화합니다.",
    prompt: `SWOT 분석 전문가로서 내용을 분석하라. 
반드시 다음 구조를 따라야 한다:
## SWOT 분석 <!-- layout: swot | accent: #3B82F6 -->
- Strength: [강점 내용]
- Weakness: [약점 내용]
- Opportunity: [기회 내용]
- Threat: [위협 내용]`
  },
  {
    id: "timeline",
    label: "3단계 프로세스",
    icon: ChevronRight,
    desc: "순서가 있는 3단계 진행 과정을 타임라인으로 표현합니다.",
    prompt: `프로세스 설계자로서 내용을 3단계로 요약하라.
반드시 다음 구조를 따라야 한다:
## 프로세스 로드맵 <!-- layout: timeline | accent: #10B981 -->
- Step 1: [첫 번째 단계]
- Step 2: [두 번째 단계]
- Step 3: [세 번째 단계]`
  },
  {
    id: "feature",
    label: "3-Feature Grid",
    icon: Zap,
    desc: "3가지 핵심 기능을 강조하는 그리드 레이아웃입니다.",
    prompt: `제품 기획자로서 3가지 핵심 요소를 도출하라.
반드시 다음 구조를 따라야 한다:
## 핵심 기능 <!-- layout: feature | accent: #8B5CF6 -->
- Feature 1: [핵심 기능 1]
- Feature 2: [핵심 기능 2]
- Feature 3: [핵심 기능 3]`
  },
  {
    id: "hero",
    label: "임팩트 타이틀",
    icon: Scale,
    desc: "강렬한 인상을 주는 대형 타이틀 레이아웃입니다.",
    prompt: `크리에이티브 디렉터로서 강렬한 문구를 작성하라.
**CRITICAL: 리스트를 한 줄에 나열하지 말고 반드시 줄바꿈하라.**
반드시 다음 구조를 따라야 한다:
## [메인 헤드카피] <!-- layout: title | accent: #F43F5E -->
[IMAGE: A cinematic, high-contrast abstract background representing the concept]
- Sub: [서브 카피]
- Author: [발표자/팀명]`
  },
  {
    id: "versus",
    label: "A vs B 비교",
    icon: GitCompare,
    desc: "두 가지 대상을 비교 대조하는 레이아웃입니다.",
    prompt: `분석가로서 두 대상을 비교하라.
**CRITICAL: 리스트를 한 줄에 나열하지 말고 반드시 줄바꿈하라.**
반드시 다음 구조를 따라야 한다:
## 비교 분석 <!-- layout: versus | accent: #8B5CF6 -->
- A: [대상 A의 특징]
- B: [대상 B의 특징]
- Result: [결론/시사점]`
  }
];

// Content Cleaning Utility (Safety Net)
const cleanContentLines = (rawLines) => {
  return rawLines.flatMap(line => {
    // 1. Split bullet points that are stuck together (e.g. "Item 1 • Item 2")
    if (line.includes("•") || line.includes("·")) {
       return line.split(/[•·]/).map(p => p.trim()).filter(p => p.length > 0).map(p => `- ${p}`);
    }
    // 2. Recover proper markdown list syntax if missing space (e.g. "-Item")
    if (line.match(/^-\S/)) {
      return [`- ${line.substring(1)}`];
    }
    return [line];
  });
};

const STATUS_STEPS = [
  { key: "idle", label: "대기" },
  { key: "analyzing", label: "AI 설계" },
  { key: "processing", label: "렌더링" },
  { key: "complete", label: "완료" }
];

const loadScript = (src) =>
  new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });

const parseDirectives = (text) => {
  const directives = { layout: "bullets" };
  const matches = text.matchAll(/<!--([\s\S]*?)-->/g);
  for (const match of matches) {
    const body = match[1];
    body
      .split("|")
      .map((chunk) => chunk.trim())
      .forEach((chunk) => {
        const [key, ...rest] = chunk.split(":");
        if (!key || rest.length === 0) return;
        const value = rest.join(":").trim();
        const normalizedKey = key.trim().toLowerCase();
        directives[normalizedKey] = value;
      });
  }
  if (directives.layout) directives.layout = directives.layout.toLowerCase();
  return directives;
};

const cleanMarkdown = (text) => {
  if (!text) return "";
  return text.replace(/\*\*(.*?)\*\*/g, "$1").replace(/\*(.*?)\*/g, "$1").trim();
};

const roundRectPath = (ctx, x, y, w, h, r) => {
  const radius = Math.min(r, w / 2, h / 2);
  if (ctx.roundRect) {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, radius);
    return;
  }
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
};

const wrapTextToLines = (ctx, text, maxWidth) => {
  const t = cleanMarkdown(text).replace(/\s+/g, " ");
  if (!t) return [];
  const words = t.split(" ");
  const lines = [];
  let line = "";
  for (let i = 0; i < words.length; i++) {
    const test = line ? `${line} ${words[i]}` : words[i];
    if (ctx.measureText(test).width <= maxWidth) {
      line = test;
    } else {
      if (line) lines.push(line);
      line = words[i];
    }
  }
  if (line) lines.push(line);
  return lines;
};

const fitTextBlock = ({
  ctx,
  text,
  box,
  maxFontPx,
  minFontPx,
  lineHeightRatio,
  align = "left",
  valign = "top",
  fontFamily = "\"Space Grotesk\"",
  fontWeight = 700
}) => {
  const { x, y, w, h } = box;
  let fontPx = maxFontPx;
  let lines = [];
  while (fontPx >= minFontPx) {
    ctx.font = `${fontWeight} ${fontPx}px ${fontFamily}`;
    lines = wrapTextToLines(ctx, text, w);
    if (lines.length * fontPx * lineHeightRatio <= h) break;
    fontPx -= 2;
  }
  ctx.textAlign = align;
  ctx.textBaseline = "top";
  const lh = fontPx * lineHeightRatio;
  let startY = y;
  if (valign === "middle") startY = y + (h - lines.length * lh) / 2;
  if (valign === "bottom") startY = y + (h - lines.length * lh);
  const lineX = align === "left" ? x : align === "center" ? x + w / 2 : x + w;
  lines.forEach((l, i) => ctx.fillText(l, lineX, startY + i * lh));
  return { fontPx, lines };
};

const normalizeBullets = (contentLines) =>
  contentLines
    .filter((line) => line.trim())
    .map((line) => {
      if (line.startsWith("-")) return `• ${line.replace(/^[-\s]+/, "").trim()}`;
      if (line.startsWith("•")) return line;
      return `• ${line.trim()}`;
    })
    .join("\n");

const getSlideSize = (layoutMode) =>
  layoutMode === "horizontal" ? { w: 1920, h: 1080 } : { w: 1080, h: 1920 };

const buildSections = (markdownText) => {
  const raw = (markdownText ?? "").trim();
  if (!raw) return [];
  const blocks = raw.split(/\n(?=##\s+)/g);
  return blocks
    .map((sec, idx) => {
      const lines = sec.trim().split("\n");
      const titleLine = lines.find((line) => line.trim().startsWith("##")) || "## Untitled";
      const title = titleLine.replace(/^##\s*/g, "").trim();
      let contentLines = lines
        .filter((line) => !line.trim().startsWith("##"))
        .filter((line) => !line.trim().startsWith("<!--"));
      
      // Extract Image Prompts
      let imagePrompt = null;
      contentLines = contentLines.filter(line => {
        const match = line.match(/^\[IMAGE:\s*(.*?)\]/);
        if (match) {
           imagePrompt = match[1];
           return false; // Remove prompt line from visible content
        }
        return true;
      });

      // Apply Safety Net Cleaning
      contentLines = cleanContentLines(contentLines);

      const props = parseDirectives(sec);
      const metricMatch = sec.match(/(\d+(?:\.\d+)?%)/);
      return {
        id: idx,
        title,
        content: contentLines,
        layout: props.layout || "bullets",
        props,
        metric: metricMatch ? metricMatch[1] : null,
        imagePrompt, // Store the prompt
        imageUrl: null, // To be filled later
        raw: sec.trim()
      };
    })
    .filter((section) => section.title || section.content.length > 0);
};

const loadImage = (url) =>
  new Promise((resolve) => {
    if (!url) {
      resolve(null);
      return;
    }
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = url;
  });

export default function App() {
  const [themeKey, setThemeKey] = useState("modern");
  const [layoutMode, setLayoutMode] = useState("horizontal");
  const [selectedTemplate, setSelectedTemplate] = useState("auto");

  const [targetSlideCount, setTargetSlideCount] = useState("auto");
  const [designConcept, setDesignConcept] = useState("");
  const [userInput, setUserInput] = useState("");
  const [markdownText, setMarkdownText] = useState("");
  const [slides, setSlides] = useState([]); // New state for rich slide data (images etc)
  const [status, setStatus] = useState("idle");
  const [progress, setProgress] = useState({ current: 0, total: 0, label: "" });
  const [previewImages, setPreviewImages] = useState([]);
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [editDraft, setEditDraft] = useState("");
  const [apiKey, setApiKey] = useState(import.meta.env.VITE_GEMINI_API_KEY || "");
  const [showKey, setShowKey] = useState(false);
  const [exportQuality, setExportQuality] = useState(2);
  const [accentOverride, setAccentOverride] = useState("");
  const [exporting, setExporting] = useState(null);
  const [exportProgress, setExportProgress] = useState({ current: 0, total: 0 });
  const [libReady, setLibReady] = useState(false);
  const [error, setError] = useState("");

  const theme = useMemo(() => {
    const base = THEMES[themeKey] || THEMES.modern;
    if (!accentOverride) return base;
    return { ...base, secondary: accentOverride };
  }, [themeKey, accentOverride]);

  const sections = useMemo(() => buildSections(markdownText), [markdownText]);

  useEffect(() => {
    let active = true;
    Promise.all([
      loadScript("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"),
      loadScript("https://cdn.jsdelivr.net/npm/pptxgenjs@3.12.0/dist/pptxgen.bundle.js")
    ])
      .then(() => {
        if (active) setLibReady(true);
      })
      .catch(() => {
        if (active) setError("PDF/PPTX 라이브러리 로딩에 실패했습니다.");
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      if (saved.themeKey) setThemeKey(saved.themeKey);
      if (saved.layoutMode) setLayoutMode(saved.layoutMode);
      if (saved.userInput) setUserInput(saved.userInput);
      if (saved.markdownText) {
        setMarkdownText(saved.markdownText);
      } else {
        // Load default sample if no saved text exists
        setMarkdownText(DEFAULT_MARKDOWN);
      }
      if (saved.apiKey) setApiKey(saved.apiKey);
      if (saved.exportQuality) setExportQuality(saved.exportQuality);
      if (saved.accentOverride) setAccentOverride(saved.accentOverride);
    } catch {
      // ignore localStorage errors
    }
  }, []);

  useEffect(() => {
    const payload = {
      themeKey,
      layoutMode,
      userInput,
      markdownText,
      apiKey,
      exportQuality,
      accentOverride
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // ignore localStorage errors
    }
  }, [themeKey, layoutMode, userInput, markdownText, apiKey, exportQuality, accentOverride]);

  const statusIndex = STATUS_STEPS.findIndex((step) => step.key === status);

  const setIdleState = () => {
    setStatus("idle");
    setProgress({ current: 0, total: 0, label: "" });
  };

  const autoGenerateSlides = async () => {
    if (!userInput || isAiProcessing) return;
    if (!apiKey) {
      setError("Gemini API Key를 입력하면 AI 설계를 사용할 수 있습니다.");
      return;
    }
    setError("");
    setIsAiProcessing(true);
    setStatus("analyzing");
    setProgress({ current: 0, total: 1, label: "AI 설계" });

    setProgress({ current: 0, total: 1, label: "AI 설계" });

    const template = TEMPLATES.find(t => t.id === selectedTemplate) || TEMPLATES[0];
    const countInstruction = targetSlideCount === 'auto'
      ? "내용의 분량과 깊이를 분석하여, 가장 효과적인 전달을 위해 필요한 슬라이드 개수(보통 3~7장)를 스스로 판단하여 구성하라."
      : `반드시 총 ${targetSlideCount}장의 슬라이드로 구성해야 한다. 내용을 풍성하게 배분하여 각 슬라이드의 밀도를 조절하고, 너무 짧지 않게 하라.`;

    const conceptInstruction = designConcept 
      ? `DESIGN CONCEPT: "${designConcept}"\n- 이 디자인 컨셉에 맞춰서 accent 컬러값(Hex)을 변경하라.\n- 문체와 톤앤매너를 이 컨셉에 맞게 조정하라.` 
      : "기본 모던/심플 스타일을 유지하라.";

    const systemPrompt = `전문 PPT 디자이너로서 사용자의 아이디어를 마크다운으로 설계하라.
선택된 템플릿: ${template.label}
템플릿 가이드: ${template.prompt}
분량 가이드: ${countInstruction}
스타일 가이드: ${conceptInstruction}
이미지 가이드: 각 슬라이드의 핵심 비주얼을 설명하는 [IMAGE: 프롬프트] 태그를 하나씩 포함하라. 프롬프트는 영어로 상세하게 작성하라.

**CRITICAL RULE**: 절대로 불렛포인트를 한 줄에 나열하지 마라.
각 항목은 반드시 새로운 줄에 "- "로 시작해야 한다.
잘못된 예: - 항목1 • 항목2 • 항목3
올바른 예:
- 항목1
- 항목2
- 항목3

반드시 지시어(<!-- layout: ... -->)를 포함하고,
전체적으로 테마 컬러(${theme.secondary})와 어울리는 accent를 지정하라.
각 슬라이드는 '## 제목'으로 시작해야 한다.`;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_ID}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `내용: ${userInput}` }] }],
            systemInstruction: { parts: [{ text: systemPrompt }] }
          })
        }
      );
      const data = await response.json();
      const result = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (result) {
        // 1. First Parse
        const sections = buildSections(result.trim());
        
        // 2. Generate Images in Parallel
        const updatedSections = await Promise.all(sections.map(async (sec) => {
           if (sec.imagePrompt) {
              try {
                 const url = await generateImage(sec.imagePrompt);
                 return { ...sec, imageUrl: url };
              } catch (e) {
                 console.error("Image Gen Failed", e);
                 return sec;
              }
           }
           return sec;
        }));

        setMarkdownText(result.trim());
        setSlides(updatedSections);
        setStatus("idle");
      } else {
        setError("AI 응답을 확인하지 못했습니다. 입력을 줄이거나 다시 시도해 주세요.");
        setStatus("idle");
      }
    } catch (e) {
      console.error(e);
      setError("AI 생성 요청 중 오류가 발생했습니다.");
      setStatus("idle");
    } finally {
      setIsAiProcessing(false);
      setProgress({ current: 0, total: 0, label: "" });
    }
  };

  const renderSlideToCanvas = async (section, size, scale = 1) => {
    const canvas = document.createElement("canvas");
    canvas.width = size.w * scale;
    canvas.height = size.h * scale;
    const ctx = canvas.getContext("2d");
    ctx.scale(scale, scale);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    // Draw Background Image if available (Hero Layout)
    if ((section.layout === "hero" || section.layout === "title") && section.imageUrl) {
        try {
          const img = await loadImage(section.imageUrl);
          if (img) {
             const scale = Math.max(size.w / img.width, size.h / img.height);
             const x = (size.w / 2) - (img.width / 2) * scale;
             const y = (size.h / 2) - (img.height / 2) * scale;
             ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
             
             ctx.fillStyle = "rgba(0,0,0,0.6)"; // Dark Overlay
             ctx.fillRect(0, 0, size.w, size.h);
          } else {
             renderSolidBackground();
          }
        } catch(e) { renderSolidBackground(); }
    } else {
       renderSolidBackground();
    }
    
    function renderSolidBackground() {
        const grad = ctx.createLinearGradient(0, 0, 0, size.h);
        grad.addColorStop(0, theme.gradient[0]);
        grad.addColorStop(1, theme.gradient[1]);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, size.w, size.h);
    }
    
    /* Removed old background drawing code blocks */

    const margin = size.w * 0.05;
    const innerW = size.w - margin * 2;
    const innerH = size.h - margin * 2;
    const accent = section.props.accent || theme.secondary;

    ctx.save();
    ctx.shadowBlur = 40;
    ctx.shadowColor = theme.cardShadow;
    ctx.fillStyle = theme.primary;
    roundRectPath(ctx, margin / 2, margin / 2, size.w - margin, size.h - margin, 40);
    ctx.fill();
    ctx.restore();

    if (section.layout === "visual") {
      const img = await loadImage(section.props.image);
      if (img) {
        ctx.save();
        const imgW = size.w * 0.52;
        roundRectPath(
          ctx,
          size.w - imgW - margin,
          margin,
          imgW,
          size.h - margin * 2,
          40
        );
        ctx.clip();
        const scaleFactor = Math.max(imgW / img.width, (size.h - margin * 2) / img.height);
        ctx.drawImage(
          img,
          size.w - imgW - margin + (imgW - img.width * scaleFactor) / 2,
          margin + (size.h - margin * 2 - img.height * scaleFactor) / 2,
          img.width * scaleFactor,
          img.height * scaleFactor
        );
        ctx.restore();
      }
      ctx.fillStyle = accent;
      fitTextBlock({
        ctx,
        text: section.title,
        box: { x: margin + 30, y: margin + 40, w: size.w * 0.3, h: innerH * 0.3 },
        maxFontPx: 80,
        minFontPx: 38,
        lineHeightRatio: 1.2,
        fontFamily: "\"Space Grotesk\"",
        fontWeight: 700
      });
      ctx.fillStyle = theme.text;
      fitTextBlock({
        ctx,
        text: section.content.join(" "),
        box: { x: margin + 30, y: margin + innerH * 0.35, w: size.w * 0.3, h: innerH * 0.5 },
        maxFontPx: 30,
        minFontPx: 18,
        lineHeightRatio: 1.6,
        fontFamily: "\"Manrope\"",
        fontWeight: 500
      });
    } else if (section.layout === "title") {
      ctx.fillStyle = accent;
      fitTextBlock({
        ctx,
        text: section.title,
        box: { x: margin, y: margin + innerH * 0.15, w: size.w - margin * 2, h: innerH * 0.45 },
        maxFontPx: 110,
        minFontPx: 60,
        align: "center",
        valign: "middle",
        fontFamily: "\"Space Grotesk\"",
        fontWeight: 700
      });
      ctx.fillStyle = theme.text;
      fitTextBlock({
        ctx,
        text: section.content.join(" "),
        box: { x: margin, y: size.h / 2 + 90, w: size.w - margin * 2, h: innerH * 0.2 },
        maxFontPx: 34,
        minFontPx: 20,
        align: "center",
        fontFamily: "\"Manrope\"",
        fontWeight: 500
      });
    } else if (section.layout === "metric") {
      ctx.fillStyle = accent;
      ctx.font = `700 ${size.w * 0.04}px \"Space Grotesk\"`;
      ctx.fillText(section.title, margin + 40, margin + 80);
      const val = parseFloat(section.metric || "0");
      const cx = size.w / 2;
      const cy = size.h / 2;
      const r = size.w * 0.12;
      ctx.lineWidth = r * 0.3;
      ctx.strokeStyle = "#E2E8F0";
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = accent;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + (Math.PI * 2 * val) / 100);
      ctx.stroke();
      ctx.fillStyle = accent;
      ctx.textAlign = "center";
      ctx.font = `700 ${r * 0.6}px \"Space Grotesk\"`;
      ctx.fillText(`${val}%`, cx, cy + r * 0.15);
    } else if (section.layout === "quote") {
      ctx.fillStyle = accent;
      ctx.font = `700 ${size.w * 0.035}px \"Space Grotesk\"`;
      ctx.fillText("“", margin + 40, margin + 80);
      ctx.fillStyle = theme.text;
      fitTextBlock({
        ctx,
        text: section.content[0] || "",
        box: { x: margin + 80, y: margin + 140, w: innerW - 120, h: innerH * 0.5 },
        maxFontPx: 54,
        minFontPx: 26,
        lineHeightRatio: 1.4,
        fontFamily: "\"Space Grotesk\"",
        fontWeight: 600
      });
      ctx.fillStyle = theme.muted;
      fitTextBlock({
        ctx,
        text: section.content.slice(1).join(" ") || "",
        box: { x: margin + 80, y: size.h * 0.72, w: innerW - 120, h: innerH * 0.2 },
        maxFontPx: 26,
        minFontPx: 18,
        lineHeightRatio: 1.6,
        fontFamily: "\"Manrope\"",
        fontWeight: 500
      });
    } else if (section.layout === "swot") {
      // 2x2 Grid Layout
      const midX = size.w / 2;
      const midY = size.h / 2;
      
      // Draw Quadrants
      const quads = [
        { label: "S", color: "#E0F2FE", text: "Strength", x: margin, y: margin },
        { label: "W", color: "#FEF2F2", text: "Weakness", x: midX, y: margin },
        { label: "O", color: "#ECFDF5", text: "Opportunity", x: margin, y: midY },
        { label: "T", color: "#FFFBEB", text: "Threat", x: midX, y: midY }
      ];

      quads.forEach((q, i) => {
        ctx.fillStyle = q.color;
        roundRectPath(ctx, q.x, q.y, midX - margin, midY - margin, 20);
        ctx.fill();
        
        ctx.fillStyle = theme.secondary;
        ctx.font = `900 ${size.w * 0.05}px "Space Grotesk"`;
        ctx.textAlign = "left";
        ctx.fillText(q.label, q.x + 30, q.y + 70);
        
        // Content
        const item = section.content.find(line => line.toLowerCase().startsWith(`- ${q.text.toLowerCase()}`)) || "";
        const cleanItem = item.split(":").slice(1).join(":").trim();
        
        ctx.fillStyle = theme.text;
        fitTextBlock({
           ctx,
           text: cleanItem,
           box: { x: q.x + 30, y: q.y + 100, w: midX - margin - 60, h: midY - margin - 120 },
           maxFontPx: 30,
           minFontPx: 16,
           lineHeightRatio: 1.5,
           fontWeight: 500
        });
      });
      
      // Center Title
      ctx.shadowBlur = 20;
      ctx.shadowColor = "rgba(0,0,0,0.1)";
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.arc(midX, midY, size.w * 0.08, 0, Math.PI*2);
      ctx.fill();
      ctx.shadowBlur = 0;
      
      ctx.fillStyle = theme.text;
      ctx.textAlign = "center";
      ctx.font = `800 ${size.w * 0.02}px "Space Grotesk"`;
      ctx.fillText("SWOT", midX, midY + size.w * 0.01);

    } else if (section.layout === "timeline") {
       // Timeline Layout
       ctx.fillStyle = accent;
       fitTextBlock({
         ctx,
         text: section.title,
         box: { x: margin, y: margin, w: innerW, h: innerH * 0.2 },
         maxFontPx: 60,
         minFontPx: 40,
         align: "center",
         fontWeight: 800
       });

       const steps = section.content.filter(l => l.toLowerCase().startsWith("- step"));
       const stepW = innerW / 3;
       const lineY = size.h * 0.5;

       // Connect Line
       ctx.beginPath();
       ctx.moveTo(margin + stepW/2, lineY);
       ctx.lineTo(size.w - margin - stepW/2, lineY);
       ctx.strokeStyle = theme.muted;
       ctx.lineWidth = 4;
       ctx.stroke();

       steps.forEach((step, i) => {
          const centerX = margin + stepW * i + stepW/2;
          const text = step.split(":").slice(1).join(":").trim();
          
          ctx.beginPath();
          ctx.arc(centerX, lineY, 20, 0, Math.PI*2);
          ctx.fillStyle = accent;
          ctx.fill();
          
          ctx.fillStyle = theme.text;
          fitTextBlock({
            ctx,
            text,
            box: { x: centerX - stepW/2 + 20, y: lineY + 40, w: stepW - 40, h: 200 },
            maxFontPx: 30,
            minFontPx: 20,
            align: "center",
            fontWeight: 600
          });
          
          ctx.fillStyle = theme.muted;
          ctx.font = `700 24px "Space Grotesk"`;
          ctx.fillText(`STEP 0${i+1}`, centerX, lineY - 40);
       });

    } else if (section.layout === "feature") {
       // 3-Column Feature Grid
       ctx.fillStyle = accent;
       fitTextBlock({
         ctx,
         text: section.title,
         box: { x: margin, y: margin, w: innerW, h: innerH * 0.15 },
         maxFontPx: 60,
         minFontPx: 40,
         align: "center",
         fontWeight: 800
       });
       
       const feats = section.content.filter(l => l.toLowerCase().startsWith("- feature"));
       const colW = innerW / 3;
       
       feats.forEach((feat, i) => {
         const colX = margin + colW * i;
         const text = feat.split(":").slice(1).join(":").trim();
         
         ctx.fillStyle = "white";
         ctx.shadowBlur = 20;
         ctx.shadowColor = "rgba(0,0,0,0.05)";
         roundRectPath(ctx, colX + 20, margin + innerH*0.25, colW - 40, innerH * 0.6, 30);
         ctx.fill();
         ctx.shadowBlur = 0;
         
         // Icon Placeholder Circle
         ctx.fillStyle = `${accent}20`; // 20% opacity
         ctx.beginPath();
         ctx.arc(colX + colW/2, margin + innerH*0.35, 40, 0, Math.PI*2);
         ctx.fill();
         
         ctx.fillStyle = theme.text;
         fitTextBlock({
            ctx,
            text,
            box: { x: colX + 40, y: margin + innerH*0.45, w: colW - 80, h: innerH * 0.3 },
            maxFontPx: 28,
            minFontPx: 20,
            align: "center",
            lineHeightRatio: 1.4,
            fontWeight: 500
         });
       });

    } else if (section.layout === "versus") {
       // A vs B Layout
       const midX = size.w / 2;
       
       // Background Panels
       ctx.fillStyle = "#F8FAFC";
       roundRectPath(ctx, margin, margin + 100, midX - margin - 20, size.h - margin - 120, 30);
       ctx.fill();
       
       ctx.fillStyle = "#F0F9FF";
       roundRectPath(ctx, midX + 20, margin + 100, midX - margin - 20, size.h - margin - 120, 30);
       ctx.fill();

       // VS Badge
       ctx.fillStyle = theme.secondary;
       ctx.beginPath();
       ctx.arc(midX, size.h / 2 + 30, 40, 0, Math.PI*2);
       ctx.fill();
       ctx.shadowBlur = 0;
       ctx.fillStyle = "white";
       ctx.textAlign = "center";
       ctx.font = `900 30px "Space Grotesk"`;
       ctx.fillText("VS", midX, size.h / 2 + 40);

       // Content
       const a = section.content.find(l => l.startsWith("- A:")) || "";
       const b = section.content.find(l => l.startsWith("- B:")) || "";
       
       ctx.fillStyle = theme.text;
       fitTextBlock({
          ctx,
          text: a.replace("- A:", "").trim(),
          box: { x: margin + 30, y: margin + 130, w: midX - margin - 80, h: size.h - margin - 180 },
          maxFontPx: 30,
          minFontPx: 20,
          align: "center",
          fontWeight: 600
       });
       fitTextBlock({
          ctx,
          text: b.replace("- B:", "").trim(),
          box: { x: midX + 50, y: margin + 130, w: midX - margin - 80, h: size.h - margin - 180 },
          maxFontPx: 30,
          minFontPx: 20,
          align: "center",
          fontWeight: 600
       });

       // Title
       ctx.fillStyle = accent;
       fitTextBlock({
         ctx,
         text: section.title,
         box: { x: margin, y: margin, w: innerW, h: 80 },
         maxFontPx: 50,
         minFontPx: 30,
         align: "center",
         fontWeight: 800
       });

    } else if (section.layout === "hero") {
      // Hero Title Layout
      ctx.fillStyle = accent;
      fitTextBlock({
        ctx,
        text: section.title,
        box: { x: margin, y: size.h * 0.3, w: innerW, h: size.h * 0.3 },
        maxFontPx: 120,
        minFontPx: 60,
        align: "center",
        lineHeightRatio: 1.1,
        fontWeight: 900
      });
      
      const sub = section.content.find(l => l.startsWith("- Sub:")) || "";
      ctx.fillStyle = theme.muted;
      fitTextBlock({
        ctx,
        text: sub.replace("- Sub:", "").trim(),
        box: { x: margin, y: size.h * 0.6, w: innerW, h: size.h * 0.15 },
        maxFontPx: 40,
        minFontPx: 24,
        align: "center",
        fontWeight: 500
      });

    } else {
      ctx.fillStyle = accent;
      fitTextBlock({
        ctx,
        text: section.title,
        box: { x: margin + 60, y: margin + 60, w: innerW - 120, h: innerH * 0.15 },
        maxFontPx: 70,
        minFontPx: 38,
        fontFamily: "\"Space Grotesk\"",
        fontWeight: 700
      });
      ctx.fillStyle = theme.text;
      fitTextBlock({
        ctx,
        text: normalizeBullets(section.content),
        box: { x: margin + 60, y: margin + 200, w: innerW - 120, h: innerH - 300 },
        maxFontPx: 38,
        minFontPx: 20,
        lineHeightRatio: 1.6,
        fontFamily: "\"Manrope\"",
        fontWeight: 500
      });
    }

    return canvas.toDataURL("image/png");
  };

  const renderSlides = async (scale, onProgress) => {
    const size = getSlideSize(layoutMode);
    const images = [];
    for (let i = 0; i < sections.length; i++) {
      images.push(await renderSlideToCanvas(sections[i], size, scale));
      if (onProgress) onProgress(i + 1, sections.length);
      await new Promise((r) => setTimeout(r, 60));
    }
    return images;
  };

  const generatePreviews = async () => {
    if (sections.length === 0) return;
    setError("");
    setStatus("processing");
    setProgress({ current: 0, total: sections.length, label: "렌더링" });
    const images = await renderSlides(1, (current, total) =>
      setProgress({ current, total, label: "렌더링" })
    );
    setPreviewImages(images);
    setStatus("complete");
  };

  const exportPDF = async () => {
    if (!libReady) {
      setError("PDF 라이브러리가 준비되지 않았습니다.");
      return;
    }
    if (sections.length === 0) return;
    setError("");
    setExporting("pdf");
    setExportProgress({ current: 0, total: sections.length });
    const images = await renderSlides(exportQuality, (current, total) =>
      setExportProgress({ current, total })
    );
    const { jsPDF } = window.jspdf;
    const size = getSlideSize(layoutMode);
    const doc = new jsPDF({
      orientation: layoutMode === "horizontal" ? "l" : "p",
      unit: "px",
      format: [size.w, size.h]
    });
    images.forEach((img, i) => {
      if (i > 0) doc.addPage();
      doc.addImage(img, "PNG", 0, 0, size.w, size.h);
    });
    doc.save("studio_gen_bundle.pdf");
    setExporting(null);
  };

  const exportPPTX = async () => {
    if (!libReady) {
      setError("PPTX 라이브러리가 준비되지 않았습니다.");
      return;
    }
    if (sections.length === 0) return;
    setError("");
    setExporting("pptx");
    setExportProgress({ current: 0, total: sections.length });
    const images = await renderSlides(exportQuality, (current, total) =>
      setExportProgress({ current, total })
    );
    const PptxGenJS = window.PptxGenJS;
    const pptx = new PptxGenJS();
    const slideW = layoutMode === "horizontal" ? 13.333 : 7.5;
    const slideH = layoutMode === "horizontal" ? 7.5 : 13.333;
    pptx.defineLayout({ name: "CUSTOM", width: slideW, height: slideH });
    pptx.layout = "CUSTOM";
    images.forEach((img) => {
      const slide = pptx.addSlide();
      slide.addImage({ data: img, x: 0, y: 0, w: slideW, h: slideH });
    });
    pptx.writeFile({ fileName: "studio_gen_bundle.pptx" });
    setExporting(null);
  };

  const updateSlideContent = () => {
    if (editIndex === null) return;
    const nextSections = [...sections];
    if (!nextSections[editIndex]) return;
    nextSections[editIndex] = { ...nextSections[editIndex], raw: editDraft };
    setMarkdownText(nextSections.map((s) => s.raw).join("\n\n"));
    setEditIndex(null);
  };

  const copyMarkdown = async () => {
    try {
      await navigator.clipboard.writeText(markdownText);
      setError("마크다운이 클립보드에 복사되었습니다.");
      setTimeout(() => setError(""), 2000);
    } catch {
      setError("클립보드 복사에 실패했습니다.");
    }
  };

  const openEditor = (index) => {
    setEditIndex(index);
    setEditDraft(sections[index]?.raw || "");
  };

  return (
    <div className="min-h-screen p-4 md:p-8 text-slate-900">
      <div className="max-w-[1600px] mx-auto flex flex-col gap-6">
        <header className="glass-panel flex flex-col lg:flex-row justify-between items-start lg:items-center p-6 rounded-[2.5rem] shadow-sm border border-slate-200 gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-slate-900 p-3.5 rounded-2xl text-white shadow-xl rotate-3 pulse-ring">
              <Zap size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight font-display">STUDIO GEN V4.1</h1>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Enterprise Design Suite
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
              {Object.keys(THEMES).map((key) => (
                <button
                  key={key}
                  onClick={() => setThemeKey(key)}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                    themeKey === key ? "bg-white shadow-md text-slate-900" : "text-slate-400"
                  }`}
                >
                  {THEMES[key].name}
                </button>
              ))}
            </div>
            <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
              <button
                onClick={() => setLayoutMode("horizontal")}
                className={`p-2 rounded-xl ${
                  layoutMode === "horizontal"
                    ? "bg-slate-900 text-white shadow-lg"
                    : "text-slate-400"
                }`}
              >
                <Monitor size={20} />
              </button>
              <button
                onClick={() => setLayoutMode("vertical")}
                className={`p-2 rounded-xl ${
                  layoutMode === "vertical" ? "bg-slate-900 text-white shadow-lg" : "text-slate-400"
                }`}
              >
                <Smartphone size={20} />
              </button>
            </div>
            <div className="hidden lg:flex items-center gap-2">
              {STATUS_STEPS.map((step, idx) => {
                const isDone = statusIndex >= idx && statusIndex !== -1;
                const isCurrent = status === step.key;
                return (
                  <div key={step.key} className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-full border flex items-center justify-center text-xs font-bold ${
                        isDone ? "bg-slate-900 text-white border-slate-900" : "border-slate-300 text-slate-400"
                      }`}
                    >
                      {isDone ? <CheckCircle2 size={14} /> : idx + 1}
                    </div>
                    <span
                      className={`text-[11px] font-bold ${
                        isCurrent ? "text-slate-900" : "text-slate-400"
                      }`}
                    >
                      {step.label}
                    </span>
                    {idx < STATUS_STEPS.length - 1 && (
                      <ChevronRight size={14} className="text-slate-300" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <aside className="lg:col-span-4 flex flex-col gap-6">
            {error && (
              <div className="bg-white border border-amber-200 text-amber-700 p-4 rounded-3xl shadow-sm text-sm font-semibold">
                {error}
              </div>
            )}

            <div className="bg-white p-8 rounded-[3rem] shadow-xl shadow-slate-200/50 border border-white">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <MessageSquareText size={20} className="text-slate-900" />
                  <h2 className="text-sm font-black uppercase tracking-tighter">Idea Pipeline</h2>
                </div>
                <span className="text-[10px] font-bold text-slate-400">AI + Markdown</span>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                {TEMPLATES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTemplate(t.id)}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      selectedTemplate === t.id
                        ? "bg-slate-900 border-slate-900 ring-2 ring-offset-2 ring-slate-900"
                        : "bg-slate-50 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                       <t.icon size={18} className={selectedTemplate === t.id ? "text-white" : "text-slate-900"} />
                       <span className={`text-xs font-bold ${selectedTemplate === t.id ? "text-white" : "text-slate-900"}`}>
                         {t.label}
                       </span>
                    </div>
                    <p className={`text-[10px] leading-tight ${selectedTemplate === t.id ? "text-slate-300" : "text-slate-500"}`}>
                      {t.desc}
                    </p>
                  </button>
                ))}
              </div>





              <div className="flex flex-col gap-2 mb-4">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Target Slide Count</label>
                <div className="flex gap-2 bg-slate-50 p-1 rounded-xl self-start">
                  {["auto", 3, 5, 8, 10].map((cnt) => (
                    <button
                      key={cnt}
                      onClick={() => setTargetSlideCount(cnt)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                        targetSlideCount === cnt
                          ? "bg-slate-900 text-white shadow-md"
                          : "text-slate-400 hover:text-slate-600"
                      }`}
                    >
                      {cnt === "auto" ? "Auto" : `${cnt} Pages`}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2 mb-4">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Design Concept</label>
                <div className="flex items-center gap-2 bg-slate-50 rounded-2xl px-4 py-3 border border-slate-200 focus-within:border-slate-400 transition-colors">
                  <Palette size={16} className="text-slate-400" />
                  <input
                    type="text"
                    value={designConcept}
                    onChange={(e) => setDesignConcept(e.target.value)}
                    className="flex-1 bg-transparent outline-none text-xs font-semibold text-slate-700 placeholder-slate-400"
                    placeholder="예: 사이버펑크, 따뜻한 감성, 미니멀 애플 스타일..."
                  />
                </div>
              </div>

              <textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className="w-full h-40 p-6 bg-slate-50 rounded-[2rem] border-2 border-transparent focus:border-slate-900 focus:bg-white outline-none text-base font-medium resize-none transition-all"
                placeholder="발표 내용을 입력하세요..."
              />
              <div className="mt-4 flex flex-col gap-3">
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs text-slate-500 leading-relaxed">
                  <div className="flex items-center gap-2 font-bold text-slate-700 mb-1">
                    <HelpCircle size={14} /> 무료 Gemini API Key 발급 방법
                  </div>
                  <ol className="list-decimal pl-4 space-y-1">
                    <li><a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline flex items-center gap-1 inline-flex">Google AI Studio <ExternalLink size={10}/></a>에 접속합니다.</li>
                    <li>"Create API key" 버튼을 클릭합니다.</li>
                    <li>생성된 키를 복사하여 위 입력창에 붙여넣으세요.</li>
                  </ol>
                  <p className="mt-2 text-[10px] text-slate-400">* API 키는 브라우저에만 저장되며 서버로 전송되지 않습니다.</p>
                </div>

                <div className="flex items-center gap-2 bg-slate-50 rounded-2xl px-4 py-3 border border-slate-200">
                  <input
                    type={showKey ? "text" : "password"}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="flex-1 bg-transparent outline-none text-xs font-semibold text-slate-600"
                    placeholder="Gemini API Key (옵션)"
                  />
                  <button
                    onClick={() => setShowKey((prev) => !prev)}
                    className="text-slate-400 hover:text-slate-900"
                  >
                    {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <button
                  onClick={autoGenerateSlides}
                  disabled={isAiProcessing || !userInput}
                  className="w-full py-4 bg-slate-900 hover:bg-black text-white rounded-[2rem] font-black text-base shadow-2xl transition-all flex items-center justify-center gap-3 disabled:opacity-30"
                >
                  {isAiProcessing ? <Loader2 className="animate-spin" /> : <BrainCircuit />} AI 슬라이드 자동 설계
                </button>

              </div>
            </div>

            <div className="bg-white p-8 rounded-[3rem] shadow-xl shadow-slate-200/50 border border-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wand2 size={18} />
                  <p className="text-xs font-black uppercase text-slate-400">Template Deck</p>
                </div>
                <button
                  onClick={() => setMarkdownText(DEFAULT_MARKDOWN)}
                  className="text-xs font-black text-slate-900 flex items-center gap-1"
                >
                  적용하기 <ChevronRight size={14} />
                </button>
              </div>
              <div className="mt-5 bg-slate-50 rounded-3xl p-5 text-xs text-slate-500 leading-relaxed font-medium">
                {DEFAULT_MARKDOWN.split("\n").slice(0, 6).join("\n")}...
              </div>
            </div>

            <div className="bg-white p-8 rounded-[3rem] shadow-xl shadow-slate-200/50 border border-white flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-xs font-black text-slate-400">
                  <FileCode size={16} /> MASTER MARKDOWN
                </div>
                <button
                  onClick={copyMarkdown}
                  className="text-xs font-black text-slate-500 flex items-center gap-1"
                >
                  <Copy size={14} /> 복사
                </button>
              </div>
              <textarea
                value={markdownText}
                onChange={(e) => setMarkdownText(e.target.value)}
                className="w-full h-[420px] p-6 bg-slate-50 rounded-[2rem] border-none text-xs font-mono text-slate-500 resize-none shadow-inner"
                placeholder="구조화된 마크다운..."
              />
              <button
                onClick={generatePreviews}
                disabled={status === "processing" || sections.length === 0}
                className="w-full py-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-[2rem] font-black text-lg shadow-xl flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-30"
              >
                {status === "processing" ? <Loader2 className="animate-spin" /> : <Sparkles />} 디자인 통합 렌더링
              </button>
            </div>

            <div className="bg-white p-8 rounded-[3rem] shadow-xl shadow-slate-200/50 border border-white flex flex-col gap-4">
              <div className="flex items-center gap-2 text-xs font-black text-slate-400">
                <Settings2 size={16} /> EXPORT SETTINGS
              </div>
              <div className="flex flex-col gap-3">
                <label className="text-xs font-bold text-slate-500">브랜드 포인트 컬러</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={accentOverride || theme.secondary}
                    onChange={(e) => setAccentOverride(e.target.value)}
                    className="w-12 h-10 rounded-xl border border-slate-200"
                  />
                  <input
                    type="text"
                    value={accentOverride}
                    onChange={(e) => setAccentOverride(e.target.value)}
                    placeholder={theme.secondary}
                    className="flex-1 bg-slate-50 rounded-2xl px-4 py-3 text-xs font-semibold text-slate-600 border border-slate-200"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <label className="text-xs font-bold text-slate-500">익스포트 해상도 (x)</label>
                <div className="flex gap-2">
                  {[1, 2, 3].map((scale) => (
                    <button
                      key={scale}
                      onClick={() => setExportQuality(scale)}
                      className={`flex-1 py-2 rounded-2xl text-xs font-black ${
                        exportQuality === scale ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      {scale}x
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  고해상도 내보내기는 렌더링 시간이 증가합니다. (PDF/PPTX 공통 적용)
                </p>
              </div>
            </div>
          </aside>

          <main className="lg:col-span-8 flex flex-col gap-6">
            {previewImages.length > 0 && (
              <div className="flex flex-wrap gap-4 bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-200">
                <button
                  onClick={exportPDF}
                  disabled={exporting === "pdf"}
                  className="flex-1 min-w-[150px] py-4 bg-slate-100 hover:bg-slate-200 rounded-2xl font-black text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {exporting === "pdf" ? <Loader2 className="animate-spin" size={18} /> : <FileText size={18} />}
                  일괄 PDF 저장
                </button>
                <button
                  onClick={exportPPTX}
                  disabled={exporting === "pptx"}
                  className="flex-1 min-w-[150px] py-4 bg-orange-50 text-orange-600 hover:bg-orange-100 rounded-2xl font-black text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {exporting === "pptx" ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <FileCode size={18} />
                  )}
                  파워포인트(PPTX) 변환
                </button>
                <button
                  onClick={() => {
                    setPreviewImages([]);
                    setIdleState();
                  }}
                  className="px-6 py-4 text-slate-400 hover:text-slate-900"
                >
                  <RefreshCw size={18} />
                </button>
                {exporting && (
                  <div className="w-full text-xs font-semibold text-slate-400">
                    익스포트 진행 중... {exportProgress.current}/{exportProgress.total}
                  </div>
                )}
              </div>
            )}

            <div className="grid gap-8">
              {status === "idle" && previewImages.length === 0 && (
                <div className="h-[760px] bg-slate-100 border-4 border-dashed border-slate-200 rounded-[4rem] flex flex-col items-center justify-center text-slate-300 gap-6">
                  <Layout size={80} strokeWidth={1} />
                  <p className="text-xl font-black">워크플로우를 시작하여 디자인을 생성하세요.</p>
                </div>
              )}
              {status === "analyzing" && (
                <div className="h-[760px] bg-white rounded-[4rem] shadow-sm flex flex-col items-center justify-center gap-6">
                  <BrainCircuit className="text-slate-900" size={64} />
                  <p className="text-xl font-black text-slate-800 tracking-tight">
                    AI 설계 중... 잠시만 기다려주세요.
                  </p>
                </div>
              )}
              {status === "processing" && (
                <div className="h-[760px] bg-white rounded-[4rem] shadow-sm flex flex-col items-center justify-center gap-6">
                  <Loader2 className="animate-spin text-slate-900" size={64} />
                  <p className="text-2xl font-black text-slate-800 tracking-tight">
                    엔터프라이즈 그래픽 최적화 중... ({progress.current}/{progress.total})
                  </p>
                </div>
              )}
              {previewImages.map((img, i) => (
                <div
                  key={i}
                  className="group relative rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white transition-all hover:scale-[1.01] animate-float-in"
                >
                  <img src={img} className="w-full h-auto" alt={`Slide ${i + 1}`} />
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-sm">
                    <button
                      onClick={() => openEditor(i)}
                      className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-black flex items-center gap-2 shadow-xl hover:scale-110 transition-transform"
                    >
                      <Pencil size={18} /> 슬라이드 수정
                    </button>
                    <a
                      href={img}
                      download={`iss_v4_${i + 1}.png`}
                      className="bg-emerald-500 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2 shadow-xl hover:scale-110 transition-transform"
                    >
                      <Download size={18} /> PNG 저장
                    </a>
                  </div>
                  <div className="absolute top-6 left-6 bg-white/90 px-4 py-2 rounded-full text-[10px] font-black shadow-lg">
                    PAGE {i + 1}
                  </div>
                  <div className="absolute bottom-6 left-6 bg-slate-900/70 text-white px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest">
                    {sections[i]?.layout || "bullets"}
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>

      {editIndex !== null && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-3xl rounded-[3rem] shadow-2xl overflow-hidden animate-float-in">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="bg-slate-100 p-2.5 rounded-2xl text-slate-900">
                  <Palette size={20} />
                </div>
                <h3 className="text-xl font-black">슬라이드 {editIndex + 1} 세부 편집</h3>
              </div>
              <button onClick={() => setEditIndex(null)} className="p-2 hover:bg-slate-100 rounded-xl">
                <X />
              </button>
            </div>
            <div className="p-8">
              <p className="text-xs font-bold text-slate-400 mb-4 uppercase">Slide Logic Editor (Markdown)</p>
              <textarea
                value={editDraft}
                onChange={(e) => setEditDraft(e.target.value)}
                className="w-full h-64 p-6 bg-slate-50 rounded-[2rem] border-2 border-transparent focus:border-slate-900 outline-none font-mono text-sm leading-relaxed"
              />
              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => setEditIndex(null)}
                  className="flex-1 py-4 bg-slate-100 font-black rounded-2xl"
                >
                  취소
                </button>
                <button
                  onClick={updateSlideContent}
                  className="flex-1 py-4 bg-slate-900 text-white font-black rounded-2xl shadow-xl flex items-center justify-center gap-2"
                >
                  <Save size={18} /> 변경사항 저장 후 갱신
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
