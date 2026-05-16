function Conditions() {
    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Conditions d utilisation</h1>
            <p style={styles.date}>Derniere mise a jour : 2025</p>
            <div style={styles.section}><h2 style={styles.h2}>1. Acceptation</h2><p style={styles.p}>En utilisant ce site, vous acceptez les presentes conditions d utilisation. Si vous n acceptez pas ces conditions, veuillez ne pas utiliser ce site.</p></div>
            <div style={styles.section}><h2 style={styles.h2}>2. Utilisation du site</h2><p style={styles.p}>Ce site est fourni a titre informatif. Terra Sana ASBL se reserve le droit de modifier, suspendre ou interrompre le site a tout moment sans preavis.</p></div>
            <div style={styles.section}><h2 style={styles.h2}>3. Propriete intellectuelle</h2><p style={styles.p}>Tout le contenu de ce site (textes, images, logos) est la propriete de Terra Sana ASBL et est protege par le droit d auteur.</p></div>
            <div style={styles.section}><h2 style={styles.h2}>4. Contact</h2><p style={styles.p}>Terra Sana ASBL — 53/3, 1200 Woluwe-Saint-Lambert, Bruxelles — Terrasana@outlook.be</p></div>
        </div>
    );
}
const styles = { container: { padding: "40px 32px", maxWidth: "800px", margin: "0 auto", minHeight: "100vh" }, title: { fontSize: "28px", fontWeight: "bold", color: "#1a1a1a", marginBottom: "8px" }, date: { fontSize: "13px", color: "#aaa", marginBottom: "32px" }, section: { background: "#fff", border: "1px solid #e0e0e0", borderRadius: "12px", padding: "24px", marginBottom: "16px" }, h2: { fontSize: "16px", fontWeight: "bold", color: "#2e7d32", marginBottom: "12px" }, p: { fontSize: "14px", color: "#555", lineHeight: "1.8" } };
export default Conditions;
