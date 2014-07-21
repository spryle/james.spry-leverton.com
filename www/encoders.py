# -*- coding: utf-8
from __future__ import unicode_literals

from datetime import datetime
from json import JSONEncoder


def unix_time(dt):
    epoch = datetime.utcfromtimestamp(0)
    delta = dt - epoch
    return delta.total_seconds()


def unix_time_millis(dt):
    return unix_time(dt) * 1000.0


class UnixTimeEncoder(JSONEncoder):

    def default(self, obj):
        if isinstance(obj, datetime):
            encoded_object = unix_time_millis(obj)
        else:
            encoded_object = JSONEncoder.default(self, obj)
        return encoded_object
