import type { Context } from "hono";
import { sign } from "hono/jwt";

const SECRET_KEY = "33c09648982ba1044f11365135a4a597c848f0bf28e4831578e24dc81cd1ad5b";

export async function loginUser(c: Context) {
    try {
        const body = await c.req.json();
        const { username, password } = body;
        if (username !== "shita" || password !== "shita123") {
            return c.json({ statusCode: 401, message: "Username atau password salah" }, 401);
        }
        const token = await sign({ username }, SECRET_KEY);
        return c.json({
            statusCode: 200,
            message: "yesss berhasil",
            token,
        });
    } catch (error) {
        console.error("Error saat login:", error);
        return c.json({ statusCode: 500, message: "Terjadi kesalahan server" }, 500);
    }
}