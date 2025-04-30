const verifyTokenExpiry = (token) => {
  if (!token || typeof token !== 'string' || !token.includes('.')) {
    console.warn('Invalid token format');
    localStorage.removeItem('token');
    window.location.href = '/login';
    return;
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (Date.now() >= payload.exp * 1000) {
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
