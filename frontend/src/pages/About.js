function About({ lang }) {
    const t = {
        fr: { title: "A propos de Terra Sana", mission: "Notre mission", missionText: "Terra Sana ASBL est une organisation a but non lucratif fondee en 2019 a Bruxelles. Elle soutient les producteurs locaux et promote le circuit court.", values: "Nos valeurs", v1: "Soutien aux producteurs locaux", v2: "Promotion du circuit court", v3: "Reduction des dechets et recyclage", v4: "Accompagnement des personnes en decrochage", v5: "Encouragement des pratiques durables", team: "Notre equipe", teamText: "Notre equipe est composee d ouvriers en reinsertion, d employes, de benevoles et de stagiaires.", devise: "Ils ont fait, ils font et ils feront encore, pour etre fiers de ce qu ils laisseront aux generations presentes et futures." },
        en: { title: "About Terra Sana", mission: "Our mission", missionText: "Terra Sana ASBL is a non-profit organization founded in 2019 in Brussels. It supports local producers and promotes short supply chains.", values: "Our values", v1: "Support for local producers", v2: "Promotion of short supply chains", v3: "Waste reduction and recycling", v4: "Support for people in difficulty", v5: "Encouragement of sustainable practices", team: "Our team", teamText: "Our team is composed of workers in reintegration, employees, volunteers and interns.", devise: "They have done, they do and they will do again, to be proud of what they leave to present and future generations." },
        nl: { title: "Over Terra Sana", mission: "Onze missie", missionText: "Terra Sana ASBL is een non-profitorganisatie opgericht in 2019 in Brussel. Ze ondersteunt lokale producenten en bevordert korte ketens.", values: "Onze waarden", v1: "Ondersteuning van lokale producenten", v2: "Bevordering van korte ketens", v3: "Afvalvermindering en recycling", v4: "Begeleiding van mensen in moeilijkheden", v5: "Aanmoediging van duurzame praktijken", team: "Ons team", teamText: "Ons team bestaat uit herintegratiemedewerkers, werknemers, vrijwilligers en stagiairs.", devise: "Ze hebben gedaan, ze doen en ze zullen het opnieuw doen, om trots te zijn op wat ze nalaten aan huidige en toekomstige generaties." }
    }[lang] || { title: "A propos de Terra Sana", mission: "Notre mission", missionText: "Terra Sana ASBL est une organisation a but non lucratif fondee en 2019 a Bruxelles.", values: "Nos valeurs", v1: "Soutien aux producteurs locaux", v2: "Promotion du circuit court", v3: "Reduction des dechets", v4: "Accompagnement", v5: "Pratiques durables", team: "Notre equipe", teamText: "Notre equipe est composee de benevoles et stagiaires.", devise: "Ils ont fait, ils font et ils feront encore." };

    const equipe = [
        { initiales: "DS", nom: "Didier Seraye", role: lang === "fr" ? "Directeur" : lang === "en" ? "Director" : "Directeur" },
        { initiales: "JD", nom: "Jean Dupont", role: lang === "fr" ? "Responsable projets" : lang === "en" ? "Project manager" : "Projectmanager" },
        { initiales: "AL", nom: "Amina Lotti", role: lang === "fr" ? "Coordinatrice benevoles" : lang === "en" ? "Volunteer coordinator" : "Vrijwilligerscoordinator" },
        { initiales: "PB", nom: "Pierre Bernard", role: lang === "fr" ? "Charge formation" : lang === "en" ? "Training officer" : "Opleidingsverantwoordelijke" },
        { initiales: "AT", nom: "Alain Tchouapi", role: lang === "fr" ? "Developpeur web" : lang === "en" ? "Web developer" : "Webontwikkelaar" }
    ];

    return (
        <div>
            <div style={styles.hero}>
                <h1 style={styles.heroTitle}>{t.title}</h1>
            </div>
            <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.subtitle}>{t.mission}</h2>
                <p style={styles.text}>{t.missionText}</p>
            </div>
            <div style={styles.card}>
                <h2 style={styles.subtitle}>{t.values}</h2>
                <ul style={styles.list}>
                    <li>{t.v1}</li><li>{t.v2}</li><li>{t.v3}</li><li>{t.v4}</li><li>{t.v5}</li>
                </ul>
            </div>
            <div style={styles.card}>
                <h2 style={styles.subtitle}>{t.team}</h2>
                <p style={styles.text}>{t.teamText}</p>
                <div className="grid-responsive" style={styles.equipeGrid}>
                    {equipe.map((m, i) => (
                        <div key={i} style={{...styles.membreCard, ...(m.nom === "Alain Tchouapi" ? styles.membreCardSpecial : {})}}>
                            <div style={{...styles.avatar, ...(m.nom === "Alain Tchouapi" ? styles.avatarSpecial : {})}}>{m.initiales}</div>
                            <div style={styles.membreNom}>{m.nom}</div>
                            <div style={styles.membreRole}>{m.role}</div>
                            {m.nom === "Alain Tchouapi" && <div style={styles.stagiaireBadge}>{lang === "fr" ? "Stagiaire" : lang === "en" ? "Intern" : "Stagiair"}</div>}
                        </div>
                    ))}
                </div>
            </div>
            <div style={styles.devise}><p style={styles.deviseText}>{t.devise}</p></div>
            <div style={styles.infoCard}>
                <h2 style={styles.subtitle}>{lang === "fr" ? "Nos coordonnees" : lang === "en" ? "Contact details" : "Contactgegevens"}</h2>
                <div style={styles.infoGrid}>
                    <div style={styles.infoItem}><div style={styles.infoIconBox}>ADR</div><div><div style={styles.infoLabel}>{lang === "fr" ? "Adresse" : lang === "en" ? "Address" : "Adres"}</div><div style={styles.infoValue}>53/3, 1200 Woluwe-Saint-Lambert, Bruxelles</div></div></div>
                    <div style={styles.infoItem}><div style={styles.infoIconBox}>EML</div><div><div style={styles.infoLabel}>Email</div><a href="mailto:Terrasana@outlook.be" style={styles.infoLink}>Terrasana@outlook.be</a></div></div>
                    <div style={styles.infoItem}><div style={styles.infoIconBox}>HOR</div><div><div style={styles.infoLabel}>{lang === "fr" ? "Horaires" : lang === "en" ? "Hours" : "Openingstijden"}</div><div style={styles.infoValue}>{lang === "fr" ? "Lundi - Vendredi : 8h00 - 16h00" : lang === "en" ? "Monday - Friday : 8:00 - 16:00" : "Maandag - Vrijdag : 8:00 - 16:00"}</div></div></div>
                </div>
            </div>
            </div>
        </div>
    );
}

const styles = {
    hero: {
        background: "linear-gradient(160deg, #173C29, #2D6A4F)",
        padding: "64px 32px",
        textAlign: "center"
    },
    heroTitle: { fontSize: "32px", fontWeight: "bold", color: "#fff", textShadow: "0 2px 10px rgba(0,0,0,0.4)" },
    container: { padding: "40px 32px", maxWidth: "900px", margin: "0 auto", background: "#F8F4E3" },
    title: { fontSize: "28px", fontWeight: "bold", color: "#1B1B1B", marginBottom: "24px" },
    card: { background: "#fff", border: "1px solid #e0e0e0", borderRadius: "12px", padding: "28px", marginBottom: "20px" },
    subtitle: { fontSize: "18px", fontWeight: "bold", color: "#2e7d32", marginBottom: "12px" },
    text: { fontSize: "14px", color: "#555", lineHeight: "1.8", marginBottom: "16px" },
    list: { fontSize: "14px", color: "#555", lineHeight: "2", paddingLeft: "20px" },
    equipeGrid: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "16px", marginTop: "16px" },
    membreCard: { textAlign: "center", padding: "16px", background: "#F8F4E3", borderRadius: "10px", border: "1px solid #e0e0e0" },
    membreCardSpecial: { border: "2px solid #2D6A4F", background: "#f1f8e9" },
    avatar: { width: "56px", height: "56px", borderRadius: "50%", background: "#2D6A4F", color: "#fff", fontSize: "16px", fontWeight: "bold", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" },
    avatarSpecial: { background: "#2e7d32", width: "64px", height: "64px", fontSize: "18px" },
    membreNom: { fontSize: "13px", fontWeight: "bold", color: "#222", marginBottom: "4px" },
    membreRole: { fontSize: "12px", color: "#888" },
    stagiaireBadge: { marginTop: "8px", background: "#2D6A4F", color: "#fff", fontSize: "10px", padding: "2px 10px", borderRadius: "20px", display: "inline-block" },
    devise: { background: "#e8f5e9", borderLeft: "4px solid #2D6A4F", padding: "20px 24px", borderRadius: "0 10px 10px 0", marginBottom: "20px" },
    deviseText: { fontSize: "14px", color: "#2e7d32", fontStyle: "italic", lineHeight: "1.8" },
    infoCard: { background: "#fff", border: "1px solid #e0e0e0", borderRadius: "12px", padding: "28px", marginBottom: "20px" },
    infoGrid: { display: "flex", flexDirection: "column", gap: "16px" },
    infoItem: { display: "flex", gap: "14px", alignItems: "flex-start" },
    infoIconBox: { background: "#e8f5e9", color: "#2e7d32", fontWeight: "bold", fontSize: "10px", padding: "6px 8px", borderRadius: "6px", flexShrink: 0 },
    infoLabel: { fontSize: "12px", color: "#2D6A4F", fontWeight: "bold", marginBottom: "4px" },
    infoValue: { fontSize: "14px", color: "#555" },
    infoLink: { fontSize: "14px", color: "#2D6A4F", textDecoration: "none" }
};

export default About;
