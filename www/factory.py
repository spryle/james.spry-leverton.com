# -*- coding: utf-8
from __future__ import unicode_literals

from os.path import abspath
from flask import Blueprint, Flask
from flask.ext.collect import Collect
from pkgutil import iter_modules
from importlib import import_module


EXTENSIONS = [
    Collect
]


def register_blueprints(app, package_name, package_path):

    rv = []
    for _, name, _ in iter_modules(package_path):
        m = import_module('%s.%s' % (package_name, name))
        for item in dir(m):
            item = getattr(m, item)
            if isinstance(item, Blueprint):
                app.register_blueprint(item)
            rv.append(item)
    return rv


def install_extensions(application):
    for extension in EXTENSIONS:
        extension(application)
    return application


def build(
        package_name,
        package_path,
        application_class=Flask,
        config=None):

    config = config if config is not None else {}
    application = application_class(
        package_name,
        instance_path=package_path[0],
        instance_relative_config=True,
        static_folder=None,
    )
    application.config.from_object('defaults')
    application.config.from_pyfile('config.py', silent=True)
    application.config.update(config)
    application.static_folder = abspath(
        application.config.get('STATIC_ROOT', application.static_folder)
    )
    register_blueprints(application, package_name, package_path)
    install_extensions(application)
    return application
