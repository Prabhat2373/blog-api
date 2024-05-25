import { NextFunction, Request, Response } from "express";

const catchAsyncErrors = (
  fn: (req: any, res: Response, next: NextFunction) => Promise<void>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export default catchAsyncErrors;
