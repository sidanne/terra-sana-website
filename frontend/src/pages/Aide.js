const T = {
    fr: {
        title: "Centre d'aide", sub: "Retrouvez les réponses aux questions les plus fréquentes",
        faqs: [
            ["Comment accéder aux applications ?", "Allez sur la page Projets et cliquez sur le bouton Ouvrir de l'application souhaitée."],
            ["Comment envoyer un message à Terra Sana ?", "Allez sur la page Contact, remplissez le formulaire et cliquez sur Envoyer le message."],
            ["Comment postuler comme bénévole ou stagiaire ?", "Allez sur la page Bénévolat et Stage et remplissez le formulaire de candidature."],
            ["Comment se connecter à l'espace admin ?", "Cliquez sur Connexion dans la barre de navigation et entrez vos identifiants administrateur."],
            ["Le site est disponible en quelle langue ?", "Le site est disponible en français, anglais et néerlandais. Utilisez le sélecteur de langue dans la barre de navigation."]
        ],
        contactTitle: "Vous n'avez pas trouvé votre réponse ?", contactDesc: "Contactez-nous directement à Terrasana@outlook.be", contactBtn: "Nous contacter"
    },
    en: {
        title: "Help centre", sub: "Find answers to the most frequently asked questions",
        faqs: [
            ["How do I access the applications?", "Go to the Projects page and click the Open button of the application you want."],
            ["How do I send a message to Terra Sana?", "Go to the Contact page, fill in the form and click Send message."],
            ["How do I apply as a volunteer or intern?", "Go to the Volunteering and Internship page and fill in the application form."],
            ["How do I log in to the admin area?", "Click Log in in the navigation bar and enter your administrator credentials."],
            ["What languages is the site available in?", "The site is available in French, English and Dutch. Use the language selector in the navigation bar."]
        ],
        contactTitle: "Couldn't find your answer?", contactDesc: "Contact us directly at Terrasana@outlook.be", contactBtn: "Contact us"
    },
    nl: {
        title: "Helpcentrum", sub: "Vind antwoorden op de meest gestelde vragen",
        faqs: [
            ["Hoe krijg ik toegang tot de applicaties?", "Ga naar de pagina Projecten en klik op de knop Openen van de gewenste applicatie."],
            ["Hoe stuur ik een bericht naar Terra Sana?", "Ga naar de contactpagina, vul het formulier in en klik op Bericht versturen."],
            ["Hoe solliciteer ik als vrijwilliger of stagiair?", "Ga naar de pagina Vrijwilligerswerk en Stage en vul het aanvraagformulier in."],
            ["Hoe log ik in op de admin-omgeving?", "Klik op Inloggen in de navigatiebalk en voer uw administratorgegevens in."],
            ["In welke talen is de site beschikbaar?", "De site is beschikbaar in het Frans, Engels en Nederlands. Gebruik de taalkiezer in de navigatiebalk."]
        ],
        contactTitle: "Geen antwoord gevonden?", contactDesc: "Neem rechtstreeks contact met ons op via Terrasana@outlook.be", contactBtn: "Contacteer ons"
    }
};

function Aide({ lang }) {
    const t = T[lang] || T.fr;
    return (
        <div style={styles.container}>
            <h1 style={styles.title}>{t.title}</h1>
            <p style={styles.sub}>{t.sub}</p>
            <div style={styles.faqList}>
                {t.faqs.map(([q, r], i) => (
                    <div key={i} style={styles.faqItem}>
                        <div style={styles.faqQ}>{q}</div>
                        <div style={styles.faqA}>{r}</div>
                    </div>
                ))}
            </div>
            <div style={styles.contactBox}>
                <h2 style={styles.contactTitle}>{t.contactTitle}</h2>
                <p style={styles.contactDesc}>{t.contactDesc}</p>
                <a href="/contact" style={styles.contactBtn}>{t.contactBtn}</a>
            </div>
        </div>
    );
}
const styles = { container: { padding: "40px 32px", maxWidth: "800px", margin: "0 auto", minHeight: "100vh" }, title: { fontSize: "28px", fontWeight: "bold", color: "#1B1B1B", marginBottom: "8px" }, sub: { fontSize: "14px", color: "#888", marginBottom: "32px" }, faqList: { display: "flex", flexDirection: "column", gap: "12px", marginBottom: "32px" }, faqItem: { background: "#fff", border: "1px solid #e0e0e0", borderRadius: "12px", padding: "20px", borderLeft: "4px solid #2D6A4F" }, faqQ: { fontSize: "15px", fontWeight: "bold", color: "#1B1B1B", marginBottom: "8px" }, faqA: { fontSize: "14px", color: "#555", lineHeight: "1.7" }, contactBox: { background: "#1B1B1B", borderRadius: "16px", padding: "32px", textAlign: "center" }, contactTitle: { fontSize: "18px", fontWeight: "bold", color: "#fff", marginBottom: "10px" }, contactDesc: { fontSize: "14px", color: "#888", marginBottom: "20px" }, contactBtn: { background: "#2D6A4F", color: "#fff", fontSize: "14px", padding: "10px 24px", borderRadius: "8px", textDecoration: "none", fontWeight: "600" } };
export default Aide;
