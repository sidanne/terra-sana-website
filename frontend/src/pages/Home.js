import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProjects } from "../services/api";
import { getEvents, getVolunteerCount, registerToEvent, getMyRegistrations } from "../services/volunteerApi";

const GREEN = "#2D6A4F";
const GREEN_DARK = "#173C29";
const GOLD = "#D4A017";
const CREAM = "#F8F4E3";

// Couleurs/fond par statut (indépendant de la langue) ; le libellé traduit vient de STATUS_TEXT
const STATUS_STYLE = {
    OPEN: { color: "#2e7d32", bg: "#e8f5e9" },
    FULL: { color: "#e65100", bg: "#fff3e0" },
    CANCELLED: { color: "#c62828", bg: "#ffebee" },
    FINISHED: { color: "#616161", bg: "#eeeeee" }
};
const STATUS_TEXT = {
    fr: { OPEN: "Ouvert", FULL: "Complet", CANCELLED: "Annulé", FINISHED: "Terminé" },
    en: { OPEN: "Open", FULL: "Full", CANCELLED: "Cancelled", FINISHED: "Finished" },
    nl: { OPEN: "Open", FULL: "Volzet", CANCELLED: "Geannuleerd", FINISHED: "Afgelopen" }
};

// Statut d'une inscription déjà existante du bénévole connecté sur cet événement
const MY_REG_TEXT = {
    fr: { WAITING: "En attente", CONFIRMED: "Déjà confirmé", REFUSED: "Refusé" },
    en: { WAITING: "Waiting", CONFIRMED: "Already confirmed", REFUSED: "Refused" },
    nl: { WAITING: "In wachtrij", CONFIRMED: "Al bevestigd", REFUSED: "Geweigerd" }
};

// Icône affichée dans le hub des applications selon la catégorie du projet (esthétique uniquement)
const CATEGORY_ICON = {
    GESTION: "📋", VENTE: "🛒", CULTURE: "📚", CUISINE: "🍳",
    LOGISTIQUE: "🚚", COLLECTION: "🗂️"
};

// Dégradés de bandeau attribués aux cartes événements, dans l'ordre d'apparition (esthétique, sans signification métier)
const CARD_GRADIENTS = [
    "linear-gradient(135deg, #4C9A5C, #2D6A4F)",
    "linear-gradient(135deg, #C08A2E, #8A5A17)",
    "linear-gradient(135deg, #3D6B99, #1E3F5C)"
];

const T = {
    fr: {
        badge: "• Association active à Bruxelles depuis 2019",
        heroTitle1: "Cultivons ensemble", heroTitle2: "un avenir ", heroAccent: "durable", heroTitle3: " et solidaire.",
        heroText: "Terra Sana ASBL œuvre pour une alimentation saine et accessible à tous. Rejoignez notre réseau de bénévoles passionnés et participez à des événements qui ont du sens.",
        becomeVolunteer: "Devenir bénévole", seeEvents: "Voir les événements →",
        activeVolunteers: "bénévoles actifs", joinedUs: "nous ont rejoints",
        nextEvent: "Prochain événement", full: "Complet", placesAvailable: "Places disponibles",
        placesRemaining: (n, max) => `${n} place${n === 1 ? "" : "s"} restante${n === 1 ? "" : "s"} sur ${max}`,
        waitlist: "Liste d'attente", register: "S'inscrire", registerEvent: "S'inscrire à cet événement",
        noEventFeatured: "Aucun événement ouvert pour le moment — revenez bientôt !",
        noEvent: "Aucun événement ouvert pour le moment.",
        statActiveVolunteers: "Bénévoles actifs", statEventsOrganized: "Événements organisés",
        statInternalApps: "Applications internes", statFounded: "Fondée à Bruxelles",
        aboutEyebrow: "• QUI SOMMES-NOUS",
        aboutTitle1: "Une mission locale,", aboutTitle2: "saine et solidaire",
        aboutText: "Terra Sana ASBL est une organisation à but non lucratif fondée en 2019 à Bruxelles. Nous soutenons les producteurs locaux, promouvons le circuit court et accompagnons les personnes en réinsertion — tout en centralisant l'accès à nos 12 applications internes.",
        recognized: "Association reconnue", asblSince: "ASBL depuis 2019",
        features: [
            ["🌱", "Agriculture naturelle", "Sans pesticides ni intrants chimiques"],
            ["🤝", "Communauté inclusive", "Ouvert à tous, sans condition"],
            ["🔄", "Circuit court", "Producteurs locaux privilégiés"],
            ["🏅", "Impact reconnu", "Soutenue par la Région bruxelloise"]
        ],
        howEyebrow: "COMMENT ÇA MARCHE", howTitle: "Rejoignez-nous en 3 étapes",
        howSub1: "Devenir bénévole Terra Sana est simple et gratuit. Créez votre profil,", howSub2: "choisissez vos événements et venez participer !",
        steps: [
            ["1", "👤", "Créez votre profil", "Inscrivez-vous gratuitement en 2 minutes et renseignez vos coordonnées."],
            ["2", "📅", "Choisissez un événement", "Parcourez le calendrier des événements à venir et inscrivez-vous en un clic."],
            ["3", "✓", "Venez participer !", "Votre participation est enregistrée. Recevez votre attestation PDF automatiquement."]
        ],
        upcomingEyebrow: "PROCHAINS ÉVÉNEMENTS", upcomingTitle: "Rejoignez une action près de chez vous",
        seeAllEvents: "Voir tous les événements",
        hubEyebrow: "HUB DES APPLICATIONS",
        hubTitle: (n) => `Nos ${n} applications internes, réunies en un seul endroit`,
        hubSub1: "Accès centralisé à tous les outils de gestion de Terra Sana ASBL,", hubSub2: "développés au fil des différents projets et stages.",
        testimonialsTitle: "Ce que disent nos bénévoles",
        testimonialsSub: "Des dizaines de personnes ont déjà rejoint l'aventure Terra Sana.",
        testimonials: [
            ["SB", "#7B4B94", "Sofia B.", "Bénévole depuis 2023", "Une expérience humaine incroyable. J'ai rencontré des gens fantastiques et eu le sentiment concret d'agir pour ma communauté."],
            ["MK", "#2D6A4F", "Marc K.", "Bénévole depuis 2022", "L'organisation est top. L'inscription est super simple, on reçoit un rappel avant chaque événement et l'attestation arrive automatiquement."],
            ["JP", "#1565C0", "Julie P.", "Bénévole depuis 2024", "Ce que j'aime chez Terra Sana c'est la diversité des actions. Il y en a pour tous les goûts et tous les emplois du temps."]
        ],
        ctaTitle1: "Prêt·e à faire la différence", ctaTitle2: "avec nous ?",
        ctaText: "Rejoignez la communauté Terra Sana. Inscription gratuite, flexible, sans engagement.",
        ctaCreateProfile: "Créer mon profil bénévole", ctaSeeCalendar: "Consulter le calendrier",
        msgWaitlist: "Sur liste d'attente.", msgRegistered: "Inscription envoyée !", msgError: "Erreur lors de l'inscription.",
        locale: "fr-BE"
    },
    en: {
        badge: "• Active association in Brussels since 2019",
        heroTitle1: "Let's grow together", heroTitle2: "a ", heroAccent: "sustainable", heroTitle3: " and caring future.",
        heroText: "Terra Sana ASBL works for healthy, accessible food for everyone. Join our network of passionate volunteers and take part in events that matter.",
        becomeVolunteer: "Become a volunteer", seeEvents: "See events →",
        activeVolunteers: "active volunteers", joinedUs: "have joined us",
        nextEvent: "Next event", full: "Full", placesAvailable: "Places available",
        placesRemaining: (n, max) => `${n} place${n === 1 ? "" : "s"} left out of ${max}`,
        waitlist: "Waitlist", register: "Register", registerEvent: "Register for this event",
        noEventFeatured: "No open event right now — check back soon!",
        noEvent: "No open event right now.",
        statActiveVolunteers: "Active volunteers", statEventsOrganized: "Events organised",
        statInternalApps: "Internal applications", statFounded: "Founded in Brussels",
        aboutEyebrow: "• WHO WE ARE",
        aboutTitle1: "A local mission,", aboutTitle2: "healthy and caring",
        aboutText: "Terra Sana ASBL is a non-profit organisation founded in 2019 in Brussels. We support local producers, promote short supply chains and support people in social reintegration — while centralising access to our 12 internal applications.",
        recognized: "Recognised association", asblSince: "Non-profit since 2019",
        features: [
            ["🌱", "Natural farming", "No pesticides or chemical inputs"],
            ["🤝", "Inclusive community", "Open to everyone, no conditions"],
            ["🔄", "Short supply chain", "Local producers favoured"],
            ["🏅", "Recognised impact", "Supported by the Brussels Region"]
        ],
        howEyebrow: "HOW IT WORKS", howTitle: "Join us in 3 steps",
        howSub1: "Becoming a Terra Sana volunteer is simple and free. Create your profile,", howSub2: "choose your events and come take part!",
        steps: [
            ["1", "👤", "Create your profile", "Sign up for free in 2 minutes and fill in your details."],
            ["2", "📅", "Choose an event", "Browse the calendar of upcoming events and register in one click."],
            ["3", "✓", "Come take part!", "Your participation is recorded. Receive your PDF certificate automatically."]
        ],
        upcomingEyebrow: "UPCOMING EVENTS", upcomingTitle: "Join an action near you",
        seeAllEvents: "See all events",
        hubEyebrow: "APPLICATION HUB",
        hubTitle: (n) => `Our ${n} internal applications, gathered in one place`,
        hubSub1: "Centralised access to all Terra Sana ASBL's management tools,", hubSub2: "developed throughout various projects and internships.",
        testimonialsTitle: "What our volunteers say",
        testimonialsSub: "Dozens of people have already joined the Terra Sana adventure.",
        testimonials: [
            ["SB", "#7B4B94", "Sofia B.", "Volunteer since 2023", "An incredible human experience. I met fantastic people and felt like I was really making a difference for my community."],
            ["MK", "#2D6A4F", "Marc K.", "Volunteer since 2022", "The organisation is great. Signing up is super simple, we get a reminder before each event and the certificate arrives automatically."],
            ["JP", "#1565C0", "Julie P.", "Volunteer since 2024", "What I love about Terra Sana is the variety of actions. There's something for every taste and every schedule."]
        ],
        ctaTitle1: "Ready to make a difference", ctaTitle2: "with us?",
        ctaText: "Join the Terra Sana community. Free, flexible sign-up, no commitment.",
        ctaCreateProfile: "Create my volunteer profile", ctaSeeCalendar: "View the calendar",
        msgWaitlist: "Added to the waitlist.", msgRegistered: "Registration sent!", msgError: "Error while registering.",
        locale: "en-GB"
    },
    nl: {
        badge: "• Actieve vereniging in Brussel sinds 2019",
        heroTitle1: "Laten we samen bouwen", heroTitle2: "aan een ", heroAccent: "duurzame", heroTitle3: " en solidaire toekomst.",
        heroText: "Terra Sana ASBL zet zich in voor gezonde en toegankelijke voeding voor iedereen. Sluit je aan bij ons netwerk van gedreven vrijwilligers en neem deel aan zinvolle evenementen.",
        becomeVolunteer: "Word vrijwilliger", seeEvents: "Bekijk de evenementen →",
        activeVolunteers: "actieve vrijwilligers", joinedUs: "zijn ons al komen versterken",
        nextEvent: "Volgend evenement", full: "Volzet", placesAvailable: "Plaatsen beschikbaar",
        placesRemaining: (n, max) => `${n} plaats${n === 1 ? "" : "en"} over op ${max}`,
        waitlist: "Wachtlijst", register: "Inschrijven", registerEvent: "Inschrijven voor dit evenement",
        noEventFeatured: "Momenteel geen open evenement — kom binnenkort terug!",
        noEvent: "Momenteel geen open evenement.",
        statActiveVolunteers: "Actieve vrijwilligers", statEventsOrganized: "Georganiseerde evenementen",
        statInternalApps: "Interne applicaties", statFounded: "Opgericht in Brussel",
        aboutEyebrow: "• WIE ZIJN WIJ",
        aboutTitle1: "Een lokale, gezonde", aboutTitle2: "en solidaire missie",
        aboutText: "Terra Sana ASBL is een vzw opgericht in 2019 in Brussel. Wij steunen lokale producenten, bevorderen korteketenverkoop en begeleiden mensen in re-integratie — terwijl we de toegang tot onze 12 interne applicaties centraliseren.",
        recognized: "Erkende vereniging", asblSince: "Vzw sinds 2019",
        features: [
            ["🌱", "Natuurlijke landbouw", "Zonder pesticiden of chemische middelen"],
            ["🤝", "Inclusieve gemeenschap", "Open voor iedereen, zonder voorwaarden"],
            ["🔄", "Korte keten", "Lokale producenten bevoorrecht"],
            ["🏅", "Erkende impact", "Gesteund door het Brussels Gewest"]
        ],
        howEyebrow: "HOE HET WERKT", howTitle: "Doe mee in 3 stappen",
        howSub1: "Vrijwilliger worden bij Terra Sana is eenvoudig en gratis. Maak je profiel aan,", howSub2: "kies je evenementen en kom meedoen!",
        steps: [
            ["1", "👤", "Maak je profiel aan", "Schrijf je gratis in in 2 minuten en vul je gegevens in."],
            ["2", "📅", "Kies een evenement", "Bekijk de kalender met komende evenementen en schrijf je in met één klik."],
            ["3", "✓", "Kom meedoen!", "Je deelname wordt geregistreerd. Ontvang automatisch je PDF-attest."]
        ],
        upcomingEyebrow: "KOMENDE EVENEMENTEN", upcomingTitle: "Doe mee aan een actie in jouw buurt",
        seeAllEvents: "Bekijk alle evenementen",
        hubEyebrow: "APPLICATIEHUB",
        hubTitle: (n) => `Onze ${n} interne applicaties, samengebracht op één plek`,
        hubSub1: "Gecentraliseerde toegang tot alle beheertools van Terra Sana ASBL,", hubSub2: "ontwikkeld doorheen verschillende projecten en stages.",
        testimonialsTitle: "Wat onze vrijwilligers zeggen",
        testimonialsSub: "Tientallen mensen hebben zich al bij het Terra Sana-avontuur aangesloten.",
        testimonials: [
            ["SB", "#7B4B94", "Sofia B.", "Vrijwilliger sinds 2023", "Een ongelooflijke menselijke ervaring. Ik heb fantastische mensen ontmoet en het gevoel gehad echt iets te betekenen voor mijn gemeenschap."],
            ["MK", "#2D6A4F", "Marc K.", "Vrijwilliger sinds 2022", "De organisatie is top. Inschrijven is supereenvoudig, we krijgen een herinnering voor elk evenement en het attest komt automatisch binnen."],
            ["JP", "#1565C0", "Julie P.", "Vrijwilliger sinds 2024", "Wat ik geweldig vind aan Terra Sana is de diversiteit aan acties. Er is voor elk wat wils en voor elk schema."]
        ],
        ctaTitle1: "Klaar om het verschil te maken", ctaTitle2: "met ons?",
        ctaText: "Sluit je aan bij de Terra Sana-gemeenschap. Gratis, flexibele inschrijving, geen verplichtingen.",
        ctaCreateProfile: "Maak mijn vrijwilligersprofiel aan", ctaSeeCalendar: "Bekijk de kalender",
        msgWaitlist: "Op de wachtlijst geplaatst.", msgRegistered: "Inschrijving verzonden!", msgError: "Fout bij het inschrijven.",
        locale: "nl-BE"
    }
};

function Home({ lang }) {
    const t = T[lang] || T.fr;
    const statusText = STATUS_TEXT[lang] || STATUS_TEXT.fr;
    const myRegText = MY_REG_TEXT[lang] || MY_REG_TEXT.fr;

    const [projects, setProjects] = useState([]);
    const [events, setEvents] = useState([]);
    const [volunteerCount, setVolunteerCount] = useState(null);
    const [feedback, setFeedback] = useState({});
    const [myRegByEvent, setMyRegByEvent] = useState({});
    const isLoggedIn = !!localStorage.getItem("volunteerToken");
    const navigate = useNavigate();

    useEffect(() => {
        getProjects().then(data => setProjects(Array.isArray(data) ? data.filter(p => p.isActive) : []));
        getEvents().then(data => setEvents(Array.isArray(data) ? data : []));
        getVolunteerCount().then(data => setVolunteerCount(data.count)).catch(() => setVolunteerCount(null));
        // Pour ne pas proposer de s'inscrire à un événement où le bénévole connecté l'est déjà
        if (isLoggedIn) {
            getMyRegistrations().then(data => {
                const map = {};
                (Array.isArray(data) ? data : []).forEach(r => { if (r.event?.id) map[r.event.id] = r; });
                setMyRegByEvent(map);
            }).catch(() => {});
        }
    }, [isLoggedIn]);

    const upcomingEvents = events
        .filter(e => e.status === "OPEN" || e.status === "FULL")
        .sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));
    const featuredEvent = upcomingEvents[0];
    const previewEvents = upcomingEvents.slice(0, 3);

    const formatDate = (d) => new Date(d).toLocaleDateString(t.locale, { weekday: "long", day: "numeric", month: "long", year: "numeric" });
    const formatDateShort = (d) => new Date(d).toLocaleDateString(t.locale, { day: "2-digit", month: "short", year: "numeric" });
    const formatTime = (d) => new Date(d).toLocaleTimeString(t.locale, { hour: "2-digit", minute: "2-digit" });

    const handleRegister = async (eventId) => {
        if (!isLoggedIn) { navigate("/volunteer/login"); return; }
        try {
            const res = await registerToEvent(eventId);
            const msg = res.position ? t.msgWaitlist : t.msgRegistered;
            setFeedback(prev => ({ ...prev, [eventId]: msg }));
            setMyRegByEvent(prev => ({ ...prev, [eventId]: res }));
        } catch (err) {
            setFeedback(prev => ({ ...prev, [eventId]: err.message || t.msgError }));
        }
    };

    return (
        <div>
            {/* ══ HERO ══ */}
            <div style={s.hero}>
                <div style={s.heroGrid}>
                    <div>
                        <span style={s.badge}>{t.badge}</span>
                        <h1 style={s.heroTitle}>{t.heroTitle1}<br />{t.heroTitle2}<span style={s.heroAccent}>{t.heroAccent}</span><br />{t.heroTitle3}</h1>
                        <p style={s.heroText}>{t.heroText}</p>
                        <div style={s.heroBtns}>
                            <Link to="/volunteer/register" style={s.btnGreen}>{t.becomeVolunteer}</Link>
                            <Link to="/evenements" style={s.btnGhost}>{t.seeEvents}</Link>
                        </div>
                        <div style={s.avatarRow}>
                            <div style={s.avatarStack}>
                                {["AY", "MK", "SB", "JP"].map((initials, i) => (
                                    <div key={i} style={{ ...s.avatarChip, marginLeft: i === 0 ? 0 : "-10px", zIndex: 4 - i }}>{initials}</div>
                                ))}
                                <div style={{ ...s.avatarChip, marginLeft: "-10px", background: "rgba(255,255,255,0.15)", color: "#fff" }}>+{Math.max((volunteerCount || 4) - 4, 0)}</div>
                            </div>
                            <span style={s.avatarText}>
                                <strong>{volunteerCount ?? "…"} {t.activeVolunteers}</strong> {t.joinedUs}
                            </span>
                        </div>
                    </div>

                    {/* Carte événement mis en avant */}
                    <div style={s.featuredCard}>
                        {featuredEvent ? (
                            <>
                                <div style={s.featuredImg}>
                                    <div style={s.featuredPill}>
                                        <span>⭐</span>
                                        <div>
                                            <div style={s.featuredPillTitle}>{t.nextEvent}</div>
                                            <div style={s.featuredPillSub}>{formatDateShort(featuredEvent.eventDate)} · {featuredEvent.location.split(",")[0]}</div>
                                        </div>
                                    </div>
                                    <span style={{ ...s.availBadge, background: featuredEvent.status === "FULL" ? "#fff3e0" : "#e8f5e9", color: featuredEvent.status === "FULL" ? "#e65100" : "#2e7d32" }}>
                                        {featuredEvent.status === "FULL" ? t.full : t.placesAvailable}
                                    </span>
                                </div>
                                <div style={s.featuredBody}>
                                    <div style={s.featuredTitle}>{featuredEvent.title}</div>
                                    <div style={s.featuredMeta}>📅 {formatDate(featuredEvent.eventDate)} · {formatTime(featuredEvent.eventDate)}</div>
                                    <div style={s.featuredMeta}>📍 {featuredEvent.location}</div>
                                    <div style={s.featuredFooter}>
                                        <span style={s.featuredCount}>{t.placesRemaining(featuredEvent.availablePlaces, featuredEvent.maxPlaces)}</span>
                                        {feedback[featuredEvent.id] ? (
                                            <span style={s.featuredFeedback}>{feedback[featuredEvent.id]}</span>
                                        ) : myRegByEvent[featuredEvent.id] ? (
                                            <span style={s.featuredFeedback}>✓ {myRegText[myRegByEvent[featuredEvent.id].status]}</span>
                                        ) : (
                                            <button onClick={() => handleRegister(featuredEvent.id)} style={s.featuredBtn}>
                                                {featuredEvent.status === "FULL" ? t.waitlist : t.register}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div style={s.featuredEmpty}>{t.noEventFeatured}</div>
                        )}
                    </div>
                </div>
            </div>

            {/* ══ STATS ══ */}
            <div style={s.statsBar}>
                <div className="grid-responsive" style={s.statsGrid}>
                    <div style={s.stat}><div style={s.statNum}>{volunteerCount ?? "—"}</div><div style={s.statLbl}>{t.statActiveVolunteers}</div></div>
                    <div style={s.stat}><div style={s.statNum}>{events.length}</div><div style={s.statLbl}>{t.statEventsOrganized}</div></div>
                    <div style={s.stat}><div style={s.statNum}>12+</div><div style={s.statLbl}>{t.statInternalApps}</div></div>
                    <div style={s.stat}><div style={s.statNum}>2019</div><div style={s.statLbl}>{t.statFounded}</div></div>
                </div>
            </div>

            {/* ══ QUI SOMMES-NOUS ══ */}
            <div style={s.aboutSection}>
                <div className="grid-responsive" style={s.aboutGrid}>
                    <div style={s.aboutImg}>
                        <span style={s.leafIcon}>🌿</span>
                        <div style={s.aboutBadge}>
                            <span style={{ color: GOLD }}>★</span>
                            <div>
                                <div style={{ fontWeight: 700, fontSize: "12px" }}>{t.recognized}</div>
                                <div style={{ fontSize: "11px", color: "#888" }}>{t.asblSince}</div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <span style={s.eyebrow}>{t.aboutEyebrow}</span>
                        <h2 style={s.aboutTitle}>{t.aboutTitle1}<br />{t.aboutTitle2}</h2>
                        <p style={s.aboutText}>{t.aboutText}</p>
                        <div className="grid-responsive" style={s.featureGrid}>
                            {t.features.map(([icon, title, desc], i) => (
                                <div key={i} style={s.featureItem}>
                                    <span style={s.featureIcon}>{icon}</span>
                                    <div>
                                        <div style={s.featureTitle}>{title}</div>
                                        <div style={s.featureDesc}>{desc}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ══ COMMENT ÇA MARCHE ══ */}
            <div style={s.stepsSection}>
                <div style={{ textAlign: "center", marginBottom: "40px" }}>
                    <span style={s.eyebrow}>{t.howEyebrow}</span>
                    <h2 style={s.stepsTitle}>{t.howTitle}</h2>
                    <p style={s.stepsSub}>{t.howSub1}<br />{t.howSub2}</p>
                </div>
                <div className="grid-responsive" style={s.stepsGrid}>
                    {t.steps.map(([n, icon, title, desc], i) => (
                        <div key={i} style={s.stepCardWrap}>
                            <div style={s.stepCard}>
                                <div style={s.stepNum}>{n}</div>
                                <span style={s.stepIcon}>{icon}</span>
                                <div style={s.stepTitle}>{title}</div>
                                <div style={s.stepDesc}>{desc}</div>
                            </div>
                            {i < 2 && <span style={s.stepArrow}>→</span>}
                        </div>
                    ))}
                </div>
            </div>

            {/* ══ PROCHAINS ÉVÉNEMENTS ══ */}
            <div style={s.eventsSection}>
                <div style={s.eventsHeader}>
                    <div>
                        <span style={s.eyebrow}>{t.upcomingEyebrow}</span>
                        <h2 style={s.eventsTitle}>{t.upcomingTitle}</h2>
                    </div>
                    <Link to="/evenements" style={s.btnOutlineSm}>{t.seeAllEvents}</Link>
                </div>
                {previewEvents.length === 0 ? (
                    <p style={{ textAlign: "center", color: "#888" }}>{t.noEvent}</p>
                ) : (
                    <div className="grid-responsive" style={s.eventsGrid}>
                        {previewEvents.map((ev, i) => {
                            const stStyle = STATUS_STYLE[ev.status] || STATUS_STYLE.OPEN;
                            const stLabel = statusText[ev.status] || statusText.OPEN;
                            const confirmedRatio = ev.status === "FULL" ? 100 : 45;
                            return (
                                <div key={ev.id} style={s.evCard}>
                                    <div style={{ ...s.evCardHead, background: ev.imageUrl ? "#1B1B1B" : CARD_GRADIENTS[i % 3] }}>
                                        {ev.imageUrl && (
                                            <>
                                                <img src={ev.imageUrl} alt="" style={s.evCardImg} />
                                                <div style={s.evCardImgShade} />
                                            </>
                                        )}
                                        <span style={{ ...s.evBadge, background: stStyle.bg, color: stStyle.color, position: "relative" }}>{stLabel}</span>
                                    </div>
                                    <div style={s.evCardBody}>
                                        <div style={s.evCardTitle}>{ev.title}</div>
                                        <div style={s.evCardMeta}>📅 {formatDateShort(ev.eventDate)} · {ev.location.split(",")[0]}</div>
                                        <div style={s.progressTrack}>
                                            <div style={{ ...s.progressFill, width: `${confirmedRatio}%`, background: ev.status === "FULL" ? "#e65100" : GREEN }} />
                                        </div>
                                        {feedback[ev.id] ? (
                                            <div style={s.evFeedback}>{feedback[ev.id]}</div>
                                        ) : myRegByEvent[ev.id] ? (
                                            <div style={s.evFeedback}>✓ {myRegText[myRegByEvent[ev.id].status]}</div>
                                        ) : (
                                            <button onClick={() => handleRegister(ev.id)} style={{ ...s.evBtn, ...(ev.status === "FULL" ? s.evBtnWaitlist : {}) }}>
                                                {ev.status === "FULL" ? t.waitlist : t.registerEvent}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* ══ HUB DES APPLICATIONS ══ */}
            <div style={s.hubSection}>
                <div style={{ textAlign: "center", marginBottom: "8px" }}>
                    <span style={s.eyebrow}>{t.hubEyebrow}</span>
                </div>
                <h2 style={{ ...s.eventsTitle, textAlign: "center" }}>{t.hubTitle(projects.length || 12)}</h2>
                <p style={{ ...s.stepsSub, textAlign: "center", margin: "0 auto 32px" }}>
                    {t.hubSub1}<br />{t.hubSub2}
                </p>
                <div className="grid-responsive" style={s.hubGrid}>
                    {projects.map(p => (
                        <a key={p.id} href={p.link || "#"} target={p.link ? "_blank" : undefined} rel="noreferrer" style={s.hubCard} title={p.description}>
                            <span style={s.hubIcon}>{CATEGORY_ICON[p.category?.toUpperCase()] || "📦"}</span>
                            <div style={s.hubCardTitle}>{p.name}</div>
                        </a>
                    ))}
                </div>
            </div>

            {/* ══ TÉMOIGNAGES ══ */}
            <div style={s.testimonialsSection}>
                <div style={{ textAlign: "center", marginBottom: "36px" }}>
                    <h2 style={s.testimonialsTitle}>{t.testimonialsTitle}</h2>
                    <p style={{ color: "#b8ceb9", fontSize: "14px" }}>{t.testimonialsSub}</p>
                </div>
                <div className="grid-responsive" style={s.testimonialsGrid}>
                    {t.testimonials.map(([initials, color, name, since, quote], i) => (
                        <div key={i} style={s.testimonialCard}>
                            <div style={{ color: GOLD, marginBottom: "12px" }}>★★★★★</div>
                            <p style={s.testimonialQuote}>« {quote} »</p>
                            <div style={s.testimonialAuthor}>
                                <div style={{ ...s.avatarChip, background: color }}>{initials}</div>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: "13px" }}>{name}</div>
                                    <div style={{ fontSize: "11px", color: "#9fc0a1" }}>{since}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ══ CTA FINAL ══ */}
            <div style={s.ctaSection}>
                <h2 style={s.ctaTitle}>{t.ctaTitle1}<br />{t.ctaTitle2}</h2>
                <p style={s.ctaText}>{t.ctaText}</p>
                <div style={s.ctaBtns}>
                    <Link to="/volunteer/register" style={s.ctaBtnGreen}>{t.ctaCreateProfile}</Link>
                    <Link to="/evenements" style={s.btnOutlineSm}>{t.ctaSeeCalendar}</Link>
                </div>
            </div>
        </div>
    );
}

const s = {
    /* ── Hero ── */
    hero: { background: `linear-gradient(160deg, ${GREEN_DARK}, ${GREEN})`, padding: "56px 40px 64px" },
    heroGrid: { display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: "48px", maxWidth: "1180px", margin: "0 auto", alignItems: "center" },
    badge: { display: "inline-block", background: "rgba(255,255,255,0.1)", color: "#cfe8d4", fontSize: "12px", fontWeight: "600", padding: "5px 14px", borderRadius: "20px", marginBottom: "20px", border: "1px solid rgba(255,255,255,0.15)" },
    heroTitle: { color: "#fff", fontSize: "38px", fontWeight: "800", lineHeight: "1.25", marginBottom: "18px" },
    heroAccent: { color: "#8FE3B0", fontStyle: "italic" },
    heroText: { color: "#d9e8da", fontSize: "15px", lineHeight: "1.8", maxWidth: "460px", marginBottom: "26px" },
    heroBtns: { display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "flex-start" },
    ctaBtns: { display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" },
    btnGreen: { background: "#fff", color: GREEN_DARK, fontSize: "13px", padding: "12px 24px", borderRadius: "8px", textDecoration: "none", fontWeight: "700" },
    ctaBtnGreen: { background: GREEN, color: "#fff", fontSize: "13px", padding: "12px 24px", borderRadius: "8px", textDecoration: "none", fontWeight: "700" },
    btnGhost: { background: "rgba(255,255,255,0.08)", color: "#fff", fontSize: "13px", padding: "12px 24px", borderRadius: "8px", border: "1.5px solid rgba(255,255,255,0.3)", textDecoration: "none", fontWeight: "600" },
    btnOutlineSm: { background: "transparent", color: GREEN, fontSize: "13px", padding: "10px 20px", borderRadius: "8px", border: `1.5px solid ${GREEN}`, textDecoration: "none", fontWeight: "600", whiteSpace: "nowrap" },
    avatarRow: { display: "flex", alignItems: "center", gap: "12px", marginTop: "28px" },
    avatarStack: { display: "flex", alignItems: "center" },
    avatarChip: { width: "30px", height: "30px", borderRadius: "50%", background: GREEN, color: "#fff", fontSize: "10px", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid " + GREEN_DARK },
    avatarText: { color: "#cfe8d4", fontSize: "13px" },

    featuredCard: { background: "#fff", borderRadius: "16px", overflow: "hidden", boxShadow: "0 20px 50px rgba(0,0,0,0.25)" },
    featuredImg: { background: `linear-gradient(135deg, #4C9A5C, ${GREEN})`, padding: "18px", minHeight: "90px", position: "relative" },
    featuredPill: { background: "#fff", borderRadius: "10px", padding: "8px 12px", display: "flex", alignItems: "center", gap: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.15)", width: "fit-content" },
    featuredPillTitle: { fontSize: "12px", fontWeight: "700", color: "#1B1B1B" },
    featuredPillSub: { fontSize: "11px", color: "#888" },
    availBadge: { position: "absolute", bottom: "14px", left: "18px", fontSize: "11px", fontWeight: "700", padding: "3px 10px", borderRadius: "20px" },
    featuredBody: { padding: "20px" },
    featuredTitle: { fontSize: "17px", fontWeight: "800", color: "#1B1B1B", marginBottom: "10px" },
    featuredMeta: { fontSize: "13px", color: "#666", marginBottom: "4px" },
    featuredFooter: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "16px", paddingTop: "14px", borderTop: "1px solid #eee" },
    featuredCount: { fontSize: "12px", color: "#888" },
    featuredBtn: { background: GREEN, color: "#fff", border: "none", borderRadius: "7px", padding: "9px 18px", fontSize: "12px", fontWeight: "700", cursor: "pointer" },
    featuredFeedback: { fontSize: "12px", color: GREEN, fontWeight: "600" },
    featuredEmpty: { padding: "40px 20px", textAlign: "center", color: "#888", fontSize: "13px" },

    /* ── Stats ── */
    statsBar: { background: CREAM, padding: "32px 40px" },
    statsGrid: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "16px", maxWidth: "1000px", margin: "0 auto", textAlign: "center" },
    stat: {},
    statNum: { fontSize: "30px", fontWeight: "800", color: GREEN_DARK, fontVariantNumeric: "tabular-nums" },
    statLbl: { fontSize: "12px", color: "#767066", marginTop: "4px" },

    /* ── Qui sommes-nous ── */
    aboutSection: { background: "#fff", padding: "64px 40px" },
    aboutGrid: { display: "grid", gridTemplateColumns: "0.8fr 1.2fr", gap: "48px", maxWidth: "1100px", margin: "0 auto", alignItems: "center" },
    aboutImg: { background: `linear-gradient(160deg, #4C9A5C, ${GREEN})`, borderRadius: "16px", minHeight: "300px", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" },
    leafIcon: { fontSize: "64px", opacity: 0.5 },
    aboutBadge: { position: "absolute", bottom: "16px", left: "16px", right: "16px", background: "#fff", borderRadius: "10px", padding: "10px 14px", display: "flex", alignItems: "center", gap: "10px", boxShadow: "0 6px 16px rgba(0,0,0,0.15)" },
    eyebrow: { fontSize: "11px", fontWeight: "700", color: GREEN, letterSpacing: "1px", textTransform: "uppercase" },
    aboutTitle: { fontSize: "28px", fontWeight: "800", color: "#1B1B1B", margin: "10px 0 16px", lineHeight: "1.3" },
    aboutText: { fontSize: "14px", color: "#555", lineHeight: "1.8", marginBottom: "24px" },
    featureGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" },
    featureItem: { display: "flex", gap: "10px", alignItems: "flex-start", background: CREAM, borderRadius: "10px", padding: "12px 14px" },
    featureIcon: { fontSize: "18px" },
    featureTitle: { fontSize: "13px", fontWeight: "700", color: "#1B1B1B" },
    featureDesc: { fontSize: "11px", color: "#888", marginTop: "2px" },

    /* ── Comment ça marche ── */
    stepsSection: { background: CREAM, padding: "64px 40px" },
    stepsTitle: { fontSize: "26px", fontWeight: "800", color: "#1B1B1B", margin: "8px 0 10px" },
    stepsSub: { fontSize: "13px", color: "#767066", lineHeight: "1.6" },
    stepsGrid: { display: "grid", gridTemplateColumns: "1fr auto 1fr auto 1fr", gap: "16px", maxWidth: "1000px", margin: "0 auto", alignItems: "center" },
    stepCardWrap: { display: "contents" },
    stepCard: { background: "#fff", borderRadius: "14px", padding: "24px 20px", border: "1px solid #e8e2d0" },
    stepNum: { width: "26px", height: "26px", borderRadius: "50%", background: GREEN, color: "#fff", fontSize: "12px", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "12px" },
    stepIcon: { fontSize: "20px", display: "block", marginBottom: "10px" },
    stepTitle: { fontSize: "14px", fontWeight: "700", color: "#1B1B1B", marginBottom: "6px" },
    stepDesc: { fontSize: "12px", color: "#888", lineHeight: "1.6" },
    stepArrow: { fontSize: "20px", color: "#c8bfa0", textAlign: "center" },

    /* ── Prochains événements ── */
    eventsSection: { background: "#fff", padding: "56px 40px", maxWidth: "1180px", margin: "0 auto" },
    eventsHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "28px", flexWrap: "wrap", gap: "12px" },
    eventsTitle: { fontSize: "24px", fontWeight: "800", color: "#1B1B1B", marginTop: "8px" },
    eventsGrid: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "20px" },
    evCard: { border: "1px solid #e0e0e0", borderRadius: "14px", overflow: "hidden" },
    evCardHead: { height: "90px", padding: "14px", display: "flex", alignItems: "flex-end", position: "relative", overflow: "hidden" },
    evCardImg: { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" },
    evCardImgShade: { position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.45) 100%)" },
    evBadge: { fontSize: "11px", fontWeight: "700", padding: "3px 10px", borderRadius: "20px" },
    evCardBody: { padding: "18px" },
    evCardTitle: { fontSize: "15px", fontWeight: "700", color: "#1B1B1B", marginBottom: "8px" },
    evCardMeta: { fontSize: "12px", color: "#888", marginBottom: "12px" },
    progressTrack: { height: "6px", background: "#eee", borderRadius: "10px", overflow: "hidden", marginBottom: "14px" },
    progressFill: { height: "100%", borderRadius: "10px" },
    evBtn: { width: "100%", background: GREEN, color: "#fff", border: "none", borderRadius: "8px", padding: "10px", fontSize: "12px", fontWeight: "700", cursor: "pointer" },
    evBtnWaitlist: { background: "#ff9800" },
    evFeedback: { fontSize: "12px", color: GREEN, fontWeight: "600", textAlign: "center" },

    /* ── Hub des applications ── */
    hubSection: { background: "#fff", padding: "64px 40px", maxWidth: "1180px", margin: "0 auto" },
    hubGrid: { display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: "14px", maxWidth: "1100px", margin: "0 auto" },
    hubCard: { background: CREAM, border: "1px solid #ece4cc", borderRadius: "12px", padding: "20px 14px", textAlign: "center", textDecoration: "none", transition: "transform .15s" },
    hubIcon: { display: "inline-flex", alignItems: "center", justifyContent: "center", width: "42px", height: "42px", borderRadius: "10px", background: "#fff", fontSize: "19px", marginBottom: "10px" },
    hubCardTitle: { fontSize: "12px", fontWeight: "700", color: "#1B1B1B", lineHeight: "1.4" },

    /* ── Témoignages ── */
    testimonialsSection: { background: GREEN_DARK, padding: "64px 40px" },
    testimonialsTitle: { fontSize: "24px", fontWeight: "800", color: "#fff", marginBottom: "8px" },
    testimonialsGrid: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "20px", maxWidth: "1100px", margin: "0 auto" },
    testimonialCard: { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "14px", padding: "22px" },
    testimonialQuote: { fontSize: "13px", color: "#e3ede4", lineHeight: "1.7", fontStyle: "italic", marginBottom: "18px", minHeight: "80px" },
    testimonialAuthor: { display: "flex", alignItems: "center", gap: "10px", paddingTop: "14px", borderTop: "1px solid rgba(255,255,255,0.12)" },

    /* ── CTA ── */
    ctaSection: { background: CREAM, padding: "56px 40px", textAlign: "center" },
    ctaTitle: { fontSize: "26px", fontWeight: "800", color: "#1B1B1B", marginBottom: "12px", lineHeight: "1.3" },
    ctaText: { fontSize: "14px", color: "#767066", marginBottom: "22px" }
};

export default Home;
