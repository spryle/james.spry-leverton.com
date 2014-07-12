# -*- coding: utf-8
from __future__ import unicode_literals

from jsl import factory
from jsl.main import errors


def create_app(settings_override=None):
    application = factory.create_app(__name__, __path__, settings_override)
    errors.init_app(application)
    return application
