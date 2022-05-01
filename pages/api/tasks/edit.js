import { PrismaClient } from '@prisma/client';

// TODO - set prisma as singleton to prevent so many clients being created
const prisma = new PrismaClient();

// POST: modifies task in database with matching id
export default async (req, res) => {
    let body = JSON.parse(req.body);

    let editedTask = await prisma.task.update({
        data: body.task,
        where: { id: body.task.id }
    })

    res.status(200);
    res.json({ task: editedTask });
}
