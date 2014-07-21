# -*- coding: utf-8
from __future__ import unicode_literals

from fnmatch import fnmatch


class NodeSequence(tuple):

    def all(self, *args, **kwargs):
        return self

    def filter(self, *args):
        globs = set(args)
        return NodeSequence([
            node for node in self
            if all(map(
                lambda x: fnmatch(node._node.name, x), globs
            ))
        ])

    def exclude(self, *args):
        globs = set(args)
        return NodeSequence([
            node for node in self
            if all(map(
                lambda x: not fnmatch(node._node.name, x), globs
            ))
        ])

    def directories(self):
        return NodeSequence([
            node for node in self if node.is_directory
        ])

    def files(self):
        return NodeSequence([
            node for node in self if node.is_file
        ])
