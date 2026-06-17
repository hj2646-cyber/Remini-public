const pptxgen = require("pptxgenjs");

const slideConfig = {
  type: 'content',
  index: 2,
  title: '핵심 기능'
};

function createSlide(pres, theme) {
  const slide = pres.addSlide();
  slide.background = { color: theme.bg };

  // Top eyebrow
  slide.addText("WHAT WE BUILT", {
    x: 0.5, y: 0.45, w: 6, h: 0.3,
    fontSize: 11, fontFace: "Arial",
    color: theme.accent, bold: true,
    charSpacing: 4
  });

  // Heading
  slide.addText("핵심 기능 세 가지", {
    x: 0.5, y: 0.8, w: 9, h: 0.7,
    fontSize: 34, fontFace: "Arial",
    color: theme.primary, bold: true
  });

  // Underline accent
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.55, w: 0.7, h: 0.06,
    fill: { color: theme.accent },
    line: { color: theme.accent, width: 0 }
  });

  // Three feature cards
  const cards = [
    {
      num: "01",
      title: "음성 AI 대화",
      desc: "로컬 LLM + STT/TTS\n오프라인 우선, 클라우드 X"
    },
    {
      num: "02",
      title: "회상요법 RAG",
      desc: "임상 가이드 기반 응답\nKG-aware 대화 흐름"
    },
    {
      num: "03",
      title: "보호자 모니터링",
      desc: "실시간 알림 · 대화 로그\n인지 변화 추적"
    }
  ];

  cards.forEach((card, i) => {
    const x = 0.5 + i * 3.07;

    // Card background
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: x, y: 2.0, w: 2.87, h: 2.6,
      fill: { color: theme.light },
      line: { color: theme.light, width: 0 },
      rectRadius: 0.15
    });

    // Number badge
    slide.addText(card.num, {
      x: x + 0.25, y: 2.2, w: 1, h: 0.4,
      fontSize: 14, fontFace: "Arial",
      color: theme.accent, bold: true
    });

    // Card title
    slide.addText(card.title, {
      x: x + 0.25, y: 2.75, w: 2.5, h: 0.6,
      fontSize: 20, fontFace: "Arial",
      color: theme.primary, bold: true
    });

    // Card description
    slide.addText(card.desc, {
      x: x + 0.25, y: 3.4, w: 2.5, h: 1.1,
      fontSize: 12, fontFace: "Arial",
      color: theme.secondary,
      lineSpacingMultiple: 1.4
    });
  });

  // Page number badge (REQUIRED for non-cover)
  slide.addShape(pres.shapes.OVAL, {
    x: 9.3, y: 5.1, w: 0.4, h: 0.4,
    fill: { color: theme.accent },
    line: { color: theme.accent, width: 0 }
  });
  slide.addText("2", {
    x: 9.3, y: 5.1, w: 0.4, h: 0.4,
    fontSize: 12, fontFace: "Arial",
    color: "FFFFFF", bold: true,
    align: "center", valign: "middle"
  });

  return slide;
}

if (require.main === module) {
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_16x9';
  const theme = {
    primary: "2d1f15",
    secondary: "6b4423",
    accent: "c87f4a",
    light: "e8d5b7",
    bg: "fbf6ec"
  };
  createSlide(pres, theme);
  pres.writeFile({ fileName: "slide-02-preview.pptx" });
}

module.exports = { createSlide, slideConfig };
