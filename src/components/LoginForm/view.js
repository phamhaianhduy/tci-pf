import classes from '../../assets/css/Form.module.css';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import Button from 'react-bootstrap/esm/Button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import encryptPassword from '../../utils/encryptPassword';

const endpoint = process.env.REACT_APP_RDS_END_POINT;

const LoginForm = () => {
  const navigate = useNavigate();

  const loginSchema = Yup.object().shape({
    userName: Yup.string().required('Username is required'),
    password: Yup.string().required('Passowrd is required').min(6, 'Password greater than > 6 character length.'),
  });

  const handleSubmit = async (values) => {
    try {
      // Encrypt password.
      const encryptedPassword = encryptPassword(values.password);
      values = {...values, password: encryptedPassword};

      const res = await axios.post(
        `${endpoint}/login`,
        values,
      );

      // Set token and expiry token.
      const minutes = 15;
      const expiryToken = Date.now() + minutes * 60 * 1000;
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('expiryToken', expiryToken);
      localStorage.setItem('refreshToken', res.data.refreshToken);

      toast.success('Login successfully')
      navigate('/users/me');
    } catch (error) {
      toast.warn(error.response.data.error.message);
    }
  };

  return (
    <div className={classes['login-container']}>
      <h2 className={classes['title']}>Login</h2>
      <Formik
        initialValues={{
          userName: '',
          password: '',
        }}
        validationSchema={loginSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className={classes['form-group']}>
              <label htmlFor='userName'>Username</label>
              <Field name='userName' placeholder='Enter your username' />
            </div>
            <div className={classes['form-group']}>
              <label htmlFor='password'>Password</label>
              <Field
                name='password'
                placeholder='Enter your password'
                type='password'
              />
            </div>
            <Button type='submit' disabled={isSubmitting}>
              Login
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default LoginForm;
