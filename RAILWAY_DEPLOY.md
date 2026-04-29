# Railway Deploy Checklist

## 1. Push This Repo

Create a GitHub repo from this folder and push the code.

## 2. Create Railway Project

1. New Project
2. Deploy from GitHub repo
3. Choose this repo

Railway will detect Next.js from `package.json`.

## 3. Add Postgres

1. In the Railway project canvas, click `+ New`
2. Choose `Database`
3. Choose `PostgreSQL`

## 4. Add Variables To The Next.js Service

Open the Next.js service, then `Variables`.

Add a reference variable:

```txt
DATABASE_URL=${{Postgres.DATABASE_URL}}
```

Add your admin PIN:

```txt
ADMIN_PIN=pick-a-real-pin
```

Use that PIN on `/admin`.

## 5. Set Pre-Deploy Command

In the Next.js service:

`Settings` -> `Deploy` -> `Pre-deploy Command`

Set:

```bash
npx prisma migrate deploy
```

## 6. Deploy

Redeploy the Next.js service.

The app seeds quests, badges, starter leaderboard users, and starter feed items automatically on first API request.

## 7. Generate Public URL

In the Next.js service:

`Settings` -> `Networking` -> `Generate Domain`

Important routes:

- `/join` guest signup
- `/home` player dashboard
- `/quests` quest list
- `/submit` proof upload
- `/feed` live feed
- `/gallery` approved photo wall
- `/awards` badges
- `/profile` player profile
- `/tv` projected leaderboard
- `/admin` review queue

## Notes

Photo uploads currently store a browser data URL in the database. That keeps the app self-contained for the first deploy. For a bigger party or lots of photos, move uploads to Cloudinary or a Railway Storage Bucket and store only the final image URL in `Submission.photoUrl` and `User.photoUrl`.
