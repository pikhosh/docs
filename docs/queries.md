---
id: queries
title: Queries
---

Querying is how you find records that match certain conditions, for example:

- Find all starred contacts
- Find distinct first names in contacts
- Delete all contacts that don't have a last name defined

Because queries are executed on the database, and not in Dart, they're really fast. When you cleverly use indexes, you can improve the query performance even further. In the following, you'll learn how to write queries and how you can make them as fast as possible.

There are two different methods of filtering your records: Filters and where clauses. We'll start by taking a look at how filters work.

## Filters
Filters are easy to use and understand. Depending on the type of your properties, there are different filter operators available most of which have self-explanatory names.

Filters work by evaluating an expression for every object in the collection being filtered. If the expression resolves to true, Isar includes the object in the results. Filters have no effect on the ordering of the results.

We'll use the following model for the examples below:

```dart
@Collection()
class Shoe {
  int id;

  int? size;

  String model;

  bool isUnisex;
}
```

### Query conditions

Depending on the type of a field, there are different conditions available.

Condition | Description
--- | ---
`.equalTo(value)` | Matches values that are equal to the specified `value`. 
`.between(lower, upper)` | Matches values that are between `lower` (included) and `upper` (included).
`.greaterThan(bound)` | Matches values that are greater than `bound`.
`.lessThan(bound)` | Matches values that are less than `bound`. `null` values will be included by default because `null` is considered smaller than any other value.
`.isNull()` | Matches values that are `null`.
`.in(values)` | Matches values that are in the specified `values`. 

Let's assume the database contains four shoes with sizes 39, 40, 46 and one with unset (`null`) size. Unless you perform sorting, the values will be returned sorted by id.

```dart 

isar.shoes.where().filter().sizeLessThan(40).findAll() // -> [39, null]

isar.shoes.where().filter().sizeLessThan(40, include: true).findAll() // -> [39, null, 40]

isar.shoes.where().filter().sizeBetween(39, 46, includeLower: false).findAll() // -> [40, 46]

isar.shoes.where().filter().sizeIn([38, 39, 40]).findAll() // -> [39, 40]

```

### Logical operators

You can composit predicates using logical operators.

Operator | Description
--- | ---
`.and()` | Evaluates to true if both left-hand and right-hand expressions are true.
`.or()` | Evaluates to true if either expression returns true.
`.not()` | Negates the result of the following expression.
`.group()` | Group conditions and allow to specify order of evaluation.

If you want to find all shoes with size 46, you can use the following query:

```dart
final result = await isar.shoes.where().filter().sizeEqualTo(46).findAll();
```

If you want to use more than one condition, you can combine multiple filters using logical **and** `.and()` and logical **or** `.or()`:

```dart
final result = await isar.shoes.where().filter()
  .sizeEqualTo(46)
  .and()          // Optional. Filters are implicitly combined with logical and.
  .isUnisexEqualTo(true)
  .findAll();
```

You can also group conditions using `.group()`:
```dart
final result = await isar.shoes.where().filter()
  .sizeBetween(43, 46)
  .and()
  .group((q) =>
    .modelNameContains('Crocs')
    .or()
    .isUnisexEqualTo(false)
  )
  .findAll()
```

To negate a condition or group, use logical **not** `.not()`:

```dart
final result = await isar.shoes.where().filter()
  .not().sizeEqualTo(46)
  .and()
  .not().isUnisexEqualTo(true)
  .findAll();
```

### String conditions

You can compare string values using these string operators. Regex-like wildcards allow more flexibility in search.

Condition | Description
--- | ---
`.startsWith(value)` | Matches string values that begins with provided `value`.
`.contains(value)` | Matches string values that contain the provided `value`.
`.endsWith(value)` | Matches string values that end with the provided `value`.
`.matches(wildcard)` | Matches string values that match the provided `wildcard` pattern. 

**Case sensitivity**  
All string operations have an optional `caseSensitive` parameter that defaults to `true`.

**Wildcards:**  
A [wildcard string expression](https://en.wikipedia.org/wiki/Wildcard_character) is a string that uses normal characters with two special wildcard characters:
- The `*` wildcard matches zero or more of any character
- The `?` wildcard matches any character.
For example, the wildcard string "d?g" matches "dog", "dig", and "dug", but not "ding", "dg", or "a dog".


### Links

If your model contains [links or backlinks](links) you filter your query based on the linked objects.

```dart
@IsarCollection()
class Teacher {
    int id;

    String subject;
}

@IsarCollection()
class Student {
    int id;

    String name;

    final teachers = IsarLinks<Teacher>();
}
```

We can for example find all students that have a math or English teacher:

```dart
final result = await isar.students.where()
  .filter()
  .teachers((q) => q.subjectEqualTo('Math')
    .or()
    .subjectEqualTo('English')
  ).findAll()
```

Link filters evaluate to `true` if at least one linked object matches the conditions.


## Where clauses
Where clauses are a very powerful tool but it can be a little difficult to get them right.

In contrast to filters where clauses use the indexes you defined in the schema. Querying an index is a lot faster than filtering each record individually. As a basic rule, you should always try to reduce the records as much as possible using where clauses and do the remaining filtering using filters.

You can combine where clauses using logical **or**.

Let's add indexes to the shoe collection:

```dart
@Collection()
class Shoe with IsarObject {
  int id;

  @Index()
  int? size;

  String model;

  @Index(composite = ['size'])
  bool isUnisex;
}
```

There are two indexes. The index on `size` allows us to use where clauses like `.sizeEqualTo()`. The composite index on `isUnisex` allows where clauses like `isUnisexSizeEqualTo()`. But also `isUnisexEqualTo()` because you can also use any prefix of an index.

We can now rewrite the query from before that finds unisex shoes in size 46 using the composite index. This query will be a lot faster than the previous one:

```dart
final result = isar.shoes.where().isUnisexSizeEqualTo(true, 46).findAll();
```

Where clauses have two more superpowers: They give you "free" sorting and a super fast distinct operation.

## Sorting

You can define how the results should be sorted when executing the query using the `.sortBy()`, `.sortByDesc()`, `.thenBy()` and `.thenByDesc()` methods.

To find all shoes sorted by model name in acending order and size in descending order:

```dart
final sortedShoes = isar.shoes.where().sortByModel().thenBySizeDesc().findAll();
```

Sorting a lot of results can be an expensive operation. Luckily, we can again use indexes an make our query lighning fast even if we need to sort a million objects.

### Where clause sorting

If you use a single index in your query, the results are already sorted by the index. That's a big deal!

Let's assume we have shoes in sizes `[43, 39, 48, 40, 42, 45]` and we want to find all shoes with a size greater than or equal to `42` and also have them sorted by size:

```dart
final bigShoes = isar.shoes.where().sizeGreaterThan(42, include: true).findAll();
// -> [42, 43, 45, 48]
````

As you can see, the result is sorted by the `size` index. If you want to reverse the sort order, you can set `ascending` to `false`:

```dart
final bigShoesDesc = isar.shoes.where(ascending: false).sizeGreaterThan(42, include: true).findAll();
// -> [48, 45, 43, 42]
```

Sometimes you don't want to use a where clause but still benefit from the implicit sorting. You can use the `any` where clause:

```dart
final shoes = isar.shoes.where().anySize().findAll();
// -> [39, 40, 42, 43, 45, 48]
```

If you use a composite index, the results are sorted by all fields in the index.

**General rule of thumb:** If you need the results to be sorted, consider using an index for that purpose. Especially if you work with offset and limit.



Sometimes it's not possible of useful to use an index for sorting. For such cases, 

## Unique values

To return only unique values, use the distinct predicate. For example, to find out how many different shoe models you have in your Isar database:

```dart
RealmResults<Person> unique = realm.where(Person.class).distinct("name").findAll();
You can only call distinct on integer and string fields; other field types will throw an exception. As with sorting, you can specify multiple fields.
```

### Where clause distinct

If you have a non unique index, you may want to get all of its distinct values. You could use the `distinctBy` operation but it's performed after sorting and filters so there is some overhead to it.  
If you only use a single where clause you can instead rely on the index to perform the distinct operation.

Another great advantages of indexes is that you get "free" sorting. When you query results using a **single** where clause, the results are sorted by the index. For composite indexes, the result are sorted by all fields in the index.


## Offset & Limit

## Execution order

Isar queries are always executed in the same order:
1. Traverse primary or secondary index to find objects
2. Filter objects
3. Sort results
4. Apply distinct operation
5. Offset & limit results
6. Return results

## Query operations

In the previous examples we used `.findAll()` to retrieve all matching objects. There are more operations available however:

- `.findFirst()` / `findFirstSync()`: Retreive only the first matching object or `null` if none matches.
- `.findAll()` / `findAllSync()`: Retreive all matching objects.
- `.count()` / `countSync()`: Count how many objects match the query.
- `.deleteFirst()` / `.deleteFirstSync()`: Delete the first matching object from the collection.
- `.deleteAll()` / `.deleteAllSync()`: Delete all matching objects from the collection.
- `.build()`: Compile the query to reuse it later.