import os

DEBUG = False
GOOGLE_ANALYTICS = False
MINIFIED_STATIC = True

DIRNAME = os.path.abspath(os.path.dirname(__file__))

MEDIA_URL = '//spry-leverton.imgix.net/'
MEDIA_S3_MEDIA_BUCKET = 's3://media.spry-leverton.com/'
MEDIA_S3_REGION = 'eu-west-1'

STATIC_S3_MEDIA_BUCKET = 's3://static.spry-leverton.com/'
STATIC_S3_REGION = 'eu-west-1'
COLLECT_STATIC_ROOT = '{0}/assets/'.format(DIRNAME)
STATIC_ROOT = '{0}/assets/'.format(DIRNAME)
# STATIC_URL = 'https://s3-eu-west-1.amazonaws.com/static.spry-leverton.com'
STATIC_URL = '/static'
