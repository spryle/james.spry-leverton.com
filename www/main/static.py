# -*- coding: utf-8
from __future__ import unicode_literals

from flask import Blueprint, current_app
from www.decorators import add_headers


static = Blueprint(
    'main-static',
    __name__,
    subdomain='static',
)


@add_headers({'Access-Control-Allow-Origin': '*'})
@static.route('/<path:filename>')
def serve_static(*args, **kwargs):
    return current_app.send_static_file(*args, **kwargs)
