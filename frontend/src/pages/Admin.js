import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isTokenValid, logout } from "../services/auth";
import MessageCard from "../components/MessageCard";

function Admin() {
    const [projects, setProjects] = useState([]);
    const [posts, setPosts] = useState([]);
    const [messages, setMessages] = useState([]);
    const [newProject, setNewProject] = useState({ name: "", description: "", link: "", category: "", isActive: true });
    const [newPost, setNewPost] = useState({ title: "", content: "", isPublished: true });
    const [editProject, setEditProject] = useState(null);
    const [editPost, setEditPost] = useState(null);
    const [replyMsg, setReplyMsg] = useState(null);
    const [replyText, setReplyText] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!isTokenValid()) { navigate("/login"); return; }
        fetchData();
        const interval = setInterval(() => {
            if (!isTokenValid()) { navigate("/login"); }
        }, 60000);
        return () => clearInterval(interval);
    }, []);

    const showSuccess = (msg) => {
        setSuccessMsg(msg);
        setTimeout(() => setSuccessMsg(""), 3000);
    };

    const fetchData = async () => {
        const headers = { Authorization: `Bearer ${token}` };
        const p = await fetch("http://localhost:8080/api/projects", { headers }).then(r => r.json());
        const b = await fetch("http://localhost:8080/api/posts", { headers }).then(r => r.json());
        const m = await fetch("http://localhost:8080/api/contact", { headers }).then(r => r.json());
        setProjects(p);
        setPosts(b);
        setMessages(m);
    };

    const addProject = async (e) => {
        e.preventDefault();
        await fetch("http://localhost:8080/api/projects", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify(newProject)
        });
        setNewProject({ name: "", description: "", link: "", category: "", isActive: true });
        fetchData();
        showSuccess("Projet ajoute avec succes !");
    };

    const updateProject = async (e) => {
        e.preventDefault();
        await fetch(`http://localhost:8080/api/projects/${editProject.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify(editProject)
        });
        setEditProject(null);
        fetchData();
        showSuccess("Projet modifie avec succes !");
    };

    const deleteProject = async (id) => {
        if (!window.confirm("Supprimer ce projet ?")) return;
        await fetch(`http://localhost:8080/api/projects/${id}`, {
            method: "DELETE", headers: { Authorization: `Bearer ${token}` }
        });
        fetchData();
        showSuccess("Projet supprime !");
    };

    const addPost = async (e) => {
        e.preventDefault();
        await fetch("http://localhost:8080/api/posts", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify(newPost)
        });
        setNewPost({ title: "", content: "", isPublished: true });
        fetchData();
        showSuccess("Article publie avec succes !");
    };

    const deletePost = async (id) => {
        if (!window.confirm("Supprimer cet article ?")) return;
        await fetch(`http://localhost:8080/api/posts/${id}`, {
            method: "DELETE", headers: { Authorization: `Bearer ${token}` }
        });
        fetchData();
        showSuccess("Article supprime !");
    };

    const updatePost = async (e) => {
        e.preventDefault();
        await fetch(`http://localhost:8080/api/posts/${editPost.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify(editPost)
        });
        setEditPost(null);
        fetchData();
        showSuccess("Article modifie avec succes !");
    };

    const deleteMessage = async (id) => {
        if (!window.confirm("Supprimer ce message ?")) return;
        await fetch(`http://localhost:8080/api/contact/${id}`, {
            method: "DELETE", headers: { Authorization: `Bearer ${token}` }
        });
        fetchData();
        showSuccess("Message supprime !");
    };

    const replyMessage = async (e) => {
        e.preventDefault();
        await fetch(`http://localhost:8080/api/contact/${replyMsg.id}/reply`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ reply: replyText })
        });
        setReplyMsg(null);
        setReplyText("");
        showSuccess("Reponse envoyee avec succes !");
    };

    const handleLogout = () => { logout(); navigate("/login"); };

    const formatDate = (date) => {
        if (!date) return "";
        return new Date(date).toLocaleDateString("fr-BE", {
            day: "numeric", month: "short", year: "numeric",
            hour: "2-digit", minute: "2-digit"
        });
    };

    return (
        <div style={styles.container}>

            {successMsg && (
                <div style={styles.successBanner}>{successMsg}</div>
            )}

            <div style={styles.header}>
                <div>
                    <h1 style={styles.title}>Espace Administrateur</h1>
                    <p style={styles.subtitle}>Gestion du contenu Terra Sana</p>
                </div>
                <button onClick={handleLogout} style={styles.logoutBtn}>Deconnexion</button>
            </div>

            <div style={styles.statsRow}>
                <div style={styles.statCard}>
                    <div style={styles.statNum}>{projects.length}</div>
                    <div style={styles.statLbl}>Projets</div>
                </div>
                <div style={styles.statCard}>
                    <div style={styles.statNum}>{posts.length}</div>
                    <div style={styles.statLbl}>Articles</div>
                </div>
                <div style={styles.statCard}>
                    <div style={{...styles.statNum, color: "#2e7d32"}}>{messages.length}</div>
                    <div style={styles.statLbl}>Messages</div>
                </div>
            </div>

            <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Ajouter un projet</h2>
                <form onSubmit={addProject} style={styles.form}>
                    <div style={styles.formGrid}>
                        <input placeholder="Nom du projet" value={newProject.name} onChange={e => setNewProject({...newProject, name: e.target.value})} style={styles.input} required />
                        <input placeholder="Categorie" value={newProject.category} onChange={e => setNewProject({...newProject, category: e.target.value})} style={styles.input} />
                    </div>
                    <input placeholder="Description" value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})} style={styles.input} required />
                    <input placeholder="Lien application (http://...)" value={newProject.link} onChange={e => setNewProject({...newProject, link: e.target.value})} style={styles.input} />
                    <button type="submit" style={styles.btn}>Ajouter le projet</button>
                </form>
            </div>

            {editProject && (
                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>Modifier le projet</h2>
                    <form onSubmit={updateProject} style={styles.form}>
                        <div style={styles.formGrid}>
                            <input placeholder="Nom" value={editProject.name} onChange={e => setEditProject({...editProject, name: e.target.value})} style={styles.input} required />
                            <input placeholder="Categorie" value={editProject.category || ""} onChange={e => setEditProject({...editProject, category: e.target.value})} style={styles.input} />
                        </div>
                        <input placeholder="Description" value={editProject.description} onChange={e => setEditProject({...editProject, description: e.target.value})} style={styles.input} />
                        <input placeholder="Lien" value={editProject.link || ""} onChange={e => setEditProject({...editProject, link: e.target.value})} style={styles.input} />
                        <div style={styles.formBtns}>
                            <button type="submit" style={styles.btn}>Sauvegarder</button>
                            <button type="button" onClick={() => setEditProject(null)} style={styles.cancelBtn}>Annuler</button>
                        </div>
                    </form>
                </div>
            )}

            <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Projets ({projects.length})</h2>
                <div style={styles.grid}>
                    {projects.map(p => (
                        <div key={p.id} style={styles.projectCard}>
                            <div style={styles.projectCat}>{p.category || "Sans categorie"}</div>
                            <div style={styles.cardName}>{p.name}</div>
                            <div style={styles.cardDesc}>{p.description}</div>
                            <div style={styles.cardBtns}>
                                <button onClick={() => setEditProject(p)} style={styles.editBtn}>Modifier</button>
                                <button onClick={() => deleteProject(p.id)} style={styles.deleteBtn}>Supprimer</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Publier un article</h2>
                <form onSubmit={addPost} style={styles.form}>
                    <input placeholder="Titre de article" value={newPost.title} onChange={e => setNewPost({...newPost, title: e.target.value})} style={styles.input} required />
                    <textarea placeholder="Contenu de article..." value={newPost.content} onChange={e => setNewPost({...newPost, content: e.target.value})} style={styles.textarea} required />
                    <button type="submit" style={styles.btn}>Publier</button>
                </form>
            </div>

            {editPost && (
                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>Modifier article</h2>
                    <form onSubmit={updatePost} style={styles.form}>
                        <input placeholder="Titre" value={editPost.title} onChange={e => setEditPost({...editPost, title: e.target.value})} style={styles.input} required />
                        <textarea placeholder="Contenu" value={editPost.content} onChange={e => setEditPost({...editPost, content: e.target.value})} style={styles.textarea} required />
                        <div style={styles.formBtns}>
                            <button type="submit" style={styles.btn}>Sauvegarder</button>
                            <button type="button" onClick={() => setEditPost(null)} style={styles.cancelBtn}>Annuler</button>
                        </div>
                    </form>
                </div>
            )}

            <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Articles ({posts.length})</h2>
                {posts.map(p => (
                    <div key={p.id} style={styles.articleCard}>
                        <div style={styles.articleHeader}>
                            <div>
                                <div style={styles.articleTitle}>{p.title}</div>
                                <div style={styles.articleDate}>{formatDate(p.createdAt)}</div>
                            </div>
                            <div style={styles.cardBtns}>
                                <button onClick={() => setEditPost(p)} style={styles.editBtn}>Modifier</button>
                                <button onClick={() => deletePost(p.id)} style={styles.deleteBtn}>Supprimer</button>
                            </div>
                        </div>
                        <div style={styles.articleContent}>{p.content}</div>
                    </div>
                ))}
            </div>

            <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Messages recus ({messages.length})</h2>
                {messages.length === 0 ? (
                    <div style={styles.empty}>Aucun message recu pour le moment.</div>
                ) : messages.map(m => (
                    <MessageCard
                        key={m.id}
                        m={m}
                        onReply={(msg) => { setReplyMsg(msg); setReplyText(""); }}
                        onDelete={deleteMessage}
                        onIgnore={() => showSuccess("Message ignore.")}
                        formatDate={formatDate}
                    />
                ))}
            </div>

            {replyMsg && (
                <div style={styles.modal}>
                    <div style={styles.modalBox}>
                        <div style={styles.modalHeader}>
                            <div style={styles.modalAvatar}>{replyMsg.name.charAt(0).toUpperCase()}</div>
                            <div>
                                <h3 style={styles.modalTitle}>Repondre a {replyMsg.name}</h3>
                                <p style={styles.modalSub}>La reponse sera envoyee a : {replyMsg.email}</p>
                            </div>
                        </div>
                        <div style={styles.modalOriginal}>
                            <div style={styles.modalOriginalLabel}>Message original :</div>
                            <div style={styles.modalOriginalText}>{replyMsg.message}</div>
                        </div>
                        <form onSubmit={replyMessage}>
                            <textarea
                                placeholder="Votre reponse..."
                                value={replyText}
                                onChange={e => setReplyText(e.target.value)}
                                style={{...styles.textarea, width: "100%", marginBottom: "16px", height: "120px"}}
                                required
                            />
                            <div style={styles.formBtns}>
                                <button type="submit" style={styles.btn}>Envoyer la reponse</button>
                                <button type="button" onClick={() => setReplyMsg(null)} style={styles.cancelBtn}>Annuler</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

const styles = {
    container: { padding: "32px", background: "#f5f5f5", minHeight: "100vh" },
    successBanner: { position: "fixed", top: "80px", right: "24px", background: "#2e7d32", color: "#fff", padding: "12px 24px", borderRadius: "8px", fontSize: "14px", fontWeight: "600", zIndex: 999, boxShadow: "0 4px 16px rgba(0,0,0,0.15)" },
    header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" },
    title: { fontSize: "26px", fontWeight: "bold", color: "#1a1a1a", marginBottom: "4px" },
    subtitle: { fontSize: "13px", color: "#888" },
    logoutBtn: { background: "#f44336", color: "#fff", border: "none", padding: "8px 20px", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: "600" },
    statsRow: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "24px" },
    statCard: { background: "#fff", border: "1px solid #e0e0e0", borderRadius: "10px", padding: "20px", textAlign: "center" },
    statNum: { fontSize: "32px", fontWeight: "bold", color: "#1a1a1a", lineHeight: 1 },
    statLbl: { fontSize: "12px", color: "#888", marginTop: "6px" },
    section: { background: "#fff", border: "1px solid #e0e0e0", borderRadius: "12px", padding: "24px", marginBottom: "20px" },
    sectionTitle: { fontSize: "17px", fontWeight: "bold", color: "#1a1a1a", marginBottom: "18px", paddingBottom: "12px", borderBottom: "2px solid #e8f5e9" },
    form: { display: "flex", flexDirection: "column", gap: "12px", maxWidth: "600px" },
    formGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" },
    input: { padding: "10px 14px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "14px", fontFamily: "Arial, sans-serif", outline: "none" },
    textarea: { padding: "10px 14px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "14px", height: "100px", resize: "none", fontFamily: "Arial, sans-serif", outline: "none" },
    btn: { background: "#4caf50", color: "#fff", fontSize: "13px", padding: "10px 24px", borderRadius: "8px", border: "none", cursor: "pointer", width: "fit-content", fontWeight: "600" },
    cancelBtn: { background: "#f5f5f5", color: "#555", fontSize: "13px", padding: "10px 24px", borderRadius: "8px", border: "1px solid #ddd", cursor: "pointer", width: "fit-content" },
    formBtns: { display: "flex", gap: "12px" },
    grid: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "14px" },
    projectCard: { background: "#f9f9f9", border: "1px solid #e8e8e8", borderRadius: "10px", padding: "16px" },
    projectCat: { display: "inline-block", background: "#e8f5e9", color: "#2e7d32", fontSize: "10px", fontWeight: "600", padding: "3px 10px", borderRadius: "20px", marginBottom: "8px", textTransform: "uppercase" },
    cardName: { fontSize: "13px", fontWeight: "bold", color: "#222", marginBottom: "6px" },
    cardDesc: { fontSize: "12px", color: "#888", marginBottom: "12px", lineHeight: 1.5 },
    cardBtns: { display: "flex", gap: "8px" },
    editBtn: { background: "#e3f2fd", color: "#1565c0", border: "none", padding: "5px 14px", borderRadius: "6px", cursor: "pointer", fontSize: "11px", fontWeight: "600" },
    deleteBtn: { background: "#ffebee", color: "#c62828", border: "none", padding: "5px 14px", borderRadius: "6px", cursor: "pointer", fontSize: "11px", fontWeight: "600" },
    articleCard: { background: "#f9f9f9", border: "1px solid #e8e8e8", borderRadius: "10px", padding: "16px", marginBottom: "12px" },
    articleHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" },
    articleTitle: { fontSize: "14px", fontWeight: "bold", color: "#222", marginBottom: "4px" },
    articleDate: { fontSize: "11px", color: "#bbb" },
    articleContent: { fontSize: "13px", color: "#666", lineHeight: 1.6 },
    empty: { textAlign: "center", color: "#bbb", fontSize: "14px", padding: "32px" },
    modal: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 },
    modalBox: { background: "#fff", borderRadius: "14px", padding: "32px", width: "520px", maxWidth: "90vw" },
    modalHeader: { display: "flex", gap: "14px", alignItems: "center", marginBottom: "18px" },
    modalAvatar: { width: "48px", height: "48px", borderRadius: "50%", background: "#e8f5e9", color: "#2e7d32", fontWeight: "bold", fontSize: "20px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
    modalTitle: { fontSize: "17px", fontWeight: "bold", color: "#1a1a1a", marginBottom: "3px" },
    modalSub: { fontSize: "12px", color: "#888" },
    modalOriginal: { background: "#f9f9f9", border: "1px solid #e0e0e0", borderRadius: "8px", padding: "14px", marginBottom: "18px" },
    modalOriginalLabel: { fontSize: "11px", color: "#aaa", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "1px" },
    modalOriginalText: { fontSize: "13px", color: "#555", lineHeight: 1.6 }
};

export default Admin;
