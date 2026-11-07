# TalkToText Frontend

React app for **TalkToText**: upload a video or audio file and get an AI-generated blog post that you can edit and export.

This project is a recreation of the TalkToText app by Saif Shaikh (https://github.com/saiffshaikkh/talktotextai), built with a different stack (React + Vite + Express + MongoDB).

## What I built differently

- Backend is an independent Express + MongoDB REST API (the original uses Next.js server actions with PostgreSQL).
- Custom authentication (bcrypt, JWT in an HttpOnly cookie, rate limiting) instead of Clerk.
- Free AI services (Groq Whisper and a Groq LLM) instead of OpenAI, and uploaded media is deleted right after transcription.
- Server-side checks that the original did not have: plan limits, per-user post ownership, and blocked access for cancelled subscriptions.
- Frontend rewritten from Next.js to React + Vite with React Router, Redux Toolkit and Axios.

## Tech stack

- React 19, Vite
- Tailwind CSS 3
- React Router
- Redux Toolkit (logged-in user state)
- Axios
- MDXEditor (markdown editor)

## Getting started

1. Install packages: `npm install`
2. Start the backend first (see `../backend/README.md`), it runs on port 3000
3. Start the frontend: `npm run dev` (http://localhost:5173)

Vite proxies `/api` requests to the backend, so login cookies work without extra setup.

## Pages

| Route | Access | What it does |
|---|---|---|
| `/` | public | Landing page (banner, how it works, pricing) |
| `/sign-in`, `/sign-up` | logged-out only | Email and password authentication |
| `/dashboard` | login | Plan badge and the upload form |
| `/posts` | login | Your saved blog posts |
| `/posts/:id` | login | Markdown editor, update and export |

## Status

- **Working:** landing page, sign in and sign up, dashboard, posts list, post editor (update and export), mobile layout for the header and editor.
- **Not available yet:** payments (the pricing buttons show a message), GitHub and Google sign-in, password reset.
- **Still to test:** uploading a real audio or video file end to end.