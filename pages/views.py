# -*- coding: utf-8
from __future__ import unicode_literals

from flask import (
    Blueprint,
    render_template,
    current_app,
    request,
    abort
)

from pages.nodes import Node

import vcs

pages = Blueprint('pages', __name__)


@pages.route('/')
@pages.route('/<filename>')
@pages.route('/<path:path>/<filename>')
@pages.route('/<path:path>/')
def page(path='', filename='index'):

    branch = request.args.get(
        'branch',
        current_app.config['PAGES_DEFAULT_BRANCH']
    )

    repo = vcs.get_repo(
        current_app.config['PAGES_CONTENT_REPO'],
        'git'
    )

    if branch not in current_app.config['PAGES_PUBLIC_BRANCHES']:
        abort(403)

    if branch not in repo.branches:
        abort(404)

    changeset = repo.get_changeset(repo.branches[branch])

    try:
        root = Node(changeset.get_node(path))
    except vcs.exceptions.NodeDoesNotExistError:
        abort(404)

    page = root.get_page(filename)

    if root.is_excluded or not root.is_current_page and not page:
        abort(404)

    return render_template(
        'page.html',
        root=root,
        page=page
    )
