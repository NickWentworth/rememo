import { PrismaClient } from '@prisma/client';
import { getSession } from 'next-auth/react';

// TODO - set prisma as singleton to prevent so many clients being created
const prisma = new PrismaClient();

// takes in request and response object and returns the user's id
// if error, sets up the response correctly, can just return in calling api function
export async function getUserId(req, res) {
    const session = await getSession({ req });

    if (!session) {
        res.status(403).json({ text: 'Unauthorized request' });
        return null;
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email }
    })

    if (!user) {
        res.status(403).json({ text: 'Unauthorized request' });
        return null;
    }

    return user.id;
}
