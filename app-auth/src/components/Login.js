import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { login } from "../utils/authentication";
import Link from "next/link";
import { nSuccess, nError } from "../utils/notifications";

const Login = (props) => {
  const { setWrapper } = props;

  const validate = Yup.object({
    email: Yup.string()
      .email("Email invalido.")
      .min(10, "Minimo 10 carácteres.")
      .max(254, "No puede superar los 254 carácteres.")
      .required("Requerido."),
    password: Yup.string()
      .required("La contraseña es requerida.")
      .min(6, "Contraseña muy corta - Minimo 6 caracteres."),
  });

  const handleOnSubmit = async (values, setSubmitting) => {
    await axios
      .post("http://127.0.0.1:8000/auth/login/", values)
      .then((response) => {
        console.log(response);
        if (response.status == 200) {
          login(response.data);
          nSuccess("Sesion Iniciada");
          setWrapper(false);
        }
      })
      .catch((err) => {
        if (err.response.data.detail === "Account not verified") {
          nError("Cuenta no verificada, revisa tu bandeja de mensajes");
        }
        if (err.response.data.detail === "Account not activated") {
          nError("Cuenta no verificada, revisa tu bandeja de mensajes");
        }
        if (err.response.data.detail === "Invalid credentials") {
          nError("Usuario/Contraseña incorecctos");
        }
      });
    setSubmitting(false);
  };
  return (
    <div className="login">
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={validate}
        onSubmit={(values, { setSubmitting }) =>
          handleOnSubmit(values, setSubmitting)
        }
      >
        {({ handleSubmit, isSubmitting }) => (
          <Form onSubmit={handleSubmit}>
            <div className="login__container">
              <div className="login__input-data">
                <label className="">E-Mail</label>
                <Field
                  className="login__input-email"
                  type="email"
                  name="email"
                />
                <ErrorMessage
                  component="div"
                  name="email"
                  className="login__error"
                />
              </div>
              <div className="login__input-data">
                <label className="">Contraseña</label>
                <Field
                  className="login__input-password"
                  type="password"
                  name="password"
                  autoComplete="off"
                />
                <ErrorMessage
                  component="div"
                  name="password"
                  className="login__error"
                />
              </div>
            </div>
            <button
              type="submit"
              className="login__submit"
              disabled={isSubmitting}
            >
              Iniciar
            </button>
          </Form>
        )}
      </Formik>
      <Link href="/register">
        <a onClick={() => setWrapper(false)}>Registrarse</a>
      </Link>
    </div>
  );
};

export default Login;
