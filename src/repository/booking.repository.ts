
import prisma from "../prisma/client.js";
import { Prisma } from "../prisma/generated/client.js";


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
export async function getIdempotencyKey(key: string) {

    const idempotencyKey = await prisma.idempotencyKey.findUnique({
        where: {
            key 
        }
    });
    return idempotencyKey;
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