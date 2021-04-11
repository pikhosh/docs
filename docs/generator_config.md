---
id: generator_config
title: Multi-package & Dart only Setup
---

The Isar Generator can be configured for different types of project. Isar supports distributing collections actross multiple projects and also projects that don't use Flutter.

## Dart only projects

If you want to use Isar without access to Flutter dependencies for example for a CLI or server app, you need to change the Isar generator settings.

Just create a file called `build.yaml` in your project root:

```yaml
targets:
  $default:
    builders:
      isar_generator|generator:
        options:
          flutter: false
```

Rerun the build runner and the Isar generator will avoid including Flutter dependencies


## Multi-package setup

It's good practice to split big Flutter projects into multiple smaller packages to decouple code and make testing easier. It is important that the Isar generator finds all collection classes in your project. By default it will ignore collections defined in dependencies.

### Root package setup

Let's imagine we have a root project with a collection called `RootObject`.

```dart
@Collection()
class RootObject {
  int? id;

  String? data;
}
```

If we run the generator, it will generate the necessary code just fine.

Now we want to depend on a child package with two collections called `ChildObject1` and `ChildObject2`:

```dart
@Collection()
class ChildObject1 {
  int? id;

  String? data1;
}

@Collection()
class ChildObject2 {
  int? id;

  String? data2;
}
```

Running the Isar generator in the child package will generate all the query extension methods but running it in the root package will not generate the schema required to open the collections.

We need to tell the Isar generator to generate the schema in the root package by annotating an arbitrary class in the root package with `@ExternalCollection()` for each child collection.

```dart
import 'package:child_package/child_package.dart';

@ExternalCollection(ChildObject1)
@ExternalCollection(ChildObject2)
class MyCollectionRegistry {

}
```

If you don't use this class anywhere, it will be stripped from your release build (which is good).

### Child package setup (optional)

To avoid generating code that is not necessary in child packages like `isarOpen()`, you can create a `build.yaml` file in the root directory of the child package.

```yaml
targets:
  $default:
    builders:
      isar_generator|generator:
        options:
          package: true
```



