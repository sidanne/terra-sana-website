import { Link } from "react-router-dom";

function Navbar() {
    const token = localStorage.getItem("token");

    return (
        <nav style={styles.nav}>
            <Link to="/" style={styles.logoContainer}>
                <div style={styles.logoIcon}>TS</div>
                <div style={styles.logoText}>Terra<span style={styles.logoSpan}>Sana</span></div>
            </Link>
            <div style={styles.links}>
                <Link to="/" style={styles.link}>Accueil</Link>
                <Link to="/about" style={styles.link}>A propos</Link>
                <Link to="/projects" style={styles.link}>Projets</Link>
                <Link to="/blog" style={styles.link}>Blog</Link>
                <Link to="/contact" style={styles.link}>Contact</Link>
                <Link to={token ? "/admin" : "/login"} style={styles.adminBtn}>
                    {token ? "Admin" : "Connexion"}
                </Link>
            </div>
        </nav>
    );
}

const styles = {
    nav: { background: "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 40px", height: "64px", position: "sticky", top: 0, zIndex: 100 },
    logoContainer: { display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" },
    logoIcon: { background: "#4caf50", color: "#fff", fontWeight: "bold", fontSize: "14px", width: "38px", height: "38px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" },
    logoText: { color: "#fff", fontSize: "18px", fontWeight: "bold" },
    logoSpan: { color: "#4caf50" },
    links: { display: "flex", alignItems: "center", gap: "32px" },
    link: { color: "#ccc", textDecoration: "none", fontSize: "14px" },
    adminBtn: { background: "#4caf50", color: "#fff", fontSize: "13px", padding: "8px 20px", borderRadius: "6px", textDecoration: "none" }
};

export default Navbar;
