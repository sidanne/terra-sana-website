const T = {
    fr: {
        title: "Politique de confidentialité", date: "Dernière mise à jour : 2025",
        sections: [
            ["1. Collecte des données", "Terra Sana ASBL collecte uniquement les données personnelles que vous nous fournissez volontairement via le formulaire de contact (nom, email, message). Ces données sont utilisées uniquement pour répondre à vos demandes."],
            ["2. Utilisation des données", "Vos données ne sont jamais vendues, partagées ou transmises à des tiers. Elles sont conservées de manière sécurisée dans notre base de données et utilisées uniquement pour la gestion interne de l'association."],
            ["3. Vos droits", "Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression de vos données. Pour exercer ces droits, contactez-nous à : Terrasana@outlook.be"],
            ["4. Contact", "Terra Sana ASBL — 53/3, 1200 Woluwe-Saint-Lambert, Bruxelles — Terrasana@outlook.be"]
        ]
    },
    en: {
        title: "Privacy policy", date: "Last updated: 2025",
        sections: [
            ["1. Data collection", "Terra Sana ASBL only collects the personal data you voluntarily provide via the contact form (name, email, message). This data is used solely to respond to your requests."],
            ["2. Use of data", "Your data is never sold, shared or transferred to third parties. It is stored securely in our database and used only for the association's internal management."],
            ["3. Your rights", "In accordance with the GDPR, you have the right to access, rectify and delete your data. To exercise these rights, contact us at: Terrasana@outlook.be"],
            ["4. Contact", "Terra Sana ASBL — 53/3, 1200 Woluwe-Saint-Lambert, Brussels — Terrasana@outlook.be"]
        ]
    },
    nl: {
        title: "Privacybeleid", date: "Laatst bijgewerkt: 2025",
        sections: [
            ["1. Gegevensverzameling", "Terra Sana ASBL verzamelt enkel de persoonsgegevens die u vrijwillig verstrekt via het contactformulier (naam, e-mail, bericht). Deze gegevens worden uitsluitend gebruikt om op uw verzoeken te reageren."],
            ["2. Gebruik van gegevens", "Uw gegevens worden nooit verkocht, gedeeld of doorgegeven aan derden. Ze worden veilig bewaard in onze database en enkel gebruikt voor het intern beheer van de vereniging."],
            ["3. Uw rechten", "In overeenstemming met de AVG heeft u recht op inzage, rectificatie en verwijdering van uw gegevens. Om deze rechten uit te oefenen, contacteer ons via: Terrasana@outlook.be"],
            ["4. Contact", "Terra Sana ASBL — 53/3, 1200 Sint-Lambrechts-Woluwe, Brussel — Terrasana@outlook.be"]
        ]
    }
};

function Confidentialite({ lang }) {
    const t = T[lang] || T.fr;
    return (
        <div style={styles.container}>
            <h1 style={styles.title}>{t.title}</h1>
            <p style={styles.date}>{t.date}</p>
            {t.sections.map(([h2, p], i) => (
                <div key={i} style={styles.section}>
                    <h2 style={styles.h2}>{h2}</h2>
                    <p style={styles.p}>{p}</p>
                </div>
            ))}
        </div>
    );
}
const styles = { container: { padding: "40px 32px", maxWidth: "800px", margin: "0 auto", minHeight: "100vh" }, title: { fontSize: "28px", fontWeight: "bold", color: "#1B1B1B", marginBottom: "8px" }, date: { fontSize: "13px", color: "#aaa", marginBottom: "32px" }, section: { background: "#fff", border: "1px solid #e0e0e0", borderRadius: "12px", padding: "24px", marginBottom: "16px" }, h2: { fontSize: "16px", fontWeight: "bold", color: "#2e7d32", marginBottom: "12px" }, p: { fontSize: "14px", color: "#555", lineHeight: "1.8" } };
export default Confidentialite;
