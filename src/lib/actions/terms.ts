'use server';

import { PrismaClient } from '@prisma/client';
import { TermPayload, payloadToTerm } from '../types';
import { getServerUserOrThrow } from '../auth';

const prisma = new PrismaClient();

/**
 * Returns all terms that a user owns or throws an error if unauthenticated
 */
export async function getTerms() {
    console.log('Fetching ALL terms');

    const user = await getServerUserOrThrow();

    return await prisma.term.findMany({
        where: {
            userId: user.id,
        },
    });
}

/**
 * Returns the given term by id, if the user owns it
 */
export async function getTermById(id: string) {
    console.log(`Fetching term id ${id}`);

    const user = await getServerUserOrThrow();

    return await prisma.term.findUniqueOrThrow({
        where: {
            id,
            userId: user.id,
        },
    });
}

/**
 * Write a new term into the database
 */
export async function createTerm(term: TermPayload) {
    const user = await getServerUserOrThrow();

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
    await getServerUserOrThrow();

    await prisma.term.update({
        where: { id: term.id },
        data: payloadToTerm(term),
    });
}

/**
 * Delete a term in the database, given by term id
 */
export async function deleteTerm(id: string) {
    await getServerUserOrThrow();

    await prisma.term.delete({ where: { id } });
}
