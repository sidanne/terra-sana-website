import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getEvents, registerToEvent, getMyRegistrations } from "../services/volunteerApi";

const GREEN = "#2D6A4F";

// Dégradés de bandeau attribués aux cartes événements (esthétique, sans signification métier)
const CARD_GRADIENTS = [
    "linear-gradient(135deg, #4C9A5C, #2D6A4F)",
    "linear-gradient(135deg, #C08A2E, #8A5A17)",
    "linear-gradient(135deg, #3D6B99, #1E3F5C)"
];

// Couleur selon le statut de l'événement (indépendant de la langue) ; libellé traduit dans STATUS_TEXT
const STATUS_STYLE = {
    OPEN:      { bg: "#e8f5e9", color: "#2e7d32" },
    FULL:      { bg: "#fff3e0", color: "#e65100" },
    CANCELLED: { bg: "#ffebee", color: "#c62828" },
    FINISHED:  { bg: "#eeeeee", color: "#616161" }
};
const MY_REG_STYLE = {
    WAITING:   { bg: "#fff3e0", color: "#e65100" },
    CONFIRMED: { bg: "#e8f5e9", color: "#2e7d32" },
    REFUSED:   { bg: "#eeeeee", color: "#616161" }
};

const T = {
    fr: {
        loading: "Chargement des événements...",
        title: "Événements Terra Sana", sub: "Inscrivez-vous aux événements et participez à notre mission",
        loginBanner: "Connectez-vous pour pouvoir vous inscrire aux événements.", login: "Se connecter",
        empty: "Aucun événement disponible pour le moment.", pastTitle: "Événements passés",
        statusText: { OPEN: "Ouvert", FULL: "Complet", CANCELLED: "Annulé", FINISHED: "Terminé" },
        myRegText: { WAITING: "En attente", CONFIRMED: "Déjà confirmé", REFUSED: "Refusé" },
        placesRemaining: (n, max) => `${n} place${n === 1 ? "" : "s"} restante${n === 1 ? "" : "s"} sur ${max}`,
        alreadyReg: (label) => `✓ Vous êtes déjà inscrit — ${label}`,
        joinWaitlist: "Rejoindre la liste d'attente", register: "S'inscrire",
        waitlistMsg: "Événement complet — vous êtes sur liste d'attente.",
        registeredMsg: "Inscription envoyée ! En attente de confirmation.",
        errorMsg: "Erreur lors de l'inscription.",
        locale: "fr-BE"
    },
    en: {
        loading: "Loading events...",
        title: "Terra Sana Events", sub: "Register for events and take part in our mission",
        loginBanner: "Log in to be able to register for events.", login: "Log in",
        empty: "No events available right now.", pastTitle: "Past events",
        statusText: { OPEN: "Open", FULL: "Full", CANCELLED: "Cancelled", FINISHED: "Finished" },
        myRegText: { WAITING: "Waiting", CONFIRMED: "Already confirmed", REFUSED: "Refused" },
        placesRemaining: (n, max) => `${n} place${n === 1 ? "" : "s"} left out of ${max}`,
        alreadyReg: (label) => `✓ You're already registered — ${label}`,
        joinWaitlist: "Join the waitlist", register: "Register",
        waitlistMsg: "Event full — you're on the waitlist.",
        registeredMsg: "Registration sent! Awaiting confirmation.",
        errorMsg: "Error while registering.",
        locale: "en-GB"
    },
    nl: {
        loading: "Evenementen laden...",
        title: "Terra Sana Evenementen", sub: "Schrijf je in voor evenementen en neem deel aan onze missie",
        loginBanner: "Log in om je te kunnen inschrijven voor evenementen.", login: "Inloggen",
        empty: "Momenteel geen evenementen beschikbaar.", pastTitle: "Afgelopen evenementen",
        statusText: { OPEN: "Open", FULL: "Volzet", CANCELLED: "Geannuleerd", FINISHED: "Afgelopen" },
        myRegText: { WAITING: "In wachtrij", CONFIRMED: "Al bevestigd", REFUSED: "Geweigerd" },
        placesRemaining: (n, max) => `${n} plaats${n === 1 ? "" : "en"} over op ${max}`,
        alreadyReg: (label) => `✓ Je bent al ingeschreven — ${label}`,
        joinWaitlist: "Wachtlijst joinen", register: "Inschrijven",
        waitlistMsg: "Evenement volzet — je staat op de wachtlijst.",
        registeredMsg: "Inschrijving verzonden! In afwachting van bevestiging.",
        errorMsg: "Fout bij het inschrijven.",
        locale: "nl-BE"
    }
};

function Events({ lang }) {
    const t = T[lang] || T.fr;
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [feedback, setFeedback] = useState({});
    const [myRegByEvent, setMyRegByEvent] = useState({});
    const navigate = useNavigate();
    const isLoggedIn = !!localStorage.getItem("volunteerToken");

    useEffect(() => {
        getEvents().then(data => {
            setEvents(Array.isArray(data) ? data : []);
            setLoading(false);
        });
        // Pour ne pas proposer de s'inscrire à un événement où le bénévole connecté l'est déjà
        if (isLoggedIn) {
            getMyRegistrations().then(data => {
                const map = {};
                (Array.isArray(data) ? data : []).forEach(r => { if (r.event?.id) map[r.event.id] = r; });
                setMyRegByEvent(map);
            }).catch(() => {});
        }
    }, [isLoggedIn]);

    const handleRegister = async (eventId) => {
        if (!isLoggedIn) {
            navigate("/volunteer/login");
            return;
        }
        try {
            const res = await registerToEvent(eventId);
            // Afficher un message de retour selon qu'une position de liste d'attente a été attribuée (RG-09)
            const msg = res.position ? t.waitlistMsg : t.registeredMsg;
            setFeedback(prev => ({ ...prev, [eventId]: { ok: true, msg } }));
            setMyRegByEvent(prev => ({ ...prev, [eventId]: res }));
        } catch (err) {
            setFeedback(prev => ({ ...prev, [eventId]: { ok: false, msg: err.message || t.errorMsg } }));
        }
    };

    const formatDate = (d) => new Date(d).toLocaleDateString(t.locale, { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });

    if (loading) return <div style={s.loading}>{t.loading}</div>;

    // À venir en premier (le plus proche d'abord) ; les événements passés/annulés sont regroupés
    // à part, du plus récent au plus ancien, pour ne pas noyer les nouveaux événements créés
    const upcoming = events.filter(e => e.status === "OPEN" || e.status === "FULL");
    const past = events
        .filter(e => e.status === "FINISHED" || e.status === "CANCELLED")
        .sort((a, b) => new Date(b.eventDate) - new Date(a.eventDate));

    const renderCard = (ev, i) => {
        const st = STATUS_STYLE[ev.status] || STATUS_STYLE.OPEN;
        const stLabel = t.statusText[ev.status] || t.statusText.OPEN;
        const fb = feedback[ev.id];
        const isUpcoming = ev.status === "OPEN" || ev.status === "FULL";
        return (
            <div key={ev.id} className="event-card" style={s.card}>
                {ev.imageUrl ? (
                    <div style={s.imgWrap}>
                        <img src={ev.imageUrl} alt={ev.title} className="event-card-img" style={s.img} />
                    </div>
                ) : (
                    <div style={{ ...s.img, background: CARD_GRADIENTS[i % 3], display: "flex", alignItems: "center", justifyContent: "center", fontSize: "34px" }}>🌿</div>
                )}
                <div style={s.body}>
                    <div style={s.statusRow}>
                        <span style={{ ...s.badge, background: st.bg, color: st.color }}>{stLabel}</span>
                    </div>
                    <h2 style={s.evTitle}>{ev.title}</h2>
                    <p style={s.desc}>{ev.description}</p>
                    <div style={s.meta}>
                        <span>📅 {formatDate(ev.eventDate)}</span>
                        <span>📍 {ev.location}</span>
                        <span>👥 {t.placesRemaining(ev.availablePlaces, ev.maxPlaces)}</span>
                    </div>

                    {fb && (
                        <div style={{ ...s.fb, background: fb.ok ? "#e8f5e9" : "#ffebee", color: fb.ok ? "#2e7d32" : "#c62828" }}>
                            {fb.msg}
                        </div>
                    )}

                    {/* "Déjà inscrit" n'a de sens que pour un événement encore à venir — pour un événement
                        passé/annulé, le badge de statut ci-dessus suffit, l'historique complet vit dans "Mon espace" */}
                    {isUpcoming && myRegByEvent[ev.id] ? (
                        (() => {
                            const mrs = MY_REG_STYLE[myRegByEvent[ev.id].status] || MY_REG_STYLE.WAITING;
                            const mrsLabel = t.myRegText[myRegByEvent[ev.id].status] || t.myRegText.WAITING;
                            return (
                                <div style={{ ...s.alreadyReg, background: mrs.bg, color: mrs.color }}>
                                    {t.alreadyReg(mrsLabel)}
                                </div>
                            );
                        })()
                    ) : isUpcoming ? (
                        <button
                            onClick={() => handleRegister(ev.id)}
                            disabled={!!fb}
                            style={{ ...s.btn, background: ev.status === "FULL" ? "#ff9800" : GREEN }}
                        >
                            {ev.status === "FULL" ? t.joinWaitlist : t.register}
                        </button>
                    ) : null}
                </div>
            </div>
        );
    };

    return (
        <div style={s.page}>
            <div style={s.hero}>
                <h1 style={s.title}>{t.title}</h1>
                <p style={s.sub}>{t.sub}</p>
            </div>

            <div style={s.header}>
                {!isLoggedIn && (
                    <div style={s.banner}>
                        <span>{t.loginBanner}</span>
                        <button onClick={() => navigate("/volunteer/login")} style={s.bannerBtn}>{t.login}</button>
                    </div>
                )}
            </div>

            {events.length === 0 ? (
                <p style={s.empty}>{t.empty}</p>
            ) : (
                <>
                    {upcoming.length > 0 && (
                        <div style={s.grid}>{upcoming.map(renderCard)}</div>
                    )}
                    {past.length > 0 && (
                        <div style={s.pastSection}>
                            <h2 style={s.pastTitle}>{t.pastTitle}</h2>
                            <div style={s.grid}>{past.map(renderCard)}</div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

const s = {
    page: { background: "#F8F4E3", minHeight: "100vh", paddingBottom: "40px" },
    hero: {
        background: "linear-gradient(160deg, #173C29, #2D6A4F)",
        padding: "56px 32px",
        textAlign: "center",
        marginBottom: "32px"
    },
    header: { maxWidth: "1100px", margin: "0 auto 32px", padding: "0 32px" },
    title: { fontSize: "30px", fontWeight: "bold", color: "#fff", marginBottom: "8px", textShadow: "0 2px 10px rgba(0,0,0,0.4)" },
    sub: { fontSize: "14px", color: "#e8e8e0" },
    banner: { background: "#e8f5e9", border: "1px solid #a5d6a7", borderRadius: "10px", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "14px", color: "#2e7d32" },
    bannerBtn: { background: GREEN, color: "#fff", border: "none", borderRadius: "8px", padding: "8px 18px", cursor: "pointer", fontWeight: "600", fontSize: "13px" },
    grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "24px", maxWidth: "1100px", margin: "0 auto", padding: "0 32px" },
    pastSection: { marginTop: "40px" },
    pastTitle: { fontSize: "18px", fontWeight: "700", color: "#767066", maxWidth: "1100px", margin: "0 auto 16px", padding: "0 32px" },
    card: { background: "#fff", border: "1px solid #e0e0e0", borderRadius: "12px", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" },
    imgWrap: { overflow: "hidden", height: "180px" },
    img: { width: "100%", height: "180px", objectFit: "cover" },
    body: { padding: "20px" },
    statusRow: { marginBottom: "10px" },
    badge: { fontSize: "11px", fontWeight: "700", padding: "3px 10px", borderRadius: "20px", textTransform: "uppercase", letterSpacing: "0.5px" },
    evTitle: { fontSize: "17px", fontWeight: "bold", color: "#1B1B1B", marginBottom: "8px" },
    desc: { fontSize: "13px", color: "#666", lineHeight: "1.6", marginBottom: "14px" },
    meta: { display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", color: "#555", marginBottom: "16px" },
    fb: { padding: "10px 14px", borderRadius: "8px", fontSize: "13px", marginBottom: "12px" },
    btn: { width: "100%", color: "#fff", border: "none", borderRadius: "8px", padding: "11px", fontWeight: "600", fontSize: "14px", cursor: "pointer" },
    alreadyReg: { width: "100%", textAlign: "center", borderRadius: "8px", padding: "11px", fontWeight: "600", fontSize: "13px" },
    loading: { textAlign: "center", padding: "80px", color: "#888" },
    empty: { textAlign: "center", color: "#888", fontSize: "15px", marginTop: "60px" }
};

export default Events;
