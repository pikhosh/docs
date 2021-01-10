---
id: crud
title: Create, Read, Update, Delete
---

When you have your Collections defined, learn how to manipulate them!

## Opening Isar
Before you can do anything, you have to open an Isar instance. Each instance needs a directory with write permission.

To use the default folder, `filesDir/isar` for Flutter apps:

```dart
final isar = await openIsar();
```

You can also pass a relative or absolute path to the `openIsar()` method to customize the storage location. You can either store the Isar instance in a global variable or use your favorite dependency injection package to manage it.


## Collections
The Collection object is how you find, query, and create new records of a given type.


### Get a collection
All your collections live in the Isar instance. Remember the `Contact` class we annotated before with `@Collection()`. You can get the contacts collection with:

```dart
final contacts = isar.contacts;
```

That was easy!


### Get a record (by ID)
```dart
final contact = await contacts.get(someId);
```

`get()` returns a `Future`. All Isar operations are asynchronous by default. Most operations have a synchronous counterpart:

```dart
final contact = contacts.getSync(someId);
```


### Query records
Find a list of records matching given conditions using `.where()`:

```dart
final allContacts = await contacts.where().findAll();
final starredContacts = await contacts.where().filter().isStarred().findAll();
```
➡️ Learn more: [Queries](queries)


## Modifying the database
To create, update, or delete records, use the respective operations wrapped in a write transaction:

```dart
await isar.writeTxn(() async {
  final contact = await contacts.get(someId)
  contact.isStarred = false;

  await contact.save();   // perform update operations
  await contact.delete(); // or delete operations
});
```
➡️ Learn more: [Transactions](transactions)

### Create a new record

When an object is not yet managed by Isar, you need to `.put()` it into a collection.

```dart
final newContact = Contact()
  ..firstName = "Albert"
  ..lastName = "Einstein"
  ..isStarred = true;
await isar.writeTxn(() async {
  await contacts.put(newContact);
})
```

### Update a record

Once an object is in a collection, you can use `.save()` and `.delete()`.

```dart
await isar.writeTxn(() async {
  final starredContacts = await contacts.where().filter().isStarred().findAll();
  for (var contact in starredContacts) {
    contact.isStarred = false;
    await contact.save();
  }
});
```

### Delete a record
Deleting is just as easy as updating

```dart
await isar.writeTxn(() async {
  final unstarredContacts = await contacts.where().filter().isNotStarred().findAll();
  for (var contact in unstarredContacts) {
    await contact.delete();
  }
});
```

