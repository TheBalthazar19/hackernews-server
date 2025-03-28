import { Context, Next } from "hono";
import { verify } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

export const authMiddleware = async (c: Context, next: Next) => {
  const token = c.req.header("Authorization")?.split(" ")[1];

  if (!token) return c.json({ error: "Unauthorized" }, 401);

  try {
    const decoded = verify(token, JWT_SECRET) as { id: string };
    c.set("userId", decoded.id);
    await next();
  } catch {
    return c.json({ error: "Invalid token" }, 401);
  }
};
