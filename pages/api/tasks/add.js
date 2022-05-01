import { PrismaClient } from '@prisma/client';

// TODO - set prisma as singleton to prevent so many clients being created
const prisma = new PrismaClient();

// POST: adds task to database
export default async (req, res) => {
    let body = JSON.parse(req.body);

    let addedTask = await prisma.task.create({
        data: body.task
    })

    res.status(200);
    res.json({ task: addedTask });
}
