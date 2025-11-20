# TinyLink – Simple & Smart URL Shortener

TinyLink is a fast, clean, and user-friendly URL shortener built using **Next.js**, **TypeScript**, and **Neon Postgres**.
It helps you convert long URLs into short, shareable links—while tracking clicks, showing analytics, and managing your links effortlessly.

🔗 **Live App:** https://tinylink-url-shorter.vercel.app/

---

##  Features

- Shorten URLs instantly (custom or auto-generated codes)
- Clean, modern UI — responsive on all screen sizes
- Click tracking with last accessed timestamp
- Search and filter through your links
- Real-time URL validation
- HTTP 302 redirect with analytics logging
- Delete links with confirmation
- Smooth, minimal interface optimized for speed

---

##  Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** Neon Postgres
- **Deployment:** Vercel

---

##  Project Structure

tinylink/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── links/
│   │   ├── code/
│   │   │   └── [code]/
│   │   ├── [code]/
│   │   ├── healthz/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   ├── lib/
│   └── types/
├── .env.example
├── schema.sql
└── README.md



---

##  Getting Started

### 1. Prerequisites
- Node.js **18+**
- A Neon Postgres database

---

### 2. Installation

Clone the repo:

```bash
git clone https://github.com/RLokeshvarma/tinyLink
cd tinylink


## Install Dependencies

npm install

## Start the Development Server

npm run dev

---
```md
##API Endpoints

| Method | Endpoint           | Description              |
| ------ | ------------------ | ------------------------ |
| GET    | `/healthz`         | Health check             |
| POST   | `/api/links`       | Create a short link      |
| GET    | `/api/links`       | Get all links            |
| GET    | `/api/links/:code` | Get stats for a link     |
| DELETE | `/api/links/:code` | Delete a link            |
| GET    | `/:code`           | Redirect to original URL |

