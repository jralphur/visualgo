import type { JWTToken } from "./types";

let token: JWTToken | undefined;

const getJWTToken = (): JWTToken | undefined => {
  return token;
};

const setJWTToken = (s: JWTToken) => {
  token = s;
};

const getAuthorizationHeaders = () => {
  return {
    Authorization: token ? `Bearer ${token.username}` : undefined,
  };
};

export { getJWTToken, setJWTToken, getAuthorizationHeaders };
