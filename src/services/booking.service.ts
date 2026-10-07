import { createBooking, createIdempotencyKey } from "../repository/booking.repository.js";
import { generateIdempotencyKey } from "../utilis/helpers/generateIdempotencyKey.js";

export async function createBokkingService(
    userId: number,
    hotelId: number,
    bookingAmmount: number,
    totalGuests: number
) {
    const booking = await createBooking({
        userId,
        hotelId,
        totalGuests: totalGuests,
        bookingAmmount: bookingAmmount
    })

    const idempotencyKey = generateIdempotencyKey();

    await createIdempotencyKey(idempotencyKey, booking.id);
    return {
        bookingId: booking.id,
        idempotencyKey : idempotencyKey
    }


  
}