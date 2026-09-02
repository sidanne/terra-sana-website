import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProjects } from "../services/api";
import { getEvents, getVolunteerCount, registerToEvent, getMyRegistrations } from "../services/volunteerApi";

const GREEN = "#2D6A4F";
const GREEN_DARK = "#173C29";
const GOLD = "#D4A017";
const CREAM = "#F8F4E3";

const STATUS_LABEL = {
    OPEN: { label: "Ouvert", color: "#2e7d32", bg: "#e8f5e9" },
    FULL: { label: "Complet", color: "#e65100", bg: "#fff3e0" },
    CANCELLED: { label: "Annulé", color: "#c62828", bg: "#ffebee" },
    FINISHED: { label: "Terminé", color: "#616161", bg: "#eeeeee" }
};

// Statut d'une inscription déjà existante du bénévole connecté sur cet événement
const MY_REG_LABEL = { WAITING: "En attente", CONFIRMED: "Déjà confirmé", REFUSED: "Refusé" };

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

function Home({ lang }) {
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

    const formatDate = (d) => new Date(d).toLocaleDateString("fr-BE", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
    const formatDateShort = (d) => new Date(d).toLocaleDateString("fr-BE", { day: "2-digit", month: "short", year: "numeric" });
    const formatTime = (d) => new Date(d).toLocaleTimeString("fr-BE", { hour: "2-digit", minute: "2-digit" });

    const handleRegister = async (eventId) => {
        if (!isLoggedIn) { navigate("/volunteer/login"); return; }
        try {
            const res = await registerToEvent(eventId);
            const msg = res.position ? "Sur liste d'attente." : "Inscription envoyée !";
            setFeedback(prev => ({ ...prev, [eventId]: msg }));
            setMyRegByEvent(prev => ({ ...prev, [eventId]: res }));
        } catch (err) {
            setFeedback(prev => ({ ...prev, [eventId]: err.message || "Erreur lors de l'inscription." }));
        }
    };

    return (
        <div>
            {/* ══ HERO ══ */}
            <div style={s.hero}>
                <div style={s.heroGrid}>
                    <div>
                        <span style={s.badge}>• Association active à Bruxelles depuis 2019</span>
                        <h1 style={s.heroTitle}>Cultivons ensemble<br />un avenir <span style={s.heroAccent}>durable</span><br />et solidaire.</h1>
                        <p style={s.heroText}>
                            Terra Sana ASBL œuvre pour une alimentation saine et accessible à tous.
                            Rejoignez notre réseau de bénévoles passionnés et participez à des événements qui ont du sens.
                        </p>
                        <div style={s.heroBtns}>
                            <Link to="/volunteer/register" style={s.btnGreen}>Devenir bénévole</Link>
                            <Link to="/evenements" style={s.btnGhost}>Voir les événements →</Link>
                        </div>
                        <div style={s.avatarRow}>
                            <div style={s.avatarStack}>
                                {["AY", "MK", "SB", "JP"].map((initials, i) => (
                                    <div key={i} style={{ ...s.avatarChip, marginLeft: i === 0 ? 0 : "-10px", zIndex: 4 - i }}>{initials}</div>
                                ))}
                                <div style={{ ...s.avatarChip, marginLeft: "-10px", background: "rgba(255,255,255,0.15)", color: "#fff" }}>+{Math.max((volunteerCount || 4) - 4, 0)}</div>
                            </div>
                            <span style={s.avatarText}>
                                <strong>{volunteerCount ?? "…"} bénévoles actifs</strong> nous ont rejoints
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
                                            <div style={s.featuredPillTitle}>Prochain événement</div>
                                            <div style={s.featuredPillSub}>{formatDateShort(featuredEvent.eventDate)} · {featuredEvent.location.split(",")[0]}</div>
                                        </div>
                                    </div>
                                    <span style={{ ...s.availBadge, background: featuredEvent.status === "FULL" ? "#fff3e0" : "#e8f5e9", color: featuredEvent.status === "FULL" ? "#e65100" : "#2e7d32" }}>
                                        {featuredEvent.status === "FULL" ? "Complet" : "Places disponibles"}
                                    </span>
                                </div>
                                <div style={s.featuredBody}>
                                    <div style={s.featuredTitle}>{featuredEvent.title}</div>
                                    <div style={s.featuredMeta}>📅 {formatDate(featuredEvent.eventDate)} · {formatTime(featuredEvent.eventDate)}</div>
                                    <div style={s.featuredMeta}>📍 {featuredEvent.location}</div>
                                    <div style={s.featuredFooter}>
                                        <span style={s.featuredCount}>{featuredEvent.availablePlaces} place{featuredEvent.availablePlaces === 1 ? "" : "s"} restante{featuredEvent.availablePlaces === 1 ? "" : "s"} sur {featuredEvent.maxPlaces}</span>
                                        {feedback[featuredEvent.id] ? (
                                            <span style={s.featuredFeedback}>{feedback[featuredEvent.id]}</span>
                                        ) : myRegByEvent[featuredEvent.id] ? (
                                            <span style={s.featuredFeedback}>✓ {MY_REG_LABEL[myRegByEvent[featuredEvent.id].status]}</span>
                                        ) : (
                                            <button onClick={() => handleRegister(featuredEvent.id)} style={s.featuredBtn}>
                                                {featuredEvent.status === "FULL" ? "Liste d'attente" : "S'inscrire"}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div style={s.featuredEmpty}>Aucun événement ouvert pour le moment — revenez bientôt !</div>
                        )}
                    </div>
                </div>
            </div>

            {/* ══ STATS ══ */}
            <div style={s.statsBar}>
                <div className="grid-responsive" style={s.statsGrid}>
                    <div style={s.stat}><div style={s.statNum}>{volunteerCount ?? "—"}</div><div style={s.statLbl}>Bénévoles actifs</div></div>
                    <div style={s.stat}><div style={s.statNum}>{events.length}</div><div style={s.statLbl}>Événements organisés</div></div>
                    <div style={s.stat}><div style={s.statNum}>12+</div><div style={s.statLbl}>Applications internes</div></div>
                    <div style={s.stat}><div style={s.statNum}>2019</div><div style={s.statLbl}>Fondée à Bruxelles</div></div>
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
                                <div style={{ fontWeight: 700, fontSize: "12px" }}>Association reconnue</div>
                                <div style={{ fontSize: "11px", color: "#888" }}>ASBL depuis 2019</div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <span style={s.eyebrow}>• QUI SOMMES-NOUS</span>
                        <h2 style={s.aboutTitle}>Une mission locale,<br />saine et solidaire</h2>
                        <p style={s.aboutText}>
                            Terra Sana ASBL est une organisation à but non lucratif fondée en 2019 à Bruxelles.
                            Nous soutenons les producteurs locaux, promouvons le circuit court et accompagnons
                            les personnes en réinsertion — tout en centralisant l'accès à nos 12 applications internes.
                        </p>
                        <div className="grid-responsive" style={s.featureGrid}>
                            {[
                                ["🌱", "Agriculture naturelle", "Sans pesticides ni intrants chimiques"],
                                ["🤝", "Communauté inclusive", "Ouvert à tous, sans condition"],
                                ["🔄", "Circuit court", "Producteurs locaux privilégiés"],
                                ["🏅", "Impact reconnu", "Soutenue par la Région bruxelloise"]
                            ].map(([icon, title, desc], i) => (
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
                    <span style={s.eyebrow}>COMMENT ÇA MARCHE</span>
                    <h2 style={s.stepsTitle}>Rejoignez-nous en 3 étapes</h2>
                    <p style={s.stepsSub}>Devenir bénévole Terra Sana est simple et gratuit. Créez votre profil,<br />choisissez vos événements et venez participer !</p>
                </div>
                <div className="grid-responsive" style={s.stepsGrid}>
                    {[
                        ["1", "👤", "Créez votre profil", "Inscrivez-vous gratuitement en 2 minutes et renseignez vos coordonnées."],
                        ["2", "📅", "Choisissez un événement", "Parcourez le calendrier des événements à venir et inscrivez-vous en un clic."],
                        ["3", "✓", "Venez participer !", "Votre participation est enregistrée. Recevez votre attestation PDF automatiquement."]
                    ].map(([n, icon, title, desc], i) => (
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
                        <span style={s.eyebrow}>PROCHAINS ÉVÉNEMENTS</span>
                        <h2 style={s.eventsTitle}>Rejoignez une action près de chez vous</h2>
                    </div>
                    <Link to="/evenements" style={s.btnOutlineSm}>Voir tous les événements</Link>
                </div>
                {previewEvents.length === 0 ? (
                    <p style={{ textAlign: "center", color: "#888" }}>Aucun événement ouvert pour le moment.</p>
                ) : (
                    <div className="grid-responsive" style={s.eventsGrid}>
                        {previewEvents.map((ev, i) => {
                            const st = STATUS_LABEL[ev.status] || STATUS_LABEL.OPEN;
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
                                        <span style={{ ...s.evBadge, background: st.bg, color: st.color, position: "relative" }}>{st.label}</span>
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
                                            <div style={s.evFeedback}>✓ {MY_REG_LABEL[myRegByEvent[ev.id].status]}</div>
                                        ) : (
                                            <button onClick={() => handleRegister(ev.id)} style={{ ...s.evBtn, ...(ev.status === "FULL" ? s.evBtnWaitlist : {}) }}>
                                                {ev.status === "FULL" ? "Liste d'attente" : "S'inscrire à cet événement"}
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
                    <span style={s.eyebrow}>HUB DES APPLICATIONS</span>
                </div>
                <h2 style={{ ...s.eventsTitle, textAlign: "center" }}>Nos {projects.length || 12} applications internes, réunies en un seul endroit</h2>
                <p style={{ ...s.stepsSub, textAlign: "center", margin: "0 auto 32px" }}>
                    Accès centralisé à tous les outils de gestion de Terra Sana ASBL,<br />développés au fil des différents projets et stages.
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
                    <h2 style={s.testimonialsTitle}>Ce que disent nos bénévoles</h2>
                    <p style={{ color: "#b8ceb9", fontSize: "14px" }}>Des dizaines de personnes ont déjà rejoint l'aventure Terra Sana.</p>
                </div>
                <div className="grid-responsive" style={s.testimonialsGrid}>
                    {[
                        ["SB", "#7B4B94", "Sofia B.", "Bénévole depuis 2023", "Une expérience humaine incroyable. J'ai rencontré des gens fantastiques et eu le sentiment concret d'agir pour ma communauté."],
                        ["MK", "#2D6A4F", "Marc K.", "Bénévole depuis 2022", "L'organisation est top. L'inscription est super simple, on reçoit un rappel avant chaque événement et l'attestation arrive automatiquement."],
                        ["JP", "#1565C0", "Julie P.", "Bénévole depuis 2024", "Ce que j'aime chez Terra Sana c'est la diversité des actions. Il y en a pour tous les goûts et tous les emplois du temps."]
                    ].map(([initials, color, name, since, quote], i) => (
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
                <h2 style={s.ctaTitle}>Prêt·e à faire la différence<br />avec nous ?</h2>
                <p style={s.ctaText}>Rejoignez la communauté Terra Sana. Inscription gratuite, flexible, sans engagement.</p>
                <div style={s.ctaBtns}>
                    <Link to="/volunteer/register" style={s.ctaBtnGreen}>Créer mon profil bénévole</Link>
                    <Link to="/evenements" style={s.btnOutlineSm}>Consulter le calendrier</Link>
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
