import { Link } from "react-router-dom";

function Navbar() {
    return (
        <nav style={styles.nav}>
            <div style={styles.logo}>Terra<span style={styles.logoSpan}>Sana</span></div>
            <div style={styles.links}>
                <Link to="/" style={styles.link}>Accueil</Link>
                <Link to="/about" style={styles.link}>A propos</Link>
                <Link to="/projects" style={styles.link}>Projets</Link>
                <Link to="/blog" style={styles.link}>Blog</Link>
                <Link to="/contact" style={styles.link}>Contact</Link>
            </div>
        </nav>
    );
}

const styles = {
    nav: { background: "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 32px", height: "56px" },
    logo: { color: "#fff", fontSize: "18px", fontWeight: "bold" },
    logoSpan: { color: "#4caf50" },
    links: { display: "flex", gap: "24px" },
    link: { color: "#ccc", textDecoration: "none", fontSize: "14px" }
};

export default Navbar;
