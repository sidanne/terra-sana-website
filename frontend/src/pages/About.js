function About() {
    return (
        <div style={styles.container}>
            <h1 style={styles.title}>A propos de Terra Sana</h1>
            <div style={styles.card}>
                <h2 style={styles.subtitle}>Notre mission</h2>
                <p style={styles.text}>Terra Sana ASBL est une organisation a but non lucratif fondee en 2019 a Bruxelles. Elle soutient les producteurs locaux et promote le circuit court.</p>
            </div>
            <div style={styles.card}>
                <h2 style={styles.subtitle}>Nos valeurs</h2>
                <ul style={styles.list}>
                    <li>Soutien aux producteurs locaux</li>
                    <li>Promotion du circuit court</li>
                    <li>Reduction des dechets et recyclage</li>
                    <li>Accompagnement des personnes en decrochage</li>
                    <li>Encouragement des pratiques durables</li>
                </ul>
            </div>
            <div style={styles.card}>
                <h2 style={styles.subtitle}>Notre equipe</h2>
                <p style={styles.text}>Notre equipe est composee d ouvriers en reinsertion, d employes, de benevoles et de stagiaires.</p>
            </div>
            <div style={styles.devise}>
                <p style={styles.deviseText}>Ils ont fait, ils font et ils feront encore, pour etre fiers de ce qu ils laisseront aux generations presentes et futures.</p>
            </div>
        </div>
    );
}

const styles = {
    container: { padding: "40px 32px", maxWidth: "800px", margin: "0 auto" },
    title: { fontSize: "28px", fontWeight: "bold", color: "#1a1a1a", marginBottom: "24px" },
    card: { background: "#fff", border: "1px solid #e0e0e0", borderRadius: "10px", padding: "24px", marginBottom: "20px" },
    subtitle: { fontSize: "18px", fontWeight: "bold", color: "#2e7d32", marginBottom: "12px" },
    text: { fontSize: "14px", color: "#555", lineHeight: "1.8" },
    list: { fontSize: "14px", color: "#555", lineHeight: "2", paddingLeft: "20px" },
    devise: { background: "#e8f5e9", borderLeft: "4px solid #4caf50", padding: "20px 24px", borderRadius: "0 10px 10px 0" },
    deviseText: { fontSize: "14px", color: "#2e7d32", fontStyle: "italic", lineHeight: "1.8" }
};

export default About;
