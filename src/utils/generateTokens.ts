import jwt from "jsonwebtoken";

export const generateTokens = (id: string, email: string) => {
  return {
    accessToken: jwt.sign({ id, email }, process.env.ACCESS_TOKEN_KEY!, {
      expiresIn: Number(process.env.ACCESS_TOKEN_DURATION!),
    }),
    refreshToken: jwt.sign(
      {
        id,
        email,
      },
      process.env.REFRESH_TOKEN_KEY!,
      { expiresIn: Number(process.env.REFRESH_TOKEN_DURATION!) }
    ),
  };
};
