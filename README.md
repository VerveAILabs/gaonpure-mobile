# 🌾 Gaon Pure — Mobile App

> **100% Pure, Stone-Ground & Farm-Fresh Deliveries direct from Village Mills to your Doorstep.**

Gaon Pure is a modern cross-platform e-commerce mobile application built with **React Native**, **Expo SDK 52**, **Expo Router**, **NativeWind (Tailwind CSS)**, **Zustand**, and **Firebase v11**.

---

## 🎨 Brand Design System & Color Palette

| Token | Name | Hex Code | Purpose |
| :--- | :--- | :--- | :--- |
| `primary` / `forest` | Deep Forest Green | `#1B4332` | Brand identity, primary action buttons, active navigation tint |
| `secondary` / `amber` | Warm Golden Amber | `#D4A373` | Highlights, cart badges, membership tags, sale ribbons |
| `background` / `cream` | Soft Organic Cream | `#FBF8F3` | Primary screen canvas and layout background |
| `card` | Pure White | `#FFFFFF` | Product cards, list containers, bottom tab bar |
| `text.primary` / `charcoal` | Charcoal Black | `#1F2421` | Headings, titles, and high-emphasis typography |
| `text.muted` / `muted` | Muted Gray | `#6B7280` | Subtitles, metadata, inactive icons, and descriptions |

---

## ✨ Features & Architecture

### 1. 🛍️ Farm Harvest Catalog & Product Discovery
- **Hero Banner**: Highlights traditional stone chakki milling, cold-pressed processing, and unpolished ancient grains.
- **Category Filter Pills**: Quick-filter by *Multigrain Flours*, *Millets*, *Cold Pressed Oils*, *Spices*, and *Dairy & Ghee*.
- **2-Column Responsive Product Grid**: Pull-to-refresh, skeleton loading states, organic purity badges, and starting price indicators.
- **Real-Time Search**: Filter farm products dynamically by keyword and category.

### 2. 📦 Product Details & Multi-Pack Variant Selector
- **High-Resolution Gallery**: Image viewer with interactive thumbnail selector strip.
- **Weight / Pack Size Radio Pills**: Interactive selection (`500g`, `1kg`, `5kg`, `500ml`, `1L`) with instant price recalculation and tax breakdowns.
- **Inventory Check**: Live stock badge with automatic "Out of Stock" state handling (`stock <= 0`).
- **Cart Confirmation Toast**: Animated slide-in banner upon adding items to cart.

### 3. 🛒 Persistent Cart & Shiprocket Shipping Estimator
- **AsyncStorage Persistence**: Customer basket persists across app restarts using Zustand's `persist` middleware.
- **Smart Weight Parser**: Converts pack weights into numeric grams for parcel calculation.
- **Shiprocket Pincode Rate Checker**: Live serviceability check, courier partner allocation (Delhivery, Bluedart, Shadowfax), and estimated delivery days.
- **Free Delivery Progress Indicator**: Visual progress tracker unlocking FREE shipping on orders $\ge$ ₹999.

### 4. 💳 Razorpay Online Payment & Signature Verification
- **Delivery Address Form**: Recipient details, mobile number, street address, city, state, and pincode.
- **Order Creation**: Calls `POST /api/checkout` with customer Bearer token.
- **Native Checkout Sheet**: Branded Razorpay modal supporting UPI (Google Pay, PhonePe, Paytm), Cards, NetBanking, and Wallets.
- **Signature Verification**: Validates digital cryptographic signatures against `POST /api/orders/verify`.
- **Order Success Screen**: Celebration animation, order reference number (`#GP-XXXXX`), and one-tap order tracking.

### 5. 🚚 Order History & 5-Step Live Tracking Stepper
- **Segmented Filter Tabs**: Filter orders by *All*, *Active*, and *Delivered*.
- **Contextual Status Pills**:
  - 🟡 **Pending / Processing**: `#FEF3C7` (Text `#92400E`)
  - 🔵 **Dispatched / In Transit**: `#DBEAFE` (Text `#1E40AF`)
  - 🟢 **Delivered**: `#D1FAE5` (Text `#065F46`)
  - 🔴 **Cancelled**: `#FEE2E2` (Text `#991B1B`)
- **Vertical Shipment Journey Stepper**:
  1. *Order Placed*
  2. *Order Confirmed & Packed*
  3. *Dispatched via Courier* (with courier name and AWB copy action)
  4. *Out for Delivery*
  5. *Delivered*
- **WhatsApp Customer Support**: Instant 1-tap support integration.

### 6. 🔐 Authentication & PostgreSQL User Sync
- **Firebase v11 Auth**: Phone OTP verification and Google OAuth.
- **Persistence**: `@react-native-async-storage/async-storage` auth persistence.
- **Backend User Sync**: Auto-syncs customer records to PostgreSQL via `POST /api/users/sync`.

---

## 📁 Project Structure

```
gaonpure-mobile/
├── app/
│   ├── _layout.tsx              # Root stack navigator (SafeAreaProvider, StatusBar)
│   ├── modal.tsx                # Modal presentation screen
│   ├── login.tsx                # Auth modal (Phone OTP & Google Sign-In)
│   ├── checkout.tsx             # Delivery address form & Razorpay payment
│   ├── +not-found.tsx           # 404 route handler
│   ├── (tabs)/
│   │   ├── _layout.tsx          # Bottom tab bar with dynamic cart badge
│   │   ├── index.tsx            # Store / Farm Catalog screen
│   │   ├── cart.tsx             # Cart with Shiprocket estimator
│   │   ├── orders.tsx           # Order history & status pills
│   │   └── profile.tsx          # Account settings & Farm Coins
│   ├── orders/
│   │   ├── [id].tsx             # Live 5-step vertical tracking stepper
│   │   └── success.tsx          # Order confirmation celebration screen
│   └── product/
│       └── [id].tsx             # Product detail view with variant selector
├── constants/
│   ├── colors.ts                # Strictly typed brand colors
│   └── theme.ts                 # Design tokens (radii, spacing, typography)
├── src/
│   ├── api/
│   │   ├── client.ts            # Authenticated Axios instance with Bearer interceptor
│   │   ├── catalog.ts           # GET /api/catalog & GET /api/catalog/:id
│   │   ├── checkout.ts          # POST /api/checkout & POST /api/orders/verify
│   │   ├── orders.ts            # GET /api/orders & GET /api/orders/:id
│   │   ├── shipping.ts          # POST /api/shipping/estimate (Shiprocket)
│   │   └── user.ts              # POST /api/users/sync (PostgreSQL user sync)
│   ├── config/
│   │   └── firebase.ts          # Firebase v11 modular client configuration
│   ├── services/
│   │   └── razorpay.ts          # Razorpay native checkout launcher
│   ├── store/
│   │   └── cartStore.ts         # Persistent Zustand cart store & weight calculator
│   └── types/
│       └── catalog.ts           # Product and Variant interfaces
├── types/                       # Global TypeScript declarations
├── global.css                   # Tailwind directives
├── tailwind.config.js           # NativeWind theme configuration
├── metro.config.js              # NativeWind Metro transformer
└── tsconfig.json                # TypeScript strict configuration
```

---

## 🛠️ Tech Stack

- **Framework**: [React Native](https://reactnative.dev/) with [Expo SDK 52](https://expo.dev/)
- **Routing**: [Expo Router v4](https://docs.expo.dev/router/introduction/) (File-based navigation)
- **Styling**: [NativeWind v4](https://www.nativewind.dev/) (Tailwind CSS for React Native)
- **State Management**: [Zustand v5](https://github.com/pmndrs/zustand) with `persist` middleware
- **Authentication**: [Firebase v11](https://firebase.google.com/) Modular SDK + `@react-native-async-storage/async-storage`
- **Payments**: [Razorpay](https://razorpay.com/) (`react-native-razorpay`)
- **Icons**: [Lucide React Native](https://lucide.dev/) (`lucide-react-native`)
- **HTTP Client**: [Axios](https://axios-http.com/) with request/response interceptors
- **Type Safety**: TypeScript Strict Mode (Zero `any` types)

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or newer)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo Go](https://expo.dev/go) app installed on your physical mobile device (iOS or Android)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/VerveAILabs/gaonpure-mobile.git
   cd gaonpure-mobile
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables** (Optional for custom backend / Firebase):
   Create a `.env` file in the project root:
   ```env
   EXPO_PUBLIC_API_URL=https://stage.gaonpure.com
   EXPO_PUBLIC_RAZORPAY_KEY_ID=rzp_test_YourKeyHere
   EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSy...
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=gaonpurecom-staging.firebaseapp.com
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=gaonpurecom-staging
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=gaonpurecom-staging.appspot.com
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1029384756
   EXPO_PUBLIC_FIREBASE_APP_ID=1:1029384756:web:...
   ```

---

## 📱 Running the Application

### Option 1: On Physical Device with Expo Go (Fastest)
```bash
npm start
```
Scan the QR code displayed in your terminal using the **Expo Go** app (Android) or the **Camera** app (iOS).

### Option 2: In Web Browser
```bash
npm run web
```
Opens the interactive web application preview at `http://localhost:8081`.

### Option 3: On Android Emulator
```bash
npm run android
```

### Option 4: On iOS Simulator (macOS only)
```bash
npm run ios
```

---

## 🧪 Type Checking & Verification

Run the TypeScript strict compiler check:
```bash
npm run type-check
```

---

## 📄 License

Distributed under the Apache 2.0 License. See `LICENSE` for more information.
