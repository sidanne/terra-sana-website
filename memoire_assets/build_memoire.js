const fs = require('fs');
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow,
  TableCell, WidthType, BorderStyle, ShadingType, ImageRun, PageBreak, TableOfContents,
  Header, Footer, PageNumber, VerticalAlign, TabStopType, TabStopPosition, LevelFormat,
  convertInchesToTwip, ExternalHyperlink, NumberFormat,
  HorizontalPositionRelativeFrom, VerticalPositionRelativeFrom, TextWrappingType, VerticalPositionAlign, HorizontalPositionAlign,
  PositionalTab, PositionalTabAlignment, PositionalTabLeader, PositionalTabRelativeTo,
  Tab, LeaderType,
} = require('docx');

// ── Palette académique (bleu institutionnel) ────────────────────────────
const GREEN = "1F4E79";        // bleu principal (ex-vert) — utilisé pour les sous-titres
const GREEN_DARK = "12283F";   // bleu marine foncé (ex-vert foncé) — couverture, titres
const GREEN_LIGHT = "5B8DB8";  // bleu clair (accents)
const GOLD = "2E5A8C";         // bleu moyen (ex-or) — filets et accents
const CREAM = "F2F5F8";        // gris-bleu très clair (ex-crème) — fonds de bloc
const TABLE_HEAD = "205E99";   // bleu royal — en-têtes de tableau
const TABLE_ALT = "DFE7FF";    // lavande très clair — lignes alternées
const TEXT = "1B1B1B";
const GREY = "666666";
const WHITE = "FFFFFF";
const LIGHT_GREEN_BG = "E7EEF5";
const LIGHT_GOLD_BG = "EEF2F7";

const FONT = "Times New Roman";
const FONT_MONO = "Consolas";

// ── Helpers ──────────────────────────────────────────────────────────────
function h1(text, numbering) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 480, after: 240 },
    border: { bottom: { color: GOLD, space: 4, style: BorderStyle.SINGLE, size: 12 } },
    children: [new TextRun({ text, bold: true, color: GREEN_DARK, size: 32, font: FONT })],
  });
}
function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 340, after: 160 },
    children: [new TextRun({ text, bold: true, color: GREEN, size: 26, font: FONT })],
  });
}
function h3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 240, after: 120 },
    children: [new TextRun({ text, bold: true, color: GREEN_DARK, size: 22, font: FONT })],
  });
}
function p(text, opts = {}) {
  const runs = Array.isArray(text) ? text : [new TextRun({ text, size: 21, font: FONT, color: TEXT, italics: opts.italics, bold: opts.bold })];
  return new Paragraph({ spacing: { after: 160, line: 300 }, alignment: opts.align || AlignmentType.JUSTIFIED, children: runs, ...opts.pOpts });
}
function rt(text, opts = {}) { return new TextRun({ text, size: 21, font: FONT, color: TEXT, ...opts }); }
function bullet(text, level = 0) {
  const runs = Array.isArray(text) ? text : [rt(text)];
  return new Paragraph({ bullet: { level }, spacing: { after: 100, line: 280 }, alignment: AlignmentType.JUSTIFIED, children: runs });
}
function rgItem(code, text) {
  return new Paragraph({
    spacing: { after: 130, line: 280 },
    alignment: AlignmentType.JUSTIFIED,
    indent: { left: 340, hanging: 340 },
    children: [
      new TextRun({ text: code + " : ", bold: true, color: GREEN, size: 21, font: FONT }),
      new TextRun({ text, size: 21, font: FONT, color: TEXT }),
    ],
  });
}
function caption(text) {
  // Les légendes "Tableau N — ..." / "Table X — ..." sont volontairement omises,
  // au même titre que les légendes de figures : seul un espacement reste.
  return new Paragraph({ spacing: { after: 240 }, children: [] });
}
function imgPara(path, width, height, cap) {
  // Les légendes "Figure N — ..." sont volontairement omises : seule l'image est affichée.
  const buf = fs.readFileSync(path);
  const out = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 160, after: 240 },
      children: [new ImageRun({ data: buf, transformation: { width, height }, type: "png" })],
    }),
  ];
  return out;
}
function cell(text, opts = {}) {
  const runs = Array.isArray(text) ? text : [new TextRun({ text: String(text), size: opts.size || 18, font: FONT, bold: opts.bold, color: opts.color || TEXT })];
  return new TableCell({
    width: { size: opts.width || 1000, type: WidthType.DXA },
    shading: opts.bg ? { type: ShadingType.CLEAR, fill: opts.bg } : undefined,
    verticalAlign: VerticalAlign.CENTER,
    margins: { top: 60, bottom: 60, left: 100, right: 100 },
    children: [new Paragraph({ children: runs, alignment: opts.align || AlignmentType.LEFT })],
  });
}
function headerRow(labels, widths) {
  return new TableRow({
    tableHeader: true,
    children: labels.map((l, i) => cell(l, { bold: true, color: WHITE, bg: TABLE_HEAD, width: widths[i], size: 18 })),
  });
}
function dataRow(values, widths, bg) {
  return new TableRow({ cantSplit: true, children: values.map((v, i) => cell(v, { width: widths[i], bg, size: 18 })) });
}
function table(headers, rows, widths) {
  return new Table({
    width: { size: widths.reduce((a, b) => a + b, 0), type: WidthType.DXA },
    columnWidths: widths,
    borders: {
      top: { style: BorderStyle.SINGLE, size: 4, color: "CCCCCC" }, bottom: { style: BorderStyle.SINGLE, size: 4, color: "CCCCCC" },
      left: { style: BorderStyle.SINGLE, size: 4, color: "CCCCCC" }, right: { style: BorderStyle.SINGLE, size: 4, color: "CCCCCC" },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: "E0E0E0" }, insideVertical: { style: BorderStyle.SINGLE, size: 4, color: "E0E0E0" },
    },
    rows: [headerRow(headers, widths), ...rows.map((r, i) => dataRow(r, widths, i % 2 === 1 ? TABLE_ALT : undefined))],
  });
}
function codeBlock(lines) {
  return new Paragraph({
    shading: { type: ShadingType.CLEAR, fill: "1B2733" },
    spacing: { before: 120, after: 200 },
    border: { top: { style: BorderStyle.SINGLE, size: 4, color: GREEN }, bottom: { style: BorderStyle.SINGLE, size: 4, color: GREEN }, left: { style: BorderStyle.SINGLE, size: 4, color: GREEN }, right: { style: BorderStyle.SINGLE, size: 4, color: GREEN } },
    children: lines.flatMap((l, i) => [new TextRun({ text: l, font: FONT_MONO, size: 16, color: "D6E4F0", break: i === 0 ? 0 : 1 })]),
  });
}
function pageBreak() { return new Paragraph({ children: [new PageBreak()] }); }

// ── Cover page ───────────────────────────────────────────────────────────
const SCR_DIR = __dirname + '/screenshots/';

function floatingImg(path, w, h, hAlign, vAlign, behind = true) {
  return new ImageRun({
    data: fs.readFileSync(path),
    transformation: { width: w, height: h },
    type: "png",
    floating: {
      horizontalPosition: { relative: HorizontalPositionRelativeFrom.PAGE, align: hAlign },
      verticalPosition: { relative: VerticalPositionRelativeFrom.PAGE, align: vAlign },
      wrap: { type: TextWrappingType.NONE },
      behindDocument: behind,
      margins: { left: 0, right: 0, top: 0, bottom: 0 },
    },
  });
}

const coverElements = [
  new Paragraph({ children: [floatingImg(SCR_DIR + 'cover_triangle.png', 500, 840, HorizontalPositionAlign.LEFT, VerticalPositionAlign.BOTTOM)] }),

  new Paragraph({
    spacing: { before: 500, after: 160 }, alignment: AlignmentType.CENTER,
    children: [new ImageRun({ data: fs.readFileSync(SCR_DIR + 'eafc_logo_raw.png'), transformation: { width: 340, height: 107 }, type: "png" })],
  }),
  new Paragraph({
    spacing: { before: 0, after: 700 }, alignment: AlignmentType.CENTER,
    children: [new ImageRun({ data: fs.readFileSync(SCR_DIR + 'logo_terrasana.png'), transformation: { width: 190, height: 88 }, type: "png" })],
  }),

  new Paragraph({ spacing: { before: 0, after: 40 }, alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "Travail de Fin d'Études", bold: true, size: 56, color: GREEN_DARK, font: FONT })] }),
  new Paragraph({ spacing: { before: 0, after: 900 }, alignment: AlignmentType.CENTER,
    border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: GOLD, space: 8 } },
    children: [new TextRun({ text: "Module de gestion des bénévoles et des événements", size: 24, color: TEXT, font: FONT })] }),

  new Table({
    width: { size: 9350, type: WidthType.DXA },
    columnWidths: [3800, 5550],
    borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE }, insideHorizontal: { style: BorderStyle.NONE }, insideVertical: { style: BorderStyle.NONE } },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 3800, type: WidthType.DXA },
            shading: { type: ShadingType.CLEAR, fill: GREEN_DARK },
            margins: { top: 300, bottom: 300, left: 260, right: 260 },
            children: [
              new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: "Étudiant :", bold: true, size: 21, color: WHITE, font: FONT })] }),
              new Paragraph({ spacing: { after: 260 }, children: [new TextRun({ text: "Alain Youndjeu Tchouapi", size: 21, color: WHITE, font: FONT })] }),
              new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: "Encadrement :", bold: true, size: 21, color: WHITE, font: FONT })] }),
              new Paragraph({ children: [new TextRun({ text: "Marie-Christine Namur", size: 21, color: WHITE, font: FONT })] }),
              new Paragraph({ children: [new TextRun({ text: "(professeure)", italics: true, bold: true, size: 21, color: WHITE, font: FONT })] }),
            ],
          }),
          new TableCell({
            width: { size: 5550, type: WidthType.DXA },
            margins: { top: 300, bottom: 300, left: 300, right: 60 },
            children: [
              new Paragraph({ spacing: { after: 160 },
                border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: GOLD, space: 2 } },
                children: [new TextRun({ text: "Bachelier en Informatique de Gestion", size: 21, color: TEXT, font: FONT })] }),
              new Paragraph({ children: [new TextRun({ text: "Application ", size: 21, color: TEXT, font: FONT }), new TextRun({ text: "Terra Sana", bold: true, italics: true, size: 21, color: TEXT, font: FONT })] }),
            ],
          }),
        ],
      }),
    ],
  }),

  new Paragraph({ spacing: { before: 900, after: 0 }, alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "« Recueillir un besoin réel, le traduire en application fonctionnelle. »", italics: true, size: 19, color: GREY, font: FONT })] }),

  new Paragraph({ spacing: { before: 900, after: 0 }, alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "Année académique : 2025 – 2026", bold: true, size: 21, color: TEXT, font: FONT })] }),
  new Paragraph({ spacing: { before: 60, after: 0 }, alignment: AlignmentType.CENTER,
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: GOLD, space: 4 } },
    children: [new TextRun({ text: "Travail de fin d'études en vue de l'obtention du titre de bachelier en informatique de gestion", italics: true, size: 18, color: TEXT, font: FONT })] }),
  pageBreak(),
];

// ── Page de clôture (dos), même esprit que l'exemple ────────────────────
const backPage = [
  new Paragraph({ children: [floatingImg(SCR_DIR + 'back_triangle.png', 460, 650, HorizontalPositionAlign.LEFT, VerticalPositionAlign.BOTTOM)] }),
  new Paragraph({ spacing: { before: 2200, after: 100 }, alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "Alain Youndjeu Tchouapi", bold: true, size: 40, color: GREEN_DARK, font: FONT })] }),
  new Paragraph({ spacing: { before: 0, after: 700 }, alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "Module de gestion des bénévoles et des événements, Terra Sana ASBL", italics: true, size: 22, color: TEXT, font: FONT })] }),
  new Paragraph({ spacing: { before: 0, after: 260 }, alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "TERRA SANA ASBL", bold: true, size: 22, color: GREEN, font: FONT, characterSpacing: 20 })] }),
  new Paragraph({ spacing: { before: 0, after: 0 }, alignment: AlignmentType.CENTER,
    children: [new ImageRun({ data: fs.readFileSync(SCR_DIR + 'smiley.png'), transformation: { width: 130, height: 130 }, type: "png" })],
  }),
];

// ── Remerciements ────────────────────────────────────────────────────────
const remerciements = [
  h1("Remerciements"),
  p("Avant d'entrer dans le corps de ce rapport, je tiens à remercier toutes les personnes qui ont contribué, de près ou de loin, à la réalisation de ce travail de fin d'études."),
  p([rt("Mes premiers remerciements vont à Madame Marie-Christine Namur", { bold: true }), rt(", ma promotrice, pour son encadrement, sa disponibilité et la rigueur de ses retours tout au long de la phase d'analyse et de développement de ce module. Ses conseils ont directement orienté plusieurs choix de conception présentés dans ce rapport.")]),
  p([rt("Je remercie également Monsieur Didier Seraye", { bold: true }), rt(", Responsable Administratif de Terra Sana ASBL et mon maître de stage, pour la confiance qu'il m'a accordée durant le stage puis pour sa disponibilité lors des échanges qui ont permis de cadrer précisément les besoins réels de l'association en matière de gestion des bénévoles et des événements.")]),
  p("Ma reconnaissance va aussi à l'ensemble du corps professoral de l'EAFC Uccle, pour la qualité de la formation dispensée durant ces trois années de Bachelier en Informatique de Gestion, et pour les bases méthodologiques (analyse, modélisation, bonnes pratiques de développement) sans lesquelles ce travail n'aurait pas la même rigueur."),
  p("Enfin, je remercie mes proches et mes camarades de promotion pour leur soutien constant durant cette dernière année d'études, en particulier durant les semaines les plus intenses de rédaction et de développement."),
  pageBreak(),
];

// ── Résumé ───────────────────────────────────────────────────────────────
const resume = [
  h1("Résumé"),
  p("Terra Sana ASBL, association bruxelloise active depuis 2019 dans l'alimentation locale et le circuit court, gérait jusqu'ici ses bénévoles et ses événements de façon entièrement manuelle : fichiers Excel partagés, confirmations envoyées une à une par email, aucune trace exploitable de la participation des bénévoles. Ce travail de fin d'études développe, en continuité du site vitrine réalisé durant le stage effectué au sein de l'association, un module complet de gestion des bénévoles et des événements : création de compte et espace personnel, inscription aux événements avec liste d'attente automatique, validation par l'administrateur, notifications par email, retours post-événement, niveaux de fidélité calculés automatiquement et attestations de participation téléchargeables."),
  p("L'analyse s'appuie sur vingt-cinq règles de gestion établies à partir d'entretiens directs avec le responsable administratif de l'association, un diagramme de classes à huit entités et une base de données MySQL normalisée. L'implémentation repose sur une architecture 3-tiers Spring Boot / React / MySQL, avec une authentification JWT à deux rôles distincts (bénévole et administrateur), un tableau de bord administrateur entièrement traduit en français, anglais et néerlandais, et une suite de mécanismes automatisés (attribution de photos par mots-clés, envoi d'emails asynchrone, génération de PDF) documentés dans le dossier technique. Le module est développé et démontré en environnement local, conformément au périmètre validé avec l'encadrement académique."),
  p([rt("Mots-clés :", { bold: true })]),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 80, after: 160 },
    children: [new ImageRun({ data: fs.readFileSync(SCR_DIR + 'mots_cles.png'), transformation: { width: 480, height: 88 }, type: "png" })],
  }),
  pageBreak(),
];

// ── TOC page (construite manuellement : les champs TOC de Word ne se ─────
// mettent pas à jour automatiquement lors d'une conversion PDF sans Word) ─
function tocEntry(text, page, level) {
  const size = level === 1 ? 22 : 21;
  const bold = level === 1;
  const indent = level === 1 ? 0 : 360;
  return new Paragraph({
    spacing: { after: level === 1 ? 160 : 100 },
    indent: { left: indent },
    tabStops: [{ type: TabStopType.RIGHT, position: 9072, leader: LeaderType.DOT }],
    children: [
      new TextRun({ text, bold, size, font: FONT, color: level === 1 ? GREEN_DARK : TEXT }),
      new TextRun({ children: [new Tab()], size, font: FONT }),
      new TextRun({ text: String(page), size, font: FONT, color: level === 1 ? GREEN_DARK : TEXT, bold }),
    ],
  });
}

const TOC_ENTRIES = [
  ["Remerciements", 2, 1], ["Résumé", 3, 1],
  ["I. Introduction", 5, 1],
  ["1.1. Présentation de Terra Sana ASBL", 5, 2],
  ["1.2. Contexte du stage et travail réalisé avant le TFE", 5, 2],
  ["1.3. Problématique", 6, 2],
  ["1.4. Objectifs et périmètre du TFE", 6, 2],
  ["1.5. Justification du périmètre retenu", 6, 2],
  ["1.6. Sources d'information", 7, 2],
  ["II. Dossier d'analyse", 8, 1],
  ["2.1. Cahier des charges", 8, 2],
  ["2.2. Persistance des données", 16, 2],
  ["2.3. Autres diagrammes UML", 22, 2],
  ["III. Dossier technique", 26, 1],
  ["3.1. Choix technologiques", 26, 2],
  ["3.2. Architecture globale", 27, 2],
  ["3.3. Fonctionnalités transversales notables", 29, 2],
  ["3.4. Présentation des interfaces", 32, 2],
  ["3.5. Sécurité", 43, 2],
  ["3.6. Environnement de développement et de démonstration", 45, 2],
  ["IV. Conclusion", 48, 1],
  ["4.1. Apports personnels", 48, 2],
  ["4.2. Difficultés rencontrées", 49, 2],
  ["4.3. Regard critique sur le travail réalisé", 49, 2],
  ["4.4. Perspectives", 50, 2],
  ["4.5. Mot de fin", 50, 2],
  ["V. Glossaire", 51, 1],
  ["VI. Bibliographie / Webographie", 52, 1],
  ["VII. Annexes", 53, 1],
];

const tocPage = [
  h1("Table des matières"),
  ...TOC_ENTRIES.map(([text, page, level]) => tocEntry(text, page, level)),
  pageBreak(),
];

module.exports = {
  h1, h2, h3, p, rt, bullet, rgItem, caption, imgPara, cell, headerRow, dataRow, table, codeBlock, pageBreak,
  coverElements, backPage, remerciements, resume, tocPage,
  GREEN, GREEN_DARK, GREEN_LIGHT, GOLD, CREAM, TEXT, GREY, WHITE, LIGHT_GREEN_BG, LIGHT_GOLD_BG, FONT, FONT_MONO,
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType,
  BorderStyle, ShadingType, ImageRun, PageBreak, Header, Footer, PageNumber, VerticalAlign, NumberFormat,
  ExternalHyperlink,
};
