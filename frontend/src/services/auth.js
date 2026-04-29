export const isTokenValid = () => {
    const token = localStorage.getItem("token");
    const expiry = localStorage.getItem("tokenExpiry");
    if (!token || !expiry) return false;
    if (Date.now() > parseInt(expiry)) {
        localStorage.removeItem("token");
        localStorage.removeItem("tokenExpiry");
        return false;
    }
    return true;
};

export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpiry");
};
