import jwt from "jsonwebtoken";
import { UserRole } from "schema/user.schema.js";

export const generateTokens = (id: string, email: string, role: UserRole) => {
  return {
    accessToken: jwt.sign({ id, email, role }, process.env.ACCESS_TOKEN_KEY!, {
      expiresIn: Number(process.env.ACCESS_TOKEN_DURATION!),
    }),
    refreshToken: jwt.sign(
      {
        id,
        email,
        role,
      },
      process.env.REFRESH_TOKEN_KEY!,
      { expiresIn: Number(process.env.REFRESH_TOKEN_DURATION!) }
    ),
  };
};
