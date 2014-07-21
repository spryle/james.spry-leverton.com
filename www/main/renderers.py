# -*- coding: utf-8
from __future__ import unicode_literals

from flask import current_app as app
from www.utils import import_from_string


def renderable(node, renderers):
    return node.extension in renderers


def renderer(extension, renderers):
    return import_from_string(renderers.get(extension))


def render(node, default='', renderers=None, local=False):
    renderers = renderers if renderers else app.config.get('FILE_RENDERERS')
    return renderer(node.extension, renderers)(
        node.get_content(local=local)
    ) if renderable(node, renderers) else default
