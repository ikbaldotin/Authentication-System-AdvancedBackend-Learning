import express from "express";
import {
  googleCallBackController,
  redirectToGoogleController,
} from "./oauth.controller.js";
import { oAuthStartRateLimit } from "../../../middleware/rate-limit/google-oauth-rate-limit.js";
import { googleCallbackRateLimit } from "../../../middleware/rate-limit/google-callback-rate-limit.js";
const router = express.Router();
router.route("/google").get(oAuthStartRateLimit, redirectToGoogleController);
router
  .route("/google/callback")
  .get(googleCallbackRateLimit, googleCallBackController);
export default router;
