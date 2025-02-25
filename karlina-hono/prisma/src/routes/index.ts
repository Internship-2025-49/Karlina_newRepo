//import hono
import { Hono } from "hono";
import {
  createPerson,
  deletePerson,
  getPerson,
  getPersonById,
  updatePerson,
} from "../controllers/PersonController";
import { jwt } from "hono/jwt";
import type { JwtVariables } from "hono/jwt";
import prisma from "../client/index";
import { apiKeyAuth } from "../middleware/auth.js";
import { bearerAuth } from "hono/bearer-auth";
import { loginUser } from "../controllers/AuthController.js";

import dotenv from "dotenv";
dotenv.config();

const SECRET_KEY: any = process.env.KEY;

type Variables = JwtVariables;

const app = new Hono<{ Variables: Variables }>();

// app.use('/*',jwt(
//     {
//       secret: '33c09648982ba1044f11365135a4a597c848f0bf28e4831578e24dc81cd1ad5b',
//     }
//   )
// )
// const SECRET_KEY = '33c09648982ba1044f11365135a4a597c848f0bf28e4831578e24dc81cd1ad5b';

app.post("/login", loginUser);

app.use("/data/*", jwt({ secret: SECRET_KEY }));

app.get("/shita", async (c) => {
  //   const auth = await prisma.auth.findFirst();
  const auth = {
    key: "",
  };
  if (auth) {
    return c.json({
      statusCode: 200,
      message: "Authorized",
      key: auth.key,
    });
  }
});

app.use("*", apiKeyAuth);

app.get("/data", (c) => getPerson(c));
app.post("/data", (c) => createPerson(c));
app.get("/data/:id", (c) => getPersonById(c));
app.put("/data/:id", (c) => updatePerson(c)); // Biasain pake PUT
app.patch("/data/:id", (c) => updatePerson(c));
app.delete("/data/:id", (c) => deletePerson(c));

export const Routes = app;
