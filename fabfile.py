# coding: utf-8
from __future__ import with_statement
import codecs
import json
import os
import platform

from fabric.api import *
from fabric.colors import *

# Examples of Usage
# fab --list
# fab prepare
# fab rename:extension=jpg
# fab resize:folder=output
# fab compress
# fab logos

# Utilities

def isMac():
    return platform.system().lower() == 'darwin'

def isLinux():
    return platform.system().lower() == 'linux'

def venv():
    return 'source %(env)s/bin/activate' % dict(env=env.venv)

def python(command):
  return 'python %(command)s' % dict(command=command)

def manage(command):
  return 'python manage.py %(command)s' % dict(command=command)

def pip(package):
  return 'pip install %(package)s' % dict(package=package)

def gem(package):
  return 'gem install %(package)s' % dict(package=package)

def install(packages):
    packages = ' '.join(packages)
    if isMac():
        env.run('brew install %(packages)s' % dict(packages=packages))
    elif isLinux():
        env.sudo('apt-get install -y %(package)s' % dict(package=packages))


# Tasks

@task
def prepare():
    gem('jekyll')
    gem('redcarpet')
    pip('Pygments')

@task
def build(default=True):
    local('jekyll build --safe')

@task
def test():
    build()
    local('open _site/index.html')

@task
def deploy():
  local('git checkout master')
  local('git fetch origin master')
  local('git rebase origin/master')
  local('git push origin master')
