import { Hono } from "hono";
import { prismaClient } from "../extras/prisma.js";
import { sign } from "jsonwebtoken";
import { hash, compare } from "bcrypt";

const auth = new Hono();

auth.post("/sign-up", async (c) => {
  const { email, name, password } = await c.req.json();
  const hashedPassword = await hash(password, 10);

  const user = await prismaClient.user.create({
    data: { email, name, password: hashedPassword },
  });

  return c.json({ message: "User created successfully", user });
});

auth.post("/log-in", async (c) => {
  const { email, password } = await c.req.json();
  const user = await prismaClient.user.findUnique({ where: { email } });

  if (!user || !(await compare(password, user.password)))
    return c.json({ error: "Invalid credentials" }, 401);

  const token = sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: "1h" });
  return c.json({ token });
});

export default auth;
