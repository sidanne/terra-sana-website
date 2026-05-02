import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProjects } from "../services/api";

function Home({ lang }) {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        getProjects().then(data => setProjects(data.slice(0, 6)));
    }, []);

    const t = {
        fr: { badge: "Association a but non lucratif - Bruxelles", title1: "Bienvenue sur", title2: "Terra Sana", desc: "Plateforme centrale de association. Acces a tous nos projets et decouvrez notre mission.", btn1: "Voir les projets", btn2: "En savoir plus", stat1: "Projets actifs", stat2: "Fondee a Bruxelles", stat3: "Non lucratif", sec1: "Nos projets et applications", sec1sub: "Acces direct aux outils developpes par equipe", open: "Ouvrir", doc: "Doc", who: "Qui sommes-nous ?", whoDesc: "Organisation a but non lucratif fondee en 2019 a Bruxelles.", more: "En savoir plus" },
        en: { badge: "Non-profit organization - Brussels", title1: "Welcome to", title2: "Terra Sana", desc: "Central platform of the association. Access all our projects and discover our mission.", btn1: "See projects", btn2: "Learn more", stat1: "Active projects", stat2: "Founded in Brussels", stat3: "Non-profit", sec1: "Our projects and applications", sec1sub: "Direct access to tools developed by the team", open: "Open", doc: "Doc", who: "Who are we?", whoDesc: "Non-profit organization founded in 2019 in Brussels.", more: "Learn more" },
        nl: { badge: "Non-profitorganisatie - Brussel", title1: "Welkom bij", title2: "Terra Sana", desc: "Centraal platform van de vereniging. Toegang tot al onze projecten en ontdek onze missie.", btn1: "Zie projecten", btn2: "Meer info", stat1: "Actieve projecten", stat2: "Opgericht in Brussel", stat3: "Non-profit", sec1: "Onze projecten en applicaties", sec1sub: "Directe toegang tot tools ontwikkeld door het team", open: "Openen", doc: "Doc", who: "Wie zijn wij?", whoDesc: "Non-profitorganisatie opgericht in 2019 in Brussel.", more: "Meer info" }
    }[lang] || { badge: "Association a but non lucratif - Bruxelles", title1: "Bienvenue sur", title2: "Terra Sana", desc: "Plateforme centrale de association.", btn1: "Voir les projets", btn2: "En savoir plus", stat1: "Projets actifs", stat2: "Fondee a Bruxelles", stat3: "Non lucratif", sec1: "Nos projets et applications", sec1sub: "Acces direct aux outils", open: "Ouvrir", doc: "Doc", who: "Qui sommes-nous ?", whoDesc: "Organisation a but non lucratif fondee en 2019.", more: "En savoir plus" };

    return (
        <div>
            <div style={styles.hero}>
                <div style={styles.badge}>{t.badge}</div>
                <h1 style={styles.heroTitle}>{t.title1} <span style={styles.green}>{t.title2}</span></h1>
                <p style={styles.heroText}>{t.desc}</p>
                <div style={styles.heroBtns}>
                    <Link to="/projects" style={styles.btnGreen}>{t.btn1}</Link>
                    <Link to="/about" style={styles.btnOutline}>{t.btn2}</Link>
                </div>
            </div>
            <div style={styles.statsSection}>
                <div style={styles.stats}>
                    <div style={styles.stat}><div style={styles.statNum}>12+</div><div style={styles.statLbl}>{t.stat1}</div></div>
                    <div style={styles.stat}><div style={styles.statNum}>2019</div><div style={styles.statLbl}>{t.stat2}</div></div>
                    <div style={styles.stat}><div style={styles.statNum}>100%</div><div style={styles.statLbl}>{t.stat3}</div></div>
                </div>
                <h2 style={styles.sectionTitle}>{t.sec1}</h2>
                <p style={styles.sectionSub}>{t.sec1sub}</p>
                <div style={styles.grid}>
                    {projects.map(p => (
                        <div key={p.id} style={styles.card}>
                            <div style={styles.cardName}>{p.name}</div>
                            <div style={styles.cardDesc}>{p.description}</div>
                            <div style={styles.cardLinks}>
                                {p.link && <a href={p.link} style={styles.cardLink} target="_blank" rel="noreferrer">{t.open}</a>}
                                {p.documentationLink && <a href={p.documentationLink} style={styles.cardLink} target="_blank" rel="noreferrer">{t.doc}</a>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div style={styles.aboutStrip}>
                <div>
                    <h2 style={styles.aboutTitle}>{t.who}</h2>
                    <p style={styles.aboutText}>{t.whoDesc}</p>
                </div>
                <Link to="/about" style={styles.btnOutlineGreen}>{t.more}</Link>
            </div>
        </div>
    );
}

const styles = {
    hero: { background: "#1a1a1a", padding: "60px 40px", textAlign: "center" },
    badge: { display: "inline-block", background: "#2e7d32", color: "#a5d6a7", fontSize: "12px", padding: "5px 16px", borderRadius: "20px", marginBottom: "18px" },
    heroTitle: { color: "#fff", fontSize: "34px", fontWeight: "bold", marginBottom: "14px" },
    green: { color: "#4caf50" },
    heroText: { color: "#999", fontSize: "14px", lineHeight: "1.8", maxWidth: "560px", margin: "0 auto 28px" },
    heroBtns: { display: "flex", gap: "14px", justifyContent: "center" },
    btnGreen: { background: "#4caf50", color: "#fff", fontSize: "13px", padding: "12px 28px", borderRadius: "8px", textDecoration: "none" },
    btnOutline: { background: "transparent", color: "#ccc", fontSize: "13px", padding: "12px 28px", borderRadius: "8px", border: "1.5px solid #444", textDecoration: "none" },
    statsSection: { background: "#fff", padding: "36px 32px" },
    stats: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "16px", marginBottom: "36px" },
    stat: { background: "#f5f5f5", borderRadius: "10px", padding: "18px", textAlign: "center" },
    statNum: { fontSize: "28px", fontWeight: "bold", color: "#2e7d32" },
    statLbl: { fontSize: "12px", color: "#888", marginTop: "4px" },
    sectionTitle: { fontSize: "20px", fontWeight: "bold", color: "#222", marginBottom: "6px" },
    sectionSub: { fontSize: "13px", color: "#888", marginBottom: "22px" },
    grid: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "14px" },
    card: { background: "#fff", border: "1px solid #e0e0e0", borderRadius: "10px", padding: "16px" },
    cardName: { fontSize: "13px", fontWeight: "bold", color: "#222", marginBottom: "6px" },
    cardDesc: { fontSize: "12px", color: "#888", lineHeight: "1.5", marginBottom: "12px" },
    cardLinks: { display: "flex", gap: "8px" },
    cardLink: { fontSize: "11px", color: "#2e7d32", border: "1px solid #a5d6a7", borderRadius: "4px", padding: "4px 10px", textDecoration: "none" },
    aboutStrip: { background: "#1a1a1a", padding: "32px 40px", display: "flex", alignItems: "center", justifyContent: "space-between" },
    aboutTitle: { color: "#fff", fontSize: "18px", fontWeight: "bold", marginBottom: "8px" },
    aboutText: { color: "#999", fontSize: "13px", lineHeight: "1.7", maxWidth: "500px" },
    btnOutlineGreen: { background: "transparent", color: "#4caf50", fontSize: "13px", padding: "10px 22px", borderRadius: "8px", border: "1.5px solid #4caf50", textDecoration: "none", whiteSpace: "nowrap" }
};

export default Home;
