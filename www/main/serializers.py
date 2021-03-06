# -*- coding: utf-8
from __future__ import unicode_literals

from flask import url_for
from inspect import isclass
from os.path import split, splitext, join
from email.utils import parseaddr
from functools import wraps, WRAPPER_ASSIGNMENTS
from hashlib import md5
from urlparse import urlparse
from www.main.renderers import render
from www.main.parsers import parse
from www.content import exceptions
from www.decorators import memoize_method
from www.utils import ordinal_suffix


def available_attrs(fn):
    return tuple(a for a in WRAPPER_ASSIGNMENTS if hasattr(fn, a))


class Serializer(object):

    def __init__(self, target, config, *args, **kwargs):
        self.object = target
        self.config = config

    def to_dict(self, fields=None, exclude=None):
        if self.object is None:
            return None
        result = {}
        fields = fields if fields is not None else []
        exclude = exclude if exclude is not None else []
        for method_name in dir(self):
            if fields and method_name not in fields:
                continue
            if exclude and method_name in exclude:
                continue
            if method_name[:2] == '__' and method_name[-2:] == '__':
                continue
            method = getattr(self, method_name)
            if getattr(method, 'is_serializer', False):
                value = method()
                if isinstance(value, dict):
                    result.update(value)
                    continue
                if value is not None:
                    result.update({method_name: value})
                    continue
            try:
                if isclass(method) and issubclass(method, Serializer):
                    result.update({
                        method_name: method(
                            self.object,
                            config=self.config
                        ).to_dict()
                    })
            except TypeError:
                continue
        return result


def serializer(*formatters):

    def decorator(contained):
        contained.is_serializer = True

        @wraps(contained, assigned=available_attrs(contained))
        def wrapper(self, *args, **kwargs):
            result = contained(self, *args, **kwargs)
            if result is None:
                return result
            for formatter in formatters:
                result = formatter(result)
            return result
        return wrapper
    return decorator


class NodeSerializer(Serializer):

    @serializer()
    def name(self):
        excluded = set(['of', 'the', 'and', 'a'])
        return self.object.name[0].upper() + ' '.join(
            w.title() if w not in excluded else w
            for w in self.object.name.split('-')
        )[1:] if self.object.name else ''

    @serializer()
    def title(self):
        return self.context.get('title', self.name())

    @serializer()
    def slug(self):
        return self.object.name

    @serializer()
    def is_directory(self):
        return self.object.is_directory

    @serializer()
    def is_file(self):
        return self.object.is_file

    @serializer()
    def path(self):
        path = (
            self.object.path if self.object.is_file
            else join(self.object.path, ''))
        path, filename = split(path)
        name, extension = splitext(filename)
        if self.object.is_directory:
            return urlparse(
                url_for('main-views.index', path=path)
            ).path
        if self.object.is_file:
            return urlparse(
                url_for('main-views.file', path=path, name=name)
            ).path
        return None

    @property
    @memoize_method
    def context(self):
        try:
            path = (
                self.object.path if self.object.is_file
                else join(self.object.path, ''))
            path, _ = split(path)
            node = self.object._repo.find_file(
                path,
                '.' + self.object.name if self.object.is_file else '.index',
                self.config.get('FILE_PARSERS', {}).keys()
            )
            return parse(
                node,
                local=self.config.get('FILE_READ_LOCAL', False)
            )
        except exceptions.NodeDoesNotExistError:
            return {}


class BaseDirectorySerializer(NodeSerializer):

    @serializer()
    def level(self):
        return self.object.level


class ParentDirectorySerializer(BaseDirectorySerializer):

    def __init__(self, target, *args, **kwargs):
        super(
            ParentDirectorySerializer, self
        ).__init__(target, *args, **kwargs)
        if self.object.parent:
            self.object = self.object.parent
        else:
            self.object = None


class DirectorySerializer(BaseDirectorySerializer):

    class parent(ParentDirectorySerializer):
        pass

    @serializer()
    def children(self):
        return [
            NodeSerializer(child, config=self.config).to_dict() for
            child in self.object.children.filter(
                *self.config.get('DIRECTORY_FILTER', [])
            ).exclude(
                *self.config.get('DIRECTORY_EXCLUDE', [])
            )
        ]


class FileSerializer(NodeSerializer):

    @property
    @memoize_method
    def _author(self):
        return parseaddr(self.context.get('author', ''))

    @serializer()
    def author_name(self):
        return self._author[0] if self._author[0] else None

    @serializer()
    def author_email(self):
        return self._author[1] if self._author[1] else None

    @serializer()
    def author_hash(self):
        return md5(
            self._author[1].encode('utf-8')
        ).hexdigest() if self._author[1] else None

    @serializer()
    def date_added(self):
        return self.object.date_added

    @serializer()
    def date_added_formatted(self):
        return '{0} {1}'.format(
            ordinal_suffix(self.object.date_added.day),
            self.object.date_added.strftime('%b %Y')
        )

    @serializer()
    def date_modified(self):
        return self.object.date_modified

    @serializer()
    def date_modified_formatted(self):
        return '{0} {1}'.format(
            ordinal_suffix(self.object.date_modified.day),
            self.object.date_modified.strftime('%b %Y')
        )

    @serializer()
    def content(self):
        return render(
            self.object,
            local=self.config.get('FILE_READ_LOCAL', False)
        )

    @serializer()
    def context_data(self):
        return self.context


def serialize(node, default=None, config=None, fields=None, exclude=None):
    config = config if config else {}
    if not node:
        return default
    if node.is_directory:
        return DirectorySerializer(node, config).to_dict(
            fields=fields,
            exclude=exclude
        )
    elif node.is_file:
        return FileSerializer(node, config).to_dict(
            fields=fields,
            exclude=exclude
        )
    return ValueError('Node is not a directory or file.')
