# -*- coding: utf-8
from __future__ import unicode_literals

from flask import Markup
from jsl.vcs_pages import renderers

import mistune


def markdown(content):
    md = mistune.Markdown(renderer=renderers.VCSMarkdownRender())
    return Markup(md(content))


def html(content):
    return Markup(content)
