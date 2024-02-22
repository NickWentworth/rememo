'use server';

import { PrismaClient } from '@prisma/client';
import { TERM_ARGS, TermPayload, payloadToTerm } from '../types';
import { getUserOrThrow } from './user';

const prisma = new PrismaClient();

/**
 * Returns all terms that a user owns or throws an error if unauthenticated
 */
export async function getTerms() {
    const user = await getUserOrThrow();

    return await prisma.term.findMany({
        where: {
            userId: user.id,
        },
        orderBy: [
            // show latest term (likely closest to now) at the top of the page
            { start: 'desc' },
        ],
        ...TERM_ARGS,
    });
}

/**
 * Write a new term into the database
 */
export async function createTerm(term: TermPayload) {
    const user = await getUserOrThrow();

    await prisma.term.create({
        data: {
            ...payloadToTerm(term),
            id: undefined, // generate term id
            userId: user.id,
        },
    });
}

/**
 * Update an existing term in the database, matched by id
 */
export async function updateTerm(term: TermPayload) {
    await getUserOrThrow();

    await prisma.term.update({
        where: { id: term.id },
        data: payloadToTerm(term),
    });
}

/**
 * Delete a term in the database, given by term id
 */
export async function deleteTerm(id: string) {
    await getUserOrThrow();

    await prisma.term.delete({ where: { id } });
}
