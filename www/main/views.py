# -*- coding: utf-8
from __future__ import unicode_literals

from flask import current_app as app
from flask import Blueprint, render_template, abort

from www.content import repository, exceptions
from www.decorators import html_minify, cache_headers
from www.main.parsers import parse
from www.main.serializers import serialize


views = Blueprint('main-views', __name__, static_folder='static')


@views.route('/favicon.ico')
def favicon():
    return render_template('error/404.html'), 404


def get_context(repo, path, filename):
    try:
        return parse(
            repo.find_file(
                path, filename, app.config.get('FILE_PARSERS', {}).keys()),
            local=app.config.get('FILE_READ_LOCAL', False)
        )
    except exceptions.NodeDoesNotExistError:
        return {}


@views.route('/')
@views.route('/<path:path>/')
@cache_headers(seconds=3600)
@html_minify
def index(path=''):
    try:
        repo = repository(app.config.get('CONTENT_ROOT'))
    except exceptions.RepositoryError:
        abort(404)
    try:
        directory = repo.get_directory(path)
    except exceptions.NodeDoesNotExistError:
        abort(404)
    try:
        page = repo.find_file(
            path, 'index', app.config.get('FILE_RENDERERS', {}).keys())
    except exceptions.NodeDoesNotExistError:
        page = None
    else:
        page.context = get_context(repo, path, '.index')
    return render_template(
        'index.html',
        index=serialize(directory),
        page=serialize(page)
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
            path, name, app.config.get('FILE_RENDERERS', {}).keys())
    except exceptions.NodeDoesNotExistError:
        abort(404)
    else:
        page.context = get_context(repo, path, '.' + name)
    return render_template(
        'file.html',
        index=serialize(directory),
        page=serialize(page)
    )
