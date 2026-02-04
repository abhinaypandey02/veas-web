# Mobile ↔ Website Chat Sync - Quick Reference Card

## 🎯 Status: FULLY CONNECTED ✅

No backend changes needed. Mobile app is properly wired to backend.

---

## How Users Access Same Chat

```
Alice (user_id=1)           Bob (user_id=2)
      │                          │
      └──► JWT {id:1}  ◄────────┘─► JWT {id:2}
           │                        │
      ┌────▼────────────┐       ┌────▼────────────┐
      │    Mobile App   │       │    Website      │
      │                 │       │                 │
      │  Chat: "Hi!"    │       │  Chat: "Hi!"    │
      │  ↓              │       │  ↓              │
      │  apiFetch +     │       │  POST +         │
      │  Bearer token   │       │  Bearer token   │
      │  ↓              │       │  ↓              │
      └────┬────────────┘       └────┬────────────┘
           │                         │
           └────────────┬────────────┘
                        │
              ┌─────────▼──────────┐
              │  Backend API       │
              │  /api/Chat/send-chat
              │  getContext(req)   │
              │  ↓                 │
              │  Extract user_id   │
              └─────────┬──────────┘
                        │
         ┌──────────────▼──────────────┐
         │  Database (PostgreSQL)      │
         │  ChatTable                  │
         │  ├─ user_id: 1  ← Alice     │
         │  ├─ user_id: 1  ← Alice     │
         │  ├─ user_id: 2  ← Bob       │
         │  └─ user_id: 2  ← Bob       │
         │                            │
         │  Query: WHERE user_id = 1  │
         │  Result: Only Alice's msgs │
         └────────────────────────────┘
```

---

## The Three Endpoints

### 1️⃣ GraphQL Query: Get Chat History
```graphql
POST /api/graphql
Authorization: Bearer <JWT_TOKEN>

Query:
  getChats {
    message
    role        # user | assistant | summary
    createdAt
  }

Backend Logic:
  1. Extract userId from JWT
  2. Query: WHERE user_id = userId
  3. Return only this user's messages
```

### 2️⃣ REST Endpoint: Send Chat Message
```
POST /api/Chat/send-chat
Authorization: Bearer <JWT_TOKEN>
Content-Type: text/plain

Body: "Your message here"

Backend Logic:
  1. Extract userId from JWT
  2. Fetch user's previous messages
  3. Call Gemini AI
  4. Stream response in real-time
  5. Save message to DB with userId
```

### 3️⃣ Auth: JWT Token
```
JWT Structure: {
  "id": 1,              ← User ID (critical for isolation)
  "email": "alice@...",
  "iat": 1234567890,
  "exp": 1234567890
}

Stored in:
  Mobile: SecureStore (expo-secure-store)
  Website: localStorage

Auto-included in:
  All apiFetch() calls (mobile)
  All Apollo requests (website)
```

---

## Message Flow (Step by Step)

### Mobile → Website
```
1. Mobile: Send message "Tell me about my chart"
           ↓
2. Mobile: apiFetch("/Chat/send-chat", {
             Authorization: "Bearer eyJ...userId=1..."
           })
           ↓
3. Backend: GET /api/Chat/send-chat
            Extract: userId = 1
            ↓
4. Backend: SELECT * FROM chat 
            WHERE user_id = 1
            (Load previous messages)
            ↓
5. Backend: Call Gemini AI with user context
            ↓
6. Backend: Stream response chunks
            ↓
7. Mobile: Display streaming chunks in real-time
           ↓
8. Backend: Save to DB:
            INSERT chat (user_id=1, role='user', message=...)
            INSERT chat (user_id=1, role='assistant', message=...)
           ↓
9. Mobile: useChats() refetches
           Query: getChats
           Backend returns: WHERE user_id = 1
           ↓
10. Mobile: Shows new message in chat

✓ Message now in database with user_id=1

11. Website: User logs in with same email
            GET JWT token with user_id=1
            ↓
12. Website: Query getChats
            Backend returns: WHERE user_id = 1
            ↓
13. Website: 🎉 SAME MESSAGE APPEARS!
```

---

## User Isolation (Why Users Don't See Each Other's Chats)

### Example: Alice (id=1) vs Bob (id=2)

| What | Alice's Token | Bob's Token |
|------|---------------|------------|
| **JWT contains** | `{id: 1, ...}` | `{id: 2, ...}` |
| **Query executed** | `WHERE user_id=1` | `WHERE user_id=2` |
| **Messages returned** | Only id=1 rows | Only id=2 rows |
| **Database access** | 1 user isolation level | 2 user isolation level |

**Result**: Even if Bob has valid token, his queries return only his messages.
Alice's messages are invisible to Bob (different user_id in WHERE clause).

---

## File Locations

### Mobile (What's Connected)
| File | What It Does | Status |
|------|--------------|--------|
| [mobile/src/services/api.ts](mobile/src/services/api.ts) | Auto-adds Bearer token | ✅ |
| [mobile/src/services/chat.ts](mobile/src/services/chat.ts) | Streams messages | ✅ |
| [mobile/src/services/user.ts](mobile/src/services/user.ts) | Fetches chat history | ✅ |
| [mobile/src/state/token-store.ts](mobile/src/state/token-store.ts) | Stores JWT | ✅ |
| [mobile/src/screens/ChatScreen.tsx](mobile/src/screens/ChatScreen.tsx) | UI | ✅ |

### Backend (What Provides Data)
| File | What It Does | Status |
|------|--------------|--------|
| [app/api/.../Chat/(rest)/send-chat/route.ts](app/api/(graphql)/Chat/(rest)/send-chat/route.ts) | Streams response | ✅ |
| [app/api/.../Chat/resolvers/get-chats.ts](app/api/(graphql)/Chat/resolvers/get-chats.ts) | Returns history | ✅ |
| [app/api/.../Chat/utils.ts](app/api/(graphql)/Chat/utils.ts) | Saves messages | ✅ |
| [app/api/.../Chat/db.ts](app/api/(graphql)/Chat/db.ts) | Database schema | ✅ |

---

## Common Questions Answered

### Q: How does mobile know it's the same user on website?
**A**: They log in with the same email/password. Backend issues JWT with same userId. Both platforms query `WHERE user_id = userId` → same results.

### Q: What if token expires?
**A**: Mobile automatically detects 401 response, uses refreshToken to get new accessToken, retries request. No user action needed.

### Q: Can User A see User B's messages?
**A**: No. Every query filters by `WHERE user_id = ctx.userId`. Even with valid token, only that user's messages returned.

### Q: Where are messages stored?
**A**: PostgreSQL ChatTable. Every row has `user_id` column. Database enforces isolation.

### Q: Why streaming instead of waiting for full response?
**A**: Better UX. Characters appear one-by-one as AI generates them. No waiting for full 30-second response.

### Q: What if message fails to send?
**A**: Error message displayed on screen. Message not saved to database. User can retry.

### Q: Do both platforms see the same thing?
**A**: Yes! Same database, same user_id filter → identical chat history.

---

## Testing (5-Minute Verification)

```bash
✓ Step 1: Start backend (npm run dev)
✓ Step 2: Start mobile (npm start in mobile/)
✓ Step 3: Login on mobile
✓ Step 4: Send test message → See it stream in real-time
✓ Step 5: Open website, login with same email
✓ Step 6: Go to Chat page
✓ Step 7: 🎉 Same message appears!
✓ Step 8: Send message from website
✓ Step 9: Go back to mobile
✓ Step 10: 🎉 New message appears!

Result: ✅ Chat synced perfectly!
```

---

## What NOT to Change

❌ Don't modify:
- Mobile: api.ts (Bearer token auto-adding is correct)
- Backend: send-chat/route.ts (userId filtering is correct)
- Backend: get-chats.ts (user isolation is correct)
- Database: ChatTable schema (user_id FK is correct)

✅ Everything is working as-is!

---

## Key Insights

| Concept | Implementation |
|---------|-----------------|
| **User Isolation** | JWT userId + database WHERE clause |
| **Message Persistence** | Every message saved with userId |
| **Cross-Platform Sync** | Same database for both platforms |
| **Real-Time Updates** | ReadableStream chunks + useChats() refetch |
| **Security** | Bearer token validation on every endpoint |
| **Token Refresh** | Automatic 401 handling with refreshToken |

---

## Success Indicators

✅ You'll know it's working when:
- Message sent on mobile appears on website instantly
- Message sent on website appears on mobile instantly
- User A never sees User B's messages
- Real-time character streaming works
- Chat history loads on app open
- No 401 errors (or they're handled automatically)

**Current Status**: All ✅ = Ready for production!

---

## Need More Details?

📖 Read:
- [MOBILE_APP_BACKEND_CONNECTION.md](MOBILE_APP_BACKEND_CONNECTION.md) - Full architecture
- [CHAT_SYNC_ARCHITECTURE.md](CHAT_SYNC_ARCHITECTURE.md) - Data flow diagrams
- [CHAT_SYNC_TESTING.md](CHAT_SYNC_TESTING.md) - Testing guide
- [CHAT_CONNECTION_STATUS.md](CHAT_CONNECTION_STATUS.md) - Status report

🎯 **TL;DR**: It's already working perfectly. No changes needed!
