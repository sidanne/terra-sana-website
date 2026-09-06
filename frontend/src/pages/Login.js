import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const T = {
    fr: {
        quote: "Piloter Terra Sana, un projet à la fois.", quoteAuthor: "— Espace administrateur",
        title: "Connexion Administrateur", sub: "Espace réservé à l'administrateur Terra Sana",
        username: "Nom utilisateur", usernamePh: "Entrez votre nom utilisateur",
        password: "Mot de passe", passwordPh: "Entrez votre mot de passe",
        loading: "Connexion en cours...", submit: "Se connecter", forgot: "Mot de passe oublié ?",
        genericError: "Une erreur est survenue. Veuillez réessayer.",
        serverError: "Impossible de se connecter au serveur. Vérifiez que le backend est lancé."
    },
    en: {
        quote: "Steering Terra Sana, one project at a time.", quoteAuthor: "— Admin area",
        title: "Administrator login", sub: "Area reserved for the Terra Sana administrator",
        username: "Username", usernamePh: "Enter your username",
        password: "Password", passwordPh: "Enter your password",
        loading: "Logging in...", submit: "Log in", forgot: "Forgot your password?",
        genericError: "An error occurred. Please try again.",
        serverError: "Could not connect to the server. Check that the backend is running."
    },
    nl: {
        quote: "Terra Sana sturen, één project tegelijk.", quoteAuthor: "— Adminomgeving",
        title: "Beheerder inloggen", sub: "Omgeving voorbehouden voor de Terra Sana-beheerder",
        username: "Gebruikersnaam", usernamePh: "Voer uw gebruikersnaam in",
        password: "Wachtwoord", passwordPh: "Voer uw wachtwoord in",
        loading: "Bezig met inloggen...", submit: "Inloggen", forgot: "Wachtwoord vergeten?",
        genericError: "Er is een fout opgetreden. Probeer het opnieuw.",
        serverError: "Kan geen verbinding maken met de server. Controleer of de backend actief is."
    }
};

function Login({ lang }) {
    const t = T[lang] || T.fr;
    const [form, setForm] = useState({ username: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch("http://localhost:8080/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.message || t.genericError);
                setLoading(false);
                return;
            }
            const expiry = Date.now() + 24 * 60 * 60 * 1000;
            localStorage.setItem("token", data.token);
            localStorage.setItem("tokenExpiry", expiry);
            navigate("/admin");
        } catch (err) {
            setError(t.serverError);
            setLoading(false);
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.imagePanel}>
                <div style={styles.imageOverlay}>
                    <div style={styles.quoteMark}>"</div>
                    <p style={styles.quote}>{t.quote}</p>
                    <div style={styles.quoteAuthor}>{t.quoteAuthor}</div>
                </div>
            </div>

            <div style={styles.formPanel}>
            <div style={styles.card}>
                <div style={styles.logoBox}>
                    <div style={styles.logoIcon}>TS</div>
                    <div style={styles.logoText}>Terra<span style={styles.green}>Sana</span></div>
                </div>
                <h1 style={styles.title}>{t.title}</h1>
                <p style={styles.sub}>{t.sub}</p>
                {error && (
                    <div style={styles.error}>
                        <span>⚠</span> {error}
                    </div>
                )}
                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.row}>
                        <label style={styles.label}>{t.username}</label>
                        <input name="username" autoComplete="username" value={form.username} onChange={handleChange} style={styles.input} placeholder={t.usernamePh} required />
                    </div>
                    <div style={styles.row}>
                        <label style={styles.label}>{t.password}</label>
                        <input name="password" type="password" autoComplete="current-password" value={form.password} onChange={handleChange} style={styles.input} placeholder={t.passwordPh} required />
                    </div>
                    <button type="submit" style={styles.btn} disabled={loading}>
                        {loading ? t.loading : t.submit}
                    </button>
                </form>
                <p style={styles.link}>
                    <Link to="/admin/forgot-password" style={{ color: "#D4A017", fontWeight: "600" }}>
                        {t.forgot}
                    </Link>
                </p>
            </div>
            </div>
        </div>
    );
}

const styles = {
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
    logoBox: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" },
    logoIcon: { background: "#2D6A4F", color: "#fff", fontWeight: "bold", fontSize: "14px", width: "38px", height: "38px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" },
    logoText: { fontSize: "18px", fontWeight: "bold", color: "#1B1B1B" },
    green: { color: "#2D6A4F" },
    title: { fontSize: "24px", fontWeight: "bold", color: "#1B1B1B", marginBottom: "6px" },
    sub: { fontSize: "13px", color: "#767066", marginBottom: "24px" },
    error: { background: "#ffebee", color: "#c62828", padding: "12px 16px", borderRadius: "8px", marginBottom: "20px", fontSize: "13px", display: "flex", alignItems: "center", gap: "8px" },
    form: { display: "flex", flexDirection: "column", gap: "16px" },
    row: { display: "flex", flexDirection: "column", gap: "6px" },
    label: { fontSize: "13px", color: "#555", fontWeight: "500" },
    input: { padding: "11px 14px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "14px", outline: "none" },
    btn: { background: "#2D6A4F", color: "#fff", fontSize: "14px", padding: "13px 28px", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: "600", boxShadow: "0 4px 14px rgba(45,106,79,0.3)" },
    link: { textAlign: "center", marginTop: "18px", fontSize: "13px" }
};

export default Login;
