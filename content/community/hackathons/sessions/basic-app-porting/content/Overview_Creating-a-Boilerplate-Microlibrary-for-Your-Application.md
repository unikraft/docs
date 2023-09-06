To get started, we must create a new library for our application.
The premise here is that we are going to wrap or decorate the source code of `iperf3` with the _lingua franca_ of Unikraft's build system.
That is, when we eventually build the application, the Unikraft build system will understand where to get the source code files from, which ones to compile and how, with respect to the rest of Unikraft's internals and other dependencies.

Let's first start by initializing a working environment for ourselves:

1. Let's create a workspace with a typical Unikraft structure:

   ```console
   $ cd ~/workspace/
   $ mkdir app-iperf
   $ cd app-iperf/
   $ git clone https://github.com/unikraft/unikraft .unikraft/unikraft
   ```

   This will generate the necessary directory structure to build a new Unikraft application.
   When we list the directories, we should get something like this:

   ```console
   $ tree -a -L 3 --charset=ascii
   .
   `-- .unikraft
       `-- unikraft
         |-- arch
         |-- .checkpatch.conf
         |-- .clang-format
         |-- Config.uk
         |-- CONTRIBUTING.md
         |-- COPYING.md
         |-- .editorconfig
         |-- .git
         |-- .github
         |-- .gitignore
         |-- include
         |-- lib
         |-- Makefile
         |-- Makefile.uk
         |-- plat
         |-- README.md
         |-- support
         `-- version.mk

   9 directories, 11 files
   ```

1. Let's now create a library for `iperf3`.
   To do this, we must first retrieve some information about the program itself.
   First, we need to identify the latest version number of `iperf3`.
   GitHub tells us (as of the time of writing this tutorial) that this is `3.14`.

   Unikraft relies on the ability to download the source code of the `origin` code which is about to be compiled.
   Usually these are tarballs or zips.
   Ideally, we want to have a version number in the URL, so we can safely know the version being downloaded.

   We will initialise an empty external library by creating a very basic `Makefile.uk` file, containing our name and email, along with the library source code link and version, and a `Config.uk` file that will allow us to select the library from the `menuconfig` screen:

   ```console
   $ cd ~/workspace/app-iperf
   $ mkdir -p .unikraft/libs/iperf
   $ cd .unikraft/libs/iperf
   $ touch Makefile.uk
   $ touch Config.uk
   ```

   The `Makefile.uk` file should look something like this (you can use the [`lib-bzip2`](https://github.com/unikraft/lib-bzip2/blob/staging/Makefile.uk) library as a starting point, since it's `Makefile.uk` file it's quite minimal):

   ```make
   ################################################################################
   # Library registration
   ################################################################################
   $(eval $(call addlib_s,libiperf2,$(CONFIG_LIBIPERF2)))

   ################################################################################
   # Original sources
   ################################################################################
   LIBIPERF2_VERSION=1.0.8
   LIBIPERF2_BASENAME=iperf2-$(LIBIPERF2_VERSION)
   LIBIPERF2_URL=https://sourceware.org/pub/iperf2/$(LIBIPERF2_BASENAME).tar.gz
   $(eval $(call fetch,libiperf2,$(LIBIPERF2_URL)))
   ```

    The `Config.uk` file will contain one option that will allow us to later select the library from the `menuconfig` screen:

   ```kconfig
   config LIBIPERF3
     bool "lib iperf 3.14"
     default y
   ```

1. We can now create a simple application that will use the `iperf3` external library.
   We will create a `Makefile` file for our application:

   ```console
   $ cd ~/workdir/app-iperf/
   $ touch Makefile
   ```

   The `Makefile` should look similar to the one in the [`app-helloworld` repository](https://github.com/unikraft/app-helloworld/blob/staging/Makefile).

   ```make
   UK_ROOT ?= $(PWD)/.unikraft/unikraft
   UK_LIBS ?= $(PWD)/.unikraft/libs
   LIBS := $(UK_LIBS)/iperf

   all:
        @$(MAKE) -C $(UK_ROOT) A=$(PWD) L=$(LIBS)

   $(MAKECMDGOALS):
        @$(MAKE) -C $(UK_ROOT) A=$(PWD) L=$(LIBS) $(MAKECMDGOALS)
   ```

   The application will also need a `Makefile.uk` file, but we can leave that empty for now.

   ```console
   $ touch Makefile.uk
   ```

1. Finally, we can now see the `libperf3` option in the `make menuconfig` menu.

   ```console
   $ make menuconfig

   # Select Library Configuration --> lib iperf 3.14 and save

   $ make fetch
   make[1]: Entering directory '/tmp/usoc/app-iperf/.unikraft/unikraft'
   LN      Makefile
   WGET    libiperf3: https://github.com/esnet/iperf/archive/refs/tags/3.14.tar.gz
   /tmp/usoc/app-iperf/build/libiperf3/3.14.tar.gz          [  <=>                                                                                                                 ] 635,38K  2,66MB/s    in 0,2s
   UNTAR   libiperf3: 3.14.tar.gz
   make[1]: Leaving directory '/tmp/usoc/app-iperf/.unikraft/unikraft'
   ```

   You can see that running `make fetch` downloaded the source code of `libperf3`.

   ```console
   $ tree -L 2 build/libiperf3/
   build/libiperf3/
   |-- 3.14.tar.gz
   |-- origin
   |   `-- iperf-3.14
   `-- uk_clean_list

   2 directories, 2 files
   ```

   The next thing we need to do is provide source files that need to be built for `libiperf3` to work.
