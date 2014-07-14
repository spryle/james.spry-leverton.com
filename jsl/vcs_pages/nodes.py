# -*- coding: utf-8
from __future__ import unicode_literals

from email.utils import parseaddr
from flask import current_app, request
from jsl.vcs_pages.utils import import_from_string, memoize_method

import re
import os
import hashlib


class Node(object):

    def __init__(self, node):
        self.node = node

    def __repr__(self):
        return 'Node({.path})'.format(self)

    def __eq__(self, other):
        if type(other) is type(self):
            return self.path == other.path
        raise NotImplemented

    def __ne__(self, other):
        return not self.__eq__(other)

    def __hash__(self):
        return hash(self.__repr__())

    @property
    def config(self):
        return {
            'repo':
                current_app.config['PAGES_CONTENT_REPO'],
            'read_local':
                current_app.config.get('PAGES_READ_LOCAL', False),
            'renderers':
                current_app.config.get('PAGES_RENDERERS', {}),
            'parsers':
                current_app.config.get('PAGES_PARSERS', {}),
            'hidden_files':
                current_app.config.get('PAGES_HIDDEN_FILES', []),
            'hidden_directories':
                current_app.config.get('PAGES_HIDDEN_DIRECTORIES', []),
            'excluded_files':
                current_app.config.get('PAGES_EXCLUDED_FILES', []),
            'excluded_directories':
                current_app.config.get('PAGES_EXCLUDED_DIRECTORIES', []),
            'context_regex':
                current_app.config['PAGES_CONTEXT_REGEX'],

        }

    @property
    @memoize_method
    def parent(self):
        if self.node.is_root():
            return None
        else:
            return Node(self.node.parent)

    @property
    @memoize_method
    def children(self):
        return [node for node in [
            Node(n) for n in self.node.nodes
        ] if node.is_directory or node.is_file and node.is_renderable]

    @property
    @memoize_method
    def nodes(self):
        return [Node(n) for n in self.node.nodes]

    @property
    @memoize_method
    def context(self):
        context = {
            'name': self.name,
            'path': self.path,
            'date_added': self.date_added,
            'date_modified': self.date_modified,
        }
        if self.context_node:
            context.update(self.context_node.parse())
        return context

    @property
    @memoize_method
    def context_node(self):
        if not self.parent:
            return None
        for node in self.parent.nodes:
            result = re.match(self.config.get('context_regex'), node.full_name)
            if result and result.group('name') == self.name:
                return node
        return None

    @property
    def is_hidden(self):
        if self.is_file:
            return self.name in self.config.get('hidden_files', [])
        elif self.is_directory:
            return self.name in self.config.get('hidden_directories', [])
        return False

    @property
    def is_excluded(self):
        if self.is_file:
            return self.name in self.config.get('excluded_files', [])
        elif self.is_directory:
            return self.name in self.config.get('excluded_directories', [])
        return False

    @property
    def is_renderable(self):
        if self.is_file:
            return (
                self.extension in self.config.get('renderers', [])
                and not self.is_excluded)
        else:
            return False

    @property
    def is_parseable(self):
        if self.node.is_file():
            return self.extension in self.config.get('parsers', [])
        else:
            return not self.is_excluded

    @property
    def is_indexable(self):
        if self.is_file:
            return self.is_renderable and not self.is_hidden
        else:
            return not self.is_hidden

    @property
    def is_file(self):
        return self.node.is_file()

    @property
    def is_directory(self):
        return self.node.is_dir()

    @property
    def is_current_page(self):
        if self.name == 'index':
            return False
        return request.path == self.path

    @property
    def name(self):
        if self.node.is_file():
            return self.node.name.split('.', 1)[0]
        else:
            return self.node.name

    @property
    def full_name(self):
        return self.node.name

    @property
    def title(self):
        return self.context.get('title', self.name)

    @property
    def author_name(self):
        return parseaddr(self.context.get('author', ''))[0]

    @property
    def author_email(self):
        return parseaddr(self.context.get('author', ''))[1]

    @property
    def author_hash(self):
        return hashlib.md5(self.author_email.encode('utf-8')).hexdigest()

    @property
    def date_added(self):
        if hasattr(self.node, 'history'):
            return self.node.history[-1].date
        return None

    @property
    def date_modified(self):
        if hasattr(self.node, 'last_changeset'):
            return self.node.last_changeset.date
        return None

    @property
    def full_path(self):
        return self.config.get('repo') + self.node.path

    @property
    def content(self):
        if self.config.get('read_local'):
            with open(self.full_path, 'r') as f:
                return f.read()
        else:
            return self.node.content

    @property
    def path(self):
        if self.node.is_file():
            path = self.node.path.split('.', 1)[0]
            if self.name == 'index':
                path = ''.join(path.rsplit('index', 1))
            return os.path.join('/', path)
        else:
            if self.node.is_root():
                return '/'
            return os.path.join('/', self.node.path) + '/'

    @property
    def extension(self):
        if not self.node.is_file():
            return None
        return self.node.extension

    @property
    def parser(self):
        import_path = self.config.get('parsers', {}).get(self.extension, None)
        if not import_path:
            return None
        return import_from_string(import_path)

    @property
    def renderer(self):
        import_path = self.config.get(
            'renderers', {}
        ).get(self.extension, None)
        if not import_path:
            return None
        return import_from_string(import_path)

    def parse(self):
        if self.is_parseable:
            return self.parser(self.content)
        else:
            return {}

    def render(self):
        if self.is_renderable:
            return self.renderer(self.content)
        else:
            return ''

    def get_page(self, filename):
        for child in self.children:
            if child.name == filename:
                return child
        return None
