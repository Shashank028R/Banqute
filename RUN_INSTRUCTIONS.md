# Running UtsavPro Banquet Production System

The application has been completely restructured into a split-stack production system using a **NestJS Backend** and **React Frontend**, both connected to **Firebase**.

## Requirements
- Node.js (v18+)
- Active Internet Connection

## 1. Start the NestJS Backend
The backend powers the database operations securely and talks to Firebase using your Admin credentials.

1. Open a terminal.
2. Navigate to the `server` directory:
   ```bash
   cd server
   ```
3. Run the development server:
   ```bash
   npm run start
   ```
   *You should see the NestJS startup logs, ending with `Nest application successfully started`.*

## 2. Start the React Frontend
The frontend talks to your NestJS Backend via the API layer.

1. Open a **second** terminal.
2. Navigate to the `client` directory:
   ```bash
   cd client
   ```
3. Run the frontend build:
   ```bash
   npm run dev
   ```
   *You can then click the localhost link (e.g., `http://localhost:5173`) to open it in Chrome.*

## Important Notes on Firebase Integration
Everything is correctly hooked into the Firebase keys you provided.
- The `server` handles authentication checks and database queries privately to secure the system.
- The React components have been completely migrated away from fake dummy mock data. If the dashboard looks empty, that is because the actual Firestore database is fresh/empty!
- When you create a "New Reservation" in the UI, that data will immediately push into your real Firebase Firestore and reflect live on your dashboard and calendar.

**Enjoy your highly robust, production-grade Banquet Management system!**
