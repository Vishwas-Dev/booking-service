import { serverConfig } from "../config/index.js";
import { redlock } from "../config/redis.config.js";
import type { bookingDTO } from "../dto/booking.dto.js";
import prisma from "../prisma/client.js";
import { confirmBooking, createBooking, createIdempotencyKey, finalizeIdempotencyKey, getIdempotencyKeyWithLock } from "../repositories/booking.repository.js";
import { BadRequestError, InternalServerError, NotFoundError } from "../utilis/error/app.error.js";
import { generateIdempotencyKey } from "../utilis/helpers/generateIdempotencyKey.js";


export async function createBookingService(BookingDTO: bookingDTO) {

    const ttl = serverConfig.LOCK_TTL;
    const bookingResource = `hotel:${BookingDTO.hotelId}`;
    try {
        // console.log("1. Acquiring lock:", bookingResource);
        await redlock.acquire([bookingResource], ttl);

        // console.log("2. Lock acquired");
        const booking = await createBooking({
            userId: BookingDTO.userId,
            hotelId: BookingDTO.hotelId,
            totalGuests: BookingDTO.totalGuests,
            bookingAmmount: BookingDTO.bookingAmmount,
        });
        // console.log("3. Booking created:", booking.id);
        const idempotencyKey = generateIdempotencyKey();

        await createIdempotencyKey(idempotencyKey, booking.id);
        // console.log("4. Idempotency key created");
        return {
            bookingId: booking.id,
            idempotencyKey: idempotencyKey,
        };
    } catch (error) {
        console.error("Create booking error:", error);
        throw new InternalServerError('Failed to acquire lock for booking resource');
    }

}

export async function confirmBookingService(idempotencyKey: string) {
    return await prisma.$transaction(async (tx) => {
        const idempotencyKeyData = await getIdempotencyKeyWithLock(tx, idempotencyKey);
        if (!idempotencyKeyData) {
            throw new NotFoundError(" idempotency key not found");
        }
        if (idempotencyKeyData.finalized) {
            throw new BadRequestError("Booking already finalized");
        }

        const booking = await confirmBooking(tx, idempotencyKeyData.bookingId);
        await finalizeIdempotencyKey(tx, idempotencyKey)
        return booking;
    })



}

