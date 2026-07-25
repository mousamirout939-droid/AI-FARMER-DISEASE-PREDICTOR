# MongoDB Atlas Setup

1. Create a free account at https://www.mongodb.com/cloud/atlas
2. Create a new **Project** → **Build a Database** → choose the free M0 tier.
3. Under **Database Access**, create a user with a strong password (read/write on any database).
4. Under **Network Access**, add your deployment platform's IP range, or `0.0.0.0/0` for development (not recommended for production).
5. Click **Connect** → **Drivers** → copy the connection string, e.g.:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/ai_farmer?retryWrites=true&w=majority
   ```
6. Paste it into `backend/.env` as `MONGO_URI`.
7. Run the seed script to create demo data:
   ```bash
   cd backend
   npm run seed
   ```

## Recommended indexes

The Mongoose schemas already declare the indexes the app needs (`Disease.classLabel` unique,
text index on `Disease.name`/`crop`, `Prediction.user`, `Notification.user`, `Weather.location`).
They are created automatically on first connection in non-production environments
(`autoIndex: true` in `backend/src/config/db.js`). For production, run `db.collection.createIndexes()`
once via `mongosh` or a migration script instead of relying on autoIndex.
