const T = {
    fr: {
        title: "Politique de cookies", date: "Dernière mise à jour : 2025",
        sections: [
            ["1. Qu'est-ce qu'un cookie ?", "Un cookie est un petit fichier texte stocké sur votre appareil lors de la visite d'un site web. Il permet au site de se souvenir de certaines informations sur votre visite."],
            ["2. Cookies utilisés", "Ce site utilise uniquement des cookies techniques nécessaires au bon fonctionnement du site (authentification administrateur via JWT). Aucun cookie publicitaire ou de tracking n'est utilisé."],
            ["3. Gestion des cookies", "Vous pouvez désactiver les cookies dans les paramètres de votre navigateur. Cela peut affecter le fonctionnement de certaines fonctionnalités du site."],
            ["4. Contact", "Terra Sana ASBL — Terrasana@outlook.be"]
        ]
    },
    en: {
        title: "Cookie policy", date: "Last updated: 2025",
        sections: [
            ["1. What is a cookie?", "A cookie is a small text file stored on your device when you visit a website. It allows the site to remember certain information about your visit."],
            ["2. Cookies used", "This site only uses technical cookies necessary for the site to function properly (admin authentication via JWT). No advertising or tracking cookies are used."],
            ["3. Managing cookies", "You can disable cookies in your browser settings. This may affect how some features of the site work."],
            ["4. Contact", "Terra Sana ASBL — Terrasana@outlook.be"]
        ]
    },
    nl: {
        title: "Cookiebeleid", date: "Laatst bijgewerkt: 2025",
        sections: [
            ["1. Wat is een cookie?", "Een cookie is een klein tekstbestand dat op uw toestel wordt opgeslagen bij het bezoeken van een website. Hierdoor kan de site zich bepaalde informatie over uw bezoek herinneren."],
            ["2. Gebruikte cookies", "Deze site gebruikt enkel technische cookies die nodig zijn voor de goede werking van de site (admin-authenticatie via JWT). Er worden geen reclame- of trackingcookies gebruikt."],
            ["3. Cookies beheren", "U kunt cookies uitschakelen in de instellingen van uw browser. Dit kan de werking van bepaalde functies van de site beïnvloeden."],
            ["4. Contact", "Terra Sana ASBL — Terrasana@outlook.be"]
        ]
    }
};

function Cookies({ lang }) {
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
export default Cookies;
