# -*- coding: utf-8
from __future__ import unicode_literals

from httplib import responses
from flask import current_app as app
from flask import Blueprint, jsonify, request
from www.content import repository, exceptions
from www.main.serializers import serialize
from www.main.exceptions import ApiError
from www.decorators import add_headers, cache_headers


api = Blueprint('main-api', __name__, subdomain='api')


def abort(status_code):
    raise ApiError(responses.get(status_code, ''), status_code=status_code)


@api.route('/')
@api.route('/<path:path>/')
@add_headers({'Access-Control-Allow-Origin': '*'})
@cache_headers(seconds=21600)
def index(path=''):
    branch = request.args.get('branch', app.config.get('BRANCHES_DEFAULT'))
    if branch not in app.config.get('BRANCHES_PUBLIC'):
        abort(403)
    try:
        repo = repository(app.config.get('CONTENT_ROOT')).changeset(branch)
    except exceptions.RepositoryError:
        abort(404)
    try:
        directory = repo.get_directory(path)
    except exceptions.NodeDoesNotExistError:
        abort(404)
    return jsonify(serialize(directory, config=app.config))


@api.route('/<name>')
@api.route('/<path:path>/<name>')
@add_headers({'Access-Control-Allow-Origin': '*'})
@cache_headers(seconds=21600)
def file(name, path=''):
    branch = request.args.get('branch', app.config.get('BRANCHES_DEFAULT'))
    if branch not in app.config.get('BRANCHES_PUBLIC'):
        abort(403)
    try:
        repo = repository(app.config.get('CONTENT_ROOT')).changeset(branch)
    except exceptions.RepositoryError:
        abort(404)
    try:
        page = repo.find_file(
            path, name, app.config.get('FILE_RENDERERS', {}).keys())
    except exceptions.NodeDoesNotExistError:
        abort(404)
    return jsonify(serialize(page, config=app.config))
