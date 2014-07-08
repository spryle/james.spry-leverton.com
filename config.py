
PAGES_CONTENT_REPO = None

PAGES_PUBLIC_BRANCHES = ['master']

PAGES_DEFAULT_BRANCH = 'master'

PAGES_CONTEXT_REGEX = r'^\.(?P<name>[\.\-\w]+)\.(?P<format>[\w]+)$'

PAGES_EXCLUDED_FILES = []

PAGES_EXCLUDED_DIRECTORIES = []

PAGES_HIDDEN_FILES = ['index']

PAGES_HIDDEN_DIRECTORIES = []

PAGES_RENDERERS = {
    'md': 'pages.formats.markdown',
    'html': 'pages.formats.html'
}

PAGES_PARSERS = {
    'json': 'json.loads'
}
