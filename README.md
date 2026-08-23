# 🎬 Movie App

A responsive movie browsing web application built with **Angular**, **Angular Material**, and **Tailwind CSS**, with **Firebase** powering authentication and data storage. Users can browse a curated list of movies, search by title, and save their favorite titles to a personal watchlist.

**🔗 Live Demo:** [angular-movie-app-development-ten.vercel.app](https://angular-movie-app-development-ten.vercel.app/)

---

## ✨ Features

- 🔐 **User Authentication** — Secure login/logout flow powered by Firebase Auth.
- 🏠 **Home Page** — Browse a grid of movies displaying poster, title, release year, and type.
- 🔍 **Search** — Quickly find movies by title using the search bar in the navbar.
- ⭐ **Favorites System** — Add or remove movies from your favorites list with a single click (Favorite / UnFavorite toggle).
- 📌 **Favorites Page** — View all movies you've marked as favorite in one dedicated tab.
- 📱 **Responsive Design** — Clean, adaptive UI built with Tailwind CSS and Angular Material components.
- ☁️ **Cloud Data Persistence** — Favorites are stored and synced via Firebase (Firestore).

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| Framework | [Angular](https://angular.io/) |
| UI Components | [Angular Material](https://material.angular.io/) |
| Styling | [Tailwind CSS](https://tailwindcss.com/) |
| Backend / Auth / DB | [Firebase](https://firebase.google.com/) (Authentication & Firestore) |
| Deployment | [Vercel](https://vercel.com/) |

---

## 📸 Screenshots

### Home Page
Browse all movies, search, and toggle favorites directly from the movie grid.

### Favorite Page
A dedicated view listing only the movies you've favorited.

> Screenshots available in the `/screenshots` folder (add images here when available).

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [Angular CLI](https://angular.io/cli)
- A Firebase project (with Authentication and Firestore enabled)

### Installation

```bash
# Clone the repository
git clone https://github.com/<your-username>/movie-app.git
cd movie-app

# Install dependencies
npm install
```

### Environment Setup

Create your Firebase configuration in `src/environments/environment.ts`:

```ts
export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
  }
};
```

### Run Locally

```bash
ng serve
```

Then navigate to `http://localhost:4200/`.

### Build for Production

```bash
ng build --configuration production
```
