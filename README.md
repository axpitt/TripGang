# TripGang — Official Website & Admin Portal

Explore. Experience. Evolve. Modern travel and adventure trek booking platform built with React, Vite, Tailwind CSS, and Firebase.

## Features

- **Dynamic Homepage**: Hero with countdown timer, interactive 3D Coverflow carousel for upcoming treks, past trips showcase, team section, and Instagram grid.
- **Trip Detail Pages**: Rich itineraries, inclusions, exclusions, FAQs, and WhatsApp booking integration.
- **Admin Dashboard** (`/gang-admin`): Secure management portal for trips, gallery photos, team members, and incoming leads.
- **Interactive UI**: Custom preloader video, smooth animations with Framer Motion, and mobile-responsive navigation.

## Getting Started

### 1. Clone & Install Dependencies
```bash
git clone <repository-url>
cd tripgang
npm install
```

### 2. Environment Configuration
Copy `.env.example` to `.env` and fill in your Firebase and Cloudinary credentials:
```bash
cp .env.example .env
```

Set the following variables:
```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id

VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_cloudinary_upload_preset
```

### 3. Run Locally
```bash
npm run dev
```

### 4. Build for Production
```bash
npm run build
```

## Security & Secrets
- Never commit `.env` or any production credentials.
- All secrets and configuration keys are loaded dynamically via Vite environment variables (`import.meta.env.*`).
- Security rules are defined in `firestore.rules`.

