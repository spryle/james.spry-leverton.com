# -*- coding: utf-8
from __future__ import unicode_literals

from flask import render_template, jsonify
from www.main.exceptions import ApiError
from www.decorators import add_headers


def init_app(app):

    @app.errorhandler(ApiError)
    @add_headers({'Access-Control-Allow-Origin': '*'})
    def api_error(error):
        response = jsonify(error.to_dict())
        response.status_code = error.status_code
        return response

    @app.errorhandler(403)
    def forbidden_page(error):
        return render_template('error/403.html', page={
            'title': '403',
        }), 403

    @app.errorhandler(404)
    def page_not_found(error):
        return render_template('error/404.html', page={
            'title': '404',
        }), 404

    @app.errorhandler(500)
    def server_error_page(error):
        return render_template('error/500.html',  page={
            'title': '500',
        }), 500
