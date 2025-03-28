import { Hono } from "hono";
import { serve } from "@hono/node-server";
import auth from "./routes/auth";
import users from "./routes/user";

const app = new Hono();

app.route("/auth", auth);
app.route("/users", users);

serve(app, (info) => console.log(`🚀 Server running at http://localhost:${info.port}`));
