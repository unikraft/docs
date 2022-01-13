---
title: Getting Started
date: 2020-01-11T14:09:21+09:00
draft: false
weight: 100
enableToc: true
---

## Getting started with Unikraft

The easiest way to get started with Unikraft is to use the command-line utility
`kraft`, which is a companion tool used for defining, configuring, building, and
running Unikraft applications.  With `kraft` you can seamlessly create a build
environment for your unikernel and painlessly manage dependencies for its build.

## Installing the CLI companion tool `kraft`

The kraft tool and Unikraft build system have a number of package requirements;
please run the following command (on apt-get-based systems) to install the
requirements:

```shell-script
apt-get install -y --no-install-recommends \
  build-essential \
  libncurses-dev \
  libyaml-dev \
  flex \
  git \
  wget \
  socat \
  bison \
  unzip \
  uuid-runtime \
  python3 \
  python3-setuptools
```

To install kraft simply run:

pip3 install git+https://github.com/unikraft/kraft.git

You can then type kraft to see its help menu:

Building an Application

The simplest way to get the sources for, build and run an application is by running the following commands:

kraft list
kraft up -p PLATFORM -m ARCHITECTURE APP

For more information about that command type kraft up -h. For more information about kraft type kraft -h or read the documentation at Unikraft’s website. If you find any problems please fill out an issue. Thank you!