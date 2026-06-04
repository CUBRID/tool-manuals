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
source venv/bin/activate
pip install -r requirements.txt
```

Then build a manual (use `cmt-manual` for the other):

```bash
make ca-manual
```

`make html` builds both. The HTML output is written to `<manual>/_build/html/`.

### PDF

```bash
make ca-manual-pdf     # or: make cmt-manual-pdf
```

`make pdf` builds both. The PDF is written to `<manual>/_build/simplepdf/<Project>.pdf`.
