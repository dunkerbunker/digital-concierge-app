// actions/booking.actions.ts
'use server';

import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma'; // Your Prisma client instance
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// Define Zod schema for booking creation input validation
const CreateBookingSchema = z.object({
  serviceId: z.string().min(1, { message: 'Service selection is required.' }),
  bookingDate: z.date({ message: 'Valid booking date is required.' }),
  notes: z.string().max(500, { message: 'Notes must be 500 characters or less.' }).optional(),
  // Add other relevant fields like locationId, specific time, etc. if needed
});

/**
 * Creates a new booking for the currently logged-in user.
 */
export async function createBooking(input: {
    serviceId: string;
    bookingDate: Date;
    notes?: string;
}) {
  const { userId } = auth();

  // 1. Authentication Check
  if (!userId) {
    return { success: false, error: 'Unauthorized: User must be logged in.' };
  }

  // 2. Validation
  const validationResult = CreateBookingSchema.safeParse(input);
  if (!validationResult.success) {
    // Extract and format validation errors (simplified example)
    const errors = validationResult.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
    return { success: false, error: `Invalid input: ${errors}` };
  }

  const { serviceId, bookingDate, notes } = validationResult.data;

  try {
    // 3. Database Interaction
    const newBooking = await prisma.booking.create({
      data: {
        userId: userId, // Link booking to the logged-in user
        serviceId: serviceId, // Assuming you have a Service model and relation
        bookingDate: bookingDate,
        status: 'PENDING', // Default status, adjust as needed (e.g., CONFIRMED)
        notes: notes,
        // Add other fields corresponding to your Prisma schema
      },
    });

    // 4. Revalidate Cache (Optional but recommended for UI updates)
    // Revalidate the path where bookings are displayed
    revalidatePath('/guest/bookings');

    // 5. Return Success
    return { success: true, data: newBooking };

  } catch (error) {
    console.error("Error creating booking:", error);
    // Handle potential specific Prisma errors if needed (e.g., unique constraint violation)
    return { success: false, error: 'Database error: Failed to create booking.' };
  }
}

/**
 * Fetches all bookings for the currently logged-in user.
 */
export async function getBookingsByUser() {
  const { userId } = auth();

  // 1. Authentication Check
  if (!userId) {
    // Depending on usage, you might throw an error or return an empty array/error object
     return { success: false, error: 'Unauthorized: User must be logged in.', data: [] };
    // Or: throw new Error("Unauthorized");
  }

  try {
    // 2. Database Interaction
    const bookings = await prisma.booking.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        bookingDate: 'desc', // Order by date, newest first (or 'asc' for oldest)
      },
      // Include related data if needed (e.g., service details)
      // include: {
      //   service: { // Assuming relation name is 'service'
      //     select: { name: true, description: true }
      //   }
      // }
    });

    // 3. Return Success
    return { success: true, data: bookings };

  } catch (error) {
    console.error("Error fetching bookings:", error);
    return { success: false, error: 'Database error: Failed to fetch bookings.', data: [] };
  }
}

/**
 * Cancels a specific booking for the currently logged-in user.
 * Example additional action.
 */
export async function cancelBooking(bookingId: string) {
   const { userId } = auth();

   // 1. Authentication Check
   if (!userId) {
     return { success: false, error: 'Unauthorized' };
   }

   try {
        // 2. Verify Ownership & Update
        const bookingToCancel = await prisma.booking.findUnique({
            where: { id: bookingId },
        });

        if (!bookingToCancel) {
            return { success: false, error: 'Booking not found.' };
        }

        if (bookingToCancel.userId !== userId) {
             return { success: false, error: 'Forbidden: You can only cancel your own bookings.' };
        }

        // Prevent cancelling bookings that are already past or completed (optional)
        // if (bookingToCancel.status === 'COMPLETED' || bookingToCancel.bookingDate < new Date()) {
        //    return { success: false, error: 'Cannot cancel past or completed bookings.' };
        // }

        const updatedBooking = await prisma.booking.update({
            where: { id: bookingId },
            data: { status: 'CANCELLED' }, // Or delete: await prisma.booking.delete(...)
        });

         // 3. Revalidate Cache
        revalidatePath('/guest/bookings');

        // 4. Return Success
        return { success: true, data: updatedBooking };

   } catch (error) {
       console.error("Error cancelling booking:", error);
       return { success: false, error: 'Database error: Failed to cancel booking.' };
   }
}

// Add other actions as needed (e.g., updateBooking, getBookingById)