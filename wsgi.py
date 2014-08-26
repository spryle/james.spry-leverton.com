# -*- coding: utf-8
from __future__ import unicode_literals

from werkzeug.serving import run_simple

import manage


if __name__ == "__main__":
    run_simple(
        '0.0.0.0',
        5000,
        manage.build_application(),
        use_reloader=True,
        use_debugger=True
    )
