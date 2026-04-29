import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Admin() {
    const [projects, setProjects] = useState([]);
    const [posts, setPosts] = useState([]);
    const [messages, setMessages] = useState([]);
    const [newProject, setNewProject] = useState({ name: "", description: "", link: "", category: "", isActive: true });
    const [newPost, setNewPost] = useState({ title: "", content: "", isPublished: true });
    const [editProject, setEditProject] = useState(null);
    const [editPost, setEditPost] = useState(null);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) { navigate("/login"); return; }
        fetchData();
    }, []);

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
    };

    const deleteProject = async (id) => {
        if (!window.confirm("Voulez-vous vraiment supprimer ce projet ?")) return;
        await fetch(`http://localhost:8080/api/projects/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        });
        fetchData();
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
    };

    const logout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>Espace Administrateur</h1>
                <button onClick={logout} style={styles.logoutBtn}>Deconnexion</button>
            </div>

            <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Ajouter un projet</h2>
                <form onSubmit={addProject} style={styles.form}>
                    <input placeholder="Nom" value={newProject.name} onChange={e => setNewProject({...newProject, name: e.target.value})} style={styles.input} required />
                    <input placeholder="Description" value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})} style={styles.input} required />
                    <input placeholder="Lien application" value={newProject.link} onChange={e => setNewProject({...newProject, link: e.target.value})} style={styles.input} />
                    <input placeholder="Categorie" value={newProject.category} onChange={e => setNewProject({...newProject, category: e.target.value})} style={styles.input} />
                    <button type="submit" style={styles.btn}>Ajouter</button>
                </form>
            </div>

            {editProject && (
                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>Modifier le projet</h2>
                    <form onSubmit={updateProject} style={styles.form}>
                        <input placeholder="Nom" value={editProject.name} onChange={e => setEditProject({...editProject, name: e.target.value})} style={styles.input} required />
                        <input placeholder="Description" value={editProject.description} onChange={e => setEditProject({...editProject, description: e.target.value})} style={styles.input} required />
                        <input placeholder="Lien application" value={editProject.link} onChange={e => setEditProject({...editProject, link: e.target.value})} style={styles.input} />
                        <input placeholder="Categorie" value={editProject.category} onChange={e => setEditProject({...editProject, category: e.target.value})} style={styles.input} />
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
                        <div key={p.id} style={styles.card}>
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
                <h2 style={styles.sectionTitle}>Ajouter un article</h2>
                <form onSubmit={addPost} style={styles.form}>
                    <input placeholder="Titre" value={newPost.title} onChange={e => setNewPost({...newPost, title: e.target.value})} style={styles.input} required />
                    <textarea placeholder="Contenu" value={newPost.content} onChange={e => setNewPost({...newPost, content: e.target.value})} style={styles.textarea} required />
                    <button type="submit" style={styles.btn}>Publier</button>
                </form>
            </div>

            <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Articles ({posts.length})</h2>
                {posts.map(p => (
                    <div key={p.id} style={styles.messageCard}>
                        <div style={styles.messageName}>{p.title}</div>
                        <div style={styles.messageText}>{p.content}</div>
                    </div>
                ))}
            </div>

            <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Messages recus ({messages.length})</h2>
                {messages.length === 0 ? (
                    <div style={styles.empty}>Aucun message recu pour le moment.</div>
                ) : messages.map(m => (
                    <div key={m.id} style={styles.messageCard}>
                        <div style={styles.messageName}>{m.name} — {m.email}</div>
                        <div style={styles.messageText}>{m.message}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

const styles = {
    container: { padding: "32px", background: "#f9f9f9", minHeight: "100vh" },
    header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" },
    title: { fontSize: "26px", fontWeight: "bold", color: "#1a1a1a" },
    logoutBtn: { background: "#f44336", color: "#fff", border: "none", padding: "8px 20px", borderRadius: "8px", cursor: "pointer", fontSize: "13px" },
    section: { background: "#fff", border: "1px solid #e0e0e0", borderRadius: "12px", padding: "24px", marginBottom: "24px" },
    sectionTitle: { fontSize: "18px", fontWeight: "bold", color: "#2e7d32", marginBottom: "16px" },
    form: { display: "flex", flexDirection: "column", gap: "12px", maxWidth: "500px" },
    input: { padding: "10px 14px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "14px" },
    textarea: { padding: "10px 14px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "14px", height: "100px", resize: "none" },
    btn: { background: "#4caf50", color: "#fff", fontSize: "13px", padding: "10px 24px", borderRadius: "8px", border: "none", cursor: "pointer", width: "fit-content" },
    cancelBtn: { background: "#f5f5f5", color: "#555", fontSize: "13px", padding: "10px 24px", borderRadius: "8px", border: "1px solid #ddd", cursor: "pointer", width: "fit-content" },
    formBtns: { display: "flex", gap: "12px" },
    grid: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "14px" },
    card: { background: "#f9f9f9", border: "1px solid #e0e0e0", borderRadius: "8px", padding: "14px" },
    cardName: { fontSize: "13px", fontWeight: "bold", color: "#222", marginBottom: "6px" },
    cardDesc: { fontSize: "12px", color: "#888", marginBottom: "10px" },
    cardBtns: { display: "flex", gap: "8px" },
    editBtn: { background: "#e3f2fd", color: "#1565c0", border: "none", padding: "5px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "11px" },
    deleteBtn: { background: "#ffebee", color: "#c62828", border: "none", padding: "5px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "11px" },
    messageCard: { background: "#f9f9f9", border: "1px solid #e0e0e0", borderRadius: "8px", padding: "14px", marginBottom: "12px" },
    messageName: { fontSize: "13px", fontWeight: "bold", color: "#222", marginBottom: "6px" },
    messageText: { fontSize: "13px", color: "#555" },
    empty: { textAlign: "center", color: "#aaa", fontSize: "14px", padding: "20px" }
};

export default Admin;
