import classes from "../Login/Login.module.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Button from "react-bootstrap/esm/Button";
import { userStore } from "../../stores/UserStore";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { observer } from "mobx-react-lite";

const ChangePassword = () => {
  const changePasswordSchema = Yup.object().shape({
    password: Yup.string()
    .required("Passowrd is required")
    .min(8, "Password greater than or equal 8 character length.")
    .test("isStrong", "Password is not secure.", (value) => {
      if (!value) {
        return false;
      }

      const hasUper = /[A-Z]/.test(value);
      const hasLower = /[a-z]/.test(value);
      const hasNumber = /[0-9]/.test(value);
      const hasSpecialCharacter = /[!@#$%^&*(),.?":{}|<>]/.test(value);
      return hasUper && hasLower && hasNumber && hasSpecialCharacter;
    }),
    confirmPassword: Yup.string()
      .required("Confirm password is required")
      .oneOf(
        [Yup.ref("password"), null],
        "Confirm password must match password"
      ),
  });

  useEffect(() => {
    const getProfile = async () => {
      await userStore.getUserByMe();
    };
    getProfile();
    return () => userStore.clearUserDetail();
  }, []);

  const navigate = useNavigate();

  const handleSubmit = async (data, { isSubmitting } ) => {
    const id = userStore.userDetailByMe.id;
    const payload = { id, password: data.password };
    try {
      await userStore.updateExpiredPasswordUser(payload, navigate);
    } catch (error) {
      console.error(error.message);
    } finally {
      isSubmitting(false);
    }
  };

  return (
    <div className={classes["login-container"]}>
      <h2 className={classes["title"]}>Change Password</h2>
      <Formik
        initialValues={{ password: "", confirmPassword: "" }}
        validationSchema={changePasswordSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div>
              <div className={classes["form-group"]}>
                <label htmlFor="password">New Password</label>
                <Field
                  name="password"
                  placeholder="Enter your password"
                  type="password"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  style={{ color: "red" }}
                />
              </div>
              <div className={classes["form-group"]}>
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <Field
                  name="confirmPassword"
                  placeholder="Enter your confirm password"
                  type="password"
                />
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  style={{ color: "red" }}
                />
              </div>
            </div>
            <Button type="submit" disabled={isSubmitting}>
              Reset password
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default observer(ChangePassword);
