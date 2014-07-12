PAGES_CONTENT_REPO = ''
PAGES_PUBLIC_BRANCHES = ['master']
PAGES_DEFAULT_BRANCH = 'master'
PAGES_CONTEXT_REGEX = r'^\.(?P<name>[\.\-\w]+)\.(?P<format>[\w]+)$'
PAGES_EXCLUDED_FILES = []
PAGES_EXCLUDED_DIRECTORIES = []
PAGES_HIDDEN_FILES = ['index']
PAGES_HIDDEN_DIRECTORIES = []
PAGES_RENDERERS = {
    'md': 'jsl.vcs_pages.formats.markdown',
    'html': 'jsl.vcs_pages.formats.html'
}
PAGES_PARSERS = {
    'json': 'json.loads'
}
PAGES_READ_LOCAL = True

# SERVER_NAME = 'local.dev'
