const API_URL = "http://localhost:8080/api";

export const getProjects = async () => {
    const res = await fetch(`${API_URL}/projects`);
    return res.json();
};

export const getPosts = async () => {
    const res = await fetch(`${API_URL}/posts`);
    return res.json();
};

export const sendContact = async (data) => {
    const res = await fetch(`${API_URL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Erreur lors de l'envoi du message.");
    return res.json();
};
