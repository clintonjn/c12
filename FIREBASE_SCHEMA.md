# Firebase Schema Design for Chat System

## Collections Structure

### 1. users (existing)

```
users/{userId}
├── uid: string
├── firstName: string
├── lastName: string
├── email: string
├── phoneNumber: string
├── createdAt: timestamp
```

### 2. friends (new)

```
friends/{friendId}
├── id: string (auto-generated)
├── name: string
├── createdBy: string (userId who created this friend)
├── createdAt: timestamp
```

### 3. messages (new)

```
messages/{messageId}
├── id: string (auto-generated)
├── friendId: string (reference to friends collection)
├── userId: string (who sent the message)
├── text: string
├── timestamp: timestamp
├── type: 'sent' | 'received' (for UI purposes)
```

## Key Design Decisions

### Simple Friend Model

- **No mutual friendship**: One user creates friends, owns the chat
- **Name-only storage**: Just store friend's name (no complex user relationships)
- **User-scoped**: Each user has their own friends list

### Message Organization

- **Friend-based grouping**: Messages grouped by friendId
- **Simple text messages**: Start with text-only (can extend later)
- **Timestamp ordering**: Use Firestore timestamp for ordering
- **Type field**: Helps with chat bubble styling (sent vs received)

### Firestore Queries Needed

```javascript
// Get user's friends
friends.where('createdBy', '==', currentUserId).orderBy('createdAt', 'desc');

// Get messages for a friend
messages.where('friendId', '==', friendId).orderBy('timestamp', 'asc');

// Real-time message listener
messages
  .where('friendId', '==', friendId)
  .orderBy('timestamp', 'asc')
  .onSnapshot();
```

## Benefits of This Schema

- **Simple to implement**: No complex relationships
- **Scalable**: Can add features later (friend photos, message types, etc.)
- **Real-time ready**: Firestore listeners work well with this structure
- **User isolation**: Each user's data is separate and secure
