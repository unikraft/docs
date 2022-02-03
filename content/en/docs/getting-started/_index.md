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

```bash
pip3 install git+https://github.com/unikraft/kraft.git
```

You can then type kraft to see its help menu:
```text
Usage: kraft [OPTIONS] COMMAND [ARGS]...

Options:
  --version         Show the version and exit.
  -C, --no-color    Do not use colour in output logs.
  -T, --timestamps  Show timestamps in output logs.
  -Y, --yes         Assume yes to any binary prompts.
  -v, --verbose     Enables verbose mode.
  -h, --help        Show this message and exit.

Commands:
  build       Build the application.
  clean       Clean the application.
  configure   Configure the application.
  fetch       Fetch library dependencies.
  init        Initialize a new unikraft application.
  lib         Unikraft library commands.
  list        List architectures, platforms, libraries or applications.
  menuconfig  Open the KConfig Menu editor
  prepare     Runs preparations steps on libraries.
  run         Run the application.
  up          Configure, build and run an application.

Influential Environmental Variables:
  UK_WORKDIR The working directory for all Unikraft
  source code [default: ~/.unikraft]
  UK_ROOT    The directory for Unikraft's core source
  code [default: $UK_WORKDIR/unikraft]
  UK_LIBS    The directory of all the external Unikraft
  libraries [default: $UK_WORKDIR/libs]
  UK_APPS    The directory of all the template applications
  [default: $UK_WORKDIR/apps]
  KRAFTRC  The location of kraft's preferences file
  [default: ~/.kraftrc]

Help:
  For help using this tool, please open an issue on Github:
  https://github.com/unikraft/kraft
```

Building an Application

The simplest way to get the sources for, build and run an application is by running the following commands:

```bash
kraft list
kraft up -p PLATFORM -m ARCHITECTURE APP
```

You can also build and run an applications from the existing templates by using the `-t` option.
For example, building and running the [helloworld app](https://github.com/unikraft/app-helloworld):

```bash
kraft up -p kvm -m x86_64 -t helloworld helloworld
```

For more information about all the steps behind `kraft up`, check [Creating an App](docs/usage/init).
For more information about the `up` command type kraft up -h.
For more information about kraft type kraft -h or read the documentation at Unikraft’s website.
If you find any problems please fill out an issue. Thank you!
