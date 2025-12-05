# API Documentation

Complete API reference for the Ticket Booking System.

## Base URL

- **Development**: `http://localhost:3000/api`
- **Production**: `https://your-domain.com/api`

## Authentication

Most endpoints are public. Admin endpoints require GitHub OAuth authentication via NextAuth.js.

### Admin Authentication
Protected routes check for authenticated session with email in `ADMIN_EMAILS` environment variable.

---

## Events

### GET /api/events

Get all events, sorted by date (ascending).

**Authentication**: None

**Response**: `200 OK`
```json
[
  {
    "id": 1,
    "title": "Tech Conference 2025",
    "date": "2025-03-15T09:00:00.000Z",
    "capacity": 100,
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
]
```

**Errors**:
- `500`: Failed to fetch events

---

### POST /api/events

Create a new event.

**Authentication**: None (should be protected in production)

**Request Body**:
```json
{
  "title": "Tech Conference 2025",
  "date": "2025-03-15T09:00:00.000Z",
  "capacity": 100  // optional
}
```

**Validation**:
- `title`: 1-200 characters, required
- `date`: Valid ISO 8601 date string, required
- `capacity`: Positive integer, optional

**Response**: `201 Created`
```json
{
  "id": 1,
  "title": "Tech Conference 2025",
  "date": "2025-03-15T09:00:00.000Z",
  "capacity": 100,
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T00:00:00.000Z"
}
```

**Errors**:
- `400`: Validation error
- `500`: Failed to create event

---

### PUT /api/events/[id]

Update an existing event.

**Authentication**: None (should be protected in production)

**URL Parameters**:
- `id`: Event ID (integer)

**Request Body** (all fields optional):
```json
{
  "title": "Updated Conference Name",
  "date": "2025-03-20T09:00:00.000Z",
  "capacity": 150
}
```

**Response**: `200 OK`
```json
{
  "id": 1,
  "title": "Updated Conference Name",
  "date": "2025-03-20T09:00:00.000Z",
  "capacity": 150,
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-15T00:00:00.000Z"
}
```

**Errors**:
- `400`: Invalid event ID or validation error
- `500`: Failed to update event

---

### DELETE /api/events/[id]

Delete an event and all associated tickets (cascade delete).

**Authentication**: None (should be protected in production)

**URL Parameters**:
- `id`: Event ID (integer)

**Response**: `200 OK`
```json
{
  "success": true
}
```

**Errors**:
- `400`: Invalid event ID
- `500`: Delete failed

---

## Bookings

### GET /api/bookings

Get all bookings with event information, sorted by creation date (descending).

**Authentication**: None (should be protected in production)

**Response**: `200 OK`
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "eventId": 1,
    "paid": true,
    "checkedIn": false,
    "createdAt": "2025-01-10T00:00:00.000Z",
    "updatedAt": "2025-01-10T00:00:00.000Z",
    "event": {
      "id": 1,
      "title": "Tech Conference 2025",
      "date": "2025-03-15T09:00:00.000Z"
    }
  }
]
```

**Errors**:
- `500`: Failed to fetch bookings

---

### POST /api/bookings

Create a new free booking (no payment required).

**Authentication**: None

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "eventId": 1
}
```

**Validation**:
- `name`: 1-100 characters, letters/spaces/hyphens/apostrophes only, required
- `email`: Valid email format, max 255 characters, required (automatically lowercased)
- `eventId`: Positive integer, required

**Response**: `201 Created`
```json
{
  "id": 1
}
```

**Errors**:
- `400`: Validation error or event fully booked
- `404`: Event not found
- `409`: Email already booked for this event
- `500`: Failed to create booking

**Notes**:
- Uses database transaction to prevent race conditions
- Checks event capacity atomically
- One booking per email per event (enforced by unique constraint)

---

### DELETE /api/bookings/[id]

Delete a booking.

**Authentication**: None (should be protected in production)

**URL Parameters**:
- `id`: Booking ID (integer)

**Response**: `200 OK`
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "eventId": 1,
  "paid": false,
  "checkedIn": false,
  "createdAt": "2025-01-10T00:00:00.000Z",
  "updatedAt": "2025-01-10T00:00:00.000Z"
}
```

**Errors**:
- `400`: Invalid booking ID
- `500`: Delete failed

---

## Checkout & Payments

### POST /api/checkout

Create a Stripe checkout session for paid bookings.

**Authentication**: None

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "eventId": 1
}
```

**Validation**:
- Same as `/api/bookings` (see above)

**Response**: `200 OK`
```json
{
  "url": "https://checkout.stripe.com/c/pay/cs_test_..."
}
```

**Errors**:
- `400`: Validation error or event fully booked
- `404`: Event not found
- `409`: Email already booked for this event
- `500`: Checkout failed

**Flow**:
1. Creates unpaid booking in database
2. Creates Stripe checkout session ($10.00)
3. Redirects user to Stripe
4. On success, redirects to `/tickets/[id]?success=1`
5. On cancel, redirects to `/book/[id]?canceled=1`

---

### POST /api/webhook

Stripe webhook handler for payment confirmation.

**Authentication**: Stripe signature verification

**Headers**:
- `stripe-signature`: Required

**Handled Events**:
- `checkout.session.completed`: Mark booking as paid, send confirmation email

**Response**: `200 OK`
```
Received
```

**Errors**:
- `400`: Invalid signature or malformed request
- `500`: Database error (triggers Stripe retry)

**Notes**:
- Email sending errors are logged but don't fail the webhook
- Database errors return 500 to trigger Stripe retry mechanism

---

## Check-In

### POST /api/check-in

Check in a ticket using QR code data.

**Authentication**: None

**Request Body** (form-urlencoded):
```
ticketId=1
```

**Validation**:
- `ticketId`: Positive integer, required
- Ticket must exist
- Ticket must not already be checked in

**Response**: `302 Redirect`

Redirects to `/check-in/[ticketId]?success=1`

**Errors**:
- `400`: Missing or invalid ticketId, or ticket already checked in
- `404`: Ticket not found
- `500`: Check-in failed

---

## Statistics

### GET /api/stats

Get dashboard statistics.

**Authentication**: None (should be protected in production)

**Response**: `200 OK`
```json
{
  "totalBookings": 150,
  "checkedIn": 75,
  "notCheckedIn": 75,
  "totalEvents": 5
}
```

**Errors**:
- `500`: Failed to fetch stats

---

## Admin Cleanup

### POST /api/admin/cleanup

Clean up orphaned tickets (tickets whose events no longer exist).

**Authentication**: None (should be protected in production)

**Response**: `200 OK`
```json
{
  "message": "✅ Cleaned 5 orphaned ticket(s).",
  "orphanedIds": [1, 2, 3, 4, 5]
}
```

**Errors**:
- `500`: Cleanup failed

---

## Error Response Format

All error responses follow this format:

```json
{
  "error": "Error message describing what went wrong"
}
```

**Common HTTP Status Codes**:
- `200`: Success
- `201`: Created
- `302`: Redirect
- `400`: Bad Request (validation error, invalid input)
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `409`: Conflict (duplicate booking)
- `500`: Internal Server Error

---

## Rate Limiting

Currently not implemented. **Recommended for production:**
- 100 requests per 15 minutes per IP for booking endpoints
- 1000 requests per 15 minutes for read endpoints

---

## Pagination

Currently not implemented. All list endpoints return complete results.

**Recommended for production:**
- Add `?page=1&limit=50` query parameters
- Return metadata: `{ data: [...], page: 1, total: 100, hasMore: true }`

---

## Webhooks

### Stripe Webhook Events

The system listens for the following Stripe events:

#### `checkout.session.completed`

Triggered when a customer completes a checkout session.

**Metadata**:
- `bookingId`: Booking ID to mark as paid
- `eventId`: Event ID for reference
- `email`: Customer email

**Actions**:
1. Mark ticket as `paid: true`
2. Send confirmation email with QR code
3. Return 200 to acknowledge receipt

---

## Best Practices

### Client-Side Integration

1. **Error Handling**:
   ```typescript
   const response = await fetch('/api/bookings', { method: 'POST', ... })
   if (!response.ok) {
     const { error } = await response.json()
     // Display error to user
   }
   ```

2. **Loading States**:
   ```typescript
   setLoading(true)
   try {
     await fetch(...)
   } finally {
     setLoading(false)
   }
   ```

3. **Validation**:
   - Validate on client before API call
   - Handle server validation errors gracefully
   - Show field-specific error messages

### Security

1. **Input Sanitization**: All inputs are validated with Zod schemas
2. **SQL Injection Prevention**: Prisma ORM prevents SQL injection
3. **XSS Prevention**: React escapes output by default
4. **CSRF Protection**: NextAuth handles CSRF tokens
5. **Rate Limiting**: Implement in production

---

## Migration Guide

If updating from an older version:

### Database Schema Changes

Run migration to add indexes and timestamps:

```bash
npx prisma migrate dev --name add_indexes_and_timestamps
```

### API Breaking Changes

**v1.1.0**:
- All endpoints now validate input with Zod
- Error responses are more specific
- Booking endpoints use transactions (no visible changes)
- Admin email is now environment variable

---

## Testing

### Example API Tests

```typescript
// Test booking creation
describe('POST /api/bookings', () => {
  it('creates a booking successfully', async () => {
    const response = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'John Doe',
        email: 'john@example.com',
        eventId: 1
      })
    })
    expect(response.status).toBe(201)
    const data = await response.json()
    expect(data).toHaveProperty('id')
  })

  it('prevents duplicate bookings', async () => {
    // Create first booking
    await createBooking(...)

    // Try to create duplicate
    const response = await createBooking(...)
    expect(response.status).toBe(409)
    const { error } = await response.json()
    expect(error).toContain('already booked')
  })
})
```

---

## Support

For API-related issues:
1. Check this documentation
2. Review error message and HTTP status code
3. Check browser console/network tab
4. Review server logs
5. Open an issue on GitHub

---

## Changelog

### v1.1.0 (2025-01-05)
- Added Zod validation to all endpoints
- Improved error responses
- Added transaction support for bookings
- Fixed race conditions
- Added comprehensive error handling

### v1.0.0 (2025-01-01)
- Initial release
- Basic CRUD operations
- Stripe integration
- Email notifications
