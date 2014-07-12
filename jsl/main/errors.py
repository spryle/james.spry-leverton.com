from flask import render_template


def init_app(app):

    @app.errorhandler(403)
    def forbidden_page(error):
        return render_template('error/403.html'), 403

    @app.errorhandler(404)
    def page_not_found(error):
        return render_template('error/404.html'), 404

    @app.errorhandler(405)
    def method_not_allowed_page(error):
        return render_template('error/405.html'), 405

    @app.errorhandler(500)
    def server_error_page(error):
        return render_template('error/500.html'), 500
