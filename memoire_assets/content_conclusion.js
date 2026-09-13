const M = require('./build_memoire.js');
const { h1, h2, h3, p, rt, bullet, caption, table, pageBreak, codeBlock, ExternalHyperlink } = M;
const { TextRun, AlignmentType, Paragraph } = require('docx');

function bib(text) {
  const match = text.match(/https?:\/\/\S+?(?=[).,;\s]*$)/);
  if (!match) return p(text, { align: AlignmentType.LEFT });
  const url = match[0];
  const before = text.slice(0, match.index);
  const after = text.slice(match.index + url.length);
  const runs = [
    new TextRun({ text: before, size: 21, font: M.FONT, color: M.TEXT }),
    new ExternalHyperlink({
      link: url,
      children: [new TextRun({ text: url, style: "Hyperlink", color: M.GREEN, underline: {}, size: 21, font: M.FONT })],
    }),
  ];
  if (after) runs.push(new TextRun({ text: after, size: 21, font: M.FONT, color: M.TEXT }));
  return new Paragraph({ spacing: { after: 160, line: 300 }, alignment: AlignmentType.LEFT, children: runs });
}

const conclusion = [
  h1("IV. Conclusion"),

  h2("4.1. Apports personnels"),
  p("Le travail réalisé durant le stage (site vitrine, hub des applications, authentification administrateur, base de données de départ) constitue la fondation technique du projet. Toutes les fonctionnalités présentées dans ce rapport sont, elles, entièrement conçues et développées par mes soins, à domicile, après le stage, à partir de cette base. Le tableau ci-dessous en donne une vue synthétique et chiffrée."),
  table(["Critère", "Stage", "TFE (apport personnel)"], [
    ["Tables en base de données", "4", "+4 nouvelles (8 au total)"],
    ["Endpoints API REST", "17", "+30 nouveaux (47 au total)"],
    ["Module bénévoles", "aucun", "module complet (inscription, profil, niveaux)"],
    ["Gestion des événements", "aucune", "module complet (CRUD, inscriptions, retours)"],
    ["Envois d'e-mails automatiques", "réponses au contact uniquement", "confirmation, liste d'attente, groupe, réinitialisation, changement de niveau"],
    ["Export PDF", "aucun", "attestation bénévole + liste des inscrits par événement"],
  ], [2600, 2600, 4150]),
  caption("Tableau 15 — Comparaison entre le travail de stage et l'apport personnel du TFE"),

  p("Sur le plan technique, ce travail m'a permis d'approfondir Spring Security dans un contexte à deux rôles (bénévole / administrateur) avec des jetons JWT distincts, de concevoir une base de données relationnelle conforme aux bonnes pratiques de normalisation en partant du diagramme de classes jusqu'au script SQL physique, et d'intégrer des bibliothèques que je n'avais pas utilisées auparavant (iText7 pour la génération de PDF, Chart.js pour les graphiques du tableau de bord)."),
  p("Sur le plan méthodologique, il m'a surtout appris à faire évoluer une règle de gestion à partir d'un cas concret plutôt que dans l'abstrait : la règle de détection des doublons d'événements (RG-08), par exemple, a été affinée après qu'un contre-exemple précis a montré qu'une simple comparaison de titre et d'horaire était insuffisante — seule la combinaison date + lieu, indépendamment du titre, capture réellement l'intention de la règle. Cette itération m'a appris à ne jamais considérer une règle de gestion comme définitive tant qu'elle n'a pas été confrontée à un cas réel, aussi simple paraisse-t-elle sur papier."),
  p("Enfin, la nécessité de traduire l'intégralité de l'interface — y compris un tableau de bord administrateur de plus de 1400 lignes, jamais pensé au départ pour être multilingue — a été une leçon de rigueur en elle-même : elle a montré qu'une fonctionnalité transversale comme l'internationalisation ne peut pas rester une réflexion secondaire ajoutée en fin de projet, sous peine de devoir reprendre l'ensemble des écrans un à un."),
  p("Sur le plan humain, ce travail a aussi été une première expérience de traduction d'un besoin flou en spécification précise. Les entretiens avec Monsieur Seraye ne livraient pas des règles de gestion toutes faites : une phrase comme « il faudrait qu'on sache qui a vraiment participé » a dû être reformulée, question après question, jusqu'à devenir RG-14 à RG-17 (qui peut laisser un avis, à quel moment, une seule fois, avec quelle échelle de note). C'est cet exercice de reformulation, plus que l'écriture du code elle-même, qui a demandé le plus de rigueur : une règle mal comprise au départ se répercute silencieusement dans le diagramme de classes, puis dans le schéma SQL, puis dans chaque écran qui en dépend."),

  h2("4.2. Difficultés rencontrées"),
  table(["Difficulté", "Solution mise en œuvre"], [
    ["Traduction incomplète du site en trois langues : certaines pages recevaient la langue sélectionnée sans jamais l'utiliser dans leur contenu", "Audit systématique de chaque page pour vérifier que la prop lang était non seulement transmise depuis App.js, mais bien exploitée via un objet de traduction T[lang], avec repli sur le français"],
    ["Récupération de travail après une opération de migration automatisée ayant remisé (git stash) des modifications non commitées du backend", "Inspection de git stash list et git reflog pour confirmer qu'aucune donnée n'était réellement perdue, puis restauration fichier par fichier et adoption d'un rythme de commit plus fréquent"],
    ["Association automatique d'une photo pertinente à un événement ou un projet à partir de son seul titre", "Système de correspondance par mots-clés avec plusieurs variantes possibles par catégorie, sélectionnées de façon stable via un hachage du titre (Math.floorMod), plutôt qu'une image fixe par catégorie"],
    ["Cohérence stricte entre le diagramme de classes validé et les entités JPA réellement implémentées", "Vérification systématique des relations directement dans le code source (annotations @ManyToOne, @JoinColumn) avant toute mise à jour du diagramme ou du dictionnaire de données, plutôt que de faire confiance à la seule mémoire du schéma"],
    ["Adaptation du tableau de bord administrateur aux petits écrans : la barre latérale verticale devenait un bandeau horizontal illisible, aux boutons inutilement étirés", "Correction ciblée des règles CSS responsives (largeur des pastilles de navigation calculée sur leur contenu, séparateurs entre groupes) sans toucher à l'agencement du mode desktop"],
    ["Adresse postale de Terra Sana incohérente entre le pied de page du site et le service de génération d'attestations PDF", "Recherche de toutes les occurrences de l'adresse dans le code backend (PdfService) et harmonisation sur l'adresse réelle du siège"],
  ], [3550, 5800]),
  caption("Tableau 16 — Principales difficultés rencontrées et solutions apportées"),

  h2("4.3. Regard critique sur le travail réalisé"),
  p("Le module remplit ses objectifs principaux : il est fonctionnel, sécurisé, documenté et directement utilisable par Terra Sana ASBL pour remplacer la gestion actuelle par fichiers Excel. Un regard honnête permet toutefois d'en identifier les limites."),
  bullet("L'absence de suite de tests automatisés (JUnit côté backend, tests de composants côté frontend) reste une lacune dans la démarche qualité — un axe d'amélioration prioritaire si le module devait évoluer davantage. La vérification manuelle décrite en section 3.6.2, bien que systématique, ne protège pas contre une régression future introduite par inadvertance."),
  bullet("L'attribution automatique des photos d'événements et de projets, basée sur une correspondance de mots-clés, reste une heuristique et non une reconnaissance d'image réelle : elle couvre une quarantaine de catégories mais nécessite un filet de sécurité (URL manuelle) pour les sujets réellement inédits."),
  bullet("Le dashboard administrateur, bien que fonctionnel et désormais entièrement traduit en trois langues, reste pensé pour un usage interne à l'association plutôt que pour un grand nombre d'administrateurs simultanés."),
  bullet("Le système de niveaux de fidélité (RG-19) reste volontairement simple : il ne distingue pas le type d'événement, un bénévole présent à sept petites collectes atteignant le niveau OR au même titre qu'un bénévole ayant organisé sept grands événements."),
  bullet("L'environnement 100 % local, choix assumé et validé avec l'encadrement académique (section 3.6), signifie que Terra Sana ne peut pas encore utiliser le module au quotidien sans qu'un poste dédié reste allumé et configuré — un déploiement en ligne reste nécessaire avant tout usage réel par l'association, au-delà du cadre de ce TFE."),

  h2("4.4. Perspectives"),
  p("Plusieurs évolutions restent envisageables pour prolonger ce travail, une fois la phase de validation locale achevée :"),
  bullet("l'ajout d'une suite de tests automatisés (JUnit 5 / Mockito côté backend, React Testing Library côté frontend) pour sécuriser les évolutions futures des règles de gestion et remplacer, à terme, la vérification manuelle décrite en section 3.6.2 ;"),
  bullet("la mise en place de notifications en temps réel pour l'administrateur (nouvelles inscriptions, places libérées), par exemple via WebSocket, plutôt que la nécessité actuelle de rafraîchir le tableau de bord ;"),
  bullet("un déploiement en ligne du module (Railway ou équivalent pour le backend, Vercel pour le frontend), une fois la phase de validation locale terminée, pour un usage quotidien par Terra Sana ASBL sans dépendance à un poste WAMP allumé ;"),
  bullet("l'extension du système de niveaux de fidélité avec des badges thématiques (par exemple un badge par type d'événement), au-delà du seul comptage Bronze / Argent / Or, pour mieux refléter la diversité de l'engagement bénévole (section 4.3) ;"),
  bullet("l'ouverture du hub des applications internes (actuellement limité au stage) à une authentification unique partagée avec l'espace bénévole, pour que Terra Sana n'ait à terme qu'un seul système de comptes plutôt que deux univers distincts ;"),
  bullet("l'ajout d'une gestion multi-administrateurs avec des droits différenciés, envisagée dès l'analyse (section 1.5) mais volontairement écartée du périmètre pour tenir les délais de la 2ème session ;"),
  bullet("un rappel automatique envoyé aux bénévoles inscrits la veille d'un événement, en s'appuyant sur le mécanisme de tâche planifiée déjà en place pour le passage en FINISHED (section 3.2.3), afin de réduire le taux d'absentéisme constaté sur certains événements."),
  p("Aucune de ces pistes ne remet en cause l'architecture actuelle : chacune s'ajouterait comme une extension du module existant plutôt que comme une refonte, ce qui confirme, a posteriori, la solidité des choix de conception retenus dans ce TFE."),

  h2("4.5. Mot de fin"),
  p("Ce travail de fin d'études m'a permis de mener un projet de bout en bout, de l'entretien avec le commanditaire jusqu'à une application fonctionnelle : recueillir un besoin réel, le traduire en règles de gestion précises, concevoir un modèle de données cohérent, puis l'implémenter avec une pile technique orientée sécurité. Au-delà de l'aspect académique, ce module répond à un besoin concret de Terra Sana ASBL, identifié directement avec Monsieur Seraye durant le stage, et constitue un livrable que l'association pourra effectivement utiliser pour la gestion de ses bénévoles et de ses événements."),
  p("Le TFE marque la fin d'un cursus, mais pas celle de ce projet : la présentation du module à Terra Sana et la défense orale restent des étapes à venir, avec l'espoir que ce module dépasse le cadre académique et trouve, à terme, une réelle utilité quotidienne pour les bénévoles et l'équipe de Terra Sana ASBL."),
  pageBreak(),
];

const bibliographie = [
  h1("VI. Bibliographie / Webographie"),

  h3("Documentation officielle"),
  bib("Spring. (2026). Spring Boot Reference Documentation (3.5.x). https://docs.spring.io/spring-boot/docs/current/reference/html/"),
  bib("Spring. (2026). Spring Security Reference Documentation. https://docs.spring.io/spring-security/reference/"),
  bib("Spring. (2026). Spring Data JPA Reference Documentation. https://docs.spring.io/spring-data/jpa/reference/"),
  bib("Meta Open Source. (2026). React Documentation. https://react.dev/"),
  bib("Oracle. (2026). MySQL 8.0 / 9.x Reference Manual. https://dev.mysql.com/doc/refman/9.1/en/"),
  bib("Oracle. (2026). Java Platform, Standard Edition 21 Documentation. https://docs.oracle.com/en/java/javase/21/"),
  bib("iText Software. (2026). iText 7 Documentation. https://itextpdf.com/resources/api-documentation"),
  bib("MDN Web Docs. (2026). JavaScript Reference. https://developer.mozilla.org/fr/docs/Web/JavaScript"),

  h3("Outils et bibliothèques"),
  bib("jjwt (io.jsonwebtoken). (2026). Java JWT: JSON Web Token for Java. https://github.com/jwtk/jjwt"),
  bib("Chart.js. (2026). Chart.js Documentation. https://www.chartjs.org/docs/latest/"),
  bib("Apache Friends. (2026). WampServer — Windows, Apache, MySQL, PHP. https://www.wampserver.com/"),
  bib("Apache Software Foundation. (2026). Apache Maven. https://maven.apache.org/"),
  bib("GitHub. (2026). GitHub — Where the world builds software. https://github.com/"),
  bib("Microsoft. (2026). Visual Studio Code. https://code.visualstudio.com/"),
  bib("Postman. (2026). Postman API Platform Documentation. https://learning.postman.com/"),

  h3("Sécurité et bonnes pratiques"),
  bib("OWASP Foundation. (2026). OWASP Top Ten. https://owasp.org/www-project-top-ten/"),
  bib("Auth0. (2026). JWT.io — Introduction to JSON Web Tokens. https://jwt.io/introduction/"),
  bib("Jones, M., Bradley, J., & Sakimura, N. (2015). JSON Web Token (JWT) (RFC 7519). Internet Engineering Task Force. https://www.rfc-editor.org/rfc/rfc7519"),
  bib("Provos, N., & Mazières, D. (1999). A Future-Adaptable Password Scheme (BCrypt). USENIX Annual Technical Conference."),

  h3("Ressources pédagogiques"),
  bib("Baeldung. (2026). Baeldung — Java, Spring and Web Development Tutorials. https://www.baeldung.com/"),
  bib("EAFC Uccle. (2026). Consignes pour le rapport écrit de l'épreuve intégrée — Bachelier en Informatique de Gestion."),
  bib("Namur, M.-C. (2025-2026). Notes de cours d'analyse et de modélisation UML — EAFC Uccle."),
  pageBreak(),
];

const glossaire = [
  h1("V. Glossaire"),
  p("Les termes techniques suivants, utilisés à plusieurs reprises dans ce rapport, sont définis ici pour un lecteur non familier du développement web."),

  table(["Terme", "Définition"], [
    ["API REST", "Interface de programmation permettant à deux applications de communiquer via des requêtes HTTP standardisées (GET, POST, PUT, DELETE) échangeant des données au format JSON."],
    ["SPA (Single Page Application)", "Application web qui charge une seule page HTML puis met à jour son contenu dynamiquement en JavaScript, sans recharger entièrement la page à chaque navigation. Le frontend React du module en est une."],
    ["JWT (JSON Web Token)", "Jeton signé numériquement, transmis à chaque requête pour prouver l'identité de l'utilisateur, sans que le serveur n'ait besoin de conserver une session en mémoire (authentification « stateless »)."],
    ["ORM (Object-Relational Mapping)", "Technique consistant à représenter les tables d'une base de données relationnelle sous forme de classes et d'objets dans le code — Hibernate, utilisé via Spring Data JPA, en est l'implémentation Java la plus répandue."],
    ["DTO (Data Transfer Object)", "Objet dédié au transport de données entre couches (par exemple entre le backend et le frontend), distinct de l'entité stockée en base, permettant de ne jamais exposer directement la structure interne des données."],
    ["Endpoint", "Une URL précise de l'API REST, associée à une méthode HTTP (ex : POST /api/registrations/event/12), qui déclenche une action ou renvoie une donnée particulière."],
    ["Hachage (mot de passe)", "Transformation irréversible d'un mot de passe en une chaîne de caractères illisible, stockée à la place du mot de passe original — même en cas de fuite de la base de données, le mot de passe réel reste protégé."],
    ["Framework", "Ensemble structuré d'outils et de conventions (comme Spring Boot ou React) qui prend en charge les aspects techniques répétitifs d'une application, pour que le développeur se concentre sur la logique métier propre à son projet."],
    ["Migration (base de données)", "Modification contrôlée et documentée du schéma d'une base de données, permettant de faire évoluer sa structure sans perdre les données déjà existantes."],
    ["CORS (Cross-Origin Resource Sharing)", "Mécanisme de sécurité des navigateurs qui bloque, par défaut, les requêtes entre deux origines différentes (par exemple le frontend sur le port 3000 et le backend sur le port 8080) tant que le serveur ne les autorise pas explicitement."],
  ], [2400, 6950]),
  pageBreak(),
];

module.exports = { conclusion, bibliographie, glossaire };
