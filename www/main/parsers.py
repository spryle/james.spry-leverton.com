# -*- coding: utf-8
from __future__ import unicode_literals

from flask import current_app as app
from www.utils import import_from_string


def parsable(node, parsers):
    return node.extension in parsers


def parser(extension, parsers):
    return import_from_string(parsers.get(extension))


def parse(node, default=None, parsers=None, local=False):
    default = default if default else {}
    parsers = parsers if parsers else app.config.get('FILE_PARSERS')
    return parser(node.extension, parsers)(
        node.get_content(local=local)
    ) if parsable(node, parsers) else default
