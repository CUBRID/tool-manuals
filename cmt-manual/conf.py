# -*- coding: utf-8 -*-

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))
from shared_conf import *

project = u'CUBRID Migration Toolkit'
version = '10.0'
release = '10.0.0'
master_doc = 'index'

html_title = f"CUBRID Migration Toolkit {version} Documentation"

html_theme_options = {
    **html_theme_options,
    "extra_header_link_icons": github_icon("https://github.com/CUBRID/cubrid-migration"),
}

html_static_path = ['_static']
htmlhelp_basename = 'cubrid_migration_toolkit_doc'

simplepdf_vars = {
    **simplepdf_vars,
    'primary': '#22783c',
    'primary-opaque': 'rgba(34, 120, 60, 0.5)',
    'links': '#22783c',
    'cover-bg': '#22783c',
    'cover-overlay': 'rgba(34, 120, 60, 0.7)',
}

latex_documents = [
    ('index', 'cubrid_migration_toolkit.tex', u'CUBRID Migration Toolkit Documentation', u'CUBRID Corporation', 'manual'),
]

man_pages = [
    ('index', 'cubrid_migration_toolkit', u'CUBRID Migration Toolkit Documentation', [u'CUBRID Corporation'], 1)
]

texinfo_documents = [
    ('index', 'cubrid_migration_toolkit', u'CUBRID Migration Toolkit Documentation',
     u'CUBRID Corporation', 'cubrid_migration_toolkit', 'One line description of project.',
     'Miscellaneous'),
]
