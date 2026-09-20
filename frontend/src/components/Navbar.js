import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

function Navbar({ lang, setLang }) {
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);
    const [langMenuOpen, setLangMenuOpen] = useState(false);
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
        fr: ["À propos", "Nos applications", "Nos événements", "Devenir bénévole", "Contact"],
        en: ["About", "Our applications", "Our events", "Become a volunteer", "Contact"],
        nl: ["Over ons", "Onze applicaties", "Onze evenementen", "Vrijwilliger worden", "Contact"]
    };
    const langNames = { fr: "Français", en: "English", nl: "Nederlands" };
    const langFlags = { fr: "FR", en: "EN", nl: "NL" };
    const volunteerConnect = { fr: "Se connecter", en: "Log in", nl: "Inloggen" };
    const volunteerJoin = { fr: "Je m'inscris", en: "Sign up", nl: "Inschrijven" };
    const adminSpace = { fr: "Espace administrateur", en: "Admin area", nl: "Beheerdersruimte" };
    const mySpace = { fr: "Mon espace", en: "My space", nl: "Mijn ruimte" };

    const links = navLinks[lang] || navLinks.fr;
    const paths = ["/about", "/projects", "/evenements", "/volunteer/register", "/contact"];
    const isVolunteerLoggedIn = !!localStorage.getItem("volunteerToken");

    return (
        <nav style={styles.nav}>
            <div style={styles.left}>
                <Link to="/" style={styles.logoContainer}>
                    <img src="/logo-terrasana.png" alt="Terra Sana" style={styles.logoImg} />
                </Link>

                {/* Menu compact regroupant les 5 pages de contenu — evite d'etaler les liens dans la barre */}
                <div style={styles.menuWrapper}>
                    <button style={styles.menuBtn} onClick={() => setMenuOpen(!menuOpen)}>
                        <div style={styles.burger}>
                            <span style={{...styles.bar, transform: menuOpen ? "rotate(45deg) translate(5px,5px)" : "none"}}></span>
                            <span style={{...styles.bar, opacity: menuOpen ? 0 : 1}}></span>
                            <span style={{...styles.bar, transform: menuOpen ? "rotate(-45deg) translate(5px,-5px)" : "none"}}></span>
                        </div>
                        <span>Menu</span>
                    </button>
                    {menuOpen && (
                        <div style={styles.dropdown}>
                            {links.map((item, i) => (
                                <Link key={i} to={paths[i]} onClick={() => setMenuOpen(false)}
                                    style={{...styles.dropItem, color: location.pathname === paths[i] ? "#2D6A4F" : "#222", background: location.pathname === paths[i] ? "#f0fdf4" : "transparent", fontWeight: location.pathname === paths[i] ? "600" : "400"}}>
                                    <span style={{...styles.dropDot, background: location.pathname === paths[i] ? "#2D6A4F" : "#ddd"}}></span>
                                    {item}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="nav-right-controls" style={styles.right}>
                <div style={styles.menuWrapper}>
                    <button style={styles.langBtn} onClick={() => setLangMenuOpen(!langMenuOpen)} title={langNames[lang]}>
                        <span>{langFlags[lang]}</span>
                        <span style={{...styles.caret, transform: langMenuOpen ? "rotate(180deg)" : "none"}}>▾</span>
                    </button>
                    {langMenuOpen && (
                        <div style={{...styles.dropdown, minWidth: "150px"}}>
                            {["fr", "en", "nl"].map(l => (
                                <button key={l} onClick={() => { setLang(l); setLangMenuOpen(false); }}
                                    style={{...styles.dropItem, width: "100%", border: "none", background: lang === l ? "#f0fdf4" : "transparent", color: lang === l ? "#2D6A4F" : "#222", fontWeight: lang === l ? "600" : "400", cursor: "pointer"}}>
                                    <span style={{...styles.dropDot, background: lang === l ? "#2D6A4F" : "#ddd"}}></span>
                                    {langNames[l]}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {token ? (
                    <Link to="/admin" style={styles.adminBtn}>
                        <span>Admin</span>
                        {unreadCount > 0 && <span style={styles.notifBadge}>{unreadCount}</span>}
                    </Link>
                ) : isVolunteerLoggedIn ? (
                    <Link to="/volunteer/dashboard" style={styles.joinBtn}>{mySpace[lang] || mySpace.fr}</Link>
                ) : (
                    <div style={styles.authBtns}>
                        <Link to="/login" style={styles.adminTextLink}>{adminSpace[lang] || adminSpace.fr}</Link>
                        <Link to="/volunteer/login" style={styles.connectBtn}>{volunteerConnect[lang]}</Link>
                        <Link to="/volunteer/register" style={styles.joinBtn}>{volunteerJoin[lang]}</Link>
                    </div>
                )}
            </div>
        </nav>
    );
}

const styles = {
    nav: { background: "#fff", borderBottom: "1px solid #eee", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 32px", height: "64px", position: "sticky", top: 0, zIndex: 100, gap: "16px" },
    left: { display: "flex", alignItems: "center", gap: "18px", flexShrink: 0 },
    logoContainer: { display: "flex", alignItems: "center", flexShrink: 0 },
    logoImg: { height: "40px", width: "auto", objectFit: "contain" },
    right: { display: "flex", gap: "10px", alignItems: "center", flexShrink: 0 },
    menuWrapper: { position: "relative" },
    langBtn: { background: "#F8F4E3", border: "none", color: "#2D6A4F", fontSize: "12px", fontWeight: "700", padding: "8px 10px", borderRadius: "8px", cursor: "pointer", fontFamily: "monospace", display: "flex", alignItems: "center", gap: "6px" },
    caret: { fontSize: "9px", transition: "transform 0.2s" },
    adminBtn: { background: "#D4A017", color: "#1B1B1B", fontSize: "12px", padding: "9px 16px", borderRadius: "6px", textDecoration: "none", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px", position: "relative" },
    notifBadge: { background: "#f44336", color: "#fff", fontSize: "10px", fontWeight: "bold", padding: "2px 6px", borderRadius: "20px", minWidth: "18px", textAlign: "center" },
    authBtns: { display: "flex", gap: "8px", alignItems: "center" },
    connectBtn: { background: "#fff", color: "#2D6A4F", fontSize: "12px", padding: "8px 14px", borderRadius: "6px", textDecoration: "none", fontWeight: "700", border: "1.5px solid #2D6A4F" },
    adminTextLink: { fontSize: "11.5px", color: "#999", textDecoration: "none", whiteSpace: "nowrap", marginRight: "2px" },
    joinBtn: { background: "#2D6A4F", color: "#fff", fontSize: "12px", padding: "9px 16px", borderRadius: "6px", textDecoration: "none", fontWeight: "700" },
    menuBtn: { background: "#fff", border: "1px solid #e0e0e0", borderRadius: "8px", padding: "9px 14px 9px 12px", cursor: "pointer", display: "flex", alignItems: "center", gap: "9px", fontSize: "13px", fontWeight: "600", color: "#333", fontFamily: "inherit" },
    burger: { display: "flex", flexDirection: "column", gap: "4px", width: "16px" },
    bar: { display: "block", width: "16px", height: "2px", background: "#333", borderRadius: "2px", transition: "all 0.3s" },
    dropdown: { position: "absolute", top: "calc(100% + 10px)", right: 0, background: "#fff", borderRadius: "12px", boxShadow: "0 8px 32px rgba(0,0,0,0.15)", padding: "8px", minWidth: "200px", border: "1px solid #e0e0e0", zIndex: 200 },
    dropItem: { display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", borderRadius: "8px", textDecoration: "none", fontSize: "14px", transition: "all 0.2s" },
    dropDot: { width: "6px", height: "6px", borderRadius: "50%", flexShrink: 0 }
};

export default Navbar;
