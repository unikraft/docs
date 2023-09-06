#!/bin/bash

if test $# -ne 1; then
    echo "Usage: $0 file" 2>&1
    exit 1
fi

sed -i -e '1{/^ *$/d}' -e '${/^ *$/d}' "$1"
