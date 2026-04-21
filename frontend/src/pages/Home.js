import { useEffect, useState } from "react";
import { getProjects } from "../services/api";
import { Link } from "react-router-dom";

function Home() {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        getProjects().then(data => setProjects(data.slice(0, 6)));
    }, []);

    return (
        <div>
            <div style={styles.hero}>
                <div style={styles.badge}>Association a but non lucratif - Bruxelles</div>
                <h1 style={styles.heroTitle}>Bienvenue sur <span style={styles.green}>Terra Sana</span></h1>
                <p style={styles.heroText}>Plateforme centrale de association. Acces a tous nos projets et decouvrez notre mission.</p>
                <div style={styles.heroBtns}>
                    <Link to="/projects" style={styles.btnGreen}>Voir les projets</Link>
                    <Link to="/about" style={styles.btnOutline}>En savoir plus</Link>
                </div>
            </div>
            <div style={styles.statsSection}>
                <div style={styles.stats}>
                    <div style={styles.stat}><div style={styles.statNum}>12+</div><div style={styles.statLbl}>Projets actifs</div></div>
                    <div style={styles.stat}><div style={styles.statNum}>2019</div><div style={styles.statLbl}>Fondee a Bruxelles</div></div>
                    <div style={styles.stat}><div style={styles.statNum}>100%</div><div style={styles.statLbl}>Non lucratif</div></div>
                </div>
                <h2 style={styles.sectionTitle}>Nos projets et applications</h2>
                <p style={styles.sectionSub}>Acces direct aux outils developpes par equipe</p>
                <div style={styles.grid}>
                    {projects.map(p => (
                        <div key={p.id} style={styles.card}>
                            <div style={styles.cardName}>{p.name}</div>
                            <div style={styles.cardDesc}>{p.description}</div>
                            <div style={styles.cardLinks}>
                                <a href={p.link} style={styles.cardLink} target="_blank" rel="noreferrer">Ouvrir</a>
                                {p.documentationLink && <a href={p.documentationLink} style={styles.cardLink} target="_blank" rel="noreferrer">Doc</a>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div style={styles.aboutStrip}>
                <div>
                    <h2 style={styles.aboutTitle}>Qui sommes-nous ?</h2>
                    <p style={styles.aboutText}>Organisation a but non lucratif fondee en 2019 a Bruxelles.</p>
                </div>
                <Link to="/about" style={styles.btnOutlineGreen}>En savoir plus</Link>
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
