import importlib
import functools
import types


def import_from_string(val):
    """
    Attempt to import a class from a string representation.
    """
    try:
        # Nod to tastypie's use of importlib.
        parts = val.split('.')
        module_path, class_name = '.'.join(parts[:-1]), parts[-1]
        module = importlib.import_module(module_path)
        return getattr(module, class_name)
    except ImportError as exc:
        format = "Could not import '%s' for pages setting pages. %s."
        msg = format % (val, exc)
        raise ImportError(msg)


def memoize_method(func):

    if isinstance(func, types.FunctionType):
        prefix = '__'
    else:
        prefix = func

    def decorator(method):
        key = '{0}{1}'.format(prefix, method.__name__)

        method._clear = False

        @functools.wraps(method)
        def inner(self, *args, **kwargs):
            if not hasattr(self, key) or getattr(method, '_clear', False):
                setattr(self, key, method(self, *args, **kwargs))
            return getattr(self, key)

        def clear():
            method._clear = True

        inner.clear = clear

        return inner

    if isinstance(func, types.FunctionType):
        return decorator(func)
    else:
        return decorator
