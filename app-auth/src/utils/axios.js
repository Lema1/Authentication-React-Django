import axios from "axios";
import { getCookie, setCookie } from "./cookie";
import jwt_decode from "jwt-decode";

const getAxios = (ctx = false) => {
  const baseURL = "http://127.0.0.1:8000/";
  const token_access = getCookie("token_access", ctx.req);
  const refreshToken = getCookie("token_refresh", ctx.req);

  let headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  const axiosInstance = axios.create({
    baseURL: baseURL,
    headers,
  });

  if (token_access !== undefined) {
    axiosInstance.defaults.headers.common["Authorization"] =
      "Bearer " + token_access;
  }

  axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;

      if (typeof error.response === "undefined") {
        console.log(
          "A server/network error occurred. " +
            "Looks like CORS might be the problem. " +
            "Sorry about this - we will get it fixed shortly."
        );
        return Promise.reject(error);
      }
      if (
        error.response.status === 401 &&
        originalRequest.url === baseURL + "auth/token/refresh/"
      ) {
        ctx.res.writeHead(302, { Location: "/" });
        ctx.res.end();
        return Promise.reject(error);
      }
      if (
        error.response.status === 401 &&
        error.response.statusText === "Unauthorized"
      ) {
        if (refreshToken) {
          const tokenParts = jwt_decode(refreshToken, { payload: true });
          const now = Math.ceil(Date.now() / 1000);

          if (tokenParts.exp > now) {
            return axiosInstance
              .post("auth/token/refresh/", {
                refresh: refreshToken,
              })
              .then((response) => {
                if (process.browser) {
                  setCookie(
                    "token_access",
                    response.data.access,
                    new Date(new Date().getTime() + 4 * 60 * 1000)
                  );
                } else {
                  ctx.res.setHeader(
                    "Set-Cookie",
                    `token_access=${response.data.access}; path=/; Max-Age=240`
                  );
                }
                axiosInstance.defaults.headers.common["Authorization"] =
                  "Bearer " + response.data.access;

                return axiosInstance(originalRequest);
              })
              .catch((err) => {
                console.log(err);
              });
          } else {
            console.log("Refresh token is expired", tokenParts.exp, now);
            ctx.res.writeHead(302, { Location: "/" });
            ctx.res.end();
          }
        } else {
          console.log("Refresh token not available.");
          ctx.res.writeHead(302, { Location: "/" });
          ctx.res.end();
        }
      }
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

export default getAxios;
