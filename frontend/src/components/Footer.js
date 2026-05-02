import { Link } from "react-router-dom";

function Footer({ lang }) {
    const version = "v1.0.0";

    const t = {
        fr: { desc: "Organisation a but non lucratif fondee en 2019 a Bruxelles. Soutien aux producteurs locaux et promotion du circuit court.", links: "Liens utiles", legal: "Legal", address: "Adresse", email: "Email", hours: "Horaires", hoursVal: "Lun - Ven : 8h00 - 16h00", version: "Version", rights: "Tous droits reserves", city: "Bruxelles, Belgique" },
        en: { desc: "Non-profit organization founded in 2019 in Brussels. Supporting local producers and promoting short supply chains.", links: "Useful links", legal: "Legal", address: "Address", email: "Email", hours: "Hours", hoursVal: "Mon - Fri : 8:00 - 16:00", version: "Version", rights: "All rights reserved", city: "Brussels, Belgium" },
        nl: { desc: "Non-profitorganisatie opgericht in 2019 in Brussel. Ondersteuning van lokale producenten en bevordering van korte ketens.", links: "Nuttige links", legal: "Juridisch", address: "Adres", email: "E-mail", hours: "Openingstijden", hoursVal: "Ma - Vr : 8:00 - 16:00", version: "Versie", rights: "Alle rechten voorbehouden", city: "Brussel, Belgie" }
    }[lang] || { desc: "Organisation a but non lucratif fondee en 2019.", links: "Liens utiles", legal: "Legal", address: "Adresse", email: "Email", hours: "Horaires", hoursVal: "Lun - Ven : 8h00 - 16h00", version: "Version", rights: "Tous droits reserves", city: "Bruxelles, Belgique" };

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
        { label: lang === "fr" ? "Politique cookies" : lang === "en" ? "Cookie policy" : "Cookiebeleid", path: "/cookies" },
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
                        <div style={styles.infoItem}>
                            <div style={styles.infoIcon}>ADR</div>
                            <div>
                                <div style={styles.infoLabel}>{t.address}</div>
                                <div style={styles.infoValue}>53/3, 1200 Woluwe-Saint-Lambert</div>
                                <div style={styles.infoValue}>{t.city}</div>
                            </div>
                        </div>
                        <div style={styles.infoItem}>
                            <div style={styles.infoIcon}>EML</div>
                            <div>
                                <div style={styles.infoLabel}>{t.email}</div>
                                <a href="mailto:Terrasana@outlook.be" style={styles.infoLink}>Terrasana@outlook.be</a>
                            </div>
                        </div>
                        <div style={styles.infoItem}>
                            <div style={styles.infoIcon}>HOR</div>
                            <div>
                                <div style={styles.infoLabel}>{t.hours}</div>
                                <div style={styles.infoValue}>{t.hoursVal}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={styles.col}>
                    <div style={styles.colTitle}>{t.links}</div>
                    <div style={styles.linksList}>
                        {usefulLinks.map((l, i) => (
                            <Link key={i} to={l.path} style={styles.footerLink}>
                                <span style={styles.linkDot}></span>
                                {l.label}
                            </Link>
                        ))}
                    </div>
                </div>

                <div style={styles.col}>
                    <div style={styles.colTitle}>{t.legal}</div>
                    <div style={styles.linksList}>
                        {legalLinks.map((l, i) => (
                            <Link key={i} to={l.path} style={styles.footerLink}>
                                <span style={styles.linkDot}></span>
                                {l.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            <div style={styles.bottom}>
                <div style={styles.bottomLeft}>
                    &copy; 2025 Terra Sana ASBL &mdash; {t.rights}
                </div>
                <div style={styles.versionBadge}>
                    {t.version} : {version}
                </div>
            </div>
        </footer>
    );
}

const styles = {
    footer: { background: "#111", padding: "48px 40px 24px" },
    top: { display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "48px", marginBottom: "40px", paddingBottom: "40px", borderBottom: "1px solid #222" },
    col: { display: "flex", flexDirection: "column" },
    footerLogo: { height: "50px", width: "auto", objectFit: "contain", marginBottom: "16px", alignSelf: "flex-start" },
    desc: { fontSize: "13px", color: "#555", lineHeight: "1.8", marginBottom: "24px" },
    contactInfo: { display: "flex", flexDirection: "column", gap: "14px" },
    infoItem: { display: "flex", gap: "12px", alignItems: "flex-start" },
    infoIcon: { background: "#1e1e1e", color: "#4caf50", fontWeight: "bold", fontSize: "9px", padding: "5px 7px", borderRadius: "5px", flexShrink: 0, letterSpacing: "0.5px", border: "1px solid #2a2a2a" },
    infoLabel: { fontSize: "11px", color: "#4caf50", fontWeight: "600", marginBottom: "3px", letterSpacing: "0.5px", textTransform: "uppercase" },
    infoValue: { fontSize: "13px", color: "#555" },
    infoLink: { fontSize: "13px", color: "#4caf50", textDecoration: "none" },
    colTitle: { fontSize: "12px", fontWeight: "700", color: "#fff", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "1.5px", paddingBottom: "10px", borderBottom: "1px solid #222" },
    linksList: { display: "flex", flexDirection: "column", gap: "10px" },
    footerLink: { display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#555", textDecoration: "none", transition: "color 0.2s" },
    linkDot: { width: "4px", height: "4px", borderRadius: "50%", background: "#333", flexShrink: 0 },
    bottom: { display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "8px" },
    bottomLeft: { fontSize: "12px", color: "#333" },
    versionBadge: { fontSize: "11px", color: "#444", background: "#1a1a1a", padding: "5px 14px", borderRadius: "20px", border: "1px solid #2a2a2a" }
};

export default Footer;
