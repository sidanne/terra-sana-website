const M = require('./build_memoire.js');
const { h1, h2, h3, p, rt, bullet, caption, imgPara, table, pageBreak, codeBlock } = M;

const SCR = __dirname + '/screenshots/';

const persistance = [
  h2("2.2. Persistance des données"),
  p("Le module interagit avec une base de données relationnelle MySQL. Cette section présente les trois livrables demandés par les consignes : le diagramme de classes, le dictionnaire de données qui le documente, puis le schéma physique de la base."),

  h3("2.2.1. Diagramme de classes"),
  p("Le diagramme de classes ci-dessous modélise la structure statique de l'application : huit entités, leurs attributs, leurs méthodes et les associations qui les relient. Conformément aux consignes, les clés étrangères ne sont pas dupliquées comme attributs dans les classes : seules les associations nommées, portées par les liens entre classes, expriment ces relations. S'agissant d'un sujet personnel construit après le stage, ce diagramme a été soumis à Madame Marie-Christine Namur et validé par elle avant le début du développement ; il n'a plus été modifié depuis, conformément à cette validation."),
  p([rt("Admin, Project, BlogPost et ContactMessage"), rt(" proviennent du site existant, livré durant le stage. "), rt("AppUser, Event, Registration et Review"), rt(" sont les quatre entités créées spécifiquement pour ce TFE. Trois énumérations (EventStatus, Level, RegistrationStatus) typent les attributs à valeurs fermées et sont reliées par une dépendance en trait pointillé aux classes qui les utilisent.")]),
  ...imgPara(SCR + "diagramme_classes.png", 580, 674, "Figure 2 — Diagramme de classes du module bénévoles et événements"),

  p("Les neuf associations du diagramme se lisent comme suit : un Admin gère plusieurs Project, publie plusieurs BlogPost, reçoit plusieurs ContactMessage et crée plusieurs Event (relations 1 — 0..*) ; un Admin valide 0 ou plusieurs Registration (relation 0..1 — 0..* côté Registration, puisqu'une inscription n'a pas encore d'administrateur validateur tant qu'elle est en attente) ; un AppUser rédige plusieurs Review et effectue plusieurs Registration ; enfin, un Event accueille plusieurs Registration et concerne plusieurs Review."),

  h3("2.2.2. Dictionnaire de données"),
  p("Le dictionnaire ci-dessous reprend l'ensemble des tables de la base MySQL terresana, à la fois celles héritées du stage et les quatre nouvelles tables créées pour le module TFE. Conformément aux consignes, il précise, pour chaque champ, le type SQL, les contraintes et le rôle métier — sans mentionner les clés étrangères, déjà exprimées par les associations nommées du diagramme de classes (section 2.2.1) ; elles ne réapparaissent qu'au niveau du schéma physique (section 2.2.3), seul niveau où la clé étrangère est une réalité technique et non plus une redondance."),

  p([rt("Tables héritées du stage", { bold: true, color: M.GREEN })]),

  table(["Champ", "Type SQL", "Contrainte", "Description"],
    [["id", "BIGINT", "PK, AUTO_INCREMENT", "Identifiant."], ["username", "VARCHAR(100)", "NOT NULL, UNIQUE", "Identifiant de connexion."], ["password", "VARCHAR(255)", "NOT NULL", "Mot de passe haché (BCrypt)."]],
    [1400, 1650, 2500, 3800]),
  caption("Table admin — compte administrateur unique"),

  table(["Champ", "Type SQL", "Contrainte", "Description"],
    [["id", "BIGINT", "PK, AUTO_INCREMENT", "Identifiant."], ["name", "VARCHAR(200)", "NOT NULL", "Nom de l'application."], ["description", "TEXT", "NOT NULL", "Présentation."], ["link, documentation_link", "VARCHAR(500)", "NULL", "URL vers l'app et sa doc."], ["image, category", "VARCHAR(255)", "NULL", "Illustration et catégorie."], ["is_active", "BOOLEAN", "DEFAULT TRUE", "Visible ou non sur le hub."], ["created_at", "DATETIME", "NOT NULL", "Date de création."]],
    [1400, 1650, 2500, 3800]),
  caption("Table project — applications du hub interne"),

  table(["Champ", "Type SQL", "Contrainte", "Description"],
    [["id", "BIGINT", "PK, AUTO_INCREMENT", "Identifiant."], ["title, content", "VARCHAR / TEXT", "NOT NULL", "Contenu de l'article."], ["image", "VARCHAR(255)", "NULL", "Illustration."], ["is_published", "BOOLEAN", "DEFAULT FALSE", "Publié ou brouillon."], ["created_at", "DATETIME", "NOT NULL", "Date de rédaction."]],
    [1400, 1650, 2500, 3800]),
  caption("Table blog_post — articles du blog"),

  table(["Champ", "Type SQL", "Contrainte", "Description"],
    [["id", "BIGINT", "PK, AUTO_INCREMENT", "Identifiant."], ["name, email", "VARCHAR(255)", "NOT NULL", "Coordonnées de l'expéditeur."], ["message", "VARCHAR(5000)", "NOT NULL", "Contenu du message."], ["is_read", "BOOLEAN", "DEFAULT FALSE", "Traité ou non."], ["created_at", "DATETIME", "NOT NULL", "Date de réception."]],
    [1400, 1650, 2500, 3800]),
  caption("Table contact_message — messages du formulaire de contact"),

  p([rt("Nouvelles tables du module TFE", { bold: true, color: M.GREEN })]),
  p("app_users porte l'ensemble du profil bénévole. Seuls quatre champs sont obligatoires (nom, prénom, email, mot de passe) ; tous les autres — téléphone, ville, compétences, disponibilités — restent facultatifs, conformément au principe de minimisation des données appliqué sur le formulaire d'inscription (section 3.4.2). Le champ level est dénormalisé à dessein : plutôt que de recalculer le niveau à chaque affichage à partir de l'historique complet des inscriptions, il est stocké et mis à jour explicitement par updateLevel() (section 3.3.3), ce qui évite de recompter les participations confirmées à chaque chargement du profil."),

  table(["Champ", "Type SQL", "Contrainte", "Description"],
    [
      ["id", "BIGINT", "PK, AUTO_INCREMENT", "Identifiant."],
      ["first_name, last_name", "VARCHAR(100)", "NOT NULL", "Identité du bénévole."],
      ["email", "VARCHAR(200)", "NOT NULL, UNIQUE", "Email de connexion (RG-01)."],
      ["password", "VARCHAR(255)", "NOT NULL", "Haché BCrypt (RG-02)."],
      ["phone, birth_date, gender", "VARCHAR / DATE", "NULL", "Coordonnées facultatives."],
      ["city, postal_code", "VARCHAR(255)", "NULL", "Localité."],
      ["skills, availability", "TEXT / VARCHAR", "NULL", "Compétences et disponibilités."],
      ["preferred_language", "VARCHAR(5)", "DEFAULT 'fr'", "Langue préférée (FR/EN/NL)."],
      ["level", "VARCHAR(10)", "DEFAULT 'BRONZE'", "BRONZE / ARGENT / OR (RG-19)."],
      ["is_active", "BOOLEAN", "DEFAULT TRUE", "Compte actif (RG-03)."],
      ["reset_token", "VARCHAR(255)", "NULL", "Jeton de réinitialisation (RG-04)."],
      ["reset_token_expiry", "DATETIME", "NULL", "Expiration du jeton."],
      ["created_at", "DATETIME", "NOT NULL", "Date d'inscription."],
    ],
    [1900, 1650, 2100, 3600]),
  caption("Table app_users — bénévoles"),

  p("events porte les données propres à chaque activité organisée par Terra Sana, ainsi qu'une référence vers l'administrateur qui l'a créée — utile dès lors que Terra Sana envisagerait, à l'avenir, plusieurs comptes administrateurs (section 4.4). Le champ status n'est pas laissé au libre choix de l'administrateur : seule la valeur CANCELLED lui est réellement ouverte, OPEN/FULL/FINISHED étant recalculés par EventService selon le remplissage et la date (RG-06)."),

  table(["Champ", "Type SQL", "Contrainte", "Description"],
    [
      ["id", "BIGINT", "PK, AUTO_INCREMENT", "Identifiant."],
      ["title", "VARCHAR(255)", "NOT NULL", "Titre."],
      ["description", "TEXT", "NOT NULL", "Description complète."],
      ["event_date", "DATETIME", "NOT NULL", "Date et heure (RG-05)."],
      ["location", "VARCHAR(300)", "NOT NULL", "Lieu."],
      ["max_places", "INT", "NOT NULL", "Nombre de places (RG-05)."],
      ["status", "VARCHAR(20)", "DEFAULT 'OPEN'", "OPEN/FULL/CANCELLED/FINISHED (RG-06)."],
      ["image_url", "VARCHAR(500)", "NULL", "Illustration."],
      ["created_at", "DATETIME", "NOT NULL", "Date de création."],
    ],
    [1900, 1650, 2100, 3600]),
  caption("Table events — événements"),

  p("registrations est la table pivot du module, associant un bénévole et un événement, et retraçant également quel administrateur a traité la demande. Tant que l'administrateur n'a pas explicitement statué (RG-11), cette information de traitement reste vide, ce qui permet de distinguer une inscription encore en attente d'une inscription refusée sans ambiguïté. La contrainte d'unicité porte à elle seule toute la garantie de RG-09, indépendamment de ce que vérifie ou non le code applicatif au moment de l'insertion."),

  table(["Champ", "Type SQL", "Contrainte", "Description"],
    [
      ["id", "BIGINT", "PK, AUTO_INCREMENT", "Identifiant."],
      ["status", "VARCHAR(20)", "NOT NULL, DEFAULT 'WAITING'", "CONFIRMED / WAITING / REFUSED."],
      ["position", "INT", "NULL", "Position en liste (RG-10)."],
      ["created_at", "DATETIME", "NOT NULL", "Date d'inscription."],
      ["—", "—", "Unicité", "Un bénévole ne peut avoir qu'une seule inscription par événement (RG-09)."],
    ],
    [1900, 1650, 2100, 3600]),
  caption("Table registrations — inscriptions et liste d'attente"),

  p("reviews associe, comme registrations, un bénévole (RG-15) et un événement, avec la même contrainte d'unicité, mais répond à un besoin différent : elle ne trace pas une participation, mais un avis, et n'existe que pour les événements réellement terminés. La contrainte CHECK sur rating traduit directement RG-18 au niveau base de données, en complément — et non à la place — de la validation déjà effectuée côté frontend et côté service. La note moyenne affichée sur le tableau de bord (section 3.4.6) n'est, comme les places disponibles d'un événement, jamais stockée : elle est recalculée à chaque consultation à partir de l'ensemble des avis de l'événement — reviews.stream().mapToInt(Review::getRating).average() — plutôt que maintenue comme un total glissant qui risquerait de se désynchroniser des avis réellement en base."),

  table(["Champ", "Type SQL", "Contrainte", "Description"],
    [
      ["id", "BIGINT", "PK, AUTO_INCREMENT", "Identifiant."],
      ["rating", "INT", "NOT NULL, CHECK 1..5", "Note (RG-18)."],
      ["comment", "TEXT", "NULL", "Commentaire libre."],
      ["created_at", "DATETIME", "NOT NULL", "Date de l'avis."],
      ["—", "—", "Unicité", "Un bénévole ne peut laisser qu'un seul avis par événement (RG-17)."],
    ],
    [1900, 1650, 2100, 3600]),
  caption("Table reviews — retours post-événement"),

  h3("2.2.3. Schéma physique de la base de données"),
  p("Le schéma physique découle directement du diagramme de classes et du dictionnaire de données ci-dessus : chaque entité devient une table, chaque association devient une clé étrangère avec une contrainte référentielle. La base respecte les règles de normalisation (3NF). Le script SQL complet (création des huit tables, contraintes et index) est reproduit intégralement en Annexe A ; un extrait représentatif — la création des tables events et registrations, qui concentrent l'essentiel des règles de gestion — est présenté ci-dessous."),
  codeBlock([
    "CREATE TABLE events (",
    "  id BIGINT AUTO_INCREMENT PRIMARY KEY,",
    "  admin_id BIGINT, title VARCHAR(255) NOT NULL,",
    "  description TEXT NOT NULL, event_date DATETIME NOT NULL,",
    "  location VARCHAR(300) NOT NULL, max_places INT NOT NULL,",
    "  status VARCHAR(20) NOT NULL DEFAULT 'OPEN', image_url VARCHAR(500),",
    "  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,",
    "  CONSTRAINT fk_event_admin FOREIGN KEY (admin_id) REFERENCES admin(id)",
    ");",
    "",
    "CREATE TABLE registrations (",
    "  id BIGINT AUTO_INCREMENT PRIMARY KEY,",
    "  user_id BIGINT NOT NULL, event_id BIGINT NOT NULL, validated_by_id BIGINT,",
    "  status VARCHAR(20) NOT NULL DEFAULT 'WAITING', position INT,",
    "  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,",
    "  CONSTRAINT uq_user_event UNIQUE (user_id, event_id),",
    "  CONSTRAINT fk_reg_user FOREIGN KEY (user_id) REFERENCES app_users(id) ON DELETE CASCADE,",
    "  CONSTRAINT fk_reg_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,",
    "  CONSTRAINT fk_reg_admin FOREIGN KEY (validated_by_id) REFERENCES admin(id)",
    ");",
  ]),

  p("La normalisation en troisième forme normale se vérifie concrètement sur chaque table : aucun champ n'est une donnée calculable à partir d'autres champs de la même ligne (le nombre de places disponibles d'un événement, par exemple, n'est jamais stocké — il est recalculé à la demande à partir du décompte des inscriptions CONFIRMED, évitant tout risque d'incohérence entre une valeur stockée et la réalité des inscriptions), et chaque attribut non-clé dépend de la clé primaire entière plutôt que d'une partie de celle-ci. La contrainte UNIQUE(user_id, event_id) sur registrations et reviews illustre ce même souci : plutôt que de vérifier applicativement qu'un bénévole ne s'inscrit pas deux fois (RG-09) ou n'avise pas deux fois (RG-17), la contrainte est portée par la base elle-même, qui rejette toute tentative d'insertion en doublon indépendamment du code applicatif qui l'a produite."),
  p("Deux stratégies de suppression en cascade sont appliquées de façon différenciée : ON DELETE CASCADE sur les clés étrangères vers app_users et events (la suppression d'un bénévole ou d'un événement entraîne logiquement celle de ses inscriptions et avis), mais aucune suppression en cascade n'est définie vers admin, précisément parce que RG-03 impose qu'un compte bénévole soit désactivé plutôt que supprimé — la cascade ne s'applique donc en pratique jamais dans ce sens pour les données de bénévoles actifs."),

  h2("2.3. Autres diagrammes UML"),
  p("Cette section ajoute deux diagrammes d'état UML, chacun modélisant le cycle de vie complet d'une entité du module à travers ses transitions possibles — le pendant dynamique du diagramme de classes, qui ne décrit que la structure statique. Chaque diagramme est accompagné d'un tableau détaillant, transition par transition, la règle de gestion qui la déclenche."),
  p("Le premier retrace le cycle de vie d'une inscription (Registration), directement gouverné par les règles RG-09 à RG-13 : toute inscription naît WAITING, qu'il y ait ou non une place disponible, puis évolue vers CONFIRMED ou REFUSED sur décision explicite de l'administrateur. Une désinscription confirmée déclenche la promotion automatique du premier bénévole en liste d'attente ; le pseudo-état final (cercle plein cerclé) représente la suppression de la ligne d'inscription elle-même, qu'elle intervienne depuis WAITING (désinscription libre) ou depuis CONFIRMED (désinscription avec promotion du suivant)."),
  ...imgPara(SCR + "diagramme_etat_registration.png", 560, 379, "Figure 3 — Diagramme d'état : cycle de vie d'une inscription (Registration)"),

  table(["Étape", "Transition", "Règle de gestion"], [
    ["1", "Création → WAITING", "Toute inscription démarre en attente, avec position calculée si l'événement est déjà complet (RG-10)"],
    ["2", "WAITING → CONFIRMED", "Validation explicite par l'administrateur (RG-11) ; email de confirmation envoyé (RG-12)"],
    ["3", "WAITING → REFUSED", "Refus explicite par l'administrateur (RG-11) ; email envoyé (RG-12)"],
    ["4", "CONFIRMED → (suppression)", "Désinscription volontaire du bénévole, possible avant le début de l'événement (RG-14)"],
    ["5", "WAITING → CONFIRMED (auto)", "Promotion automatique du premier en liste d'attente après une désinscription confirmée (RG-13)"],
  ], [900, 3400, 4750]),
  caption("Tableau 5 — Détail des transitions du cycle de vie d'une inscription"),

  p("La transition WAITING → CONFIRMED illustrée ci-dessus n'est pas une simple mise à jour de statut : RegistrationService.confirm() revérifie, au moment même de la confirmation, que l'événement n'est pas déjà complet, plutôt que de faire confiance à l'état affiché côté frontend au moment où l'administrateur a cliqué :"),
  codeBlock([
    "public Registration confirm(Long registrationId, Admin admin) {",
    "    Registration reg = findById(registrationId);",
    "    long alreadyConfirmed = registrationRepo",
    "        .countByEventAndStatus(reg.getEvent(), RegistrationStatus.CONFIRMED);",
    "    if (alreadyConfirmed >= reg.getEvent().getMaxPlaces()) {",
    "        throw new RuntimeException(\"Cet événement est déjà complet, \" +",
    "            \"impossible de confirmer une inscription supplémentaire.\");",
    "    }",
    "    reg.setStatus(RegistrationStatus.CONFIRMED);",
    "    reg.setPosition(null);",
    "    reg.setValidatedBy(admin);",
    "    return registrationRepo.save(reg);",
    "}",
  ]),
  p("Ce recomptage au moment de l'action, plutôt qu'une simple lecture d'un compteur potentiellement obsolète, évite un cas limite réel : si l'administrateur laisse deux onglets de son tableau de bord ouverts et confirme depuis chacun une inscription en attente pour le dernier créneau disponible, seule la première confirmation réussit — la seconde échoue proprement avec un message explicite plutôt que de dépasser silencieusement la capacité de l'événement. La désinscription applique une distinction symétrique : quitter la liste d'attente ne libère aucune place, seule l'annulation d'une inscription CONFIRMED déclenche la recherche d'un remplaçant (RG-13)."),

  p("Le second diagramme retrace le cycle de vie d'un événement (Event), qui suit une logique différente de celle d'une inscription : OPEN et FULL sont réversibles l'un vers l'autre selon le remplissage réel (checkAndMarkFull / checkAndMarkOpen, section 3.2.3), tandis que FINISHED et CANCELLED sont tous deux définitifs — le premier atteint automatiquement par la tâche planifiée dès que la date est dépassée, le second uniquement sur décision explicite de l'administrateur, à tout moment de la vie de l'événement."),
  ...imgPara(SCR + "diagramme_etat_event.png", 560, 408, "Figure 4 — Diagramme d'état : cycle de vie d'un événement (Event)"),

  table(["État", "Condition", "Règle de gestion"], [
    ["OPEN", "Statut par défaut à la création, tant que des places restent disponibles", "RG-06"],
    ["FULL", "Le nombre d'inscriptions CONFIRMED atteint maxPlaces", "RG-06"],
    ["FINISHED", "La date de l'événement (eventDate) est dépassée — bascule automatique par tâche planifiée (section 3.2.3)", "RG-06, RG-07"],
    ["CANCELLED", "Uniquement sur décision explicite de l'administrateur, à tout moment", "RG-06"],
  ], [1400, 4750, 1900]),
  caption("Tableau 6 — Détail des transitions du cycle de vie d'un événement"),
  p("Un événement CANCELLED ou FINISHED n'accepte plus de nouvelle inscription (RG-07) : le bouton « S'inscrire » disparaît alors de l'interface publique, et le contrôleur rejette également toute tentative d'inscription envoyée directement à l'API pour ce statut, la vérification n'étant jamais laissée à la seule charge du frontend."),

  p("En complément, les deux diagrammes de séquence ci-dessous détaillent, étape par étape, les interactions entre le frontend React, les contrôleurs Spring Boot et la base de données pour les deux scénarios les plus représentatifs du module : l'inscription à un événement, et la promotion automatique depuis la liste d'attente."),

  h3("Scénario 1 — Inscription d'un bénévole à un événement"),
  table(["Étape", "Acteur", "Action"], [
    ["1", "Bénévole", "Consulte la liste des événements et clique sur « S'inscrire » pour un événement donné"],
    ["2", "Frontend (React)", "Envoie POST /api/registrations/event/{id} avec le jeton JWT du bénévole dans l'en-tête Authorization"],
    ["3", "JwtFilter", "Valide le jeton avec VolunteerJwtUtil, extrait l'identifiant du bénévole et l'assigne ROLE_VOLUNTEER"],
    ["4", "RegistrationController", "Reçoit la requête authentifiée et délègue au RegistrationService"],
    ["5", "RegistrationService", "Vérifie qu'aucune inscription n'existe déjà pour ce couple bénévole/événement (RG-09)"],
    ["6", "RegistrationService", "Compare le nombre d'inscriptions CONFIRMED au maxPlaces de l'événement pour déterminer le statut initial (RG-10)"],
    ["7", "RegistrationRepository", "Persiste la nouvelle inscription (INSERT), avec position calculée si le statut est WAITING"],
    ["8", "RegistrationController", "Retourne l'inscription créée (200 OK)"],
    ["9", "Frontend (React)", "Met à jour l'affichage : confirmation immédiate, ou message indiquant la position en liste d'attente"],
  ], [900, 2500, 5650]),
  caption("Tableau 7 — Diagramme de séquence (détail des étapes) : inscription à un événement"),

  h3("Scénario 2 — Promotion automatique depuis la liste d'attente"),
  table(["Étape", "Acteur", "Action"], [
    ["1", "Administrateur", "Confirme la désinscription d'un bénévole déjà CONFIRMED pour un événement"],
    ["2", "Frontend (React)", "Envoie PUT /api/registrations/{id}/cancel avec le jeton JWT de l'administrateur"],
    ["3", "RegistrationController", "Reçoit la requête et délègue au RegistrationService"],
    ["4", "RegistrationService", "Supprime l'inscription confirmée, libérant une place sur l'événement (RG-14)"],
    ["5", "RegistrationService", "Recherche, parmi les inscriptions WAITING du même événement, celle dont la position est la plus faible"],
    ["6", "RegistrationService", "Fait passer cette inscription de WAITING à CONFIRMED (RG-13)"],
    ["7", "EmailService", "Envoie automatiquement un email de confirmation au bénévole promu (RG-12)"],
    ["8", "RegistrationRepository", "Persiste les deux modifications (suppression puis mise à jour du statut)"],
    ["9", "Frontend (React)", "Rafraîchit la liste des inscrits et la liste d'attente affichées à l'administrateur"],
  ], [900, 2500, 5650]),
  caption("Tableau 8 — Diagramme de séquence (détail des étapes) : promotion automatique depuis la liste d'attente"),
  pageBreak(),
];

module.exports = { persistance };
