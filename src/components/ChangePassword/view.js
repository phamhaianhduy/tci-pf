import classes from "../Login/Login.module.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Button from "react-bootstrap/esm/Button";
import { userStore } from "../../stores/UserStore";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import encryptPassword from "../../utils/encryptPassword";
import { toast } from "react-toastify";

const ChangePassword = () => {
  const changePasswordSchema = Yup.object().shape({
    oldPassword: Yup.string().required("Old password is required"),
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

  useEffect(() => {
    const getProfile = async () => {
      await userStore.getUserByMe();
    };
    getProfile();
    return () => userStore.clearUserDetail();
  }, []);

  const handleSubmit = async (data, { setSubmitting, setFieldValue }) => {
    const payload = {
      oldPassword: encryptPassword(data.oldPassword),
      password: encryptPassword(data.password),
    };

    try {
      await userStore.updatePasswordUser(payload);
    } catch (error) {
      setFieldValue("oldPassword", "");
      setFieldValue("password", "");
      setFieldValue("confirmPassword", "");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={classes["login-container"]}>
      <h2 className={classes["title"]}>Change Password</h2>
      <Formik
        initialValues={{ oldPassword: "", password: "", confirmPassword: "" }}
        validationSchema={changePasswordSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className={classes["form-login"]}>
            <div>
              <div className={classes["form-group"]}>
                <label htmlFor="oldPassword">Old Password</label>
                <Field
                  name="oldPassword"
                  placeholder="Enter your old password"
                  type="password"
                />
                <ErrorMessage
                  name="oldPassword"
                  component="div"
                  style={{ color: "red" }}
                />
              </div>
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
            <Button
              className={classes["btn-submit"]}
              type="submit"
              disabled={isSubmitting}
            >
              Change password
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default observer(ChangePassword);
