# -*- coding: utf-8
from __future__ import unicode_literals

from functools import wraps
from types import FunctionType
from htmlmin import minify
from datetime import datetime, timedelta
from hashlib import sha1

from flask import current_app, make_response


def add_headers(headers=None):
    headers = headers if headers else {}

    def decorator(func):
        @wraps(func)
        def decorated_function(*args, **kwargs):
            response = make_response(func(*args, **kwargs))
            for header, value in headers.items():
                response.headers[header] = value
            return response
        return decorated_function
    return decorator


def cache_headers(seconds=0, public=True, vary='Accept-Encoding', etag=True):

    def decorator(func):
        @wraps(func)
        def decorated_function(*args, **kwargs):
            response = make_response(func(*args, **kwargs))
            response.cache_control.public = public
            response.cache_control.max_age = seconds
            response.expires = datetime.now() + timedelta(seconds=seconds)
            response.vary = vary
            if etag:
                response.set_etag(sha1(response.data).hexdigest())
            return response
        return decorated_function
    return decorator


def html_minify(func):

    @wraps(func)
    def decorated_function(*args, **kwargs):
        if current_app.config.get('DEBUG'):
            return func(*args, **kwargs)
        else:
            return minify(
                func(*args, **kwargs),
                remove_optional_attribute_quotes=False
            )
    return decorated_function


def memoize_method(func):

    if isinstance(func, FunctionType):
        prefix = '__'
    else:
        prefix = func

    def decorator(method):
        key = '{0}{1}'.format(prefix, method.__name__)

        method._clear = False

        @wraps(method)
        def inner(self, *args, **kwargs):
            if not hasattr(self, key) or getattr(method, '_clear', False):
                setattr(self, key, method(self, *args, **kwargs))
            return getattr(self, key)

        def clear():
            method._clear = True

        inner.clear = clear

        return inner

    if isinstance(func, FunctionType):
        return decorator(func)
    else:
        return decorator
