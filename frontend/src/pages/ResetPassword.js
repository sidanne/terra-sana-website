import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { resetPassword } from "../services/volunteerApi";

const GREEN = "#2D6A4F";

function ResetPassword() {
    // Le jeton de réinitialisation arrive dans l'URL : /volunteer/reset-password?token=xxx
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const [form, setForm] = useState({ password: "", confirm: "" });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (form.password.length < 8) {
            setError("Le mot de passe doit contenir au moins 8 caractères.");
            return;
        }
        if (form.password !== form.confirm) {
            setError("Les mots de passe ne correspondent pas.");
            return;
        }
        setLoading(true);
        try {
            const data = await resetPassword(token, form.password);
            if (data.message && data.message.includes("succès")) {
                setSuccess(true);
                setTimeout(() => navigate("/volunteer/login"), 2500);
            } else {
                setError(data.message || "Ce lien est invalide ou a expiré.");
            }
        } catch {
            setError("Impossible de contacter le serveur.");
        }
        setLoading(false);
    };

    if (!token) {
        return (
            <div className="split-panel" style={s.page}>
                <div className="split-panel-image" style={s.imagePanel} />
                <div className="split-panel-form" style={s.formPanel}>
                    <div style={s.card}>
                        <div style={s.error}>Lien de réinitialisation invalide ou incomplet.</div>
                        <p style={s.link}>
                            <Link to="/volunteer/forgot-password" style={{ color: GREEN, fontWeight: "600" }}>
                                Refaire une demande
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="split-panel" style={s.page}>
            <div className="split-panel-image" style={s.imagePanel}>
                <div style={s.imageOverlay}>
                    <div style={s.quoteMark}>"</div>
                    <p style={s.quote}>Un nouveau départ, la même mission : agir ensemble.</p>
                    <div style={s.quoteAuthor}>— L'équipe Terra Sana</div>
                </div>
            </div>

            <div className="split-panel-form" style={s.formPanel}>
            <div style={s.card}>
                <div style={s.logo}>
                    <div style={{ ...s.logoIcon, background: GREEN }}>TS</div>
                    <span style={s.logoText}>Terra<span style={{ color: GREEN }}>Sana</span></span>
                </div>
                <h1 style={s.title}>Nouveau mot de passe</h1>
                <p style={s.sub}>Choisissez un nouveau mot de passe pour votre compte</p>

                {error && <div style={s.error}>{error}</div>}

                {success ? (
                    <div style={s.success}>
                        Mot de passe réinitialisé avec succès ! Redirection vers la connexion...
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} style={s.form}>
                        <div style={s.row}>
                            <label style={s.label}>Nouveau mot de passe (min. 8 caractères)</label>
                            <input type="password" value={form.password}
                                onChange={e => setForm({ ...form, password: e.target.value })}
                                style={s.input} placeholder="Nouveau mot de passe" required minLength={8} />
                        </div>
                        <div style={s.row}>
                            <label style={s.label}>Confirmer le mot de passe</label>
                            <input type="password" value={form.confirm}
                                onChange={e => setForm({ ...form, confirm: e.target.value })}
                                style={s.input} placeholder="Confirmez le mot de passe" required minLength={8} />
                        </div>
                        <button type="submit" style={{ ...s.btn, background: GREEN }} disabled={loading}>
                            {loading ? "Validation..." : "Réinitialiser le mot de passe"}
                        </button>
                    </form>
                )}
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
    success: { background: "#e8f5e9", color: "#2e7d32", padding: "14px 16px", borderRadius: "8px", fontSize: "13px", lineHeight: "1.6" },
    form: { display: "flex", flexDirection: "column", gap: "16px" },
    row: { display: "flex", flexDirection: "column", gap: "6px" },
    label: { fontSize: "13px", color: "#555", fontWeight: "500" },
    input: { padding: "11px 14px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "14px", outline: "none" },
    btn: { color: "#fff", fontSize: "14px", padding: "13px 28px", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: "600", boxShadow: "0 4px 14px rgba(45,106,79,0.3)" },
    link: { textAlign: "center", marginTop: "20px", fontSize: "13px", color: "#888" }
};

export default ResetPassword;
