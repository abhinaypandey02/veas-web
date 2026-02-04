# Mobile App ↔ Backend Chat Connection Verification

**Status**: ✅ **FULLY CONNECTED & USER-ISOLATED**

---

## Connection Architecture

### Authentication Flow (Per-User Isolation)
```
Mobile App
    ↓
Login/Token Storage (SecureStore)
    ↓
JWT Bearer Token (accessToken + refreshToken)
    ↓
apiFetch() wraps all requests with Authorization header
    ↓
Backend validates Bearer token via getContext(req) from naystack/auth
    ↓
Extract userId from JWT → Use for database filtering
```

**Result**: Each user ONLY accesses their own messages (user-specific queries filter by `userId`)

---

## Endpoint Connections

### 1. **Chat History Retrieval** (GraphQL Query)
**Mobile**: 
- File: [mobile/src/services/user.ts](mobile/src/services/user.ts#L35)
- Hook: `useChats(enabled: boolean)` 
- Query: `GET_CHATS` from [mobile/src/services/queries.ts](mobile/src/services/queries.ts#L14)

```graphql
query GetChats {
  getChats {
    message
    role        # "user" | "assistant" | "summary"
    createdAt
  }
}
```

**Backend**:
- Route: `POST /api/graphql`
- Resolver: [app/api/(graphql)/Chat/resolvers/get-chats.ts](app/api/(graphql)/Chat/resolvers/get-chats.ts)
- Query Filter: `WHERE userId = ctx.userId AND role != "summary"`
- Auth: **Required** (`authorized: true`)
- Response: `Chat[]` with message, role, createdAt

**Flow**:
1. Mobile calls `useChats(true)` on component mount
2. apiFetch sends POST to `/api/graphql` with Bearer token
3. Backend extracts `ctx.userId` from JWT
4. Queries ChatTable filtered by userId (no other user's messages visible)
5. Returns messages to mobile, filtered to exclude "summary" role
6. Mobile renders in ChatScreen conversation view

---

### 2. **Real-Time Message Streaming** (REST Endpoint)
**Mobile**:
- File: [mobile/src/services/chat.ts](mobile/src/services/chat.ts)
- Function: `streamChatMessage(message: string, onChunk: callback)`
- Uses: ReadableStream for chunked character-by-character updates

```typescript
await apiFetch("/Chat/send-chat", {
  method: "POST",
  headers: { "Content-Type": "text/plain" },
  body: message  // Plain text message
})
```

**Backend**:
- Route: `POST /api/Chat/send-chat`
- Handler: [app/api/(graphql)/Chat/(rest)/send-chat/route.ts](app/api/(graphql)/Chat/(rest)/send-chat/route.ts)
- Auth: **Required** (checks `ctx.userId` from Bearer token)
- Process:
  1. Extract userId from Authorization header
  2. Fetch unsummarized messages for this user only: `WHERE userId = ? AND isSummarized = false`
  3. Load user profile (name, DOB, location) for AI context
  4. Call Gemini 2.5 Flash with user's conversation history
  5. Stream response chunks via ReadableStream
  6. Asynchronously save both user message + AI response to ChatTable with userId

**Flow**:
1. User types message in ChatScreen
2. Mobile calls `streamChatMessage(userInput, onChunk)`
3. apiFetch sends POST to `/api/Chat/send-chat` with Bearer token
4. Backend extracts userId from JWT
5. Loads user's previous messages only (WHERE userId = ?)
6. AI generates response with user context
7. Response streamed character-by-character to mobile
8. Mobile updates UI in real-time as chunks arrive
9. Backend saves message to database with userId
10. Next query refresh loads new message via getChats

---

## User Isolation Verification

### How Each User Only Sees Their Messages

| Layer | Implementation | User Isolation |
|-------|-----------------|-----------------|
| **Authentication** | JWT Bearer token with userId encoded | ✅ Token unique per user |
| **Chat History Query** | `getChats` resolver extracts `ctx.userId` from JWT | ✅ `WHERE userId = ctx.userId` |
| **Message Sending** | POST endpoint validates Bearer token, extracts userId | ✅ `userId` from JWT used in processChat() |
| **Database** | ChatTable has userId foreign key | ✅ `userId` column ensures data isolation |
| **Token Refresh** | Automatic 401 handling with refreshToken | ✅ Returns new token for same user |

### Multi-User Scenario Example
```
User A (userId: 1)
├─ Token: JWT with sub=1
├─ Chat History: SELECT * FROM chat WHERE userId=1 AND role!='summary' ✅
└─ Messages: Only A's messages visible

User B (userId: 2)
├─ Token: JWT with sub=2
├─ Chat History: SELECT * FROM chat WHERE userId=2 AND role!='summary' ✅
└─ Messages: Only B's messages visible

(No user can access other users' messages - even with valid token, userId in JWT constrains query)
```

---

## Message Lifecycle (User-Specific)

### On Mobile
1. **Load Chat History** → `useChats(true)` loads messages for logged-in user
2. **Send Message** → `streamChatMessage()` with Bearer token
3. **Real-Time Streaming** → Chunks received and rendered in real-time
4. **Persistent Update** → Backend saves message with userId
5. **Next Refresh** → `useChats` refetch loads new message

### On Website
1. **Chat Page Load** → `getChats.authCall()` fetches messages for logged-in user
2. **Send Message** → POST `/api/Chat/send-chat` with Bearer token
3. **Real-Time Streaming** → Chunks received and rendered in real-time
4. **Persistent Update** → Backend saves message with userId
5. **Next Refresh** → GraphQL query refetch loads new message

### Both Platforms
- **Same Backend**: Both call same `/api/Chat/send-chat` endpoint
- **Same Database**: Messages stored in same ChatTable
- **Same User Context**: JWT userId determines which messages returned
- **User-Specific**: Each user only sees their own messages on any platform

---

## Data Sync Strategy

### How Same Chat Appears on Both Platforms

**Platform A (Mobile)** → **Backend Database** ← **Platform B (Website)**

1. User logs in on mobile app
   - JWT token stored in SecureStore (expo-secure-store)
   - useChats() query fetches messages from backend

2. User sends message on mobile
   - streamChatMessage() sends to /api/Chat/send-chat with Bearer token
   - Backend saves to ChatTable with userId

3. User opens website on same account
   - Logs in (same email/password)
   - Gets JWT token in Authorization header
   - getChats query fetches from ChatTable filtered by userId
   - **Sees same messages sent from mobile** ✅

4. User sends message on website
   - POST /api/Chat/send-chat with Bearer token
   - Backend saves to ChatTable with userId

5. User returns to mobile
   - useChats() refetch queries ChatTable (filtered by userId)
   - **Sees message sent from website** ✅

**Key**: Same database row has same userId, so both platforms see it

---

## Technical Implementation Details

### Mobile Token Management ([mobile/src/state/token-store.ts](mobile/src/state/token-store.ts))
```typescript
export type AuthTokens = {
  accessToken: string | null;      // JWT with userId encoded
  refreshToken: string | null;     // For token refresh
};

export const tokenStore = {
  get() { return currentTokens; },
  set(tokens) { ... },
  subscribe(listener) { ... }      // Real-time updates
};
```

### API Request Wrapping ([mobile/src/services/api.ts](mobile/src/services/api.ts))
```typescript
export async function apiFetch(path: string, options: ApiFetchOptions = {}) {
  const tokens = tokenStore.get();
  
  // Automatically add Bearer token to every request
  if (auth && tokens.accessToken) {
    requestHeaders.Authorization = `Bearer ${tokens.accessToken}`;
  }
  
  // Automatic token refresh on 401
  if (response.status === 401 && retryOnUnauthorized) {
    const nextAccessToken = await handleUnauthorized(tokens.refreshToken);
    // Retry request with new token
  }
}
```

### Backend User Context ([app/api/(graphql)/Chat/(rest)/send-chat/route.ts](app/api/(graphql)/Chat/(rest)/send-chat/route.ts#L13))
```typescript
export const POST = async (req: NextRequest) => {
  const ctx = await getContext(req);  // Extract from Bearer token
  if (!ctx?.userId) return new NextResponse("Unauthorized", { status: 401 });
  
  // Use ctx.userId to filter all database queries
  const chats = await db.select().from(ChatTable)
    .where(eq(ChatTable.userId, ctx.userId));  // ← User isolation!
};
```

---

## Configuration

### API Base URL
**Mobile** ([mobile/src/config.ts](mobile/src/config.ts)):
```typescript
export const API_BASE_URL = 
  process.env.EXPO_PUBLIC_API_BASE_URL || 
  "https://api.veas.app/api";  // Production fallback
```

**Website** (Next.js Server):
```typescript
// Uses relative `/api` paths (same domain)
// Configured in naystack: graphqlUri: "/api"
```

### Headers
- **Chat History (GraphQL)**: `Content-Type: application/json`
- **Message Streaming (REST)**: `Content-Type: text/plain`
- **All Requests**: `Authorization: Bearer <JWT_TOKEN>` (automatic via apiFetch)

---

## Testing Connection

### Test 1: Login & Token Verification
```bash
# Step 1: Login on mobile/website
# JWT token stored in SecureStore (mobile) or localStorage (web)

# Step 2: Verify token contains userId
echo $TOKEN | jq -R 'split(".")[1] | @base64d'
# Output: { "id": 1, "iat": ..., "exp": ... }
```

### Test 2: Chat History Sync
```bash
# Step 1: Send message on Mobile
# (streamChatMessage called in ChatScreen.tsx)

# Step 2: Verify message in database
# SELECT * FROM chat WHERE user_id = 1 ORDER BY created_at DESC LIMIT 1;
# Output: Should show message with role='user' and user_id=1

# Step 3: Open Website Chat
# Query getChats resolver executes:
# SELECT * FROM chat WHERE user_id = 1 AND role != 'summary'
# Output: Same message visible ✅
```

### Test 3: Real-Time Update
```bash
# Step 1: Send from Mobile
curl -N -X POST http://192.168.1.157:3000/api/Chat/send-chat \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: text/plain" \
  -d "Test message"

# Step 2: Check Website immediately
# useChats query returns message sent from mobile ✅
```

---

## Troubleshooting

### Issue: Mobile shows different messages than website
**Cause**: Different user accounts or expired token

**Fix**:
1. Verify same email logged in on both platforms
2. Check token expiry: `echo $TOKEN | jq -R 'split(".")[1] | @base64d' | grep exp`
3. Force refresh on mobile: Clear cache, restart app

### Issue: Message doesn't appear immediately on other platform
**Cause**: useChats query not refetching

**Fix**:
1. Mobile: `useChats(true)` automatically refetches on page focus
2. Website: Apollo cache automatically invalidates on mutation
3. Manual: Refresh page / Swipe to refresh (mobile)

### Issue: 401 Unauthorized errors
**Cause**: Token expired or invalid

**Fix**:
1. Log out and log back in
2. Check token stored in SecureStore (mobile): `MMKV storage inspection`
3. Verify Authorization header: Check browser DevTools Network tab

---

## Summary: Why This Works

✅ **Authentication**: JWT Bearer tokens with userId encoded
✅ **User Isolation**: All queries filter by ctx.userId from token
✅ **Same Database**: Both platforms read/write to ChatTable
✅ **Automatic Sync**: Database is single source of truth
✅ **Real-Time**: Streaming endpoint works on both platforms
✅ **Token Refresh**: Automatic 401 handling maintains session
✅ **No Backend Changes Needed**: Existing auth system enforces user isolation

**Result**: Users see same chat history on mobile app and website, automatically synced via shared database with JWT-based user isolation.
