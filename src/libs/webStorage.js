import Storage from "./localStorage";
import { availableTheme } from "../config/web";

const Locals = {
  WEB_THEME: "zm-theme",
};

export default class WebConfig extends Storage {
  constructor() {
    super();
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new WebConfig();
    }
    return this.instance;
  }

  /**
   * @returns {string}
   */
  getWebTheme() {
    let theme = this.get(Locals.WEB_THEME);
    if (!availableTheme.includes(theme)) theme = availableTheme[0];
    return theme;
  }

  /**
   * @param {string} accessToken
   */
  setWebTheme(accessToken) {
    this.set(Locals.WEB_THEME, accessToken);
  }

  clear() {
    this.clearItems([Locals.WEB_THEME]);
  }
}
