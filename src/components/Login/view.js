import { useState } from 'react';
import ForgotPassword from '../ForgotPasswordForm/view';
import LoginForm from '../LoginForm/view';
import SwitchSection from '../SwitchSection/view';

const Login = () => {
  const [section, setSection] = useState('login');

  return (
    <div>
      {section === 'login' && <LoginForm />}
      {section === 'forgot' && <ForgotPassword />}
      <SwitchSection onChangeSection={setSection} />
    </div>
  );
};

export default Login;
