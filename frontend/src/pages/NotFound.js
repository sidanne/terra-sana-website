import { Link } from "react-router-dom";

function NotFound() {
    return (
        <div style={styles.container}>
            <div style={styles.code}>404</div>
            <h1 style={styles.title}>Page introuvable</h1>
            <p style={styles.text}>La page que vous cherchez nexiste pas ou a ete deplacee.</p>
            <Link to="/" style={styles.btn}>Retour a accueil</Link>
        </div>
    );
}

const styles = {
    container: { minHeight: "80vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "40px" },
    code: { fontSize: "100px", fontWeight: "bold", color: "#4caf50", lineHeight: "1" },
    title: { fontSize: "28px", fontWeight: "bold", color: "#1a1a1a", marginBottom: "12px" },
    text: { fontSize: "14px", color: "#888", marginBottom: "28px" },
    btn: { background: "#4caf50", color: "#fff", fontSize: "14px", padding: "12px 28px", borderRadius: "8px", textDecoration: "none" }
};

export default NotFound;
