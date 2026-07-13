---
title: avc verify
description: Verify stored history is intact — re-hash every stored object.
---

Re-hashes every stored file version in `.avc/objects/` and reports any whose content no longer matches its content-addressed filename — disk corruption, tampering, or a torn write. Exits non-zero when corruption is found, so `avc verify` can gate CI or a backup pipeline.

`avc fsck` is a built-in alias for the same command.

## Usage

```bash
avc verify              # audit every object
avc verify --repair     # quarantine corrupt objects to .avc/corrupt/
avc verify --json
```

## Flags

| Flag | Description |
|------|-------------|
| `--repair` | Move corrupt objects to `.avc/corrupt/` so nothing dedupes against or restores from them |
| `--json` | JSON output |

## Output

A healthy store:

```
✓ All 1204 object(s) verified intact.
```

A damaged store:

```
✗ 1 of 1204 object(s) are CORRUPT:
  ! ab12cd34...
      damages snapshot snap-abc123
```

With `--repair`, each corrupt object is moved to `.avc/corrupt/` and the affected snapshots are listed so you know which history is damaged.

## JSON output

```json
{
  "scanned_objects": 1204,
  "corrupt": [
    {
      "hash": "ab12cd34...",
      "quarantined_to": ".avc/corrupt/ab12cd34...",
      "affected_snapshots": ["snap-abc123"]
    }
  ]
}
```

## Why verification isn't on the hot path

Restores and diffs deliberately do **not** re-hash objects — that would double read cost. `avc verify` is the explicit audit tool; run it periodically, before a backup, or in CI. See [Concepts → Storage](/concepts/storage/) for the on-disk object format.
