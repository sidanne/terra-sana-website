import { useState } from "react";

function Benevolat({ lang }) {
    const [form, setForm] = useState({ nom: "", email: "", telephone: "", type: "benevole", motivation: "", disponibilite: "" });
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);

    const t = {
        fr: { title: "Benevol et Stage", sub: "Rejoignez notre equipe et contribuez a notre mission", typeLabel: "Type de candidature", benevole: "Benevole", stagiaire: "Stagiaire", nom: "Nom complet", email: "Email", tel: "Telephone", motivation: "Lettre de motivation", motivationPh: "Expliquez votre motivation a rejoindre Terra Sana...", dispo: "Disponibilites", dispoPh: "Quand etes-vous disponible ? (jours, heures...)", send: "Envoyer ma candidature", sending: "Envoi en cours...", success: "Votre candidature a ete envoyee avec succes ! Nous vous contacterons bientot.", why: "Pourquoi nous rejoindre ?", r1: "Contribuer a une mission solidaire et durable", r2: "Developper vos competences professionnelles", r3: "Integrer une equipe dynamique et bienveillante", r4: "Participer a des projets concrets et innovants" },
        en: { title: "Volunteer and Internship", sub: "Join our team and contribute to our mission", typeLabel: "Application type", benevole: "Volunteer", stagiaire: "Intern", nom: "Full name", email: "Email", tel: "Phone", motivation: "Cover letter", motivationPh: "Explain your motivation to join Terra Sana...", dispo: "Availability", dispoPh: "When are you available? (days, hours...)", send: "Send my application", sending: "Sending...", success: "Your application has been sent! We will contact you soon.", why: "Why join us?", r1: "Contribute to a solidarity and sustainable mission", r2: "Develop your professional skills", r3: "Join a dynamic and caring team", r4: "Participate in concrete and innovative projects" },
        nl: { title: "Vrijwillig en Stage", sub: "Sluit u aan bij ons team en draag bij aan onze missie", typeLabel: "Type aanvraag", benevole: "Vrijwilliger", stagiaire: "Stagiair", nom: "Volledige naam", email: "E-mail", tel: "Telefoon", motivation: "Motivatiebrief", motivationPh: "Leg uw motivatie uit om Terra Sana te vervoegen...", dispo: "Beschikbaarheid", dispoPh: "Wanneer bent u beschikbaar?", send: "Mijn aanvraag verzenden", sending: "Verzenden...", success: "Uw aanvraag is verzonden! We nemen spoedig contact met u op.", why: "Waarom ons vervoegen?", r1: "Bijdragen aan een solidaire en duurzame missie", r2: "Uw professionele vaardigheden ontwikkelen", r3: "Deel uitmaken van een dynamisch team", r4: "Deelnemen aan concrete projecten" }
    }[lang] || { title: "Benevol et Stage", sub: "Rejoignez notre equipe", typeLabel: "Type", benevole: "Benevole", stagiaire: "Stagiaire", nom: "Nom", email: "Email", tel: "Telephone", motivation: "Motivation", motivationPh: "Votre motivation...", dispo: "Disponibilites", dispoPh: "Vos disponibilites...", send: "Envoyer", sending: "Envoi...", success: "Candidature envoyee !", why: "Pourquoi nous rejoindre ?", r1: "Mission solidaire", r2: "Competences", r3: "Equipe dynamique", r4: "Projets innovants" };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        await fetch("http://localhost:8080/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: form.nom,
                email: form.email,
                message: `[${form.type.toUpperCase()}] Tel: ${form.telephone}\nMotivation: ${form.motivation}\nDisponibilites: ${form.disponibilite}`
            })
        });
        setSent(true);
        setLoading(false);
        setForm({ nom: "", email: "", telephone: "", type: "benevole", motivation: "", disponibilite: "" });
        setTimeout(() => setSent(false), 5000);
    };

    return (
        <div style={styles.page}>
            <div style={styles.container}>
                <div style={styles.left}>
                    <h1 style={styles.title}>{t.title}</h1>
                    <p style={styles.sub}>{t.sub}</p>
                    <div style={styles.whyBox}>
                        <h2 style={styles.whyTitle}>{t.why}</h2>
                        {[t.r1, t.r2, t.r3, t.r4].map((r, i) => (
                            <div key={i} style={styles.reason}>
                                <div style={styles.reasonNum}>{i + 1}</div>
                                <div style={styles.reasonText}>{r}</div>
                            </div>
                        ))}
                    </div>
                    <div style={styles.contactBox}>
                        <div style={styles.contactItem}>ADR — 53/3, 1200 Woluwe-Saint-Lambert</div>
                        <div style={styles.contactItem}>EML — Terrasana@outlook.be</div>
                        <div style={styles.contactItem}>HOR — Lun - Ven : 8h00 - 16h00</div>
                    </div>
                </div>

                <div style={styles.right}>
                    {sent && <div style={styles.success}>{t.success}</div>}
                    <form onSubmit={handleSubmit} style={styles.form}>
                        <div style={styles.typeRow}>
                            <label style={{...styles.typeBtn, ...(form.type === "benevole" ? styles.typeBtnActive : {})}}>
                                <input type="radio" name="type" value="benevole" checked={form.type === "benevole"} onChange={e => setForm({...form, type: e.target.value})} style={{ display: "none" }} />
                                {t.benevole}
                            </label>
                            <label style={{...styles.typeBtn, ...(form.type === "stagiaire" ? styles.typeBtnActive : {})}}>
                                <input type="radio" name="type" value="stagiaire" checked={form.type === "stagiaire"} onChange={e => setForm({...form, type: e.target.value})} style={{ display: "none" }} />
                                {t.stagiaire}
                            </label>
                        </div>
                        <div style={styles.row}>
                            <label style={styles.label}>{t.nom}</label>
                            <input value={form.nom} onChange={e => setForm({...form, nom: e.target.value})} style={styles.input} placeholder={t.nom} required />
                        </div>
                        <div style={styles.formGrid}>
                            <div style={styles.row}>
                                <label style={styles.label}>{t.email}</label>
                                <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} style={styles.input} placeholder="votre@email.com" required />
                            </div>
                            <div style={styles.row}>
                                <label style={styles.label}>{t.tel}</label>
                                <input value={form.telephone} onChange={e => setForm({...form, telephone: e.target.value})} style={styles.input} placeholder="+32 xxx xx xx xx" />
                            </div>
                        </div>
                        <div style={styles.row}>
                            <label style={styles.label}>{t.motivation}</label>
                            <textarea value={form.motivation} onChange={e => setForm({...form, motivation: e.target.value})} style={styles.textarea} placeholder={t.motivationPh} required />
                        </div>
                        <div style={styles.row}>
                            <label style={styles.label}>{t.dispo}</label>
                            <textarea value={form.disponibilite} onChange={e => setForm({...form, disponibilite: e.target.value})} style={{...styles.textarea, height: "80px"}} placeholder={t.dispoPh} />
                        </div>
                        <button type="submit" style={styles.btn} disabled={loading}>
                            {loading ? t.sending : t.send}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

const styles = {
    page: { background: "#f9f9f9", minHeight: "100vh", padding: "40px 32px" },
    container: { display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "40px", maxWidth: "1000px", margin: "0 auto" },
    left: {},
    title: { fontSize: "28px", fontWeight: "bold", color: "#1a1a1a", marginBottom: "8px" },
    sub: { fontSize: "14px", color: "#888", marginBottom: "28px", lineHeight: "1.7" },
    whyBox: { background: "#fff", border: "1px solid #e0e0e0", borderRadius: "12px", padding: "24px", marginBottom: "20px" },
    whyTitle: { fontSize: "15px", fontWeight: "bold", color: "#2e7d32", marginBottom: "16px" },
    reason: { display: "flex", gap: "12px", alignItems: "flex-start", marginBottom: "14px" },
    reasonNum: { width: "28px", height: "28px", borderRadius: "50%", background: "#4caf50", color: "#fff", fontSize: "13px", fontWeight: "bold", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
    reasonText: { fontSize: "13px", color: "#555", lineHeight: "1.6", paddingTop: "4px" },
    contactBox: { background: "#1a1a1a", borderRadius: "12px", padding: "20px" },
    contactItem: { fontSize: "12px", color: "#888", marginBottom: "8px", fontFamily: "monospace" },
    right: {},
    success: { background: "#e8f5e9", color: "#2e7d32", padding: "14px 18px", borderRadius: "8px", marginBottom: "20px", fontSize: "14px", border: "1px solid #a5d6a7" },
    form: { background: "#fff", border: "1px solid #e0e0e0", borderRadius: "12px", padding: "28px", display: "flex", flexDirection: "column", gap: "16px" },
    typeRow: { display: "flex", gap: "8px" },
    typeBtn: { flex: 1, padding: "10px", border: "1.5px solid #ddd", borderRadius: "8px", textAlign: "center", cursor: "pointer", fontSize: "14px", fontWeight: "500", color: "#888", background: "#fff" },
    typeBtnActive: { border: "1.5px solid #4caf50", color: "#4caf50", background: "#f0fdf4", fontWeight: "600" },
    formGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" },
    row: { display: "flex", flexDirection: "column", gap: "6px" },
    label: { fontSize: "13px", color: "#555", fontWeight: "500" },
    input: { padding: "10px 14px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "14px", outline: "none", fontFamily: "Arial" },
    textarea: { padding: "10px 14px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "14px", height: "120px", resize: "none", outline: "none", fontFamily: "Arial" },
    btn: { background: "#4caf50", color: "#fff", fontSize: "14px", padding: "12px 28px", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: "600" }
};

export default Benevolat;
