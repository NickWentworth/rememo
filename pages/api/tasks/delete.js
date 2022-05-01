import { PrismaClient } from '@prisma/client';

// TODO - set prisma as singleton to prevent so many clients being created
const prisma = new PrismaClient();

// POST: deletes task from database
export default async (req, res) => {
    let body = JSON.parse(req.body);

    let deletedTask = await prisma.task.delete({
        where: { id: body.task.id }
    })

    res.status(200);
    res.json({ task: deletedTask });
}
