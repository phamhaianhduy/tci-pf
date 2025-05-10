

import redirect from "./redirect";
const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("expiryToken");
    localStorage.removeItem("refreshToken");
    redirect('/login');
}

export default logout;