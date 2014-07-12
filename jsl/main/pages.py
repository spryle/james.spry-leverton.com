# -*- coding: utf-8
from __future__ import unicode_literals

from flask import (
    Blueprint,
    render_template,
    current_app,
    request,
    abort
)

from jsl.vcs_pages import nodes

import vcs

app = Blueprint('main-pages', __name__)


@app.route('/')
@app.route('/<filename>')
@app.route('/<path:path>/<filename>')
@app.route('/<path:path>/')
def vcs_page(path='', filename='index'):

    conf = current_app.config
    branch = request.args.get('branch', conf.get('PAGES_DEFAULT_BRANCH'))
    repo = vcs.get_repo(conf.get('PAGES_CONTENT_REPO'), 'git')

    if branch not in conf.get('PAGES_PUBLIC_BRANCHES'):
        abort(403)

    try:
        changeset = repo.get_changeset(repo.branches[branch])
    except IndexError:
        abort(404)

    try:
        root = nodes.Node(changeset.get_node(path))
    except vcs.exceptions.NodeDoesNotExistError:
        abort(404)

    page = root.get_page(filename)

    if root.is_excluded or not root.is_current_page and not page:
        abort(404)

    return render_template('page.html', root=root, page=page)
