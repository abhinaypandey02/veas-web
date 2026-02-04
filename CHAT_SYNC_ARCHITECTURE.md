# Chat Sync Data Flow Diagram

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                          SHARED BACKEND                         │
│                      (No Changes Needed)                        │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  PostgreSQL Database                                     │  │
│  │  ┌──────────────────────────────────────────────────┐   │  │
│  │  │ ChatTable                                        │   │  │
│  │  │ ├─ id (PK)                                       │   │  │
│  │  │ ├─ user_id (FK) ← USER ISOLATION KEY            │   │  │
│  │  │ ├─ role (enum: user|assistant|summary)          │   │  │
│  │  │ ├─ message (text)                               │   │  │
│  │  │ ├─ is_summarized (boolean)                       │   │  │
│  │  │ └─ created_at (timestamp)                        │   │  │
│  │  └──────────────────────────────────────────────────┘   │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Next.js API Routes                                     │  │
│  │  ├─ POST /api/graphql                                   │  │
│  │  │   └─ getChats Resolver                               │  │
│  │  │       └─ WHERE user_id = ctx.userId ✓               │  │
│  │  └─ POST /api/Chat/send-chat                            │  │
│  │      └─ Validates Bearer token → extracts userId        │  │
│  │      └─ Queries: WHERE user_id = ctx.userId ✓          │  │
│  │      └─ Saves: message with user_id = ctx.userId ✓    │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
          ▲                                           ▲
          │                                           │
          │ Bearer Token: JWT { id: 1, ... }         │
          │                                           │
          │ GraphQL query (GET_CHATS)                │ REST POST /Chat/send-chat
          │ Content-Type: application/json           │ Content-Type: text/plain
          │ Authorization: Bearer $TOKEN             │ Authorization: Bearer $TOKEN
          │                                           │
    ┌─────┴───────────────────────┐      ┌──────────┴──────────┐
    │                             │      │                     │
    │   MOBILE APP (iOS)          │      │  WEB APP (Website)  │
    │                             │      │                     │
    │  ┌─────────────────────┐    │      │  ┌──────────────┐   │
    │  │ ChatScreen.tsx      │    │      │  │ chat/page.tsx│   │
    │  │                     │    │      │  │              │   │
    │  │ useChats(true) ────────────────►  getChats query │   │
    │  │                     │    │      │                │   │
    │  │ streamChatMessage() ───────────► POST /send-chat │   │
    │  │                     │    │      │                │   │
    │  │ Token: SecureStore  │    │      │  Token: Header │   │
    │  │ (expo-secure-store) │    │      │  (localStorage)│   │
    │  └─────────────────────┘    │      │  ┌──────────────┐   │
    │                             │      │                     │
    └─────────────────────────────┘      └─────────────────────┘


## User Isolation Flow

┌─────────────────┐
│   User Login    │
└────────┬────────┘
         │
    ┌────▼─────────────────────────────────┐
    │  Backend auth system issues JWT      │
    │  Token body: { id: 1, ... }          │
    │  Token issued for user_id = 1        │
    └────┬─────────────────────────────────┘
         │
    ┌────┴──────────────────────────────────────────┐
    │                                               │
    │  Mobile App                  │  Website
    │  ├─ Token stored in          │  ├─ Token stored in
    │  │  SecureStore             │  │  localStorage
    │  │                          │  │
    │  └─ apiFetch wraps request  │  └─ Apollo client wraps
    │     with Authorization       │     request with
    │     header                   │     Authorization header
    │                              │
    ├──────────────────────────────┼──────────────┐
    │                              │              │
    ▼                              ▼              ▼
┌──────────────────────────────────────────────────┐
│        All Backend Requests Include              │
│    Authorization: Bearer eyJhbGc...             │
└──────────────────────┬───────────────────────────┘
                       │
        ┌──────────────▼──────────────┐
        │  getContext(req) extracts   │
        │  Bearer token & decodes     │
        │  ctx.userId = 1             │
        └──────────────┬──────────────┘
                       │
        ┌──────────────▼──────────────┐
        │  All database queries use   │
        │  WHERE user_id = ctx.userId │
        │  (User Isolation)           │
        └──────────────┬──────────────┘
                       │
        ┌──────────────▼──────────────┐
        │  User 1 only sees           │
        │  User 1's messages          │
        │  on mobile & website ✓      │
        └─────────────────────────────┘


## Message Send Flow (Same on Both Platforms)

┌──────────────────────────────────────────────────────┐
│  User sends message "Tell me about my chart"         │
│  (on mobile or website - IDENTICAL flow)            │
└──────────────────────┬───────────────────────────────┘
                       │
                       ▼
        ┌──────────────────────────────┐
        │  POST /api/Chat/send-chat    │
        │  Authorization: Bearer TOKEN │
        │  Content-Type: text/plain    │
        │  Body: "Tell me..."          │
        └──────────────┬───────────────┘
                       │
                       ▼
        ┌──────────────────────────────┐
        │  Backend Validates Token     │
        │  getContext(req)             │
        │  ctx.userId = 1 ✓            │
        └──────────────┬───────────────┘
                       │
                       ▼
        ┌──────────────────────────────┐
        │  Fetch user's previous       │
        │  messages from ChatTable     │
        │  WHERE user_id = 1 AND       │
        │        is_summarized = false │
        └──────────────┬───────────────┘
                       │
                       ▼
        ┌──────────────────────────────┐
        │  Load user profile           │
        │  (name, dob, location)       │
        │  FROM UserTable              │
        │  WHERE id = 1                │
        └──────────────┬───────────────┘
                       │
                       ▼
        ┌──────────────────────────────┐
        │  Call Gemini 2.5 Flash AI    │
        │  with:                       │
        │  • User's previous messages  │
        │  • New message               │
        │  • User profile context      │
        │  • System prompt             │
        └──────────────┬───────────────┘
                       │
                       ▼
        ┌──────────────────────────────┐
        │  Stream response chunks      │
        │  via ReadableStream          │
        │  (text/plain)                │
        │  to client                   │
        └──────────────┬───────────────┘
                       │
        ┌──────────────┴───────────────┐
        │                              │
        ▼                              ▼
    ┌─────────────┐            ┌────────────────┐
    │ Mobile      │            │ Website        │
    │ receives    │            │ receives       │
    │ chunks in   │            │ chunks via     │
    │ real-time   │            │ real-time      │
    │ and renders │            │ and renders    │
    │ in UI       │            │ in UI          │
    └─────────────┘            └────────────────┘
                       │
                       ▼
        ┌──────────────────────────────┐
        │  Async: Save to database     │
        │  waitUntil(processChat(...)) │
        │  ├─ INSERT message from user │
        │  │  with user_id = 1 ✓       │
        │  └─ INSERT response from AI  │
        │     with user_id = 1 ✓       │
        └──────────────┬───────────────┘
                       │
        ┌──────────────┴───────────────┐
        │                              │
        ▼                              ▼
    ┌─────────────┐            ┌────────────────┐
    │ Mobile      │            │ Website        │
    │ useChats    │            │ getChats query │
    │ refetches   │            │ refetches      │
    │ and loads   │            │ and loads      │
    │ new message │            │ new message    │
    │ ✓           │            │ ✓              │
    └─────────────┘            └────────────────┘
                       │
                       ▼
        ┌──────────────────────────────┐
        │  SAME MESSAGE VISIBLE        │
        │  on both platforms!          │
        │                              │
        │  User 1 sees it on:          │
        │  ✓ Mobile app                │
        │  ✓ Website                   │
        │  ✓ Any device (same account) │
        └──────────────────────────────┘


## Key Security Points

┌─────────────────────────────────────────────────────┐
│  Why User 1 Cannot See User 2's Messages            │
├─────────────────────────────────────────────────────┤
│                                                     │
│  1. Different JWT Tokens                           │
│     User 1: { id: 1, ... }                         │
│     User 2: { id: 2, ... }                         │
│                                                     │
│  2. Database Query Filtering                       │
│     getChats: WHERE user_id = ctx.userId           │
│     send-chat: WHERE user_id = ctx.userId          │
│                                                     │
│  3. User Isolation at Every Level                  │
│     ├─ GraphQL resolver enforces it                │
│     ├─ REST endpoint enforces it                   │
│     ├─ processChat() enforces it                   │
│     └─ Database schema (FK constraints)            │
│                                                     │
│  4. Token Expiry & Refresh                         │
│     Automatic 401 handling invalidates old token   │
│     Issues new token for same user only            │
│                                                     │
└─────────────────────────────────────────────────────┘
```

## Quick Reference

| Aspect | Mobile | Website | Backend |
|--------|--------|---------|---------|
| **Auth Token** | SecureStore (expo-secure-store) | localStorage | JWT validation |
| **Chat History** | useChats() hook | getChats query | GraphQL resolver |
| **Send Message** | streamChatMessage() | POST handler | /api/Chat/send-chat |
| **User Isolation** | Bearer token in apiFetch | Bearer token in headers | ctx.userId in queries |
| **Database** | Same ChatTable | Same ChatTable | userId filters all |
| **Sync** | Automatic via refetch | Automatic via Apollo | Single source of truth |

---

## Conclusion

✅ **Mobile app is fully connected to backend**
✅ **User-specific data sync via JWT userId**
✅ **Same chat visible on mobile and website**
✅ **No backend changes needed**
✅ **Automatic token refresh handles expiry**
✅ **Database queries enforce user isolation**
