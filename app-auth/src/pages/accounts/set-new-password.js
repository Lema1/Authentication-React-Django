import React from "react";
import axios from "axios";
import NewPassword from "../../components/NewPassword";

const SetNewPassword = ({ props }) => {
  const { status, token, uidb64 } = props;

  return (
    <div className="accounts__password">
      <span className="accounts__password-title">
        Establecer nueva contraseña
      </span>
      <div className="accounts__password-container">
        {status === 200 && <NewPassword token={token} uidb64={uidb64} />}
        {status === 401 && (
          <p className="accounts__password-mesage">
            El enlace para cambiar contraseña es invalido
          </p>
        )}
      </div>
    </div>
  );
};

SetNewPassword.getInitialProps = async (ctx) => {
  const token = ctx.query.token;
  const uidb64 = ctx.query.uidb64;
  let status;
  await axios
    .get(`http://127.0.0.1:8000/auth/password-reset/${uidb64}/${token}/`)
    .then((res) => {
      status = res.status;
    })
    .catch((err) => {
      status = err.response.status;
    });

  return {
    props: {
      status: status,
      token: token,
      uidb64: uidb64,
    },
  };
};

export default SetNewPassword;
