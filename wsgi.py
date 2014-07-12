# -*- coding: utf-8
from __future__ import unicode_literals

from werkzeug.serving import run_simple
from werkzeug.wsgi import DispatcherMiddleware

from jsl import main, api

application = DispatcherMiddleware(
    main.create_app(), {
        '/api': api.create_app()
    }
)

if __name__ == "__main__":
    run_simple(
        '0.0.0.0',
        5000,
        application,
        use_reloader=True,
        use_debugger=True
    )
