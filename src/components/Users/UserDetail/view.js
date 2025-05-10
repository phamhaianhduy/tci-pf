import { useParams } from "react-router-dom";
import classes from "../../../assets/css/Form.module.css";
import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { userStore } from "../../../stores/UserStore";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Button from "react-bootstrap/esm/Button";

const UserDetail = observer(({ isMe = false }) => {
  const userSchema = Yup.object().shape({
    fullName: Yup.string().required("Fullname is required").max(100),
    email: Yup.string().email("Email is invalid").required("Email is required"),
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
      if (!isMe) {
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
        avatar: null,
        isRealEmail: userData.isRealEmail,
        contactEmail: userData.contactEmail,
      });
    }
  }, [userData]);

  // Handle event for image.
  const handleOnChangeImage = (event, { setFieldValue }) => {
    const file = event.currentTarget.files[0];

    if (file) {
      const url = URL.createObjectURL(file);
      setFieldValue('avatar', file);
      setPreviewImage(url);
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

      if (values.avatar) {
        formData.append("avatar", values.avatar);
      }
      formData.append("isDeletedAvatar", isDeleteAvatar);

      if (!values.isRealEmail || !userData.isRealEmail) {
        formData.append("isRealEmail", values.isRealEmail);
        formData.append("contactEmail", values.contactEmail);
      }

      await userStore.updateUser(formData);

    } catch (error) {
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={classes["login-container"]}>
      <h2 className={classes["title"]}>User Detail</h2>
      {!userData && (
        <div className="text-center my-3 mt-3 mb-5">
          <div className="mb-4">Not found.</div>
        </div>
      )}
      {userData && (
        <Formik
          initialValues={formData}
          enableReinitialize
          validationSchema={userSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, setFieldValue, values }) => (
            <Form className={classes["form-login"]}>
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

              <Button className={classes["btn-submit"]} type="submit" disabled={isSubmitting}>
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
