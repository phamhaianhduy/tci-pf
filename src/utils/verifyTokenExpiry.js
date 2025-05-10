import axios from 'axios';
import { toast } from 'react-toastify';

const endpoint = process.env.REACT_APP_RDS_END_POINT;

const verifyTokenExpiry = async (token) => {
  if (!token || typeof token !== 'string' || !token.includes('.')) {
    console.warn('Invalid token format');
    localStorage.removeItem('token');
    window.location.href = '/login';
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (Date.now() >= payload.exp * 1000) {

      const refreshToken = localStorage.getItem('refreshToken');
      // Refresh token.
      try {
        const res = await axios.post(
          `${endpoint}/refresh-token`,
          { refreshToken },
        );

        if (res.data.token) {
          toast.success(res.data.message);

          const expiryToken = Date.now() + 15 * 60 * 1000;
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('expiryToken', expiryToken);
        }

      } catch (errorRefreshToken) {
        toast.warn(errorRefreshToken.response.data.error.message);
      }

      localStorage.removeItem('token');
      window.location.href = '/login';
    }
  } catch (error) {
    console.error('Failed to parse token:', error);
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
};

export default verifyTokenExpiry;
