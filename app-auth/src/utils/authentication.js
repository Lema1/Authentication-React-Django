import { Role } from "./role";
import { setCookie, removeCookie, getCookie } from "./cookie";
import Router from "next/router";
import getAxios from "../utils/axios";
import { nSuccess, nError } from "../utils/notifications";

export const auth = (ctx) => {
  const token = getCookie("token_refresh", ctx.req);
  if (!token) {
    if (typeof window === "undefined") {
      ctx.res.writeHead(302, { Location: "/" });
      ctx.res.end();
    } else {
      Router.push("/");
    }
  }
};

export const login = (data) => {
  setCookie(
    "token_access",
    data.tokens.access,
    new Date(new Date().getTime() + 4 * 60 * 1000)
  );
  setCookie("token_refresh", data.tokens.refresh, 1);
  delete data["tokens"];
  if (data.is_staff) {
    delete data["is_staff"];
    setCookie("userData", JSON.stringify([data, Role.Admin]), 1);
    Router.push("/dashboard");
  } else {
    delete data["is_staff"];
    setCookie("userData", JSON.stringify([data, Role.User]), 1);
    Router.push("/");
  }
};

export const userData = (ctx) => {
  let userData = {};
  if (ctx) {
    userData = getCookie("userData", ctx.req);
    if (!userData) {
      return [userData, Role.Guest];
    } else {
      return JSON.parse(decodeURIComponent(userData));
    }
  }

  userData = getCookie("userData");
  if (!userData) {
    return [userData, Role.Guest];
  } else {
    return JSON.parse(decodeURIComponent(userData));
  }
};

export const logout = async () => {
  const token = getCookie("token_refresh");
  const axios = getAxios();

  await axios
    .post("auth/logout/blacklist/", { refresh_token: token })
    .then(() => {
      nSuccess("Sesion cerrada.");
      // REMOVE COOKIES
      removeCookie("token_access");
      removeCookie("token_refresh");
      removeCookie("userData");
    })
    .catch((err) => {
      console.log(err);
      nError(err.response.status, err.response.statusText);
    });

  Router.push("/");
};
