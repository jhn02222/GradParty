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

Add Railway Bucket variables to the Next.js service. Create a Bucket on the Railway canvas, then use the bucket credentials/variable references:

```txt
BUCKET=${{YourBucket.BUCKET}}
ENDPOINT=${{YourBucket.ENDPOINT}}
ACCESS_KEY_ID=${{YourBucket.ACCESS_KEY_ID}}
SECRET_ACCESS_KEY=${{YourBucket.SECRET_ACCESS_KEY}}
REGION=${{YourBucket.REGION}}
```

Replace `YourBucket` with the bucket service name shown in Railway.

## 5. Deploy Config

This repo includes `railway.json`, which tells Railway to:

- run `npm run build`
- run `npx prisma migrate deploy` before deploy
- start with `npm run start`
- healthcheck `/health`

If you already set commands manually in the Railway dashboard, the checked-in `railway.json` should override them on the next deploy.

## 6. Deploy

Redeploy the Next.js service.

The app seeds submission targets and badges automatically on first API request. Real users are created from `/join`.

## 7. Generate Public URL

In the Next.js service:

`Settings` -> `Networking` -> `Generate Domain`

Important routes:

- `/join` guest signup
- `/home` player dashboard
- `/submit` drink and proof submission
- `/submit` proof upload
- `/feed` live feed
- `/gallery` approved photo wall
- `/awards` badges
- `/profile` player profile
- `/tv` projected leaderboard
- `/admin` review queue

## Notes

Photo uploads go to a private Railway Bucket. The database stores app URLs like `/api/files?key=...`, and the app reads the object from the bucket when displaying profile, proof, gallery, and TV photos.
