import classes from '../../assets/css/Form.module.css';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import Button from 'react-bootstrap/esm/Button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import duyphaPublicKey from '../../keys/duyphaPublicKey';
import encryptPassword from '../../utils/encryptPassword';

const endpoint = process.env.REACT_APP_RDS_END_POINT;

const LoginForm = () => {
  const navigate = useNavigate();

  const loginSchema = Yup.object().shape({
    userName: Yup.string().required('Username is required'),
    password: Yup.string().required('Passowrd is required').min(6, 'Password greater than > 6 character length.'),
  });

  const handleSubmit = async (values, { setFieldError }) => {
    try {
      // Encrypt password.
      const encryptedPassword = encryptPassword(values.password);
      values = {...values, password: encryptedPassword};
      console.log(values);
      const res = await axios.post(
        `${endpoint}/login`,
        values,
      );
      localStorage.setItem('token', res.data.token);
      toast.success('Login successfully')
      navigate('/users/me');
    } catch (error) {
      const { field, message } = error.response.data;
      setFieldError(field, message);
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
              <ErrorMessage
                name='userName'
                component='div'
                style={{ color: 'red' }}
              />
            </div>
            <div className={classes['form-group']}>
              <label htmlFor='password'>Password</label>
              <Field
                name='password'
                placeholder='Enter your password'
                type='password'
              />
              <ErrorMessage
                name='password'
                component='div'
                style={{ color: 'red' }}
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
