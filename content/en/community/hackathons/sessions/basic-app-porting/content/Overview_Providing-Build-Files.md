Now we have everything set up.
We can start an iterative process of building the target unikernel with the application.
This process is usually very iterative because it requires building the unikernel step-by-step, including new files to the build, making adjustments, and re-building, etc.

1. The first thing we must do before we start is to check that fetching the remote code for `iperf3` is possible.
   Let's try and do this by running in our application workspace:

   ```bash
   $ cd ~/workspace/apps/iperf3
   $ kraft fetch
   ```

   If this is successful, we should see it download the remote `zip` file and we should see it saved within our Unikraft application's `build/`.
   The directory with the extracted contents should be located at:

   ```bash
   $ ls -lsh build/libiperf3/origin/iperf-3.10.1/
   ```
   ```
   total 988K
    12K -rw-r--r-- 1 root root 9.3K Jun  2 22:29 INSTALL
    12K -rw-r--r-- 1 root root  12K Jun  2 22:29 LICENSE
   4.0K -rw-r--r-- 1 root root   23 Jun  2 22:29 Makefile.am
    28K -rw-r--r-- 1 root root  26K Jun  2 22:29 Makefile.in
   8.0K -rw-r--r-- 1 root root 6.5K Jun  2 22:29 README.md
    32K -rw-r--r-- 1 root root  31K Jun  2 22:29 RELNOTES.md
   368K -rw-r--r-- 1 root root 365K Jun  2 22:29 aclocal.m4
   4.0K -rwxr-xr-x 1 root root 2.0K Jun  2 22:29 bootstrap.sh
      0 drwxr-xr-x 2 root root  260 Jun  2 22:29 config
   496K -rwxr-xr-x 1 root root 494K Jun  2 22:29 configure
    12K -rw-r--r-- 1 root root  11K Jun  2 22:29 configure.ac
      0 drwxr-xr-x 2 root root  140 Jun  2 22:29 contrib
      0 drwxr-xr-x 3 root root  280 Jun  2 22:29 docs
      0 drwxr-xr-x 2 root root  120 Jun  2 22:29 examples
   4.0K -rw-r--r-- 1 root root 3.0K Jun  2 22:29 iperf3.spec.in
   4.0K -rwxr-xr-x 1 root root 1.2K Jun  2 22:29 make_release
      0 drwxr-xr-x 2 root root  980 Jun  2 22:29 src
   4.0K -rwxr-xr-x 1 root root 1.9K Jun  2 22:29 test_commands.sh
   ```

   If this has not worked, you must fiddle with the preamble at the top of the library's `Makefile.uk` to ensure that correct paths are being set.
   Remove the `build/` directory and try `fetching` again.

1. Now that we can fetch the remote sources, `cd` into this directory and perform the `./configure` step as above.
   This will do two things for us.
   The first is that it will generate (and this is very common for C-based programs) a `config.h` file.
   This file is a list of macro flags which are used to include or exclude lines of code by the preprocessor.
   If the program has one of these, we need it.

   `iperf3` has an `iperf_config.h` file, so let's copy this file into our Unikraft port of the application.
   Make an `include/` directory in the library's repository and copy the file:

   ```
   $ mkdir ~/workspace/libs/iperf3/include
   $ cp build/libiperf3/origin/iperf-3.10.1/src/iperf_config.h ~/workspace/libs/iperf3/include
   ```

   Let's indicate in the `Makefile.uk` of the Unikraft library for `iperf3` that this directory exists:
   ```Makefile
   LIBIPERF3_CINCLUDES-y += -I$(LIBIPERF3_BASE)/include
   ```

   We'll come back to `iperf_config.h`: likely it needs edits from us to turn features on or off depending on availability or applicability based on the unikernel-context.
   We can also wrap build options here (see [exercise 2](#02-add-fortunes-to-unikrafts-boot-sequence)).

1. Next, let's run `make` with a special flag:

   ```bash
   $ cd build/libiperf3/origin/iperf-3.10.1/
   $ make -n
   ```

   This flag, `-n`, has just shown us what `make` will run, the full commands for `gcc` including flags.
   What's interesting here is any line which starts with:

   ```
   $ echo "  CC      "
   ```

   These are lines which invoke `gcc`.
   We can gather a few pieces of information here, namely the flags and list of files we need to make `iperf3` a reality.

1. Let's start by setting global flags for `iperf3`.
   The rule of thumb here is that we copy the flags which are used in all invocations of `gcc` and place them within the `Makefile.uk`.
   We should ignore flags to do with optimization, PIE, shared libraries and standard libraries as Unikraft has global build options for these.
   Flags which are usually interesting are to do with suppressing warnings, e.g. things that start with `-W`, and are application-specific.
   There doesn't seem to be anything immediately obvious for `iperf3`.
   However, in a later step, we'll find out that we can set some flags.
   If you do have flags which are immediately obvious, you set them like so in the library port's `Makefile.uk`, for example:

   ```Makefile
   LIBIPERF3_CFLAGS-y += -Wno-unused-parameter
   ```

1. We have a full list of files for `iperf3` from step 3.
   We can add them as known source files like so to the Unikraft port of `iperf3`'s `Makefile.uk`:

   ```Makefile
   LIBIPERF3_SRCS-y += $(LIBIPERF3_SRC)/main.c
   LIBIPERF3_SRCS-y += $(LIBIPERF3_SRC)/cjson.c
   LIBIPERF3_SRCS-y += $(LIBIPERF3_SRC)/iperf_api.c
   LIBIPERF3_SRCS-y += $(LIBIPERF3_SRC)/iperf_error.c
   ...
   ```

   **Note:** The path in the variable `LIBIPERF3_SRC` may need to be adjusted from the boilerplate code to match the layout of the application you are porting.

   **Tip:** It's best to add these files iteratively, i.e. one by one, and attempt the compilation process (step 5) in between adding all files.
   This will show you errors about what's missing and you can accurately determine which files are truly necessary for the build.
   In addition to this, we can also find intermittent errors which will be the result of incompatibilities between Unikraft and the application in question (covered in the next section on making patches).

1. Now that we have added all the source files, let's try and build the application!  This step, again, usually occurs iteratively along with the previous step of adding a new file one by one.
   Because the application has been configured and we have fetched the contents, we can simply try running the build in the Unikraft application directory:

   ```bash
   $ cd ~/workspace/apps/iperf3
   $ kraft build
   ```

1. (Optional) This step occurs less frequently, but is still useful to discuss in the context of porting an application to Unikraft.
   Remember in [the Unikraft build lifecycle](community/hackathons/sessions/basic-app-porting/#the-unikraft-build-lifecycle) that there is a step which occurs between fetching the remote original code and compiling it. This step (3), known as `prepare`, is used to make modifications to the origin code before it is compiled.
   This may be useful for applications which have complex build systems or auxiliary files which need to be created or modified before they are built.
   Examples for preparing include:

   * Running scripts which generate new source files from templates
   * Compiling files preemptively before Unikraft starts building source files
   * Checking for additional tools or building additional tools which are required to build the library
   * Advanced patching techniques to the source files of the library which make changes to it in a non-standard way

   Preparation is done by adding Make targets to the `UK_PREPARE` variable:

   ```Makefile
   UK_PREPARE += mytarget
   ```

   Checking whether the library has been prepared or adding a target which requires preparation before it can be executed is as simple as checking whether the following target exists:

   ```Makefile
   $(LIBIPERF3_BUILD)/.patched
   ```

   The `prepare` step is called naturally because of this target.
   However, it can be called separately from `kraft` via:

   ```bash
   $ kraft prepare
   ```

The steps outlined above helped us begin the process of porting a simple application to Unikraft.
It covers the major steps involved in the process of porting `from first principles`, including addressing all the steps in the construction lifecycle of Unikraft unikernels.

There are occasional caveats to this process, however.
This is to do with the context of the `unikernel model`, that is single-purpose OSes with a single address space, acting in a single process without context switches or costly syscalls.
Applications developed for Linux user space make a number of assumptions about its runtime, for example:

* That all syscalls are available (which is not the case for Unikraft, although there is significant work being done to bring more syscalls to Unikraft)
* That the filesystem is complete
* That P in POSIX is _not_ silent: Unfortunately it is and Unix-type systems do not always adhere to standards and make their own assumptions
  For example, oftentimes there are differences between Linux and BSD-type OSes which need to be accounted for
* That all features are necessary

In the next section we address how we can make changes to the application before it is compiled by the Unikraft build system in order to address the points above.
