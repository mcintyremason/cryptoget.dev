import StatusCodes from "http-status-codes";
import { Request, Response } from "express";

const { OK } = StatusCodes;

export async function healthCheck(req: Request, res: Response) {
  const response = {
    status: "OK",
  };
  return res.status(OK).json({ response });
}
