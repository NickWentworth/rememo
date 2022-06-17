import { PrismaClient } from '@prisma/client';
import { getUserId } from '../../../lib/user';

// TODO - set prisma as singleton to prevent so many clients being created
const prisma = new PrismaClient();

// POST: modifies task in database with matching id
export default async (req, res) => {
    const userId = await getUserId(req, res);
    if (!userId) { return; }

    let body = JSON.parse(req.body);

    let editedTask = await prisma.task.update({
        data: body.data,
        where: { id: body.data.id }
    })

    if (!editedTask) {
        res.status(400).json({ text: 'Error editing task' });
        return;
    }

    res.status(200).json({ data: editedTask });
}
