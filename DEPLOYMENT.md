# 🚀 Deployment Guide - Fit Llama AI

## Prerequisites
- Clerk Account (clerk.com)
- Supabase Account (supabase.com)
- Vercel Account (vercel.com) OR any hosting platform
- Gemini API Key (Google AI Studio)

---

## Step 1: Set up Clerk Authentication

1. Go to [clerk.com](https://clerk.com) and create a new application
2. Enable **Email/Password** authentication
3. Enable **Google OAuth** (Social Connections → Google)
4. Copy your **Publishable Key** from the dashboard
5. Configure redirect URLs:
   - Sign-in redirect: `/dashboard`
   - Sign-up redirect: `/onboarding`
   - After sign-out: `/`

---

## Step 2: Set up Supabase Database

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Go to **SQL Editor** and run the schema from `supabase-schema.sql`
3. Go to **Settings** → **API** and copy:
   - Project URL (`VITE_SUPABASE_URL`)
   - Anon/Public key (`VITE_SUPABASE_ANON_KEY`)

---

## Step 3: Configure Environment Variables

Create `.env.local` file in root with:

```env
# Gemini AI
GEMINI_API_KEY=your_gemini_api_key_here

# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...

# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Step 4: Test Locally

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` and test:
- ✅ Sign up with email
- ✅ Sign in with Google
- ✅ Complete onboarding
- ✅ Add meals
- ✅ Chat with AI coach

---

## Step 5: Deploy to Vercel

### Option A: Using Vercel CLI
```bash
npm i -g vercel
vercel
```

### Option B: Using Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Add environment variables:
   - `GEMINI_API_KEY`
   - `VITE_CLERK_PUBLISHABLE_KEY`
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy!

---

## Step 6: Update Clerk URLs

After deployment, update Clerk with your production URL:
1. Go to Clerk Dashboard → **Paths**
2. Update redirect URLs to use your production domain

---

## 🎉 Done!

Your app is now live with:
- ✅ Clerk authentication (Email + Google OAuth)
- ✅ Supabase database (real-time sync)
- ✅ Gemini AI integration
- ✅ Production-ready deployment

---

## Troubleshooting

### Issue: "Missing Clerk Publishable Key"
**Solution**: Add `VITE_CLERK_PUBLISHABLE_KEY` to your environment variables

### Issue: Database connection errors
**Solution**: Verify Supabase URL and anon key are correct

### Issue: Google OAuth not working
**Solution**: Enable Google in Clerk dashboard and configure OAuth consent screen

---

## Tech Stack
- **Frontend**: React 19 + TypeScript + Vite
- **Auth**: Clerk (Email + Google OAuth)
- **Database**: Supabase (PostgreSQL)
- **AI**: Google Gemini API
- **Hosting**: Vercel
- **Styling**: Tailwind CSS v4
