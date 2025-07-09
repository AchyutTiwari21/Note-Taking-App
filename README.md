# ⚛️ React Note-Taking-App – Frontend

This is the **frontend** of the Note-Taking App built with **React.js**, **TypeScript**, **TailwindCSS**, and **ShadCN UI**. It connects to a Node.js backend via RESTful API and supports authentication, note management, and a responsive UI.

---

## 🛠 Tech Stack

- **React.js** (Vite)
- **TypeScript**
- **TailwindCSS**
- **ShadCN UI** (Radix + Tailwind)
- **React Router DOM**
- **Fetch**

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/note-taking-frontend.git
cd Note-Taking-App
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file:

```env
VITE_LOCAL_API_URL=http://localhost:8000
VITE_PRODUCTION_API_URL=https://production.example.com
```

---

## 🧪 Run the App

```bash
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📁 Project Structure

```
src/
├── components/
├── config/
├── context/
├── hooks/
├── lib/
├── pages/
├── services/   #API Logic
├── App.tsx  
├── index.css
├── main.tsx
└── vite-env.d.ts
```

---

## 📄 Pages

| Path           | Description                   |
|----------------|-------------------------------|
| `/`            | Landing Page                  |
| `/signup`      | Signup (Email/OTP/Google)     |
| `/signin`      | Signin                        |
| `/dashboard`   | Note list for the user        |
| `/note/:id`    | Full view of a selected note  |

---

## 🎨 UI & Styling

- TailwindCSS for utility-first styling
- ShadCN UI for prebuilt components
- Mobile-first, accessible design

---

## 🔐 Authentication

- JWT Auth via HttpOnly cookies
- `credentials: 'include'` used with fetch
- Guards for protected routes

---

## ✅ Features

- 🔐 Signup/Login with Email OTP
- 🌐 Google OAuth login
- 📓 Create, View, Edit, Delete Notes
- 📱 Responsive, modern UI
- ⚙️ Connected to a backend API

---

## 🔗 Backend

Connects to: [Note-Taking App Backend](https://github.com/your-username/Note-API)

---

## 👨‍💻 Author

Achyut Tiwari  
Frontend built using React, TailwindCSS & ShadCN.
