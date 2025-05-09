import classes from '../../assets/css/Form.module.css';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import Button from 'react-bootstrap/esm/Button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authStore } from '../../stores/AuthStore';

const LoginForm = () => {
  const navigate = useNavigate();

  const loginSchema = Yup.object().shape({
    userName: Yup.string().required('Username is required'),
    password: Yup.string().required('Passowrd is required').min(6, 'Password greater than > 6 character length.'),
  });

  const handleSubmit = async (values) => {
    try {
      await authStore.login(values, navigate);
      navigate('/users/me');
    } catch (error) {}
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
          <Form className={classes['form-login']}>
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
            <Button className={classes['btn-submit']} type='submit' disabled={isSubmitting}>
              Login
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default LoginForm;
