# 🧠 CoChat — A Collaborative, GPT-Powered Chatroom

CoChat lets multiple users join shared chatrooms and interact with GPT using their own encrypted API keys — securely and privately



## 📚 Table of Contents

- [🧱 Tech Stack](#-tech-stack)
- [📐 Architecture Overview](#-high-level-architecture-overview)
- [✅ Features](#-features)
- [🤔 Design Decisions](#-design-decisions)
- [⚠️ Limitations & Future Improvements](#️-limitations--future-improvements)


### 🧱 Tech Stack

| Area        | Technology                                                |
|-------------|-----------------------------------------------------------|
| Frontend    | React, Tailwind CSS                                       |
| Backend     | Node.js, Express.js                                       |
| Auth        | Firebase Authentication                                   |
| Realtime DB | Firebase Realtime Database                                |
| Database    | Supabase (PostgreSQL)                                     |
| Hosting     | Vercel (Frontend), Render (Backend), Supabase (Database) |
| Encryption  | Node.js crypto module (AES-256)                           |
| API         | OpenAI                                                    |
| Routing     | React Router                                              |
| Utility     | UUIDv6                                                    |


## 📐 High-Level Architechure Overview

![Architecture](IMG_0113.jpeg)


## 📸 Screenshots


## ✅ Features

- 🔐 End-to-End GPT Requests with Encrypted API Keys  
- 🧱 Room-Based Chat System (Create/Join/Own Rooms)  
- 🔄 Realtime Messaging with Firebase  
- 🧠 GPT Context Building (Prompt history & responses)  
- 🔐 Authentication + Email Verification (Firebas


## 🤔 Design Decisions

### Why not store API keys in frontend?

   > Exposing OpenAI keys on the frontend allows any user or attacker to extract it.
   > Keys are sent to backend on room creation and AES-encrypted before storage.
   > On GPT request within a room, the key is retrieved, decrypted, and used server-side

### Why encrypt the keys?

   > Even if the database is compromised, keys stay unreadable without the secret key.
   > Follows security best practices for sensitive credentials.

### Why Firebase Realtime Database?
   > Excellent for low-latency chat messaging.
   > Auth and RTDB integrate seamlessly for MVP speed.



## ⚠️ Limitations & Future Improvements
  
- 🚫 No rate-limiting on OpenAI requests (can be abused).  
- 🧪 Needs better error handling for expired verification links.  
- 🧱 No support yet for role-based access or permissions.
- 📱 UI/UX needs more polish for production readiness.
                  