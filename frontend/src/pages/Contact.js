import { useState } from "react";
import { sendContact } from "../services/api";

function Contact() {
    const [form, setForm] = useState({ name: "", email: "", message: "" });
    const [sent, setSent] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await sendContact(form);
        setSent(true);
        setForm({ name: "", email: "", message: "" });
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Nous contacter</h1>
            <p style={styles.sub}>Envoyez-nous un message, nous repondrons rapidement</p>
            {sent && <div style={styles.success}>Message envoye avec succes !</div>}
            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.row}>
                    <label style={styles.label}>Nom complet</label>
                    <input name="name" value={form.name} onChange={handleChange} style={styles.input} placeholder="Votre nom" required />
                </div>
                <div style={styles.row}>
                    <label style={styles.label}>Email</label>
                    <input name="email" type="email" value={form.email} onChange={handleChange} style={styles.input} placeholder="votre@email.com" required />
                </div>
                <div style={styles.row}>
                    <label style={styles.label}>Message</label>
                    <textarea name="message" value={form.message} onChange={handleChange} style={styles.textarea} placeholder="Votre message..." required />
                </div>
                <button type="submit" style={styles.btn}>Envoyer le message</button>
            </form>
        </div>
    );
}

const styles = {
    container: { padding: "40px 32px", maxWidth: "600px", margin: "0 auto" },
    title: { fontSize: "28px", fontWeight: "bold", color: "#1a1a1a", marginBottom: "8px" },
    sub: { fontSize: "14px", color: "#888", marginBottom: "28px" },
    success: { background: "#e8f5e9", color: "#2e7d32", padding: "12px 16px", borderRadius: "8px", marginBottom: "20px", fontSize: "14px" },
    form: { display: "flex", flexDirection: "column", gap: "16px" },
    row: { display: "flex", flexDirection: "column", gap: "6px" },
    label: { fontSize: "13px", color: "#555" },
    input: { padding: "10px 14px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "14px" },
    textarea: { padding: "10px 14px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "14px", height: "120px", resize: "none" },
    btn: { background: "#4caf50", color: "#fff", fontSize: "14px", padding: "12px 28px", borderRadius: "8px", border: "none", cursor: "pointer" }
};

export default Contact;
