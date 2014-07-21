# -*- coding: utf-8
from __future__ import unicode_literals

from os.path import join
from www.decorators import memoize_method
from www.content import sequences


class Node(object):

    def __init__(self, node, repo):
        self._node = node
        self._repo = repo

    def __repr__(self):
        return '<{0.__class__.__name__} ({0._node.path})>'.format(self)

    @property
    def name(self):
        return self._node.name

    @property
    def path(self):
        return self._node.path

    @property
    def absolute_path(self):
        return join(self._repo.path, self._node.path)

    @property
    def is_directory(self):
        return self._node.is_dir()

    @property
    def is_file(self):
        return self._node.is_file()


class ChildManager(object):

    def __init__(self, parent):
        self._parent = parent

    @property
    def _list(self):
        children = []
        for node in self._parent._node.nodes:
            if node.is_dir():
                children.append(Directory(node, self._parent._repo))
            if node.is_file():
                children.append(File(node, self._parent._repo))
        return children

    def all(self, *args):
        return sequences.NodeSequence(self._list).all(*args)

    def filter(self, *args):
        return sequences.NodeSequence(self._list).filter(*args)

    def exclude(self, *args):
        return sequences.NodeSequence(self._list).exclude(*args)


class Directory(Node):

    @property
    @memoize_method
    def parent(self):
        if self._node.is_root():
            return None
        else:
            return Directory(self._node.parent, self._repo)

    @property
    @memoize_method
    def children(self):
        from www.content import managers
        return managers.ChildManager(self)

    @property
    def level(self):
        if self._node.is_root():
            return 0
        return len(self.path.split('/'))

    @property
    def is_root(self):
        return self._node.is_root()


class File(Node):

    @property
    @memoize_method
    def directory(self):
        return Directory(self._node.parent, self._repo)

    @property
    def name(self):
        return self._node.name.split('.', 1)[0]

    @property
    def extension(self):
        return self._node.extension

    @property
    def date_added(self):
        try:
            return self._node.history[-1].date
        except AttributeError:
            return None

    @property
    def date_modified(self):
        try:
            return self._node.last_changeset.date
        except AttributeError:
            return None

    def get_content(self, local=False):
        if local:
            with open(self.absolute_path, 'r') as f:
                return f.read()
        else:
            return self._node.content
