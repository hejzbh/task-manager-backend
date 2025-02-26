import { Request, Response } from "express";

type Cookie = { name: string; value: string };

// I made this funcntion because we use this functionality in multiple auth endpoints so by this way we can eaasily edit things such as expiration, sameSite, secure or somethig else if for all of them if we need.

export function setAuthCookies(
  req: Request,
  res: Response,
  cookies: Cookie[],
  domain?: string
) {
  // If domain is not provided
  if (!domain) {
    domain = req.hostname === "localhost" ? req.hostname : `.${req.hostname}`;
  }

  const options = {
    httpOnly: true,
    domain,
    sameSite: "none" as boolean | "none" | "lax" | "strict" | undefined,
    secure: true,
  };

  cookies.forEach(({ name, value }) => {
    res.cookie(name, value, {
      ...options,
      maxAge: name.includes("accessToken")
        ? Number(process.env.ACCESS_TOKEN_DURATION)
        : Number(process.env.REFRESH_TOKEN_DURATION),
    });
  });

  return options;
}
