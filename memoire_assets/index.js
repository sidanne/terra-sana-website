const fs = require('fs');
const M = require('./build_memoire.js');
const { introduction, analyse } = require('./content_intro_analyse.js');
const { persistance } = require('./content_persistance.js');
const { technique } = require('./content_technique.js');
const { conclusion, bibliographie, glossaire } = require('./content_conclusion.js');
const { annexes } = require('./content_annexes.js');

const {
  Document, Packer, Paragraph, TextRun, AlignmentType, Header, Footer, PageNumber,
  BorderStyle, ShadingType,
} = require('docx');

const doc = new Document({
  title: "Module de gestion des bénévoles et des événements — Terra Sana ASBL",
  subject: "Travail de fin d'études — Bachelier en Informatique de Gestion",
  creator: "Alain Youndjeu Tchouapi",
  lastModifiedBy: "Alain Youndjeu Tchouapi",
  description: "TFE EAFC Uccle — Module de gestion des bénévoles et des événements pour Terra Sana ASBL",
  styles: {
    default: {
      document: { run: { font: M.FONT, size: 21 } },
    },
  },
  sections: [
    {
      properties: {
        page: { size: { width: 11906, height: 16838 }, margin: { top: 0, bottom: 0, left: 0, right: 0 } },
      },
      children: M.coverElements,
    },
    {
      properties: {
        page: {
          size: { width: 11906, height: 16838 },
          margin: { top: 1417, bottom: 1417, left: 1417, right: 1417 },
        },
      },
      headers: {
        default: new Header({ children: [new Paragraph({ children: [] })] }),
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { after: 40 },
              border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: M.GOLD, space: 4 } },
              children: [
                new TextRun({ text: "Alain Youndjeu Tchouapi — Épreuve Intégrée", size: 17, color: "555555", font: M.FONT }),
              ],
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({ children: [PageNumber.CURRENT], size: 18, color: "555555", font: M.FONT, bold: true }),
              ],
            }),
          ],
        }),
      },
      children: [
        ...M.remerciements,
        ...M.resume,
        ...M.tocPage,
        ...introduction,
        ...analyse,
        ...persistance,
        ...technique,
        ...conclusion,
        ...glossaire,
        ...bibliographie,
        ...annexes,
      ],
    },
    {
      properties: {
        page: { size: { width: 11906, height: 16838 }, margin: { top: 0, bottom: 0, left: 0, right: 0 } },
      },
      headers: { default: new Header({ children: [] }) },
      footers: { default: new Footer({ children: [] }) },
      children: M.backPage,
    },
  ],
});

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync(__dirname + '/Memoire_TFE_Alain_Youndjeu_Tchouapi.docx', buffer);
  console.log('DOCX generated:', buffer.length, 'bytes');
});
