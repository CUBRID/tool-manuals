# tool-manuals

Documentation for CUBRID tools.

## Manuals

| Directory | Project |
|---|---|
| `ca-manual` | CUBRID Admin |
| `cmt-manual` | CUBRID Migration Toolkit |

## Prerequisites

- Python 3.14 (install the `venv` module separately if it is not bundled)
- System packages for WeasyPrint: `pango`, `cairo`, `gdk-pixbuf2`

## Build

From the manual directory you want to build (`ca-manual` or `cmt-manual`):

```bash
python3 -m venv venv
./venv/bin/pip install -r requirements.txt
./venv/bin/python -m sphinx -b html -d _build/doctrees . _build/html
```

The HTML output is written to `_build/html/`.
