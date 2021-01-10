import Storage from "./localStorage";

const Locals = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
  REFRESH_TOKEN_EXP: "refresh_token_exp",
};

export default class Tokens extends Storage {
  constructor() {
    super();
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new Tokens();
    }
    return this.instance;
  }

  /**
   * @returns {string}
   */
  getAccessToken() {
    return this.get(Locals.ACCESS_TOKEN);
  }

  /**
   * @param {string} accessToken
   */
  setAccessToken(accessToken) {
    this.set(Locals.ACCESS_TOKEN, accessToken);
  }

  /**
   * @returns {string}
   */
  getRefreshToken() {
    return this.get(Locals.REFRESH_TOKEN);
  }

  /**
   * @param {string} refreshToken
   */
  setRefreshToken(refreshToken) {
    this.set(Locals.REFRESH_TOKEN, refreshToken);
  }

  /**
   * @returns {string}
   */
  getRefreshTokenExp() {
    return this.get(Locals.REFRESH_TOKEN_EXP);
  }

  /**
   * @param {string|number} date
   */
  setRefreshTokenExp(date) {
    this.set(Locals.REFRESH_TOKEN_EXP, date);
  }

  clear() {
    this.clearItems([
      Locals.ACCESS_TOKEN,
      Locals.REFRESH_TOKEN,
      Locals.REFRESH_TOKEN_EXP,
    ]);
  }
}
