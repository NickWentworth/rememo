import { PrismaClient } from '@prisma/client';
import { getUserId } from '../../../lib/user';

// TODO - set prisma as singleton to prevent so many clients being created
const prisma = new PrismaClient();

// POST: adds task to database
export default async (req, res) => {
    const userId = await getUserId(req, res);
    if (!userId) { return; }

    let body = JSON.parse(req.body);

    let addedTask = await prisma.task.create({
        data: { ...body.task, userId: userId }
    })

    if (!addedTask) {
        res.status(400).json({ text: 'Error adding task' });
        return;
    }

    res.status(200).json({ task: addedTask });
}
