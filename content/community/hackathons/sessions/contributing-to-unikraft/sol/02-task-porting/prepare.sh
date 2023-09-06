#!/bin/bash

if test ! -d app-kdtree/.unikraft/unikraft; then
    git clone https://github.com/unikraft/unikraft app-kdtree/.unikraft/unikraft
fi

if test ! -d ./app-kdtree/.unikraft/libs/musl; then
    git clone https://github.com/unikraft/lib-musl ./app-kdtree/.unikraft/libs/musl
fi
