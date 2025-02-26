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
    domain = req.headers.origin
      ?.replace(/^https?:\/\//, "")
      .replace(/[:\d]+/g, ""); // www.domain.com -> domain.com, https://localhost:3000 -> localhost
  }
  console.log(domain);
  console.log("❤️❤️❤️❤️👿✅✅💕🐢");
  const options = {
    httpOnly: process.env.NODE_ENV !== "production",
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
