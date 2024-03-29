import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import getAxios from "../utils/axios";
import { nSuccess, nError } from "../utils/notifications";

const NewPassword = (props) => {
  const { token, uidb64 } = props;

  const validate = Yup.object({
    password: Yup.string()
      .required("La contraseña es requerida.")
      .min(6, "Contraseña muy corta - Minimo 6 caracteres."),
    passwordConfirmation: Yup.string()
      .required("Debe confirmar la contraseña.")
      .oneOf([Yup.ref("password"), null], "Las contraseñas deben coincidir."),
  });

  const handleOnSubmit = async (values, setSubmitting) => {
    const axios = getAxios();
    console.log(values);
    values.remove(passwordConfirmation);
    console.log(values);
    await axios
      .patch("auth/reset-password-complete/", values)
      .then(() => {
        nSuccess("Cambio de contraseña realizado");
      })
      .catch((err) => nError(err.response.status, err.response.statusText));
    setSubmitting(false);
  };
  return (
    <div className="accounts__new-password">
      <Formik
        initialValues={{
          password: "",
          passwordConfirmation: "",
          token: token,
          uidb64: uidb64,
        }}
        validationSchema={validate}
        onSubmit={(values, { setSubmitting }) =>
          handleOnSubmit(values, setSubmitting)
        }
      >
        {({ handleSubmit, isSubmitting }) => (
          <Form onSubmit={handleSubmit}>
            <div className="accounts__new-password__container">
              <div className="accounts__new-password__input-data">
                <label className="accounts__new-password__input-label">
                  Contraseña
                </label>
                <Field
                  className="accounts__new-password__input-email"
                  type="password"
                  name="password"
                  autoComplete="off"
                />
                <ErrorMessage
                  component="div"
                  name="password"
                  className="accounts__new-password__error"
                />
              </div>
              <div className="accounts__new-password__input-data">
                <label className="accounts__new-password__input-label">
                  Confirmar nueva Contraseña
                </label>
                <Field
                  className="accounts__new-password__input-email"
                  type="password"
                  name="passwordConfirmation"
                  autoComplete="off"
                />
                <ErrorMessage
                  component="div"
                  name="passwordConfirmation"
                  className="accounts__new-password__error"
                />
              </div>
              <button
                type="submit"
                className="accounts__new-password__submit"
                disabled={isSubmitting}
              >
                Cambiar Contraseña
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default NewPassword;
