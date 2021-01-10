---
id: schema
title: Schema
---

When using Isar, you're dealing with Collections. A collection can only contain a single type of Dart object. To let Isar know which objects you want to store, you need to annotate your classes with `@Collection()`. The Isar code generator will take care of the rest. All the collections combined are called the "database schema".

## Annotating classes

The Isar generator will find all classes annotated with `@Collection()`. All model classes need to mixin or extend `IsarObject`.

```dart
@Collection()
class Contact with IsarObject {
    String firstName;

    String lastName;

    bool isStarred;
}
```


### Supported types

Isar supports fields of type `bool`, `int`, `double`, `String`, `Uint8List`, `List<bool>`, `List<int>`, `List<double>`, `List<String>`.

It is important to understand how nullability works in Isar:
Number types do **NOT** have a dedicated `null`-representation. Instead a specific value will be used. `int` uses the `int.MIN` value and `double` uses `double.NaN`. `bool`, `String` and `List` have a separate `null`.

While this may sound strange at first, it allows you to change the nullability of your fields freely without requiring migration or special code to handle `null`s.


### 8-byte and 4-byte numbers

`int` and `double` have an 8-byte representation in Dart. By default, this is also true for Isar. You can however change numbers to a 4-byte representation to save disk space by annotating number fields with `@Size32()`. It is your responsibility to make sure that you do not store a number that requires eight byte in a `@Size32()` field.

### Ignoring fields

By default, all public fields of a class will be persisted. By annotating a field with `@Ignore()`, you can exclude it from persistence. Keep in mind that it is not good practice to store information in your Isar objects that is not persisted.

### Renaming classes and fields

You have to be careful when you want to rename a class or field. Most of the time it will just drop the class or field. With the `@Name()` annotation, you can name classes and fields in the database independantly from Dart. The following code will yield the exact same schema as the code above.

```dart
@Collection()
@Name("Contact")
class MyContactClass1 with IsarObject {

    @Name("firstName")
    String theFirstName;

    @Name("lastName")
    String familyName;

    bool isStarred;
}
```


## Schema migration

It is possible to change a schema between releases of your app (for example by adding collections) but it is very important to follow the rules of schema migration.

It very inexpensive to:
 - Add new collections
 - Remove existing collections (the data will be deleted)
 - Change the nullability of a field (e.g. `int` -> `int?` or `List<String?>` -> `List<String>`)
 - Rename collections and fields annotated with `@DbName()`

The following changes require a migration for every entry of that collection:
 - Add fields to existing collections
 - Remove fields from existing collections

:::caution
Renaming a collection that is not annotated with `@DbName()` will delete and recreate this collection. All data in the collection will be lost.
:::

:::danger
**DO NOT** change the type of fields in existing collections.
:::