import { Document, ObjectId, Types } from "mongoose";
import { Response } from "express";
import { IUserAccount } from "../models/account.model";
// import { IUser } from "../model/user.model";

// import { IUser } from '../models/User.model';

// type SendTokenOptions = {
//   //   OPT: any;
//   user:
//     | (Document<unknown, {}, IUser> &
//         Omit<
//           IUser & {
//             _id: Types.ObjectId;
//           },
//           never
//         >)
//     | null;
//   statusCode: number;
//   res: Response;
//   options?: SendTokenOptions;
// };

const sendToken = (
  account: Document<unknown, {}, IUserAccount> &
    Omit<IUserAccount & { _id: ObjectId }, never>,
  user: any,
  statusCode: number,
  res: Response
  // options?: SendTokenOptions
): void => {
  let token;
  if (account) {
    console.log("Freelancer", account);

    token = account.getJWTToken();
  }

  // options for cookie
  const cookieOptions = {
    expires: new Date(
      Date.now() +
        Number(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    SameSite: "none",
  };

  res.status(statusCode).cookie("token", token, cookieOptions).json({
    status: "success",
    data: user,
    token,
    message: "User Logged in successfully",
  });
};

export default sendToken;
