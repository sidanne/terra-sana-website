import { useEffect, useState } from "react";
import { getProjects } from "../services/api";

function Projects() {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        getProjects().then(data => setProjects(data));
    }, []);

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Nos projets et applications</h1>
            <p style={styles.sub}>Cliquez sur un projet pour y acceder directement</p>
            <div style={styles.grid}>
                {projects.map(p => (
                    <div key={p.id} style={styles.card}>
                        <div style={styles.category}>{p.category}</div>
                        <div style={styles.name}>{p.name}</div>
                        <div style={styles.desc}>{p.description}</div>
                        <div style={styles.links}>
                            {p.link && (
                                <a href={p.link} style={styles.btnGreen} target="_blank" rel="noreferrer">
                                    Ouvrir application
                                </a>
                            )}
                            {p.documentationLink && (
                                <a href={p.documentationLink} style={styles.btnOutline} target="_blank" rel="noreferrer">
                                    Documentation
                                </a>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

const styles = {
    container: { padding: "40px 32px", background: "#f9f9f9", minHeight: "100vh" },
    title: { fontSize: "28px", fontWeight: "bold", color: "#1a1a1a", marginBottom: "8px" },
    sub: { fontSize: "14px", color: "#888", marginBottom: "28px" },
    grid: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "20px" },
    card: { background: "#fff", border: "1px solid #e0e0e0", borderRadius: "10px", padding: "20px", transition: "box-shadow 0.2s" },
    category: { fontSize: "11px", color: "#4caf50", background: "#e8f5e9", padding: "3px 10px", borderRadius: "20px", display: "inline-block", marginBottom: "10px" },
    name: { fontSize: "15px", fontWeight: "bold", color: "#222", marginBottom: "8px" },
    desc: { fontSize: "13px", color: "#888", lineHeight: "1.6", marginBottom: "14px" },
    links: { display: "flex", gap: "10px", flexWrap: "wrap" },
    btnGreen: { background: "#4caf50", color: "#fff", fontSize: "12px", padding: "8px 16px", borderRadius: "6px", textDecoration: "none" },
    btnOutline: { background: "transparent", color: "#2e7d32", fontSize: "12px", padding: "8px 16px", borderRadius: "6px", border: "1px solid #a5d6a7", textDecoration: "none" }
};

export default Projects;
