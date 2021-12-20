import cookie from "js-cookie";

export const setCookie = (key, value, expire) => {
  if (process.browser) {
    cookie.set(key, value, {
      expires: expire,
      path: "/",
    });
  }
};

export const removeCookie = (key) => {
  cookie.remove(key, { expires: 1 });
};

export const getCookie = (key, req) => {
  if (process.browser) {
    return getCookieFromBrowser(key);
  } else if (req) {
    return getCookieFromServer(key, req);
  } else {
    return getCookieFromBrowser(key);
  }
};

export const getCookieFromBrowser = (key) => {
  if (process.browser) {
    return cookie.get(key);
  }
};

export const getCookieFromServer = (key, req) => {
  if (!req.headers.cookie) {
    return undefined;
  }
  const rawCookie = req.headers.cookie
    .split(";")
    .find((c) => c.trim().startsWith(`${key}=`));
  if (!rawCookie) {
    return undefined;
  }
  return rawCookie.split("=")[1];
};
