

const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("expiryToken");
    localStorage.removeItem("refreshToken");
}

export default logout;