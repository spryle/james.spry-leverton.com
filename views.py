from flask import render_template


def configure(app):

    @app.route('/favicon.ico')
    def index():
        return render_template('error/404.html'), 404
