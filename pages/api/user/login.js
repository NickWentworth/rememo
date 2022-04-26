import { PrismaClient } from '@prisma/client';

// TODO - set prisma as singleton to prevent so many clients being created
const prisma = new PrismaClient();

export default async (req, res) => {
    let body = JSON.parse(req.body);

    let user = await prisma.user.findFirst({
        where: { email: body.email }
    })

    res.status(200);
    res.json({
        accountExists: (user != null),
        successfulLogin: (user != null) && (user.password == body.password),
        userId: user?.id || ''
    })
}
