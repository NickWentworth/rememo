import { PrismaClient } from '@prisma/client';
import { getUserId } from '../../../lib/user';

// TODO - set prisma as singleton to prevent so many clients being created
const prisma = new PrismaClient();

// GET: gets all tasks belonging to a user
export default async (req, res) => {
    const userId = await getUserId(req, res);
    if (!userId) { return; }

    let tasks = await prisma.task.findMany({
        where: { userId: userId }
    })

    res.status(200).json({ tasks: tasks });
}
