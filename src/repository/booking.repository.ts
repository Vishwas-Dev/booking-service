
import prisma from "../prisma/client.js";
import type { Prisma } from "../prisma/generated/client.js";



export async function createBooking( bookingInput: Prisma.BookingCreateInput) {
    const booking =  await prisma.booking.create({ data: bookingInput })
    return booking;
} 