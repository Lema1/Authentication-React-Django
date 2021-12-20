import "../styles/app.scss";
import Layout from "../components/Layout";
import "../utils/fontawesome";

function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
