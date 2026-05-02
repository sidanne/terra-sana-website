function MessageCard({ m, onReply, onDelete, onIgnore, formatDate }) {
    return (
        <div style={styles.card}>
            <div style={styles.top}>
                <div style={styles.avatar}>{m.name.charAt(0).toUpperCase()}</div>
                <div style={styles.info}>
                    <div style={styles.name}>{m.name}</div>
                    <div style={styles.email}>{m.email}</div>
                </div>
                <div style={styles.date}>{formatDate(m.createdAt)}</div>
            </div>
            <div style={styles.message}>{m.message}</div>
            <div style={styles.actions}>
                <button onClick={() => onReply(m)} style={styles.replyBtn}>
                    Repondre
                </button>
                <button onClick={() => onDelete(m.id)} style={styles.deleteBtn}>
                    Supprimer
                </button>
                <button onClick={() => onIgnore()} style={styles.ignoreBtn}>
                    Ignorer
                </button>
            </div>
        </div>
    );
}

const styles = {
    card: { background: "#fff", border: "1px solid #e8e8e8", borderRadius: "12px", padding: "20px", marginBottom: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" },
    top: { display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" },
    avatar: { width: "42px", height: "42px", borderRadius: "50%", background: "#e8f5e9", color: "#2e7d32", fontWeight: "bold", fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
    info: { flex: 1 },
    name: { fontSize: "14px", fontWeight: "600", color: "#1a1a1a", marginBottom: "2px" },
    email: { fontSize: "12px", color: "#4caf50" },
    date: { fontSize: "11px", color: "#bbb", whiteSpace: "nowrap" },
    message: { fontSize: "14px", color: "#555", lineHeight: "1.7", padding: "12px 16px", background: "#f9f9f9", borderRadius: "8px", marginBottom: "14px", borderLeft: "3px solid #e8f5e9" },
    actions: { display: "flex", gap: "8px" },
    replyBtn: { background: "#e8f5e9", color: "#2e7d32", border: "1px solid #c8e6c9", padding: "6px 16px", borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontWeight: "600" },
    deleteBtn: { background: "#ffebee", color: "#c62828", border: "1px solid #ffcdd2", padding: "6px 16px", borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontWeight: "600" },
    ignoreBtn: { background: "#f5f5f5", color: "#999", border: "1px solid #e0e0e0", padding: "6px 16px", borderRadius: "6px", cursor: "pointer", fontSize: "12px" }
};

export default MessageCard;
