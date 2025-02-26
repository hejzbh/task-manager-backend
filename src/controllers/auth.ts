import CustomError from "config/custom-error.js";
import STATUS from "constants/status.js";
import { NextFunction, Request, Response } from "express";
import User from "schema/user.schema.js";
import { comparePws } from "utils/comparePws.js";
import { generateTokens } from "utils/generateTokens.js";

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
    const { accessToken, refreshToken } = generateTokens(user.id, user.email);

    // 8) Set HTTP only cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 50,
      secure: true,
      path: "/",
      sameSite: "none",
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 50,
      secure: true,
      sameSite: "none",
      path: "/",
    });

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
