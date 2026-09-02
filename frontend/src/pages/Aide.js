function Aide() {
    const faqs = [
        { q: "Comment acceder aux applications ?", r: "Allez sur la page Projets et cliquez sur le bouton Ouvrir de application souhaitee." },
        { q: "Comment envoyer un message a Terra Sana ?", r: "Allez sur la page Contact, remplissez le formulaire et cliquez sur Envoyer le message." },
        { q: "Comment postuler comme benevole ou stagiaire ?", r: "Allez sur la page Benevol et Stage et remplissez le formulaire de candidature." },
        { q: "Comment se connecter a l espace admin ?", r: "Cliquez sur Connexion dans la barre de navigation et entrez vos identifiants administrateur." },
        { q: "Le site est disponible en quelle langue ?", r: "Le site est disponible en francais, anglais et neerlandais. Utilisez le selecteur de langue dans la barre de navigation." }
    ];

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Centre d aide</h1>
            <p style={styles.sub}>Retrouvez les reponses aux questions les plus frequentes</p>
            <div style={styles.faqList}>
                {faqs.map((f, i) => (
                    <div key={i} style={styles.faqItem}>
                        <div style={styles.faqQ}>{f.q}</div>
                        <div style={styles.faqA}>{f.r}</div>
                    </div>
                ))}
            </div>
            <div style={styles.contactBox}>
                <h2 style={styles.contactTitle}>Vous n avez pas trouve votre reponse ?</h2>
                <p style={styles.contactDesc}>Contactez-nous directement a Terrasana@outlook.be</p>
                <a href="/contact" style={styles.contactBtn}>Nous contacter</a>
            </div>
        </div>
    );
}
const styles = { container: { padding: "40px 32px", maxWidth: "800px", margin: "0 auto", minHeight: "100vh" }, title: { fontSize: "28px", fontWeight: "bold", color: "#1B1B1B", marginBottom: "8px" }, sub: { fontSize: "14px", color: "#888", marginBottom: "32px" }, faqList: { display: "flex", flexDirection: "column", gap: "12px", marginBottom: "32px" }, faqItem: { background: "#fff", border: "1px solid #e0e0e0", borderRadius: "12px", padding: "20px", borderLeft: "4px solid #2D6A4F" }, faqQ: { fontSize: "15px", fontWeight: "bold", color: "#1B1B1B", marginBottom: "8px" }, faqA: { fontSize: "14px", color: "#555", lineHeight: "1.7" }, contactBox: { background: "#1B1B1B", borderRadius: "16px", padding: "32px", textAlign: "center" }, contactTitle: { fontSize: "18px", fontWeight: "bold", color: "#fff", marginBottom: "10px" }, contactDesc: { fontSize: "14px", color: "#888", marginBottom: "20px" }, contactBtn: { background: "#2D6A4F", color: "#fff", fontSize: "14px", padding: "10px 24px", borderRadius: "8px", textDecoration: "none", fontWeight: "600" } };
export default Aide;
