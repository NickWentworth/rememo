import { PrismaClient } from '@prisma/client';
import { verifyToken } from '../../../lib/auth';

// TODO - set prisma as singleton to prevent so many clients being created
const prisma = new PrismaClient();

// GET: gets all tasks matching a userId linked to a given token
export default async (req, res) => {
    let [userId, token] = await verifyToken(req.query.token);

    if (!userId || !token) {
        res.status(401);
        res.json({ message: 'Bad token' });
        return;
    }

    let tasks = await prisma.task.findMany({
        where: { userId: userId }
    })

    res.status(200);
    res.json({
        tasks: tasks,
        token: token
    });
}
