import { Link } from "react-router-dom";

function Footer() {
    return (
        <footer style={styles.footer}>
            <div>
                <div style={styles.logo}>Terra<span style={styles.logoSpan}>Sana</span> ASBL</div>
                <div style={styles.info}>53/3, 1200 Woluwe-Saint-Lambert, Bruxelles</div>
                <div style={styles.info}>Terrasana@outlook.be</div>
                <div style={styles.info}>Lundi - Vendredi : 8h00 - 16h00</div>
                <div style={styles.version}>v1.0.0</div>
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
    footer: { background: "#111", padding: "28px 32px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" },
    logo: { color: "#fff", fontSize: "15px", fontWeight: "bold", marginBottom: "8px" },
    logoSpan: { color: "#4caf50" },
    info: { color: "#666", fontSize: "12px", marginTop: "4px" },
    version: { color: "#333", fontSize: "10px", marginTop: "8px" },
    links: { display: "flex", flexDirection: "column", gap: "8px", alignItems: "flex-end" },
    link: { color: "#666", fontSize: "11px", textDecoration: "none" }
};

export default Footer;
