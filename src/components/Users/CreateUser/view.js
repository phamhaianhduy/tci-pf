import classes from "../../../assets/css/Form.module.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Button from "react-bootstrap/esm/Button";
import { useNavigate } from "react-router-dom";
import { userStore } from "../../../stores/UserStore";
import { useState } from "react";

const CreateUser = () => {
  const navigate = useNavigate();

  const userSchema = Yup.object().shape({
    userName: Yup.string().required("Username is required").max(100),
    fullName: Yup.string().required("Fullname is required").max(100),
    email: Yup.string().email("Email is invalid").required("Email is required"),
    isRealEmail: Yup.boolean(),
    contactEmail: Yup.string().when("isRealEmail", {
      is: false,
      then: (schema) =>
        schema.email("Email is invalid").required("Contact email is required"),
    }),
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
        const hasSpecialCharacter = /[!@#$%^&*(),.?':{}|<>]/.test(value);
        return hasUper && hasLower && hasNumber && hasSpecialCharacter;
      }),
    confirmPassword: Yup.string()
      .oneOf(
        [Yup.ref("password"), null],
        "Confirm password must match password"
      )
      .required("Confirm password is required"),
    avatar: Yup.mixed()
      .nullable(true)
      .test("fileSize", "Size limit 5MB", (image) => {
        if (!image) {
          return true;
        }
        return image.size <= 5 * 1024 * 1024;
      })
      .test("fileFormat", "The type is not allow", (image) => {
        if (!image) {
          return true;
        }
        return ["image/jpg", "image/jpeg", "image/png"].includes(image.type);
      }),
  });

  const [previewImage, setPreviewImage] = useState(null);

  // Set state for form data.
  const [formData, setFormData] = useState({
    userName: "",
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    avatar: null,
    isRealEmail: true,
    contactEmail: "",
  });

  const handleSubmit = async (values, { setErrors, setSubmitting }) => {
    try {
      // Handle form dât.
      const formData = new FormData();
      formData.append("userName", values.userName);
      formData.append("fullName", values.fullName);
      formData.append("email", values.email);
      formData.append("password", values.password);

      if (values.avatar) {
        formData.append("avatar", values.avatar);
      }

      if (!values.isRealEmail) {
        formData.append("isRealEmail", values.isRealEmail);
        formData.append("contactEmail", values.contactEmail);
      }
      await userStore.createUser(formData, navigate);
    } catch (error) {
      console.log(error);
      const res = error.response.data;
      if ("USERNAME_EXIST" === res.error.code) {
        setErrors({ userName: res.error.message });
      }
      if ("EMAIL_EXIST" === res.error.code) {
        setErrors({ email: res.error.message });
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Handle event for image.
  const handleOnChangeImage = (event) => {
    const file = event.currentTarget.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewImage(url);
      setFormData((prev) => ({ ...prev, avatar: file }));
    }
  };

  return (
    <div className={classes["login-container"]}>
      <h2 className={classes["title"]}>Create User</h2>
      <Formik
        initialValues={formData}
        enableReinitialize
        validationSchema={userSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, values }) => (
          <Form>
            <div className={classes["form-group"]}>
              <label htmlFor="avatar">Avatar</label>
              <input
                id="avatar"
                name="avatar"
                type="file"
                accept="image/*"
                onChange={handleOnChangeImage}
              />
              <ErrorMessage
                name="avatar"
                component="div"
                style={{ color: "red" }}
              />

              {previewImage && (
                <div
                  style={{ marginTop: "10px" }}
                  className={classes["block-preview-image"]}
                >
                  <img
                    src={previewImage ? previewImage : null}
                    alt="avatar"
                    className={classes["preview-image"]}
                  />
                </div>
              )}
            </div>
            <div className={classes["form-group"]}>
              <label htmlFor="fullName">Fullname</label>
              <Field name="fullName" placeholder="Enter your Fullname" />
              <ErrorMessage
                name="fullName"
                component="div"
                style={{ color: "red" }}
              />
            </div>

            <div className={classes["form-group"]}>
              <label htmlFor="userName">Username</label>
              <Field name="userName" placeholder="Enter your username" />
              <ErrorMessage
                name="userName"
                component="div"
                style={{ color: "red" }}
              />
            </div>

            <div className={classes["form-group"]}>
              <label htmlFor="email">Email</label>
              <Field name="email" placeholder="Enter your email" />
              <ErrorMessage
                name="email"
                component="div"
                style={{ color: "red" }}
              />
            </div>

            <div className={classes["form-group"]}>
              <Field name="isRealEmail">
                {({ field }) => (
                  <label className={classes["label-checkbox"]}>
                    <input
                      type="checkbox"
                      {...field}
                      checked={field.value === true}
                    />
                    &nbsp;Real Email
                  </label>
                )}
              </Field>
            </div>

            {!values.isRealEmail && (
              <div className={classes["form-group"]}>
                <label htmlFor="contactEmail">Contact Email</label>
                <Field
                  name="contactEmail"
                  placeholder="Enter your contact email"
                />
                <ErrorMessage
                  name="contactEmail"
                  component="div"
                  style={{ color: "red" }}
                />
              </div>
            )}

            <div className={classes["form-group"]}>
              <label htmlFor="password">Password</label>
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
              <p className={classes["condition-password"]}>
                Password has contain least: lower character, upper character,
                special character, number
              </p>
            </div>

            <div className={classes["form-group"]}>
              <label htmlFor="confirmPassword">Confirm Password</label>
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

            <Button type="submit" disabled={isSubmitting}>
              Create
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CreateUser;
