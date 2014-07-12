# -*- coding: utf-8
from __future__ import unicode_literals

from flask.ext.api import status
from flask import Blueprint, current_app, request

from jsl.vcs_pages import nodes

import vcs

app = Blueprint('api-pages', __name__)


@app.route('/', methods=['GET'])
@app.route('/<filename>', methods=['GET'])
@app.route('/<path:path>/<filename>', methods=['GET'])
@app.route('/<path:path>/', methods=['GET'])
def vcs_page_api(path='', filename='index'):

    conf = current_app.config
    branch = request.args.get('branch', conf.get('PAGES_DEFAULT_BRANCH'))
    repo = vcs.get_repo(conf.get('PAGES_CONTENT_REPO'), 'git')

    if branch not in conf.get('PAGES_PUBLIC_BRANCHES'):
        return '', status.HTTP_403_FORBIDDEN

    try:
        changeset = repo.get_changeset(repo.branches[branch])
    except IndexError:
        return '', status.HTTP_404_NOT_FOUND

    try:
        root = nodes.Node(changeset.get_node(path))
    except vcs.exceptions.NodeDoesNotExistError:
        return '', status.HTTP_404_NOT_FOUND

    page = root.get_page(filename)

    if root.is_excluded or not root.is_current_page and not page:
        return '', status.HTTP_404_NOT_FOUND

    return {
        'parent': root.parent.context if root.parent else None,
        'root': root.context,
        'children': [
            child.context for child in root.children
            if not child.is_hidden or child.is_excluded],
        'content': page.render() if page else None,
        'context': page.context if page else None
    }
