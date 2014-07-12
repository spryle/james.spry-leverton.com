# -*- coding: utf-8
from __future__ import unicode_literals

from flask import Blueprint, render_template


app = Blueprint('main', __name__)


@app.route('/favicon.ico')
def index():
    return render_template('error/404.html'), 404


@app.app_template_filter('ordinal_suffix')
def ordinal_suffix(day):
    day = int(day)
    if 4 <= day <= 20 or 24 <= day <= 30:
        suffix = "th"
    else:
        suffix = ["st", "nd", "rd"][day % 10 - 1]
    return "%s%s" % (day, suffix)
