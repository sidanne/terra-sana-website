function Sponsors({ lang }) {
    const t = {
        fr: { title: "Nos sponsors", sub: "Partenaires qui soutiennent la mission de Terra Sana", contact: "Devenir sponsor", contactDesc: "Vous souhaitez soutenir Terra Sana ? Contactez-nous !", contactBtn: "Nous contacter", noSponsors: "Aucun sponsor pour le moment." },
        en: { title: "Our sponsors", sub: "Partners who support Terra Sana mission", contact: "Become a sponsor", contactDesc: "Want to support Terra Sana? Contact us!", contactBtn: "Contact us", noSponsors: "No sponsors yet." },
        nl: { title: "Onze sponsors", sub: "Partners die de missie van Terra Sana ondersteunen", contact: "Sponsor worden", contactDesc: "Wilt u Terra Sana steunen? Neem contact met ons op!", contactBtn: "Neem contact op", noSponsors: "Nog geen sponsors." }
    }[lang] || { title: "Nos sponsors", sub: "Nos partenaires", contact: "Devenir sponsor", contactDesc: "Contactez-nous !", contactBtn: "Contact", noSponsors: "Aucun sponsor." };

    const sponsors = [
        { nom: "Bruxelles Environnement", type: "Partenaire officiel", desc: "Agence bruxelloise pour l'environnement et l'energie", color: "#e8f5e9" },
        { nom: "Region de Bruxelles", type: "Soutien institutionnel", desc: "Soutien institutionnel de la Region de Bruxelles-Capitale", color: "#e3f2fd" },
        { nom: "Commune de Woluwe", type: "Partenaire local", desc: "Partenariat avec la commune de Woluwe-Saint-Lambert", color: "#fff3e0" }
    ];

    return (
        <div style={styles.page}>
            <div style={styles.hero}>
                <h1 style={styles.title}>{t.title}</h1>
                <p style={styles.sub}>{t.sub}</p>
            </div>
            <div style={styles.container}>

            {sponsors.length === 0 ? (
                <div style={styles.empty}>{t.noSponsors}</div>
            ) : (
                <div className="grid-responsive" style={styles.grid}>
                    {sponsors.map((s, i) => (
                        <div key={i} style={{...styles.card, background: s.color}}>
                            <div style={styles.cardLogo}>
                                {s.nom.charAt(0)}
                            </div>
                            <div style={styles.cardType}>{s.type}</div>
                            <div style={styles.cardNom}>{s.nom}</div>
                            <div style={styles.cardDesc}>{s.desc}</div>
                        </div>
                    ))}
                </div>
            )}

            <div style={styles.becomeBox}>
                <h2 style={styles.becomeTitle}>{t.contact}</h2>
                <p style={styles.becomeDesc}>{t.contactDesc}</p>
                <a href="/contact" style={styles.becomeBtn}>{t.contactBtn}</a>
            </div>
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
    container: { padding: "40px 32px", maxWidth: "900px", margin: "0 auto" },
    title: { fontSize: "28px", fontWeight: "bold", color: "#fff", marginBottom: "8px", textShadow: "0 2px 10px rgba(0,0,0,0.4)" },
    sub: { fontSize: "14px", color: "#e8e8e0", marginBottom: "36px" },
    grid: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "20px", marginBottom: "40px" },
    card: { borderRadius: "12px", padding: "28px", border: "1px solid #e0e0e0" },
    cardLogo: { width: "56px", height: "56px", borderRadius: "50%", background: "#2D6A4F", color: "#fff", fontSize: "22px", fontWeight: "bold", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" },
    cardType: { fontSize: "11px", color: "#2D6A4F", fontWeight: "700", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "8px" },
    cardNom: { fontSize: "16px", fontWeight: "bold", color: "#222", marginBottom: "8px" },
    cardDesc: { fontSize: "13px", color: "#666", lineHeight: "1.6" },
    empty: { textAlign: "center", color: "#aaa", fontSize: "14px", padding: "60px" },
    becomeBox: { background: "#1B1B1B", borderRadius: "16px", padding: "40px", textAlign: "center" },
    becomeTitle: { fontSize: "22px", fontWeight: "bold", color: "#fff", marginBottom: "12px" },
    becomeDesc: { fontSize: "14px", color: "#888", marginBottom: "24px" },
    becomeBtn: { background: "#2D6A4F", color: "#fff", fontSize: "14px", padding: "12px 28px", borderRadius: "8px", textDecoration: "none", fontWeight: "600" }
};

export default Sponsors;
