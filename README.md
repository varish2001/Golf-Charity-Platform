# Golf Charity Platform

Golf Charity Subscription Platform MVP built with:

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express
- Database: MongoDB with a local file-storage fallback for demo mode

## Features

- User registration and login
- Password hashing with `bcryptjs`
- JWT-based authentication
- Protected dashboard API
- Golf score management with max 5 scores per user
- Charity selection with contribution percentage
- Simple draw system with winnings
- Combined dashboard response for frontend use

## Project Structure

```text
backend/
  config/
  controllers/
  data/
  middleware/
  models/
  routes/
  utils/
  server.js
frontend/
  js/
  dashboard.html
  login.html
  register.html
  styles.css
render.yaml
```

## Local Run

1. Install dependencies:

```bash
cd backend
npm install
```

2. Copy the environment file:

```bash
cp .env.example .env
```

3. Start the backend:

```bash
npm start
```

4. Open the app:

```text
http://localhost:8080/
```

## Environment Variables

Use `backend/.env`:

```env
PORT=8080
MONGODB_URI=mongodb://127.0.0.1:27017/golf-charity-platform
JWT_SECRET=your_jwt_secret_key
FRONTEND_URL=http://localhost:3000
USE_LOCAL_STORAGE=true
```

### Notes

- If `MONGODB_URI` is missing or invalid, the app can still run using `backend/data/local-db.json`.
- Set `USE_LOCAL_STORAGE=false` in production if MongoDB must be required.

## API Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /dashboard`
- `GET /charities`
- `POST /charities/select-charity`
- `GET /scores`
- `POST /scores`
- `GET /draw`
- `GET /api/health`

## Deployment

### Backend on Render

- Use the `backend` folder as the root directory
- Build command: `npm install`
- Start command: `npm start`
- Add environment variables:

```env
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_strong_secret_key
FRONTEND_URL=https://your-frontend-name.vercel.app
USE_LOCAL_STORAGE=false
NODE_ENV=production
```

### Frontend on Vercel

- Use the `frontend` folder as the project root
- Framework preset: `Other`
- No build command required
- Update `frontend/js/config.js` with your Render backend URL:

```js
API_BASE_URL: "https://your-render-backend.onrender.com"
```

## MongoDB Atlas

Use a valid Atlas connection string:

```env
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/golf-charity-platform?retryWrites=true&w=majority
```

Make sure Atlas network access allows connections from your deployment.

## Handoff Notes

- The app supports a working local demo mode without MongoDB.
- Production deployment should use MongoDB Atlas and set `USE_LOCAL_STORAGE=false`.
- Static frontend and API are separated cleanly for Vercel + Render deployment.
