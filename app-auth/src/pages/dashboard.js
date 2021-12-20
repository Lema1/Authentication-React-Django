import { useState, useEffect } from "react";
import { auth } from "../utils/authentication";
import { userData } from "../utils/authentication";

const Dashboard = (props) => {
  const [user, setUser] = useState();

  useEffect(() => {
    setUser(props.user);
  }, [props.user]);
  return (
    <div className="container">
      <p>
        Hola{" "}
        {user !== undefined &&
          (user[1] === "2" ? "invitado" : user[0]["username"])}
      </p>
    </div>
  );
};

Dashboard.getInitialProps = async (ctx) => {
  auth(ctx);
  return { user: userData(ctx) };
};

export default Dashboard;
