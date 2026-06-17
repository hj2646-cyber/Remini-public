const pptxgen = require('pptxgenjs');
const pres = new pptxgen();
pres.layout = 'LAYOUT_16x9';

const theme = {
  primary: "2d1f15",
  secondary: "6b4423",
  accent: "c87f4a",
  light: "e8d5b7",
  bg: "fbf6ec"
};

for (let i = 1; i <= 3; i++) {
  const num = String(i).padStart(2, '0');
  const slideModule = require(`./slide-${num}.js`);
  slideModule.createSlide(pres, theme);
}

pres.writeFile({ fileName: './output/Remini-demo.pptx' })
  .then(p => console.log('PPTX written ->', p));
