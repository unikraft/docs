---
title: Building with Make
date: 2020-01-11T14:09:21+09:00
draft: false
weight: 409
---

## Building `app-helloworld` with Make

The Unikraft build system is based on [`Make`](https://www.gnu.org/software/make/) and [`KConfig`](https://www.kernel.org/doc/html/latest/kbuild/kconfig-language.html).
Configuration and build commands of the `kraft` companion tool are wrappers over `make`.
For more control, you can configure, build and run your unikernel using the `Makefile` and `Config.uk` files instead of `kraft.yaml`, and with the `make` and `qemu-system` tools instead of the `kraft` companion tool.
Note that this is more complex than using `kraft`, since you will have to deal with more options.

We want to build [`app-helloworld`](https://github.com/unikraft/app-helloworld) using `make`, with no dependency on `kraft`.
In order to do that, we need to follow the same steps we take when using `kraft`:

1. [Set up the working environment](docs/usage/make_build/#set-up-the-working-environment)
1. [Configure the application](docs/usage/make_build/#configure-the-application)
1. [Build the application](docs/usage/make_build/#build-the-application)
1. [Run the application](docs/usage/make_build/#run-the-application)
1. [Clean the build files](docs/usage/make_build/#clean-the-build-files)

### Set Up the Working Environment

To manually set up the build environment for the [`helloworld` app](https://github.com/unikraft/app-helloworld), we first have to create a specific directory structure:

```text
my-unikernel/
	|-- apps/
	|   `-- app-helloworld          <- helloworld application
	|-- libs/                       <- additional libraries go here
	`-- unikraft/                   <- Unikraft core
```

We can do this by executing the following sequence of commands:

```console
$ mkdir my-unikernel
$ cd my-unikernel
$ git clone https://github.com/unikraft/unikraft
$ mkdir libs
$ mkdir apps
$ cd apps
$ git clone https://github.com/unikraft/app-helloworld
$ cd app-helloworld
```

All following configuration and build operations are done from within the `app-helloworld/` application directory.

Let's take a look in the directory:

```console
$ tree
.
|-- CODING_STYLE.md
|-- Config.uk
|-- CONTRIBUTING.md
|-- COPYING.md
|-- kraft.yaml
|-- main.c
|-- MAINTAINERS.md
|-- Makefile
|-- Makefile.uk
|-- monkey.h
`-- README.md
```

The `.md` files are documentation files.
The `main.c` and `monkey.h` files are source code files.
`Makefile`, `Makefile.uk`, `Config.uk` and `kraft.yaml` are files required for the build.
See more about `kraft.yaml` in the [usage page](/docs/usage/init/).
See more about `Makefile`, `Makefile.uk` and `Config.uk` in the [porting page](/docs/develop/porting/).
These last three files are relevant to a `Make`-based build.

### Configure the Application

With the `Makefile` present and the directory structure correctly set up, we are able to configure the unikernel as the next step:

```console
$ make menuconfig
```

This command will prompt a text-based user interface that will allow us to select the target architecture (e.g., `aarch64` or `x86-64`) and platform (e.g., `KVM` or `Xen`).
Use the `up` and `down` arrow keys to navigate, `Enter` key to enter menus and use menu buttons, `Space` key to make selections, `?` key for help.

By default, the build system selects `x86-64` as the target architecture, so we only have to choose a target platform.
We will decide for `KVM` by navigating to the `Platform Configuration | KVM guest` option and selecting it, as shown in the picture below:

{{< img
      class="w-auto mx-auto"
      src="/assets/imgs/menuconfig-plat-selection.png"
      position="center"
>}}

Afterward, we save and exit the configuration menu by using the button options in the lower part of the text user interface screen.

### Build the Application

We can then build the application:

```console
$ make
make[1]: Entering directory '[...]/my-unikernel/unikraft'
  MKDIR   lxdialog
  MAKE    kconfig
  CP      config
[...]
  LD      app-helloworld_kvm-x86_64.ld.o
  OBJCOPY app-helloworld_kvm-x86_64.o
  LD      app-helloworld_kvm-x86_64.dbg
  SCSTRIP app-helloworld_kvm-x86_64
  GZ      app-helloworld_kvm-x86_64.gz
  LN      app-helloworld_kvm-x86_64.dbg.gdb.py
  GEN     uk-gdb.py
make[1]: Leaving directory '[...]/my-unikernel/unikraft'
```

As we can see, the build resulted in an application image named `app-helloworld_kvm-x86_64` that we can run.
The `app-helloworld_kvm-x86_64` image is stripped;
if we want to use debugging symbols, we need to use the `app-helloworld_kvm-x86_64.dbg` image.

In order to speed up the build process, we can add the `-j X`, flag with `X` typically assigned to the number of CPUs on the build machine (e.g. `make -j 8`).

### Run the Application

When the build completes, we will have an Unikraft-based kernel image (`build/app-helloworld_kvm-x86_64`) that we can start with `QEMU/KVM` using the `-kernel` option:

```console
$ sudo qemu-system-x86_64 -enable-kvm -cpu host -nographic -kernel build/app-helloworld_kvm-x86_64
SeaBIOS (version 1.13.0-1ubuntu1.1)

iPXE (http://ipxe.org) 00:03.0 CA00 PCI2.10 PnP PMM+07F8C8A0+07ECC8A0 CA00

Booting from ROM..Powered by
o.   .o       _ _               __ _
Oo   Oo  ___ (_) | __ __  __ _ ' _) :_
oO   oO ' _ `| | |/ /  _)' _` | |_|  _)
oOo oOO| | | | |   (| | | (_) |  _) :_
 OoOoO ._, ._:_:_,\_._,  .__,_:_, \___)
                 Phoebe 0.10.0~ee2a37cf
Hello world!
```

Alternatively, we can use the [`qemu-guest` script](https://github.com/unikraft/unikraft/blob/staging/support/scripts/qemu-guest) provided in the `unikraft` core repository:

```console
$ ../../unikraft/support/scripts/qemu-guest -k build/app-helloworld_kvm-x86_64
SeaBIOS (version 1.13.0-1ubuntu1.1)

iPXE (http://ipxe.org) 00:03.0 CA00 PCI2.10 PnP PMM+07F8C8A0+07ECC8A0 CA00

Booting from ROM..Powered by
o.   .o       _ _               __ _
Oo   Oo  ___ (_) | __ __  __ _ ' _) :_
oO   oO ' _ `| | |/ /  _)' _` | |_|  _)
oOo oOO| | | | |   (| | | (_) |  _) :_
 OoOoO ._, ._:_:_,\_._,  .__,_:_, \___)
                 Phoebe 0.10.0~ee2a37cf
Hello world!
```

If we are working on a machine without `KVM` / full virtualization support, the `-enable-kvm` option (and the `-cpu host` option) must be left out.
If using the `qemu-guest` script, we will use the `-W` flag to disable `KVM` / full virtualization support.
This will lower the performance, since everything will be emulated.

```console
$ qemu-system-x86_64 -nographic -kernel build/app-helloworld_kvm-x86_64
SeaBIOS (version 1.13.0-1ubuntu1.1)

iPXE (http://ipxe.org) 00:03.0 CA00 PCI2.10 PnP PMM+07F8C8A0+07ECC8A0 CA00

Booting from ROM..Powered by
o.   .o       _ _               __ _
Oo   Oo  ___ (_) | __ __  __ _ ' _) :_
oO   oO ' _ `| | |/ /  _)' _` | |_|  _)
oOo oOO| | | | |   (| | | (_) |  _) :_
 OoOoO ._, ._:_:_,\_._,  .__,_:_, \___)
                 Phoebe 0.10.0~ee2a37cf
Hello world!

$ ../../unikraft/support/scripts/qemu-guest -W -k build/app-helloworld_kvm-x86_64
SeaBIOS (version 1.13.0-1ubuntu1.1)

iPXE (http://ipxe.org) 00:03.0 CA00 PCI2.10 PnP PMM+07F8C8A0+07ECC8A0 CA00

Booting from ROM..Powered by
o.   .o       _ _               __ _
Oo   Oo  ___ (_) | __ __  __ _ ' _) :_
oO   oO ' _ `| | |/ /  _)' _` | |_|  _)
oOo oOO| | | | |   (| | | (_) |  _) :_
 OoOoO ._, ._:_:_,\_._,  .__,_:_, \___)
                 Phoebe 0.10.0~ee2a37cf
Hello world!
```

See [here](docs/operations/plats/kvm/#build-and-run-unikraft-on-kvm-using-make-and-qemu) for further information on running the unikernel with `KVM`.

### Clean the Build Files

To remove the build files of the application, we can run:

```console
$ make clean
make[1]: Entering directory '[...]/my-unikernel/unikraft'
  CLEAN   libkvmplat
  CLEAN   libkvmpci
  CLEAN   libkvmvirtio
[...]
```

This will keep the fetched files and delete everything else that was generated during the build step.
If we want to also remove the fetched files we can use:

```console
$ make properclean
make[1]: Entering directory '[...]/my-unikernel/unikraft'
  RM      build/
make[1]: Leaving directory '[...]/my-unikernel/unikraft'
```

We can also remove the generated configuration files by using:

```console
$ make distclean
make[1]: Entering directory '[...]/my-unikernel/unikraft'
  RM      build/
  RM      config
make[1]: Leaving directory '[...]/my-unikernel/unikraft'
```

## Extending the Build

The build above was the simplest one we can do with Unikraft - configuring, building and running `app-helloworld`.
Often, we want to extend the build:

* [Add external libraries](docs/usage/make_build/#add-external-libraries-to-the-build) (e.g. [`lwip`](https://github.com/unikraft/lib-lwip), [`musl`](https://github.com/unikraft/lib-musl)).
* [Add new source files to the build](docs/usage/make_build/#add-new-source-files-to-the-build).
* [Use different configuration options](docs/usage/make_build/#use-different-configuration-options).

### Add External Libraries to the Build

Notice that the `app-helloworld/` directory already contains a `Makefile` that looks like this:

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
Since the `helloworld` application uses [`nolibc`](https://github.com/unikraft/unikraft/tree/staging/lib/nolibc) as the C library, which comes with the Unikraft core, we do not have any external dependencies.
We thus do not have to download or reference any libraries in the `Makefile` and can leave the `LIBS` variable empty.

When the application becomes more complex, it is likely that not all functionality is included in the Unikraft core repository.
As you might have noticed already from the code organization in the core repository (`lib/*`), Unikraft puts an emphasis on encapsulating functionality in libraries that can be easily added, removed, or replaced to tailor the unikernel to the application's needs.

To add a library, clone it into the `libs/` directory created earlier.
In this example, we add the `lightweight IP` (`lwip`) network stack [`lib-lwip`](https://github.com/unikraft/lib-lwip):

```console
$ cd ../../libs/
$ git clone https://github.com/unikraft/lib-lwip
```

Next, we reference the library in the `Makefile` of `app-helloworld`, making it available for selection in the configuration:

```Makefile
UK_LIBS ?= $(PWD)/../../libs
LIBS := $(UK_LIBS)/lib-lwip
```

We can now re-run

```console
$ make menuconfig
```

and select `lwip` in the `Library Configuration` sub-menu.
Don't forget to also select the `KVM` platform:
in the `Platform Configuration` submenu select `KVM guest`.
We can then rebuild the unikernel:

```console
$ make clean
$ make prepare
$ make
```

The `prepare` step gives the build system the chance to pull the actual source code for `lwip` and apply necessary patches to make it work with Unikraft.
This has to be done only once after adding a new library.

### Add New Source Files to the Build

To add new source files to the build, we add them to the `Makefile.uk` file.
We can choose to add source files only if certain configuration options are set.

```makefile
$(eval $(call addlib,apphelloworld))

APPHELLOWORLD_SRCS-y += $(APPHELLOWORLD_BASE)/main.c
APPHELLOWORLD_SRCS-$(CONFIG_APPHELLOWORLD_LOGGER) += $(APPHELLOWORLD_BASE)/logger.c
```

This will add the `logger.c` source file to the build system only if the `CONFIG_APPHELLOWORLD_LOGGER` option is enabled in the configuration step.
We will discuss how to add the new configuration option below.

### Use Different Configuration Options

We can edit the `Config.uk` file to add additional dependencies and configuration options.

```kconfig
### Invisible option for dependencies
config APPHELLOWORLD_DEPENDENCIES
        bool
        default y
        select PLAT_KVM
        select LIBLWIP

config APPHELLOWORLD_LOGGER
        bool "Add the logger to the build system"
        default n
```

This will automatically select the `KVM` platform and the `lwip` external library and create a new configuration option that can be set in the `Application Options` screen in the `menuconfig`.

{{< img
      class="w-auto mx-auto"
      src="/assets/imgs/new-app-option.png"
      position="center"
>}}

For more detailed information about using and configuring the build system, refer to the [porting page](docs/develop/porting/).

## Example: Using Make with `app-helloworld-cpp`

Following the [steps above](docs/usage/make_build/#building-app-helloworld-with-make), we will set up, configure, build and run the [`app-helloworld-cpp` application](https://github.com/unikraft/app-helloworld-cpp).

To create the setup, we will start with the following directory structure:

```text
my-unikernel/
	|-- apps/
	|   `-- app-helloworld-cpp/     <- helloworld-cpp application
	|-- libs/                       <- additional libraries go here
	`-- unikraft/                   <- Unikraft core
```

We can do this by executing the following sequence of commands:

```console
$ mkdir my-unikernel
$ cd my-unikernel
$ git clone https://github.com/unikraft/unikraft
$ mkdir libs
$ cd libs
$ git clone https://github.com/unikraft/lib-musl musl
$ git clone https://github.com/unikraft/lib-libunwind libunwind
$ git clone https://github.com/unikraft/lib-libcxx libcxx
$ git clone https://github.com/unikraft/lib-libcxxabi libcxxabi
$ git clone https://github.com/unikraft/lib-compiler-rt compiler-rt
$ cd ..
$ mkdir apps
$ cd apps
$ git clone https://github.com/unikraft/app-helloworld-cpp
$ cd app-helloworld-cpp
```

We can see that there is no `Makefile`, so we create one and add the external dependencies:

```Makefile
UK_ROOT ?= $(PWD)/../../unikraft
UK_LIBS ?= $(PWD)/../../libs
LIBS := $(UK_LIBS)/musl:$(UK_LIBS)/libunwind:$(UK_LIBS)/libcxx:$(UK_LIBS)/libcxxabi:$(UK_LIBS)/compiler-rt

all:
	@$(MAKE) -C $(UK_ROOT) A=$(PWD) L=$(LIBS)

$(MAKECMDGOALS):
	@$(MAKE) -C $(UK_ROOT) A=$(PWD) L=$(LIBS) $(MAKECMDGOALS)
```

There is already a `Makefile.uk` file present in the repository, containing the rule that adds the application to the build system and the source files:

```Makefile
$(eval $(call addlib,apphelloworldcpp))

APPHELLOWORLDCPP_SRCS-y += $(APPHELLOWORLDCPP_BASE)/helloworld.cpp
```

After that, we configure the application.
To do that, we can create a `Config.uk` file that contains the application dependencies:

```kconfig
config APPHELLOWORLD_CPP_DEPENDENCIES
	bool
	default y
	select PLAT_KVM
	select LIBMUSL
	select LIBCXX
	select LIBCOMPILER_RT
```

Then we can run `make menuconfig`, and just save the configuration.
Nothing else is needed, because required options are loaded from the `Config.uk` file.

In case there is no `Config.uk` file, we can still create the configuration, but manually, by running `make menuconfig` and selecting the required options.

After we configured the application, we can build it:

```console
$ make
make[1]: Entering directory '[...]/my-unikernel/unikraft'
  MKDIR   lxdialog
  MAKE    kconfig
[...]
  GZ      app-helloworld-cpp_kvm-x86_64.gz
  LN      app-helloworld-cpp_kvm-x86_64.dbg.gdb.py
  GEN     uk-gdb.py
make[1]: Leaving directory '[...]/my-unikernel/unikraft'
```

To run the application, we use the `qemu-guest` script:

```console
$ ../../unikraft/support/scripts/qemu-guest -k build/app-helloworld-cpp_kvm-x86_64
SeaBIOS (version 1.13.0-1ubuntu1.1)

iPXE (http://ipxe.org) 00:03.0 CA00 PCI2.10 PnP PMM+07F8C8A0+07ECC8A0 CA00

Booting from ROM..Powered by
o.   .o       _ _               __ _
Oo   Oo  ___ (_) | __ __  __ _ ' _) :_
oO   oO ' _ `| | |/ /  _)' _` | |_|  _)
oOo oOO| | | | |   (| | | (_) |  _) :_
 OoOoO ._, ._:_:_,\_._,  .__,_:_, \___)
                 Phoebe 0.10.0~ee2a37cf
Hello world!
```

or the `qemu-system-x86_64` command:

```console
$ sudo qemu-system-x86_64 -enable-kvm -cpu host -nographic -kernel build/app-helloworld-cpp_kvm-x86_64
SeaBIOS (version 1.13.0-1ubuntu1.1)

iPXE (http://ipxe.org) 00:03.0 CA00 PCI2.10 PnP PMM+07F8C8A0+07ECC8A0 CA00

Booting from ROM..Powered by
o.   .o       _ _               __ _
Oo   Oo  ___ (_) | __ __  __ _ ' _) :_
oO   oO ' _ `| | |/ /  _)' _` | |_|  _)
oOo oOO| | | | |   (| | | (_) |  _) :_
 OoOoO ._, ._:_:_,\_._,  .__,_:_, \___)
                 Phoebe 0.10.0~ee2a37cf
Hello world!
```
