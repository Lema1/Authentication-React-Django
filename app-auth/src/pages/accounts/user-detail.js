import React from "react";
import getAxios from "../../utils/axios";
import { useState } from "react";

const UserDetail = ({ props }) => {
  const [user, setUser] = useState(props);
  console.log(user);
  return (
    <div className="user-detail">
      <div className="user-detail__container">
        <label>{user.id}</label>
        <label>{user.email}</label>
        <label>{user.username}</label>
        <label>{user.is_staff}</label>
        <label>{user.is_active}</label>
      </div>
    </div>
  );
};

UserDetail.getInitialProps = async (ctx) => {
  const axios = getAxios(ctx);

  const response = await axios.get(`auth/user/14`).catch((err) => {
    console.log(err);
  });

  return { props: response.data };
};

export default UserDetail;
