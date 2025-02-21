import { Hono } from 'hono';
import { jwt, sign, verify } from 'hono/jwt';
import { setCookie, getCookie } from 'hono/cookie';
import prisma from '../../prisma/client/index.js';
import { apiKeyAuth } from '../middleware/auth.js';
import { createPerson, deletePerson, getPerson, getPersonById, updatePerson } from '../controllers/PersonController.js';
import dotenv from 'dotenv'
import { loginUser } from '../controllers/AuthController.js';
dotenv.config();

const app = new Hono();

// const SECRET_KEY: any = process.env.KEY;
const SECRET_KEY = '33c09648982ba1044f11365135a4a597c848f0bf28e4831578e24dc81cd1ad5b';

app.post('/login', loginUser);

app.get('/shita', async (c) => {
    const auth = await prisma.auth.findFirst()

    if (auth) {
        return c.json(
            { 
                statusCode: 200, 
                message: 'Authorized',
                key: auth.key 
            }
        )
    }
});

app.use('/data/*', jwt({ secret: SECRET_KEY }));

app.use('/data/*', apiKeyAuth);

app.get('/data', (c) => getPerson(c));
app.post('/data', (c) => createPerson(c));
app.get('/data/:id', (c) => getPersonById(c));
app.put('/data/:id', (c) => updatePerson(c)); 
app.patch('/data/:id', (c) => updatePerson(c));
app.delete('/data/:id', (c) => deletePerson(c));


export const Routes = app;