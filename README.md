# Glam & Grace — MERN E-commerce Store

Animated online store (MongoDB, Express, React, Node, Tailwind CSS, Framer Motion).

**Customer side:** home page with animated hero, categories (Girls Wear, Boys Wear, Sarees, Cosmetics, Aesthetic Items), shop with search / filter / sort, product page, cart drawer, checkout (COD or online payment), signup / login, My Orders with tracking timeline, WhatsApp + Call buttons everywhere.

**Admin side (`/admin`):** dashboard with stats, add / edit / delete products, change order status, and record returns (what came back, how many, in what condition). Good items go back into stock automatically.

## Folder structure

```
ecommerce/
├── server/
│   ├── config/db.js
│   ├── models/        User, Product, Order, Return
│   ├── controllers/   auth, product, order, return, admin
│   ├── routes/
│   ├── middleware/    auth.js (JWT + admin check), errorHandler.js
│   ├── utils/         seed.js, razorpay.js, generateToken.js
│   └── server.js
└── client/src/
    ├── components/    reusable UI (Button, ProductCard, CartDrawer, Navbar, Modal ...)
    ├── pages/         Home, Shop, ProductDetails, Cart, Checkout, MyOrders, Login ...
    │   └── admin/     Dashboard, Products, Orders, Returns
    ├── sections/      home page sections
    ├── context/       Auth, Cart, Toast
    ├── services/      api.js, payment.js, razorpay.js
    ├── config/        siteConfig.js  <-- put YOUR phone number here
    └── hooks/ utils/
```

## 1. Put your number

Open `client/src/config/siteConfig.js` and set:

- `phoneNumber` — with country code, digits only, e.g. `919876543210` (used for WhatsApp and Call buttons)
- `phoneDisplay` — how it should look, e.g. `+91 98765 43210`
- `social.instagram` / `social.facebook` — your profile links

You can also change the store name (`storeName`) there.

## 2. Run locally

**Backend**
```bash
cd server
npm install
copy .env.example .env      # Windows (use cp on Mac/Linux)
```
Edit `.env`:
- `MONGO_URI` — your Atlas connection string (use a database name like `/ecommerce`)
- `JWT_SECRET` — any long random text
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` — the admin login you want

Then:
```bash
npm run seed     # creates the admin + 18 sample products (deletes existing products!)
npm run dev      # http://localhost:5000
```

**Frontend** (new terminal)
```bash
cd client
npm install
copy .env.example .env
npm run dev      # http://localhost:5173
```

Log in with the admin email and password from `.env`, then open **Admin Panel** from the account menu.

## 3. Online payment

- **Demo mode (default):** with no Razorpay keys, "Pay online" shows a demo confirmation. No real money moves. Good for testing.
- **Real payments:** create a free Razorpay account, then put `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` in `server/.env` (test keys first). Real mode turns on automatically and the demo option is disabled.

## 4. Returns

When a parcel comes back: **Admin → Orders → Record return**. Choose:
- *Customer did not take the parcel* (RTO), or
- *Customer returned it after delivery*

Pick the items, quantity and condition (good / damaged / missing). Everything is stored in the `returns` collection and shown in **Admin → Returns**.

## 5. Deploy

Same as your portfolio: backend on Render (or Railway), frontend on Cloudflare.

**Backend (Render):** root directory `server`, build `npm install`, start `npm start`. Environment variables: `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL` (your Cloudflare site link), `ADMIN_EMAIL`, `ADMIN_PASSWORD`, optional Razorpay keys. Run `npm run seed` once from your own computer (with the same `MONGO_URI`) to create the admin and sample products.

**Frontend (Cloudflare):** root directory `client`, build command `npm run build`, deploy command `npx wrangler deploy` (a `wrangler.jsonc` is included, so no extra flags are needed). Build variable: `VITE_API_URL` = your Render backend link, no trailing slash.

## Notes

- Product images: paste any image URL in the admin form. Without an image, a colourful emoji tile is shown.
- Prices and totals are always calculated on the server, never trusted from the browser.
- Never commit your `.env` files (the `.gitignore` already blocks them).
