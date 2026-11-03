# TalkToText Backend

REST API for **TalkToText**: turn audio/video into a transcript and then into a structured blog post using AI.

Built with Node.js, Express 5, MongoDB (Mongoose 9) and JWT authentication.

## Tech stack

| Area | Choice |
|---|---|
| Runtime | Node.js 20.19+ (ES Modules) |
| Framework | Express 5 |
| Database | MongoDB Atlas free cluster via Mongoose |
| Auth | JWT in an HttpOnly cookie, passwords hashed with bcrypt |
| Validation | Zod |
| Uploads | Multer (temporary files, deleted after use) |
| Transcription | Groq `whisper-large-v3-turbo` |
| Blog generation | Groq `openai/gpt-oss-120b` |

## Project structure

```
backend/
  src/
    config/        database connection
    controllers/   request/response handling
    middleware/    auth, plan guard, upload, rate limit, error handling
    models/        User, Post, Payment
    routes/        API routes
    services/      Groq transcription and blog generation
    validators/    Zod input schemas
    utils/         token and cookie helpers
    app.js         Express app setup
    server.js      server start
  tests/           (empty for now)
```

## Getting started

1. Install packages:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env` and fill in your own values (see below).
3. Start the dev server:
   ```bash
   npm run dev
   ```
   The API runs on `http://localhost:3000`. Check it at `GET /api/health`.

For production use `npm start`.

## Environment variables

| Variable | Purpose |
|---|---|
| `MONGODB_URI` | MongoDB Atlas connection string, with the database name `/talktotext` |
| `JWT_SECRET` | Long random string used to sign login tokens |
| `GROQ_API_KEY` | API key from console.groq.com |
| `PLAN_BASIC_ID` | Identifier stored in a user's `priceId` for the Basic plan |
| `PLAN_PRO_ID` | Identifier stored in a user's `priceId` for the Pro plan |
| `CLIENT_URL` | Frontend address allowed by CORS (default `http://localhost:5173`) |
| `NODE_ENV` | Set to `production` to enable secure cookies |
| `PORT` | Optional. Defaults to 3000 |

Never commit your real `.env`. It is listed in `.gitignore`.

## API

All responses are JSON: `{ "success": true, ... }` or `{ "success": false, "message": "..." }`.

| Method | URL | Auth | Purpose |
|---|---|---|---|
| GET | `/api/health` | no | Check the server is running |
| POST | `/api/auth/register` | no | Create account (`name`, `email`, `password`) |
| POST | `/api/auth/login` | no | Log in, sets HttpOnly cookie |
| POST | `/api/auth/logout` | no | Clears the cookie |
| GET | `/api/auth/me` | login | Current user, plan status, posts count |
| POST | `/api/transcriptions` | login + plan | Upload audio/video (field `file`), returns transcript |
| POST | `/api/posts/generate` | login + plan | Body `{ transcript }`, generates and saves a blog post |
| GET | `/api/posts` | login | List my posts |
| GET | `/api/posts/:id` | login + owner | One post |
| PUT | `/api/posts/:id` | login + owner | Update `title` and `content` |

Common errors: `400` invalid input, `401` not logged in, `403` no active plan or plan limit reached, `404` not found, `409` email already registered, `413` file too large, `429` rate limit, `502` AI service failed.

## Plans

- **No plan**: cannot upload or generate.
- **Basic**: up to 3 posts.
- **Pro**: unlimited posts.
- Cancelled or inactive subscriptions are blocked on the server.

## Security

- Passwords hashed with bcrypt, never returned by the API.
- Login token in an HttpOnly cookie (`secure` in production, `sameSite=lax`).
- Every post query includes the logged-in user's ID, so users cannot read or edit someone else's posts.
- Plan and user identity always come from the server, never from the request body.
- Rate limiting on register and login.
- CORS limited to `CLIENT_URL`, JSON body limit 1 MB.
- Uploads: audio/video only, max 20 MB, one file, temporary file deleted right after transcription.
- One transcription at a time per user.
- Internal error details are not sent to the client.

## Free-tier limits (Groq)

Shown on the Groq console for this account. These can change, check `console.groq.com/settings/limits`.

- Speech to text: 20 requests/min, 7,200 audio seconds/hour, 28,800 audio seconds/day, shared by all users.
- `openai/gpt-oss-120b`: 30 requests/min, 1,000 requests/day, 8K tokens/min, 200K tokens/day.
- Because of the token limit, only the first 10,000 characters of a transcript are used. The API returns `truncated: true` when this happens.

## Status

**Tested:** register, login, wrong password, current user, protected routes, plan guard, blog generation from text, and ownership checks between two users.

**Written but not tested yet:** transcription with a real audio file (it will be tested through the frontend upload form).

**Not implemented:** payments. Stripe is invite-only in India and Razorpay needs a PAN even for test mode, so no payment provider is connected. In development a user's plan is set manually in the database.

**Not done yet:** automated tests, deployment configuration.