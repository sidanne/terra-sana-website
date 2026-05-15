import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

function Navbar({ lang, setLang }) {
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);
    const [langOpen, setLangOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (token) {
            fetch("http://localhost:8080/api/contact", {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(r => r.json())
            .then(data => {
                const unread = data.filter(m => !m.read).length;
                setUnreadCount(unread);
            })
            .catch(() => {});
        }
    }, [token, location]);

    const navLinks = {
        fr: ["Accueil", "A propos", "Projets", "Blog", "Contact"],
        en: ["Home", "About", "Projects", "Blog", "Contact"],
        nl: ["Home", "Over ons", "Projecten", "Blog", "Contact"]
    };
    const loginLabel = { fr: "Connexion", en: "Login", nl: "Inloggen" };
    const menuLabel = { fr: "Menu", en: "Menu", nl: "Menu" };
    const langNames = { fr: "Francais", en: "English", nl: "Nederlands" };
    const langFlags = { fr: "FR", en: "EN", nl: "NL" };

    const links = navLinks[lang] || navLinks.fr;
    const paths = ["/", "/about", "/projects", "/blog", "/contact"];

    return (
        <nav style={styles.nav}>
            <Link to="/" style={styles.logoContainer}>
                <img src="/logo-terrasana.png" alt="Terra Sana" style={styles.logoImg} />
            </Link>

            <div style={styles.right}>
                <div style={styles.menuWrapper}>
                    <button style={styles.langBtn} onClick={() => { setLangOpen(!langOpen); setMenuOpen(false); }}>
                        <span style={styles.flag}>{langFlags[lang]}</span>
                        <span style={styles.langCurrent}>{langNames[lang]}</span>
                        <span style={styles.arrow}>{langOpen ? "?" : "?"}</span>
                    </button>
                    {langOpen && (
                        <div style={styles.dropdown}>
                            {["fr","en","nl"].map(l => (
                                <button key={l} onClick={() => { setLang(l); setLangOpen(false); }}
                                    style={{...styles.dropItem, color: lang === l ? "#4caf50" : "#222", background: lang === l ? "#f0fdf4" : "transparent", fontWeight: lang === l ? "600" : "400", border: "none", width: "100%", cursor: "pointer", textAlign: "left"}}>
                                    <span style={{...styles.dropDot, background: lang === l ? "#4caf50" : "#ddd"}}></span>
                                    <span style={styles.flagSmall}>{langFlags[l]}</span>
                                    {langNames[l]}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <Link to={token ? "/admin" : "/login"} style={styles.adminBtn}>
                    <span>{token ? "Admin" : loginLabel[lang]}</span>
                    {token && unreadCount > 0 && (
                        <span style={styles.notifBadge}>{unreadCount}</span>
                    )}
                </Link>

                <div style={styles.menuWrapper}>
                    <button style={styles.menuBtn} onClick={() => { setMenuOpen(!menuOpen); setLangOpen(false); }}>
                        <div style={styles.burger}>
                            <span style={{...styles.bar, transform: menuOpen ? "rotate(45deg) translate(5px,5px)" : "none"}}></span>
                            <span style={{...styles.bar, opacity: menuOpen ? 0 : 1}}></span>
                            <span style={{...styles.bar, transform: menuOpen ? "rotate(-45deg) translate(5px,-5px)" : "none"}}></span>
                        </div>
                        <span style={styles.menuLabel}>{menuLabel[lang]}</span>
                    </button>
                    {menuOpen && (
                        <div style={styles.dropdown}>
                            {links.map((item, i) => (
                                <Link key={i} to={paths[i]} onClick={() => setMenuOpen(false)}
                                    style={{...styles.dropItem, color: location.pathname === paths[i] ? "#4caf50" : "#222", background: location.pathname === paths[i] ? "#f0fdf4" : "transparent", fontWeight: location.pathname === paths[i] ? "600" : "400"}}>
                                    <span style={{...styles.dropDot, background: location.pathname === paths[i] ? "#4caf50" : "#ddd"}}></span>
                                    {item}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

const styles = {
    nav: { background: "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 32px", height: "64px", position: "sticky", top: 0, zIndex: 100 },
    logoContainer: { display: "flex", alignItems: "center" },
    logoImg: { height: "44px", width: "auto", objectFit: "contain" },
    right: { display: "flex", gap: "12px", alignItems: "center" },
    menuWrapper: { position: "relative" },
    langBtn: { background: "#2a2a2a", border: "1px solid #333", borderRadius: "8px", padding: "8px 14px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", color: "#fff" },
    flag: { fontFamily: "monospace", fontSize: "11px", fontWeight: "700", background: "#4caf50", color: "#fff", padding: "2px 6px", borderRadius: "4px" },
    flagSmall: { fontFamily: "monospace", fontSize: "11px", fontWeight: "700", background: "#e8f5e9", color: "#2e7d32", padding: "2px 6px", borderRadius: "4px", marginRight: "4px" },
    langCurrent: { fontSize: "13px", fontWeight: "500" },
    arrow: { fontSize: "10px", opacity: 0.6 },
    adminBtn: { background: "#4caf50", color: "#fff", fontSize: "12px", padding: "7px 16px", borderRadius: "6px", textDecoration: "none", fontWeight: "600", display: "flex", alignItems: "center", gap: "8px", position: "relative" },
    notifBadge: { background: "#f44336", color: "#fff", fontSize: "10px", fontWeight: "bold", padding: "2px 6px", borderRadius: "20px", minWidth: "18px", textAlign: "center" },
    menuBtn: { background: "#2a2a2a", border: "1px solid #333", borderRadius: "8px", padding: "8px 14px", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px", color: "#fff" },
    burger: { display: "flex", flexDirection: "column", gap: "4px", width: "16px" },
    bar: { display: "block", width: "16px", height: "2px", background: "#fff", borderRadius: "2px", transition: "all 0.3s" },
    menuLabel: { fontSize: "13px", fontWeight: "600", letterSpacing: "0.5px" },
    dropdown: { position: "absolute", top: "calc(100% + 10px)", right: 0, background: "#fff", borderRadius: "12px", boxShadow: "0 8px 32px rgba(0,0,0,0.15)", padding: "8px", minWidth: "180px", border: "1px solid #e0e0e0", zIndex: 200 },
    dropItem: { display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", borderRadius: "8px", textDecoration: "none", fontSize: "14px", transition: "all 0.2s" },
    dropDot: { width: "6px", height: "6px", borderRadius: "50%", flexShrink: 0 }
};

export default Navbar;
