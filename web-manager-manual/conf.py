# -*- coding: utf-8 -*-

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))
from shared_conf import *

project = u'CUBRID Web Manager'
version = 'beta'
release = 'beta'
master_doc = 'index'

html_title = f"CUBRID Web Manager {version} Documentation"

html_theme_options = {
    **html_theme_options,
    "extra_header_link_icons": github_icon("https://github.com/CUBRID/cubrid-webmanager"),
}

html_static_path = ['_static', 'images']
htmlhelp_basename = 'cubrid_webmanager_doc'

simplepdf_vars = {
    **simplepdf_vars,
    'primary': '#1a5096',
    'primary-opaque': 'rgba(26, 80, 150, 0.5)',
    'links': '#1a5096',
    'cover-bg': '#1a5096',
    'cover-overlay': 'rgba(26, 80, 150, 0.7)',
}

latex_documents = [
    ('index', 'cubrid_webmanager.tex', u'CUBRID Web Manager Documentation', u'CUBRID Corporation', 'manual'),
]

man_pages = [
    ('index', 'cubrid_webmanager', u'CUBRID Web Manager Documentation', [u'CUBRID Corporation'], 1)
]

texinfo_documents = [
    ('index', 'cubrid_webmanager', u'CUBRID Web Manager Documentation',
     u'CUBRID Corporation', 'cubrid_webmanager', 'One line description of project.',
     'Miscellaneous'),
]
