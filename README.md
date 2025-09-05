# Genie AI

A modern Gemini-style conversational AI chat app.

🔗 **Live Demo**: [https://genie-ai-chat.vercel.app](https://genie-ai-chat.vercel.app)  
🔗 **Repository**: [https://github.com/shanutiwari1010/genie-ai](https://github.com/shanutiwari1010/genie-ai)

---

## ✨ Features

### 🔐 Authentication

- OTP-based login with dynamic country code selection.
- Country dial codes fetched from **restcountries.com** API.
- OTP simulation using `setTimeout`.
- Validation with **React Hook Form** + **Zod**.

### 📋 Dashboard

- View, create, and delete chatrooms.
- Real-time updates and toast feedback for user actions.
- Keyboard-accessible and responsive design.

### 💬 Chat Interface

- Conversational layout with AI/user messages, timestamps, and typing indicators.
- Throttled simulated AI replies using `setTimeout`.
- Client-side pagination with **reverse infinite scroll**.
- 100 dummy messages generated for testing.
- Client-side pagination with 20 messages per page.
- Skeleton loading while older messages are fetched.
- Supports image uploads with inline preview.
- Copy message to clipboard on hover.
- Users can react to any message with emojis (👍, ❤️, 😂, etc.)

### 🌐 UX Enhancements

- Dark mode toggle via context provider.
- Debounced chatroom search.
- State persisted using `localStorage`.
- Responsive design for mobile/tablet/desktop.
- Loading skeletons and typing indicators.

---

## 🧠 Key Implementations

### ✅ Form Validation

- Strong schema validation using **React Hook Form** + **Zod**.

### 💬 Throttled AI Replies

- Simulated response delay to mimic real-time AI interaction.

### 🔁 Infinite Scroll & Pagination

- Chat messages paginated in sets of 20.
- Intersection observer for lazy-loading older messages.
- Auto-scroll on new message and reverse scroll on history load.

### 🖼️ Image Upload

- Supports both base64 and preview URL rendering.
- Uploaded image shown inline in chat bubbles.

---

## 🧱 Folder Structure

```
src/
├── app/
│ ├── auth/ # OTP login and country code selection
│ └── chat/ # Chat-related routes
│   ├── id/ # Dynamic chatroom page
│   ├── history/ # Chat history logic
│   └── notifications/ # Notifications placeholder
├── components/
│ ├── auth/ # OTP and phone forms
│ └── chat/ # Chat UI components (chat-bar, message-list, typing-indicator, etc.)
│ ├── layout/ # Page layout structure
│ └── ui/ # Header, navigation, sidebar, theme provider
├── hooks/ # Custom React hooks
├── lib/
│ ├── schemas/ # Zod schemas
│ ├── stores/ # Zustand stores
│ └── utils/ # Helper functions
```

---

## 🛠️ Tech Stack

| Feature             | Library / Tool              |
|---------------------|-----------------------------|
| Framework           | **Next.js 15 (App Router)** |
| Styling             | **Tailwind CSS**            |
| Forms               | **React Hook Form + Zod**   |
| State Management    | **Zustand**                 |
| UX Enhancements     | Dark mode, responsive UI    |
| Deployment          | **Vercel**                  |

---

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/shanutiwari1010/genie-ai.git
cd genie-ai

# Install dependencies
npm install

# Run development server
npm run dev

# Visit
http://localhost:3000


