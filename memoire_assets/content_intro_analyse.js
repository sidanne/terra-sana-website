const M = require('./build_memoire.js');
const { h1, h2, h3, p, rt, bullet, rgItem, caption, imgPara, table, pageBreak, codeBlock, GREEN, GOLD, TEXT } = M;
const { TextRun } = require('docx');

const SCR = __dirname + '/screenshots/';

// ══════════════════════════════════════════════════════════════════════
// I. INTRODUCTION
// ══════════════════════════════════════════════════════════════════════
const introduction = [
  h1("I. Introduction"),

  h2("1.1. Présentation de Terra Sana ASBL"),
  p("Terra Sana ASBL est une association belge sans but lucratif, active à Bruxelles depuis 2019 dans les domaines de l'alimentation locale et saine, du circuit court et du bien-être communautaire. Son siège se situe au 53/3, 1200 Woluwe-Saint-Lambert. L'association organise régulièrement des ateliers, des marchés bio, des collectes et des activités communautaires, animés en grande partie par des bénévoles engagés."),
  p("Pour gérer ses différents pôles d'activité, l'association dispose de douze applications internes spécialisées (comptabilité, gestion de factures, agenda personnel, bibliothèque, etc.), dont l'accès est centralisé depuis un site web développé durant mon stage."),
  p("La mission de Terra Sana repose sur quatre piliers, mis en avant sur la page d'accueil du site (section 3.4.1) : une agriculture naturelle privilégiant les circuits courts et limitant l'usage d'intrants chimiques, une communauté inclusive ouverte à tous sans condition, un soutien direct aux producteurs locaux, et un impact reconnu localement, notamment par la Région bruxelloise qui figure parmi ses partenaires (section 3.4.7). L'activité de l'association repose structurellement sur l'engagement bénévole : sans une base de bénévoles mobilisables rapidement pour chaque événement, la plupart des activités de terrain de Terra Sana ne pourraient simplement pas avoir lieu — ce qui explique pourquoi la gestion de ces bénévoles, plutôt qu'un autre module, s'est imposée comme le sujet le plus porteur pour ce TFE (section 1.5)."),

  h2("1.2. Contexte du stage et travail réalisé avant le TFE"),
  p([rt("Mon stage s'est déroulé au sein de Terra Sana ASBL du 25 mars au 20 mai 2026, sous la supervision de Monsieur Didier Seraye, Responsable Administratif de l'association. "), rt("Avant ce stage, Terra Sana ne possédait aucune présence numérique : la communication avec les bénévoles et le public se faisait exclusivement par téléphone et par email, et la gestion administrative reposait entièrement sur des fichiers Excel et des documents papier.")]),
  p("Durant cette période, j'ai conçu et développé de zéro un site web complet servant de vitrine institutionnelle et de hub centralisé pour les douze applications internes de l'association. Le tableau ci-dessous résume les composants livrés à la fin du stage, qui constituent la fondation technique sur laquelle s'appuie le présent TFE."),

  table(
    ["Composant", "Description"],
    [
      ["Site public multilingue", "12 pages React (Accueil, À propos, Projets, Détail projet, Blog, Contact, Bénévolat, Sponsors, Confidentialité, Conditions, Cookies, Aide/FAQ), trilingue FR/EN/NL avec sélecteur de langue."],
      ["Hub des 12 applications", "Affichage dynamique de l'ensemble des applications internes de l'association, avec recherche et filtres par catégorie."],
      ["Espace administrateur", "Connexion sécurisée (JWT 24h) et dashboard permettant la gestion des projets, des articles de blog, des messages de contact et le changement de mot de passe."],
      ["API REST backend", "17 endpoints exposés sur 4 ressources (auth, projects, posts, contact), sécurisés par JWT et rôle administrateur."],
      ["Base de données", "Base MySQL de 4 tables : admin, project, blog_post et contact_message."],
      ["Envoi d'e-mails", "Réponse aux messages de contact via Gmail SMTP."],
    ],
    [2400, 6950]
  ),
  caption("Tableau 1 — Composants livrés à la fin du stage (avant le TFE)"),

  h2("1.3. Problématique"),
  p("À l'issue du stage, Terra Sana continuait de gérer ses bénévoles et ses activités de façon entièrement manuelle. Cette organisation engendrait plusieurs difficultés concrètes, identifiées avec Monsieur Seraye :"),
  bullet("des doublons et des pertes d'information lorsque plusieurs personnes modifiaient les mêmes fichiers Excel ;"),
  bullet("aucune vue d'ensemble des places disponibles sur les activités, d'où des événements surchargés ou au contraire sous-remplis ;"),
  bullet("des confirmations et des relances envoyées une à une par email, un travail répétitif et chronophage pour l'équipe ;"),
  bullet("aucun historique de participation, ni moyen de remercier les bénévoles les plus actifs ou de leur délivrer une attestation."),
  p("Ces difficultés ne sont pas propres à Terra Sana : elles sont typiques de toute petite structure associative dont l'activité croît plus vite que ses outils de gestion. Ce qui fonctionnait raisonnablement avec une poignée de bénévoles et deux événements par mois devenait, au moment du cadrage de ce TFE, un frein concret à mesure que le nombre d'activités et de bénévoles inscrits augmentait — chaque nouveau bénévole ou événement alourdissant un peu plus une charge de coordination déjà tenue à la limite du gérable."),
  p([rt("Le module développé dans le cadre de ce TFE vise précisément à centraliser et automatiser ces tâches : un espace bénévole en ligne, une gestion des événements avec places et liste d'attente, des emails de confirmation automatiques et un historique exploitable. "), rt("Ce module est développé après le stage, entièrement par mes soins et sans code préexistant : à la fin du stage, aucune ligne de code n'existait pour ces fonctionnalités.", { bold: true })]),

  h2("1.4. Objectifs et périmètre du TFE"),
  p("Ce travail poursuit un double objectif : répondre à un besoin réel et documenté de l'association, tout en démontrant la maîtrise d'un cycle complet d'analyse et de développement — du cahier des charges jusqu'à une application fonctionnelle, en environnement local. Le module à livrer couvre, dans les grandes lignes, deux volets complémentaires : côté bénévole, un espace personnel permettant de s'inscrire aux événements de l'association et de suivre sa propre participation ; côté administrateur, un outil de pilotage permettant de créer ces événements et d'en gérer les inscriptions. La liste complète et détaillée des fonctionnalités, par catégorie d'utilisateur, fait l'objet du cahier des charges (section 2.1.2)."),
  p("Le développement et la démonstration de l'application sont réalisés en environnement local (WAMP Server sous Windows) : aucun déploiement en ligne n'est prévu dans le cadre de ce TFE, ce point est détaillé en section III.6."),

  h2("1.5. Justification du périmètre retenu"),
  p("Parmi les douze applications internes que gère Terra Sana, plusieurs domaines auraient pu constituer le sujet de ce TFE : la comptabilité, la gestion de stock, ou encore la planification interne des tâches administratives. Le choix s'est porté sur la gestion des bénévoles et des événements pour trois raisons concrètes, établies directement avec Monsieur Seraye durant les entretiens de cadrage."),
  bullet("C'est le point de friction le plus régulièrement cité par l'association : contrairement à la comptabilité, tenue par une seule personne, la gestion des événements implique plusieurs bénévoles et l'administrateur simultanément, ce qui multiplie les erreurs de coordination par fichier Excel partagé."),
  bullet("Le périmètre est suffisamment autonome pour être livré et démontré indépendamment des autres applications internes de l'association, sans dépendance à un système existant à intégrer."),
  bullet("Il couvre naturellement l'ensemble des briques attendues d'un TFE en Bachelier Informatique de Gestion : authentification à deux rôles, modélisation de données relationnelles avec contraintes réelles, logique métier non triviale (liste d'attente, niveaux de fidélité) et génération de documents PDF."),
  p("Certaines fonctionnalités, envisagées un temps durant l'analyse, ont été volontairement écartées du périmètre livré pour rester réalisable dans les délais de la 2ème session : la synchronisation avec un calendrier externe (Google Calendar), la mise en place de notifications push, et une gestion multi-administrateurs avec des droits différenciés. Ces pistes sont reprises comme perspectives d'évolution en section IV.4."),

  h2("1.6. Sources d'information"),
  p("Les informations utilisées pour concevoir ce module proviennent de plusieurs sources complémentaires, réunies pendant et après le stage :"),
  bullet("des entretiens avec Monsieur Didier Seraye afin de comprendre les besoins réels, le fonctionnement quotidien de l'association et les points de friction dans la gestion actuelle des bénévoles et des événements ;"),
  bullet("l'analyse des fichiers Excel utilisés à ce jour, pour identifier les données à structurer (identité des bénévoles, historiques d'ateliers, listes d'inscrits) ;"),
  bullet("la documentation officielle des technologies retenues (Spring Boot, React, Spring Security, JavaMail, iText) ainsi que les bonnes pratiques REST et de sécurité en vigueur ;"),
  bullet("les consignes de l'EAFC Uccle pour la rédaction du présent rapport et la structuration du dossier d'analyse."),
  p("Ces sources ne sont pas mobilisées de façon isolée : les entretiens avec Monsieur Seraye ont fixé les grandes lignes du besoin (section 1.3), les fichiers Excel existants ont permis de vérifier concrètement quels champs de données étaient réellement suivis par l'association avant de les faire figurer dans le dictionnaire de données (section 2.2.2), et la documentation officielle des technologies a servi de référence à chaque choix d'implémentation détaillé dans le dossier technique (section III), plutôt que d'être consultée après coup pour justifier un choix déjà fait."),
  pageBreak(),
];

// ══════════════════════════════════════════════════════════════════════
// II. DOSSIER D'ANALYSE
// ══════════════════════════════════════════════════════════════════════
const analyse = [
  h1("II. Dossier d'analyse"),
  p("Le dossier d'analyse constitue le cœur de la réflexion menée avant le développement. Il formalise les besoins du module, définit précisément les cas d'utilisation, modélise les données et établit la structure physique de la base de données. Cette section couvre successivement le cahier des charges, le diagramme de cas d'utilisation, les règles de gestion, puis la persistance des données (diagramme de classes, dictionnaire de données, schéma SQL)."),

  h2("2.1. Cahier des charges"),

  h3("2.1.1. Objectifs et contexte d'utilisation"),
  p("Le module à livrer étend le site vitrine développé pendant le stage en y intégrant une gestion complète des bénévoles et des événements de Terra Sana ASBL. Il s'adresse à deux catégories d'utilisateurs bien distinctes, aux besoins différents : les bénévoles, qui consultent et s'inscrivent aux événements depuis chez eux, et l'administrateur unique de l'association, qui pilote l'ensemble depuis un tableau de bord."),
  p("Contrairement à une application e-commerce classique, il n'y a ici ni panier, ni paiement, ni gestion de stock : la ressource centrale à gérer est la place disponible à un événement, avec une contrainte de capacité (maxPlaces) et un mécanisme de liste d'attente lorsque cette capacité est atteinte. C'est cette logique de réservation à capacité limitée, combinée à un système de validation manuelle par l'administrateur, qui structure l'ensemble des règles de gestion détaillées en section 2.1.5."),

  h3("2.1.2. Catégories d'utilisateurs et fonctionnalités"),
  p("Trois profils interagissent avec le système : le Visiteur, non authentifié, qui peut consulter le site et les événements publics ; le Bénévole, un visiteur ayant créé un compte, qui accède à son espace personnel et peut s'inscrire aux événements ; et l'Administrateur, rôle unique côté Terra Sana, qui gère l'ensemble des événements, des bénévoles et des inscriptions. Le tableau ci-dessous détaille les fonctionnalités livrées pour chacun."),

  table(
    ["Module", "Fonctionnalité", "Rôle"],
    [
      ["Compte bénévole", "Création de compte, connexion (JWT dédié), mot de passe oublié, modification du profil", "Bénévole"],
      ["Événements", "Consultation des événements à venir et passés, avec places restantes", "Visiteur"],
      ["Inscriptions", "S'inscrire, rejoindre la liste d'attente si complet, se désinscrire librement", "Bénévole"],
      ["Historique", "Consultation de l'historique de participation, téléchargement d'attestation PDF", "Bénévole"],
      ["Avis", "Laisser un avis noté (1 à 5) après un événement terminé auquel on a participé", "Bénévole"],
      ["Niveau de fidélité", "Calcul automatique Bronze / Argent / Or selon les participations confirmées", "Système"],
      ["Gestion des événements", "Créer, modifier, changer le statut, supprimer un événement", "Admin"],
      ["Gestion des inscriptions", "Valider ou refuser une inscription, voir la liste d'attente par événement", "Admin"],
      ["Communication", "Email de confirmation automatique, envoi d'emails groupés aux inscrits", "Admin"],
      ["Export", "Export PDF de la liste des inscrits à un événement", "Admin"],
      ["Gestion des bénévoles", "Liste complète avec filtres par compétence, disponibilité et langue", "Admin"],
      ["Tableau de bord", "Statistiques (bénévoles actifs, événements, taux de participation), graphiques", "Admin"],
    ],
    [2200, 5400, 1750]
  ),
  caption("Tableau 2 — Fonctionnalités du module, par catégorie d'utilisateur"),

  p("Le compte bénévole (RG-01 à RG-04) constitue le point d'entrée : au-delà de l'email et du mot de passe, il collecte des informations facultatives — compétences, disponibilités, ville — que l'administrateur utilise ensuite pour cibler ses recherches lorsqu'il prépare un événement nécessitant un profil particulier (par exemple des compétences culinaires pour un atelier cuisine)."),
  p("La consultation des événements est volontairement ouverte à tout visiteur, sans compte : Terra Sana souhaitait que la vitrine de ses activités reste visible publiquement, la création de compte n'intervenant qu'au moment de vouloir réellement s'inscrire. Cette distinction se reflète directement dans SecurityConfig (section 3.5.2), où les routes de lecture des événements sont publiques alors que l'inscription elle-même exige un jeton."),
  p("Les inscriptions et la liste d'attente (RG-09 à RG-14) forment le cœur fonctionnel du module, détaillé pas à pas dans les diagrammes de séquence de la section 2.3. Le bénévole y garde la main sur sa désinscription à tout moment avant le début de l'événement, tandis que la confirmation d'une inscription reste toujours un acte explicite de l'administrateur — le système ne confirme jamais automatiquement une première inscription, seule une promotion depuis la liste d'attente l'est (RG-13)."),
  p("La gestion des avis et le niveau de fidélité (RG-15 à RG-20) ajoutent une dimension incitative absente du fonctionnement précédent, entièrement manuel : un bénévole voit concrètement sa progression, et Terra Sana dispose d'un indicateur simple pour identifier ses bénévoles les plus engagés sans avoir à dépouiller des fichiers Excel."),
  p("Côté administration, la gestion des événements, des inscriptions et des bénévoles (dernières lignes du tableau) reproduit numériquement ce que Monsieur Seraye effectuait jusque-là à la main : créer un événement, suivre qui s'y inscrit, relancer par email, exporter une liste pour l'impression. Le tableau de bord ajoute une couche que le processus manuel ne pouvait pas offrir : une vue statistique agrégée de l'activité de l'association sur les derniers mois."),

  h3("2.1.3. Besoins non-fonctionnels"),
  p("Au-delà des fonctionnalités elles-mêmes, plusieurs exigences transversales conditionnent la qualité du module. Elles sont résumées dans le tableau ci-dessous et se retrouvent, pour la plupart, traduites directement en règles de gestion en section 2.1.5."),
  table(["Catégorie", "Exigence", "Détail"], [
    ["Sécurité", "Authentification JWT", "Chaque requête vers une ressource protégée porte un jeton signé ; les routes publiques sont limitées à l'inscription, la connexion et la consultation du site"],
    ["Sécurité", "Isolation des données", "Un bénévole ne peut accéder ou agir que sur ses propres inscriptions, avis et informations de profil"],
    ["Sécurité", "Hachage des mots de passe", "Aucun mot de passe n'est jamais stocké ni transmis en clair (BCrypt)"],
    ["Fiabilité", "Cohérence des places", "Le nombre de places disponibles affiché correspond toujours au nombre réel d'inscriptions confirmées, recalculé à la demande"],
    ["Maintenabilité", "Architecture en couches", "Séparation stricte Controller / Service / Repository, propice à l'évolution indépendante de chaque module fonctionnel"],
    ["Ergonomie", "Interface multilingue", "Le site, y compris le dashboard administrateur, est utilisable en français, anglais et néerlandais"],
    ["Disponibilité", "Environnement local", "L'application doit rester pleinement fonctionnelle en démonstration locale, sans dépendance à un service cloud"],
  ], [2000, 2600, 4550]),
  caption("Tableau 3 — Besoins non-fonctionnels du module"),

  h3("2.1.4. Diagramme de cas d'utilisation"),
  p("Le diagramme ci-dessous représente les interactions entre les trois acteurs identifiés et les fonctionnalités offertes par le module. Le Bénévole étend le Visiteur par généralisation (« est un »), puisque tout bénévole reste un visiteur capable de consulter le site public ; le cas d'utilisation « Valider / refuser les inscriptions » inclut systématiquement l'envoi d'un email de confirmation."),
  ...imgPara(SCR + "diagramme_cas_utilisation.png", 580, 532, "Figure 1 — Diagramme de cas d'utilisation du module bénévoles et événements"),

  p("Côté bénévole, le diagramme distingue volontairement deux blocs de cas d'utilisation reliés au même acteur : les cas accessibles dès la consultation du site (consulter le site vitrine, consulter les événements, créer un compte) et ceux qui exigent d'être connecté (gérer son profil, s'inscrire, se désinscrire, laisser un avis, télécharger une attestation). Cette distinction reflète directement la séparation des routes publiques et protégées définie dans SecurityConfig (section 3.5.2) : rien dans le diagramme ne suppose une contrainte technique qui ne soit pas également appliquée dans le code."),
  p("Côté administration, le cas « Valider / refuser les inscriptions » inclut (relation «include») l'envoi d'un email de confirmation : ce sous-cas n'est jamais déclenché seul, il fait partie intégrante de la validation elle-même, conformément à RG-12. Le cas « S'inscrire à un événement » est quant à lui étendu (relation «extend») par « Rejoindre la liste d'attente », qui ne s'active que dans la situation particulière où l'événement est déjà complet — une extension optionnelle du comportement de base plutôt qu'un cas d'utilisation systématique."),

  h3("2.1.5. Règles de gestion"),
  p("Les règles de gestion ci-dessous décrivent le comportement métier implémenté dans le code, tel que validé dans le dossier d'analyse. Chaque règle porte un numéro unique (RG-01 à RG-25), référencé tout au long de ce rapport dès qu'un écran, une table ou un extrait de code en dépend directement. Elles sont regroupées par thématique, dans l'ordre où un bénévole les rencontre concrètement : d'abord son compte, puis les événements auxquels il peut s'inscrire, le cycle de vie de son inscription, les avis qu'il peut laisser, son niveau de fidélité, ses attestations, et enfin les mécanismes transversaux de sécurité."),

  h3("A. Comptes bénévoles"),
  p("Ce premier groupe encadre la création et la gestion du compte : il garantit qu'un email identifie une personne unique, que le mot de passe ne peut jamais fuiter en clair, et qu'un compte problématique peut être neutralisé sans perdre l'historique associé — un point important pour Terra Sana, qui souhaite conserver une trace des participations passées même après le départ d'un bénévole."),
  rgItem("RG-01", "L'adresse email d'un bénévole est unique dans le système : elle sert d'identifiant de connexion et empêche la création de doublons."),
  rgItem("RG-02", "Le mot de passe compte au moins 8 caractères et est stocké haché (BCrypt) ; il n'est jamais consultable en clair."),
  rgItem("RG-03", "Un compte bénévole peut être désactivé sans être supprimé (isActive = false), afin de conserver l'historique des inscriptions passées."),
  rgItem("RG-04", "La demande de réinitialisation du mot de passe utilise un jeton à usage unique valable 30 minutes, envoyé par email."),

  h3("B. Événements"),
  p("Ce deuxième groupe fixe les données minimales qu'un événement doit porter pour être exploitable (date, lieu, capacité), la façon dont son statut évolue de lui-même au fil du temps, et une garde-fou pratique demandé directement par Monsieur Seraye après qu'un doublon de créneau se soit déjà produit dans les fichiers Excel de l'association."),
  rgItem("RG-05", "Chaque événement porte obligatoirement une date, un lieu et un nombre maximum de participants."),
  rgItem("RG-06", "Le statut d'un événement évolue automatiquement : OPEN par défaut, FULL dès que toutes les places sont prises, FINISHED une fois la date passée, CANCELLED uniquement sur décision explicite de l'administrateur."),
  rgItem("RG-07", "Un événement passé (FINISHED ou CANCELLED) n'accepte plus de nouvelles inscriptions."),
  rgItem("RG-08", "Deux événements ne peuvent pas être créés à la même date et au même lieu, indépendamment de leur titre, afin d'éviter les doublons accidentels."),

  h3("C. Inscriptions et liste d'attente"),
  p("Ce troisième groupe est le plus dense, car il porte le cœur métier du module : garantir qu'une place ne soit jamais attribuée deux fois, offrir une liste d'attente lorsque la capacité est atteinte, et automatiser autant que possible la communication avec le bénévole à chaque étape, sans jamais retirer à l'administrateur le dernier mot sur une validation."),
  rgItem("RG-09", "Un bénévole ne peut s'inscrire qu'une seule fois au même événement (contrainte d'unicité sur le couple bénévole + événement)."),
  rgItem("RG-10", "Si l'événement est complet au moment de l'inscription, le bénévole est placé automatiquement en liste d'attente (status = WAITING) avec une position calculée selon l'ordre d'arrivée."),
  rgItem("RG-11", "Toute inscription reste en attente de validation ; l'administrateur doit explicitement la confirmer ou la refuser."),
  rgItem("RG-12", "Un email de confirmation est envoyé automatiquement au bénévole lors de chaque validation ou refus."),
  rgItem("RG-13", "Lorsqu'une place se libère à la suite d'une désinscription confirmée, le premier bénévole en liste d'attente est promu automatiquement (WAITING → CONFIRMED) et notifié par email."),
  rgItem("RG-14", "Le bénévole peut se désinscrire librement tant que l'événement n'est pas commencé."),

  h3("D. Avis (retours post-événement)"),
  p("Ce quatrième groupe encadre les retours laissés par les bénévoles : ils ne sont recevables que de la part de participants ayant réellement pris part à l'événement, et seulement une fois celui-ci terminé, afin d'éviter les avis anticipés ou de complaisance."),
  rgItem("RG-15", "Seul un bénévole ayant effectivement participé à un événement (inscription CONFIRMED) peut laisser un avis."),
  rgItem("RG-16", "Un avis ne peut être laissé qu'après la fin de l'événement (status = FINISHED)."),
  rgItem("RG-17", "Un bénévole ne peut laisser qu'un seul avis par événement."),
  rgItem("RG-18", "La note est obligatoirement comprise entre 1 et 5."),

  h3("E. Niveau de fidélité"),
  p("Ce cinquième groupe traduit un besoin explicitement formulé par Terra Sana lors des entretiens : reconnaître l'engagement des bénévoles les plus actifs sans mettre en place un système de points complexe. Le niveau reste un indicateur simple, recalculé automatiquement, sans intervention manuelle de l'administrateur."),
  rgItem("RG-19", "Le niveau du bénévole est calculé automatiquement à partir de son nombre de participations confirmées : BRONZE (1 à 2 événements), ARGENT (3 à 6), OR (7 et plus)."),
  rgItem("RG-20", "Un email de notification est envoyé au bénévole lors du passage à un nouveau niveau."),

  h3("F. Attestations et exports"),
  p("Ce sixième groupe répond directement à l'une des difficultés identifiées en introduction : l'absence de tout moyen, avant ce module, de délivrer une preuve de participation à un bénévole. L'attestation devient accessible en libre-service, sous réserve d'une participation réellement confirmée."),
  rgItem("RG-21", "Une attestation PDF de participation ne peut être générée que si le bénévole a au moins une participation confirmée à un événement terminé."),
  rgItem("RG-22", "L'export PDF de la liste des inscrits d'un événement est réservé à l'administrateur."),

  h3("G. Sécurité et accès"),
  p("Ce dernier groupe fixe les garanties transversales de sécurité, applicables à l'ensemble du module plutôt qu'à un module fonctionnel en particulier : durée de vie des jetons, séparation stricte entre les droits d'un bénévole et ceux de l'administrateur."),
  rgItem("RG-23", "Toute action nécessitant un compte est protégée par un jeton JWT valable 24 heures ; l'expiration force la reconnexion."),
  rgItem("RG-24", "Les endpoints d'administration sont accessibles uniquement aux comptes disposant du rôle administrateur."),
  rgItem("RG-25", "Les tokens de bénévole et d'administrateur sont émis séparément, avec des secrets et des durées de vie distincts."),

  h3("2.1.6. Comparaison avec le fonctionnement manuel antérieur"),
  p("Pour mesurer concrètement l'apport du module, le tableau ci-dessous met en regard, tâche par tâche, la façon dont Terra Sana procédait avant ce TFE (section 1.3) et la façon dont la même tâche est désormais prise en charge automatiquement, avec la ou les règles de gestion qui la garantissent."),
  table(["Tâche", "Avant (fichiers Excel / email)", "Après (module TFE)"], [
    ["Suivi des places disponibles", "Recomptage manuel des inscrits dans un fichier partagé, souvent désynchronisé", "Décompte automatique des inscriptions CONFIRMED, jamais stocké en dur (RG-06)"],
    ["Gestion du dépassement de capacité", "Aucune règle : les événements étaient acceptés sans limite, ou refusés au cas par cas", "Bascule automatique en liste d'attente dès que maxPlaces est atteint (RG-10)"],
    ["Confirmation d'une inscription", "Réponse individuelle par email, rédigée manuellement pour chaque bénévole", "Email automatique généré à chaque validation ou refus (RG-12)"],
    ["Suivi d'un désistement", "Aucun mécanisme pour recontacter la liste d'attente : la place restait perdue", "Promotion automatique du premier bénévole en attente, avec notification (RG-13)"],
    ["Preuve de participation", "Inexistante : aucun document n'était délivré aux bénévoles", "Attestation PDF téléchargeable en libre-service après participation confirmée (RG-21)"],
    ["Reconnaissance de l'engagement", "Aucune, faute d'historique consolidé et exploitable", "Niveau de fidélité calculé automatiquement à partir de l'historique réel (RG-19)"],
    ["Détection des doublons de créneaux", "Aucune, à l'origine d'un incident concret ayant motivé la règle RG-08", "Rejet automatique à la création d'un événement au même lieu et à la même date"],
  ], [2400, 3450, 3300]),
  caption("Tableau 4 — Comparaison entre le fonctionnement manuel antérieur et le module TFE"),

  h3("2.1.7. D'une règle de gestion à son implémentation : l'exemple de RG-08"),
  p("Pour illustrer concrètement le passage d'une règle de gestion à son implémentation, cette section détaille RG-08, dont la version définitive résulte directement d'un contre-exemple rencontré en cours de développement (repris en section 4.1). Une première version comparait le titre et l'horaire exacts de deux événements pour détecter un doublon ; elle s'est révélée insuffisante face à deux événements portant des titres légèrement différents (« location des voitures » et « locations des voitures ») mais créés au même lieu, le même jour — un doublon réel que cette première version ne détectait pas. La méthode checkNoDuplicate d'EventService, appelée aussi bien à la création qu'à la modification d'un événement, applique la version corrigée :"),
  codeBlock([
    "// Empêche de créer/déplacer un événement vers le même jour + le même lieu qu'un",
    "// événement déjà existant, indépendamment du titre.",
    "private void checkNoDuplicate(String location, LocalDateTime eventDate, Long excludeId) {",
    "    LocalDateTime startOfDay = eventDate.toLocalDate().atStartOfDay();",
    "    LocalDateTime endOfDay = startOfDay.plusDays(1);",
    "    boolean duplicate = eventRepo",
    "        .findByEventDateBetweenAndLocationIgnoreCase(startOfDay, endOfDay, location)",
    "        .stream()",
    "        .anyMatch(e -> !e.getId().equals(excludeId));",
    "    if (duplicate) {",
    "        throw new RuntimeException(\"Un événement existe déjà le \"",
    "            + eventDate.format(DUPLICATE_MSG_FMT) + \" à \" + location + \".\");",
    "    }",
    "}",
  ]),
  p("Deux détails techniques méritent d'être relevés. D'abord, la comparaison se fait sur une plage de la journée entière (startOfDay à endOfDay) plutôt que sur l'horaire exact, afin que deux événements à 9h et à 15h le même jour et au même lieu soient bien détectés comme un doublon. Ensuite, le paramètre excludeId permet à la méthode d'être appelée aussi bien à la création (excludeId = null, aucun événement à exclure) qu'à la modification (excludeId = l'identifiant de l'événement en cours d'édition, afin qu'un événement ne se voie pas signalé comme son propre doublon lorsqu'on modifie simplement sa description sans changer ni la date ni le lieu)."),
  pageBreak(),
];

module.exports = { introduction, analyse };
