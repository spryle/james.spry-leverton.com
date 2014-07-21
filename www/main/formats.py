# -*- coding: utf-8
from __future__ import unicode_literals

from flask import Markup
from collections import defaultdict
from pygments import highlight
from pygments.lexers import get_lexer_by_name
from pygments.formatters import HtmlFormatter
from mistune import Renderer, Markdown, escape


TAG_TEMPLATE = '<{tag} id="{tag}-{count}">{content}</{tag}>'


class MarkdownRender(Renderer):

    def __init__(self, *args, **kwargs):
        self.count = defaultdict(int)
        return super(MarkdownRender, self).__init__(*args, **kwargs)

    def block_code(self, code, lang):
        if not lang:
            return '<pre><code>{0}</code></pre>'.format(escape(code))
        lexer = get_lexer_by_name(lang, stripall=True)
        formatter = HtmlFormatter()
        return highlight(code, lexer, formatter)

    def paragraph(self, text):
        tag = 'p'
        try:
            return TAG_TEMPLATE.format(
                tag=tag,
                count=self.count[tag],
                content=text
            )
        finally:
            self.count[tag] += 1

    def header(self, text, level, raw=None):
        tag = 'h{0}'.format(level)
        try:
            return TAG_TEMPLATE.format(
                tag=tag,
                count=self.count[tag],
                content=text
            )
        finally:
            self.count[tag] += 1

    def list(self, body, ordered=True):
        tag = 'ol' if ordered else 'ul'
        try:
            return TAG_TEMPLATE.format(
                tag=tag,
                count=self.count[tag],
                content=body
            )
        finally:
            self.count[tag] += 1


def markdown(content):
    md = Markdown(renderer=MarkdownRender())
    return Markup(md(content))


def html(content):
    return Markup(content)
