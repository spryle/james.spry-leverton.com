# -*- coding: utf-8
from __future__ import unicode_literals

from functools import wraps
from types import FunctionType

from flask import make_response


def add_response_headers(headers={}):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            resp = make_response(f(*args, **kwargs))
            h = resp.headers
            for header, value in headers.items():
                h[header] = value
            return resp
        return decorated_function
    return decorator


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
