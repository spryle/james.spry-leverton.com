
PAGES_CONTENT_REPO = '/home/jsl/projects/content.spry-leverton.com'

PAGES_PUBLIC_BRANCHES = [
    'master',
    'public',
]

PAGES_DEFAULT_BRANCH = 'master'

PAGES_CONTEXT_REGEX = r'^\.(?P<name>[\.\-\w]+)\.(?P<format>[\w]+)$'

PAGES_EXCLUDED_FILES = []

PAGES_EXCLUDED_DIRECTORIES = []

PAGES_HIDDEN_FILES = [
    'index'
]

PAGES_HIDDEN_DIRECTORIES = []

PAGES_RENDERERS = {
    'md': 'pages.formats.markdown',
    'html': 'pages.formats.html'
}

PAGES_PARSERS = {
    'json': 'json.loads'
}
