---
id: recipe_pure_dart
title: Pure-Dart Usage
---

## 1. Add dependencies

First, add Isar to your project. Add the following packages to your `pubspec.yaml`. Always use the latest version.

```yaml
dependencies:
  isar: any

dev_dependencies:
  isar_generator: any
  build_runner: any
```

## 2. Add the appropriate Isar Core binaries

Get the binaries. Change the version as needed. Copy them to your OS' library paths as needed. For example, for Ubuntu, you would put the libisar_linux_x64.so in /usr/lib folder.

```html
https://github.com/isar/isar-core/releases/download/0.1.9/isar_windows_x64.dll
https://github.com/isar/isar-core/releases/download/0.1.9/libisar_macos_x64.dylib
https://github.com/isar/isar-core/releases/download/0.1.9/libisar_linux_x64.so
```

## 3. Annotate classes

Annotate your classes with `@Collection` and choose an id field.

```dart
@Collection()
class Contact {
  @Id()
  int? id;
  
  String name;
}
```

## 4. Run code generator

Execute the following command to start the `build_runner`:

```
dart run build_runner build
```


## 5. Open Isar instance

This opens an Isar instance at the default location.

```dart
final isar = await openIsar();
```


## 6. Write and read from database

Once your instance is open, you can start using the database.

```dart
final contact = Contact()
  ..name = "My first contact";

await isar.writeTxn((isar) async {
  isar.contacts.put(contact);
});

final allContacts = isar.contacts.where().findAll();
```
