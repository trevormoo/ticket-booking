import { z } from 'zod'

// Event validation schemas
export const createEventSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),
  capacity: z.number().int().positive('Capacity must be positive').optional(),
})

export const updateEventSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long').optional(),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }).optional(),
  capacity: z.number().int().positive('Capacity must be positive').optional(),
})

// Booking/Ticket validation schemas
export const createBookingSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name too long')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name contains invalid characters'),
  email: z.string()
    .email('Invalid email format')
    .toLowerCase()
    .max(255, 'Email too long'),
  eventId: z.number().int().positive('Invalid event ID'),
})

// Checkout validation schema
export const checkoutSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name too long')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name contains invalid characters'),
  email: z.string()
    .email('Invalid email format')
    .toLowerCase()
    .max(255, 'Email too long'),
  eventId: z.number().int().positive('Invalid event ID'),
})

// Check-in validation schema
export const checkInSchema = z.object({
  ticketId: z.number().int().positive('Invalid ticket ID'),
})

// ID parameter validation
export const idParamSchema = z.object({
  id: z.string().regex(/^\d+$/, 'ID must be a number'),
})

// Helper function to validate request body
export function validateRequestBody<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: string } {
  try {
    const validatedData = schema.parse(data)
    return { success: true, data: validatedData }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.issues[0]
      return { success: false, error: firstError.message }
    }
    return { success: false, error: 'Validation failed' }
  }
}

// Helper function to safely parse ID from params
export function parseId(id: string | undefined): number | null {
  if (!id) return null
  const parsed = Number(id)
  if (isNaN(parsed) || parsed <= 0) return null
  return parsed
}
