# Ticket Booking System

A modern, full-stack event ticket booking system built with Next.js 15, Prisma, Stripe, and TypeScript. Features real-time booking, payment processing, QR code ticketing, and admin dashboard.

## Features

### Core Functionality
- **Event Management**: Create, update, and delete events with capacity tracking
- **Ticket Booking**: User-friendly booking flow with email validation
- **Payment Processing**: Secure Stripe integration for online payments
- **QR Code Tickets**: Automatic QR code generation for ticket verification
- **Email Confirmations**: Automated email notifications with QR codes
- **Check-in System**: QR code scanning for venue entry
- **Admin Dashboard**: Comprehensive management interface with real-time statistics

### Technical Highlights
- **Input Validation**: Zod schema validation for all user inputs
- **Race Condition Prevention**: Transaction-based booking to prevent overbooking
- **Performance Optimized**: Database indexes on frequently queried fields
- **Error Handling**: Comprehensive error handling across all endpoints
- **Secure**: Environment-based configuration, no hardcoded secrets
- **Type-Safe**: Full TypeScript coverage with strict type checking
- **Modular Architecture**: Custom hooks and reusable components

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) (via Supabase)
- **ORM**: [Prisma 6](https://www.prisma.io/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/) (GitHub OAuth)
- **Payments**: [Stripe](https://stripe.com/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/)
- **Email**: [Nodemailer](https://nodemailer.com/)
- **File Storage**: [Cloudinary](https://cloudinary.com/)
- **Validation**: [Zod](https://zod.dev/)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (or Supabase account)
- Stripe account
- GitHub OAuth app
- Cloudinary account
- Gmail account (for email)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd ticket-booking
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Copy `.env.example` to `.env` and fill in your values:
   ```bash
   cp .env.example .env
   ```

   Required environment variables:
   - `DATABASE_URL`: PostgreSQL connection string
   - `DIRECT_URL`: Direct database connection (for migrations)
   - `GITHUB_ID`: GitHub OAuth client ID
   - `GITHUB_SECRET`: GitHub OAuth client secret
   - `NEXTAUTH_SECRET`: Random secret for NextAuth (generate with `openssl rand -base64 32`)
   - `NEXTAUTH_URL`: Your app URL (http://localhost:3000 for dev)
   - `STRIPE_SECRET_KEY`: Stripe secret key
   - `NEXT_PUBLIC_STRIPE_PUBLIC_KEY`: Stripe publishable key
   - `STRIPE_WEBHOOK_SECRET`: Stripe webhook signing secret
   - `EMAIL_USER`: Gmail address
   - `EMAIL_PASS`: Gmail app-specific password
   - `CLOUDINARY_CLOUD_NAME`: Cloudinary cloud name
   - `CLOUDINARY_API_KEY`: Cloudinary API key
   - `CLOUDINARY_API_SECRET`: Cloudinary API secret
   - `ADMIN_EMAILS`: Comma-separated list of admin emails

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
ticket-booking/
├── app/
│   ├── admin/                    # Admin dashboard
│   │   ├── components/           # Admin UI components
│   │   ├── hooks/                # Custom React hooks
│   │   ├── page.tsx              # Admin page (protected)
│   │   └── AdminClient.tsx       # Main admin component
│   ├── api/                      # API routes
│   │   ├── auth/                 # NextAuth configuration
│   │   ├── bookings/             # Booking endpoints
│   │   ├── events/               # Event endpoints
│   │   ├── checkout/             # Stripe checkout
│   │   ├── webhook/              # Stripe webhook handler
│   │   ├── check-in/             # Check-in endpoint
│   │   └── stats/                # Statistics endpoint
│   ├── book/[id]/                # Booking page
│   ├── check-in/[id]/            # Check-in page
│   ├── tickets/[id]/             # Ticket display page
│   ├── components/ui/            # Reusable UI components
│   └── page.tsx                  # Home page (events list)
├── lib/
│   ├── prisma.ts                 # Prisma client singleton
│   ├── validations.ts            # Zod validation schemas
│   ├── email.ts                  # Email sending logic
│   ├── qr.ts                     # QR code generation
│   └── utils.ts                  # Utility functions
├── prisma/
│   └── schema.prisma             # Database schema
└── public/                       # Static assets
```

## Configuration Guides

### GitHub OAuth Setup

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in:
   - Application name: `Ticket Booking System`
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
4. Copy the Client ID and Client Secret to your `.env`

### Stripe Setup

1. Create a [Stripe account](https://stripe.com/)
2. Get your API keys from the [Dashboard](https://dashboard.stripe.com/test/apikeys)
3. Set up a webhook:
   - Go to Developers → Webhooks
   - Add endpoint: `https://your-domain.com/api/webhook`
   - Select events: `checkout.session.completed`
   - Copy the signing secret

### Gmail Setup

1. Enable 2-factor authentication on your Gmail account
2. Generate an app-specific password:
   - Go to [Google Account Settings](https://myaccount.google.com/)
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. Use this password in `EMAIL_PASS`

### Cloudinary Setup

1. Create a [Cloudinary account](https://cloudinary.com/)
2. Get your credentials from the Dashboard
3. Copy Cloud Name, API Key, and API Secret to `.env`

## Database Schema

### Event Model
- `id`: Unique identifier
- `title`: Event name
- `date`: Event date/time
- `capacity`: Maximum attendees (optional)
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

### Ticket Model
- `id`: Unique identifier
- `name`: Attendee name
- `email`: Attendee email (unique per event)
- `eventId`: Reference to Event
- `paid`: Payment status
- `checkedIn`: Check-in status
- `createdAt`: Booking timestamp
- `updatedAt`: Last update timestamp

## API Endpoints

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for complete API reference.

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy

### Environment Variables for Production

Update these in your `.env`:
- `NEXTAUTH_URL`: Your production domain
- `NEXT_PUBLIC_BASE_URL`: Your production domain
- Update Stripe webhook URL to production endpoint
- Update GitHub OAuth callback URL

## Development

### Running Tests

```bash
npm test
```

### Database Migrations

```bash
# Create a new migration
npx prisma migrate dev --name description_of_changes

# Apply migrations
npx prisma migrate deploy

# Reset database (development only)
npx prisma migrate reset
```

### Linting

```bash
npm run lint
```

### Building for Production

```bash
npm run build
npm start
```

## Security Considerations

- Never commit `.env` file
- Use strong `NEXTAUTH_SECRET`
- Keep Stripe webhook secret secure
- Use HTTPS in production
- Regularly update dependencies
- Monitor Stripe webhook logs
- Implement rate limiting in production

## Troubleshooting

### Database Connection Issues
- Verify `DATABASE_URL` is correct
- Check if database is accessible
- Ensure Prisma schema is up to date

### Stripe Webhook Not Working
- Verify webhook secret is correct
- Check webhook endpoint is publicly accessible
- Review Stripe dashboard logs

### Email Not Sending
- Verify Gmail credentials
- Check app-specific password
- Ensure 2FA is enabled

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues and questions:
- Open an issue on GitHub
- Check existing issues for solutions
- Review the API documentation

## Recent Improvements

### v1.1.0 (Latest)
- ✅ Added input validation with Zod
- ✅ Fixed race conditions in booking flow
- ✅ Refactored admin dashboard (73% code reduction)
- ✅ Added database indexes for performance
- ✅ Improved error handling across all endpoints
- ✅ Added proper TypeScript types
- ✅ Implemented Prisma singleton pattern
- ✅ Environment-based configuration
- ✅ Comprehensive documentation

## Roadmap

- [ ] Rate limiting on API endpoints
- [ ] Pagination for admin bookings table
- [ ] Event categories and tags
- [ ] Booking cancellation feature
- [ ] Comprehensive test suite
- [ ] Email templates customization
- [ ] Multi-language support
- [ ] Analytics dashboard
