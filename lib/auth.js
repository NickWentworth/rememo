import { PrismaClient } from '@prisma/client';

// TODO - set prisma as singleton to prevent so many clients being created
const prisma = new PrismaClient();

// checks to see if a token matches a user
// if successful, returns the user id and a new token
export async function verifyToken(token) {
    let verifiedToken = await prisma.token.findFirst({
        where: { id: token }
    })

    if (!verifiedToken) {
        return ['', ''];
    }

    await prisma.token.delete({
        where: { id: token }
    })

    let newToken = await createToken(verifiedToken.userId);

    return [verifiedToken.userId, newToken];
}

// creates a new token linked to given userId and returns its id
export async function createToken(userId) {
    let token = await prisma.token.create({
        data: { userId: userId }
    })

    return token.id;
}
