# -*- coding: utf-8
from __future__ import unicode_literals

from os.path import join
from www.content import exceptions, nodes


class Repository(object):

    def __init__(self, repo):
        self._repo = repo
        self._changeset = self._repo.get_changeset(None)

    @property
    def branches(self):
        return self._repo.branches

    @property
    def path(self):
        return self._repo.path

    def changeset(self, changeset):
        self._changeset = self._repo.get_changeset(changeset)
        return self

    def find_file(self, directory, filename, extensions=None):
        extensions = [] if extensions is None else extensions
        for extension in extensions:
            try:
                return self.get_file('{0}.{1}'.format(
                    join(directory, filename), extension
                ))
            except exceptions.NodeDoesNotExistError:
                continue
        raise exceptions.NodeDoesNotExistError(
            'Could not find {0}.{1}'.format(
                join(directory, filename), extension))

    def get_file(self, path):
        node = self._changeset.get_node(path)
        if not node.is_file():
            raise exceptions.NodeError('Path must locate a file.')
        return nodes.File(node, self)

    def get_directory(self, path):
        node = self._changeset.get_node(path)
        if not node.is_dir():
            raise exceptions.NodeError('Directory must locate a file.')
        return nodes.Directory(node, self)
