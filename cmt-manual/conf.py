# -*- coding: utf-8 -*-

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))
from shared_conf import *

project = u'CUBRID Migration Toolkit'
version = '10.0'
release = '10.0.0'
master_doc = 'cmt/index'

html_static_path = ['_static']
htmlhelp_basename = 'cubrid_migration_toolkit_doc'

latex_documents = [
    ('cmt/index', 'cubrid_migration_toolkit.tex', u'CUBRID Migration Toolkit Documentation', u'CUBRID Corparation', 'manual'),
]

man_pages = [
    ('cmt/index', 'cubrid_migration_toolkit', u'CUBRID Migration Toolkit Documentation', [u'CUBRID Corparation'], 1)
]

texinfo_documents = [
    ('cmt/index', 'cubrid_migration_toolkit', u'CUBRID Migration Toolkit Documentation',
     u'CUBRID Corparation', 'cubrid_migration_toolkit', 'One line description of project.',
     'Miscellaneous'),
]
