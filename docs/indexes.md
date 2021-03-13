---
id: indexes
title: Indexes
---

## String indexes

There are two additional settings for string indexes: `indexType` and `caseSensitive`.

### String index type

You already know that indexes store a copy of the indexed field with a pointer to the original object. That's fine for primitive types like numbers because they don't use a lot of space and are fast to compare.