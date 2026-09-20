const API = "http://localhost:8080/api";

// Retourne le token bénévole stocké dans le navigateur
const getToken = () => localStorage.getItem("volunteerToken");

// En-tête avec le token JWT pour les requêtes protégées
const authHeaders = () => ({
    "Content-Type": "application/json",
    "Authorization": `Bearer ${getToken()}`
});

// fetch() ne rejette JAMAIS sur un statut HTTP d'erreur (400, 403...), seulement sur une panne réseau —
// donc un refus métier (ex: RG-09 "déjà inscrit") arrivait jusqu'ici comme un objet "réponse" normal,
// et le code appelant le traitait par erreur comme un succès. Ce helper force le rejet dans ce cas,
// avec le message renvoyé par le backend, pour que les blocs catch() des pages fonctionnent vraiment.
const parseOrThrow = async (res) => {
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Une erreur est survenue.");
    return data;
};

// ── Authentification ─────────────────────────────────────────────────────────
export const volunteerRegister = (data) =>
    fetch(`${API}/volunteers/register`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }).then(r => r.json());

export const volunteerLogin = (email, password) =>
    fetch(`${API}/volunteers/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) }).then(r => r.json());

export const forgotPassword = (email) =>
    fetch(`${API}/volunteers/forgot-password`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) }).then(r => r.json());

export const resetPassword = (token, newPassword) =>
    fetch(`${API}/volunteers/reset-password`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token, newPassword }) }).then(r => r.json());

export const getMe = () =>
    fetch(`${API}/volunteers/me`, { headers: authHeaders() }).then(parseOrThrow);

export const updateMe = (data) =>
    fetch(`${API}/volunteers/me`, { method: "PUT", headers: authHeaders(), body: JSON.stringify(data) }).then(parseOrThrow);

// ── Événements ───────────────────────────────────────────────────────────────
export const getEvents = () =>
    fetch(`${API}/events`).then(r => r.json());

// Nombre total de bénévoles — utilisé pour les statistiques de la page d'accueil
export const getVolunteerCount = () =>
    fetch(`${API}/volunteers/count`).then(r => r.json());

export const getEventById = (id) =>
    fetch(`${API}/events/${id}`).then(r => r.json());

// ── Inscriptions ─────────────────────────────────────────────────────────────
export const registerToEvent = (eventId) =>
    fetch(`${API}/registrations`, { method: "POST", headers: authHeaders(), body: JSON.stringify({ eventId }) }).then(parseOrThrow);

export const getMyRegistrations = () =>
    fetch(`${API}/registrations/my`, { headers: authHeaders() }).then(r => r.json());

export const cancelRegistration = (id) =>
    fetch(`${API}/registrations/${id}`, { method: "DELETE", headers: authHeaders() }).then(parseOrThrow);

// ── Avis ─────────────────────────────────────────────────────────────────────
export const addReview = (eventId, rating, comment) =>
    fetch(`${API}/reviews`, { method: "POST", headers: authHeaders(), body: JSON.stringify({ eventId, rating, comment }) }).then(parseOrThrow);

export const getMyReviews = () =>
    fetch(`${API}/reviews/my`, { headers: authHeaders() }).then(r => r.json());

export const getEventReviews = (eventId) =>
    fetch(`${API}/reviews/event/${eventId}`).then(r => r.json());

// ── Documents PDF ────────────────────────────────────────────────────────────
// Télécharge l'attestation de participation (RG-21) et déclenche le téléchargement dans le navigateur
export const downloadAttestation = async (eventId, eventTitle) => {
    const res = await fetch(`${API}/volunteers/me/attestation/${eventId}`, { headers: authHeaders() });
    if (!res.ok) throw new Error("Impossible de générer l'attestation.");
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `attestation-${eventTitle}.pdf`;
    a.click();
    window.URL.revokeObjectURL(url);
};

// Télécharge l'export PDF complet de l'historique de participation (RG-21)
export const exportParticipationHistory = async () => {
    const res = await fetch(`${API}/volunteers/me/participation-history`, { headers: authHeaders() });
    if (!res.ok) throw new Error("Impossible de générer l'historique.");
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "historique-participation.pdf";
    a.click();
    window.URL.revokeObjectURL(url);
};
