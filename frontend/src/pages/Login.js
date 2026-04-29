import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
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
            if (res.status === 403 || res.status === 401) {
                setError("Nom utilisateur ou mot de passe incorrect.");
                setLoading(false);
                return;
            }
            if (res.status === 500) {
                setError("Compte introuvable. Verifiez votre nom utilisateur.");
                setLoading(false);
                return;
            }
            if (!res.ok) {
                setError("Une erreur est survenue. Veuillez reessayer.");
                setLoading(false);
                return;
            }
            const data = await res.json();
            const expiry = Date.now() + 24 * 60 * 60 * 1000;
            localStorage.setItem("token", data.token);
            localStorage.setItem("tokenExpiry", expiry);
            navigate("/admin");
        } catch (err) {
            setError("Impossible de se connecter au serveur. Verifiez que le backend est lance.");
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.logoBox}>
                    <div style={styles.logoIcon}>TS</div>
                    <div style={styles.logoText}>Terra<span style={styles.green}>Sana</span></div>
                </div>
                <h1 style={styles.title}>Connexion Administrateur</h1>
                <p style={styles.sub}>Espace reserve a administrateur Terra Sana</p>
                {error && (
                    <div style={styles.error}>
                        <span>??</span> {error}
                    </div>
                )}
                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.row}>
                        <label style={styles.label}>Nom utilisateur</label>
                        <input name="username" value={form.username} onChange={handleChange} style={styles.input} placeholder="Entrez votre nom utilisateur" required />
                    </div>
                    <div style={styles.row}>
                        <label style={styles.label}>Mot de passe</label>
                        <input name="password" type="password" value={form.password} onChange={handleChange} style={styles.input} placeholder="Entrez votre mot de passe" required />
                    </div>
                    <button type="submit" style={styles.btn} disabled={loading}>
                        {loading ? "Connexion en cours..." : "Se connecter"}
                    </button>
                </form>
            </div>
        </div>
    );
}

const styles = {
    container: { minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f9f9f9" },
    card: { background: "#fff", border: "1px solid #e0e0e0", borderRadius: "12px", padding: "40px", width: "420px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" },
    logoBox: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" },
    logoIcon: { background: "#4caf50", color: "#fff", fontWeight: "bold", fontSize: "14px", width: "38px", height: "38px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" },
    logoText: { fontSize: "18px", fontWeight: "bold", color: "#1a1a1a" },
    green: { color: "#4caf50" },
    title: { fontSize: "22px", fontWeight: "bold", color: "#1a1a1a", marginBottom: "6px" },
    sub: { fontSize: "13px", color: "#888", marginBottom: "24px" },
    error: { background: "#ffebee", color: "#c62828", padding: "12px 16px", borderRadius: "8px", marginBottom: "20px", fontSize: "13px", display: "flex", alignItems: "center", gap: "8px" },
    form: { display: "flex", flexDirection: "column", gap: "16px" },
    row: { display: "flex", flexDirection: "column", gap: "6px" },
    label: { fontSize: "13px", color: "#555", fontWeight: "500" },
    input: { padding: "10px 14px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "14px", outline: "none" },
    btn: { background: "#4caf50", color: "#fff", fontSize: "14px", padding: "12px 28px", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: "500" }
};

export default Login;
