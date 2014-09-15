import os

DEBUG = True
GOOGLE_ANALYTICS = False
MINIFIED_STATIC = False

SERVER_NAME = 'dev:5000'
API_ROOT = 'api.dev:5000'

DIRNAME = os.path.abspath(os.path.dirname(__file__))

MEDIA_URL = 'http://spry-leverton.imgix.net/'
MEDIA_S3_MEDIA_BUCKET = 's3://media.spry-leverton.com/'
MEDIA_S3_REGION = 'eu-west-1'

STATIC_S3_MEDIA_BUCKET = 's3://static.spry-leverton.com/'
STATIC_S3_REGION = 'eu-west-1'

COLLECT_STATIC_ROOT = '{0}/assets/'.format(DIRNAME)
STATIC_ROOT = '{0}/assets/'.format(DIRNAME)

# STATIC_URL = '/static/'
