#!/bin/bash

if test ! -d app-libhogweed/.unikraft/unikraft; then
    git clone https://github.com/unikraft/unikraft app-libhogweed/.unikraft/unikraft
fi

if test ! -d ./app-libhogweed/.unikraft/libs/musl; then
    git clone https://github.com/unikraft/lib-musl ./app-libhogweed/.unikraft/libs/musl
fi
