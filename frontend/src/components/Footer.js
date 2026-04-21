import { Link } from "react-router-dom";

function Footer() {
    return (
        <footer style={styles.footer}>
            <div>
                <div style={styles.logo}>Terra<span style={styles.logoSpan}>Sana</span> ASBL</div>
                <div style={styles.version}>v1.0.0 - Bruxelles, Belgique</div>
            </div>
            <div style={styles.links}>
                <Link to="/confidentialite" style={styles.link}>Confidentialite</Link>
                <Link to="/conditions" style={styles.link}>Conditions</Link>
                <Link to="/cookies" style={styles.link}>Cookies</Link>
                <Link to="/aide" style={styles.link}>Aide</Link>
                <Link to="/sponsors" style={styles.link}>Sponsors</Link>
                <Link to="/benevolat" style={styles.link}>Benevolat</Link>
            </div>
        </footer>
    );
}

const styles = {
    footer: { background: "#111", padding: "24px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" },
    logo: { color: "#fff", fontSize: "15px", fontWeight: "bold" },
    logoSpan: { color: "#4caf50" },
    version: { color: "#444", fontSize: "11px", marginTop: "4px" },
    links: { display: "flex", gap: "16px", flexWrap: "wrap" },
    link: { color: "#666", fontSize: "11px", textDecoration: "none" }
};

export default Footer;
