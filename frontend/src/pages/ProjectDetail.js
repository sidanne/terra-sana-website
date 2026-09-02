import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProjects } from "../services/api";

function ProjectDetail({ lang }) {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        getProjects()
            .then(data => {
                const found = Array.isArray(data)
                    ? data.find(p => String(p.id) === id)
                    : null;
                setProject(found || null);
                if (!found) setError(true);
            })
            .catch(() => setError(true))
            .finally(() => setLoading(false));
    }, [id]);

    const translations = {
        fr: {
            title: "Détail du projet",
            notFound: "Projet introuvable.",
            back: "Retour aux projets",
            category: "Catégorie",
            status: "Statut",
            open: "Ouvrir le projet",
            active: "Actif",
            inactive: "Inactif"
        },
        en: {
            title: "Project detail",
            notFound: "Project not found.",
            back: "Back to projects",
            category: "Category",
            status: "Status",
            open: "Open project",
            active: "Active",
            inactive: "Inactive"
        },
        nl: {
            title: "Projectdetails",
            notFound: "Project niet gevonden.",
            back: "Terug naar projecten",
            category: "Categorie",
            status: "Status",
            open: "Project openen",
            active: "Actief",
            inactive: "Inactief"
        }
    };

    const t = translations[lang] || translations.fr;

    if (loading) {
        return (
            <div style={styles.container}>
                <h1 style={styles.title}>{t.title}</h1>
                <p>Loading...</p>
            </div>
        );
    }

    if (error || !project) {
        return (
            <div style={styles.container}>
                <h1 style={styles.title}>{t.title}</h1>
                <p style={styles.message}>{t.notFound}</p>
                <button style={styles.button} onClick={() => navigate("/projects")}>{t.back}</button>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>{project.name}</h1>
            <p style={styles.sub}>{project.description}</p>

            <div style={styles.detailRow}>
                <span style={styles.label}>{t.category}:</span>
                <span>{project.category || "—"}</span>
            </div>
            <div style={styles.detailRow}>
                <span style={styles.label}>{t.status}:</span>
                <span>{project.isActive ? t.active : t.inactive}</span>
            </div>
            {project.link && (
                <a href={project.link} target="_blank" rel="noreferrer" style={styles.link}>
                    {t.open}
                </a>
            )}

            <button style={styles.button} onClick={() => navigate("/projects")}>{t.back}</button>
        </div>
    );
}

const styles = {
    container: { padding: "40px 32px", minHeight: "100vh", background: "#F8F4E3", color: "#222" },
    title: { fontSize: "28px", fontWeight: "700", marginBottom: "12px" },
    sub: { fontSize: "15px", marginBottom: "24px", color: "#555", maxWidth: "760px" },
    detailRow: { display: "flex", gap: "8px", marginBottom: "10px", fontSize: "14px" },
    label: { fontWeight: "700" },
    button: { marginTop: "24px", padding: "10px 18px", fontSize: "14px", background: "#2D6A4F", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer" },
    link: { display: "inline-block", marginTop: "12px", color: "#fff", background: "#2e7d32", padding: "10px 18px", borderRadius: "8px", textDecoration: "none" },
    message: { margin: "16px 0", color: "#a00" }
};

export default ProjectDetail;
