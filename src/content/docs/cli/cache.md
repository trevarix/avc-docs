---
title: avc cache
description: Manage the diff result cache.
---

AVC caches computed diffs in the database to speed up repeated queries (e.g. re-running `avc diff` on the same snapshot pair, or `avc status` polled by an agent in a loop).

## Subcommands

```bash
avc cache stats    # show cache size and oldest entry
avc cache clear     # delete all cached diff results
```

## `avc cache stats`

```bash
avc cache stats
avc cache stats --json
```

JSON output:

```json
{
  "cached_rows": 42,
  "oldest_at": 1712282400
}
```

## `avc cache clear`

```bash
avc cache clear
avc cache clear --json
```

JSON output:

```json
{
  "cleared": true,
  "success": true
}
```

Clearing the cache never deletes snapshots or objects — it only forces the next diff to be recomputed.
