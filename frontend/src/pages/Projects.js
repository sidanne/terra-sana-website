import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProjects } from "../services/api";

function Projects({ lang }) {
    const [projects, setProjects] = useState([]);
    const [search, setSearch] = useState("");
    const [categorie, setCategorie] = useState("Toutes les categories");
    const [page, setPage] = useState(0);
    const perPage = 6;
    const navigate = useNavigate();

    useEffect(() => {
        getProjects().then(data => setProjects(data));
    }, []);

    const t = {
        fr: { title: "Nos projets et applications", sub: "Recherchez et filtrez les applications de association", search: "Rechercher un projet...", all: "Toutes les categories", open: "Ouvrir", detail: "Detail", prev: "Precedent", next: "Suivant", active: "Actif", inactive: "Inactif", noResult: "Aucun projet ne correspond a votre recherche." },
        en: { title: "Our projects", sub: "Search and filter", search: "Search...", all: "All categories", open: "Open", detail: "Detail", prev: "Previous", next: "Next", active: "Active", inactive: "Inactive", noResult: "No project found." },
        nl: { title: "Onze projecten", sub: "Zoek en filter", search: "Zoeken...", all: "Alle categorieen", open: "Openen", detail: "Detail", prev: "Vorige", next: "Volgende", active: "Actief", inactive: "Inactief", noResult: "Geen project gevonden." }
    }[lang] || { title: "Nos projets", sub: "Recherchez", search: "Rechercher...", all: "Toutes", open: "Ouvrir", detail: "Detail", prev: "Precedent", next: "Suivant", active: "Actif", inactive: "Inactif", noResult: "Aucun resultat." };

    const categories = ["Toutes les categories", ...new Set(projects.map(p => p.category).filter(Boolean))];

    const filtered = projects.filter(p => {
        const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
            (p.description && p.description.toLowerCase().includes(search.toLowerCase()));
        const matchCat = categorie === "Toutes les categories" || p.category === categorie;
        return matchSearch && matchCat;
    });

    const totalPages = Math.ceil(filtered.length / perPage);
    const paginated = filtered.slice(page * perPage, (page + 1) * perPage);

    const handleSearch = (val) => { setSearch(val); setPage(0); };
    const handleCat = (val) => { setCategorie(val); setPage(0); };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>{t.title}</h1>
            <p style={styles.sub}>{t.sub}</p>

            <div style={styles.filters}>
                <div style={styles.searchBox}>
                    <span style={styles.searchIcon}>??</span>
                    <input type="text" placeholder={t.search} value={search}
                        onChange={e => handleSearch(e.target.value)} style={styles.searchInput} />
                    {search && <button onClick={() => handleSearch("")} style={styles.clearBtn}>X</button>}
                </div>
                <select value={categorie} onChange={e => handleCat(e.target.value)} style={styles.select}>
                    {categories.map((c, i) => <option key={i} value={c}>{c}</option>)}
                </select>
            </div>

            {search && <div style={styles.resultInfo}>{filtered.length} resultat(s) pour "{search}"</div>}

            {paginated.length === 0 ? (
                <div style={styles.noResult}>{t.noResult}</div>
            ) : (
                <div style={styles.grid}>
                    {paginated.map(p => (
                        <div key={p.id} style={styles.card}>
                            <div style={styles.cardTop}>
                                <div style={styles.category}>{p.category}</div>
                                <div style={p.isActive ? styles.active : styles.inactive}>
                                    {p.isActive ? t.active : t.inactive}
                                </div>
                            </div>
                            <div style={styles.name}>{p.name}</div>
                            <div style={styles.desc}>{p.description}</div>
                            <div style={styles.links}>
                                {p.link && (
                                    <a href={p.link} style={styles.btnGreen} target="_blank" rel="noreferrer"
                                        onClick={e => e.stopPropagation()}>
                                        {t.open}
                                    </a>
                                )}
                                <button onClick={() => navigate(`/projects/${p.id}`)} style={styles.btnDetail}>
                                    {t.detail}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {totalPages > 1 && (
                <div style={styles.pagination}>
                    <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} style={styles.pageBtn}>{t.prev}</button>
                    <span style={styles.pageInfo}>{page + 1} / {totalPages}</span>
                    <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page === totalPages - 1} style={styles.pageBtn}>{t.next}</button>
                </div>
            )}
        </div>
    );
}

const styles = {
    container: { padding: "40px 32px", background: "#f9f9f9", minHeight: "100vh" },
    title: { fontSize: "28px", fontWeight: "bold", color: "#1a1a1a", marginBottom: "8px" },
    sub: { fontSize: "14px", color: "#888", marginBottom: "24px" },
    filters: { display: "flex", gap: "14px", marginBottom: "20px", flexWrap: "wrap" },
    searchBox: { display: "flex", alignItems: "center", gap: "8px", background: "#fff", border: "1px solid #ddd", borderRadius: "8px", padding: "0 12px", flex: 1, minWidth: "240px" },
    searchIcon: { fontSize: "16px", opacity: 0.5 },
    searchInput: { border: "none", outline: "none", fontSize: "14px", padding: "10px 0", flex: 1, background: "transparent" },
    clearBtn: { background: "none", border: "none", cursor: "pointer", fontSize: "13px", color: "#999", padding: "4px 8px" },
    select: { padding: "10px 14px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "14px", background: "#fff", cursor: "pointer", outline: "none", minWidth: "180px" },
    resultInfo: { fontSize: "13px", color: "#4caf50", fontWeight: "600", marginBottom: "16px" },
    noResult: { textAlign: "center", color: "#aaa", fontSize: "14px", padding: "60px", background: "#fff", borderRadius: "12px", border: "1px solid #e0e0e0" },
    grid: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "20px" },
    card: { background: "#fff", border: "1px solid #e0e0e0", borderRadius: "12px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", transition: "transform 0.2s" },
    cardTop: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" },
    category: { fontSize: "11px", color: "#4caf50", background: "#e8f5e9", padding: "3px 10px", borderRadius: "20px" },
    active: { fontSize: "11px", color: "#2e7d32", background: "#e8f5e9", padding: "3px 10px", borderRadius: "20px" },
    inactive: { fontSize: "11px", color: "#c62828", background: "#ffebee", padding: "3px 10px", borderRadius: "20px" },
    name: { fontSize: "15px", fontWeight: "bold", color: "#222", marginBottom: "8px" },
    desc: { fontSize: "13px", color: "#888", lineHeight: "1.6", marginBottom: "14px" },
    links: { display: "flex", gap: "10px", flexWrap: "wrap" },
    btnGreen: { background: "#4caf50", color: "#fff", fontSize: "12px", padding: "8px 16px", borderRadius: "6px", textDecoration: "none" },
    btnDetail: { background: "transparent", color: "#2e7d32", fontSize: "12px", padding: "8px 16px", borderRadius: "6px", border: "1px solid #a5d6a7", cursor: "pointer" },
    pagination: { display: "flex", justifyContent: "center", alignItems: "center", gap: "16px", marginTop: "32px" },
    pageBtn: { background: "#4caf50", color: "#fff", border: "none", padding: "8px 20px", borderRadius: "8px", cursor: "pointer", fontSize: "13px" },
    pageInfo: { fontSize: "14px", color: "#555" }
};

export default Projects;
