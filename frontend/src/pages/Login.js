import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
    const [form, setForm] = useState({ username: "", password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("http://localhost:8080/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            });
            if (!res.ok) throw new Error("Identifiants incorrects");
            const data = await res.json();
            localStorage.setItem("token", data.token);
            navigate("/admin");
        } catch (err) {
            setError("Identifiants incorrects");
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.title}>Connexion Admin</h1>
                <p style={styles.sub}>Espace reserve a administrateur</p>
                {error && <div style={styles.error}>{error}</div>}
                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.row}>
                        <label style={styles.label}>Nom utilisateur</label>
                        <input name="username" value={form.username} onChange={handleChange} style={styles.input} placeholder="Nom utilisateur" required />
                    </div>
                    <div style={styles.row}>
                        <label style={styles.label}>Mot de passe</label>
                        <input name="password" type="password" value={form.password} onChange={handleChange} style={styles.input} placeholder="Mot de passe" required />
                    </div>
                    <button type="submit" style={styles.btn}>Se connecter</button>
                </form>
            </div>
        </div>
    );
}

const styles = {
    container: { minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f9f9f9" },
    card: { background: "#fff", border: "1px solid #e0e0e0", borderRadius: "12px", padding: "40px", width: "400px" },
    title: { fontSize: "24px", fontWeight: "bold", color: "#1a1a1a", marginBottom: "8px" },
    sub: { fontSize: "13px", color: "#888", marginBottom: "28px" },
    error: { background: "#ffebee", color: "#c62828", padding: "12px 16px", borderRadius: "8px", marginBottom: "20px", fontSize: "13px" },
    form: { display: "flex", flexDirection: "column", gap: "16px" },
    row: { display: "flex", flexDirection: "column", gap: "6px" },
    label: { fontSize: "13px", color: "#555" },
    input: { padding: "10px 14px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "14px" },
    btn: { background: "#4caf50", color: "#fff", fontSize: "14px", padding: "12px 28px", borderRadius: "8px", border: "none", cursor: "pointer" }
};

export default Login;
