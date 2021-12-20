import Head from "next/head";
import { Fragment, useState, useEffect } from "react";
import { userData } from "../utils/authentication";

const Home = (props) => {
  const [user, setUser] = useState();

  useEffect(() => {
    setUser(props.user);
  }, [props.user]);

  return (
    <Fragment>
      <Head>
        <title>Auth - Login</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container">
        <span>
          Hola{" "}
          {user !== undefined &&
            (user[1] === "2" ? "Invitado" : user[0]["username"])}
        </span>
      </div>
    </Fragment>
  );
};

Home.getInitialProps = async (ctx) => {
  return { user: userData(ctx) };
};

export default Home;
