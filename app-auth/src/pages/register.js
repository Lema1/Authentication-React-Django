import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import getAxios from "../utils/axios";
import { nSuccess, nError } from "../utils/notifications";

const Register = () => {
  const validate = Yup.object({
    email: Yup.string()
      .email("Email invalido.")
      .min(10, "Minimo 10 carácteres.")
      .max(254, "No puede superar los 254 carácteres.")
      .required("Requerido."),
    username: Yup.string()
      .min(5, "Minimo 5 carácteres")
      .max(70, "No puede superar los 70 carácteres.")
      .required("Nombre de Usuario es requerido."),
    password: Yup.string()
      .required("La contraseña es requerida.")
      .min(6, "Contraseña muy corta - Minimo 6 caracteres."),
  });
  const handleOnSubmit = async (values, setSubmitting) => {
    const axios = getAxios();
    console.log(values);
    await axios
      .post("auth/register/", values)
      .then((response) => {
        nSuccess("Registro Exitoso");
      })
      .catch((err) => nError(err.response.status, err.response.statusText));
    setSubmitting(false);
  };
  return (
    <div className="register">
      <Formik
        initialValues={{ email: "", password: "", username: "" }}
        validationSchema={validate}
        onSubmit={(values, { setSubmitting }) =>
          handleOnSubmit(values, setSubmitting)
        }
      >
        {({ handleSubmit, isSubmitting }) => (
          <Form onSubmit={handleSubmit}>
            <div className="register__container">
              <div className="register__input-data">
                <label className="register__input-label">E-Mail</label>
                <Field
                  className="register__input-email"
                  type="email"
                  name="email"
                />
                <ErrorMessage
                  component="div"
                  name="email"
                  className="register__error"
                />
              </div>
              <div className="register__input-data">
                <label className="register__input-label">
                  Nombre de Usuario
                </label>
                <Field
                  className="register__input-email"
                  type="text"
                  name="username"
                />
                <ErrorMessage
                  component="div"
                  name="username"
                  className="register__error"
                />
              </div>
              <div className="register__input-data">
                <label className="register__input-label">Contraseña</label>
                <Field
                  className="register__input-email"
                  type="password"
                  name="password"
                  autoComplete="off"
                />
                <ErrorMessage
                  component="div"
                  name="password"
                  className="register__error"
                />
              </div>
              <button
                type="submit"
                className="register__submit"
                disabled={isSubmitting}
              >
                Iniciar
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Register;
