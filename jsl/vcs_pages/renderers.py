# -*- coding: utf-8
from __future__ import unicode_literals

from collections import defaultdict
from pygments import highlight
from pygments.lexers import get_lexer_by_name
from pygments.formatters import HtmlFormatter

import mistune


class VCSMarkdownRender(mistune.Renderer):

    def __init__(self, *args, **kwargs):
        self.count = defaultdict(int)
        return super(VCSMarkdownRender, self).__init__(*args, **kwargs)

    def block_code(self, code, lang):
        if not lang:
            return '\n<pre><code>{0}</code></pre>\n'.format(
                mistune.escape(code))
        lexer = get_lexer_by_name(lang, stripall=True)
        formatter = HtmlFormatter()
        return highlight(code, lexer, formatter)

    def paragraph(self, text):
        p = '<p id="p-{0}">{1}</p>'.format(self.count['p'], text)
        self.count['p'] += 1
        return p

    def header(self, text, level, raw=None):
        tag = 'h{0}'.format(level)
        h = '<{0} id="h{1}-{2}">{3}</{0}>'.format(
            tag,
            level,
            self.count[tag],
            text
        )
        self.count[tag] += 1
        return h

    def list(self, body, ordered=True):
        tag = 'ol' if ordered else 'ul'
        l = '<{0} id="{0}-{1}">{2}</{0}>'.format(tag, self.count[tag], body)
        self.count[tag] += 1
        return l
