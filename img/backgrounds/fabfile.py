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

def install(packages):
    packages = ' '.join(packages)
    if isMac():
        env.run('brew install %(packages)s' % dict(packages=packages))
    elif isLinux():
        env.sudo('apt-get install -y %(package)s' % dict(package=packages))


# Tasks

@task
def prepare():
    install('imagemagick')
    pip('boto')

@task
def rename(folder='.', extension=None):
    output = '%(folder)s/output' % dict(folder=folder)
    local('rm -rf %(output)s && mkdir %(output)s' % dict(output=output))
    (_, _, filenames) = os.walk(folder).next()
    i = 1
    for filename in filenames:
        name, ext = os.path.splitext(filename)
        ext = ext.lower()
        if extension is None or extension in ext:
            newfilename = str(i).zfill(4)
            newfile = '%(output)s/%(newfilename)s%(ext)s' % dict(output=output, newfilename=newfilename, ext=ext)
            local('cp %(filename)s %(newfile)s' % dict(filename=filename, newfile=newfile))
            i += 1

@task
def convert(options, source, result):
    local('convert %(options)s %(source)s %(result)s' % dict(options=options, source=source, result=result))

@task
def convert_all(options, folder='.'):
    output = '%(folder)s/output' % dict(folder=folder)
    local('rm -rf %(output)s && mkdir %(output)s' % dict(output=output))
    (_, _, filenames) = os.walk(folder).next()
    image_extensions = ['.jpg', '.jpeg', '.png', '.gif']
    for filename in filenames:
        name, ext = os.path.splitext(filename)
        if ext.lower() in image_extensions:
            source = '%(folder)s/%(input)s' % dict(folder=folder, input=filename)
            result = '%(output)s/%(input)s' % dict(output=output, input=filename)
            convert(options, source, result)

@task
def resize(folder='.'):
    # convert_all('-resize 50%%')
    convert_all('-resize 1024x768')

@task
def compress(folder='.'):
    # convert_all('-strip -interlace Plane -gaussian-blur 0.05 -quality 85%')
    convert_all('-strip -interlace Plane -gaussian-blur 0.05 -quality 75%')
    # convert_all('-strip -interlace Plane -gaussian-blur 0.05 -quality 60%')
    # convert_all('-strip -interlace Plane -gaussian-blur 0.05 -quality 55%')

@task
def logos():
    local('rm -rf output && mkdir output')
    square = 'logo-1024x1024.png'
    portrait = 'logo-1024x1024.png'
    landscape = 'logo-1024x1024.png'
    banner = 'logo-1024x1024.png'

    def logo(source, sizes):
        name, ext = os.path.splitext(source)
        for size in sizes:
            convert('-resize %(size)s\!' % dict(size=size), square, 'logo-%(size)s%(ext)s' % dict(size=size, ext=ext))

    # FB logos: 512, 180, 16
    # favicon: 32, 16
    sizes = ['512x512', '200x200', '180x180', '144x144', '114x114', '72x72', '57x57', '32x32', '16x16']
    logo(square, sizes)

    # Mobile Portrait
    sizes = ['1536x2008', '640x1136', '768x1004', '640x960', '320x480']
    logo(portrait, sizes)

    # Mobile Landscape
    sizes = ['2048x1496', '1024x748']
    logo(landscape, sizes)

    # Banners
    # 800x150 FB app cover image
    # 400x150 FB cover image
    # 155x100 FB app web banner
    # 200x60 Site logo
    # 150x50 PagSeguro logo
    # 150x50 Site logo
    # 140x40 Site logo
    sizes = ['800x150', '400x150', '155x100', '200x60', '200x50', '150x50', '140x40']
    logo(banner, sizes)
