import pkgutil
import importlib

from flask import Blueprint, Flask


def register_blueprints(app, package_name, package_path):

    rv = []
    for _, name, _ in pkgutil.iter_modules(package_path):
        m = importlib.import_module('%s.%s' % (package_name, name))
        for item in dir(m):
            item = getattr(m, item)
            if isinstance(item, Blueprint):
                app.register_blueprint(item)
            rv.append(item)
    return rv


def create_app(
        package_name,
        package_path,
        settings_override=None,
        application_class=Flask):

    application = application_class(package_name)

    application.config.from_object('config')
    application.config.from_envvar('CONFIG')
    application.config.from_object(settings_override)

    register_blueprints(application, package_name, package_path)

    return application
