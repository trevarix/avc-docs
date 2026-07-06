---
title: avc gc
description: Garbage-collect unreferenced objects from the object store.
---

Scans `.avc/objects/` and identifies blobs no longer referenced by any snapshot — typically left behind after deleting branches or snapshots.

By default this is a **dry run**: it reports what would be deleted without removing anything.

## Usage

```bash
avc gc          # preview what would be removed
avc gc --run    # delete and reclaim disk space
avc gc --json
```

## Flags

| Flag | Description |
|------|-------------|
| `--run` | Actually delete unreferenced objects (default is dry-run) |
| `--json` | JSON output |

## JSON output

```json
{
  "scanned_objects": 1204,
  "deleted_objects": 37,
  "bytes_reclaimed": 4423680,
  "dry_run": true
}
```

## Typical workflow

```bash
avc branch delete feat-old-experiment
avc gc          # see what's now unreferenced
avc gc --run    # actually reclaim the space
```

Object content is never modified — `avc gc` only removes blobs that no snapshot, on any branch, points to. See [Concepts → Storage](/concepts/storage/) for how the content-addressed object store works.
