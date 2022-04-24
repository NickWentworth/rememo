import { PrismaClient } from '@prisma/client';

// TODO - set prisma as singleton to prevent so many clients being created
const prisma = new PrismaClient();

// GET: gets all tasks matching a given userID
// POST: updates tasks table based on provided function
export default async (req, res) => {
    let userID = req.query.userID;

    switch (req.method) {
        case 'POST':
            let body = JSON.parse(req.body);
            
            switch (body.function) {
                case 'add':
                    let addedTask = await prisma.task.create({
                        data: body.task
                    })

                    res.status(200);
                    res.json({ task: addedTask });
                    break;
                
                case 'delete':
                    let deletedTask = await prisma.task.delete({
                        where: { id: body.task.id }
                    })

                    res.status(200);
                    res.json({ task: deletedTask });
                    break;
                
                case 'edit':
                    let editedTask = await prisma.task.update({
                        data: body.task,
                        where: { id: body.task.id }
                    })
                    res.status(200);
                    res.json({ task: editedTask });
                    break;
                
                default:
                    res.status(405);
                    break;                
                
            }
            break;

        case 'GET':
            const tasks = await prisma.task.findMany();
            res.status(200);
            res.json({ tasks: tasks});
            break;

        default:
            res.status(405);
            break;
    }
}
