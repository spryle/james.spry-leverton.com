# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import os
import re

from collections import namedtuple
from pip.req import parse_requirements
from setuptools import setup, find_packages

options = requirements = list(parse_requirements(
    os.path.join(os.path.dirname(__file__), 'requirements.txt'),
    options=namedtuple('options', [
        'skip_requirements_regex',
        'default_vcs'
    ])(None, 'git')
))

install_requires = [
    r.name for r in requirements if not r.editable
]

dependency_links = filter(None, [r.url for r in requirements])

version = re.search(
    r"__version__\s*=\s*'(.*)'",
    open('www/__init__.py').read(),
    re.M
).group(1)


setup(
    name='james.spry-leverton.com',
    version=version,
    description='James Spry-Levertons website',
    author='James Spry-Leverton',
    author_email='james@spry-leverton.com',
    url='http://james.spry-leverton.com',
    download_url='git+https://github.com/spryle/james.spry-leverton.com',
    include_package_data=True,
    packages=find_packages(),
    setup_requires=['pip'],
    install_requires=install_requires,
    dependency_links=dependency_links,
)
