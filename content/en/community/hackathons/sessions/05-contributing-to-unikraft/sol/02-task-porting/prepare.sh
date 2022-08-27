#!/bin/bash

if test ! -d unikraft; then
    git clone https://github.com/unikraft/unikraft
fi

test -d unikraft/.git && rm -fr unikraft/.git

if test ! -d libs/newlib; then
    git clone https://github.com/unikraft/lib-newlib libs/newlib
fi

test -d libs/newlib/.git && rm -fr libs/newlib/.git
