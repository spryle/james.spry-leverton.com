# -*- coding: utf-8
from __future__ import unicode_literals

from flask import Blueprint
from datetime import datetime


contexts = Blueprint('main-context-processors', __name__)


@contexts.app_context_processor
def now():
    return {'now': datetime.now()}
