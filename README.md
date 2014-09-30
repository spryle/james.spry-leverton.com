james.spry-leverton.com website src.

## Install

install node/npm python/virtualenv

    mkvirtualenv james
    pip install -r requirements.txt
    npm install

after npm link in local tarka repo

    npm ln tarka

    mv local.cfg.example local.cfg

update local.cfg
update /etc/hostfile for subdomains e.g.

    {HOST} spryle.co.uk
    {HOST} api.spryle.co.uk
    {HOST} james.spryle.co.uk
    {HOST} static.spryle.co.uk

CONFIG=local.cfg python manage.py runserver -h {HOST} - p {PORT}

&&

gulp watch

## TODO

* mobile perf
* fullscreen design
* gulpfile serve on host/port
