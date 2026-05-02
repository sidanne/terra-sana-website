import { Link } from "react-router-dom";

function Footer({ lang }) {
    const version = "v1.0.0";

    const labels = {
        fr: {
            about: "A propos de Terra Sana",
            desc: "Organisation a but non lucratif fondee en 2019 a Bruxelles. Soutien aux producteurs locaux et promotion du circuit court.",
            links: "Liens utiles",
            legal: "Legal",
            contact: "Contact",
            address: "53/3, 1200 Woluwe-Saint-Lambert",
            city: "Bruxelles, Belgique",
            hours: "Lun - Ven : 8h00 - 16h00",
            version: "Version du site",
            rights: "Tous droits reserves"
        },
        en: {
            about: "About Terra Sana",
            desc: "Non-profit organization founded in 2019 in Brussels. Supporting local producers and promoting short supply chains.",
            links: "Useful links",
            legal: "Legal",
            contact: "Contact",
            address: "53/3, 1200 Woluwe-Saint-Lambert",
            city: "Brussels, Belgium",
            hours: "Mon - Fri : 8:00 - 16:00",
            version: "Site version",
            rights: "All rights reserved"
        },
        nl: {
            about: "Over Terra Sana",
            desc: "Non-profitorganisatie opgericht in 2019 in Brussel. Ondersteuning van lokale producenten en promotie van korte ketens.",
            links: "Nuttige links",
            legal: "Juridisch",
            contact: "Contact",
            address: "53/3, 1200 Woluwe-Sint-Lambert",
            city: "Brussel, Belgie",
            hours: "Ma - Vr : 8:00 - 16:00",
            version: "Siteversie",
            rights: "Alle rechten voorbehouden"
        }
    };

    const t = labels[lang] || labels.fr;

    const usefulLinks = [
        { label: lang === "fr" ? "Accueil" : lang === "en" ? "Home" : "Home", path: "/" },
        { label: lang === "fr" ? "A propos" : lang === "en" ? "About" : "Over ons", path: "/about" },
        { label: lang === "fr" ? "Projets" : lang === "en" ? "Projects" : "Projecten", path: "/projects" },
        { label: "Blog", path: "/blog" },
        { label: "Contact", path: "/contact" },
        { label: lang === "fr" ? "Benevol / Stage" : lang === "en" ? "Volunteer / Internship" : "Vrijwillig / Stage", path: "/benevolat" }
    ];

    const legalLinks = [
        { label: lang === "fr" ? "Confidentialite" : lang === "en" ? "Privacy" : "Privacy", path: "/confidentialite" },
        { label: lang === "fr" ? "Politique de cookies" : lang === "en" ? "Cookie policy" : "Cookiebeleid", path: "/cookies" },
        { label: lang === "fr" ? "Conditions" : lang === "en" ? "Terms" : "Voorwaarden", path: "/conditions" },
        { label: lang === "fr" ? "Aide" : lang === "en" ? "Help" : "Hulp", path: "/aide" },
        { label: "Sponsors", path: "/sponsors" }
    ];

    return (
        <footer style={styles.footer}>
            <div style={styles.top}>
                <div style={styles.col}>
                    <img src="/logo-terrasana.png" alt="Terra Sana" style={styles.footerLogo} />
                    <p style={styles.desc}>{t.desc}</p>
                    <div style={styles.contactInfo}>
                        <div style={styles.infoItem}>?? {t.address}</div>
                        <div style={styles.infoItem}>{t.city}</div>
                        <div style={styles.infoItem}>?? Terrasana@outlook.be</div>
                        <div style={styles.infoItem}>?? {t.hours}</div>
                    </div>
                </div>

                <div style={styles.col}>
                    <div style={styles.colTitle}>{t.links}</div>
                    {usefulLinks.map((l, i) => (
                        <Link key={i} to={l.path} style={styles.footerLink}>{l.label}</Link>
                    ))}
                </div>

                <div style={styles.col}>
                    <div style={styles.colTitle}>{t.legal}</div>
                    {legalLinks.map((l, i) => (
                        <Link key={i} to={l.path} style={styles.footerLink}>{l.label}</Link>
                    ))}
                </div>
            </div>

            <div style={styles.bottom}>
                <div style={styles.bottomLeft}>
                    © 2025 Terra Sana ASBL — {t.rights}
                </div>
                <div style={styles.versionBadge}>
                    {t.version} : {version}
                </div>
            </div>
        </footer>
    );
}

const styles = {
    footer: { background: "#111", padding: "48px 32px 24px" },
    top: { display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "40px", marginBottom: "40px", paddingBottom: "40px", borderBottom: "1px solid #222" },
    col: { display: "flex", flexDirection: "column", gap: "8px" },
    footerLogo: { height: "48px", width: "auto", objectFit: "contain", marginBottom: "12px", filter: "brightness(1.1)" },
    desc: { fontSize: "13px", color: "#666", lineHeight: "1.7", marginBottom: "16px" },
    contactInfo: { display: "flex", flexDirection: "column", gap: "6px" },
    infoItem: { fontSize: "12px", color: "#555" },
    colTitle: { fontSize: "13px", fontWeight: "700", color: "#fff", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1px" },
    footerLink: { fontSize: "13px", color: "#666", textDecoration: "none", transition: "color 0.2s", padding: "2px 0" },
    bottom: { display: "flex", justifyContent: "space-between", alignItems: "center" },
    bottomLeft: { fontSize: "12px", color: "#444" },
    versionBadge: { fontSize: "11px", color: "#444", background: "#1a1a1a", padding: "4px 12px", borderRadius: "20px", border: "1px solid #2a2a2a" }
};

export default Footer;
