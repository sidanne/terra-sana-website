const T = {
    fr: {
        title: "Conditions d'utilisation", date: "Dernière mise à jour : 2025",
        sections: [
            ["1. Acceptation", "En utilisant ce site, vous acceptez les présentes conditions d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser ce site."],
            ["2. Utilisation du site", "Ce site est fourni à titre informatif. Terra Sana ASBL se réserve le droit de modifier, suspendre ou interrompre le site à tout moment sans préavis."],
            ["3. Propriété intellectuelle", "Tout le contenu de ce site (textes, images, logos) est la propriété de Terra Sana ASBL et est protégé par le droit d'auteur."],
            ["4. Contact", "Terra Sana ASBL — 53/3, 1200 Woluwe-Saint-Lambert, Bruxelles — Terrasana@outlook.be"]
        ]
    },
    en: {
        title: "Terms of use", date: "Last updated: 2025",
        sections: [
            ["1. Acceptance", "By using this site, you accept these terms of use. If you do not accept these terms, please do not use this site."],
            ["2. Use of the site", "This site is provided for informational purposes. Terra Sana ASBL reserves the right to modify, suspend or discontinue the site at any time without notice."],
            ["3. Intellectual property", "All content on this site (text, images, logos) is the property of Terra Sana ASBL and is protected by copyright."],
            ["4. Contact", "Terra Sana ASBL — 53/3, 1200 Woluwe-Saint-Lambert, Brussels — Terrasana@outlook.be"]
        ]
    },
    nl: {
        title: "Gebruiksvoorwaarden", date: "Laatst bijgewerkt: 2025",
        sections: [
            ["1. Aanvaarding", "Door deze site te gebruiken, aanvaardt u deze gebruiksvoorwaarden. Als u deze voorwaarden niet aanvaardt, gebruik deze site dan niet."],
            ["2. Gebruik van de site", "Deze site wordt louter ter informatie aangeboden. Terra Sana ASBL behoudt zich het recht voor de site op elk moment te wijzigen, op te schorten of stop te zetten zonder voorafgaande kennisgeving."],
            ["3. Intellectuele eigendom", "Alle inhoud van deze site (teksten, afbeeldingen, logo's) is eigendom van Terra Sana ASBL en wordt beschermd door het auteursrecht."],
            ["4. Contact", "Terra Sana ASBL — 53/3, 1200 Sint-Lambrechts-Woluwe, Brussel — Terrasana@outlook.be"]
        ]
    }
};

function Conditions({ lang }) {
    const t = T[lang] || T.fr;
    return (
        <div style={styles.container}>
            <h1 style={styles.title}>{t.title}</h1>
            <p style={styles.date}>{t.date}</p>
            {t.sections.map(([h2, p], i) => (
                <div key={i} style={styles.section}><h2 style={styles.h2}>{h2}</h2><p style={styles.p}>{p}</p></div>
            ))}
        </div>
    );
}
const styles = { container: { padding: "40px 32px", maxWidth: "800px", margin: "0 auto", minHeight: "100vh" }, title: { fontSize: "28px", fontWeight: "bold", color: "#1B1B1B", marginBottom: "8px" }, date: { fontSize: "13px", color: "#aaa", marginBottom: "32px" }, section: { background: "#fff", border: "1px solid #e0e0e0", borderRadius: "12px", padding: "24px", marginBottom: "16px" }, h2: { fontSize: "16px", fontWeight: "bold", color: "#2e7d32", marginBottom: "12px" }, p: { fontSize: "14px", color: "#555", lineHeight: "1.8" } };
export default Conditions;
