import { IUserAccount } from "@/models/account.model";
import { Document, Types } from "mongoose";
import { Request, Response } from "express";

export interface RequestType extends Request {
  cookies: {
    token: string;
  };
  user: (Document & Omit<IUserAccount & { _id: Types.ObjectId }, "_id">) | null;
}

export interface responseType {
  status: string;
  message?: string;
  data: any;
}
