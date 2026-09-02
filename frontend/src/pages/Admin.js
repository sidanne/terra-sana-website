import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isTokenValid, logout } from "../services/auth";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend } from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";

// Enregistrement des modules Chart.js utilisés (requis par la librairie avant tout rendu de graphique)
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend);

function Admin() {
    const [projects, setProjects] = useState([]);
    const [posts, setPosts] = useState([]);
    const [messages, setMessages] = useState([]);
    const [newProject, setNewProject] = useState({ name: "", description: "", link: "", category: "", image: "", isActive: true });
    const [newPost, setNewPost] = useState({ title: "", content: "", image: "", isPublished: true });
    const [editProject, setEditProject] = useState(null);
    const [editPost, setEditPost] = useState(null);
    const [replyMsg, setReplyMsg] = useState(null);
    const [replyText, setReplyText] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [confirmDelete, setConfirmDelete] = useState(null);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordForm, setPasswordForm] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
    const [passwordError, setPasswordError] = useState("");
    const [activeTab, setActiveTab] = useState("dashboard");
    const [filterMessages, setFilterMessages] = useState("tous");
    // ── États pour les nouveaux onglets TFE ──────────────────────────────────
    const [events, setEvents] = useState([]);
    const [volunteers, setVolunteers] = useState([]);
    const [newEvent, setNewEvent] = useState({ title: "", description: "", eventDate: "", location: "", maxPlaces: "", imageUrl: "" });
    const [editEvent, setEditEvent] = useState(null);
    const [eventRegistrations, setEventRegistrations] = useState(null);
    const [eventRegistrationsModal, setEventRegistrationsModal] = useState(false);
    const [currentEventId, setCurrentEventId] = useState(null);
    const [allRegistrations, setAllRegistrations] = useState([]);
    const [allReviews, setAllReviews] = useState([]);
    const [volunteerFilter, setVolunteerFilter] = useState({ skill: "", availability: "", language: "" });
    const [eventsPageNum, setEventsPageNum] = useState(0);
    const [eventSearch, setEventSearch] = useState("");
    const [volunteersPageNum, setVolunteersPageNum] = useState(0);
    const [eventReviews, setEventReviews] = useState(null);
    const [eventReviewsModal, setEventReviewsModal] = useState(false);
    const [groupEmailModal, setGroupEmailModal] = useState(false);
    const [groupEmailText, setGroupEmailText] = useState("");
    const PAGE_SIZE = 5;
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const fetchData = useCallback(async () => {
        const currentToken = localStorage.getItem("token");
        if (!currentToken) return;
        const headers = { Authorization: `Bearer ${currentToken}` };
        const p = await fetch("http://localhost:8080/api/projects", { headers }).then(r => r.json());
        const b = await fetch("http://localhost:8080/api/posts", { headers }).then(r => r.json());
        const m = await fetch("http://localhost:8080/api/contact", { headers }).then(r => r.json());
        const ev = await fetch("http://localhost:8080/api/events", { headers }).then(r => r.json());
        const vols = await fetch("http://localhost:8080/api/volunteers", { headers }).then(r => r.json());
        const regs = await fetch("http://localhost:8080/api/registrations", { headers }).then(r => r.json());
        const revs = await fetch("http://localhost:8080/api/reviews", { headers }).then(r => r.json());
        setProjects(Array.isArray(p) ? p : []);
        setPosts(Array.isArray(b) ? b : []);
        setMessages(Array.isArray(m) ? m : []);
        setEvents(Array.isArray(ev) ? ev : []);
        setVolunteers(Array.isArray(vols) ? vols : []);
        setAllRegistrations(Array.isArray(regs) ? regs : []);
        setAllReviews(Array.isArray(revs) ? revs : []);
    }, []);

    useEffect(() => {
        if (!isTokenValid()) { navigate("/login"); return; }
        fetchData();
        const interval = setInterval(() => {
            if (!isTokenValid()) { navigate("/login"); }
        }, 60000);
        return () => clearInterval(interval);
    }, [fetchData, navigate]);

    const showSuccess = (msg) => {
        setSuccessMsg(msg);
        setTimeout(() => setSuccessMsg(""), 3000);
    };

    const unreadCount = messages.filter(m => !m.read).length;

    // ── Données pour les graphiques Chart.js (section 3.7 de l'analyse) ──────
    // Regroupe les inscriptions par mois (6 derniers mois) pour la courbe d'évolution
    const monthlyData = (() => {
        const now = new Date();
        const months = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            months.push({ key: `${d.getFullYear()}-${d.getMonth()}`, label: d.toLocaleDateString("fr-BE", { month: "short", year: "2-digit" }) });
        }
        const counts = months.map(m => allRegistrations.filter(r => {
            if (!r.createdAt) return false;
            const d = new Date(r.createdAt);
            return `${d.getFullYear()}-${d.getMonth()}` === m.key;
        }).length);
        return { labels: months.map(m => m.label), counts };
    })();

    // Répartition des statuts d'inscription = taux de participation (CONFIRMED vs autres)
    const statusCounts = {
        CONFIRMED: allRegistrations.filter(r => r.status === "CONFIRMED").length,
        WAITING: allRegistrations.filter(r => r.status === "WAITING").length,
        REFUSED: allRegistrations.filter(r => r.status === "REFUSED").length
    };
    const participationRate = allRegistrations.length > 0
        ? Math.round((statusCounts.CONFIRMED / allRegistrations.length) * 100) : 0;

    // Liste des bénévoles filtrée par compétence / disponibilité / langue (recherche insensible à la casse)
    const filteredVolunteers = volunteers.filter(v => {
        const skillMatch = !volunteerFilter.skill || (v.skills || "").toLowerCase().includes(volunteerFilter.skill.toLowerCase());
        const availMatch = !volunteerFilter.availability || (v.availability || "").toLowerCase().includes(volunteerFilter.availability.toLowerCase());
        const langMatch = !volunteerFilter.language || v.preferredLanguage === volunteerFilter.language;
        return skillMatch && availMatch && langMatch;
    });

    // Recherche par titre + tri du plus récemment créé au plus ancien, pour retrouver vite un nouvel événement
    // (la page publique trie par date d'événement, mais côté admin c'est la date de création qui compte)
    const filteredEvents = events
        .filter(e => e.title.toLowerCase().includes(eventSearch.toLowerCase()))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Pagination (Spring Boot Pageable côté backend — voir /api/events/paged et /api/volunteers/paged ;
    // affichage paginé côté client ici pour rester réactif avec les filtres en temps réel)
    const eventsPageCount = Math.max(1, Math.ceil(filteredEvents.length / PAGE_SIZE));
    const paginatedEvents = filteredEvents.slice(eventsPageNum * PAGE_SIZE, (eventsPageNum + 1) * PAGE_SIZE);

    const volunteersPageCount = Math.max(1, Math.ceil(filteredVolunteers.length / PAGE_SIZE));
    const paginatedVolunteers = filteredVolunteers.slice(volunteersPageNum * PAGE_SIZE, (volunteersPageNum + 1) * PAGE_SIZE);

    const updateVolunteerFilter = (field, value) => {
        setVolunteerFilter(prev => ({ ...prev, [field]: value }));
        setVolunteersPageNum(0); // Revenir à la page 1 à chaque changement de filtre
    };

    const toggleActive = async (project) => {
        const updated = { ...project, isActive: !project.isActive };
        await fetch(`http://localhost:8080/api/projects/${project.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify(updated)
        });
        fetchData();
        showSuccess(updated.isActive ? "Projet active !" : "Projet desactive !");
    };

    // Petit helper : envoie la requête et ne montre "succès" que si le serveur a vraiment accepté —
    // avant, un échec (validation, session expirée...) affichait quand même "ajouté avec succès",
    // ce qui a fait croire à plusieurs reprises qu'un projet/événement avait été créé alors que non.
    const submitOrShowError = async (fetchCall, onSuccess, successMsg, genericErrorMsg) => {
        try {
            const res = await fetchCall();
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                showSuccess(data.message || genericErrorMsg);
                return;
            }
            onSuccess();
            fetchData();
            showSuccess(successMsg);
        } catch {
            showSuccess("Impossible de contacter le serveur.");
        }
    };

    const addProject = async (e) => {
        e.preventDefault();
        await submitOrShowError(
            () => fetch("http://localhost:8080/api/projects", {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(newProject)
            }),
            () => setNewProject({ name: "", description: "", link: "", category: "", image: "", isActive: true }),
            "Projet ajoute avec succes !",
            "Erreur lors de la création du projet."
        );
    };

    const updateProject = async (e) => {
        e.preventDefault();
        await submitOrShowError(
            () => fetch(`http://localhost:8080/api/projects/${editProject.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(editProject)
            }),
            () => setEditProject(null),
            "Projet modifie avec succes !",
            "Erreur lors de la modification du projet."
        );
    };

    const confirmAndDelete = (type, id, nom) => setConfirmDelete({ type, id, nom });

    const executeDelete = async () => {
        const { type, id } = confirmDelete;
        const urls = { project: `/api/projects/${id}`, post: `/api/posts/${id}`, message: `/api/contact/${id}`, event: `/api/events/${id}` };
        await submitOrShowError(
            () => fetch(`http://localhost:8080${urls[type]}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }),
            () => setConfirmDelete(null),
            "Supprime avec succes !",
            "Erreur lors de la suppression."
        );
    };

    const addPost = async (e) => {
        e.preventDefault();
        await submitOrShowError(
            () => fetch("http://localhost:8080/api/posts", {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(newPost)
            }),
            () => setNewPost({ title: "", content: "", image: "", isPublished: true }),
            "Article publie avec succes !",
            "Erreur lors de la publication de l'article."
        );
    };

    const updatePost = async (e) => {
        e.preventDefault();
        await submitOrShowError(
            () => fetch(`http://localhost:8080/api/posts/${editPost.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(editPost)
            }),
            () => setEditPost(null),
            "Article modifie avec succes !",
            "Erreur lors de la modification de l'article."
        );
    };

    const markAsRead = async (id) => {
        await fetch(`http://localhost:8080/api/contact/${id}/read`, {
            method: "PUT", headers: { Authorization: `Bearer ${token}` }
        });
        fetchData();
    };

    const replyMessage = async (e) => {
        e.preventDefault();
        await fetch(`http://localhost:8080/api/contact/${replyMsg.id}/reply`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ reply: replyText })
        });
        setReplyMsg(null);
        setReplyText("");
        fetchData();
        showSuccess("Reponse envoyee avec succes !");
    };

    const changePassword = async (e) => {
        e.preventDefault();
        setPasswordError("");
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setPasswordError("Les mots de passe ne correspondent pas");
            return;
        }
        if (passwordForm.newPassword.length < 8) {
            setPasswordError("Le mot de passe doit contenir au moins 8 caracteres");
            return;
        }
        try {
            const res = await fetch("http://localhost:8080/api/auth/changePassword", {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ oldPassword: passwordForm.oldPassword, newPassword: passwordForm.newPassword })
            });
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.message || "Ancien mot de passe incorrect");
            }
            setShowPasswordModal(false);
            setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
            showSuccess("Mot de passe change avec succes !");
        } catch (err) {
            setPasswordError(err.message);
        }
    };

    const handleLogout = () => { logout(); navigate("/login"); };

    // ── Fonctions Événements ─────────────────────────────────────────────────
    const createEvent = async (e) => {
        e.preventDefault();
        await submitOrShowError(
            () => fetch("http://localhost:8080/api/events", {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ ...newEvent, maxPlaces: parseInt(newEvent.maxPlaces) })
            }),
            () => setNewEvent({ title: "", description: "", eventDate: "", location: "", maxPlaces: "", imageUrl: "" }),
            "Événement créé avec succès !",
            "Erreur lors de la création de l'événement."
        );
    };

    const updateEvent = async (e) => {
        e.preventDefault();
        await submitOrShowError(
            () => fetch(`http://localhost:8080/api/events/${editEvent.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ ...editEvent, maxPlaces: parseInt(editEvent.maxPlaces) })
            }),
            () => setEditEvent(null),
            "Événement modifié !",
            "Erreur lors de la modification de l'événement."
        );
    };

    const changeEventStatus = async (id, status) => {
        await submitOrShowError(
            () => fetch(`http://localhost:8080/api/events/${id}/status`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ status })
            }),
            () => {},
            `Statut mis à jour : ${status}`,
            "Impossible de changer le statut."
        );
    };

    const viewEventRegistrations = async (eventId) => {
        const regs = await fetch(`http://localhost:8080/api/registrations/event/${eventId}`, {
            headers: { Authorization: `Bearer ${token}` }
        }).then(r => r.json());
        setEventRegistrations(Array.isArray(regs) ? regs : []);
        setEventRegistrationsModal(true);
        setCurrentEventId(eventId);
    };

    // RG-21 — Export PDF de la liste des inscrits (réservé à l'admin)
    const exportRegistrationsPdf = async () => {
        const res = await fetch(`http://localhost:8080/api/registrations/event/${currentEventId}/export`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) { showSuccess("Erreur lors de l'export."); return; }
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "inscrits.pdf";
        a.click();
        window.URL.revokeObjectURL(url);
    };

    // Section 3.5 — Consulter les avis et la note moyenne d'un événement (admin)
    const viewEventReviews = async (eventId) => {
        const data = await fetch(`http://localhost:8080/api/reviews/event/${eventId}`, {
            headers: { Authorization: `Bearer ${token}` }
        }).then(r => r.json());
        setEventReviews(data);
        setEventReviewsModal(true);
        setCurrentEventId(eventId);
    };

    // RG-03 — Active/désactive un compte bénévole, sans le supprimer (admin)
    const toggleVolunteerActive = async (id) => {
        const res = await fetch(`http://localhost:8080/api/volunteers/${id}/toggle-active`, {
            method: "PUT",
            headers: { Authorization: `Bearer ${token}` }
        });
        const updated = await res.json();
        setVolunteers(prev => prev.map(v => v.id === id ? updated : v));
        showSuccess(updated.isActive ? "Compte réactivé." : "Compte désactivé.");
    };

    // Section 3.3 — Envoyer un message groupé à tous les inscrits d'un événement (admin)
    const sendGroupEmail = async () => {
        if (!groupEmailText.trim()) { showSuccess("Écris un message avant d'envoyer."); return; }
        const res = await fetch(`http://localhost:8080/api/registrations/event/${currentEventId}/group-email`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ message: groupEmailText })
        });
        const data = await res.json();
        setGroupEmailModal(false);
        setGroupEmailText("");
        showSuccess(data.message || "Email envoyé.");
    };

    const confirmReg = async (id) => {
        await fetch(`http://localhost:8080/api/registrations/${id}/confirm`, {
            method: "PUT", headers: { Authorization: `Bearer ${token}` }
        });
        // Rafraîchir la modale si elle est ouverte (bouton appelé depuis la modale d'un événement),
        // et toujours resynchroniser la liste globale (utilisée par l'onglet Inscriptions et le tableau de bord)
        if (eventRegistrations && eventRegistrations.length > 0) {
            const eventId = eventRegistrations[0]?.event?.id;
            if (eventId) viewEventRegistrations(eventId);
        }
        fetchData();
        showSuccess("Inscription confirmée !");
    };

    const rejectReg = async (id) => {
        await fetch(`http://localhost:8080/api/registrations/${id}/reject`, {
            method: "PUT", headers: { Authorization: `Bearer ${token}` }
        });
        if (eventRegistrations && eventRegistrations.length > 0) {
            const eventId = eventRegistrations[0]?.event?.id;
            if (eventId) viewEventRegistrations(eventId);
        }
        fetchData();
        showSuccess("Inscription refusée.");
    };

    const formatDate = (date) => {
        if (!date) return "";
        return new Date(date).toLocaleDateString("fr-BE", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
    };

    const filteredMessages = messages.filter(m => {
        if (filterMessages === "lus") return m.read;
        if (filterMessages === "nonlus") return !m.read;
        return true;
    });

    const mainTabs = [
        { id: "dashboard", label: "Tableau de bord", icon: "📊" },
        { id: "evenements", label: "Événements", count: events.length, badge: statusCounts.WAITING, icon: "📅" },
        { id: "benevoles", label: "Bénévoles", count: volunteers.length, icon: "👤" },
        { id: "inscriptions", label: "Inscriptions", count: allRegistrations.length, icon: "☰" },
        { id: "avis", label: "Retours post-événement", icon: "☆" }
    ];
    const reportTabs = [
        { id: "attestations", label: "Attestations PDF", icon: "📄" },
        { id: "statistiques", label: "Statistiques", icon: "📈" }
    ];
    const siteTabs = [
        { id: "projets", label: "Projets", count: projects.length, icon: "📁" },
        { id: "blog", label: "Blog", count: posts.length, icon: "📝" },
        { id: "messages", label: "Messages", badge: unreadCount, icon: "💬" }
    ];
    const tabs = [...mainTabs, ...reportTabs, ...siteTabs];
    const activeTabInfo = tabs.find(t => t.id === activeTab);

    const today = new Date().toLocaleDateString("fr-BE", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
    const eventsToVenir = events.filter(e => e.status === "OPEN" || e.status === "FULL").length;

    return (
        <div className="admin-shell" style={styles.shell}>
            {/* ── SIDEBAR ── */}
            <div className="admin-sidebar" style={styles.sidebar}>
                <div className="admin-sidebar-hide-mobile" style={styles.sidebarBrand}>
                    <div style={styles.sidebarLogo}>TS</div>
                    <div>
                        <div style={styles.sidebarBrandName}>Terra Sana</div>
                        <div style={styles.sidebarBrandSub}>MODULE BÉNÉVOLES</div>
                    </div>
                </div>

                <div className="admin-sidebar-hide-mobile" style={styles.sidebarSectionLabel}>PRINCIPAL</div>
                <nav>
                    {mainTabs.map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                            style={{ ...styles.sidebarItem, ...(activeTab === tab.id ? styles.sidebarItemActive : {}) }}>
                            <span style={styles.sidebarItemIcon}>{tab.icon}</span>
                            <span style={{ flex: 1, textAlign: "left" }}>{tab.label}</span>
                            {tab.badge > 0 && <span style={styles.sidebarBadge}>{tab.badge}</span>}
                        </button>
                    ))}
                </nav>

                <div className="admin-sidebar-hide-mobile" style={styles.sidebarSectionLabel}>RAPPORTS</div>
                <nav>
                    {reportTabs.map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                            style={{ ...styles.sidebarItem, ...(activeTab === tab.id ? styles.sidebarItemActive : {}) }}>
                            <span style={styles.sidebarItemIcon}>{tab.icon}</span>
                            <span style={{ flex: 1, textAlign: "left" }}>{tab.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="admin-sidebar-hide-mobile" style={styles.sidebarSectionLabel}>SITE VITRINE</div>
                <nav>
                    {siteTabs.map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                            style={{ ...styles.sidebarItem, ...(activeTab === tab.id ? styles.sidebarItemActive : {}) }}>
                            <span style={styles.sidebarItemIcon}>{tab.icon}</span>
                            <span style={{ flex: 1, textAlign: "left" }}>{tab.label}</span>
                            {tab.badge > 0 && <span style={styles.sidebarBadge}>{tab.badge}</span>}
                        </button>
                    ))}
                </nav>

                <div style={styles.sidebarFooter}>
                    <div style={styles.sidebarAvatar}>A</div>
                    <div>
                        <div style={styles.sidebarFooterName}>Administrateur</div>
                        <button onClick={handleLogout} style={styles.sidebarLogout}>Se déconnecter</button>
                    </div>
                </div>
            </div>

            {/* ── CONTENU PRINCIPAL ── */}
            <div style={styles.main}>
            {successMsg && <div style={styles.successBanner}>{successMsg}</div>}

            <div style={styles.header}>
                <h1 style={styles.title}>{activeTabInfo?.label || "Tableau de bord"}</h1>
                <div style={styles.headerRight}>
                    <span style={styles.datePill}>{today.charAt(0).toUpperCase() + today.slice(1)}</span>
                    <button onClick={() => setActiveTab("messages")} style={styles.iconBtn} title="Messages non lus">
                        🔔{unreadCount > 0 && <span style={styles.bellDot} />}
                    </button>
                    <button onClick={() => setShowPasswordModal(true)} style={styles.iconBtnCircle} title="Changer mot de passe">A</button>
                </div>
            </div>

            {activeTab === "dashboard" && (
                <div className="grid-responsive" style={styles.statsRow}>
                    <div style={styles.statCardV2}>
                        <span style={{ ...styles.statIconBox, background: "#e8f5e9" }}>👤</span>
                        <div style={styles.statLblV2}>BÉNÉVOLES ACTIFS</div>
                        <div style={styles.statNumV2}>{volunteers.filter(v => v.isActive !== false).length}</div>
                        <div style={styles.statTrend}>↑ {volunteers.length} au total</div>
                    </div>
                    <div style={styles.statCardV2}>
                        <span style={{ ...styles.statIconBox, background: "#fff3e0" }}>📅</span>
                        <div style={styles.statLblV2}>ÉVÉNEMENTS À VENIR</div>
                        <div style={styles.statNumV2}>{eventsToVenir}</div>
                        <div style={{ ...styles.statTrend, color: "#888" }}>{events.length} au total</div>
                    </div>
                    <div style={styles.statCardV2}>
                        <span style={{ ...styles.statIconBox, background: "#e3f2fd" }}>☰</span>
                        <div style={styles.statLblV2}>INSCRIPTIONS EN ATTENTE</div>
                        <div style={styles.statNumV2}>{statusCounts.WAITING}</div>
                        <div style={styles.statTrend}>↑ à traiter</div>
                    </div>
                    <div style={styles.statCardV2}>
                        <span style={{ ...styles.statIconBox, background: "#f3e5f5" }}>★</span>
                        <div style={styles.statLblV2}>TAUX DE PARTICIPATION</div>
                        <div style={styles.statNumV2}>{participationRate}%</div>
                        <div style={styles.statTrend}>↑ {statusCounts.CONFIRMED} confirmées</div>
                    </div>
                </div>
            )}

            {activeTab === "dashboard" && (() => {
                const upcoming = [...events]
                    .filter(e => e.status === "OPEN" || e.status === "FULL")
                    .sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));
                const inSevenDays = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
                const thisWeek = upcoming.filter(e => new Date(e.eventDate) <= inSevenDays);
                const confirmedFor = (eventId) => allRegistrations.filter(r => r.event?.id === eventId && r.status === "CONFIRMED").length;
                const fmtShort = (d) => new Date(d).toLocaleDateString("fr-BE", { day: "2-digit", month: "short" });
                const fmtDay = (d) => new Date(d).getDate();
                const fmtMonth = (d) => new Date(d).toLocaleDateString("fr-BE", { month: "short" }).toUpperCase();

                return (
                    <div className="grid-responsive" style={styles.dashGrid}>
                        <div style={styles.dashMain}>
                            <div style={styles.dashCard}>
                                <div style={styles.dashCardHeader}>
                                    <h2 style={styles.sectionTitle}>Prochains événements</h2>
                                    <button onClick={() => setActiveTab("evenements")} style={styles.dashLink}>Voir tous →</button>
                                </div>
                                {upcoming.length === 0 ? (
                                    <p style={{ color: "#888", fontSize: "13px", padding: "16px 0" }}>Aucun événement à venir.</p>
                                ) : (
                                    <table style={styles.dashTable}>
                                        <thead>
                                            <tr>
                                                <th style={styles.dashTh}>ÉVÉNEMENT</th>
                                                <th style={styles.dashTh}>DATE</th>
                                                <th style={styles.dashTh}>BÉNÉVOLES</th>
                                                <th style={styles.dashTh}>STATUT</th>
                                                <th style={styles.dashTh}></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {upcoming.slice(0, 6).map(ev => (
                                                <tr key={ev.id} style={styles.dashTr}>
                                                    <td style={styles.dashTd}>
                                                        <strong>{ev.title}</strong><br />
                                                        <span style={{ color: "#999", fontSize: "11px" }}>{ev.location}</span>
                                                    </td>
                                                    <td style={styles.dashTd}>{fmtShort(ev.eventDate)}</td>
                                                    <td style={{ ...styles.dashTd, color: ev.status === "FULL" ? "#e65100" : "#2e7d32", fontWeight: "700" }}>
                                                        {confirmedFor(ev.id)} / {ev.maxPlaces}
                                                    </td>
                                                    <td style={styles.dashTd}>
                                                        <span style={{ ...styles.toggleBtn, background: ev.status === "FULL" ? "#fff3e0" : "#e8f5e9", color: ev.status === "FULL" ? "#e65100" : "#2e7d32" }}>
                                                            {ev.status === "FULL" ? "Complet" : "Ouvert"}
                                                        </span>
                                                    </td>
                                                    <td style={styles.dashTd}>
                                                        <button onClick={() => { setActiveTab("evenements"); viewEventRegistrations(ev.id); }} style={styles.dashLink}>Gérer →</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>

                        <div style={styles.dashSide}>
                            <div style={styles.dashCard}>
                                <h2 style={styles.sectionTitle}>Cette semaine</h2>
                                {thisWeek.length === 0 ? (
                                    <p style={{ color: "#888", fontSize: "13px" }}>Rien de prévu cette semaine.</p>
                                ) : thisWeek.map(ev => (
                                    <div key={ev.id} style={styles.weekItem}>
                                        <div style={styles.weekDate}>
                                            <div style={styles.weekDay}>{fmtDay(ev.eventDate)}</div>
                                            <div style={styles.weekMonth}>{fmtMonth(ev.eventDate)}</div>
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: "700", fontSize: "13px" }}>{ev.title}</div>
                                            <div style={{ fontSize: "11px", color: "#888" }}>{ev.location}</div>
                                            <div style={{ fontSize: "11px", color: "#2D6A4F", fontWeight: "600" }}>{confirmedFor(ev.id)} bénévole(s) confirmé(s)</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div style={styles.dashCard}>
                                <h2 style={styles.sectionTitle}>Actions rapides</h2>
                                <div style={styles.quickActionsGrid}>
                                    <button onClick={() => setActiveTab("evenements")} style={styles.quickActionBtn}>
                                        <span>📅</span> Nouvel événement
                                    </button>
                                    <button onClick={() => setActiveTab("benevoles")} style={styles.quickActionBtnOutline}>
                                        <span>👤</span> Ajouter bénévole
                                    </button>
                                    <button onClick={() => setActiveTab("attestations")} style={styles.quickActionBtnOutline}>
                                        <span>📄</span> Attestation PDF
                                    </button>
                                    <button onClick={() => setActiveTab("statistiques")} style={styles.quickActionBtnOutline}>
                                        <span>📈</span> Statistiques
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })()}

            {/* ── INSCRIPTIONS (toutes, tous événements confondus) ── */}
            {activeTab === "inscriptions" && (
                <>
                    <div style={styles.inscriptionsBanner}>
                        <span style={styles.inscriptionsBannerIcon}>☰</span>
                        <div>
                            <div style={styles.inscriptionsBannerTitle}>Suivi des inscriptions</div>
                            <div style={styles.inscriptionsBannerSub}>
                                {statusCounts.WAITING} en attente · {statusCounts.CONFIRMED} confirmées · {statusCounts.REFUSED} refusées
                            </div>
                        </div>
                    </div>
                    <div style={styles.dashCard}>
                    <h2 style={styles.sectionTitle}>Toutes les inscriptions ({allRegistrations.length})</h2>
                    {allRegistrations.length === 0 ? (
                        <p style={{ color: "#888", fontSize: "13px", padding: "16px 0" }}>Aucune inscription pour le moment.</p>
                    ) : (
                        <table style={styles.dashTable}>
                            <thead>
                                <tr>
                                    <th style={styles.dashTh}>BÉNÉVOLE</th>
                                    <th style={styles.dashTh}>ÉVÉNEMENT</th>
                                    <th style={styles.dashTh}>STATUT</th>
                                    <th style={styles.dashTh}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {[...allRegistrations].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(r => {
                                    const stStyle = { WAITING:{bg:"#fff3e0",c:"#e65100"}, CONFIRMED:{bg:"#e8f5e9",c:"#2e7d32"}, REFUSED:{bg:"#eeeeee",c:"#616161"} }[r.status] || {};
                                    return (
                                        <tr key={r.id} style={styles.dashTr}>
                                            <td style={styles.dashTd}>
                                                <strong>{r.user?.firstName} {r.user?.lastName}</strong><br />
                                                <span style={{ color: "#999", fontSize: "11px" }}>{r.user?.email}</span>
                                            </td>
                                            <td style={styles.dashTd}>{r.event?.title}</td>
                                            <td style={styles.dashTd}>
                                                <span style={{ ...styles.toggleBtn, background: stStyle.bg, color: stStyle.c }}>{r.status}</span>
                                            </td>
                                            <td style={styles.dashTd}>
                                                {r.status === "WAITING" && (
                                                    <div style={{ display: "flex", gap: "6px" }}>
                                                        <button onClick={() => confirmReg(r.id)} style={styles.replyBtn}>Confirmer</button>
                                                        <button onClick={() => rejectReg(r.id)} style={styles.deleteBtn}>Refuser</button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                    </div>
                </>
            )}

            {/* ── RETOURS POST-ÉVÉNEMENT (tous les avis) ── */}
            {activeTab === "avis" && (
                <div style={styles.dashCard}>
                    <h2 style={styles.sectionTitle}>Retours post-événement ({allReviews.length})</h2>
                    {allReviews.length === 0 ? (
                        <p style={{ color: "#888", fontSize: "13px", padding: "16px 0" }}>Aucun avis pour le moment.</p>
                    ) : allReviews.map(rv => (
                        <div key={rv.id} style={{ ...styles.messageCard, marginTop: "12px" }}>
                            <div style={styles.messageHeader}>
                                <div style={styles.messageLeft}>
                                    <div style={{...styles.avatar, background: "#2D6A4F", color:"#fff"}}>
                                        {rv.user?.firstName?.charAt(0)?.toUpperCase()}
                                    </div>
                                    <div>
                                        <div style={styles.messageName}>{rv.user?.firstName} {rv.user?.lastName}</div>
                                        <div style={styles.messageEmail}>{rv.event?.title}</div>
                                    </div>
                                </div>
                                <div style={{ color: "#D4A017", fontSize: "14px" }}>
                                    {"★".repeat(rv.rating)}<span style={{ color: "#ddd" }}>{"★".repeat(5 - rv.rating)}</span>
                                </div>
                            </div>
                            {rv.comment && <div style={styles.messageText}>{rv.comment}</div>}
                        </div>
                    ))}
                </div>
            )}

            {/* ── ATTESTATIONS PDF (bénévoles éligibles) ── */}
            {activeTab === "attestations" && (
                <div style={styles.dashCard}>
                    <h2 style={styles.sectionTitle}>Bénévoles éligibles à une attestation</h2>
                    <p style={{ fontSize: "12px", color: "#888", marginTop: "-8px", marginBottom: "16px" }}>
                        Participation confirmée à un événement terminé (RG-20) — le bénévole télécharge lui-même son attestation depuis son espace personnel.
                    </p>
                    {(() => {
                        const eligible = allRegistrations.filter(r => r.status === "CONFIRMED" && r.event?.status === "FINISHED");
                        return eligible.length === 0 ? (
                            <p style={{ color: "#888", fontSize: "13px" }}>Aucune attestation disponible pour le moment.</p>
                        ) : (
                            <table style={styles.dashTable}>
                                <thead>
                                    <tr>
                                        <th style={styles.dashTh}>BÉNÉVOLE</th>
                                        <th style={styles.dashTh}>ÉVÉNEMENT</th>
                                        <th style={styles.dashTh}>DATE</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {eligible.map(r => (
                                        <tr key={r.id} style={styles.dashTr}>
                                            <td style={styles.dashTd}><strong>{r.user?.firstName} {r.user?.lastName}</strong></td>
                                            <td style={styles.dashTd}>{r.event?.title}</td>
                                            <td style={styles.dashTd}>{new Date(r.event?.eventDate).toLocaleDateString("fr-BE")}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        );
                    })()}
                </div>
            )}

            {/* ── STATISTIQUES (graphiques Chart.js) ── */}
            {activeTab === "statistiques" && (
                <div style={styles.chartsRow}>
                    <div style={styles.chartCard}>
                        <h3 style={styles.chartTitle}>Inscriptions par mois</h3>
                        <Line
                            data={{
                                labels: monthlyData.labels,
                                datasets: [{
                                    label: "Inscriptions",
                                    data: monthlyData.counts,
                                    borderColor: "#2D6A4F",
                                    backgroundColor: "rgba(45,106,79,0.1)",
                                    tension: 0.3,
                                    fill: true
                                }]
                            }}
                            options={{ responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } }}
                        />
                    </div>
                    <div style={styles.chartCard}>
                        <h3 style={styles.chartTitle}>Taux de participation : {participationRate}%</h3>
                        <div style={{ maxWidth: "220px", margin: "0 auto" }}>
                            <Doughnut
                                data={{
                                    labels: ["Confirmées", "En attente", "Refusées"],
                                    datasets: [{
                                        data: [statusCounts.CONFIRMED, statusCounts.WAITING, statusCounts.REFUSED],
                                        backgroundColor: ["#2e7d32", "#e65100", "#c62828"]
                                    }]
                                }}
                                options={{ responsive: true, plugins: { legend: { position: "bottom", labels: { boxWidth: 12, font: { size: 11 } } } } }}
                            />
                        </div>
                    </div>
                </div>
            )}

            {activeTab === "projets" && (
                <div>
                    <div style={styles.section}>
                        <h2 style={styles.sectionTitle}>Ajouter un projet</h2>
                        <form onSubmit={addProject} style={styles.form}>
                            <div style={styles.formGrid}>
                                <input placeholder="Nom du projet" value={newProject.name} onChange={e => setNewProject({...newProject, name: e.target.value})} style={styles.input} required />
                                <input placeholder="Categorie" value={newProject.category} onChange={e => setNewProject({...newProject, category: e.target.value})} style={styles.input} />
                            </div>
                            <input placeholder="Description" value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})} style={styles.input} required />
                            <input placeholder="Lien application (http://...)" value={newProject.link} onChange={e => setNewProject({...newProject, link: e.target.value})} style={styles.input} />
                            <input placeholder="URL image (optionnel)" value={newProject.image} onChange={e => setNewProject({...newProject, image: e.target.value})} style={styles.input} />
                            {newProject.image && <img src={newProject.image} alt="Aperçu" style={styles.imgPreview} onError={e => e.target.style.display = "none"} onLoad={e => e.target.style.display = "block"} />}
                            <div style={styles.checkRow}>
                                <input type="checkbox" id="isActive" checked={newProject.isActive} onChange={e => setNewProject({...newProject, isActive: e.target.checked})} />
                                <label htmlFor="isActive" style={styles.checkLabel}>Projet actif</label>
                            </div>
                            <button type="submit" style={styles.btn}>Ajouter le projet</button>
                        </form>
                    </div>

                    {editProject && (
                        <div style={styles.section}>
                            <h2 style={styles.sectionTitle}>Modifier le projet</h2>
                            <form onSubmit={updateProject} style={styles.form}>
                                <div style={styles.formGrid}>
                                    <input placeholder="Nom" value={editProject.name} onChange={e => setEditProject({...editProject, name: e.target.value})} style={styles.input} required />
                                    <input placeholder="Categorie" value={editProject.category || ""} onChange={e => setEditProject({...editProject, category: e.target.value})} style={styles.input} />
                                </div>
                                <input placeholder="Description" value={editProject.description} onChange={e => setEditProject({...editProject, description: e.target.value})} style={styles.input} />
                                <input placeholder="Lien" value={editProject.link || ""} onChange={e => setEditProject({...editProject, link: e.target.value})} style={styles.input} />
                                <input placeholder="URL image (optionnel)" value={editProject.image || ""} onChange={e => setEditProject({...editProject, image: e.target.value})} style={styles.input} />
                                {editProject.image && <img src={editProject.image} alt="Aperçu" style={styles.imgPreview} onError={e => e.target.style.display = "none"} onLoad={e => e.target.style.display = "block"} />}
                                <div style={styles.checkRow}>
                                    <input type="checkbox" id="editIsActive" checked={editProject.isActive} onChange={e => setEditProject({...editProject, isActive: e.target.checked})} />
                                    <label htmlFor="editIsActive" style={styles.checkLabel}>Projet actif</label>
                                </div>
                                <div style={styles.formBtns}>
                                    <button type="submit" style={styles.btn}>Sauvegarder</button>
                                    <button type="button" onClick={() => setEditProject(null)} style={styles.cancelBtn}>Annuler</button>
                                </div>
                            </form>
                        </div>
                    )}

                    <div style={styles.section}>
                        <h2 style={styles.sectionTitle}>Projets ({projects.length})</h2>
                        <div style={styles.grid}>
                            {projects.map(p => (
                                <div key={p.id} style={{...styles.projectCard, opacity: p.isActive ? 1 : 0.7}}>
                                    <div style={styles.projectCardTop}>
                                        <div style={styles.projectCat}>{p.category || "Sans categorie"}</div>
                                        <button
                                            onClick={() => toggleActive(p)}
                                            style={{...styles.toggleBtn, background: p.isActive ? "#e8f5e9" : "#ffebee", color: p.isActive ? "#2e7d32" : "#c62828"}}>
                                            {p.isActive ? "Actif" : "Inactif"}
                                        </button>
                                    </div>
                                    {p.image && <img src={p.image} alt="" style={styles.eventThumb} />}
                                    <div style={styles.cardName}>{p.name}</div>
                                    <div style={styles.cardDesc}>{p.description}</div>
                                    {p.createdAt && <div style={styles.cardDate}>{formatDate(p.createdAt)}</div>}
                                    <div style={styles.cardBtns}>
                                        <button onClick={() => setEditProject(p)} style={styles.editBtn}>Modifier</button>
                                        <button onClick={() => confirmAndDelete("project", p.id, p.name)} style={styles.deleteBtn}>Supprimer</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === "blog" && (
                <div>
                    <div style={styles.section}>
                        <h2 style={styles.sectionTitle}>Publier un article</h2>
                        <form onSubmit={addPost} style={styles.form}>
                            <input placeholder="Titre de article" value={newPost.title} onChange={e => setNewPost({...newPost, title: e.target.value})} style={styles.input} required />
                            <textarea placeholder="Contenu de article..." value={newPost.content} onChange={e => setNewPost({...newPost, content: e.target.value})} style={styles.textarea} required />
                            <input placeholder="URL image (optionnel)" value={newPost.image} onChange={e => setNewPost({...newPost, image: e.target.value})} style={styles.input} />
                            {newPost.image && <img src={newPost.image} alt="Aperçu" style={styles.imgPreview} onError={e => e.target.style.display = "none"} onLoad={e => e.target.style.display = "block"} />}
                            <button type="submit" style={styles.btn}>Publier</button>
                        </form>
                    </div>

                    {editPost && (
                        <div style={styles.section}>
                            <h2 style={styles.sectionTitle}>Modifier article</h2>
                            <form onSubmit={updatePost} style={styles.form}>
                                <input placeholder="Titre" value={editPost.title} onChange={e => setEditPost({...editPost, title: e.target.value})} style={styles.input} required />
                                <textarea placeholder="Contenu" value={editPost.content} onChange={e => setEditPost({...editPost, content: e.target.value})} style={styles.textarea} required />
                                <input placeholder="URL image (optionnel)" value={editPost.image || ""} onChange={e => setEditPost({...editPost, image: e.target.value})} style={styles.input} />
                                {editPost.image && <img src={editPost.image} alt="Aperçu" style={styles.imgPreview} onError={e => e.target.style.display = "none"} onLoad={e => e.target.style.display = "block"} />}
                                <div style={styles.formBtns}>
                                    <button type="submit" style={styles.btn}>Sauvegarder</button>
                                    <button type="button" onClick={() => setEditPost(null)} style={styles.cancelBtn}>Annuler</button>
                                </div>
                            </form>
                        </div>
                    )}

                    <div style={styles.section}>
                        <h2 style={styles.sectionTitle}>Articles ({posts.length})</h2>
                        {posts.map(p => (
                            <div key={p.id} style={styles.articleCard}>
                                <div style={styles.articleHeader}>
                                    <div style={{ display: "flex", gap: "14px" }}>
                                        {p.image && <img src={p.image} alt="" style={styles.eventThumb} />}
                                        <div>
                                            <div style={styles.articleTitle}>{p.title}</div>
                                            <div style={styles.articleDate}>{formatDate(p.createdAt)}</div>
                                        </div>
                                    </div>
                                    <div style={styles.cardBtns}>
                                        <button onClick={() => setEditPost(p)} style={styles.editBtn}>Modifier</button>
                                        <button onClick={() => confirmAndDelete("post", p.id, p.title)} style={styles.deleteBtn}>Supprimer</button>
                                    </div>
                                </div>
                                <div style={styles.articleContent}>{p.content.substring(0, 120)}{p.content.length > 120 ? "..." : ""}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === "messages" && (
                <div style={styles.section}>
                    <div style={styles.messagesHeader}>
                        <h2 style={styles.sectionTitle}>
                            Messages ({messages.length})
                            {unreadCount > 0 && <span style={styles.unreadBadge2}>{unreadCount} non lu(s)</span>}
                        </h2>
                        <div style={styles.msgFilterRow}>
                            {["tous","nonlus","lus"].map(f => (
                                <button key={f} onClick={() => setFilterMessages(f)}
                                    style={{...styles.filterBtn, ...(filterMessages === f ? styles.filterBtnActive : {})}}>
                                    {f === "tous" ? "Tous" : f === "nonlus" ? "Non lus" : "Lus"}
                                    {f === "nonlus" && unreadCount > 0 && <span style={styles.filterCount}>{unreadCount}</span>}
                                </button>
                            ))}
                        </div>
                    </div>
                    {filteredMessages.length === 0 ? (
                        <div style={styles.empty}>Aucun message dans cette categorie.</div>
                    ) : filteredMessages.map(m => (
                        <div key={m.id} style={{...styles.messageCard, borderLeft: m.read ? "3px solid #e0e0e0" : "3px solid #2D6A4F"}}>
                            <div style={styles.messageHeader}>
                                <div style={styles.messageLeft}>
                                    <div style={{...styles.avatar, background: m.read ? "#e0e0e0" : "#2D6A4F", color: m.read ? "#888" : "#fff"}}>
                                        {m.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div style={styles.messageName}>
                                            {m.name}
                                            {!m.read && <span style={styles.newBadge}>NOUVEAU</span>}
                                        </div>
                                        <div style={styles.messageEmail}>{m.email}</div>
                                    </div>
                                </div>
                                <div style={styles.messageDate}>{formatDate(m.createdAt)}</div>
                            </div>
                            <div style={styles.messageText}>{m.message}</div>
                            <div style={styles.msgBtns}>
                                {!m.read && <button onClick={() => markAsRead(m.id)} style={styles.readBtn}>Marquer lu</button>}
                                <button onClick={() => { setReplyMsg(m); setReplyText(""); markAsRead(m.id); }} style={styles.replyBtn}>Repondre</button>
                                <button onClick={() => confirmAndDelete("message", m.id, m.name)} style={styles.deleteBtn}>Supprimer</button>
                                <button onClick={() => { markAsRead(m.id); showSuccess("Message ignore."); }} style={styles.ignoreBtn}>Ignorer</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ── ONGLET ÉVÉNEMENTS ─────────────────────────────────────────── */}
            {activeTab === "evenements" && (
                <div>
                    <div style={styles.section}>
                        <h2 style={styles.sectionTitle}>Créer un événement</h2>
                        <form onSubmit={createEvent} style={styles.form}>
                            <div style={styles.formGrid}>
                                <input placeholder="Titre" value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} style={styles.input} required />
                                <input placeholder="Lieu" value={newEvent.location} onChange={e => setNewEvent({...newEvent, location: e.target.value})} style={styles.input} required />
                            </div>
                            <textarea placeholder="Description" value={newEvent.description} onChange={e => setNewEvent({...newEvent, description: e.target.value})} style={styles.textarea} required />
                            <div style={styles.formGrid}>
                                <div>
                                    <label style={styles.label}>Date et heure</label>
                                    <input type="datetime-local" value={newEvent.eventDate} onChange={e => setNewEvent({...newEvent, eventDate: e.target.value})} style={styles.input} required />
                                </div>
                                <div>
                                    <label style={styles.label}>Nombre de places max</label>
                                    <input type="number" min="1" placeholder="Ex : 20" value={newEvent.maxPlaces} onChange={e => setNewEvent({...newEvent, maxPlaces: e.target.value})} style={styles.input} required />
                                </div>
                            </div>
                            <input placeholder="URL image (optionnel)" value={newEvent.imageUrl} onChange={e => setNewEvent({...newEvent, imageUrl: e.target.value})} style={styles.input} />
                            {newEvent.imageUrl && <img src={newEvent.imageUrl} alt="Aperçu" style={styles.imgPreview} onError={e => e.target.style.display = "none"} onLoad={e => e.target.style.display = "block"} />}
                            <button type="submit" style={styles.btn}>Créer l'événement</button>
                        </form>
                    </div>

                    {editEvent && (
                        <div style={styles.section}>
                            <h2 style={styles.sectionTitle}>Modifier l'événement</h2>
                            <form onSubmit={updateEvent} style={styles.form}>
                                <div style={styles.formGrid}>
                                    <input value={editEvent.title} onChange={e => setEditEvent({...editEvent, title: e.target.value})} style={styles.input} required />
                                    <input value={editEvent.location} onChange={e => setEditEvent({...editEvent, location: e.target.value})} style={styles.input} required />
                                </div>
                                <textarea value={editEvent.description} onChange={e => setEditEvent({...editEvent, description: e.target.value})} style={styles.textarea} />
                                <div style={styles.formGrid}>
                                    <input type="datetime-local" value={editEvent.eventDate ? editEvent.eventDate.slice(0,16) : ""} onChange={e => setEditEvent({...editEvent, eventDate: e.target.value})} style={styles.input} />
                                    <input type="number" min="1" value={editEvent.maxPlaces} onChange={e => setEditEvent({...editEvent, maxPlaces: e.target.value})} style={styles.input} />
                                </div>
                                <input placeholder="URL image (optionnel)" value={editEvent.imageUrl || ""} onChange={e => setEditEvent({...editEvent, imageUrl: e.target.value})} style={styles.input} />
                                {editEvent.imageUrl && <img src={editEvent.imageUrl} alt="Aperçu" style={styles.imgPreview} onError={e => e.target.style.display = "none"} onLoad={e => e.target.style.display = "block"} />}
                                <div style={styles.formBtns}>
                                    <button type="submit" style={styles.btn}>Sauvegarder</button>
                                    <button type="button" onClick={() => setEditEvent(null)} style={styles.cancelBtn}>Annuler</button>
                                </div>
                            </form>
                        </div>
                    )}

                    <div style={styles.section}>
                        <h2 style={styles.sectionTitle}>Liste des événements ({filteredEvents.length}/{events.length})</h2>
                        <div style={styles.filterRow}>
                            <input placeholder="Rechercher par titre..." value={eventSearch}
                                onChange={e => { setEventSearch(e.target.value); setEventsPageNum(0); }}
                                style={styles.filterInput} />
                        </div>
                        {events.length === 0 ? <div style={styles.empty}>Aucun événement créé.</div>
                            : filteredEvents.length === 0 ? <div style={styles.empty}>Aucun événement ne correspond à cette recherche.</div>
                            : paginatedEvents.map(ev => {
                            const stStyle = { OPEN: {bg:"#e8f5e9",c:"#2e7d32"}, FULL: {bg:"#fff3e0",c:"#e65100"}, CANCELLED: {bg:"#ffebee",c:"#c62828"}, FINISHED: {bg:"#eeeeee",c:"#616161"} }[ev.status] || {};
                            return (
                                <div key={ev.id} style={styles.articleCard}>
                                    <div style={styles.articleHeader}>
                                        <div style={{ display: "flex", gap: "14px" }}>
                                            {ev.imageUrl ? (
                                                <img src={ev.imageUrl} alt="" style={styles.eventThumb} />
                                            ) : (
                                                <div style={{ ...styles.eventThumb, background: "linear-gradient(135deg, #4C9A5C, #2D6A4F)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>🌿</div>
                                            )}
                                            <div>
                                                <span style={{...styles.toggleBtn, background: stStyle.bg, color: stStyle.c, marginBottom:"6px", display:"inline-block"}}>{ev.status}</span>
                                                <div style={styles.articleTitle}>{ev.title}</div>
                                                <div style={styles.articleDate}>📅 {formatDate(ev.eventDate)} | 📍 {ev.location} | 👥 {ev.maxPlaces} places</div>
                                            </div>
                                        </div>
                                        <div style={{display:"flex",flexDirection:"column",gap:"6px",alignItems:"flex-end"}}>
                                            {/* Sélecteur de statut — l'admin peut forcer le changement */}
                                            <select value={ev.status} onChange={e => changeEventStatus(ev.id, e.target.value)} style={{...styles.input, padding:"5px 10px", fontSize:"12px", width:"140px"}}>
                                                <option value="OPEN">OPEN</option>
                                                <option value="FULL">FULL</option>
                                                <option value="CANCELLED">CANCELLED</option>
                                                <option value="FINISHED">FINISHED</option>
                                            </select>
                                            <div style={styles.cardBtns}>
                                                <button onClick={() => viewEventRegistrations(ev.id)} style={styles.replyBtn}>Inscrits</button>
                                                <button onClick={() => viewEventReviews(ev.id)} style={styles.replyBtn}>Avis</button>
                                                <button onClick={() => { setCurrentEventId(ev.id); setGroupEmailModal(true); }} style={styles.replyBtn}>📢 Email groupé</button>
                                                <button onClick={() => setEditEvent(ev)} style={styles.editBtn}>Modifier</button>
                                                <button onClick={() => confirmAndDelete("event", ev.id, ev.title)} style={styles.deleteBtn}>Supprimer</button>
                                            </div>
                                        </div>
                                    </div>
                                    {ev.description && <div style={styles.articleContent}>{ev.description.substring(0,100)}{ev.description.length>100?"...":""}</div>}
                                </div>
                            );
                        })}
                        {events.length > 0 && (
                            <div style={styles.pagination}>
                                <button onClick={() => setEventsPageNum(p => Math.max(0, p - 1))} disabled={eventsPageNum === 0} style={styles.pageBtn}>← Précédent</button>
                                <span style={styles.pageInfo}>Page {eventsPageNum + 1} / {eventsPageCount}</span>
                                <button onClick={() => setEventsPageNum(p => Math.min(eventsPageCount - 1, p + 1))} disabled={eventsPageNum >= eventsPageCount - 1} style={styles.pageBtn}>Suivant →</button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ── ONGLET BÉNÉVOLES ──────────────────────────────────────────── */}
            {activeTab === "benevoles" && (
                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>Bénévoles inscrits ({filteredVolunteers.length}/{volunteers.length})</h2>

                    {/* Filtres avancés : compétence, disponibilité, langue (section 3.6 de l'analyse) */}
                    <div style={styles.filterRow}>
                        <input placeholder="Filtrer par compétence..." value={volunteerFilter.skill}
                            onChange={e => updateVolunteerFilter("skill", e.target.value)}
                            style={styles.filterInput} />
                        <input placeholder="Filtrer par disponibilité..." value={volunteerFilter.availability}
                            onChange={e => updateVolunteerFilter("availability", e.target.value)}
                            style={styles.filterInput} />
                        <select value={volunteerFilter.language}
                            onChange={e => updateVolunteerFilter("language", e.target.value)}
                            style={styles.filterInput}>
                            <option value="">Toutes les langues</option>
                            <option value="fr">Français</option>
                            <option value="en">English</option>
                            <option value="nl">Nederlands</option>
                        </select>
                        {(volunteerFilter.skill || volunteerFilter.availability || volunteerFilter.language) && (
                            <button onClick={() => { setVolunteerFilter({ skill: "", availability: "", language: "" }); setVolunteersPageNum(0); }} style={styles.cancelBtn}>
                                Réinitialiser
                            </button>
                        )}
                    </div>

                    {filteredVolunteers.length === 0 ? <div style={styles.empty}>Aucun bénévole ne correspond aux filtres.</div> : paginatedVolunteers.map(v => {
                        const lvlColor = { BRONZE: "#cd7f32", ARGENT: "#9e9e9e", OR: "#D4A017" }[v.level] || "#ccc";
                        const isActive = v.isActive !== false; // null/undefined = actif par défaut
                        return (
                            <div key={v.id} style={{...styles.messageCard, opacity: isActive ? 1 : 0.6}}>
                                <div style={styles.messageHeader}>
                                    <div style={styles.messageLeft}>
                                        <div style={{...styles.avatar, background: "#2D6A4F", color:"#fff"}}>
                                            {v.firstName?.charAt(0)?.toUpperCase()}
                                        </div>
                                        <div>
                                            <div style={styles.messageName}>
                                                {v.firstName} {v.lastName}
                                                <span style={{background: lvlColor, color:"#fff", fontSize:"10px", padding:"2px 8px", borderRadius:"20px", fontWeight:"bold"}}>{v.level}</span>
                                                <span style={{background: isActive ? "#e8f5e9" : "#ffebee", color: isActive ? "#2e7d32" : "#c62828", fontSize:"10px", padding:"2px 8px", borderRadius:"20px", fontWeight:"bold"}}>
                                                    {isActive ? "Actif" : "Désactivé"}
                                                </span>
                                            </div>
                                            <div style={styles.messageEmail}>{v.email}</div>
                                            {v.phone && <div style={{fontSize:"12px",color:"#888"}}>{v.phone}</div>}
                                        </div>
                                    </div>
                                    <div style={{display:"flex", flexDirection:"column", alignItems:"flex-end", gap:"8px"}}>
                                        <div style={styles.messageDate}>Inscrit le {formatDate(v.createdAt)}</div>
                                        <button onClick={() => toggleVolunteerActive(v.id)} style={isActive ? styles.deleteBtn : styles.replyBtn}>
                                            {isActive ? "Désactiver" : "Réactiver"}
                                        </button>
                                    </div>
                                </div>
                                {v.skills && <div style={{...styles.messageText, marginBottom:"8px"}}><strong>Compétences :</strong> {v.skills}</div>}
                                {v.availability && <div style={{...styles.messageText}}><strong>Disponibilités :</strong> {v.availability}</div>}
                            </div>
                        );
                    })}
                    {filteredVolunteers.length > 0 && (
                        <div style={styles.pagination}>
                            <button onClick={() => setVolunteersPageNum(p => Math.max(0, p - 1))} disabled={volunteersPageNum === 0} style={styles.pageBtn}>← Précédent</button>
                            <span style={styles.pageInfo}>Page {volunteersPageNum + 1} / {volunteersPageCount}</span>
                            <button onClick={() => setVolunteersPageNum(p => Math.min(volunteersPageCount - 1, p + 1))} disabled={volunteersPageNum >= volunteersPageCount - 1} style={styles.pageBtn}>Suivant →</button>
                        </div>
                    )}
                </div>
            )}

            {/* ── MODALE INSCRIPTIONS D'UN ÉVÉNEMENT ───────────────────────── */}
            {eventRegistrationsModal && (
                <div style={styles.modal}>
                    <div style={{...styles.modalBox, width:"600px", maxHeight:"80vh", overflowY:"auto"}}>
                        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                            <h3 style={styles.modalTitle}>Inscriptions à l'événement</h3>
                            {eventRegistrations.length > 0 && (
                                <button onClick={exportRegistrationsPdf} style={styles.replyBtn}>📄 Exporter en PDF</button>
                            )}
                        </div>
                        {eventRegistrations.length === 0 ? (
                            <p style={styles.modalSub}>Aucune inscription pour cet événement.</p>
                        ) : [...eventRegistrations].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(r => {
                            const stStyle = { WAITING:{bg:"#fff3e0",c:"#e65100"}, CONFIRMED:{bg:"#e8f5e9",c:"#2e7d32"}, REFUSED:{bg:"#eeeeee",c:"#616161"} }[r.status] || {};
                            return (
                                <div key={r.id} style={{...styles.articleCard, display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                                    <div>
                                        <div style={{fontWeight:"600", fontSize:"14px"}}>{r.user?.firstName} {r.user?.lastName}</div>
                                        <div style={{fontSize:"12px", color:"#888"}}>{r.user?.email}</div>
                                        <span style={{...styles.toggleBtn, background:stStyle.bg, color:stStyle.c, fontSize:"11px", marginTop:"4px", display:"inline-block"}}>{r.status}</span>
                                    </div>
                                    {r.status === "WAITING" && (
                                        <div style={styles.cardBtns}>
                                            <button onClick={() => confirmReg(r.id)} style={styles.replyBtn}>Confirmer</button>
                                            <button onClick={() => rejectReg(r.id)} style={styles.deleteBtn}>Refuser</button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                        <div style={{textAlign:"center", marginTop:"20px"}}>
                            <button onClick={() => setEventRegistrationsModal(false)} style={styles.cancelBtn}>Fermer</button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── MODALE AVIS D'UN ÉVÉNEMENT (section 3.5) ──────────────────── */}
            {eventReviewsModal && (
                <div style={styles.modal}>
                    <div style={{...styles.modalBox, width:"550px", maxHeight:"80vh", overflowY:"auto"}}>
                        <h3 style={styles.modalTitle}>Avis des bénévoles</h3>
                        <p style={{textAlign:"center", fontSize:"15px", fontWeight:"700", color:"#2D6A4F", marginBottom:"16px"}}>
                            Note moyenne : {eventReviews?.average ? eventReviews.average.toFixed(1) : "—"} / 5
                            {eventReviews?.reviews?.length > 0 && ` (${eventReviews.reviews.length} avis)`}
                        </p>
                        {(!eventReviews?.reviews || eventReviews.reviews.length === 0) ? (
                            <p style={styles.modalSub}>Aucun avis pour cet événement.</p>
                        ) : eventReviews.reviews.map(rv => (
                            <div key={rv.id} style={styles.articleCard}>
                                <div style={{fontWeight:"600", fontSize:"14px"}}>{rv.user?.firstName} {rv.user?.lastName}</div>
                                <div style={{color:"#D4A017", fontSize:"16px"}}>{"★".repeat(rv.rating)}<span style={{color:"#ddd"}}>{"★".repeat(5 - rv.rating)}</span></div>
                                {rv.comment && <div style={{fontSize:"13px", color:"#555", marginTop:"4px"}}>{rv.comment}</div>}
                            </div>
                        ))}
                        <div style={{textAlign:"center", marginTop:"20px"}}>
                            <button onClick={() => setEventReviewsModal(false)} style={styles.cancelBtn}>Fermer</button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── MODALE EMAIL GROUPÉ (section 3.3) ─────────────────────────── */}
            {groupEmailModal && (
                <div style={styles.modal}>
                    <div style={{...styles.modalBox, width:"500px"}}>
                        <h3 style={styles.modalTitle}>Message groupé aux inscrits</h3>
                        <p style={styles.modalSub}>Cet email sera envoyé à tous les bénévoles encore inscrits (hors annulés).</p>
                        <textarea value={groupEmailText} onChange={e => setGroupEmailText(e.target.value)}
                            placeholder="Écris ton message ici..."
                            style={{...styles.input, width:"100%", height:"120px", resize:"none", marginTop:"12px"}} />
                        <div style={styles.modalBtns}>
                            <button onClick={sendGroupEmail} style={{...styles.modalDeleteBtn, background:"#2D6A4F"}}>Envoyer</button>
                            <button onClick={() => { setGroupEmailModal(false); setGroupEmailText(""); }} style={styles.cancelBtn}>Annuler</button>
                        </div>
                    </div>
                </div>
            )}

            {confirmDelete && (() => {
                // Avertissement supplémentaire si l'événement a des participations confirmées avec
                // attestation potentiellement déjà téléchargeable (RG-20) — la suppression les emporte aussi.
                const attestationsAtRisk = confirmDelete.type === "event"
                    ? allRegistrations.filter(r => r.event?.id === confirmDelete.id && r.status === "CONFIRMED").length
                    : 0;
                return (
                    <div style={styles.modal}>
                        <div style={styles.modalBox}>
                            <div style={styles.modalIcon}>!</div>
                            <h3 style={styles.modalTitle}>Confirmer la suppression</h3>
                            <p style={styles.modalSub}>Voulez-vous vraiment supprimer <strong>{confirmDelete.nom}</strong> ? Cette action est irreversible.</p>
                            {attestationsAtRisk > 0 && (
                                <p style={{ ...styles.modalSub, background: "#fff3e0", color: "#e65100", padding: "10px 14px", borderRadius: "8px", marginTop: "-8px" }}>
                                    ⚠️ {attestationsAtRisk} bénévole(s) confirmé(s) sur cet événement — supprimer l'événement supprime aussi leurs inscriptions et rend leur attestation indisponible.
                                </p>
                            )}
                            <div style={styles.modalBtns}>
                                <button onClick={executeDelete} style={styles.modalDeleteBtn}>Supprimer definitivement</button>
                                <button onClick={() => setConfirmDelete(null)} style={styles.cancelBtn}>Annuler</button>
                            </div>
                        </div>
                    </div>
                );
            })()}

            {replyMsg && (
                <div style={styles.modal}>
                    <div style={styles.modalBox}>
                        <div style={styles.modalHeader}>
                            <div style={{...styles.avatar, background: "#2D6A4F", color: "#fff", width: "48px", height: "48px", fontSize: "20px"}}>
                                {replyMsg.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h3 style={styles.modalTitle}>Repondre a {replyMsg.name}</h3>
                                <p style={styles.modalSub}>La reponse sera envoyee a : {replyMsg.email}</p>
                            </div>
                        </div>
                        <div style={styles.originalMsg}>
                            <div style={styles.originalLabel}>MESSAGE ORIGINAL</div>
                            <div style={styles.originalText}>{replyMsg.message}</div>
                        </div>
                        <form onSubmit={replyMessage}>
                            <textarea placeholder="Votre reponse..." value={replyText} onChange={e => setReplyText(e.target.value)} style={{...styles.textarea, width: "100%", marginBottom: "16px", height: "120px"}} required />
                            <div style={styles.formBtns}>
                                <button type="submit" style={styles.btn}>Envoyer la reponse</button>
                                <button type="button" onClick={() => setReplyMsg(null)} style={styles.cancelBtn}>Annuler</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showPasswordModal && (
                <div style={styles.modal}>
                    <div style={styles.modalBox}>
                        <h3 style={styles.modalTitle}>Changer le mot de passe</h3>
                        {passwordError && <div style={styles.errorMsg}>{passwordError}</div>}
                        <form onSubmit={changePassword} style={{display:"flex",flexDirection:"column",gap:"12px",marginTop:"16px"}}>
                            <div><label style={styles.label}>Ancien mot de passe</label><input type="password" value={passwordForm.oldPassword} onChange={e => setPasswordForm({...passwordForm, oldPassword: e.target.value})} style={styles.input} required /></div>
                            <div><label style={styles.label}>Nouveau mot de passe</label><input type="password" value={passwordForm.newPassword} onChange={e => setPasswordForm({...passwordForm, newPassword: e.target.value})} style={styles.input} required /></div>
                            <div><label style={styles.label}>Confirmer le nouveau mot de passe</label><input type="password" value={passwordForm.confirmPassword} onChange={e => setPasswordForm({...passwordForm, confirmPassword: e.target.value})} style={styles.input} required /></div>
                            <div style={styles.formBtns}>
                                <button type="submit" style={styles.btn}>Changer</button>
                                <button type="button" onClick={() => { setShowPasswordModal(false); setPasswordError(""); }} style={styles.cancelBtn}>Annuler</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            </div>
        </div>
    );
}

const styles = {
    /* ── Tableau de bord ── */
    headerRight: { display: "flex", alignItems: "center", gap: "10px" },
    datePill: { background: "#F8F4E3", color: "#767066", fontSize: "12px", padding: "8px 16px", borderRadius: "20px", fontWeight: "500" },
    iconBtn: { position: "relative", width: "38px", height: "38px", borderRadius: "50%", background: "#fff", border: "1px solid #e0e0e0", cursor: "pointer", fontSize: "15px", display: "flex", alignItems: "center", justifyContent: "center" },
    iconBtnCircle: { width: "38px", height: "38px", borderRadius: "50%", background: "#2D6A4F", color: "#fff", border: "none", cursor: "pointer", fontSize: "13px", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center" },
    bellDot: { position: "absolute", top: "6px", right: "8px", width: "7px", height: "7px", borderRadius: "50%", background: "#e65100" },
    statCardV2: { background: "#fff", border: "1px solid #e0e0e0", borderRadius: "12px", padding: "20px" },
    statIconBox: { display: "inline-flex", alignItems: "center", justifyContent: "center", width: "38px", height: "38px", borderRadius: "10px", fontSize: "16px", marginBottom: "14px" },
    statLblV2: { fontSize: "10px", fontWeight: "700", color: "#999", letterSpacing: "0.5px", marginBottom: "6px" },
    statNumV2: { fontSize: "28px", fontWeight: "800", color: "#1B1B1B", lineHeight: 1, fontVariantNumeric: "tabular-nums" },
    statTrend: { fontSize: "11px", color: "#2e7d32", fontWeight: "600", marginTop: "6px" },
    quickActionsGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "14px" },
    dashGrid: { display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20px", marginBottom: "24px" },
    dashMain: { minWidth: 0 },
    dashSide: { display: "flex", flexDirection: "column", gap: "20px" },
    dashCard: { background: "#fff", border: "1px solid #e0e0e0", borderRadius: "12px", padding: "22px", marginBottom: "20px" },
    inscriptionsBanner: { display: "flex", alignItems: "center", gap: "16px", background: "linear-gradient(135deg, #2D6A4F, #173C29)", borderRadius: "12px", padding: "22px 26px", marginBottom: "20px" },
    inscriptionsBannerIcon: { width: "46px", height: "46px", borderRadius: "12px", background: "rgba(255,255,255,0.15)", color: "#fff", fontSize: "22px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
    inscriptionsBannerTitle: { color: "#fff", fontSize: "17px", fontWeight: "700" },
    inscriptionsBannerSub: { color: "#c3d7c8", fontSize: "12px", marginTop: "3px" },
    dashCardHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" },
    dashLink: { background: "none", border: "none", color: "#2D6A4F", fontSize: "12px", fontWeight: "600", cursor: "pointer" },
    dashTable: { width: "100%", borderCollapse: "collapse", marginTop: "14px" },
    dashTh: { textAlign: "left", fontSize: "10px", color: "#999", fontWeight: "700", letterSpacing: "0.5px", padding: "0 10px 10px" },
    dashTr: { borderTop: "1px solid #f2f2f2" },
    dashTd: { padding: "12px 10px", fontSize: "12px", color: "#333" },
    weekItem: { display: "flex", gap: "12px", alignItems: "flex-start", padding: "10px 0", borderTop: "1px solid #f2f2f2" },
    weekDate: { background: "#e8f5e9", borderRadius: "8px", padding: "6px 10px", textAlign: "center", minWidth: "44px", flexShrink: 0 },
    weekDay: { fontSize: "15px", fontWeight: "800", color: "#2D6A4F", lineHeight: 1 },
    weekMonth: { fontSize: "9px", fontWeight: "700", color: "#2D6A4F" },
    quickActions: { display: "flex", flexDirection: "column", gap: "8px", marginTop: "14px" },
    quickActionBtn: { background: "#2D6A4F", color: "#fff", border: "none", borderRadius: "8px", padding: "11px", fontSize: "13px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" },
    quickActionBtnOutline: { background: "#fff", color: "#333", border: "1px solid #e0e0e0", borderRadius: "8px", padding: "11px", fontSize: "13px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" },
    shell: { display: "flex", minHeight: "100vh", background: "#F8F4E3" },
    sidebar: { width: "240px", flexShrink: 0, background: "#173C29", display: "flex", flexDirection: "column", padding: "24px 16px", position: "sticky", top: 0, height: "100vh" },
    sidebarBrand: { display: "flex", alignItems: "center", gap: "10px", padding: "0 8px", marginBottom: "28px" },
    sidebarLogo: { width: "34px", height: "34px", borderRadius: "8px", background: "#2D6A4F", color: "#fff", fontWeight: "800", fontSize: "12px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
    sidebarBrandName: { color: "#fff", fontSize: "14px", fontWeight: "700" },
    sidebarBrandSub: { color: "#8fae97", fontSize: "9px", letterSpacing: "0.5px" },
    sidebarSectionLabel: { color: "#6f9179", fontSize: "10px", fontWeight: "700", letterSpacing: "1px", padding: "0 12px", marginBottom: "8px" },
    sidebarItem: { display: "flex", alignItems: "center", gap: "10px", width: "100%", background: "none", border: "none", color: "#c3d7c8", padding: "10px 12px", borderRadius: "8px", fontSize: "13px", cursor: "pointer", marginBottom: "2px", textAlign: "left" },
    sidebarItemActive: { background: "rgba(255,255,255,0.1)", color: "#fff", fontWeight: "600" },
    sidebarItemIcon: { fontSize: "15px", width: "18px", textAlign: "center" },
    sidebarBadge: { background: "#e65100", color: "#fff", fontSize: "10px", fontWeight: "700", padding: "1px 7px", borderRadius: "20px" },
    sidebarFooter: { marginTop: "auto", display: "flex", alignItems: "center", gap: "10px", padding: "12px 8px", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "16px" },
    sidebarAvatar: { width: "32px", height: "32px", borderRadius: "50%", background: "#2D6A4F", color: "#fff", fontWeight: "700", fontSize: "13px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
    sidebarFooterName: { color: "#fff", fontSize: "12px", fontWeight: "600", marginBottom: "2px" },
    sidebarLogout: { background: "none", border: "none", color: "#e8a5a5", fontSize: "11px", cursor: "pointer", padding: 0 },
    main: { flex: 1, padding: "28px 32px", minWidth: 0 },
    successBanner: { position: "fixed", top: "20px", right: "24px", background: "#2e7d32", color: "#fff", padding: "12px 24px", borderRadius: "8px", fontSize: "14px", fontWeight: "600", zIndex: 999, boxShadow: "0 4px 16px rgba(0,0,0,0.15)" },
    header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" },
    title: { fontSize: "26px", fontWeight: "bold", color: "#1B1B1B", marginBottom: "4px" },
    subtitle: { fontSize: "13px", color: "#888" },
    headerBtns: { display: "flex", gap: "12px", alignItems: "center" },
    pwdBtn: { background: "#f5f5f5", color: "#555", border: "1px solid #ddd", padding: "8px 16px", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: "600" },
    logoutBtn: { background: "#f44336", color: "#fff", border: "none", padding: "8px 20px", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: "600" },
    statsRow: { display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: "16px", marginBottom: "24px" },
    statCard: { background: "#fff", border: "1px solid #e0e0e0", borderRadius: "10px", padding: "20px", textAlign: "center" },
    statNum: { fontSize: "32px", fontWeight: "bold", color: "#1B1B1B", lineHeight: 1 },
    statLbl: { fontSize: "12px", color: "#888", marginTop: "6px" },
    statSub: { fontSize: "11px", color: "#aaa", marginTop: "4px" },
    chartsRow: { display: "grid", gridTemplateColumns: "2fr 1fr", gap: "16px", marginBottom: "24px" },
    chartCard: { background: "#fff", border: "1px solid #e0e0e0", borderRadius: "10px", padding: "20px" },
    chartTitle: { fontSize: "14px", fontWeight: "600", color: "#1B1B1B", marginBottom: "16px" },
    filterRow: { display: "flex", gap: "10px", marginBottom: "18px", flexWrap: "wrap" },
    filterInput: { padding: "9px 14px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "13px", outline: "none", minWidth: "180px" },
    pagination: { display: "flex", alignItems: "center", justifyContent: "center", gap: "16px", marginTop: "20px" },
    pageBtn: { padding: "8px 16px", border: "1px solid #ddd", borderRadius: "8px", background: "#fff", color: "#333", fontSize: "13px", fontWeight: "600", cursor: "pointer" },
    pageInfo: { fontSize: "13px", color: "#888", fontWeight: "500" },
    tabs: { display: "flex", gap: "4px", marginBottom: "20px", background: "#fff", border: "1px solid #e0e0e0", borderRadius: "10px", padding: "4px" },
    tab: { flex: 1, padding: "10px 16px", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "14px", fontWeight: "500", color: "#888", background: "transparent", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" },
    tabActive: { background: "#2D6A4F", color: "#fff", fontWeight: "700" },
    tabBadge: { background: "#f44336", color: "#fff", fontSize: "11px", padding: "1px 7px", borderRadius: "20px", fontWeight: "bold" },
    section: { background: "#fff", border: "1px solid #e0e0e0", borderRadius: "12px", padding: "24px", marginBottom: "20px" },
    sectionTitle: { fontSize: "17px", fontWeight: "bold", color: "#1B1B1B", marginBottom: "18px", paddingBottom: "12px", borderBottom: "2px solid #e8f5e9", display: "flex", alignItems: "center", gap: "10px" },
    messagesHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px", paddingBottom: "12px", borderBottom: "2px solid #e8f5e9" },
    msgFilterRow: { display: "flex", gap: "6px" },
    filterBtn: { background: "#f5f5f5", color: "#888", border: "1px solid #e0e0e0", padding: "6px 14px", borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontWeight: "600", display: "flex", alignItems: "center", gap: "6px" },
    filterBtnActive: { background: "#2D6A4F", color: "#fff", border: "1px solid #2D6A4F" },
    filterCount: { background: "#fff", color: "#2D6A4F", fontSize: "10px", padding: "1px 6px", borderRadius: "20px", fontWeight: "bold" },
    unreadBadge2: { background: "#2D6A4F", color: "#fff", fontSize: "12px", padding: "3px 12px", borderRadius: "20px", fontWeight: "bold" },
    form: { display: "flex", flexDirection: "column", gap: "12px", maxWidth: "600px" },
    formGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" },
    checkRow: { display: "flex", alignItems: "center", gap: "8px" },
    checkLabel: { fontSize: "14px", color: "#555", fontWeight: "500", cursor: "pointer" },
    input: { padding: "10px 14px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "14px", fontFamily: "Arial", outline: "none" },
    imgPreview: { width: "160px", height: "100px", objectFit: "cover", borderRadius: "8px", border: "1px solid #e0e0e0", marginTop: "-6px" },
    eventThumb: { width: "64px", height: "64px", objectFit: "cover", borderRadius: "8px", flexShrink: 0, color: "#fff" },
    textarea: { padding: "10px 14px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "14px", height: "100px", resize: "none", fontFamily: "Arial", outline: "none" },
    label: { fontSize: "13px", color: "#555", fontWeight: "500", marginBottom: "6px", display: "block" },
    btn: { background: "#2D6A4F", color: "#fff", fontSize: "13px", padding: "10px 24px", borderRadius: "8px", border: "none", cursor: "pointer", width: "fit-content", fontWeight: "600" },
    cancelBtn: { background: "#f5f5f5", color: "#555", fontSize: "13px", padding: "10px 24px", borderRadius: "8px", border: "1px solid #ddd", cursor: "pointer", width: "fit-content" },
    formBtns: { display: "flex", gap: "12px" },
    grid: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "14px" },
    projectCard: { background: "#F8F4E3", border: "1px solid #e8e8e8", borderRadius: "10px", padding: "16px", transition: "opacity 0.2s" },
    projectCardTop: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" },
    projectCat: { display: "inline-block", background: "#e8f5e9", color: "#2e7d32", fontSize: "10px", fontWeight: "600", padding: "3px 10px", borderRadius: "20px", textTransform: "uppercase" },
    toggleBtn: { border: "none", padding: "3px 10px", borderRadius: "20px", cursor: "pointer", fontSize: "11px", fontWeight: "700" },
    cardName: { fontSize: "13px", fontWeight: "bold", color: "#222", marginBottom: "6px" },
    cardDesc: { fontSize: "12px", color: "#888", marginBottom: "8px", lineHeight: 1.5 },
    cardDate: { fontSize: "10px", color: "#bbb", marginBottom: "10px" },
    cardBtns: { display: "flex", gap: "8px" },
    editBtn: { background: "#e3f2fd", color: "#1565c0", border: "none", padding: "5px 14px", borderRadius: "6px", cursor: "pointer", fontSize: "11px", fontWeight: "600" },
    deleteBtn: { background: "#ffebee", color: "#c62828", border: "none", padding: "5px 14px", borderRadius: "6px", cursor: "pointer", fontSize: "11px", fontWeight: "600" },
    articleCard: { background: "#F8F4E3", border: "1px solid #e8e8e8", borderRadius: "10px", padding: "16px", marginBottom: "12px" },
    articleHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" },
    articleTitle: { fontSize: "14px", fontWeight: "bold", color: "#222", marginBottom: "4px" },
    articleDate: { fontSize: "11px", color: "#bbb" },
    articleContent: { fontSize: "13px", color: "#666", lineHeight: 1.6 },
    messageCard: { background: "#fff", border: "1px solid #e8e8e8", borderRadius: "12px", padding: "20px", marginBottom: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" },
    messageHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" },
    messageLeft: { display: "flex", gap: "12px", alignItems: "flex-start" },
    avatar: { width: "42px", height: "42px", borderRadius: "50%", fontWeight: "bold", fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
    messageName: { fontSize: "14px", fontWeight: "600", color: "#1B1B1B", marginBottom: "2px", display: "flex", alignItems: "center", gap: "8px" },
    newBadge: { background: "#2D6A4F", color: "#fff", fontSize: "10px", padding: "2px 8px", borderRadius: "20px", fontWeight: "bold" },
    messageEmail: { fontSize: "12px", color: "#2D6A4F" },
    messageDate: { fontSize: "11px", color: "#bbb", whiteSpace: "nowrap" },
    messageText: { fontSize: "14px", color: "#555", lineHeight: "1.7", padding: "12px 16px", background: "#F8F4E3", borderRadius: "8px", marginBottom: "14px" },
    msgBtns: { display: "flex", gap: "8px", flexWrap: "wrap" },
    replyBtn: { background: "#e8f5e9", color: "#2e7d32", border: "none", padding: "5px 14px", borderRadius: "6px", cursor: "pointer", fontSize: "11px", fontWeight: "600" },
    readBtn: { background: "#f3e5f5", color: "#7b1fa2", border: "none", padding: "5px 14px", borderRadius: "6px", cursor: "pointer", fontSize: "11px", fontWeight: "600" },
    ignoreBtn: { background: "#f5f5f5", color: "#888", border: "none", padding: "5px 14px", borderRadius: "6px", cursor: "pointer", fontSize: "11px" },
    empty: { textAlign: "center", color: "#bbb", fontSize: "14px", padding: "32px" },
    modal: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 },
    modalBox: { background: "#fff", borderRadius: "14px", padding: "32px", width: "520px", maxWidth: "90vw" },
    modalIcon: { width: "48px", height: "48px", borderRadius: "50%", background: "#ffebee", color: "#c62828", fontSize: "24px", fontWeight: "bold", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" },
    modalHeader: { display: "flex", gap: "14px", alignItems: "center", marginBottom: "18px" },
    modalTitle: { fontSize: "18px", fontWeight: "bold", color: "#1B1B1B", marginBottom: "8px", textAlign: "center" },
    modalSub: { fontSize: "13px", color: "#888", marginBottom: "20px", textAlign: "center" },
    modalBtns: { display: "flex", gap: "12px", justifyContent: "center" },
    modalDeleteBtn: { background: "#f44336", color: "#fff", border: "none", padding: "10px 24px", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: "600" },
    originalMsg: { background: "#F8F4E3", border: "1px solid #e0e0e0", borderRadius: "8px", padding: "14px", marginBottom: "18px" },
    originalLabel: { fontSize: "10px", color: "#aaa", marginBottom: "6px", letterSpacing: "1px" },
    originalText: { fontSize: "13px", color: "#555", lineHeight: 1.6 },
    errorMsg: { background: "#ffebee", color: "#c62828", padding: "10px 14px", borderRadius: "8px", fontSize: "13px", marginBottom: "8px" }
};

export default Admin;
