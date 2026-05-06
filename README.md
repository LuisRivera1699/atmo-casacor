# ATMO Casacor

Mobile-first Next.js experience for the NIMBO Universe at CASACOR.

## Stack

- Next.js
- React
- Tailwind CSS
- Firebase Firestore

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Fill `.env.local` with the Firebase values from `.env.example`.

## Commands

```bash
npm run dev
npm run build
npm run start
```

## Firestore

The contact form writes leads to the `casacor-leads` collection.

Suggested rule:

```js
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /casacor-leads/{leadId} {
      allow create: if true;
      allow read, update, delete: if false;
    }
  }
}
```
