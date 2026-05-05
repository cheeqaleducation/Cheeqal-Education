# Firebase Security Spec - EduKit

## Data Invariants
1. A user can only read and write their own profile in `users/{userId}`.
2. A document (Modul Ajar) in `documents/{documentId}` must have a `userId` field matching the creator's UID.
3. Users can only read, update, or delete documents where `resource.data.userId == request.auth.uid`.
4. Document IDs must be valid alphanumeric strings.
5. `createdAt` must be set to `request.time` on creation and be immutable.
6. `userId` must be immutable after creation.

## The Dirty Dozen Payloads (Target: Denied)

1. **Identity Spoofing (Profile)**: Attempt to create/update `users/other_uid` while authenticated as `my_uid`.
2. **Identity Spoofing (Document)**: Create a document with `userId: "other_uid"`.
3. **Cross-User Read**: Authenticated user trying to `get` or `list` documents belonging to another user.
4. **Unauthorized Global Read**: Unauthenticated user trying to read any document.
5. **Ghost Field Injection**: Adding `isAdmin: true` to a user profile.
6. **Immutable Field Toggling**: Changing `createdAt` or `userId` on an existing document.
7. **Junk ID Poisoning**: Using a 2KB string as a document ID.
8. **PII Leakage**: Attempting to read all user profiles (list on `/users`).
9. **Type Mismatch**: Sending an array for the `title` field.
10. **State Corruption**: Updating a document without including the mandatory `content` field.
11. **Time Spoofing**: Sending a client-side `createdAt` timestamp from 2020.
12. **Recursive Cost Attack**: Making a shallow query that attempts to bypass the `userId` filter.

## Test Runner
I will verify these in the next steps using the rules.
