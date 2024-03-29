import { Fragment } from "react";
import axios from "axios";

const ActivateAccount = (props) => {
  const { response } = props;
  return (
    <div className="accounts__activate">
      {response === 0 ? (
        <p>Su cuenta ha sido activada correctamente.</p>
      ) : response === 1 ? (
        <p>Su cuenta ya ha sido activada</p>
      ) : (
        <Fragment>
          <p>Su codigo de activacion ha caducado.</p>
          <p>Se ha enviado un nuevo correo de activacion.</p>
        </Fragment>
      )}
    </div>
  );
};

ActivateAccount.getInitialProps = async (ctx) => {
  let response;

  await axios
    .get(`http://127.0.0.1:8000/auth/email-verify/?token=${ctx.query.token}`)
    .then((res) => {
      if (res.status == 201) {
        response = 0;
      }
      if (res.status == 200) {
        response = 1;
      }
    })
    .catch((err) => {
      if (err.response.status == 401) {
        response = 2;
      }
    });

  return { response };
};

export default ActivateAccount;
