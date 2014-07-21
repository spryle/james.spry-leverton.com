# -*- coding: utf-8
from __future__ import unicode_literals

from importlib import import_module


def import_from_string(val):
    try:
        parts = val.split('.')
        module_path, class_name = '.'.join(parts[:-1]), parts[-1]
        module = import_module(module_path)
        return getattr(module, class_name)
    except ImportError as exc:
        format = "Could not import '%s' for pages setting pages. %s."
        msg = format % (val, exc)
        raise ImportError(msg)
