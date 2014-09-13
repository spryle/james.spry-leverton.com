# -*- coding: utf-8
from __future__ import unicode_literals

from flask import current_app as app
from flask import Blueprint, render_template, abort, redirect

from www.content import repository, exceptions
from www.decorators import html_minify, cache_headers
from www.main.serializers import serialize


views = Blueprint(
    'main-views',
    __name__,
    subdomain='james',
    static_folder='static'
)


@views.route('/browserconfig.xml')
def browser_config(extension):
    return redirect(
        app.config.get('MEDIA_URL') + 'browserconfig.xml' + extension
    )


@views.route('/favicon.<extension>')
def favicon(extension):
    return redirect(app.config.get('MEDIA_URL') + 'favi.' + extension)


@views.route('/')
@views.route('/<path:path>/')
@cache_headers(seconds=3600)
@html_minify
def index(path=''):
    try:
        assert app.config.get('CONTENT_ROOT', None), 'No CONTENT_ROOT'
        repo = repository(app.config.get('CONTENT_ROOT'))
    except exceptions.RepositoryError:
        abort(404)
    try:
        directory = repo.get_directory(path)
    except exceptions.NodeDoesNotExistError:
        abort(404)
    try:
        page = repo.find_file(
            path,
            'index',
            app.config.get('FILE_RENDERERS', {}).keys()
        )
    except exceptions.NodeDoesNotExistError:
        page = None

    return render_template(
        'index.html',
        index=serialize(directory, config=app.config),
        page=serialize(page, config=app.config)
    )


@views.route('/<name>')
@views.route('/<path:path>/<name>')
@cache_headers(seconds=3600)
@html_minify
def file(name, path=''):
    try:
        repo = repository(app.config.get('CONTENT_ROOT'))
    except exceptions.RepositoryError:
        abort(404)
    try:
        directory = repo.get_directory(path)
    except exceptions.NodeDoesNotExistError:
        directory = None
    try:
        page = repo.find_file(
            path,
            name,
            app.config.get('FILE_RENDERERS', {}).keys()
        )
    except exceptions.NodeDoesNotExistError:
        abort(404)

    return render_template(
        'file.html',
        index=serialize(directory, config=app.config),
        page=serialize(page, config=app.config)
    )
