import { env } from "../../../config/env.config.js";
import { googleClient } from "../../../lib/google.js";
import { AppError } from "../../../utils/errors/AppError.js";
import { generatedAuthState } from "./oauth.helper.js";

export class GooogleAuthService {
  async generateGoogleAuthUrl() {
    const state = generatedAuthState();
    console.log("Redirect URI:", env.GOOGLE_REDIRECT_URI);
    const url = googleClient.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
      state,
      scope: ["openid", "email", "profile"],
    });
    return {
      url,
      state,
    };
  }
  async validateOAuth(cookieState: string, state: string) {
    if (!cookieState || !state || cookieState !== state) {
      throw new AppError("Invalid cookie state", 400);
    }
  }
  async handleGoogleCallback(code: string) {
    return code;
  }
}
