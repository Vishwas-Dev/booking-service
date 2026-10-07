import z from "zod/v3";

export const createBookingSchema = z.object({
    userId: z.number({ message: "userId must be a present" }),
    hotelId: z.number({ message: "hotelId must be a present" }),
    totalGuests: z.number({ message: "totalGuests must be present" }).min(1, { message: "totalGuest must be atleast 1" }),
    bookingAmmount: z.number({ message: "bookingAmmount must be present" }).min(1, { message: "booking ammount must be greater than 1" })
});
