import { useEffect, useState } from "react";
import { getPosts } from "../services/api";

function Blog({ lang }) {
    const [posts, setPosts] = useState([]);
    const [expanded, setExpanded] = useState({});
    const [page, setPage] = useState(0);
    const perPage = 5;

    useEffect(() => {
        getPosts().then(data => setPosts(data));
    }, []);

    const t = {
        fr: { title: "Blog", sub: "Actualites et publications de association", empty: "Aucun article publie pour le moment.", prev: "Precedent", next: "Suivant", readMore: "Lire la suite", readLess: "Reduire", by: "Publie le" },
        en: { title: "Blog", sub: "News and publications from the association", empty: "No articles published yet.", prev: "Previous", next: "Next", readMore: "Read more", readLess: "Show less", by: "Published on" },
        nl: { title: "Blog", sub: "Nieuws en publicaties van de vereniging", empty: "Nog geen artikelen gepubliceerd.", prev: "Vorige", next: "Volgende", readMore: "Meer lezen", readLess: "Minder tonen", by: "Gepubliceerd op" }
    }[lang] || { title: "Blog", sub: "Actualites", empty: "Aucun article.", prev: "Precedent", next: "Suivant", readMore: "Lire la suite", readLess: "Reduire", by: "Publie le" };

    const paginated = posts.slice(page * perPage, (page + 1) * perPage);
    const totalPages = Math.ceil(posts.length / perPage);
    const PREVIEW_LENGTH = 150;

    const formatDate = (date) => {
        if (!date) return "";
        return new Date(date).toLocaleDateString(
            lang === "fr" ? "fr-BE" : lang === "en" ? "en-GB" : "nl-BE",
            { day: "numeric", month: "long", year: "numeric" }
        );
    };

    const toggleExpand = (id) => {
        setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <div style={styles.page}>
            <div style={styles.hero}>
                <h1 style={styles.title}>{t.title}</h1>
                <p style={styles.sub}>{t.sub}</p>
            </div>
            <div style={styles.container}>

            {posts.length === 0 ? (
                <div style={styles.empty}>{t.empty}</div>
            ) : (
                <>
                    <div style={styles.list}>
                        {paginated.map(p => {
                            const isLong = p.content && p.content.length > PREVIEW_LENGTH;
                            const isExpanded = expanded[p.id];
                            const displayContent = isLong && !isExpanded
                                ? p.content.substring(0, PREVIEW_LENGTH) + "..."
                                : p.content;

                            return (
                                <div key={p.id} style={{ ...styles.card, ...(p.image ? styles.cardWithImg : {}) }}>
                                    {p.image && (
                                        <div style={styles.postImgWrap}>
                                            <img src={p.image} alt={p.title} style={styles.postImg} />
                                        </div>
                                    )}
                                    <div style={styles.cardBody}>
                                        <div style={styles.cardHeader}>
                                            <div style={styles.dateBadge}>{formatDate(p.createdAt)}</div>
                                        </div>
                                        <div style={styles.postTitle}>{p.title}</div>
                                        <div style={styles.postContent}>{displayContent}</div>
                                        {isLong && (
                                            <button
                                                onClick={() => toggleExpand(p.id)}
                                                style={styles.readMoreBtn}>
                                                {isExpanded ? t.readLess : t.readMore}
                                                <span style={styles.readMoreIcon}>{isExpanded ? " ?" : " ?"}</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
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
    container: { padding: "40px 32px", maxWidth: "800px", margin: "0 auto" },
    title: { fontSize: "28px", fontWeight: "bold", color: "#fff", marginBottom: "8px", textShadow: "0 2px 10px rgba(0,0,0,0.4)" },
    sub: { fontSize: "14px", color: "#e8e8e0", marginBottom: "28px" },
    empty: { textAlign: "center", color: "#aaa", fontSize: "14px", padding: "60px", background: "#fff", borderRadius: "12px", border: "1px solid #e0e0e0" },
    list: { display: "flex", flexDirection: "column", gap: "20px" },
    card: { background: "#fff", border: "1px solid #e0e0e0", borderRadius: "12px", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" },
    cardWithImg: { display: "flex", flexWrap: "wrap" },
    postImgWrap: { flex: "0 0 220px", minHeight: "160px" },
    postImg: { width: "100%", height: "100%", objectFit: "cover", display: "block" },
    cardBody: { padding: "28px", flex: "1 1 300px" },
    cardHeader: { marginBottom: "12px" },
    dateBadge: { display: "inline-block", fontSize: "12px", color: "#2D6A4F", background: "#e8f5e9", padding: "4px 12px", borderRadius: "20px", fontWeight: "600" },
    postTitle: { fontSize: "20px", fontWeight: "bold", color: "#1B1B1B", marginBottom: "12px", lineHeight: "1.3" },
    postContent: { fontSize: "14px", color: "#555", lineHeight: "1.8", marginBottom: "12px" },
    readMoreBtn: { background: "none", border: "none", cursor: "pointer", color: "#2D6A4F", fontSize: "13px", fontWeight: "600", padding: 0, display: "flex", alignItems: "center" },
    readMoreIcon: { fontSize: "11px" },
    pagination: { display: "flex", justifyContent: "center", alignItems: "center", gap: "16px", marginTop: "32px" },
    pageBtn: { background: "#2D6A4F", color: "#fff", border: "none", padding: "8px 20px", borderRadius: "8px", cursor: "pointer", fontSize: "13px" },
    pageInfo: { fontSize: "14px", color: "#555" }
};

export default Blog;
