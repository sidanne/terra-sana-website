function Confidentialite() {
    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Politique de confidentialite</h1>
            <p style={styles.date}>Derniere mise a jour : 2025</p>
            <div style={styles.section}>
                <h2 style={styles.h2}>1. Collecte des donnees</h2>
                <p style={styles.p}>Terra Sana ASBL collecte uniquement les donnees personnelles que vous nous fournissez volontairement via le formulaire de contact (nom, email, message). Ces donnees sont utilisees uniquement pour repondre a vos demandes.</p>
            </div>
            <div style={styles.section}>
                <h2 style={styles.h2}>2. Utilisation des donnees</h2>
                <p style={styles.p}>Vos donnees ne sont jamais vendues, partagees ou transmises a des tiers. Elles sont conservees de maniere securisee dans notre base de donnees et utilisees uniquement pour la gestion interne de association.</p>
            </div>
            <div style={styles.section}>
                <h2 style={styles.h2}>3. Vos droits</h2>
                <p style={styles.p}>Conformement au RGPD, vous disposez d un droit d acces, de rectification et de suppression de vos donnees. Pour exercer ces droits, contactez-nous a : Terrasana@outlook.be</p>
            </div>
            <div style={styles.section}>
                <h2 style={styles.h2}>4. Contact</h2>
                <p style={styles.p}>Terra Sana ASBL — 53/3, 1200 Woluwe-Saint-Lambert, Bruxelles — Terrasana@outlook.be</p>
            </div>
        </div>
    );
}
const styles = { container: { padding: "40px 32px", maxWidth: "800px", margin: "0 auto", minHeight: "100vh" }, title: { fontSize: "28px", fontWeight: "bold", color: "#1a1a1a", marginBottom: "8px" }, date: { fontSize: "13px", color: "#aaa", marginBottom: "32px" }, section: { background: "#fff", border: "1px solid #e0e0e0", borderRadius: "12px", padding: "24px", marginBottom: "16px" }, h2: { fontSize: "16px", fontWeight: "bold", color: "#2e7d32", marginBottom: "12px" }, p: { fontSize: "14px", color: "#555", lineHeight: "1.8" } };
export default Confidentialite;
