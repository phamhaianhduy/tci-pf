import logout from './logout';
import refreshToken from './refreshToken';

const verifyTokenExpiry = async (token) => {
  if (!token || typeof token !== 'string' || !token.includes('.')) {
    console.warn('Invalid token format');
    logout();
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (Date.now() >= payload.exp * 1000) {
      await refreshToken();
    }
  } catch (error) {
    console.error('Failed to parse token:', error);
  }
};

export default verifyTokenExpiry;
