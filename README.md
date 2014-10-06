## [james.spry-leverton.com](//james.spry-leverton.com)

## TODO

* fix collecting of static

## Install

install node/npm python/virtualenv

    mkvirtualenv james
    pip install -r requirements.txt
    npm install

link tarka for local dev *(after npm link in local tarka repo)*

    npm ln tarka
    mv local.cfg.example local.cfg

update local.cfg

    SERVER_NAME = '{HOST}:{PORT}' # without subdomain
    API_ROOT = 'api.{HOST}:{PORT}' #  with api subdomain

update /etc/hostfile for subdomains e.g.

    {HOST} spryle.co.uk
    {HOST} api.spryle.co.uk
    {HOST} james.spryle.co.uk
    {HOST} static.spryle.co.uk

Run a local web server

    CONFIG=local.cfg python manage.py runserver -h {HOST} - p {PORT}

And watch static resources

    gulp watch
