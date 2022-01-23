---
title: Quickstart
---

# Quickstart

Holy smokes you're here! Let's do this. We're going to be short on words and quick on code in this quickstart.

## 1. Add dependencies

First, add Isar to your project. Add the following packages to your `pubspec.yaml`. Always use the latest version.

```yaml
dependencies:
  isar: $latest
  isar_flutter_libs: $latest # contains the binaries
  isar_connect: $latest # if you want to use the Isar Inspector

dev_dependencies:
  isar_generator: $latest
  build_runner: any
```

Replace `$latest` with the latest Isar version.

For non-Flutter projects, you need to manually include the Isar Core binaries.


## 2. Annotate classes

Annotate your classes with `@Collection` and choose an id field.

```dart
@Collection()
class Contact {
  @Id()
  int? id;
  
  late String name;
}
```

## 3. Run code generator

Execute the following command to start the `build_runner`:

```
dart run build_runner build
```

If you are using Flutter, try:

```
flutter pub run build_runner build
```

## 4. Open Isar instance

This opens an Isar instance at a valid location.

```dart
final dir = await getApplicationSupportDirectory();

final isar = await Isar.open(
  schemas: [ContactSchema],
  path: dir.path,
);
```


## 5. Write and read from database

Once your instance is open, you can start using the database.

```dart
final contact = Contact()
  ..name = "My first contact";

await isar.writeTxn((isar) async {
  contact.id = isar.contacts.put(contact);
});

final allContacts = await isar.contacts.where().findAll();
```
