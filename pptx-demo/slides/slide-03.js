const pptxgen = require("pptxgenjs");

const slideConfig = {
  type: 'summary',
  index: 3,
  title: '한 줄 요약'
};

function createSlide(pres, theme) {
  const slide = pres.addSlide();
  slide.background = { color: theme.bg };

  // Top eyebrow
  slide.addText("TAKEAWAY", {
    x: 0.5, y: 0.45, w: 6, h: 0.3,
    fontSize: 11, fontFace: "Arial",
    color: theme.accent, bold: true,
    charSpacing: 4
  });

  // Large quote mark
  slide.addText("“", {
    x: 0.5, y: 0.9, w: 1.5, h: 1.5,
    fontSize: 130, fontFace: "Arial",
    color: theme.light, bold: true
  });

  // Main message
  slide.addText("어르신의 기억을 들어주고,\n가족의 마음을 잇는 AI 동반자.", {
    x: 1.5, y: 1.8, w: 8, h: 1.8,
    fontSize: 32, fontFace: "Arial",
    color: theme.primary, bold: true,
    lineSpacingMultiple: 1.3
  });

  // Divider
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 4.0, w: 0.7, h: 0.06,
    fill: { color: theme.accent },
    line: { color: theme.accent, width: 0 }
  });

  // Footer key points (left)
  slide.addText("Local-first  ·  Caregiver-aware  ·  Reminiscence-grounded", {
    x: 0.5, y: 4.2, w: 9, h: 0.4,
    fontSize: 14, fontFace: "Arial",
    color: theme.secondary,
    charSpacing: 2
  });

  slide.addText("github.com/Remini  ·  2026 캡스톤", {
    x: 0.5, y: 4.7, w: 7, h: 0.3,
    fontSize: 11, fontFace: "Arial",
    color: theme.secondary, italic: true
  });

  // Page number badge
  slide.addShape(pres.shapes.OVAL, {
    x: 9.3, y: 5.1, w: 0.4, h: 0.4,
    fill: { color: theme.accent },
    line: { color: theme.accent, width: 0 }
  });
  slide.addText("3", {
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
  pres.writeFile({ fileName: "slide-03-preview.pptx" });
}

module.exports = { createSlide, slideConfig };
