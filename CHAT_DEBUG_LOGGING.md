# 🐛 Chat Feature Debug Logging Guide

**Added Detailed Logging to Expo Go** - No Backend Changes

---

## What Was Added

I've added comprehensive console logging throughout the mobile app chat feature to help diagnose issues:

### Files Modified (Mobile App Only)
- [mobile/src/services/api.ts](mobile/src/services/api.ts) - All API requests
- [mobile/src/services/chat.ts](mobile/src/services/chat.ts) - Streaming messages
- [mobile/src/services/graphql.ts](mobile/src/services/graphql.ts) - GraphQL queries
- [mobile/src/services/user.ts](mobile/src/services/user.ts) - Chat history hooks
- [mobile/src/screens/ChatScreen.tsx](mobile/src/screens/ChatScreen.tsx) - UI event logs

**Note**: NO backend changes made

---

## How to View Logs in Expo Go

### Option 1: Console Logs in Terminal
```bash
# Open terminal where Expo is running
# Logs appear automatically in the Metro bundler output

# You'll see entries like:
# [API a1b2c] 🚀 POST /Chat/send-chat
# [CHAT a1b2c] 💬 Starting chat stream
# [GQL a1b2c] 📋 GraphQL GetChats request
```

### Option 2: Expo Go Console (On Device)
```
1. Open Expo Go app
2. Shake device to open menu
3. Select "View logs"
4. Watch logs appear in real-time
```

### Option 3: Chrome DevTools (If using Expo Web)
```
1. Open app in Chrome
2. Press F12 (DevTools)
3. Go to Console tab
4. Try chat feature
5. See detailed logs
```

---

## Log Format & What Each Means

### API Requests
```
[API a1b2c] 🚀 POST /Chat/send-chat
│       │    │   │   │ 
│       │    │   │   └─ Endpoint being called
│       │    │   └─────── HTTP method
│       │    └─────────── Indicates request starting
│       └───────────────── Unique request ID (trace individual requests)
└─────────────────────── Log type (API calls)
```

**Example Full API Sequence**:
```
[API a1b2c] 🚀 POST /Chat/send-chat
[API a1b2c] 📋 Full URL: http://192.168.1.157:3002/api/Chat/send-chat
[API a1b2c] 🔐 Adding Bearer token: eyJhbGc...
[API a1b2c] 📦 Headers: ['Authorization', 'Content-Type']
[API a1b2c] 📝 Body: Tell me about my chart
[API a1b2c] ✅ 200 OK (1245ms)
[API a1b2c] 📊 Content-Type: text/plain; charset=utf-8
```

**What to look for**:
- ✅ `200` or `2xx` = Success
- ❌ `401` = Unauthorized (token missing/expired)
- ❌ `404` = User not found
- ❌ `500` = Server error
- ⏱️ Duration in ms (should be < 5000ms)

---

### Chat Streaming
```
[CHAT a1b2c] 💬 Starting chat stream
[CHAT a1b2c] 📨 Message: "Tell me about my chart"
[CHAT a1b2c] 🌊 Stream started, reading response body...
[CHAT a1b2c] 🔤 Using native TextDecoder
[CHAT a1b2c] 📦 Chunk 1: 145 bytes (52ms elapsed) - Total: 145 chars
[CHAT a1b2c] 📦 Chunk 2: 89 bytes (104ms elapsed) - Total: 234 chars
[CHAT a1b2c] 📦 Chunk 3: 156 bytes (187ms elapsed) - Total: 390 chars
[CHAT a1b2c] ✅ Stream complete
[CHAT a1b2c] 📊 Total chunks: 3
[CHAT a1b2c] 📊 Total duration: 2341ms
[CHAT a1b2c] 📊 Final message length: 890 chars
[CHAT a1b2c] 🔒 Reader lock released
```

**What to look for**:
- ✅ Multiple chunks arriving = Streaming working
- ❌ No chunks = Stream not starting
- ❌ Stuck on "Stream started" = Network issue or backend timeout
- ⏱️ Duration (normally 2-5 seconds for AI response)

---

### GraphQL Queries
```
[GQL a1b2c] 📋 GraphQL GetChats request
[GQL a1b2c] 📝 Query: query GetChats { getChats { message...
[GQL a1b2c] 🔧 Variables: {}
[GQL a1b2c] ✅ Success (324ms)
```

**What to look for**:
- ✅ Success message = Query working
- ❌ GraphQL errors = Check error message
- ❌ No data = Response parsing failed

---

### Component Hooks
```
[HOOK a1b2c] 🤝 useChats() executing
[HOOK a1b2c] 📌 Enabled: true
[HOOK a1b2c] ✅ Fetched 5 messages (412ms)
[HOOK a1b2c] 💬 [0] user: Tell me about my chart...
[HOOK a1b2c] 💬 [1] assistant: Your Vedic chart shows...
[HOOK a1b2c] 💬 [2] user: What does that mean...
```

**What to look for**:
- ✅ Messages fetched = History loading
- ❌ 0 messages = No history yet (normal for new user)
- ❌ Error fetching chats = Authentication issue

---

### UI Events
```
[SCREEN a1b2c] 🖥️  Chat screen send triggered
[SCREEN a1b2c] 📝 Message: "Tell me about my chart"
[SCREEN a1b2c] 🤖 Assistant ID: assistant-1707043200000
[SCREEN a1b2c] 📊 Messages count: 2
[SCREEN a1b2c] 🚀 Calling streamChatMessage...
[SCREEN a1b2c] 📤 Received chunk: 145 chars
[SCREEN a1b2c] 📤 Received chunk: 234 chars
[SCREEN a1b2c] ✅ Stream complete
[SCREEN a1b2c] 👋 Send finished
```

**What to look for**:
- ✅ "Send finished" = Complete flow worked
- ❌ Stuck at "Calling streamChatMessage" = Chat service issue
- ❌ Error in message = Exception caught with message

---

## Common Issues & Log Patterns

### Issue 1: "401 Unauthorized"
**Log**:
```
[API a1b2c] 🔐 Adding Bearer token: eyJhbGc...
[API a1b2c] ✅ 401 Unauthorized (456ms)
[API a1b2c] 🔄 Got 401, attempting token refresh...
```

**Cause**: Token missing or expired

**Fix**:
1. Log out and log back in
2. Verify email/password correct
3. Check SecureStore has token

---

### Issue 2: "No response body available"
**Log**:
```
[API a1b2c] ✅ 200 OK (1234ms)
[CHAT a1b2c] ❌ No response body available
```

**Cause**: Backend returned 200 but no streaming body

**Fix**:
1. Check backend is running: `npm run dev`
2. Verify API_BASE_URL correct: `http://192.168.1.157:3002/api`
3. Check backend logs for errors

---

### Issue 3: "GraphQL request failed"
**Log**:
```
[GQL a1b2c] 📋 GraphQL GetChats request
[GQL a1b2c] ❌ GraphQL request failed: 500
[GQL a1b2c] 📄 Response: Internal Server Error
```

**Cause**: Backend GraphQL error

**Fix**:
1. Check backend logs (npm run dev terminal)
2. Verify database connection
3. Check API_BASE_URL points to correct backend

---

### Issue 4: "Empty chunk received"
**Log**:
```
[CHAT a1b2c] 📦 Chunk 1: 145 bytes...
[CHAT a1b2c] ⏸️  Empty chunk received
[CHAT a1b2c] ⏸️  Empty chunk received
```

**Cause**: Normal - stream sending empty packets between chunks

**Fix**: No action needed - this is normal behavior

---

### Issue 5: Stream stuck/no chunks
**Log**:
```
[CHAT a1b2c] 💬 Starting chat stream
[CHAT a1b2c] 🌊 Stream started, reading response body...
[CHAT a1b2c] 🔤 Using native TextDecoder
(no chunks after 30 seconds)
```

**Cause**: 
1. Backend not responding
2. Network timeout
3. AI model not generating response

**Fix**:
1. Check backend running: `curl http://192.168.1.157:3002/api/graphql`
2. Check network: WiFi connected?
3. Check backend logs for AI errors
4. Increase timeout in [mobile/src/services/chat.ts](mobile/src/services/chat.ts)

---

## Debugging Checklist

When chat fails, check logs in this order:

### Step 1: API Request Logging
```
Look for: [API ...] 🚀 POST /Chat/send-chat
Expected: ✅ 200 OK or 201 Created
Problem: ❌ 401, 404, 500, or no response
Action: Check Authorization header & backend running
```

### Step 2: Chat Streaming
```
Look for: [CHAT ...] 📦 Chunk N:
Expected: Multiple chunks with increasing character count
Problem: ❌ No chunks or stuck
Action: Check network, backend logs
```

### Step 3: Message Received
```
Look for: [SCREEN ...] 📤 Received chunk:
Expected: Message building up in real-time
Problem: ❌ Stuck or error message
Action: Check stream formatting, TextDecoder
```

### Step 4: Chat History
```
Look for: [HOOK ...] ✅ Fetched N messages
Expected: > 0 messages after sending
Problem: ❌ 0 messages or error
Action: Check message was saved to database
```

---

## Copy-Paste Log Search Patterns

### Find all API errors
```bash
# In Expo console, search for:
❌
# OR
[API

# Look for: 401, 404, 500
```

### Find chat streaming issues
```bash
# In Expo console, search for:
[CHAT

# Look for: ❌, ⏸️ Empty chunk
```

### Track a single request
```bash
# Each request has unique ID (a1b2c)
# In Expo console, search for:
[API a1b2c]
[CHAT a1b2c]
[SCREEN a1b2c]

# All logs with same ID = one request lifecycle
```

---

## Real Example: Successful Chat Flow

```
[SCREEN a1b2c] 🖥️  Chat screen send triggered
[SCREEN a1b2c] 📝 Message: "Tell me about my chart"
[SCREEN a1b2c] 🤖 Assistant ID: assistant-1707043200000
[SCREEN a1b2c] 🚀 Calling streamChatMessage...

[CHAT a1b2c] 💬 Starting chat stream
[CHAT a1b2c] 📨 Message: "Tell me about my chart"

[API a1b2c] 🚀 POST /Chat/send-chat
[API a1b2c] 📋 Full URL: http://192.168.1.157:3002/api/Chat/send-chat
[API a1b2c] 🔐 Adding Bearer token: eyJhbGc...
[API a1b2c] ✅ 200 OK (245ms)

[CHAT a1b2c] 🌊 Stream started, reading response body...
[CHAT a1b2c] 🔤 Using native TextDecoder

[CHAT a1b2c] 📦 Chunk 1: 145 bytes (52ms) - Total: 145 chars
[SCREEN a1b2c] 📤 Received chunk: 145 chars

[CHAT a1b2c] 📦 Chunk 2: 89 bytes (104ms) - Total: 234 chars
[SCREEN a1b2c] 📤 Received chunk: 234 chars

[CHAT a1b2c] 📦 Chunk 3: 156 bytes (187ms) - Total: 390 chars
[SCREEN a1b2c] 📤 Received chunk: 390 chars

[CHAT a1b2c] ✅ Stream complete
[CHAT a1b2c] 📊 Total chunks: 3
[CHAT a1b2c] 📊 Total duration: 2341ms
[SCREEN a1b2c] ✅ Stream complete
[SCREEN a1b2c] 👋 Send finished

[HOOK a1b2c] 🤝 useChats() executing
[HOOK a1b2c] ✅ Fetched 2 messages (412ms)
[HOOK a1b2c] 💬 [0] user: Tell me about my chart
[HOOK a1b2c] 💬 [1] assistant: Your Vedic chart shows...
```

✅ **This flow = Everything working!**

---

## What Error Did You See?

Please share the logs and I can help narrow down the issue!

**To get logs**:
1. Open Expo Go
2. Shake phone → View logs
3. Try chat feature
4. Copy error lines and share them
5. Include:
   - API response status
   - Any ❌ errors
   - Stream output (or lack thereof)
   - How long it took

---

## Environment Check

Before debugging, verify:

```bash
# 1. Backend running?
curl -X POST http://192.168.1.157:3002/api/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"query{__typename}"}'

# Should return: 200 OK with data

# 2. Mobile connected to WiFi?
ping 192.168.1.157

# Should return: response time, no timeouts

# 3. Token valid?
# Check Expo logs:
# [API ...] 🔐 Adding Bearer token: eyJ...

# Should show token being added to requests
```

---

## Next Steps

1. **Run chat feature** in Expo
2. **Check console logs** in Expo Go or terminal
3. **Share error logs** with me
4. **I'll help debug** based on log patterns

The logging now tells us exactly where the failure is happening! 🎯
