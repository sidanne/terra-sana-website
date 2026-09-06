import { Link } from "react-router-dom";

const T = {
    fr: { title: "Page introuvable", text: "La page que vous cherchez n'existe pas ou a été déplacée.", btn: "Retour à l'accueil" },
    en: { title: "Page not found", text: "The page you're looking for doesn't exist or has been moved.", btn: "Back to home" },
    nl: { title: "Pagina niet gevonden", text: "De pagina die u zoekt bestaat niet meer of is verplaatst.", btn: "Terug naar home" }
};

function NotFound({ lang }) {
    const t = T[lang] || T.fr;
    return (
        <div style={styles.container}>
            <div style={styles.code}>404</div>
            <h1 style={styles.title}>{t.title}</h1>
            <p style={styles.text}>{t.text}</p>
            <Link to="/" style={styles.btn}>{t.btn}</Link>
        </div>
    );
}

const styles = {
    container: { minHeight: "80vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "40px" },
    code: { fontSize: "100px", fontWeight: "bold", color: "#2D6A4F", lineHeight: "1" },
    title: { fontSize: "28px", fontWeight: "bold", color: "#1B1B1B", marginBottom: "12px" },
    text: { fontSize: "14px", color: "#888", marginBottom: "28px" },
    btn: { background: "#2D6A4F", color: "#fff", fontSize: "14px", padding: "12px 28px", borderRadius: "8px", textDecoration: "none" }
};

export default NotFound;
