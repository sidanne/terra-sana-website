function About() {
    const equipe = [
        { initiales: "DS", nom: "Didier Seraye", role: "Directeur" },
        { initiales: "JD", nom: "Jean Dupont", role: "Responsable projets" },
        { initiales: "AL", nom: "Amina Lotti", role: "Coordinatrice benevoles" },
        { initiales: "PB", nom: "Pierre Bernard", role: "Charge formation" },
        { initiales: "AT", nom: "Alain Tchouapi", role: "Developpeur web" }
    ];

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>A propos de Terra Sana</h1>

            <div style={styles.card}>
                <h2 style={styles.subtitle}>Notre mission</h2>
                <p style={styles.text}>Terra Sana ASBL est une organisation a but non lucratif fondee en 2019 a Bruxelles. Elle a pour mission de soutenir les producteurs locaux, de promouvoir le circuit court et de sensibiliser a un modele durable base sur la reduction des dechets, le tri, le recyclage et le remploi.</p>
            </div>

            <div style={styles.card}>
                <h2 style={styles.subtitle}>Nos valeurs</h2>
                <div style={styles.valeurs}>
                    <div style={styles.valeur}><div style={styles.valeurIcon}>1</div><div><div style={styles.valeurTitre}>Circuit court</div><div style={styles.valeurTexte}>Soutien aux producteurs locaux et promotion du circuit court</div></div></div>
                    <div style={styles.valeur}><div style={styles.valeurIcon}>2</div><div><div style={styles.valeurTitre}>Durabilite</div><div style={styles.valeurTexte}>Reduction des dechets par le tri, le recyclage et le remploi</div></div></div>
                    <div style={styles.valeur}><div style={styles.valeurIcon}>3</div><div><div style={styles.valeurTitre}>Insertion</div><div style={styles.valeurTexte}>Accompagnement des personnes en situation de decrochage</div></div></div>
                    <div style={styles.valeur}><div style={styles.valeurIcon}>4</div><div><div style={styles.valeurTitre}>Numerique</div><div style={styles.valeurTexte}>Accompagnement numerique aux projets locaux</div></div></div>
                    <div style={styles.valeur}><div style={styles.valeurIcon}>5</div><div><div style={styles.valeurTitre}>Sensibilisation</div><div style={styles.valeurTexte}>Activites de sensibilisation aux pratiques durables</div></div></div>
                    <div style={styles.valeur}><div style={styles.valeurIcon}>6</div><div><div style={styles.valeurTitre}>Alimentation</div><div style={styles.valeurTexte}>Alimentation saine dans les ecoles et entreprises</div></div></div>
                </div>
            </div>

            <div style={styles.card}>
                <h2 style={styles.subtitle}>Notre equipe</h2>
                <p style={styles.text}>Notre equipe est composee d ouvriers en reinsertion, d employes permanents, de benevoles et de stagiaires qui contribuent a des projets concrets.</p>
                <div style={styles.equipeGrid}>
                    {equipe.map((m, i) => (
                        <div key={i} style={m.nom === "Alain Tchouapi" ? {...styles.membreCard, ...styles.membreCardSpecial} : styles.membreCard}>
                            <div style={m.nom === "Alain Tchouapi" ? {...styles.avatar, ...styles.avatarSpecial} : styles.avatar}>{m.initiales}</div>
                            <div style={styles.membreNom}>{m.nom}</div>
                            <div style={styles.membreRole}>{m.role}</div>
                            {m.nom === "Alain Tchouapi" && <div style={styles.stagiaireBadge}>Stagiaire</div>}
                        </div>
                    ))}
                </div>
            </div>

            <div style={styles.devise}>
                <p style={styles.deviseText}>Ils ont fait, ils font et ils feront encore, pour etre fiers de ce qu ils laisseront aux generations presentes et futures.</p>
            </div>

            <div style={styles.infoCard}>
                <h2 style={styles.subtitle}>Nos coordonnees</h2>
                <div style={styles.infoGrid}>
                    <div style={styles.infoItem}>
                        <div style={styles.infoIconBox}>ADR</div>
                        <div><div style={styles.infoLabel}>Adresse</div><div style={styles.infoValue}>53/3, 1200 Woluwe-Saint-Lambert, Bruxelles</div></div>
                    </div>
                    <div style={styles.infoItem}>
                        <div style={styles.infoIconBox}>EML</div>
                        <div><div style={styles.infoLabel}>Email</div><a href="mailto:Terrasana@outlook.be" style={styles.infoLink}>Terrasana@outlook.be</a></div>
                    </div>
                    <div style={styles.infoItem}>
                        <div style={styles.infoIconBox}>HOR</div>
                        <div><div style={styles.infoLabel}>Horaires</div><div style={styles.infoValue}>Lundi - Vendredi : 8h00 - 16h00</div></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: { padding: "40px 32px", maxWidth: "900px", margin: "0 auto" },
    title: { fontSize: "28px", fontWeight: "bold", color: "#1a1a1a", marginBottom: "24px" },
    card: { background: "#fff", border: "1px solid #e0e0e0", borderRadius: "12px", padding: "28px", marginBottom: "20px" },
    subtitle: { fontSize: "18px", fontWeight: "bold", color: "#2e7d32", marginBottom: "16px" },
    text: { fontSize: "14px", color: "#555", lineHeight: "1.8", marginBottom: "16px" },
    valeurs: { display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "16px" },
    valeur: { display: "flex", gap: "12px", alignItems: "flex-start" },
    valeurIcon: { background: "#4caf50", color: "#fff", fontWeight: "bold", fontSize: "12px", width: "28px", height: "28px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
    valeurTitre: { fontSize: "14px", fontWeight: "bold", color: "#222", marginBottom: "4px" },
    valeurTexte: { fontSize: "13px", color: "#888", lineHeight: "1.5" },
    equipeGrid: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "16px", marginTop: "16px" },
    membreCard: { textAlign: "center", padding: "16px", background: "#f9f9f9", borderRadius: "10px", border: "1px solid #e0e0e0" },
    membreCardSpecial: { border: "2px solid #4caf50", background: "#f1f8e9" },
    avatar: { width: "56px", height: "56px", borderRadius: "50%", background: "#4caf50", color: "#fff", fontSize: "16px", fontWeight: "bold", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" },
    avatarSpecial: { background: "#2e7d32", width: "64px", height: "64px", fontSize: "18px" },
    membreNom: { fontSize: "13px", fontWeight: "bold", color: "#222", marginBottom: "4px" },
    membreRole: { fontSize: "12px", color: "#888" },
    stagiaireBadge: { marginTop: "8px", background: "#4caf50", color: "#fff", fontSize: "10px", padding: "2px 10px", borderRadius: "20px", display: "inline-block" },
    devise: { background: "#e8f5e9", borderLeft: "4px solid #4caf50", padding: "20px 24px", borderRadius: "0 10px 10px 0", marginBottom: "20px" },
    deviseText: { fontSize: "14px", color: "#2e7d32", fontStyle: "italic", lineHeight: "1.8" },
    infoCard: { background: "#fff", border: "1px solid #e0e0e0", borderRadius: "12px", padding: "28px", marginBottom: "20px" },
    infoGrid: { display: "flex", flexDirection: "column", gap: "16px" },
    infoItem: { display: "flex", gap: "14px", alignItems: "flex-start" },
    infoIconBox: { background: "#e8f5e9", color: "#2e7d32", fontWeight: "bold", fontSize: "10px", padding: "6px 8px", borderRadius: "6px", flexShrink: 0 },
    infoLabel: { fontSize: "12px", color: "#4caf50", fontWeight: "bold", marginBottom: "4px" },
    infoValue: { fontSize: "14px", color: "#555" },
    infoLink: { fontSize: "14px", color: "#4caf50", textDecoration: "none" }
};

export default About;
