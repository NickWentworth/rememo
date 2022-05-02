import { PrismaClient } from '@prisma/client';
import { createToken } from '../../../lib/auth';

// TODO - set prisma as singleton to prevent so many clients being created
const prisma = new PrismaClient();

// POST: logs into a user and returns a token linked to the user
export default async (req, res) => {
    let body = JSON.parse(req.body);

    let user = await prisma.user.findFirst({
        where: { email: body.email }
    })

    if (!user) {
        res.status(200);
        res.json({ invalidEmail: true });
        return;
    }

    if (user.password != body.password) {
        res.status(200);
        res.json({
            invalidEmail: false,
            invalidPassword: true
        })
    }

    let token = await createToken(user.id);

    res.status(200);
    res.json({
        invalidEmail: false,
        invalidPassword: false,
        token: token
    })
}
