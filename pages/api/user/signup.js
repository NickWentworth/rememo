import { PrismaClient } from '@prisma/client';
import { createToken } from '../../../lib/auth';

// TODO - set prisma as singleton to prevent so many clients being created
const prisma = new PrismaClient();

// POST: creates a new user and returns a token linked to the user
export default async (req, res) => {
    let body = JSON.parse(req.body);

    let existingUser = await prisma.user.findFirst({
        where: { email: body.email }
    })

    if (existingUser) {
        res.status(200);
        res.json({ duplicateEmail: true });
        return;
    }
    
    let user = await prisma.user.create({
        data: {
            email: body.email,
            password: body.password,
        }
    })

    let token = await createToken(user.id);

    res.status(200);
    res.json({
        duplicateEmail: false,
        token: token
    })
}
