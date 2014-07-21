# -*- coding: utf-8
from __future__ import unicode_literals

from vcs import get_repo
from www.content.repository import Repository


__all__ = [
    'repository'
]


def repository(path, alias=None):
    return Repository(get_repo(path=path, alias=alias))
