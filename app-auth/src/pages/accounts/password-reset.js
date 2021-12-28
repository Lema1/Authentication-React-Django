import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import getAxios from "../../utils/axios";
import { nSuccess, nError } from "../../utils/notifications";

const PasswordReset = () => {
  const validate = Yup.object({
    email: Yup.string()
      .email("Email invalido.")
      .min(10, "Minimo 10 carácteres.")
      .max(254, "No puede superar los 254 carácteres.")
      .required("Requerido."),
  });

  const handleOnSubmit = async (values, setSubmitting) => {
    const axios = getAxios();
    console.log(values);
    await axios
      .post("auth/reset-email/", values)
      .then((response) => {
        nSuccess("E-mail enviado, revisa tu casilla de correo");
      })
      .catch((err) => nError(err.response.status, err.response.statusText));
    setSubmitting(false);
  };
  return (
    <div className="accounts__password">
      <span className="accounts__password-title">
        Solicitar cambio de Contraseña
      </span>
      <Formik
        initialValues={{ email: "" }}
        validationSchema={validate}
        onSubmit={(values, { setSubmitting }) =>
          handleOnSubmit(values, setSubmitting)
        }
      >
        {({ handleSubmit, isSubmitting }) => (
          <Form onSubmit={handleSubmit}>
            <div className="accounts__password-container">
              <div className="accounts__password-input-data">
                {/* <label className="accounts__password-input-label">E-Mail</label> */}
                <Field
                  className="accounts__password-input-email"
                  type="email"
                  name="email"
                  placeholder="Ej: test@gmail.com"
                />
                <button
                  type="submit"
                  className="accounts__password-submit"
                  disabled={isSubmitting}
                >
                  Enviar
                </button>
              </div>
              <ErrorMessage
                component="div"
                name="email"
                className="accounts__password-error"
              />
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default PasswordReset;
