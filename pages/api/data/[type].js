import { PrismaClient } from '@prisma/client';
import { getSession } from 'next-auth/react';

// TODO - set prisma as singleton to prevent so many clients being created
const prisma = new PrismaClient();

// matches a type string to the table it represents
const typeToTable = {
    'term': prisma.term,
    'course': prisma.course,
    'task': prisma.task
}

// GET: gets all [type] belonging to a user
// POST: adds the [type] to its respective table
// DELETE: deletes the [type] from its table
// PUT: edits the [type] with matching id
// [type] is specified in route query
export default async (req, res) => {
    const userId = await getUserId(req);
    if (!userId) {
        res.status(401).json({ error: 'Unauthorized request' });
        return;
    }
    
    // get matching table in database from [type]
    const type = req.query.type;
    if (!(type in typeToTable)) {
        res.status(400).json({ error: `Invalid data type: ${type}` });
        return;
    }
    const prismaTable = typeToTable[type];
    
    let body = JSON.parse(req.body || '{}');
    let data = null;

    // if any empty strings as values, set them to null to prevent foreign key errors
    for (let key in body.data) {
        if (body.data[key] === '') {
            body.data[key] = null;
        }
    }
    
    switch (req.method) {
        case 'GET':
            data = await prismaTable.findMany({
                where: { userId: userId }
            })
            break;
        case 'POST':
            data = await prismaTable.create({
                data: { ...body.data, userId }
            })
            break;
        case 'DELETE':
            data = await prismaTable.delete({
                where: { id: body.data.id }
            })
            break;
        case 'PUT':
            data = await prismaTable.update({
                data: body.data,
                where: { id: body.data.id }
            })
            break;
        default:
            res.status(400).json({ error: `Invalid method: ${req.method}` });
            return;
    }

    // if data is still null, something went wrong
    // data could still be an empty list (ex: for a new user)
    if (data == null) {
        res.status(400).json({ error: `Error ${req.method}-ing ${type}` });
        return;
    }

    res.status(200).json({ data });
}

// TODO - add this to lib if future api routes are created
// takes in request and response object and returns the user's id
// if error, sets up the response correctly, can just return in calling api function
async function getUserId(req) {
    const session = await getSession({ req });

    if (!session) { return null; }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email }
    })

    if (!user) { return null; }

    return user.id;
}
