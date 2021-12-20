import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import getAxios from "../utils/axios";
import { login } from "../utils/authentication";

const Login = (props) => {
  const { setWrapper } = props;

  const validate = Yup.object({
    email: Yup.string()
      .email("Email invalido")
      .min(10, "Minimo 10 carácteres")
      .max(254, "No puede superar los 254 carácteres")
      .required("Requerido"),
    password: Yup.string()
      .required("No password provided.")
      .min(6, "Password is too short - should be 8 chars minimum."),
  });

  const handleOnSubmit = async (values, setSubmitting) => {
    const axios = getAxios();
    await axios
      .post("auth/login/", values)
      .then((response) => {
        if (response.status == 200) {
          login(response.data);
          setWrapper(false);
        }
      })
      .catch((err) => console.log(err));
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
    </div>
  );
};

export default Login;
