# -*- coding:utf-8 -*-

from flask.ext import script
from application import application_factory


if __name__ == '__main__':
    manager = script.Manager(application_factory)
    manager.run()
