# webapp-wishers

The Wishers web app: the same features as app-wishers, designed for the web (sidebar on desktop, icon rail on tablets, bottom tabs on phones). Talks only to api-wishers.

Stack: React 19 + Vite, TypeScript, Tailwind 4, shadcn/ui, TanStack Query, React Router (react-router-dom, laid out like web-app-quicka: all routes in `src/App.tsx`, auth pages in `src/auth`, dashboard pages in `src/pages`, guards in `src/utils`), React Icons (Phosphor set, as in the mobile app).

```
cp .env.example .env   # VITE_API_URL
npm install
npm run dev            # http://localhost:5173
```

Notes
- Records use `_id` exactly as the API returns them.
- Tokens (access + refresh) are kept in localStorage; `src/lib/api.ts` refreshes on 401.
- Live updates: `src/lib/realtime.ts` (Socket.IO `/realtime`) with `useLiveQuery`, which refetches when the server pings.
- Brand colours and Urbanist font come from app-wishers `constants/theme.ts`.
- Not on web: boost (so no featured wishlists), withdrawals, biometrics, push notifications. In-app notifications are (bell dropdown on desktop, /notifications on phones).
- Pages: home dashboard, wishlists (+ detail and wish pages), wallet (+ bank details), profile (+ referrals, help), notifications. Dashboard pages are lazy-loaded.
- "New wishlist" anywhere goes to `/wishlists?new=1`, which checks bank details and the wishlist limit first (`useCreateWishlist`).
