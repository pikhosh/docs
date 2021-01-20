---
id: transactions
title: Transactions
---

In Isar, a transaction combines multiple database operations in a single unit of work. Most interactions with Isar implicitly use a transaction. Read & write access in Isar is [ACID](http://en.wikipedia.org/wiki/ACID).

## Explicit transactions

With an explicit transaction you get a consistent view of the database. You should try to minimize the time a transaction is active. It is forbidden to do network calls or other long running operations in a transaction.

Transactions (especially write transactions) do have a cost and you should always try to group successive operations in a single transaction.

Transactions can either be synchronous or asynchronous. In synchronous transactions you may only use synchronous operations. In asynchronous transactions only async operations.

|              | Read         | Read & Write       |
|--------------|--------------|--------------------|
| Synchronous  | `.txnSync()` | `.writeTxnSync()`  |
| Asynchronous | `.txn()`     | `.writeTxn()`      |


### Read transactions

Read transactions are optional but they allow you to do atomic reads and rely on a constistent state of the database. Async read transactions run in parallel to other read and write transactions.


### Write transactions

Unlike read operations, write operations in Isar always have to be wrapped in an explicit transaction.

When a write transaction finishes succesfully, it is automatically commited and all changes are written to disk. If an error occurs, the transaction is aborted and all the changes are discarded. Transactions are “all or nothing”: either all the writes within a transaction succeed, or none of them take effect. This helps guarantee data consistency.

```dart
@Collection()
class Contact with IsarObject {
  String name;
}

// GOOD: move loop inside transaction
await isar.writeTxn((isar) async {
  for (var contact in getContacts()) {
    isar.contacts.put(contact);
  }
});

// BAD: move create transactions in loop
for (var contact in getContacts()) {
  await isar.writeTxn((isar) async {
    isar.contacts.put(contact);
  });
}
```

:::warning
Write transactions block each other. Make sure that your write transaction does not depend on another write transaction or you can easily deadlock your app.
:::