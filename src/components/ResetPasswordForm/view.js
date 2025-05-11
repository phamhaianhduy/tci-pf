import classes from "../Login/Login.module.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Button from "react-bootstrap/esm/Button";
import { userStore } from "../../stores/UserStore";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import encryptPassword from '../../utils/encryptPassword';

const ResetPasswordForm = () => {
  const forgotPasswordSchema = Yup.object().shape({
    password: Yup.string()
    .required("Password is required")
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

  // Get token.
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get('token');

  const navigate = useNavigate();

  const handleSubmit = async ({ password }) => {
    try {
      const encryptedPassword = encryptPassword(password);
      await userStore.resetPasswordUser(encryptedPassword, token, navigate);
    } catch (error) {
      toast.warn(error.response.data.message);
    }
  };

  return (
    <div className={classes["login-container"]}>
      <h2 className={classes["title"]}>Reset Password</h2>
      <Formik
        initialValues={{ password: "", confirmPassword: "" }}
        validationSchema={forgotPasswordSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className={classes["form-login"]}>
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
            <Button className={classes["btn-submit"]} type="submit" disabled={isSubmitting}>
              Reset password
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ResetPasswordForm;
