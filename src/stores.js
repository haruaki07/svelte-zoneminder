import { writable } from "svelte/store";
import Auth from "./libs/authService";

const auth = Auth.getInstance();

export const login = writable(false);

export const accessToken = writable(auth.getAccessToken() || "");
accessToken.subscribe((val) => auth.setAccessToken(val));

export const refreshToken = writable(auth.getRefreshToken() || "");
refreshToken.subscribe((val) => auth.setRefreshToken(val));

export const refreshTokenExp = writable(auth.getRefreshTokenExp() || "");
refreshTokenExp.subscribe((val) => auth.setRefreshTokenExp(val));
