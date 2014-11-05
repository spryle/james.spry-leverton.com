CONTENT_ROOT = None

BRANCHES_PUBLIC = [
    'master'
]

BRANCHES_DEFAULT = 'master'

FILE_RENDERERS = {
    'md': 'www.main.formats.markdown',
    'html': 'www.main.formats.html'
}

FILE_PARSERS = {
    'json': 'json.loads'
}

FILE_READ_LOCAL = True

DIRECTORY_EXCLUDE = [
    '.*',
    'index.*'
]

DIRECTORY_FILTER = []
