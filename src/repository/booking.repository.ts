
import prisma from "../prisma/client.js";
import { Prisma } from "../prisma/generated/client.js";
import { validate as isValidUUID } from "uuid";
import { BadRequestError, NotFoundError } from '../utilis/error/app.error.js';



// for creating booking
export async function createBooking(bookingInput: Prisma.BookingCreateInput) {
    const booking = await prisma.booking.create(
        { data: bookingInput }
    );
    return booking;
}

// for creating idem key
export async function createIdempotencyKey(key: string, bookingId: number) {
    const idempotencyKey = await prisma.idempotencyKey.create({
        data: {
            key,
            booking: {
                connect: {
                    id: bookingId
                }
            }
        }
    });
    return idempotencyKey
}


//   for get the idem key
export async function getIdempotencyKeyWithLock(key: string, tx: Prisma.TransactionClient) {

    if (!isValidUUID(key)) {
        throw new BadRequestError("Invalid idemponetcy key format");
    }

    const idempotencyKey: Array<Prisma.idempotencyKeySelect> = await tx.$queryRaw`
    SELECT * FROM "IdempotencyKey" WHERE "key" = ${key} FOR UPDATE `

    console.log("idempotemcyKey not found", idempotencyKey);

    if (!idempotencyKey || idempotencyKey.length == 0) {
        throw new NotFoundError("idemponetcy key not found");
    }
    return idempotencyKey[0]
}



//   for get the booking id
export async function getBookingById(bookingId: number) {

    const booking = await prisma.booking.findUnique({
        where: {
            id: bookingId
        }
    });
    return booking;
}

//   updating status of booking after finalize booking
export async function confirmBooking(bookingId: number) {
    const booking = await prisma.booking.update({
        where: {
            id: bookingId
        },
        data: {
            status: "CONFIRMED"
        }
    });
    return booking;
}

//   updating status of booking 
export async function cancleBooking(bookingId: number) {
    const booking = await prisma.booking.update({
        where: {
            id: bookingId
        },
        data: {
            status: "CANCELLED"
        }
    });
    return booking;
}

// updating finalize status
export async function finalizeIdempotencyKey(key: string) {
    const idempotencyKey = await prisma.idempotencyKey.update({
        where: {
            key
        },
        data: {
            finalized: true
        }
    });
    return idempotencyKey
}