import { useParams } from "react-router-dom";
import classes from "../../../assets/css/Form.module.css";
import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { userStore } from "../../../stores/UserStore";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Button from "react-bootstrap/esm/Button";
import { Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

const UserDetail = observer(({ isMe = false }) => {
  const userSchema = Yup.object().shape({
    fullName: Yup.string().required("Fullname is required").max(100),
    email: Yup.string().email("Email is invalid").required("Email is required"),
    isChangePassword: Yup.boolean(),
    password: Yup.string().when("isChangePassword", {
      is: true,
      then: (schema) =>
        schema
          .required("Passowrd is required")
          .min(8, "Password greater than or equal 8 character length.")
          .test("isStrong", "Password is not strong", (value) => {
            if (!value) {
              return false;
            }

            const hasUper = /[A-Z]/.test(value);
            const hasLower = /[a-z]/.test(value);
            const hasNumber = /[0-9]/.test(value);
            const hasSpecialCharacter = /[!@#$%^&*(),.?':{}|<>]/.test(value);
            return hasUper && hasLower && hasNumber && hasSpecialCharacter;
          }),
      otherwise: (schema) => schema.notRequired(),
    }),
    confirmPassword: Yup.string().when("isChangePassword", {
      is: true,
      then: (schema) =>
        schema
          .required("Confirm password is required")
          .oneOf(
            [Yup.ref("password"), null],
            "Confirm password must match password"
          ),
      otherwise: (schema) => schema.notRequired(),
    }),
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
    isRealEmail: Yup.boolean(),
    contactEmail: Yup.string().when("isRealEmail", {
      is: false,
      then: (schema) =>
        schema.email("Email is invalid").required("Contact email is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
  });

  let { userCode } = useParams();

  useEffect(() => {
    const getProfile = async () => {
      if (isMe) {
        await userStore.getUserByMe();
      } else {
        await userStore.getUserByUserCode(userCode);
      }
    };
    getProfile();

    return () => userStore.clearUserDetail();
  }, [userCode, isMe]);

  let userData = isMe ? userStore.userDetailByMe : userStore.userDetail;

  const [isDeleteAvatar, setIsDeleteAvatar] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  // Set state for form data.
  const [formData, setFormData] = useState({
    userName: userData ? userData.userName : "",
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    isChangePassword: false,
    avatar: null,
    isRealEmail: true,
    contactEmail: "",
  });

  // Sync after call API data.
  useEffect(() => {
    if (userData) {
      setFormData({
        userName: userData.userName,
        fullName: userData.fullName,
        email: userData.email,
        password: "",
        confirmPassword: "",
        isChangePassword: false,
        avatar: null,
        isRealEmail: userData.isRealEmail,
        contactEmail: userData.contactEmail,
      });
    }
  }, [userData]);

  const navigate = useNavigate();

  // Handle event for image.
  const handleOnChangeImage = (event, { setFieldValue }) => {
    const file = event.currentTarget.files[0];

    if (file) {
      const url = URL.createObjectURL(file);
      setFieldValue('avatar', file);
      setPreviewImage(url);
      setFormData((prev) => ({ ...prev, avatar: file }));
      setIsDeleteAvatar(false);
    }
  };

  // Handle delete image.
  const handleDeleteImage = (setFieldValue) => {
    setFieldValue("avatar", null);
    setPreviewImage(null);
    userData.avatarUrl = null;
    setIsDeleteAvatar(true);
  };

  // Submit form.
  const handleSubmit = async (
    values,
    { setSubmitting, setFieldValue }
  ) => {
    try {
      // Handle form dât.
      const formData = new FormData();
      formData.append("fullName", values.fullName);
      formData.append("email", values.email);
      formData.append("id", userData.id);
      formData.append("isChangePassword", values.isChangePassword);
      if (values.isChangePassword) {
        formData.append("password", values.password);
      }

      if (values.avatar) {
        formData.append("avatar", values.avatar);
      }
      formData.append("isDeletedAvatar", isDeleteAvatar);

      if (!values.isRealEmail || !userData.isRealEmail) {
        formData.append("isRealEmail", values.isRealEmail);
        formData.append("contactEmail", values.contactEmail);
      }

      await userStore.updateUser(formData, navigate);

      setFieldValue("isChangePassword", false);
    } catch (error) {
      toast.warn(error.response.data.error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={classes["login-container"]}>
      <h2 className={classes["title"]}>User Detail</h2>
      {userStore.isLoading && (
        <div className="text-center my-3">
          <Spinner animation="border" variant="primary" />
          <div>Loading data...</div>
        </div>
      )}
      {!userStore.isLoading && userData && (
        <Formik
          initialValues={formData}
          enableReinitialize
          validationSchema={userSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, setFieldValue, values }) => (
            <Form>
              <div className={classes["form-group"]}>
                <label htmlFor="avatar">Avatar</label>
                <input
                  id="avatar"
                  name="avatar"
                  type="file"
                  accept="image/*"
                  onChange={(event) => handleOnChangeImage(event, {setFieldValue})}
                />
                <ErrorMessage
                  name="avatar"
                  component="div"
                  style={{ color: "red" }}
                />

                {((userData && userData.avatarUrl) || previewImage) && (
                  <div
                    style={{ marginTop: "10px" }}
                    className={classes["block-preview-image"]}
                  >
                    <img
                      src={previewImage ? previewImage : userData.avatarUrl}
                      alt="avatar"
                      className={classes["preview-image"]}
                    />
                    <div>
                      <button
                        className={classes["btn-delete-img"]}
                        type="button"
                        onClick={() => handleDeleteImage(setFieldValue)}
                      >
                        &times;
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div className={classes["form-group"]}>
                <label htmlFor="userName">Username</label>
                <Field
                  name="userName"
                  placeholder="Enter your Username"
                  disabled
                />
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
                <Field name="isChangePassword">
                  {({ field }) => (
                    <label className={classes["label-checkbox"]}>
                      <input
                        type="checkbox"
                        {...field}
                        checked={field.value === true}
                      />
                      &nbsp;Change password
                    </label>
                  )}
                </Field>
              </div>

              {values.isChangePassword && (
                <div>
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
                      Password has contain least: lower character, upper
                      character, special character, number
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
                </div>
              )}
              <Button type="submit" disabled={isSubmitting}>
                Update
              </Button>
            </Form>
          )}
        </Formik>
      )}
    </div>
  );
});

export default UserDetail;
