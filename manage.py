# -*- coding: utf-8
from __future__ import unicode_literals

from flask.ext import script
from werkzeug.wsgi import DispatcherMiddleware
from jsl import main, api


if __name__ == '__main__':

    def run():
        application = main.create_app()
        application.wsgi_app = DispatcherMiddleware(
            application.wsgi_app, {
                '/api': api.create_app()
            }
        )
        return application

    manager = script.Manager(run)
    manager.run()
