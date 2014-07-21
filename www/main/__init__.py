# -*- coding: utf-8
from __future__ import unicode_literals

from www import factory
from www.main import errors
from www.encoders import UnixTimeEncoder


def build_app(settings_override=None):
    application = factory.build(__name__, __path__, settings_override)
    application.json_encoder = UnixTimeEncoder
    errors.init_app(application)
    return application
