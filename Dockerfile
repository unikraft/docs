# SPDX-License-Identifier: BSD-3-Clause
#
# Copyright (c) 2021, Lancaster University.  All rights reserved.
#
# Redistribution and use in source and binary forms, with or without
# modification, are permitted provided that the following conditions
# are met:
#
# 1. Redistributions of source code must retain the above copyright
#    notice, this list of conditions and the following disclaimer.
# 2. Redistributions in binary form must reproduce the above copyright
#    notice, this list of conditions and the following disclaimer in the
#    documentation and/or other materials provided with the distribution.
# 3. Neither the name of the author nor the names of any co-contributors
#    may be used to endorse or promote products derived from this software
#    without specific prior written permission.
#
# THIS SOFTWARE IS PROVIDED BY THE AUTHOR AND CONTRIBUTORS ``AS IS'' AND
# ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
# IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
# ARE DISCLAIMED.  IN NO EVENT SHALL THE AUTHOR OR CONTRIBUTORS BE LIABLE
# FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
# DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS
# OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
# HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
# LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY
# OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
# SUCH DAMAGE.

FROM unikraft/kraft:staging AS devenv

LABEL maintainer "Alexander Jung <a.jung@lancs.ac.uk>"

ARG HUGO_VER=0.98.0
ARG GO_VER=1.18.3
ARG GO_ARCH=amd64
ARG BUILD_REF=latest

RUN mkdir /usr/src/docs
WORKDIR /usr/src/docs
COPY . /usr/src/docs

RUN set -xe; \
    apt-get update; \
    apt-get install -y \
      curl \
      g++ \
      lsb-release \
      gnupg; \
    curl -sLf -o /dev/null 'https://deb.nodesource.com/node_12.x/dists/buster/Release'; \
    curl -s https://deb.nodesource.com/gpgkey/nodesource.gpg.key | apt-key add -; \
    curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -; \
    echo 'deb https://deb.nodesource.com/node_12.x buster main' > /etc/apt/sources.list.d/nodesource.list; \
    echo 'deb-src https://deb.nodesource.com/node_12.x buster main' >> /etc/apt/sources.list.d/nodesource.list; \
    echo 'deb https://dl.yarnpkg.com/debian/ stable main' >> /etc/apt/sources.list.d/yarn.list; \
    apt-get update; \
    apt-get install -y \
      nodejs yarn; \
    npm install -g esbuild-linux-64; \
    npm install; \
    wget -O /tmp/go.tar.gz https://go.dev/dl/go${GO_VER}.linux-${GO_ARCH}.tar.gz; \
    tar -C /usr/local -xzf /tmp/go.tar.gz; \
    rm /tmp/go.tar.gz; \
    git clone --branch v${HUGO_VER} https://github.com/gohugoio/hugo.git /tmp/hugo

ENV PATH="${PATH}:/usr/local/go/bin"

RUN set -xe; \
    cd /tmp/hugo; \
    GOBIN=/usr/local/bin/ CGO_ENABLED=1 go install --tags extended; \
    rm -rf /tmp/hugo

ENTRYPOINT [ "" ]

EXPOSE 1313
CMD hugo server --bind=0.0.0.0 -p 1313

FROM devenv AS build-production

RUN set -xe; \
    make

FROM nginx:1.21.6-alpine AS production

COPY --from=build-production /usr/src/docs/public /usr/share/nginx/html
COPY etc/nginx.conf /etc/nginx/nginx.conf

# ENTRYPOINT ["/usr/local/nginx/sbin/nginx"]
# CMD ["-g", "daemon off;"]
