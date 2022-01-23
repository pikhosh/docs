---
title: Multi-Isolate usage
---

# Multi-Isolate usage

Instead of threads, all Dart code runs inside of isolates. Each isolate has its own memory heap, ensuring that none of the state in an isolate is accessible from any other isolate.

Isar can be accessed from multiple isolates at the same time and even watchers work across isolates. In this recipe we will check out how to use Isar in a multi-isolate environment.

## When to use multiple isolates

Isar transactions are executed in parallel even if they run in the same isolate. In some cases it is still beneficial to access Isar from multiple isolates.

The reason is that Isar spends quite some time on encoding and decoding data from and to Dart objects. You can think of it like encoding and decoding JSON (just more efficient). These operations run inside the isolate from which the data is accessed and naturally block other code in the isolate.

If you only need to read or write up to a few thousand objects at once, it is probably fine to do it in the UI isolate. But if you have big transactions or the UI thread is already busy, you should consider using a separate isolate.

## Example

