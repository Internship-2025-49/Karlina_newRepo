import type { Context, Next } from "hono"
import prisma from "../../prisma/client/index.js"
export const apiKeyAuth = async (c: Context, next: Next) => {
    const apiKey = c.req.header('api-key')
    if (!apiKey) {
        return c.json({ statusCode: 401, message: 'Masukan API key terlebih dahulu' }, 401)
    }
    const auth = await prisma.auth.findFirst({
        where: { key: apiKey }
    })
    
    if (!auth) {
        return c.json({ statusCode: 401, message: 'Api key salah' }, 401)
    }
    await next()
}