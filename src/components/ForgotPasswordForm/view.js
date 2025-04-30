import classes from "../Login/Login.module.css";
import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Button from 'react-bootstrap/esm/Button';
import { userStore } from "../../stores/UserStore";
import { useNavigate } from "react-router-dom";

const ForgotPasswordForm = () => {

  const forgotPasswordSchema = Yup.object().shape({
    email: Yup.string().email('Email is invalid').required('Email is required'),
  });

  const navigate = useNavigate();

  const handleSubmit = async (values, { setErrors }) => {
    try {
      await userStore.forgotPasswordUser(values.email);
      navigate(`/login`);
    } catch (error) {
      setErrors({ email: error.response.data.message });
    }
  };

  return (

    <div className={classes["login-container"]}>
      <h2 className={classes["title"]}>Forgot Password</h2>
      <Formik
        initialValues={{ email: '' }}
        validationSchema={forgotPasswordSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className={classes['form-group']}>
              <label htmlFor='email'>Email</label>
              <Field name='email' placeholder='Enter your email'/>
              <ErrorMessage name='email' component='div' style={{ color: 'red' }} />
            </div>
            <Button type='submit' disabled={isSubmitting}>Reset password</Button>
          </Form>
        )}
      </Formik>

    </div>
  );
};

export default ForgotPasswordForm;
