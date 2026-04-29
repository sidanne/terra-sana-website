import { useEffect, useState } from "react";
import { getProjects } from "../services/api";

function Projects() {
    const [projects, setProjects] = useState([]);
    const [page, setPage] = useState(0);
    const perPage = 6;

    useEffect(() => {
        getProjects().then(data => setProjects(data));
    }, []);

    const paginated = projects.slice(page * perPage, (page + 1) * perPage);
    const totalPages = Math.ceil(projects.length / perPage);

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>Nos projets & applications</h1>
                <p style={styles.sub}>Cliquez sur un projet pour y acceder directement</p>
            </div>
            <div style={styles.grid}>
                {paginated.map(p => (
                    <div key={p.id} style={styles.card}>
                        <div style={styles.cardTop}>
                            <div style={styles.category}>{p.category}</div>
                            <div style={p.isActive ? styles.active : styles.inactive}>
                                {p.isActive ? "Actif" : "Inactif"}
                            </div>
                        </div>
                        <div style={styles.name}>{p.name}</div>
                        <div style={styles.desc}>{p.description}</div>
                        <div style={styles.links}>
                            {p.link && <a href={p.link} style={styles.btnGreen} target="_blank" rel="noreferrer">Ouvrir</a>}
                            {p.documentationLink && <a href={p.documentationLink} style={styles.btnOutline} target="_blank" rel="noreferrer">Documentation</a>}
                        </div>
                    </div>
                ))}
            </div>
            {totalPages > 1 && (
                <div style={styles.pagination}>
                    <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} style={styles.pageBtn}>Precedent</button>
                    <span style={styles.pageInfo}>{page + 1} / {totalPages}</span>
                    <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page === totalPages - 1} style={styles.pageBtn}>Suivant</button>
                </div>
            )}
        </div>
    );
}

const styles = {
    container: { padding: "40px 32px", background: "#f9f9f9", minHeight: "100vh" },
    header: { marginBottom: "28px" },
    title: { fontSize: "28px", fontWeight: "bold", color: "#1a1a1a", marginBottom: "8px" },
    sub: { fontSize: "14px", color: "#888" },
    grid: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "20px" },
    card: { background: "#fff", border: "1px solid #e0e0e0", borderRadius: "12px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" },
    cardTop: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" },
    category: { fontSize: "11px", color: "#4caf50", background: "#e8f5e9", padding: "3px 10px", borderRadius: "20px" },
    active: { fontSize: "11px", color: "#2e7d32", background: "#e8f5e9", padding: "3px 10px", borderRadius: "20px" },
    inactive: { fontSize: "11px", color: "#c62828", background: "#ffebee", padding: "3px 10px", borderRadius: "20px" },
    name: { fontSize: "15px", fontWeight: "bold", color: "#222", marginBottom: "8px" },
    desc: { fontSize: "13px", color: "#888", lineHeight: "1.6", marginBottom: "14px" },
    links: { display: "flex", gap: "10px", flexWrap: "wrap" },
    btnGreen: { background: "#4caf50", color: "#fff", fontSize: "12px", padding: "8px 16px", borderRadius: "6px", textDecoration: "none" },
    btnOutline: { background: "transparent", color: "#2e7d32", fontSize: "12px", padding: "8px 16px", borderRadius: "6px", border: "1px solid #a5d6a7", textDecoration: "none" },
    pagination: { display: "flex", justifyContent: "center", alignItems: "center", gap: "16px", marginTop: "32px" },
    pageBtn: { background: "#4caf50", color: "#fff", border: "none", padding: "8px 20px", borderRadius: "8px", cursor: "pointer", fontSize: "13px" },
    pageInfo: { fontSize: "14px", color: "#555" }
};

export default Projects;
