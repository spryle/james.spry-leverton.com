from flask import Markup
import mistune


def markdown(content):
    return Markup(mistune.markdown(content, escape=True))


def html(content):
    return Markup(content)
