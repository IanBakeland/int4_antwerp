# INT4 Antwerp

A location-based storytelling web app for the city of Antwerp. Users can explore nearby stories in a radar view, share their own 360° panorama stories, and interact with content through reactions and favourites.

**Stack:** React + Vite (frontend) — Strapi 5 (backend/CMS) — SQLite (default database)

---

## System requirements

| Requirement | Version |
|---|---|
| Node.js | 20 – 24 |
| npm | 6 or higher |
| OS | macOS or Windows |
| Internet connection | Required (Strapi Cloud is used as the live backend) |
| Browser | Chrome or Safari recommended (geolocation + HTTPS required) |

---

## Project structure

```
int4_antwerp/
├── frontend/   # React + Vite app
└── backend/    # Strapi 5 CMS
```

---

## Online services

The frontend points to a hosted **Strapi Cloud** instance:

```
https://necessary-light-a082e19892.strapiapp.com
```

This is the live backend for all API calls (stories, users, favourites, reactions, uploads). The local `backend/` folder is used for local development or when you need to make content-type or plugin changes.



### Frontend

The frontend has **no `.env` file** — the Strapi Cloud URL is currently hardcoded in each page/component. If you want to make the URL configurable, replace the hardcoded URL with `import.meta.env.VITE_API_URL` and create a `frontend/.env` file:

```
VITE_API_URL=https://necessary-light-a082e19892.strapiapp.com
```

---

## Setup & running

### First install

Run this once after cloning the repo:

```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

### Running the frontend (daily development)

```bash
cd frontend
npm run dev
```

The app starts on `https://localhost:5173` (HTTPS is required for the geolocation API). Your browser will show a certificate warning — click "Advanced" and proceed. This is expected in local development.

### Running the backend locally

Only needed if you're changing content types, plugins, or want to work offline:

```bash
cd backend
npm run dev
```

The Strapi admin panel opens at `http://localhost:1337/admin`. On first run you'll be prompted to create an admin account.

> **Note:** When running the backend locally, the frontend still points to the Strapi Cloud URL. To use your local backend you'd need to temporarily update the API URLs in the frontend source files (or set up `VITE_API_URL` as described above).

### Build for production

```bash
# Frontend
cd frontend
npm run build

# Backend
cd backend
npm run build
npm run start
```

---

## Strapi content types

The backend manages the following content types (visible in the admin panel under "Content Manager"):

- **Stories** — user-submitted 360° panorama stories with location, title, description, and state (`pending` / `approved` / `rejected`)
- **Favourites** — links between users and stories
- **Reactions** — emoji reactions on stories

New stories submitted via the app start with state `pending` and must be approved in the Strapi admin panel before they appear in the app.


