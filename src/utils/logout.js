

const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("expiryToken");
    window.location.href = '/login';
}

export default logout;