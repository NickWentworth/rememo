'use server';

import { PrismaClient } from '@prisma/client';
import { TermPayload, payloadToTerm } from '../types';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

/**
 * Write a new term into the database
 */
export async function createTerm(term: TermPayload) {
    await prisma.term.create({
        data: {
            ...payloadToTerm(term),
            id: undefined, // generate term id
        },
    });

    revalidatePath('/courses');
}

/**
 * Update an existing term in the database, matched by id
 */
export async function updateTerm(term: TermPayload) {
    await prisma.term.update({
        where: { id: term.id },
        data: payloadToTerm(term),
    });

    revalidatePath('/courses');
}

/**
 * Delete a term in the database, given by term id
 */
export async function deleteTerm(id: string) {
    await prisma.term.delete({ where: { id } });

    revalidatePath('/courses');
}
