import { PrismaClient } from '@prisma/client';
import { getUserId } from '../../../lib/user';

// TODO - set prisma as singleton to prevent so many clients being created
const prisma = new PrismaClient();

// POST: deletes task from database
export default async (req, res) => {
    const userId = await getUserId(req, res);
    if (!userId) { return; }

    let body = JSON.parse(req.body);

    let deletedTask = await prisma.task.delete({
        where: { id: body.data.id }
    })

    if (!deletedTask) {
        res.status(400).json({ text: 'Error deleting task' });
        return;
    }

    res.status(200).json({ data: deletedTask });
}
