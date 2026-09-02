import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { volunteerLogin } from "../services/volunteerApi";

const GREEN = "#2D6A4F";
const GOLD = "#D4A017";

function VolunteerLogin() {
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const data = await volunteerLogin(form.email, form.password);
            if (!data.token) {
                setError(data.message || "Email ou mot de passe incorrect.");
                setLoading(false);
                return;
            }
            // Stocker le token JWT du bénévole séparément du token admin
            localStorage.setItem("volunteerToken", data.token);
            navigate("/volunteer/dashboard");
        } catch {
            setError("Impossible de contacter le serveur. Vérifiez que le backend est lancé.");
        }
        setLoading(false);
    };

    return (
        <div className="split-panel" style={s.page}>
            <div className="split-panel-image" style={s.imagePanel}>
                <div style={s.imageOverlay}>
                    <div style={s.quoteMark}>"</div>
                    <p style={s.quote}>Ensemble, cultivons un impact durable pour notre communauté.</p>
                    <div style={s.quoteAuthor}>— L'équipe Terra Sana</div>
                </div>
            </div>

            <div className="split-panel-form" style={s.formPanel}>
                <div style={s.card}>
                    <div style={s.logo}>
                        <div style={{ ...s.logoIcon, background: GREEN }}>TS</div>
                        <span style={s.logoText}>Terra<span style={{ color: GREEN }}>Sana</span></span>
                    </div>
                    <h1 style={s.title}>Espace Bénévole</h1>
                    <p style={s.sub}>Connectez-vous pour accéder à vos événements</p>

                    {error && <div style={s.error}>{error}</div>}

                    <form onSubmit={handleSubmit} style={s.form}>
                        <div style={s.row}>
                            <label style={s.label}>Email</label>
                            <input type="email" name="email" autoComplete="username" value={form.email}
                                onChange={e => setForm({ ...form, email: e.target.value })}
                                style={s.input} placeholder="votre@email.com" required />
                        </div>
                        <div style={s.row}>
                            <label style={s.label}>Mot de passe</label>
                            <input type="password" name="password" autoComplete="current-password" value={form.password}
                                onChange={e => setForm({ ...form, password: e.target.value })}
                                style={s.input} placeholder="Votre mot de passe" required />
                        </div>
                        <button type="submit" style={{ ...s.btn, background: GREEN }} disabled={loading}>
                            {loading ? "Connexion..." : "Se connecter"}
                        </button>
                    </form>

                    <p style={{ ...s.link, marginTop: "14px" }}>
                        <Link to="/volunteer/forgot-password" style={{ color: GOLD, fontWeight: "600" }}>
                            Mot de passe oublié ?
                        </Link>
                    </p>

                    <p style={s.link}>
                        Pas encore de compte ?{" "}
                        <Link to="/volunteer/register" style={{ color: GREEN, fontWeight: "600" }}>
                            Créer un compte
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

const s = {
    page: { minHeight: "80vh", display: "flex", background: "#F8F4E3" },
    imagePanel: {
        flex: "1 1 45%",
        minHeight: "80vh",
        background: "linear-gradient(160deg, #173C29, #2D6A4F)",
        display: "flex",
        alignItems: "flex-end",
        padding: "48px"
    },
    imageOverlay: { maxWidth: "380px" },
    quoteMark: { fontSize: "48px", color: "#D4A017", fontFamily: "Georgia, serif", lineHeight: "0.5", marginBottom: "12px" },
    quote: { color: "#fff", fontSize: "20px", fontWeight: "600", lineHeight: "1.5", marginBottom: "14px", textShadow: "0 2px 8px rgba(0,0,0,0.3)" },
    quoteAuthor: { color: "#74C69D", fontSize: "13px", fontWeight: "600" },
    formPanel: { flex: "1 1 55%", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" },
    card: { width: "420px", maxWidth: "100%" },
    logo: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" },
    logoIcon: { color: "#fff", fontWeight: "bold", fontSize: "14px", width: "38px", height: "38px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" },
    logoText: { fontSize: "18px", fontWeight: "bold", color: "#1B1B1B" },
    title: { fontSize: "24px", fontWeight: "bold", color: "#1B1B1B", marginBottom: "6px" },
    sub: { fontSize: "13px", color: "#767066", marginBottom: "24px" },
    error: { background: "#ffebee", color: "#c62828", padding: "12px 16px", borderRadius: "8px", marginBottom: "20px", fontSize: "13px" },
    form: { display: "flex", flexDirection: "column", gap: "16px" },
    row: { display: "flex", flexDirection: "column", gap: "6px" },
    label: { fontSize: "13px", color: "#555", fontWeight: "500" },
    input: { padding: "11px 14px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "14px", outline: "none", background: "#fff" },
    btn: { color: "#fff", fontSize: "14px", padding: "13px 28px", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: "600", boxShadow: "0 4px 14px rgba(45,106,79,0.3)" },
    link: { textAlign: "center", marginTop: "20px", fontSize: "13px", color: "#888" }
};

export default VolunteerLogin;
