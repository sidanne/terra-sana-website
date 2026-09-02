import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { volunteerRegister } from "../services/volunteerApi";

const GREEN = "#2D6A4F";

function VolunteerRegister() {
    const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "", phone: "", birthDate: "", gender: "", city: "", postalCode: "", skills: "", availability: "", preferredLanguage: "fr" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const data = await volunteerRegister(form);
            if (!data.token) {
                setError(data.message || "Une erreur est survenue lors de l'inscription.");
                setLoading(false);
                return;
            }
            localStorage.setItem("volunteerToken", data.token);
            navigate("/volunteer/dashboard");
        } catch {
            setError("Impossible de contacter le serveur.");
        }
        setLoading(false);
    };

    return (
        <div className="split-panel" style={s.page}>
            <div className="split-panel-image" style={s.imagePanel}>
                <span style={s.leafIcon}>🌿</span>
                <div style={s.imageOverlay}>
                    <div style={s.quoteMark}>"</div>
                    <p style={s.quote}>Chaque geste compte. Rejoignez une communauté qui agit concrètement.</p>
                    <div style={s.quoteAuthor}>— L'équipe Terra Sana</div>
                </div>
            </div>

            <div className="split-panel-form" style={s.formPanel}>
            <div style={s.card}>
                <div style={s.logo}>
                    <div style={{ ...s.logoIcon, background: GREEN }}>TS</div>
                    <span style={s.logoText}>Terra<span style={{ color: GREEN }}>Sana</span></span>
                </div>
                <h1 style={s.title}>Créer un compte bénévole</h1>
                <p style={s.sub}>Rejoignez la communauté Terra Sana</p>

                {error && <div style={s.error}>{error}</div>}

                <form onSubmit={handleSubmit} style={s.form}>
                    <div className="grid-responsive" style={s.grid2}>
                        <div style={s.row}>
                            <label style={s.label}>Prénom</label>
                            <input value={form.firstName} onChange={set("firstName")} name="given-name" autoComplete="given-name" style={s.input} placeholder="Prénom" required />
                        </div>
                        <div style={s.row}>
                            <label style={s.label}>Nom</label>
                            <input value={form.lastName} onChange={set("lastName")} name="family-name" autoComplete="family-name" style={s.input} placeholder="Nom" required />
                        </div>
                    </div>
                    <div style={s.row}>
                        <label style={s.label}>Email</label>
                        <input type="email" name="email" autoComplete="email" value={form.email} onChange={set("email")} style={s.input} placeholder="votre@email.com" required />
                    </div>
                    <div style={s.row}>
                        <label style={s.label}>Mot de passe (min. 8 caractères)</label>
                        <input type="password" name="new-password" autoComplete="new-password" value={form.password} onChange={set("password")} style={s.input} placeholder="Choisissez un mot de passe" required minLength={8} />
                    </div>
                    <div style={s.row}>
                        <label style={s.label}>Téléphone</label>
                        <input value={form.phone} onChange={set("phone")} style={s.input} placeholder="+32 xxx xx xx xx" />
                    </div>
                    <div className="grid-responsive" style={s.grid2}>
                        <div style={s.row}>
                            <label style={s.label}>Date de naissance</label>
                            <input type="date" value={form.birthDate} onChange={set("birthDate")} style={s.input} />
                        </div>
                        <div style={s.row}>
                            <label style={s.label}>Genre</label>
                            <select value={form.gender} onChange={set("gender")} style={s.input}>
                                <option value="">— Sélectionner —</option>
                                <option value="M">Homme</option>
                                <option value="F">Femme</option>
                                <option value="X">Autre / Non précisé</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid-responsive" style={s.grid2}>
                        <div style={s.row}>
                            <label style={s.label}>Ville</label>
                            <input value={form.city} onChange={set("city")} style={s.input} placeholder="Bruxelles" />
                        </div>
                        <div style={s.row}>
                            <label style={s.label}>Code postal</label>
                            <input value={form.postalCode} onChange={set("postalCode")} style={s.input} placeholder="1000" />
                        </div>
                    </div>
                    <div style={s.row}>
                        <label style={s.label}>Compétences</label>
                        <input value={form.skills} onChange={set("skills")} style={s.input} placeholder="Ex : cuisine, communication, logistique..." />
                    </div>
                    <div style={s.row}>
                        <label style={s.label}>Disponibilités</label>
                        <input value={form.availability} onChange={set("availability")} style={s.input} placeholder="Ex : week-ends, mercredis après-midi..." />
                    </div>
                    <div style={s.row}>
                        <label style={s.label}>Langue préférée</label>
                        <select value={form.preferredLanguage} onChange={set("preferredLanguage")} style={s.input}>
                            <option value="fr">Français</option>
                            <option value="en">English</option>
                            <option value="nl">Nederlands</option>
                        </select>
                    </div>
                    <button type="submit" style={{ ...s.btn, background: GREEN }} disabled={loading}>
                        {loading ? "Création du compte..." : "Créer mon compte"}
                    </button>
                </form>

                <p style={s.link}>
                    Déjà un compte ?{" "}
                    <Link to="/volunteer/login" style={{ color: GREEN, fontWeight: "600" }}>Se connecter</Link>
                </p>
            </div>
            </div>
        </div>
    );
}

const s = {
    page: { minHeight: "100vh", display: "flex", background: "#F8F4E3" },
    imagePanel: {
        flex: "1 1 40%",
        position: "sticky",
        top: 0,
        alignSelf: "flex-start",
        height: "100vh",
        background: "linear-gradient(160deg, #173C29, #2D6A4F)",
        display: "flex",
        alignItems: "flex-end",
        padding: "48px"
    },
    leafIcon: { position: "absolute", top: "42%", left: "50%", transform: "translate(-50%, -50%)", fontSize: "160px", opacity: 0.12, pointerEvents: "none" },
    imageOverlay: { maxWidth: "360px", position: "relative" },
    quoteMark: { fontSize: "48px", color: "#D4A017", fontFamily: "Georgia, serif", lineHeight: "0.5", marginBottom: "12px" },
    quote: { color: "#fff", fontSize: "19px", fontWeight: "600", lineHeight: "1.5", marginBottom: "14px", textShadow: "0 2px 8px rgba(0,0,0,0.3)" },
    quoteAuthor: { color: "#74C69D", fontSize: "13px", fontWeight: "600" },
    formPanel: { flex: "1 1 60%", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 16px" },
    card: { background: "#fff", border: "1px solid #e0e0e0", borderRadius: "12px", padding: "40px", width: "480px", maxWidth: "100%", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" },
    logo: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" },
    logoIcon: { color: "#fff", fontWeight: "bold", fontSize: "14px", width: "38px", height: "38px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" },
    logoText: { fontSize: "18px", fontWeight: "bold", color: "#1B1B1B" },
    title: { fontSize: "22px", fontWeight: "bold", color: "#1B1B1B", marginBottom: "6px" },
    sub: { fontSize: "13px", color: "#888", marginBottom: "24px" },
    error: { background: "#ffebee", color: "#c62828", padding: "12px 16px", borderRadius: "8px", marginBottom: "20px", fontSize: "13px" },
    form: { display: "flex", flexDirection: "column", gap: "14px" },
    grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" },
    row: { display: "flex", flexDirection: "column", gap: "6px" },
    label: { fontSize: "13px", color: "#555", fontWeight: "500" },
    input: { padding: "10px 14px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "14px", outline: "none" },
    btn: { color: "#fff", fontSize: "14px", padding: "12px 28px", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: "600", marginTop: "4px" },
    link: { textAlign: "center", marginTop: "20px", fontSize: "13px", color: "#888" }
};

export default VolunteerRegister;
