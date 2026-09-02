import { useState } from "react";
import { sendContact } from "../services/api";

function Contact({ lang }) {
    const [form, setForm] = useState({ name: "", email: "", message: "" });
    const [errors, setErrors] = useState({});
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const MAX_MSG = 1000;

    const t = {
        fr: { title: "Nous contacter", sub: "Envoyez-nous un message, nous repondrons rapidement", name: "Nom complet", email: "Email", message: "Message", namePh: "Votre nom complet", emailPh: "votre@email.com", msgPh: "Votre message (minimum 20 caracteres)...", btn: "Envoyer le message", sending: "Envoi en cours...", success: "Message envoye avec succes ! Nous vous repondrons bientot.", errName: "Le nom doit contenir au moins 3 caracteres", errEmail: "Adresse email invalide", errMsg: "Le message doit contenir au moins 20 caracteres" },
        en: { title: "Contact us", sub: "Send us a message, we will respond quickly", name: "Full name", email: "Email", message: "Message", namePh: "Your full name", emailPh: "your@email.com", msgPh: "Your message (minimum 20 characters)...", btn: "Send message", sending: "Sending...", success: "Message sent successfully! We will get back to you soon.", errName: "Name must be at least 3 characters", errEmail: "Invalid email address", errMsg: "Message must be at least 20 characters" },
        nl: { title: "Neem contact op", sub: "Stuur ons een bericht, wij antwoorden snel", name: "Volledige naam", email: "E-mail", message: "Bericht", namePh: "Uw volledige naam", emailPh: "uw@email.com", msgPh: "Uw bericht (minimaal 20 tekens)...", btn: "Bericht verzenden", sending: "Verzenden...", success: "Bericht succesvol verzonden!", errName: "Naam moet minimaal 3 tekens bevatten", errEmail: "Ongeldig e-mailadres", errMsg: "Bericht moet minimaal 20 tekens bevatten" }
    }[lang] || { title: "Nous contacter", sub: "Envoyez-nous un message", name: "Nom", email: "Email", message: "Message", namePh: "Votre nom", emailPh: "votre@email.com", msgPh: "Votre message...", btn: "Envoyer", sending: "Envoi...", success: "Message envoye !", errName: "Nom trop court", errEmail: "Email invalide", errMsg: "Message trop court" };

    const validate = () => {
        const newErrors = {};
        if (form.name.trim().length < 3) newErrors.name = t.errName;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(form.email)) newErrors.email = t.errEmail;
        if (form.message.trim().length < 20) newErrors.message = t.errMsg;
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (field, value) => {
        setForm({ ...form, [field]: value });
        if (errors[field]) setErrors({ ...errors, [field]: "" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        setSubmitError("");
        try {
            await sendContact(form);
            setSent(true);
            setForm({ name: "", email: "", message: "" });
            setTimeout(() => setSent(false), 5000);
        } catch {
            setSubmitError("Impossible d'envoyer le message. Vérifiez votre connexion et réessayez.");
        }
        setLoading(false);
    };

    const msgLen = form.message.length;
    const msgColor = msgLen < 20 ? "#f44336" : msgLen > MAX_MSG * 0.9 ? "#ff9800" : "#2D6A4F";

    return (
        <div style={styles.page}>
            <div style={styles.hero}>
                <h1 style={styles.title}>{t.title}</h1>
                <p style={styles.sub}>{t.sub}</p>
            </div>
            <div style={styles.container}>
            {sent && (
                <div style={styles.success}>
                    <span style={styles.successIcon}>OK</span>
                    {t.success}
                </div>
            )}
            {submitError && (
                <div style={{ ...styles.success, background: "#ffebee", color: "#c62828" }}>
                    {submitError}
                </div>
            )}
            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.row}>
                    <label style={styles.label}>{t.name}</label>
                    <input
                        value={form.name}
                        onChange={e => handleChange("name", e.target.value)}
                        style={{...styles.input, borderColor: errors.name ? "#f44336" : "#ddd"}}
                        placeholder={t.namePh}
                    />
                    {errors.name && <div style={styles.error}>{errors.name}</div>}
                </div>
                <div style={styles.row}>
                    <label style={styles.label}>{t.email}</label>
                    <input
                        type="email"
                        value={form.email}
                        onChange={e => handleChange("email", e.target.value)}
                        style={{...styles.input, borderColor: errors.email ? "#f44336" : "#ddd"}}
                        placeholder={t.emailPh}
                    />
                    {errors.email && <div style={styles.error}>{errors.email}</div>}
                </div>
                <div style={styles.row}>
                    <div style={styles.labelRow}>
                        <label style={styles.label}>{t.message}</label>
                        <span style={{...styles.counter, color: msgColor}}>{msgLen} / {MAX_MSG}</span>
                    </div>
                    <textarea
                        value={form.message}
                        onChange={e => handleChange("message", e.target.value)}
                        style={{...styles.textarea, borderColor: errors.message ? "#f44336" : "#ddd"}}
                        placeholder={t.msgPh}
                        maxLength={MAX_MSG}
                    />
                    {errors.message && <div style={styles.error}>{errors.message}</div>}
                </div>
                <button type="submit" style={{...styles.btn, opacity: loading ? 0.7 : 1}} disabled={loading}>
                    {loading ? t.sending : t.btn}
                </button>
            </form>
            </div>
        </div>
    );
}

const styles = {
    page: { background: "#F8F4E3", minHeight: "100vh" },
    hero: {
        background: "linear-gradient(160deg, #173C29, #2D6A4F)",
        padding: "56px 32px",
        textAlign: "center"
    },
    container: { padding: "40px 32px", maxWidth: "600px", margin: "0 auto" },
    title: { fontSize: "28px", fontWeight: "bold", color: "#fff", marginBottom: "8px", textShadow: "0 2px 10px rgba(0,0,0,0.4)" },
    sub: { fontSize: "14px", color: "#e8e8e0" },
    success: { background: "#e8f5e9", color: "#2e7d32", padding: "14px 18px", borderRadius: "8px", marginBottom: "20px", fontSize: "14px", display: "flex", alignItems: "center", gap: "10px", border: "1px solid #a5d6a7" },
    successIcon: { background: "#2e7d32", color: "#fff", fontSize: "11px", fontWeight: "bold", padding: "3px 8px", borderRadius: "4px" },
    form: { display: "flex", flexDirection: "column", gap: "18px" },
    row: { display: "flex", flexDirection: "column", gap: "6px" },
    labelRow: { display: "flex", justifyContent: "space-between", alignItems: "center" },
    label: { fontSize: "13px", color: "#555", fontWeight: "500" },
    counter: { fontSize: "12px", fontWeight: "600", fontFamily: "monospace" },
    input: { padding: "10px 14px", border: "1.5px solid #ddd", borderRadius: "8px", fontSize: "14px", outline: "none", fontFamily: "Arial", transition: "border-color 0.2s" },
    textarea: { padding: "10px 14px", border: "1.5px solid #ddd", borderRadius: "8px", fontSize: "14px", height: "140px", resize: "none", outline: "none", fontFamily: "Arial", transition: "border-color 0.2s" },
    error: { fontSize: "12px", color: "#f44336", marginTop: "2px" },
    btn: { background: "#2D6A4F", color: "#fff", fontSize: "14px", padding: "13px 28px", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: "600" }
};

export default Contact;
