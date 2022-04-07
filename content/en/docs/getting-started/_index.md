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

As an alternative to `kraft` it is also possible to build Unikraft using a regular [`Makefile`](docs/getting-started/#building-unikraft-via-makefile).

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

## Building an Application

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

## Building Unikraft via `Makefile`

To manually set up the build environment for the [helloworld app](https://github.com/unikraft/app-helloworld), we first have to create a specific directory structure:
```
 my-unikernel
      ├────apps
      │      └─app-helloworld     <- helloworld application
      ├─── libs                   <- additional libraries go here
      └─── unikraft               <- Unikraft core
```
We can do this by executing the following sequence of commands:
```bash
$ mkdir my-unikernel
$ cd my-unikernel
$ git clone https://github.com/unikraft/unikraft
$ mkdir libs
$ mkdir apps
$ cd apps
$ git clone https://github.com/unikraft/app-helloworld
$ cd app-helloworld
```
All following configuration and build operations are done from within the helloworld application folder.
Notice that it already contains a `Makefile` that looks like this:
```Makefile
UK_ROOT ?= $(PWD)/../../unikraft
UK_LIBS ?= $(PWD)/../../libs
LIBS :=

all:
	@$(MAKE) -C $(UK_ROOT) A=$(PWD) L=$(LIBS)

$(MAKECMDGOALS):
	@$(MAKE) -C $(UK_ROOT) A=$(PWD) L=$(LIBS) $(MAKECMDGOALS)
```
In the first two lines, we provide the paths to the Unikraft core repository and the directory where we can put additional libraries.
Since the helloworld application uses `nolibc` as C library, which comes with the Unikraft core, we do not have any external dependencies.
We thus do not have to download or reference any libraries in the `Makefile` and can leave the `LIBS` variable empty.


With the `Makefile` present and the directory structure correctly set up, we are able to configure the unikernel as the next step.
This will allow us to select the target architecture (e.g., aarch64 or x86-64) and platform (e.g., KVM or Xen).
```bash
$ make menuconfig
```
By default the build system selects x86-64 as target architecture, so we only have to choose a target platform.
We will decide for KVM by navigating to the `Platform Configuration | KVM guest` option and selecting it.
Afterwards, we save and exit the configuration menu.

You can then build the unikernel with:
```bash
$ make
```
Consider adding `-jX` with `X` being the number of CPUs in your machine to speed up the build process.

When the build completes you will have a Unikraft-based kernel image (`build/app-helloworld_kvm-x86_64`) that you can start with QEMU/KVM using the `-kernel` option.
See [here](docs/operations/plats/kvm) for further information on running the unikernel with KVM.

## Adding external dependencies

When the application becomes more complex, it is likely that not all functionality is included in the Unikraft core repository.
As you might have noticed already from the code organization in the core repository (`lib/*`), Unikraft puts an emphasis on encapsulating functionality in libraries that can be easily added, removed, or replaced to tailor the unikernel to the application's needs.

To add a library you simply clone it into the `libs` directory created earlier.
In this example, we add the lightweight IP (lwip) network stack [lib-lwip](https://github.com/unikraft/lib-lwip):
```bash
$ cd my-unikernel
$ cd libs
$ git clone https://github.com/unikraft/lib-lwip
```
Next, we have reference the library in the `Makefile` of `app-helloworld` so that it becomes available for selection in the configuration:
```Makefile
UK_LIBS ?= $(PWD)/../../libs

LIBS := $(UK_LIBS)/lib-lwip
#LIBS := $(LIBS-y):$(UK_LIBS)/lib-X
```
We can now re-run
```bash
make menuconfig
```
and select `lwip` in the `Library Configuration` sub-menu.
We can then rebuild the unikernel, by running:
```bash
$ make clean
$ make prepare
$ make
```
The `prepare` step gives the build system the chance to pull the actual source code for `lwip` and apply necessary patches to make it work with Unikraft. This has to be done only once after adding a new library.

Note that the build may fail because depending on the configuration, `lwip` requires a more extensive C library (e.g., [newlib](https://github.com/unikraft/lib-newlib)) and a POSIX threads implementation (e.g., [pthread-embedded](https://github.com/unikraft/lib-pthread-embedded)).
You can add these additional dependencies just as described.
