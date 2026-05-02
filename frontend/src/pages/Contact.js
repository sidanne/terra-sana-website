import { useState } from "react";
import { sendContact } from "../services/api";

function Contact({ lang }) {
    const [form, setForm] = useState({ name: "", email: "", message: "" });
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);

    const t = {
        fr: { title: "Nous contacter", sub: "Envoyez-nous un message, nous repondrons rapidement", name: "Nom complet", email: "Email", message: "Message", namePh: "Votre nom", emailPh: "votre@email.com", msgPh: "Votre message...", btn: "Envoyer le message", sending: "Envoi en cours...", success: "Message envoye avec succes ! Nous vous repondrons bientot." },
        en: { title: "Contact us", sub: "Send us a message, we will respond quickly", name: "Full name", email: "Email", message: "Message", namePh: "Your name", emailPh: "your@email.com", msgPh: "Your message...", btn: "Send message", sending: "Sending...", success: "Message sent successfully! We will get back to you soon." },
        nl: { title: "Neem contact op", sub: "Stuur ons een bericht, wij antwoorden snel", name: "Volledige naam", email: "E-mail", message: "Bericht", namePh: "Uw naam", emailPh: "uw@email.com", msgPh: "Uw bericht...", btn: "Bericht verzenden", sending: "Verzenden...", success: "Bericht succesvol verzonden! We nemen snel contact met u op." }
    }[lang] || { title: "Nous contacter", sub: "Envoyez-nous un message", name: "Nom", email: "Email", message: "Message", namePh: "Votre nom", emailPh: "votre@email.com", msgPh: "Votre message...", btn: "Envoyer", sending: "Envoi...", success: "Message envoye !" };

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await sendContact(form);
            setSent(true);
            setForm({ name: "", email: "", message: "" });
            setTimeout(() => setSent(false), 4000);
        } catch (err) { console.error(err); }
        setLoading(false);
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>{t.title}</h1>
            <p style={styles.sub}>{t.sub}</p>
            {sent && (
                <div style={styles.success}>
                    <span style={styles.successIcon}>OK</span>
                    {t.success}
                </div>
            )}
            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.row}>
                    <label style={styles.label}>{t.name}</label>
                    <input name="name" value={form.name} onChange={handleChange} style={styles.input} placeholder={t.namePh} required />
                </div>
                <div style={styles.row}>
                    <label style={styles.label}>{t.email}</label>
                    <input name="email" type="email" value={form.email} onChange={handleChange} style={styles.input} placeholder={t.emailPh} required />
                </div>
                <div style={styles.row}>
                    <label style={styles.label}>{t.message}</label>
                    <textarea name="message" value={form.message} onChange={handleChange} style={styles.textarea} placeholder={t.msgPh} required />
                </div>
                <button type="submit" style={styles.btn} disabled={loading}>
                    {loading ? t.sending : t.btn}
                </button>
            </form>
        </div>
    );
}

const styles = {
    container: { padding: "40px 32px", maxWidth: "600px", margin: "0 auto" },
    title: { fontSize: "28px", fontWeight: "bold", color: "#1a1a1a", marginBottom: "8px" },
    sub: { fontSize: "14px", color: "#888", marginBottom: "28px" },
    success: { background: "#e8f5e9", color: "#2e7d32", padding: "14px 18px", borderRadius: "8px", marginBottom: "20px", fontSize: "14px", display: "flex", alignItems: "center", gap: "10px", border: "1px solid #a5d6a7" },
    successIcon: { background: "#2e7d32", color: "#fff", fontSize: "11px", fontWeight: "bold", padding: "3px 8px", borderRadius: "4px" },
    form: { display: "flex", flexDirection: "column", gap: "16px" },
    row: { display: "flex", flexDirection: "column", gap: "6px" },
    label: { fontSize: "13px", color: "#555", fontWeight: "500" },
    input: { padding: "10px 14px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "14px", outline: "none", fontFamily: "Arial, sans-serif" },
    textarea: { padding: "10px 14px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "14px", height: "120px", resize: "none", outline: "none", fontFamily: "Arial, sans-serif" },
    btn: { background: "#4caf50", color: "#fff", fontSize: "14px", padding: "12px 28px", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: "600" }
};

export default Contact;
