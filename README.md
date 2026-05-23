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

From the repository root, set up a virtual environment once:

```bash
python3 -m venv venv
./venv/bin/pip install -r requirements.txt
```

Then build the manual you need (replace `ca-manual` with `cmt-manual` for the other):

```bash
./venv/bin/python -m sphinx -b html -d ca-manual/_build/doctrees ca-manual ca-manual/_build/html
```

The HTML output is written to `<manual>/_build/html/`.
