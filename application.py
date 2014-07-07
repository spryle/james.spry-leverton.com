from flask import Flask
from pages import app as pages
import config
import views
import errors


def application_factory(name=None):
    name = name or __name__
    application = Flask(name)
    application.config.from_object(config)
    application.config.from_envvar('CONFIG', silent=True)
    views.configure(application)
    errors.configure(application)
    application.register_blueprint(pages)
    return application
