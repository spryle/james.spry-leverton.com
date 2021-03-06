# -*- coding: utf-8
from __future__ import unicode_literals

from flask import Flask
from flask import current_app as app
from flask.ext import script
from werkzeug.wsgi import DispatcherMiddleware
from www import main
from subprocess import call


def build_application():
    base = Flask(__name__, static_folder=None)
    base.config.from_object('defaults')
    base.config.from_envvar('CONFIG')
    base.wsgi_app = DispatcherMiddleware(base.wsgi_app, {
        '': main.build_app(config=base.config)
    })
    return base

manager = script.Manager(build_application)


def sync_command(*args, **kwargs):
    return (
        'AWS_ACCESS_KEY_ID={AWS_ACCESS_KEY_ID} '
        'AWS_SECRET_ACCESS_KEY={AWS_SECRET_ACCESS_KEY} '
        'aws s3 sync {target} {destination} --region {region} '
        '--delete --cache-control "max-age=604800, public, no-transform" '
    ).format(**kwargs)


@manager.command
def collect(verbose=True):
    for root, application in app.wsgi_app.mounts.iteritems():
        if 'collect' in application.extensions:
            application.extensions['collect'].collect(verbose=verbose)


@manager.command
def sync_media():
    command = sync_command(
        AWS_ACCESS_KEY_ID=app.config.get('AWS_ACCESS_KEY_ID'),
        AWS_SECRET_ACCESS_KEY=app.config.get('AWS_SECRET_ACCESS_KEY'),
        target=app.config.get('MEDIA_ROOT'),
        destination=app.config.get('MEDIA_S3_MEDIA_BUCKET'),
        region=app.config.get('MEDIA_S3_REGION')
    )
    call(command + '--exclude ".git/*"', shell=True)


@manager.command
def sync_assets():
    command = sync_command(
        AWS_ACCESS_KEY_ID=app.config.get('AWS_ACCESS_KEY_ID'),
        AWS_SECRET_ACCESS_KEY=app.config.get('AWS_SECRET_ACCESS_KEY'),
        target=app.config.get('STATIC_ROOT'),
        destination=app.config.get('STATIC_S3_MEDIA_BUCKET'),
        region=app.config.get('STATIC_S3_REGION')
    )
    call(command + '--exclude "*.gz.*"', shell=True)
    call(
        command +
        '--exclude "*" ' +
        '--include "*.gz.*" ' +
        '--content-encoding "gzip"',
        shell=True
    )


@manager.command
def download_media():
    call(sync_command(
        AWS_ACCESS_KEY_ID=app.config.get('AWS_ACCESS_KEY_ID'),
        AWS_SECRET_ACCESS_KEY=app.config.get('AWS_SECRET_ACCESS_KEY'),
        target=app.config.get('MEDIA_S3_MEDIA_BUCKET'),
        destination=app.config.get('MEDIA_ROOT'),
        region=app.config.get('MEDIA_S3_REGION')
    ), shell=True)


if __name__ == '__main__':
    manager.run()
