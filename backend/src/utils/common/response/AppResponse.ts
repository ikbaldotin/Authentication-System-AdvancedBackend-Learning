import { Response } from "express";
import { ApiResone } from "../../../types/index.js";

export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  payload: ApiResone<T>,
) => {
  return res.status(statusCode).json(payload);
};
