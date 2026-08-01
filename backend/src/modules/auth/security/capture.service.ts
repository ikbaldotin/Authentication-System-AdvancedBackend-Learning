import { AppError } from "../../../utils/errors/AppError";
import { logger } from "../../../config/logger";
import { env } from "../../../config/env.config";
import { TurnstileVerificationResponse } from "../auth.types";
class CaptchaService {
  async verifyTurnstileToken(
    captchaToken: string,
    ipAddress?: string,
  ): Promise<void> {
    if (!captchaToken) {
      throw new AppError("Captche token is required", 400);
    }
    try {
      const formData = new URLSearchParams();
      formData.append("secret", env.CLOUDFLARE_TURNSITLE_API_SECRET);
      formData.append("response", captchaToken);
      if (ipAddress) {
        formData.append("remoteip", ipAddress);
      }
      const response = await fetch(
        `${env.CLOUDFLARE_TURNSITLE_TOKEN_VERIFICATION_URL}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: formData,
        },
      );
      if (!response.ok) {
        throw new AppError("Captcha verificatin failed", 400);
      }
      const result = (await response.json()) as TurnstileVerificationResponse;
      if (!result.success) {
        logger.error(`{
            event:captcha_verification_failed.
            errorCode:${result["error_code"]},
            ipAddress:${ipAddress},
            timestamp:${new Date().toISOString()}            
            }`);
        throw new AppError("Captcha_verification failed", 400);
      }
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error(`{
        event:captche_service_error,
        error:${error},
        timestamp:${new Date().toISOString()}
        }`);
      throw new AppError("captche verification failed", 400);
    }
  }
}
export const captchaService = new CaptchaService();
