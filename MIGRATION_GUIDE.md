# Migration Guide

Quick guide to apply the latest improvements to your ticket booking system.

## ⚠️ Important: Run Database Migration

The Prisma schema has been updated with indexes and timestamps. You **must** run a migration before deploying:

```bash
npx prisma migrate dev --name add_indexes_and_timestamps
```

This will:
- Add database indexes for performance
- Add `updatedAt` field to both Event and Ticket models
- Add `createdAt` field to Event model

## 🔧 Environment Variable Updates

Add this new required variable to your `.env` file:

```bash
# Comma-separated list of admin email addresses
ADMIN_EMAILS=your-github-email@example.com,another-admin@example.com
```

**Why**: Admin emails are no longer hardcoded in the source code.

## 📝 Steps to Update

### 1. Backup Your Database (Recommended)
```bash
# If using PostgreSQL directly
pg_dump your_database > backup.sql

# If using Supabase, use their backup feature in dashboard
```

### 2. Pull Latest Changes
```bash
git pull origin main
```

### 3. Install Dependencies
```bash
npm install
```

New dependency added: `zod` (validation library)

### 4. Update Environment Variables
```bash
# Edit your .env file
nano .env

# Add the ADMIN_EMAILS variable
ADMIN_EMAILS=your-email@example.com
```

### 5. Run Database Migration
```bash
# Generate Prisma client with new schema
npx prisma generate

# Run the migration
npx prisma migrate dev --name add_indexes_and_timestamps

# You should see output like:
# ✔ Generated Prisma Client
# ✔ The migration has been generated
```

### 6. Restart Your Application
```bash
# If running locally
npm run dev

# If deployed on Vercel, trigger a new deployment
git push origin main
```

## 🧪 Testing After Migration

### 1. Verify Admin Access
- Go to `/admin`
- Ensure you can log in with your GitHub account
- Check that your email (from `ADMIN_EMAILS`) has access

### 2. Test Booking Flow
- Create a new event
- Try to book a ticket
- Verify validation errors work (try invalid email, etc.)
- Test double-booking prevention (book same event twice with same email)

### 3. Test Capacity Limit
- Create an event with capacity=1
- Book the first ticket (should succeed)
- Try to book a second ticket (should fail with "Event is fully booked")

### 4. Test Stripe Payment (if configured)
- Create a booking with payment
- Complete Stripe checkout
- Verify webhook marks ticket as paid
- Check email confirmation is sent

## 🔍 Troubleshooting

### Migration Fails with "Tenant or user not found"
**Cause**: Database connection issue

**Solution**:
```bash
# Verify your DATABASE_URL in .env
echo $DATABASE_URL

# Test connection
npx prisma db push
```

### "Prisma Client did not initialize yet"
**Cause**: Need to regenerate Prisma client

**Solution**:
```bash
npx prisma generate
```

### Admin Page Redirects to Login
**Cause**: Email not in `ADMIN_EMAILS`

**Solution**:
```bash
# Check your GitHub email
# Add it to ADMIN_EMAILS in .env
ADMIN_EMAILS=your-github-email@example.com

# Restart the application
```

### TypeScript Errors After Update
**Cause**: `ignoreBuildErrors` was disabled

**Solution**:
- These are real errors that should be fixed
- Check the error messages
- Most common: import path issues with new files

## 📊 What Changed?

### Database Schema
- ✅ Added 6 new indexes (significant performance improvement)
- ✅ Added `updatedAt` to Event and Ticket
- ✅ Added `createdAt` to Event

### API Endpoints
- ✅ All endpoints now validate input with Zod
- ✅ Booking endpoints use transactions (prevent race conditions)
- ✅ Better error messages

### Admin Dashboard
- ✅ Completely refactored (338 lines → 92 lines)
- ✅ New reusable components
- ✅ Custom hooks for data fetching
- ✅ Better loading states

### Configuration
- ✅ Admin emails moved to environment variable
- ✅ TypeScript strict mode enabled
- ✅ ESLint enabled during builds

## 🚀 Post-Migration Recommendations

### 1. Monitor Performance
The new indexes should significantly improve query performance. Monitor your database:
- Query execution times
- Connection pool usage
- Database CPU/memory

### 2. Test Edge Cases
- High-traffic booking scenarios
- Concurrent bookings for same event
- Invalid input handling
- Webhook retry scenarios

### 3. Update Production
Once you've tested locally:

```bash
# Push to production
git push origin main

# In Vercel dashboard:
# 1. Add ADMIN_EMAILS environment variable
# 2. Trigger redeploy
```

### 4. Run Migration on Production Database

**⚠️ IMPORTANT**: If your production database is separate:

```bash
# Use production DATABASE_URL
DATABASE_URL="your-production-url" npx prisma migrate deploy
```

## 📋 Checklist

Before considering migration complete:

- [ ] Database backup created
- [ ] Dependencies installed (`npm install`)
- [ ] `ADMIN_EMAILS` added to `.env`
- [ ] Migration run (`npx prisma migrate dev`)
- [ ] Application restarted
- [ ] Admin login tested
- [ ] Booking flow tested
- [ ] Validation errors tested
- [ ] Capacity limit tested
- [ ] Production environment updated (if applicable)

## 🆘 Rollback Instructions

If something goes wrong and you need to rollback:

### 1. Restore Database Backup
```bash
# PostgreSQL
psql your_database < backup.sql
```

### 2. Revert Code Changes
```bash
git log --oneline  # Find the commit before migration
git reset --hard <commit-hash>
```

### 3. Reinstall Dependencies
```bash
npm install
npx prisma generate
```

## 📞 Need Help?

If you encounter issues:
1. Check [IMPROVEMENTS_SUMMARY.md](./IMPROVEMENTS_SUMMARY.md) for details on changes
2. Review [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for endpoint changes
3. Check the GitHub repository issues
4. Create a new issue with:
   - Error message
   - Steps to reproduce
   - Environment details (Node version, database, etc.)

---

**Last Updated**: 2025-01-05
**Migration Version**: 1.0 → 1.1.0
