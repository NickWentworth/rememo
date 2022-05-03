import { PrismaClient } from '@prisma/client';
import { verifyToken } from '../../../lib/auth';

// TODO - set prisma as singleton to prevent so many clients being created
const prisma = new PrismaClient();

// POST: adds task to database
export default async (req, res) => {
    let body = JSON.parse(req.body);

    let [userId, token] = await verifyToken(body.token);

    if (!userId || !token) {
        res.status(401);
        res.json({ message: 'Bad token' });
        return;
    }

    let addedTask = await prisma.task.create({
        data: { ...body.task, userId: userId }
    })

    res.status(200);
    res.json({
        task: addedTask,
        token: token
    })
}
