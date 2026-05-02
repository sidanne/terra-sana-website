import { useEffect, useState } from "react";
import { getPosts } from "../services/api";

function Blog({ lang }) {
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(0);
    const perPage = 5;

    useEffect(() => {
        getPosts().then(data => setPosts(data));
    }, []);

    const t = {
        fr: { title: "Blog", sub: "Actualites et publications de association", empty: "Aucun article publie pour le moment.", prev: "Precedent", next: "Suivant" },
        en: { title: "Blog", sub: "News and publications from the association", empty: "No articles published yet.", prev: "Previous", next: "Next" },
        nl: { title: "Blog", sub: "Nieuws en publicaties van de vereniging", empty: "Nog geen artikelen gepubliceerd.", prev: "Vorige", next: "Volgende" }
    }[lang] || { title: "Blog", sub: "Actualites", empty: "Aucun article.", prev: "Precedent", next: "Suivant" };

    const paginated = posts.slice(page * perPage, (page + 1) * perPage);
    const totalPages = Math.ceil(posts.length / perPage);

    const formatDate = (date) => {
        if (!date) return "";
        return new Date(date).toLocaleDateString(lang === "fr" ? "fr-BE" : lang === "en" ? "en-GB" : "nl-BE", { day: "numeric", month: "long", year: "numeric" });
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>{t.title}</h1>
            <p style={styles.sub}>{t.sub}</p>
            {posts.length === 0 ? (
                <div style={styles.empty}>{t.empty}</div>
            ) : (
                <>
                    <div style={styles.list}>
                        {paginated.map(p => (
                            <div key={p.id} style={styles.card}>
                                <div style={styles.postDate}>{formatDate(p.createdAt)}</div>
                                <div style={styles.postTitle}>{p.title}</div>
                                <div style={styles.postContent}>{p.content}</div>
                            </div>
                        ))}
                    </div>
                    {totalPages > 1 && (
                        <div style={styles.pagination}>
                            <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} style={styles.pageBtn}>{t.prev}</button>
                            <span style={styles.pageInfo}>{page + 1} / {totalPages}</span>
                            <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page === totalPages - 1} style={styles.pageBtn}>{t.next}</button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

const styles = {
    container: { padding: "40px 32px", maxWidth: "800px", margin: "0 auto" },
    title: { fontSize: "28px", fontWeight: "bold", color: "#1a1a1a", marginBottom: "8px" },
    sub: { fontSize: "14px", color: "#888", marginBottom: "28px" },
    empty: { textAlign: "center", color: "#aaa", fontSize: "14px", padding: "60px" },
    list: { display: "flex", flexDirection: "column", gap: "20px" },
    card: { background: "#fff", border: "1px solid #e0e0e0", borderRadius: "12px", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" },
    postDate: { fontSize: "12px", color: "#4caf50", marginBottom: "8px" },
    postTitle: { fontSize: "18px", fontWeight: "bold", color: "#222", marginBottom: "12px" },
    postContent: { fontSize: "14px", color: "#555", lineHeight: "1.8" },
    pagination: { display: "flex", justifyContent: "center", alignItems: "center", gap: "16px", marginTop: "32px" },
    pageBtn: { background: "#4caf50", color: "#fff", border: "none", padding: "8px 20px", borderRadius: "8px", cursor: "pointer", fontSize: "13px" },
    pageInfo: { fontSize: "14px", color: "#555" }
};

export default Blog;
