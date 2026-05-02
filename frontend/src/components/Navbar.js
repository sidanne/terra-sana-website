import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

function Navbar({ lang, setLang }) {
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);

    const navLinks = {
        fr: ["Accueil", "A propos", "Projets", "Blog", "Contact"],
        en: ["Home", "About", "Projects", "Blog", "Contact"],
        nl: ["Home", "Over ons", "Projecten", "Blog", "Contact"]
    };

    const token = localStorage.getItem("token");
    const links = navLinks[lang] || navLinks.fr;
    const paths = ["/", "/about", "/projects", "/blog", "/contact"];

    return (
        <nav style={styles.nav}>
            <Link to="/" style={styles.logoContainer}>
                <img src="/logo-terrasana.png" alt="Terra Sana" style={styles.logoImg} />
            </Link>

            <div style={styles.links}>
                {links.map((item, i) => (
                    <Link key={i} to={paths[i]}
                        style={{...styles.link,
                            color: location.pathname === paths[i] ? "#4caf50" : "#ccc",
                            fontWeight: location.pathname === paths[i] ? "600" : "400"
                        }}>
                        {item}
                    </Link>
                ))}
            </div>

            <div style={styles.right}>
                <div style={styles.langBox}>
                    {["fr","en","nl"].map(l => (
                        <button key={l} onClick={() => setLang(l)}
                            style={{...styles.langBtn,
                                background: lang === l ? "#4caf50" : "transparent",
                                color: lang === l ? "#fff" : "#888"}}>
                            {l.toUpperCase()}
                        </button>
                    ))}
                </div>
                <Link to={token ? "/admin" : "/login"} style={styles.adminBtn}>
                    {token ? (lang === "fr" ? "Admin" : lang === "en" ? "Admin" : "Admin") 
                           : (lang === "fr" ? "Connexion" : lang === "en" ? "Login" : "Inloggen")}
                </Link>
            </div>
        </nav>
    );
}

const styles = {
    nav: { background: "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 32px", height: "64px", position: "sticky", top: 0, zIndex: 100 },
    logoContainer: { display: "flex", alignItems: "center" },
    logoImg: { height: "44px", width: "auto", objectFit: "contain" },
    links: { display: "flex", gap: "24px", alignItems: "center" },
    link: { textDecoration: "none", fontSize: "14px", transition: "color 0.2s" },
    right: { display: "flex", gap: "14px", alignItems: "center" },
    langBox: { display: "flex", gap: "2px", background: "#111", borderRadius: "6px", padding: "3px" },
    langBtn: { border: "none", cursor: "pointer", fontFamily: "Arial, sans-serif", fontSize: "11px", fontWeight: "700", padding: "4px 8px", borderRadius: "4px", transition: "all 0.2s", letterSpacing: "0.5px" },
    adminBtn: { background: "#4caf50", color: "#fff", fontSize: "12px", padding: "7px 16px", borderRadius: "6px", textDecoration: "none", fontWeight: "600" }
};

export default Navbar;
