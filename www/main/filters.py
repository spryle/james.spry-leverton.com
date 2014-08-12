# -*- coding: utf-8
from __future__ import unicode_literals

from flask import Blueprint


filters = Blueprint('main-filters', __name__)


@filters.app_template_filter('ordinal_suffix')
def ordinal_suffix(day):
    day = int(day)
    if 4 <= day <= 20 or 24 <= day <= 30:
        suffix = 'th'
    else:
        suffix = ['st', 'nd', 'rd'][day % 10 - 1]
    return '{0}{1}'.format(day, suffix)


@filters.app_template_filter('without')
def without(target, keys):
    result = {}
    result.update(target)
    for key in keys:
        del result[key]
    return result
