import type { bookingDTO } from "../dto/booking.dto.js";
import { confirmBooking, createBooking, createIdempotencyKey, finalizeIdempotencyKey, getIdempotencyKey } from "../repository/booking.repository.js";
import { BadRequestError, NotFoundError } from "../utilis/error/app.error.js";
import { generateIdempotencyKey } from "../utilis/helpers/generateIdempotencyKey.js";

export async function createBookingService(BookingDTO: bookingDTO) {
    const booking = await createBooking({
        userId: BookingDTO.userId,
        hotelId: BookingDTO.hotelId,
        bookingAmmount: BookingDTO.bookingAmmount,
        totalGuests: BookingDTO.totalGuests
    })

    const idempotencyKey = generateIdempotencyKey();

    await createIdempotencyKey(idempotencyKey, booking.id);
    return {
        bookingId: booking.id,
        idempotencyKey: idempotencyKey
    }

}

export async function confirmBookingService(idempotencyKey: string) {
    const idempotencyKeyData = await getIdempotencyKey(idempotencyKey);
    if (!idempotencyKeyData) {
        throw new NotFoundError(" idempotency key not found");
    }
    if (idempotencyKeyData.finalized) {
        throw new BadRequestError("Booking already finalized");
    }

    const booking = await confirmBooking(idempotencyKeyData.bookingId);
    await finalizeIdempotencyKey(idempotencyKey)
    return booking;
}