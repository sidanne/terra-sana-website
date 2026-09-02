import { Link } from "react-router-dom";

const GREEN = "#2D6A4F";

function Footer({ lang }) {
    const t = {
        fr: { desc: "Association bruxelloise pour une alimentation locale, saine et accessible à tous depuis 2019.", assoc: "Association", about: "À propos de Terra Sana", mission: "Notre mission", partners: "Nos partenaires", contactUs: "Nous contacter", volunteers: "Bénévoles", become: "Devenir bénévole", calendar: "Calendrier des événements", mySpace: "Mon espace personnel", faq: "FAQ", contact: "Contact", rights: "Tous droits réservés", privacy: "Confidentialité", terms: "Conditions", cookies: "Politique cookies" },
        en: { desc: "Brussels-based non-profit for local, healthy and accessible food, since 2019.", assoc: "Association", about: "About Terra Sana", mission: "Our mission", partners: "Our partners", contactUs: "Contact us", volunteers: "Volunteers", become: "Become a volunteer", calendar: "Events calendar", mySpace: "My personal space", faq: "FAQ", contact: "Contact", rights: "All rights reserved", privacy: "Privacy", terms: "Terms", cookies: "Cookie policy" },
        nl: { desc: "Brusselse vzw voor lokale, gezonde en toegankelijke voeding, sinds 2019.", assoc: "Vereniging", about: "Over Terra Sana", mission: "Onze missie", partners: "Onze partners", contactUs: "Contacteer ons", volunteers: "Vrijwilligers", become: "Vrijwilliger worden", calendar: "Evenementenkalender", mySpace: "Mijn persoonlijke ruimte", faq: "FAQ", contact: "Contact", rights: "Alle rechten voorbehouden", privacy: "Privacy", terms: "Voorwaarden", cookies: "Cookiebeleid" }
    }[lang] || { desc: "Association bruxelloise pour une alimentation locale, saine et accessible a tous depuis 2019.", assoc: "Association", about: "A propos de Terra Sana", mission: "Notre mission", partners: "Nos partenaires", contactUs: "Nous contacter", volunteers: "Benevoles", become: "Devenir benevole", calendar: "Calendrier des evenements", mySpace: "Mon espace personnel", faq: "FAQ", contact: "Contact", rights: "Tous droits reserves", privacy: "Confidentialite", terms: "Conditions", cookies: "Politique cookies" };

    return (
        <footer style={styles.footer}>
            <div style={styles.top}>
                <div style={styles.brandCol}>
                    <div style={styles.brandRow}>
                        <div style={styles.logoIcon}>🌿</div>
                        <span style={styles.brandName}>Terra Sana ASBL</span>
                    </div>
                    <p style={styles.desc}>{t.desc}</p>
                    <div style={styles.socialRow}>
                        <a href="mailto:Terrasana@outlook.be" style={styles.socialBtn} aria-label="Email">✉️</a>
                        <Link to="/contact" style={styles.socialBtn} aria-label="Contact">📞</Link>
                        <Link to="/evenements" style={styles.socialBtn} aria-label="Événements">📅</Link>
                    </div>
                </div>

                <div style={styles.col}>
                    <div style={styles.colTitle}>{t.assoc}</div>
                    <div style={styles.linksList}>
                        <Link to="/about" style={styles.footerLink}>{t.about}</Link>
                        <Link to="/about" style={styles.footerLink}>{t.mission}</Link>
                        <Link to="/sponsors" style={styles.footerLink}>{t.partners}</Link>
                        <Link to="/contact" style={styles.footerLink}>{t.contactUs}</Link>
                    </div>
                </div>

                <div style={styles.col}>
                    <div style={styles.colTitle}>{t.volunteers}</div>
                    <div style={styles.linksList}>
                        <Link to="/volunteer/register" style={styles.footerLink}>{t.become}</Link>
                        <Link to="/evenements" style={styles.footerLink}>{t.calendar}</Link>
                        <Link to="/volunteer/dashboard" style={styles.footerLink}>{t.mySpace}</Link>
                        <Link to="/aide" style={styles.footerLink}>{t.faq}</Link>
                    </div>
                </div>

                <div style={styles.col}>
                    <div style={styles.colTitle}>{t.contact}</div>
                    <div style={styles.linksList}>
                        <div style={styles.contactLine}>53/3, 1200 Woluwe-Saint-Lambert<br />Bruxelles, Belgique</div>
                        <a href="mailto:Terrasana@outlook.be" style={styles.footerLink}>Terrasana@outlook.be</a>
                        <div style={styles.contactLine}>Lun - Ven : 8h00 - 16h00</div>
                    </div>
                </div>
            </div>

            <div style={styles.bottom}>
                <div style={styles.bottomLeft}>&copy; 2025 Terra Sana ASBL · {t.rights}</div>
                <div style={styles.bottomLinks}>
                    <Link to="/confidentialite" style={styles.bottomLink}>{t.privacy}</Link>
                    <Link to="/conditions" style={styles.bottomLink}>{t.terms}</Link>
                    <Link to="/cookies" style={styles.bottomLink}>{t.cookies}</Link>
                </div>
            </div>
        </footer>
    );
}

const styles = {
    footer: { background: "#173C29", padding: "48px 40px 20px" },
    top: { display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "40px", marginBottom: "32px" },
    brandCol: { display: "flex", flexDirection: "column" },
    brandRow: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" },
    logoIcon: { width: "34px", height: "34px", borderRadius: "8px", background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" },
    brandName: { fontSize: "15px", fontWeight: "700", color: "#fff" },
    desc: { fontSize: "13px", color: "#a8c2ae", lineHeight: "1.7", marginBottom: "18px", maxWidth: "280px" },
    socialRow: { display: "flex", gap: "8px" },
    socialBtn: { width: "32px", height: "32px", borderRadius: "8px", background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", textDecoration: "none" },
    col: { display: "flex", flexDirection: "column" },
    colTitle: { fontSize: "11px", fontWeight: "700", color: "#8fae97", marginBottom: "14px", textTransform: "uppercase", letterSpacing: "1px" },
    linksList: { display: "flex", flexDirection: "column", gap: "10px" },
    footerLink: { fontSize: "13px", color: "#c3d7c8", textDecoration: "none" },
    contactLine: { fontSize: "13px", color: "#c3d7c8", lineHeight: "1.6" },
    bottom: { display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "20px", borderTop: "1px solid rgba(255,255,255,0.08)", flexWrap: "wrap", gap: "10px" },
    bottomLeft: { fontSize: "12px", color: "#7a9a83" },
    bottomLinks: { display: "flex", gap: "20px" },
    bottomLink: { fontSize: "12px", color: "#7a9a83", textDecoration: "none" }
};

export default Footer;
