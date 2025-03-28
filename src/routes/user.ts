import { Hono } from "hono";
import { authMiddleware } from "../middleware/auth";
import { prismaClient } from "../extras/prisma";

const users = new Hono();

users.use("*", authMiddleware);

users.get("/me", async (c) => {
  const userId = c.get("userId");
  const user = await prismaClient.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true, createdAt: true },
  });

  return c.json(user);
});

users.get("/", async (c) => {
  const allUsers = await prismaClient.user.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, email: true },
  });

  return c.json(allUsers);
});

export default users;
