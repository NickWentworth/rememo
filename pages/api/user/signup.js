import { PrismaClient } from '@prisma/client';

// TODO - set prisma as singleton to prevent so many clients being created
const prisma = new PrismaClient();

export default async (req, res) => {
    let body = JSON.parse(req.body);

    let existingUser = await prisma.user.findFirst({
        where: { email: body.email }
    })
    
    let user = null;
    if (!existingUser) {
        user = await prisma.user.create({
            data: {
                email: body.email,
                password: body.password,
            }
        })
    }

    res.status(200);
    res.json({
        duplicateEmail: (user == null),
        userId: user?.id || ''
    })
}
