import React, { Fragment, useEffect, useState } from "react";
import Login from "./Login";
import { logout } from "../utils/authentication";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { nSuccess } from "../utils/notifications";

const UserWrapper = (props) => {
  const [wrapper, setWrapper] = useState(false);
  const [user, setUser] = useState();

  const handleLogout = () => {
    logout();
    nSuccess("Sesion Cerrada");
    setWrapper(false);
  };

  useEffect(() => {
    setUser(props.user);
  }, [props.user]);

  return (
    <Fragment>
      <div className="user-wrapper" onClick={() => setWrapper(!wrapper)}>
        <div className="user-wrapper__user-icon">
          <FontAwesomeIcon
            icon={[`fa`, `user`]}
            className="user-wrapper__icon"
          />
        </div>
        {user && user[1] !== "2" ? (
          <span className="user-wrapper__username">{user[0]["username"]}</span>
        ) : (
          <span className="user-wrapper__username">Invitado</span>
        )}
      </div>

      <div className={`user-wrapper__menu ${wrapper ? "show" : "hide"}`}>
        <div
          className="user-wrapper__menu-overlay"
          onClick={() => setWrapper(!wrapper)}
        ></div>
        <div className="user-wrapper__menu-container">
          {user && user[1] === "2" ? (
            <Login setWrapper={setWrapper} />
          ) : (
            <span className="user-wrapper__menu-logout" onClick={handleLogout}>
              Logout
            </span>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default UserWrapper;
