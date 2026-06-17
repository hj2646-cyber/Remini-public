const pptxgen = require("pptxgenjs");

const slideConfig = {
  type: 'cover',
  index: 1,
  title: 'Remini'
};

function createSlide(pres, theme) {
  const slide = pres.addSlide();
  slide.background = { color: theme.bg };

  // Decorative left accent bar
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.5, y: 0.5, w: 0.12, h: 4.625,
    fill: { color: theme.accent },
    line: { color: theme.accent, width: 0 },
    rectRadius: 0.06
  });

  // Eyebrow label
  slide.addText("CAPSTONE · 종합설계 프로젝트", {
    x: 0.9, y: 0.7, w: 8.5, h: 0.4,
    fontSize: 12, fontFace: "Arial",
    color: theme.accent, bold: true,
    charSpacing: 4
  });

  // Main title
  slide.addText("Remini", {
    x: 0.9, y: 1.6, w: 8.5, h: 1.4,
    fontSize: 80, fontFace: "Arial",
    color: theme.primary, bold: true
  });

  // Subtitle
  slide.addText("치매 어르신과 가족을 잇는\nAI 대화 · 보호자 모니터링 시스템", {
    x: 0.9, y: 3.05, w: 8.5, h: 1.2,
    fontSize: 22, fontFace: "Arial",
    color: theme.secondary,
    lineSpacingMultiple: 1.3
  });

  // Footer line
  slide.addShape(pres.shapes.LINE, {
    x: 0.9, y: 4.7, w: 2.2, h: 0,
    line: { color: theme.light, width: 1.5 }
  });

  slide.addText("2026 · Remini Team", {
    x: 0.9, y: 4.85, w: 5, h: 0.3,
    fontSize: 11, fontFace: "Arial",
    color: theme.secondary
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
  pres.writeFile({ fileName: "slide-01-preview.pptx" });
}

module.exports = { createSlide, slideConfig };
