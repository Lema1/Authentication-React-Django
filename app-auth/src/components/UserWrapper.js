import React, { Fragment, useEffect, useState } from "react";
import Image from "next/image";
import Login from "./Login";
import { logout, userData } from "../utils/authentication";

const UserWrapper = (props) => {
  const [wrapper, setWrapper] = useState(false);
  const [user, setUser] = useState();

  const handleLogout = () => {
    logout();
    setWrapper(false);
  };

  useEffect(() => {
    setUser(props.user);
  }, [props.user]);

  return (
    <Fragment>
      <div className="user-wrapper" onClick={() => setWrapper(!wrapper)}>
        <Image
          className="user-wrapper__image"
          src="/assets/img/user.png"
          alt=""
          width={25}
          height={25}
          priority
        />
        {user && user[1] !== "2" ? (
          <span>{user[0]["username"]}</span>
        ) : (
          <span>Invitado</span>
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
