import CustomError from "config/custom-error.js";
import STATUS from "constants/status.js";
import { NextFunction, Request, Response } from "express";
import User from "schema/user.schema.js";
import { comparePws } from "utils/comparePws.js";
import jwt from "jsonwebtoken";
import { generateTokens } from "utils/generateTokens.js";
import { setAuthCookies } from "utils/setAuthCookies.js";

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    // 1) Get payload from body
    const { email, password } = req.body;

    // 2) If data is not provided
    if (!email || !password)
      throw new CustomError("Data is missing", STATUS.MISSING_DATA);

    // 3) Get user from database
    const user = await User.findOne({ email });

    // 4) If user doesn't exists
    if (!user)
      throw new CustomError(
        "User with entered e-mail doesn't exists",
        STATUS.NOT_FOUND
      );

    // user exists...

    // 6) Compare passwords
    if (!(await comparePws(password, user.password)))
      throw new CustomError("Invalid credentials", STATUS.UNAUTHORIZED);

    // 7) Generate JWT Acess & Refresh tokens
    const { accessToken, refreshToken } = generateTokens(
      user._id.toString(),
      user.email,
      user.role
    );

    // 8) Set HTTP only cookies
    setAuthCookies(req, res, [
      { name: "accessToken", value: accessToken },
      { name: "refreshToken", value: refreshToken },
    ]);

    const { password: _, ...userWithoutPassword } = user;

    // Return response
    res.status(200).json({
      message: "You've successfully logged in",
      data: {
        user: userWithoutPassword,
      },
      success: true,
    });
  } catch (err) {
    next(err);
  }
}

export async function register(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // 1) Get email and password from body
    const { email, password } = req.body;

    // 2) If data is missing
    if (!email || !password)
      throw new CustomError("Data is missing", STATUS.MISSING_DATA);

    //TODO: Validation

    // 4) Check does user exists
    let user = await User.findOne({ email });

    // 5) If user exists, throw error
    if (user)
      throw new CustomError(
        "User with same e-mail already exists",
        STATUS.BAD_REQUEST
      );

    // 6) Create
    user = await User.create({ email, password });

    // 7) Check is user successfully created
    if (!user)
      throw new CustomError(
        "Something went wrong while creating user",
        STATUS.INTERNAL_SERVER_ERROR
      );

    // 8) User is created, register is done!
    res.status(STATUS.CREATED).json({
      message: `You've successfully registered. Go to the login`,
      data: {},
      success: true,
    });
  } catch (err) {
    next(err);
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    // 1) Get refreshToken from body or cookie

    const refreshToken = req.cookies["refreshToken"] || req.body?.refreshToken;
    console.log(refreshToken);
    // 2) If there is no token
    if (!refreshToken)
      throw new CustomError(
        "There is no refresh token cookie",
        STATUS.UNAUTHORIZED
      );

    // 3) Check is refresh token valid
    const refreshDecoded: any = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_KEY!
    );

    if (!refreshDecoded)
      throw new CustomError("Refresh toke is invalid", STATUS.UNAUTHORIZED);

    // 3) Generate new tokenns
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(
      refreshDecoded.id,
      refreshDecoded.email,
      refreshDecoded?.role
    );

    if (!accessToken || !newRefreshToken)
      throw new CustomError("Cannot generate tokens", STATUS.UNAUTHORIZED);

    // 4) Set new cookies
    const settedCookieOptions = setAuthCookies(req, res, [
      { name: "accessToken", value: accessToken },
      { name: "refreshToken", value: refreshToken },
    ]);

    // 5) Return response
    res.status(200).json({
      success: true,
      data: {
        accessToken: {
          value: accessToken,
          options: {
            ...settedCookieOptions,
            maxAge: Number(process.env.ACCESS_TOKEN_DURATION) / 1000, // because, frontend set cookies requires secods, not ms
          },
        },
        refreshToken: {
          value: newRefreshToken,
          options: {
            ...settedCookieOptions,
            maxAge: Number(process.env.REFRESH_TOKEN_DURATION) / 1000,
          },
        },
      },
      message: "New tokens are successfully generated",
    });
  } catch (err) {
    next(err);
  }
}

export async function profile(req: Request, res: Response, next: NextFunction) {
  try {
    const accessToken =
      req.cookies["accessToken"] || req.headers.authorization?.split(" ")[1];

    if (!accessToken)
      throw new CustomError("Unauthorized", STATUS.UNAUTHORIZED);

    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_KEY!);

    if (!decoded) throw new CustomError("Unauthorized", STATUS.UNAUTHORIZED);

    res.status(200).json({
      message: `You've successfully fetched your profile`,
      data: {
        user: decoded,
      },
      success: true,
    });
  } catch (err) {
    next(err);
  }
}
