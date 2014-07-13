# -*- coding: utf-8
from __future__ import unicode_literals

from flask import Blueprint, render_template
from jsl.main.utils import DateTimeEncoder

import json
import datetime

app = Blueprint('main', __name__)


@app.route('/favicon.ico')
def index():
    return render_template('error/404.html'), 404


@app.app_template_filter('ordinal_suffix')
def ordinal_suffix(day):
    day = int(day)
    if 4 <= day <= 20 or 24 <= day <= 30:
        suffix = 'th'
    else:
        suffix = ['st', 'nd', 'rd'][day % 10 - 1]
    return '%s%s' % (day, suffix)


@app.app_context_processor
def now():
    return {
        'now': datetime.datetime.now()
    }


@app.app_template_filter('to_json')
def to_json(dump):
    return json.dumps(dump, cls=DateTimeEncoder)
