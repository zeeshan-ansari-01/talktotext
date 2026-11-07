# TalkToText

**Turn videos into text, instantly.** Upload a video or audio file, get a transcript, and let AI turn it into a structured blog post that you can edit and export.

This project is a recreation of the TalkToText app by Saif Shaikh (https://github.com/saiffshaikkh/talktotextai), built with a different stack: React + Vite on the frontend and Express + MongoDB on the backend.

## What I built differently

- Independent Express + MongoDB REST API (the original uses Next.js server actions with PostgreSQL).
- Custom authentication (bcrypt, JWT in an HttpOnly cookie, rate limiting) instead of Clerk.
- Free AI services (Groq Whisper and a Groq LLM) instead of OpenAI. Uploaded media is deleted right after transcription.
- Server-side checks that the original did not have: plan limits, per-user post ownership, and blocked access for cancelled subscriptions.
- Frontend rewritten from Next.js to React + Vite with React Router, Redux Toolkit and Axios.

## How it works

1. A logged-in user with an active plan uploads an audio or video file (max 20 MB).
2. The backend sends it to Groq Whisper and gets back the transcript. The file is deleted immediately.
3. The transcript goes to a Groq language model, which writes a blog post in Markdown (it also looks at the user's last posts to match their style).
4. The post is saved in MongoDB. The user edits it in a markdown editor and can export it as a `.md` file.

## Tech stack

| Part | Technology |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS 3, React Router, Redux Toolkit, Axios, MDXEditor |
| Backend | Node.js, Express 5, Mongoose |
| Database | MongoDB Atlas (free cluster) |
| Auth | bcrypt, JWT in an HttpOnly cookie |
| AI | Groq `whisper-large-v3-turbo` (speech to text) and `openai/gpt-oss-120b` (blog writing) |

## Project structure

```
talktotext/
  backend/    Express API (see backend/README.md)
  frontend/   React app (see frontend/README.md)
```

## Getting started

You need Node.js 20.19 or newer, a free MongoDB Atlas cluster, and a free Groq API key.

1. **Backend**
   ```bash
   cd backend
   npm install
   ```
   Copy `.env.example` to `.env` and fill in your own values, then run `npm run dev`. It starts on http://localhost:3000.
2. **Frontend** (in a second terminal)
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Open http://localhost:5173. Vite forwards `/api` requests to the backend.

Never commit your real `.env` file.

## Plans

- **No plan:** can sign in, but cannot upload or generate posts.
- **Basic:** up to 3 posts.
- **Pro:** unlimited posts.

Payments are not connected yet, so plans are assigned manually in the development database.

## Status

- **Working and tested:** sign up and sign in, protected routes, plan limits, blog generation from text, post ownership checks, post editor (update and export), mobile layout for the header and editor.
- **Written, not yet tested end to end:** uploading a real audio or video file and transcribing it.
- **Not available yet:** payments, GitHub and Google sign-in, password reset.
- **Planned:** automated tests and free deployment (Vercel for the frontend, Render for the backend).

## Free-tier limits

This project is built to run at no cost. The Groq free tier has rate limits shared by all users (about 8 hours of audio per day and 200K tokens per day for the language model), and only the first 10,000 characters of a transcript are used for the blog post. Check the Groq console for the current limits.