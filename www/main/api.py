# -*- coding: utf-8
from __future__ import unicode_literals

from httplib import responses
from flask import current_app as app
from flask import Blueprint, jsonify
from www.content import repository, exceptions
from www.main.parsers import parse
from www.main.serializers import serialize
from www.main.exceptions import ApiError
from www.decorators import add_headers, cache_headers


api = Blueprint('main-api', __name__, subdomain='api')


def abort(status_code):
    raise ApiError(responses.get(status_code, ''), status_code=status_code)


def get_context(repo, path, filename):
    try:
        return parse(
            repo.find_file(
                path, filename,  app.config.get('FILE_PARSERS', {}).keys()),
            local=app.config.get('FILE_READ_LOCAL', False)
        )
    except exceptions.NodeDoesNotExistError:
        return {}


@api.route('/')
@api.route('/<path:path>/')
@add_headers({'Access-Control-Allow-Origin': '*'})
@cache_headers(seconds=3600)
def index(path=''):
    try:
        repo = repository(app.config.get('CONTENT_ROOT'))
    except exceptions.RepositoryError:
        abort(404)
    try:
        directory = repo.get_directory(path)
    except exceptions.NodeDoesNotExistError:
        abort(404)
    return jsonify(serialize(directory))


@api.route('/<name>')
@api.route('/<path:path>/<name>')
@add_headers({'Access-Control-Allow-Origin': '*'})
@cache_headers(seconds=3600)
def file(name, path=''):
    try:
        repo = repository(app.config.get('CONTENT_ROOT'))
    except exceptions.RepositoryError:
        abort(404)
    try:
        page = repo.find_file(
            path, name, app.config.get('FILE_RENDERERS', {}).keys())
    except exceptions.NodeDoesNotExistError:
        abort(404)
    else:
        page.context = get_context(repo, path, '.' + name)
    return jsonify(serialize(page))
