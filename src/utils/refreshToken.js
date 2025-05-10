import axios from "axios";
import logout from "./logout";

const endpoint = process.env.REACT_APP_RDS_END_POINT;

const refreshToken = async () => {
  const token = localStorage.getItem("refreshToken");
  if (token) {
    try {
      const res = await axios.post(`${endpoint}/refresh-token`, {
        refreshToken: token,
      });

      if (res.data.token) {
        // Set expiry token
        const minutes = 15;
        const expiryToken = Date.now() + minutes * 60 * 1000;
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("expiryToken", expiryToken);
      }
    } catch (errorRefreshToken) {
      logout();
    }
  }
};

export default refreshToken;
