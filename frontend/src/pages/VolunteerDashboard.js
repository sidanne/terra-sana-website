import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getMe, updateMe, getMyRegistrations, cancelRegistration, getMyReviews, addReview, downloadAttestation, exportParticipationHistory } from "../services/volunteerApi";

const GREEN = "#2D6A4F";
const GREEN_DARK = "#173C29";
const GOLD = "#D4A017";

const STATUS_LABEL = {
    WAITING: { label: "En attente", color: "#e65100", bg: "#fff3e0" },
    CONFIRMED: { label: "Confirmé", color: "#2e7d32", bg: "#e8f5e9" },
    REFUSED: { label: "Refusé", color: "#616161", bg: "#eeeeee" }
};

// Icône, couleur, seuil et libellé (RG-18) associés à chaque niveau bénévole
const LEVEL_ORDER = ["BRONZE", "ARGENT", "OR"];
const LEVEL_INFO = {
    BRONZE: { name: "Bronze", color: "#cd7f32", icon: "🥉", next: "ARGENT", threshold: 3, range: "1 à 2 événements" },
    ARGENT: { name: "Argent", color: "#9e9e9e", icon: "🥈", next: "OR", threshold: 7, range: "3 à 6 événements" },
    OR: { name: "Or", color: GOLD, icon: "🥇", next: null, threshold: null, range: "7 événements et plus" }
};

function VolunteerDashboard() {
    const [tab, setTab] = useState("profile");
    const [user, setUser] = useState(null);
    const [registrations, setRegistrations] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [editForm, setEditForm] = useState({});
    const [reviewForm, setReviewForm] = useState({});
    const [msg, setMsg] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (!localStorage.getItem("volunteerToken")) { navigate("/volunteer/login"); return; }
        getMe().then(setUser);
        getMyRegistrations().then(data => setRegistrations(Array.isArray(data) ? data : []));
        getMyReviews().then(data => setReviews(Array.isArray(data) ? data : []));
    }, [navigate]);

    const handleLogout = () => { localStorage.removeItem("volunteerToken"); navigate("/volunteer/login"); };

    const handleEditSave = async () => {
        try {
            const updated = await updateMe(editForm);
            setUser(updated);
            setEditMode(false);
            showMsg("Profil mis à jour avec succès.");
        } catch (err) {
            showMsg(err.message || "Impossible de mettre à jour le profil.");
        }
    };

    const handleCancel = async (id) => {
        try {
            await cancelRegistration(id);
            setRegistrations(prev => prev.filter(r => r.id !== id));
            showMsg("Inscription annulée.");
        } catch (err) {
            showMsg(err.message || "Impossible d'annuler cette inscription.");
        }
    };

    // RG-20 — Téléchargement de l'attestation, disponible seulement si CONFIRMED + événement FINISHED
    const handleDownloadAttestation = async (eventId, eventTitle) => {
        try {
            await downloadAttestation(eventId, eventTitle);
        } catch {
            showMsg("Impossible de générer l'attestation.");
        }
    };

    const handleExportHistory = async () => {
        try {
            await exportParticipationHistory();
        } catch {
            showMsg("Impossible de générer l'historique.");
        }
    };

    const handleReview = async (eventId) => {
        const f = reviewForm[eventId] || {};
        if (!f.rating) { showMsg("Veuillez choisir une note."); return; }
        try {
            await addReview(eventId, parseInt(f.rating), f.comment || "");
            const updated = await getMyReviews();
            setReviews(Array.isArray(updated) ? updated : []);
            showMsg("Avis envoyé avec succès !");
        } catch (err) {
            showMsg(err.message || "Impossible d'envoyer cet avis.");
        }
    };

    const showMsg = (text) => { setMsg(text); setTimeout(() => setMsg(""), 4000); };

    const formatDate = (d) => new Date(d).toLocaleDateString("fr-BE", { day: "2-digit", month: "long", year: "numeric" });
    const formatTime = (d) => new Date(d).toLocaleTimeString("fr-BE", { hour: "2-digit", minute: "2-digit" });
    const dayNum = (d) => new Date(d).getDate();
    const monthShort = (d) => new Date(d).toLocaleDateString("fr-BE", { month: "short" }).toUpperCase();

    if (!user) return <div style={s.loading}>Chargement...</div>;

    const alreadyReviewed = reviews.map(r => r.event?.id);
    const canReview = registrations.filter(r =>
        r.status === "CONFIRMED" && r.event?.status === "FINISHED" && !alreadyReviewed.includes(r.event?.id)
    );
    const confirmedCount = registrations.filter(r => r.status === "CONFIRMED").length;
    const pendingCount = registrations.filter(r => r.status === "WAITING").length;
    const avgRatingGiven = reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : "—";
    const levelInfo = LEVEL_INFO[user.level] || LEVEL_INFO.BRONZE;
    const skillTags = (user.skills || "").split(",").map(t => t.trim()).filter(Boolean);
    const initials = `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase();

    const reviewByEventId = {};
    reviews.forEach(rv => { if (rv.event?.id) reviewByEventId[rv.event.id] = rv; });

    // Résumé "Historique de participation" affiché sur "Mon espace" — événements confirmés et terminés, avec évaluation (RG-20)
    const renderCompletedHistory = () => {
        const completed = registrations.filter(r => r.status === "CONFIRMED" && r.event?.status === "FINISHED");
        return (
            <div style={s.card}>
                <div style={s.cardHeader}>
                    <h2 style={s.cardTitle}>Historique de participation</h2>
                    <button onClick={handleExportHistory} style={s.editBtnGhost}>Exporter PDF</button>
                </div>
                {completed.length === 0 ? (
                    <p style={s.empty}>Aucun événement terminé pour l'instant.</p>
                ) : (
                    <div style={{ overflowX: "auto" }}>
                        <table style={s.table}>
                            <thead>
                                <tr>
                                    <th style={s.th}>ÉVÉNEMENT</th>
                                    <th style={s.th}>DATE</th>
                                    <th style={s.th}>ÉVALUATION</th>
                                    <th style={s.th}>ATTESTATION</th>
                                </tr>
                            </thead>
                            <tbody>
                                {completed.map(r => {
                                    const rv = reviewByEventId[r.event.id];
                                    return (
                                        <tr key={r.id} style={s.tr}>
                                            <td style={s.td}><strong>{r.event?.title}</strong></td>
                                            <td style={s.td}>{r.event?.eventDate ? formatDate(r.event.eventDate) : "—"}</td>
                                            <td style={s.td}>
                                                {rv ? <span style={{ color: GOLD }}>{"★".repeat(rv.rating)}<span style={{ color: "#ddd" }}>{"★".repeat(5 - rv.rating)}</span></span> : "—"}
                                            </td>
                                            <td style={s.td}>
                                                <button onClick={() => handleDownloadAttestation(r.event.id, r.event.title)} style={s.linkBtn}>Télécharger →</button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        );
    };

    // Tableau complet (toutes inscriptions, tous statuts) — onglet dédié "Mes inscriptions"
    const renderFullHistory = () => (
        <div style={s.card}>
            <div style={s.cardHeader}>
                <h2 style={s.cardTitle}>Historique de participation</h2>
            </div>
            {registrations.length === 0 ? (
                <p style={s.empty}>Vous n'êtes inscrit à aucun événement pour l'instant.</p>
            ) : (
                <div style={{ overflowX: "auto" }}>
                    <table style={s.table}>
                        <thead>
                            <tr>
                                <th style={s.th}>ÉVÉNEMENT</th>
                                <th style={s.th}>DATE</th>
                                <th style={s.th}>STATUT</th>
                                <th style={s.th}>ATTESTATION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {registrations.map(r => {
                                // Un événement annulé par l'admin ne change pas le statut de l'inscription elle-même
                                // (l'historique reste exact), donc on l'indique ici plutôt que d'afficher "Confirmé"
                                // comme si l'événement tenait toujours.
                                const eventCancelled = r.event?.status === "CANCELLED";
                                const st = eventCancelled
                                    ? { label: "Événement annulé", color: "#616161", bg: "#eeeeee" }
                                    : (STATUS_LABEL[r.status] || STATUS_LABEL.WAITING);
                                const canDownload = r.status === "CONFIRMED" && r.event?.status === "FINISHED";
                                return (
                                    <tr key={r.id} style={s.tr}>
                                        <td style={s.td}>
                                            <strong>{r.event?.title}</strong>
                                            {!eventCancelled && r.status === "WAITING" && r.position && <div style={{ fontSize: "11px", color: "#1565c0" }}>Position {r.position}</div>}
                                        </td>
                                        <td style={s.td}>{r.event?.eventDate ? formatDate(r.event.eventDate) : "—"}</td>
                                        <td style={s.td}><span style={{ ...s.badge, background: st.bg, color: st.color }}>{st.label}</span></td>
                                        <td style={s.td}>
                                            {canDownload ? (
                                                <button onClick={() => handleDownloadAttestation(r.event.id, r.event.title)} style={s.linkBtn}>Télécharger →</button>
                                            ) : !eventCancelled && r.status === "WAITING" ? (
                                                <button onClick={() => handleCancel(r.id)} style={{ ...s.linkBtn, color: "#c62828" }}>Annuler</button>
                                            ) : "—"}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );

    return (
        <div style={s.page}>
            {/* ── NAVBAR bénévole ── */}
            <div style={s.navbar}>
                <div style={s.navBrand}><span style={s.navLogo}>TS</span> Terra Sana</div>
                <div style={s.navTabs}>
                    <button onClick={() => setTab("profile")} style={{ ...s.navTab, ...(tab === "profile" ? s.navTabActive : {}) }}>Mon espace</button>
                    <Link to="/evenements" style={s.navTab}>Événements</Link>
                    {[["registrations", "Mes inscriptions"], ["attestations", "Mes attestations"], ["reviews", "Mes avis"]].map(([key, label]) => (
                        <button key={key} onClick={() => setTab(key)} style={{ ...s.navTab, ...(tab === key ? s.navTabActive : {}) }}>
                            {label}
                        </button>
                    ))}
                </div>
                <div style={s.navRight}>
                    <button onClick={() => setTab("registrations")} style={s.bellBtn} title="Mes inscriptions en attente">
                        🔔{pendingCount > 0 && <span style={s.navBellDot} />}
                    </button>
                    <div style={s.navAvatar}>{initials}</div>
                    <span style={{ fontSize: "13px" }}>{user.firstName}</span>
                </div>
            </div>

            <div style={s.body}>
                {msg && <div style={s.msgBox}>{msg}</div>}

                <div className="grid-responsive" style={s.layout}>
                    {/* ── CARTE PROFIL (persistante) ── */}
                    <div style={s.profileCard}>
                        <div style={s.profileBanner} />
                        <div style={s.profileBody}>
                            <div style={s.profileAvatar}>{initials}</div>
                            <div style={s.profileName}>{user.firstName} {user.lastName}</div>
                            <div style={s.profileEmail}>{user.email}</div>
                            <div style={s.profileSince}>Bénévole depuis {formatDate(user.createdAt)}</div>

                            <div style={{ ...s.levelPill, background: levelInfo.color }}>★ Niveau {user.level}</div>

                            {skillTags.length > 0 && (
                                <div style={s.tagRow}>
                                    {skillTags.slice(0, 4).map((t, i) => <span key={i} style={s.tag}>{t}</span>)}
                                </div>
                            )}

                            <div style={s.statsTrio}>
                                <div><div style={s.statTrioNum}>{confirmedCount}</div><div style={s.statTrioLbl}>particip. confirmées</div></div>
                                <div><div style={s.statTrioNum}>{registrations.length}</div><div style={s.statTrioLbl}>inscriptions</div></div>
                                <div><div style={s.statTrioNum}>{avgRatingGiven}</div><div style={s.statTrioLbl}>note moy.</div></div>
                            </div>

                            <div style={s.levelBox}>
                                <div style={s.levelBoxHeader}>NIVEAU DE FIDÉLITÉ</div>
                                <div style={s.levelBoxSub}>Calculé automatiquement selon le nombre de participations confirmées (RG-18)</div>
                                {LEVEL_ORDER.map((lvl, idx) => {
                                    const info = LEVEL_INFO[lvl];
                                    const currentIdx = LEVEL_ORDER.indexOf(user.level);
                                    const isCurrent = idx === currentIdx;
                                    const isAchieved = idx < currentIdx;
                                    return (
                                        <div key={lvl} style={{ ...s.ladderRow, ...(isCurrent ? { background: "#fdf6e3", border: `1px solid ${info.color}` } : { border: "1px solid transparent" }) }}>
                                            <span style={{ ...s.ladderDot, background: (isAchieved || isCurrent) ? info.color : "#ddd" }} />
                                            <div style={{ flex: 1 }}>
                                                <div style={s.ladderLabel}>{info.name}{isCurrent ? " — niveau actuel" : ""}</div>
                                                <div style={s.ladderRange}>{info.range}</div>
                                            </div>
                                            {isAchieved && <span style={s.ladderCheck}>✓</span>}
                                        </div>
                                    );
                                })}
                            </div>

                            <button onClick={handleLogout} style={s.logoutBtn}>Se déconnecter</button>
                        </div>
                    </div>

                    {/* ── CONTENU PRINCIPAL ── */}
                    <div>
                        {/* ── ONGLET PROFIL / MON ESPACE ── */}
                        {tab === "profile" && (
                            <>
                                <div style={s.card}>
                                    <div style={s.cardHeader}>
                                        <h2 style={s.cardTitle}>Informations personnelles</h2>
                                        {!editMode && (
                                            <button onClick={() => { setEditForm({ ...user }); setEditMode(true); }} style={s.editBtn}>Modifier</button>
                                        )}
                                    </div>
                                    {editMode ? (
                                        <div className="grid-responsive" style={s.formGrid}>
                                            {[["firstName", "Prénom"], ["lastName", "Nom"], ["phone", "Téléphone"], ["city", "Ville"], ["postalCode", "Code postal"], ["skills", "Compétences"], ["availability", "Disponibilités"]].map(([field, label]) => (
                                                <div key={field} style={s.row}>
                                                    <label style={s.label}>{label}</label>
                                                    <input value={editForm[field] || ""} onChange={e => setEditForm({ ...editForm, [field]: e.target.value })} style={s.input} />
                                                </div>
                                            ))}
                                            <div style={s.row}>
                                                <label style={s.label}>Date de naissance</label>
                                                <input type="date" value={editForm.birthDate || ""} onChange={e => setEditForm({ ...editForm, birthDate: e.target.value })} style={s.input} />
                                            </div>
                                            <div style={s.row}>
                                                <label style={s.label}>Genre</label>
                                                <select value={editForm.gender || ""} onChange={e => setEditForm({ ...editForm, gender: e.target.value })} style={s.input}>
                                                    <option value="">— Non précisé —</option>
                                                    <option value="M">Homme</option>
                                                    <option value="F">Femme</option>
                                                    <option value="X">Autre</option>
                                                </select>
                                            </div>
                                            <div style={s.row}>
                                                <label style={s.label}>Langue préférée</label>
                                                <select value={editForm.preferredLanguage || "fr"} onChange={e => setEditForm({ ...editForm, preferredLanguage: e.target.value })} style={s.input}>
                                                    <option value="fr">Français</option>
                                                    <option value="en">English</option>
                                                    <option value="nl">Nederlands</option>
                                                </select>
                                            </div>
                                            <div style={s.btnRow}>
                                                <button onClick={handleEditSave} style={{ ...s.btn, background: GREEN }}>Sauvegarder</button>
                                                <button onClick={() => setEditMode(false)} style={s.cancelBtn}>Annuler</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="grid-responsive" style={s.infoGrid}>
                                            {[
                                                ["Téléphone", user.phone || "—"],
                                                ["Date de naissance", user.birthDate || "—"],
                                                ["Genre", user.gender === "M" ? "Homme" : user.gender === "F" ? "Femme" : user.gender === "X" ? "Autre" : "—"],
                                                ["Ville", user.city ? `${user.city}${user.postalCode ? " " + user.postalCode : ""}` : "—"],
                                                ["Disponibilités", user.availability || "—"],
                                                ["Langue", user.preferredLanguage?.toUpperCase() || "FR"]
                                            ].map(([k, v]) => (
                                                <div key={k} style={s.infoItem}>
                                                    <span style={s.infoKey}>{k}</span>
                                                    <span style={s.infoVal}>{v}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div style={s.card}>
                                    <div style={s.cardHeader}>
                                        <h2 style={s.cardTitle}>Mes prochains événements</h2>
                                        <button onClick={() => setTab("registrations")} style={s.editBtnGhost}>Voir tous →</button>
                                    </div>
                                    <div style={{ marginTop: "16px" }}>
                                        {registrations.filter(r => r.status !== "REFUSED" && r.event?.status !== "FINISHED" && r.event?.status !== "CANCELLED").length === 0 ? (
                                            <p style={s.empty}>Aucune inscription à venir.</p>
                                        ) : registrations.filter(r => r.status !== "REFUSED" && r.event?.status !== "FINISHED" && r.event?.status !== "CANCELLED").map(r => {
                                            const st = STATUS_LABEL[r.status] || STATUS_LABEL.WAITING;
                                            return (
                                                <div key={r.id} style={{ ...s.upcomingRow, borderLeftColor: st.color }}>
                                                    <div style={s.eventDateBox}>
                                                        <div style={s.eventDateDay}>{r.event?.eventDate ? dayNum(r.event.eventDate) : "—"}</div>
                                                        <div style={s.eventDateMonth}>{r.event?.eventDate ? monthShort(r.event.eventDate) : ""}</div>
                                                    </div>
                                                    <div style={{ flex: 1 }}>
                                                        <div style={s.upcomingTitle}>{r.event?.title}</div>
                                                        <div style={s.upcomingMeta}>{r.event?.eventDate ? formatTime(r.event.eventDate) : "—"} · {r.event?.location}</div>
                                                    </div>
                                                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                                        <span style={{ ...s.badge, background: st.bg, color: st.color }}>{st.label}</span>
                                                        <button onClick={() => handleCancel(r.id)} style={s.cancelRegBtn}>
                                                            {r.status === "CONFIRMED" ? "Se désinscrire" : "Annuler"}
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {renderCompletedHistory()}
                            </>
                        )}

                        {/* ── ONGLET INSCRIPTIONS ── */}
                        {tab === "registrations" && renderFullHistory()}

                        {/* ── ONGLET ATTESTATIONS ── */}
                        {tab === "attestations" && (
                            <div style={s.card}>
                                <h2 style={s.cardTitle}>Mes attestations PDF</h2>
                                <p style={{ fontSize: "12px", color: "#888", marginTop: "6px" }}>
                                    Disponible pour chaque événement terminé où votre participation a été confirmée (RG-20).
                                </p>
                                <div style={{ marginTop: "18px" }}>
                                    {registrations.filter(r => r.status === "CONFIRMED" && r.event?.status === "FINISHED").length === 0 ? (
                                        <p style={s.empty}>Aucune attestation disponible pour l'instant — elle apparaîtra ici après un événement terminé.</p>
                                    ) : registrations.filter(r => r.status === "CONFIRMED" && r.event?.status === "FINISHED").map(r => (
                                        <div key={r.id} style={s.attestationRow}>
                                            <div style={s.attestationIcon}>📄</div>
                                            <div style={{ flex: 1 }}>
                                                <div style={s.upcomingTitle}>{r.event?.title}</div>
                                                <div style={s.upcomingMeta}>Terminé le {formatDate(r.event?.eventDate)}</div>
                                            </div>
                                            <button onClick={() => handleDownloadAttestation(r.event.id, r.event.title)} style={{ ...s.btn, background: GREEN }}>
                                                Télécharger →
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ── ONGLET AVIS ── */}
                        {tab === "reviews" && (
                            <>
                                {canReview.length > 0 && (
                                    <div style={s.card}>
                                        <h3 style={s.cardTitle}>Événements à évaluer</h3>
                                        <div style={{ marginTop: "16px" }}>
                                            {canReview.map(r => (
                                                <div key={r.id} style={s.reviewForm}>
                                                    <strong>{r.event?.title}</strong>
                                                    <div style={s.stars}>
                                                        {[1, 2, 3, 4, 5].map(n => (
                                                            <span key={n} onClick={() => setReviewForm(prev => ({ ...prev, [r.event.id]: { ...prev[r.event.id], rating: n } }))}
                                                                style={{ ...s.star, color: (reviewForm[r.event.id]?.rating || 0) >= n ? GOLD : "#ddd" }}>★</span>
                                                        ))}
                                                    </div>
                                                    <textarea placeholder="Votre commentaire (optionnel)"
                                                        value={reviewForm[r.event.id]?.comment || ""}
                                                        onChange={e => setReviewForm(prev => ({ ...prev, [r.event.id]: { ...prev[r.event.id], comment: e.target.value } }))}
                                                        style={s.textarea} />
                                                    <button onClick={() => handleReview(r.event.id)} style={{ ...s.btn, background: GREEN }}>Envoyer mon avis</button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                <div style={s.card}>
                                    <h2 style={s.cardTitle}>Avis déjà laissés ({reviews.length})</h2>
                                    <div style={{ marginTop: "16px" }}>
                                        {reviews.length === 0 ? (
                                            <p style={s.empty}>Vous n'avez pas encore laissé d'avis.</p>
                                        ) : reviews.map(rv => (
                                            <div key={rv.id} style={s.reviewCard}>
                                                <strong>{rv.event?.title}</strong>
                                                <div style={{ color: GOLD }}>{"★".repeat(rv.rating)}<span style={{ color: "#ddd" }}>{"★".repeat(5 - rv.rating)}</span></div>
                                                {rv.comment && <p style={{ fontSize: "13px", color: "#555", marginTop: "6px" }}>{rv.comment}</p>}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

const s = {
    page: { background: "#F8F4E3", minHeight: "100vh" },
    navbar: { background: GREEN_DARK, padding: "0 28px", height: "58px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" },
    navBrand: { color: "#fff", fontWeight: "700", fontSize: "15px", display: "flex", alignItems: "center", gap: "8px" },
    navLogo: { width: "26px", height: "26px", borderRadius: "6px", background: GREEN, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "10px" },
    navTabs: { display: "flex", gap: "4px" },
    navTab: { background: "none", border: "none", color: "#c3d7c8", padding: "8px 14px", borderRadius: "7px", fontSize: "13px", cursor: "pointer", textDecoration: "none", fontWeight: "500" },
    navTabActive: { background: "rgba(255,255,255,0.12)", color: "#fff", fontWeight: "700" },
    navRight: { display: "flex", alignItems: "center", gap: "10px", color: "#fff" },
    navAvatar: { width: "28px", height: "28px", borderRadius: "50%", background: GREEN, color: "#fff", fontSize: "11px", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center" },
    bellBtn: { position: "relative", width: "30px", height: "30px", borderRadius: "50%", background: "rgba(255,255,255,0.1)", border: "none", cursor: "pointer", fontSize: "13px", display: "flex", alignItems: "center", justifyContent: "center" },
    navBellDot: { position: "absolute", top: "5px", right: "6px", width: "7px", height: "7px", borderRadius: "50%", background: "#e65100", border: "1.5px solid " + GREEN_DARK },

    body: { padding: "28px", maxWidth: "1100px", margin: "0 auto" },
    msgBox: { background: "#e8f5e9", color: "#2e7d32", padding: "12px 20px", borderRadius: "8px", marginBottom: "16px", fontSize: "13px" },
    layout: { display: "grid", gridTemplateColumns: "300px 1fr", gap: "24px", alignItems: "flex-start" },

    profileCard: { background: "#fff", borderRadius: "14px", overflow: "hidden", border: "1px solid #e0e0e0", position: "sticky", top: "20px" },
    profileBanner: { height: "56px", background: `linear-gradient(135deg, #4C9A5C, ${GREEN})` },
    profileBody: { padding: "0 20px 20px", marginTop: "-28px" },
    profileAvatar: { width: "56px", height: "56px", borderRadius: "50%", background: GREEN, color: "#fff", fontSize: "18px", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center", border: "3px solid #fff", marginBottom: "10px" },
    profileName: { fontSize: "16px", fontWeight: "800", color: "#1B1B1B" },
    profileEmail: { fontSize: "12px", color: "#888", marginTop: "2px", wordBreak: "break-all" },
    profileSince: { fontSize: "11px", color: "#aaa", marginTop: "4px", marginBottom: "12px" },
    tagRow: { display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "16px" },
    tag: { background: "#e8f5e9", color: GREEN, fontSize: "11px", fontWeight: "600", padding: "3px 10px", borderRadius: "20px" },
    statsTrio: { display: "flex", justifyContent: "space-between", padding: "14px 0", borderTop: "1px solid #eee", borderBottom: "1px solid #eee", marginBottom: "16px" },
    statTrioNum: { fontSize: "18px", fontWeight: "800", color: "#1B1B1B", textAlign: "center" },
    statTrioLbl: { fontSize: "10px", color: "#999", textAlign: "center" },
    levelPill: { display: "inline-block", color: "#fff", fontSize: "11px", fontWeight: "700", padding: "5px 12px", borderRadius: "20px", marginBottom: "14px" },
    levelBox: { marginBottom: "16px" },
    levelBoxHeader: { fontSize: "10px", fontWeight: "700", color: "#999", letterSpacing: "0.5px" },
    levelBoxSub: { fontSize: "10px", color: "#aaa", marginTop: "3px", marginBottom: "10px", lineHeight: "1.4" },
    ladderRow: { display: "flex", alignItems: "center", gap: "10px", borderRadius: "8px", padding: "8px 10px", marginBottom: "4px" },
    ladderDot: { width: "10px", height: "10px", borderRadius: "50%", flexShrink: 0 },
    ladderLabel: { fontSize: "12px", fontWeight: "700", color: "#1B1B1B" },
    ladderRange: { fontSize: "10px", color: "#999", marginTop: "1px" },
    ladderCheck: { color: "#2e7d32", fontWeight: "800", fontSize: "13px" },
    logoutBtn: { width: "100%", background: "#fff", color: "#c62828", border: "1px solid #ffcdd2", borderRadius: "8px", padding: "9px", cursor: "pointer", fontSize: "12px", fontWeight: "600" },

    card: { background: "#fff", border: "1px solid #e0e0e0", borderRadius: "12px", padding: "24px", marginBottom: "20px" },
    cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "center" },
    cardTitle: { fontSize: "15px", fontWeight: "800", color: "#1B1B1B" },
    editBtn: { background: GREEN, color: "#fff", border: "none", borderRadius: "8px", padding: "8px 16px", cursor: "pointer", fontSize: "12px", fontWeight: "600" },
    editBtnGhost: { background: "none", border: "none", color: GREEN, fontSize: "12px", fontWeight: "700", cursor: "pointer", padding: 0 },
    infoGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginTop: "18px" },
    infoItem: { display: "flex", flexDirection: "column", gap: "4px" },
    infoKey: { fontSize: "10px", color: "#999", textTransform: "uppercase", fontWeight: "700", letterSpacing: "0.5px" },
    infoVal: { fontSize: "13px", color: "#1B1B1B" },
    formGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginTop: "18px" },
    row: { display: "flex", flexDirection: "column", gap: "6px" },
    label: { fontSize: "12px", color: "#555", fontWeight: "500" },
    input: { padding: "9px 12px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "13px", outline: "none" },
    btnRow: { display: "flex", gap: "10px", gridColumn: "span 2", marginTop: "8px" },
    btn: { color: "#fff", border: "none", borderRadius: "8px", padding: "9px 18px", cursor: "pointer", fontSize: "13px", fontWeight: "600" },
    cancelBtn: { background: "#fff", color: "#555", border: "1px solid #ddd", borderRadius: "8px", padding: "9px 18px", cursor: "pointer", fontSize: "13px" },

    upcomingRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", borderLeft: "3px solid", background: "#F8F4E3", borderRadius: "0 8px 8px 0", marginBottom: "10px", flexWrap: "wrap", gap: "8px" },
    attestationRow: { display: "flex", alignItems: "center", gap: "14px", padding: "14px 16px", background: "#F8F4E3", borderRadius: "10px", marginBottom: "10px" },
    attestationIcon: { fontSize: "22px", width: "40px", height: "40px", background: "#fff", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
    upcomingTitle: { fontSize: "13px", fontWeight: "700", color: "#1B1B1B" },
    upcomingMeta: { fontSize: "11px", color: "#888", marginTop: "2px" },
    eventDateBox: { background: "#fff", borderRadius: "8px", padding: "6px 10px", textAlign: "center", minWidth: "44px", flexShrink: 0 },
    eventDateDay: { fontSize: "15px", fontWeight: "800", color: GREEN, lineHeight: 1 },
    eventDateMonth: { fontSize: "9px", fontWeight: "700", color: GREEN },

    table: { width: "100%", borderCollapse: "collapse", marginTop: "16px" },
    th: { textAlign: "left", fontSize: "10px", color: "#999", fontWeight: "700", letterSpacing: "0.5px", padding: "0 10px 10px", borderBottom: "1px solid #eee" },
    tr: { borderBottom: "1px solid #f2f2f2" },
    td: { padding: "12px 10px", fontSize: "13px", color: "#333" },
    linkBtn: { background: "none", border: "none", color: GREEN, fontWeight: "600", fontSize: "12px", cursor: "pointer", padding: 0 },

    badge: { fontSize: "11px", fontWeight: "700", padding: "3px 10px", borderRadius: "20px", width: "fit-content", whiteSpace: "nowrap" },
    cancelRegBtn: { background: "#fff", color: "#c62828", border: "1px solid #ffcdd2", borderRadius: "8px", padding: "6px 12px", cursor: "pointer", fontSize: "12px", whiteSpace: "nowrap" },
    reviewForm: { background: "#F8F4E3", border: "1px solid #e0e0e0", borderRadius: "10px", padding: "16px", marginBottom: "12px", display: "flex", flexDirection: "column", gap: "10px" },
    stars: { display: "flex", gap: "6px" },
    star: { fontSize: "26px", cursor: "pointer" },
    textarea: { padding: "10px 14px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "13px", height: "70px", resize: "none", outline: "none" },
    reviewCard: { background: "#fff", border: "1px solid #e0e0e0", borderRadius: "10px", padding: "14px 16px", marginBottom: "10px" },
    empty: { color: "#888", fontSize: "13px", textAlign: "center", padding: "24px 0" },
    loading: { textAlign: "center", padding: "80px", color: "#888" }
};

export default VolunteerDashboard;
