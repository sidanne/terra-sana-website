import { useState } from "react";
import { Link } from "react-router-dom";

const GREEN = "#2D6A4F";

const T = {
    fr: { quote: "Un accès sécurisé, même pour l'administration.", quoteAuthor: "— Espace administrateur", title: "Mot de passe oublié", sub: "Entrez votre nom d'utilisateur pour recevoir un lien de réinitialisation", success: "Si ce compte existe, un lien de réinitialisation valable 30 minutes vient d'être envoyé.", username: "Nom d'utilisateur", usernamePh: "admin", sending: "Envoi...", send: "Envoyer le lien", back: "← Retour à la connexion" },
    en: { quote: "Secure access, even for administration.", quoteAuthor: "— Admin area", title: "Forgot password", sub: "Enter your username to receive a reset link", success: "If this account exists, a reset link valid for 30 minutes has just been sent.", username: "Username", usernamePh: "admin", sending: "Sending...", send: "Send link", back: "← Back to login" },
    nl: { quote: "Veilige toegang, ook voor administratie.", quoteAuthor: "— Adminomgeving", title: "Wachtwoord vergeten", sub: "Voer uw gebruikersnaam in om een resetlink te ontvangen", success: "Als dit account bestaat, is er zonet een resetlink verzonden die 30 minuten geldig is.", username: "Gebruikersnaam", usernamePh: "admin", sending: "Verzenden...", send: "Link verzenden", back: "← Terug naar inloggen" }
};

function AdminForgotPassword({ lang }) {
    const t = T[lang] || T.fr;
    const [username, setUsername] = useState("");
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        await fetch("http://localhost:8080/api/auth/forgotPassword", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username })
        });
        // Le message reste le même que le compte existe ou non (sécurité)
        setSent(true);
        setLoading(false);
    };

    return (
        <div style={s.page}>
            <div style={s.imagePanel}>
                <div style={s.imageOverlay}>
                    <div style={s.quoteMark}>"</div>
                    <p style={s.quote}>{t.quote}</p>
                    <div style={s.quoteAuthor}>{t.quoteAuthor}</div>
                </div>
            </div>

            <div style={s.formPanel}>
                <div style={s.card}>
                    <div style={s.logo}>
                        <div style={{ ...s.logoIcon, background: GREEN }}>TS</div>
                        <span style={s.logoText}>Terra<span style={{ color: GREEN }}>Sana</span></span>
                    </div>
                    <h1 style={s.title}>{t.title}</h1>
                    <p style={s.sub}>{t.sub}</p>

                    {sent ? (
                        <div style={s.success}>
                            {t.success}
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} style={s.form}>
                            <div style={s.row}>
                                <label style={s.label}>{t.username}</label>
                                <input value={username} onChange={e => setUsername(e.target.value)}
                                    autoComplete="username" style={s.input} placeholder={t.usernamePh} required />
                            </div>
                            <button type="submit" style={{ ...s.btn, background: GREEN }} disabled={loading}>
                                {loading ? t.sending : t.send}
                            </button>
                        </form>
                    )}

                    <p style={s.link}>
                        <Link to="/login" style={{ color: GREEN, fontWeight: "600" }}>
                            {t.back}
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
    success: { background: "#e8f5e9", color: "#2e7d32", padding: "14px 16px", borderRadius: "8px", fontSize: "13px", lineHeight: "1.6" },
    form: { display: "flex", flexDirection: "column", gap: "16px" },
    row: { display: "flex", flexDirection: "column", gap: "6px" },
    label: { fontSize: "13px", color: "#555", fontWeight: "500" },
    input: { padding: "11px 14px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "14px", outline: "none" },
    btn: { color: "#fff", fontSize: "14px", padding: "13px 28px", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: "600", boxShadow: "0 4px 14px rgba(45,106,79,0.3)" },
    link: { textAlign: "center", marginTop: "20px", fontSize: "13px", color: "#888" }
};

export default AdminForgotPassword;
