---
id: queries
title: Queries
---

Querying is how you find records that match certain conditions, for example:

- Find all starred contacts
- Find distinct first names in contacts
- Delete all contacts that don't have a last name defined

Because queries are executed on the database, and not in Dart, they're really fast. When cleverly use indexes, you can improve the query performance even further. In the following, you'll learn how to write queries and how you can make them as fast as possible.

## Filters
There are two different methods of filtering your records with a query Filters and Where Clausess. Filters are easy to use and understand. Depending on the type of your properties, there are different filters available most of which have self-explanatory names. Basic examples are `.equalTo()`, `.greaterThan()`, `.startsWith()` etc. Filters have no effect on the ordering of the results.

Let's start with an example to easily understand filters:

```dart
@Collection()
class Shoe with IsarObject {
    String modelName;

    int size;

    bool isUnisex;
}
```

When you want to find all shoes with size 46, you can use the following query:

```dart
final result = isar.shoes.where().filter().sizeEqualTo(46).findAll();
```

It is possible to combine multiple filters using logical **and** `.and()` and logical **or** `.or()`.
```dart
final result = isar.shoes.where().filter()
  .sizeEqualTo(46)
  .and()          // Optional. Filters are implicitly combined with logical and.
  .isUnisex()
  .findAll();
```

You can also group conditions using beginGroup and endGroup to specify order of evaluation:
```dart
final result = final result = isar.shoes.where().filter()
  .sizeBetween(43, 46)
  .beginGroup()
    .modelNameContains('Crocs')
    .or()
    .isNotUnisex()
  .endGroup()
  .findAll()
```


## Where clauses
Where clauses are a very powerful tool but it can be a little difficult to get them right.

In contrast to filters where clauses use the indexes you defined in the schema. Querying an index is a lot faster than filtering each record individually. As a basic rule, you should always try to reduce the records as much as possible using where clauses and do the remaining filtering using filters.

You can combine where clauses using logical **or**.

Let's add indexes to the shoe collection:

```dart
@Collection()
class Shoe with IsarObject {
    String modelName;

    @Index()  
    int size;

    @Index(composite = ['size'])
    bool isUnisex;
}
```

There are two indexes. The index on `size` allows us to use where clauses like `.sizeEqualTo()`. The composite index on `isUnisex` allows where clauses like `isUnisexSizeEqualTo()`. But also `isUnisexEqualTo()` because you can also use a prefix of an index.

We can now rewrite the query from before that finds unisex shoes in size 46 using the composite index. This query will be a lot faster than the previous one:

```dart
final result = isar.shoes.where().isUnisexSizeEqualTo(true, 46).findAll();
```

Another great advantages of indexes is that you get "free" sorting. When you query results using a **single** where clause, the results are sorted by the index. For composite indexes, the result are sorted by all fields in the index.

### Sorted by

Since sorting is very expensive operation, you should always consider using an index for sorting. When you do not use a where clause, you can use the `.sortedBy()` method instead to sort using an index.

Here you can see the three ways to sort your query results:

```dart
final r1 = isar.shoes.where().sizeGreaterThan(40).findAll();  // sorted by size index (FAST)

final r2 = isar.shoes.where().sortedBySize().findAll();       // sorted by size index (FAST)

final r3 = isar.shoes.where().sortBySize().findAll();         // sorted without index (SLOW)
```

:::info
Mind the difference between the `.sortBy()` and `.sortedBy()` methods. They look similar but have a huge difference in performance.
:::