import axios from "axios";
import { accessToken, refreshToken, refreshTokenExp, login } from "../stores";
import { zmUrl } from "../config/env";

const CancelToken = axios.CancelToken;
let cancel;
const auth = {
  accessToken: "",
  refreshToken: "",
  refreshTokenExp: "",
};

accessToken.subscribe((val) => (auth.accessToken = val));
refreshToken.subscribe((val) => (auth.refreshToken = val));
refreshTokenExp.subscribe((val) => (auth.refreshTokenExp = val));

const client = axios.create({
  baseURL: `${zmUrl}/api`,
});
client.defaults.params = {};

client.interceptors.request.use(
  async (config) => {
    config.cancelToken = new CancelToken((c) => (cancel = c));
    if (
      auth.refreshTokenExp &&
      new Date(auth.refreshTokenExp * 1000) > Date.now()
    ) {
      if (auth.refreshToken) {
        const token = auth.accessToken;
        if (token) {
          config.params["token"] = token;
        }
        return config;
      }
    }
    login.set(true);
    cancel("Unauthenticated");
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

client.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response) {
      const originalRequest = error.config;
      if (error.response.status === 401) {
        if (
          error.response.data.data.message ===
          "Token revoked. Please re-generate"
        ) {
          originalRequest._retry = false;
          accessToken.set("");
          refreshToken.set("");
          refreshTokenExp.set("");
          login.set(true);
          return Promise.reject("Unauthenticated");
        }
        originalRequest._retry = true;
        const token = new URLSearchParams({ token: auth.refreshToken });
        const res = await client.post("/host/login.json", null, {
          params: token,
        });
        if (res.status === 200) {
          // put token to LocalStorage
          accessToken.set(res.data.access_token);

          // set token param
          client.defaults.params["token"] = res.data.access_token;

          // return originalRequest object with Axios.
          return client(originalRequest);
        }
      }
    }

    // return Error object with Promise
    return Promise.reject(error);
  }
);

export default client;
