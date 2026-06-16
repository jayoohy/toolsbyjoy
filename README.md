# toolsbyjoy

A growing collection of free AI-powered tools. Built with Next.js 16, React 19, and Tailwind CSS 4.

## Tools

### Roast My Site
Paste any URL and get an honest AI critique covering copy clarity, UX, CTAs, and SEO basics — scored out of 10 per category with specific fixes. Powered by Gemini via an n8n webhook.

## Stack

- **Next.js 16** / **React 19**
- **Tailwind CSS 4**
- **Framer Motion 12** — animated results and score bars
- **next-themes** — dark mode
- **Gemini via n8n** — AI analysis backend

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

| Variable | Description |
|---|---|
| `N8N_WEBHOOK_URL` | n8n webhook that receives the URL and returns the Gemini analysis |

Create a `.env.local` file and set this before running locally or deploying.

## Project structure

```
app/
  page.tsx              # Tools homepage
  layout.tsx            # Root layout with theme provider
  roastmysite/
    page.tsx            # Roast My Site UI
  api/
    roast/
      route.ts          # POST /api/roast — proxies to n8n webhook
  components/
    ThemeToggle.tsx     # Light/dark toggle
```

## Deployment

Deploy to Vercel. Set `N8N_WEBHOOK_URL` in the project's environment variables. The build command is `npm run build`.
