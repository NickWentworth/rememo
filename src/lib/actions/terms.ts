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

// TODO: streamline create/update/delete process on child tables (vacations, subtasks, course times)

/**
 * Write a new term into the database, creating new term vacations when needed
 */
export async function createTerm(term: TermPayload) {
    const user = await getUserOrThrow();

    // create new term
    const createdTerm = await prisma.term.create({
        data: {
            ...payloadToTerm(term),
            id: undefined, // generate term id
            userId: user.id,
        },
    });

    // and create new term vacations if needed
    for (const vacation of term.vacations) {
        await prisma.termVacation.create({
            data: {
                ...vacation,
                id: undefined, // generate term vacation id
                termId: createdTerm.id, // relate term vacation to parent term
            },
        });
    }
}

/**
 * Update an existing term in the database, matched by id
 *
 * Handles creating, updating, and deleting any term vacations as needed
 */
export async function updateTerm(term: TermPayload) {
    await getUserOrThrow();

    // update the term
    const updatedTerm = await prisma.term.update({
        where: { id: term.id },
        data: payloadToTerm(term),
        include: { vacations: true },
    });

    // upsert any term vacations needing to be created or updated
    for (const vacation of term.vacations) {
        await prisma.termVacation.upsert({
            create: {
                ...vacation,
                id: undefined,
                termId: term.id,
            },
            update: vacation,
            where: { id: vacation.id },
        });
    }

    // and finally delete any vacations that are missing from received data
    const missingVacationIds = updatedTerm.vacations
        .map((vacation) => vacation.id)
        .filter((id) => term.vacations.every((vacation) => vacation.id !== id));

    await prisma.termVacation.deleteMany({
        where: {
            id: {
                in: missingVacationIds,
            },
        },
    });
}

/**
 * Delete a term in the database, given by term id
 */
export async function deleteTerm(id: string) {
    await getUserOrThrow();

    await prisma.term.delete({ where: { id } });
}
