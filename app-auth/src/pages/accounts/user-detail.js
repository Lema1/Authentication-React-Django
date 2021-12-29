import React from "react";
import getAxios from "../../utils/axios";
import axios from "axios";
import { useState } from "react";
import { auth, userData, logout } from "../../utils/authentication";
import { nSuccess, nError } from "../../utils/notifications";

const UserDetail = ({ props }) => {
  const [user, setUser] = useState(props);

  const handlerRequestNewPassword = async () => {
    await axios
      .post("http://127.0.0.1:8000/auth/reset-email/", { email: user.email })
      .then((response) => {
        nSuccess("E-mail enviado, revisa tu casilla de correo");
      })
      .catch((err) => nError(err.response.status, err.response.statusText));
  };

  return (
    <div className="user-detail">
      <span className="user-detail__title">Mi Perfil</span>
      <div className="user-detail__container">
        <div className="user-detail__data">
          <label className="user-detail__data-label">ID:</label>
          <span className="user-detail__data-text">{user.id}</span>
        </div>
        <div className="user-detail__data">
          <label className="user-detail__data-label">E-mail:</label>
          <span className="user-detail__data-text">{user.email}</span>
        </div>
        <div className="user-detail__data">
          <label className="user-detail__data-label">Usuario:</label>
          <span className="user-detail__data-text">{user.username}</span>
        </div>
        <div className="user-detail__data">
          <label className="user-detail__data-label">Staff:</label>
          <span className="user-detail__data-text">
            {user.is_staff ? "Si" : "No"}
          </span>
        </div>
        <div className="user-detail__data">
          <label className="user-detail__data-label">Estado:</label>
          <span className="user-detail__data-text">
            {user.is_active ? "Activo" : "No activo"}
          </span>
        </div>
      </div>
      <div className="user-detail__container-actions">
        <button
          className="user-detail__password"
          onClick={() => handlerRequestNewPassword()}
        >
          Solicitar cambio de contraseña
        </button>
        <button className="user-detail__password" onClick={() => logout()}>
          Cerrar Sesion
        </button>
      </div>
    </div>
  );
};

UserDetail.getInitialProps = async (ctx) => {
  auth(ctx);

  const axios = getAxios(ctx);
  const user = userData(ctx);
  const response = await axios.get(`auth/user/${user[0]["id"]}`);
  return { props: response.data };
};

export default UserDetail;
