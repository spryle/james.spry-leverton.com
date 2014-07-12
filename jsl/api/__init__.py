# -*- coding: utf-8
from __future__ import unicode_literals

from flask.ext.api import FlaskAPI

from jsl import factory


def create_app(settings_override=None):

    application = factory.create_app(
        __name__,
        __path__,
        settings_override,
        application_class=FlaskAPI)

    return application
