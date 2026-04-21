import { useEffect, useState } from "react";
import { getPosts } from "../services/api";

function Blog() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        getPosts().then(data => setPosts(data));
    }, []);

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Blog</h1>
            <p style={styles.sub}>Actualites et publications de association</p>
            {posts.length === 0 ? (
                <div style={styles.empty}>Aucun article publie pour le moment.</div>
            ) : (
                <div style={styles.list}>
                    {posts.map(p => (
                        <div key={p.id} style={styles.card}>
                            <div style={styles.postTitle}>{p.title}</div>
                            <div style={styles.postContent}>{p.content}</div>
                        </div>
                    ))}
                </div>
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
    card: { background: "#fff", border: "1px solid #e0e0e0", borderRadius: "10px", padding: "24px" },
    postTitle: { fontSize: "18px", fontWeight: "bold", color: "#222", marginBottom: "12px" },
    postContent: { fontSize: "14px", color: "#555", lineHeight: "1.8" }
};

export default Blog;
