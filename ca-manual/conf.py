# -*- coding: utf-8 -*-

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))
from shared_conf import *

project = u'CUBRID Admin'
version = '10.0'
release = '10.0.0'
master_doc = 'ca/index'

html_title = f"CUBRID Admin {version} Documentation"

html_theme_options = {
    **html_theme_options,
    "extra_header_link_icons": github_icon("https://github.com/CUBRID/cubrid-manager"),
}

html_static_path = ['_static', 'images']
htmlhelp_basename = 'cubrid_admin_doc'

latex_documents = [
    ('ca/index', 'cubrid_admin.tex', u'CUBRID Admin Documentation', u'CUBRID Corparation', 'manual'),
]

man_pages = [
    ('ca/index', 'cubrid_admin', u'CUBRID Admin Documentation', [u'CUBRID Corparation'], 1)
]

texinfo_documents = [
    ('ca/index', 'cubrid_admin', u'CUBRID Admin Documentation',
     u'CUBRID Corparation', 'cubrid_admin', 'One line description of project.',
     'Miscellaneous'),
]
