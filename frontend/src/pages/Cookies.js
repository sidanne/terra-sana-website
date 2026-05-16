function Cookies() {
    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Politique de cookies</h1>
            <p style={styles.date}>Derniere mise a jour : 2025</p>
            <div style={styles.section}><h2 style={styles.h2}>1. Qu est-ce qu un cookie ?</h2><p style={styles.p}>Un cookie est un petit fichier texte stocke sur votre appareil lors de la visite d un site web. Il permet au site de se souvenir de certaines informations sur votre visite.</p></div>
            <div style={styles.section}><h2 style={styles.h2}>2. Cookies utilises</h2><p style={styles.p}>Ce site utilise uniquement des cookies techniques necessaires au bon fonctionnement du site (authentification administrateur via JWT). Aucun cookie publicitaire ou de tracking n est utilise.</p></div>
            <div style={styles.section}><h2 style={styles.h2}>3. Gestion des cookies</h2><p style={styles.p}>Vous pouvez desactiver les cookies dans les parametres de votre navigateur. Cela peut affecter le fonctionnement de certaines fonctionnalites du site.</p></div>
            <div style={styles.section}><h2 style={styles.h2}>4. Contact</h2><p style={styles.p}>Terra Sana ASBL — Terrasana@outlook.be</p></div>
        </div>
    );
}
const styles = { container: { padding: "40px 32px", maxWidth: "800px", margin: "0 auto", minHeight: "100vh" }, title: { fontSize: "28px", fontWeight: "bold", color: "#1a1a1a", marginBottom: "8px" }, date: { fontSize: "13px", color: "#aaa", marginBottom: "32px" }, section: { background: "#fff", border: "1px solid #e0e0e0", borderRadius: "12px", padding: "24px", marginBottom: "16px" }, h2: { fontSize: "16px", fontWeight: "bold", color: "#2e7d32", marginBottom: "12px" }, p: { fontSize: "14px", color: "#555", lineHeight: "1.8" } };
export default Cookies;
