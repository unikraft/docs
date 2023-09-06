---
title: Porting
date: 2020-01-11T14:09:21+09:00
draft: false
weight: 402
# collapsible: true
---

## Porting an Application or Library to Unikraft

_Segments of this tutorial were developed as part of the [Unikraft Summer of Code (2021)](https://usoc21.unikraft.org)_.

As we dive into the methods by which you may introduce a new application within the Unikraft ecosystem, the process becomes rather easy.
If you want to port a standard Linux user-space program (for which you have the source code) to operate as a single, customized unikernel, this guide will teach you how to do it correctly.

The scope of this tutorial only covers how to bring an application to Unikraft "from first principles" (i.e. before porting the app into Unikraft, you have access to the source code and can compile it natively for Linux user space).
The best applications you can port are open-source, such as NGINX, Redis, etc.
Of course, you can work with code that is not open-source, but again, you need access to the source files and the build tools beforehand.

For the sake of simplicity, this tutorial will only be targeting C/C++ applications.
Unikraft supports other compile-time languages, such as Golang, Rust, and WASM.
Many of the principles in this tutorial, however, can be applied in the same way for the mentioned languages, with a bit of context-specific work.
Namely, this may include additional build rules for target files, using specific compilers and linkers, etc.

It is worth noting that we are only targeting compile-time applications in this tutorial.
Applications written in a runtime language, such as Python or Lua, require an interpreter which must be brought to Unikraft first.
There are already lots of these high-level languages supported by Unikraft.
If you wish to run an application written in such a language, please check out the list of available applications.
However, if the language you wish to run is interpreted and not yet available on Unikraft, porting the interpreter would be in the scope of this tutorial, as the steps here would cover the ones needed to bring the interpreter, which is a program after all, as an Unikraft unikernel application.

{{< alert theme="info" >}}
In the case of higher-level languages which are interpreted, you do not need to follow this tutorial.
Instead, simply mount the application code with the relevant Unikernel binary.
For example, mounting a directory with python code to the python Unikraft unikernel.
Please review [Session 04: Complex Applications](/docs/sessions/04-complex-applications/index.md) for more information on this topic.
{{< /alert >}}

### Starting with a Linux User Space Build

For this tutorial, we will be targeting the network utility program [`iperf3`](https://github.com/esnet/iperf) as our application example we wish to bring to Unikraft.
`iperf3` is a benchmarking tool, and is used to determine the bandwidth between a client and server.
It is an excellent application to be run as an Unikernel for several reasons:

1. It can run as a "server-type" application, receiving and processing requests for clients;
1. It is a standalone tool which does one thing;
1. It's [GNU Make](https://www.gnu.org/software/make/) and C-based;
1. And it's quite useful :)

Understanding some aspects of how an application works, particularly how it is built, is required when bringing it to Unikraft.
Usually during the porting process we also end up diving through the source code, and in the worst-case scenario, have to make a change to it.
More on this is covered in the [Patching](docs/develop/porting/#patching-the-application) section.

Let's start by simply trying to follow the steps to compile the application from source.

### Compiling the Application from Source

The [`README`](https://github.com/esnet/iperf/blob/master/README.md) for the `iperf3` program has relatively simple build instructions, and uses GNU Make which is a first good sign.
Unikraft uses GNU Make to handle its internal builds and so when we see an application using Make, it makes porting a little easier.
For non-Make type build tools (such as CMake, Bazel, etc.) it is still possible to bring this application to Unikraft, but the flags, files, and compile-time options and other items will have to be considered with more care as they do not necessarily align in the same ways.
It is still possible to bring an application using an alternative build tool, but you must closely follow how the program is built-in order to bring it to Unikraft.

Let's walk through the build process of `iperf3` from its `README`:

1. First we obtain the source code of the application:

   ```console
   $ git clone https://github.com/esnet/iperf.git
   ```

1. Then, we are asked to configure and build the application:

   ```console
   $ cd ./iperf
   $ ./configure
   $ make
   ```

If this has worked for you, your terminal will be greeted with several pieces of useful information:

The first thing we did was run `./configure`: an auto-generated utility program part of the [`automake`](https://www.gnu.org/software/automake/) build tool.
Essentially, it checks the compatibility of your system and the program in question.
If everything went well, it will tell us information about what it checked and what was available.
Usually this "`./configure`"-type program will raise any issues when it finds something missing.
One of the things it is checking is whether you have relevant shared libraries (e.g. `.so` files) installed on your system which are necessary for the application to run.
The application will be dynamically linked to these shared libraries and they will be referenced at runtime in a traditional Linux user space manner.
If something is missing, usually you must use your Linux-distro's package manager to install this dependency, such as `apt-get`.

The `./configure` program also comes with a useful `--help` page where we can learn about which features we would like to turn on and off before the build.
It's useful to study this page and see what is available, as these can later become build options for the application when it is brought to the Unikraft ecosystem.
The only thing to notice in the case of `iperf3` is that it uses [OpenSSL](https://www.openssl.org).
Unikraft already has a [port of OpenSSL](https://github.com/unikraft/lib-openssl), which means we do not have to port this before starting.
**If, however, there are library dependencies for the target application which do not exist within the Unikraft ecosystem, then these library dependencies will need to be ported first before continuing.**
This tutorial also applies to porting libraries to Unikraft.

When we next run `make` in the sequence above, we can see the intermediate object files which are compiled during the compilation process before `iperf3` is finally linked together to form a final Linux user space binary application.
It can be useful to note these files down, as we will be compiling these files with respect to Unikraft's build tools.

You have now built `iperf3` for Linux user space and we have walked through the build process for the application itself.
In the next section, we prepare ourselves to bring this application to Unikraft.

### Setting up Your Workspace

Applications which are brought to Unikraft are actually libraries.
Everything in Unikraft is "librarized", even applications are a form of library: they are a single component which interact with other components; have their own options and build files; and, interact in the same ways in which libraries interact with each other.
The "main" difference between actual libraries and applications, is that we later invoke the application's entry point (e.g. `main` function).
The different ways to do this are covered later in this tutorial.

### Creating a Boilerplate Microlibrary for Your Application

To get started, we must create a new library for our application.
The premise here is that we are going to "wrap" or "decorate" the source code of `iperf3` with the _lingua franca_ of Unikraft's build tool.
That is, when we eventually build the application, the Unikraft build tool will understand where to get the source code files, which ones to compile and how, with respect to the rest of Unikraft's internals and other dependencies.

Let's first start by initializing a working environment for ourselves:

1. Let's create a workspace with a typical Unikraft structure using `kraft`:

   ```console
   $ cd ~/workspace
   $ export UK_WORKDIR=$(pwd)
   $ kraft list update
   $ kraft list pull unikraft@staging
   ```

   This will generate the necessary directory structure to build a new Unikraft application, and will also download the latest `staging` branch of Unikraft's core.
   When we list the directories, we should get something like this:

   ```console
   $ tree -L 1
   .
   |-- apps
   |-- archs
   |-- libs
   |-- plats
   `-- unikraft

   5 directories, 0 files
   ```

1. Let's now create a library for `iperf3`.
   We can use `kraft` to initialize some boilerplate for us too.
   To do this, we must first retrieve some information about the program itself.
   First, we need to identify the latest version number of `iperf3`.
   GitHub tells us (as of the time of writing this tutorial) that this is `3.10.1`.

   Unikraft relies on the ability to download the source code of the "origin" code which is about to be compiled.
   Usually these are tarballs or zips.
   Ideally, we want to have a version number in the URL so we can safely know the version being downloaded.
   However, if the source code is on GitHub, which it is in the case of `iperf3`, then `kraft` can figure this out for us.

   We can now use `kraft` to initialize a template library for us:

   ```console
   $ cd ~/workspace/libs
   $ kraft lib init \
      --no-prompt \
      --author-name "Your Name" \
      --author-email "your@email.com" \
      --version 3.10.1 \
      --origin https://github.com/esnet/iperf \
      iperf3
   ```

   `kraft` will have now generated a new Git repository in `~/workspace/libs/iperf3` which contains some of the necessary files used to create an external library.
   It has also checked out the repository with a default branch of `staging` and created a blank (empty) commit as the base of the repository.
   This is standard practice for Unikraft repositories.

   {{< alert theme="info" >}}
   Our new library is called `libiperf3` to Unikraft.
   The last argument of `kraft lib init` will simply prepend `lib` to whatever string name you give it.
   If you are porting a library which is called `libsomething`, still pass the full name to `kraft`, it will replace instances of `liblibsomething` with `libsomething` during the initialization of the project where appropriate.
   {{< /alert >}}

1. The next step is to register this library with `kraft` such that we can use it and manipulate it with the `kraft` toolchain. To do this, simply add the path of the newly initialized library like so:

   ```console
   $ kraft list add ~/workspace/libs/iperf3
   ```

   This will modify your `.kraftrc` file with a new local library.
   When you have added this library directory, run the update command so that `kraft` can realize it:

   ```console
   $ kraft list update
   ```

1. You should now be able to start using this boilerplate library with Unikraft and `kraft`.
   To view basic information about the library and to confirm everything has worked, you can run:

   ```console
   $ kraft list show iperf3
   ```

### Using Your Library in a Unikraft Unikernel Application

Now that we have a library set up in `iperf3`'s name, located at `~/workspace/libs/iperf3`, we should immediately start using it so that we can start the porting.

To do this, we create a parallel application which uses both the library we are porting and the Unikraft core source code.

1. First start by creating a new application structure, which we can do by initializing a blank project:

   ```console
   $ cd ~/workspace/apps
   $ kraft init iperf3
   ```

1. We will now have an "empty" initialized project; you'll find boilerplate in this directory, including a `kraft.yaml` file which will look something like this:

   ```console
   $ cd ~/workspace/apps/iperf3
   $ cat kraft.yaml
   ```

   ```yaml
   specification: '0.5'
   unikraft: staging
   targets:
      - architecture: x86_84
        platform: kvm
   ```

1. After setting up your application project, we should add the new library we are working on to the application. This is done via:

   ```console
   $ kraft lib add iperf3@staging
   ```

   {{< alert theme="info" >}}
   Remember that the default branch of the library is `staging` from the `kraft lib init` command used above.
   If you change branch or use an alternative `--initial-branch`, set it in this step.
   {{< /alert >}}

   This command will update your `kraft.yaml` file:

   ```diff
   diff --git a/kraft.yaml b/kraft.yaml
   index 33696bb..c14e480 100644
   --- a/kraft.yaml
   +++ b/kraft.yaml
   @@ -6,3 +6,6 @@ unikraft:
   targets:
      - architecture: x86_64
        platform: kvm
   +libraries:
   +  iperf3:
   +    version: staging
   ```

1. We are ready to configure the application to use the library.
   It should be possible to now see the boilerplate `iperf3` library within the [`menuconfig`](https://en.wikipedia.org/wiki/Menuconfig) system by running:

   ```console
   $ kraft menuconfig
   ```

   within the application folder.
   However, it will also be selected automatically since it is in the `kraft.yaml` file now if you run the configure step:

   ```console
   $ kraft configure
   ```

   By default, the application targets `kvm` on `x86_64`.
   Adjust appropriately for your use case either by updating the `kraft.yaml` file or by setting it the `menuconfig`.

In the next section, we study the necessary files in the workspace and how we can modify them to bring `iperf3` into life with Unikraft.

### Providing Build Files

Now we have everything set up.
We can start an iterative process of building the target unikernel with the application.
This process is usually very iterative because it requires building the unikernel step-by-step, including new files to the build, making adjustments, and re-building, etc.

1. The first thing we must do before we start is to check that `fetch`ing the remote code for `iperf3` is possible.
   Let's try and do this by running in our application workspace:

   ```console
   $ cd ~/workspace/apps/iperf3
   $ kraft fetch
   ```

   If this is successful, we should see it download the remote zip file and we should see it saved within our Unikraft application's `build/`.
   The directory with the extracted contents should be located at:

   ```console
   $ ls -lsh build/libiperf3/origin/iperf-3.10.1/
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
   Remove the `build/` directory and try `fetch`ing again.

1. Now that we can fetch the remote sources, `cd` into this directory and perform the `./configure` step as above.
   This will do two things for us.
   The first is that it will generate (and this is very common for C-based programs) a `config.h` file.
   This file is a list of macro flags which are used to include or exclude lines of code by the preprocessor.
   If the program has one of these, we need it.

   `iperf3` has an `iperf_config.h` file, so let's copy this file into our Unikraft port of the application.
   Make an `include/` directory in the library's repository and copy the file:

   ```console
   $ mkdir ~/workspace/libs/iperf3/include
   $ cp build/libiperf3/origin/iperf-3.10.1/src/iperf_config.h ~/workspace/libs/iperf3/include
   ```

   Let's indicate in the `Makefile.uk` of the Unikraft library for `iperf3` that
   this directory exists:

   ```Makefile
   LIBIPERF3_CINCLUDES-y += -I$(LIBIPERF3_BASE)/include
   ```

   We'll come back to `iperf_config.h`: likely it needs edits from us to turn features on or off depending on availability or applicability based on the unikernel-context.
   We can also wrap build options here.

1. Next, let's run `make` with a special flag:

   ```console
   $ cd build/libiperf3/origin/iperf-3.10.1/
   $ make -n
   ```

   This flag, `-n`, has just shown us what `make` will run; the full commands for `gcc` including flags.
   What's interesting here is any line which start with:

   ```console
   $ echo "  CC      "
   ```

   These are lines which invoke `gcc`.
   We can gather a few pieces of information here, namely the flags and list of files we need to make `iperf3` a reality.

1. Let's start by setting global flags for `iperf3`.
   The rule of thumb here is that we copy the flags which are used in all invocations of `gcc` and place them within the `Makefile.uk`.
   We should ignore flags to do with optimization, PIE, shared libraries and standard libraries as Unikraft has global build options for these.
   Flags which are usually interesting are to do with suppressing warnings (e.g. things that start with `-W`, and are application-specific).
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

   {{< alert theme="info" >}}
   The path in the variable `LIBIPERF3_SRC` may need to be adjusted from the boilerplate code to match the layout of the application you are porting.
   {{< /alert >}}

   {{< alert theme="info" >}}
   It's best to add these files iteratively (i.e. one-by-one) and attempt the compilation process (step 5) in between adding all files.
   This will show you errors about what's missing and you can accurately determine which files are truly necessary for the build.
   In addition to this, we can also find intermittent errors which will be the result of incompatibilities between Unikraft and the application in question (covered in the next section on making patches).
   {{< /alert >}}

1. Now that we have added all the source files, let's try and build the application!
   This step, again, usually occurs iteratively along with the previous step of adding a new file one-by-one.
   Because the application has been `configure`d and we have `fetch`ed the contents, we can simply try running the build in the Unikraft application directory:

   ```console
   $ cd ~/workspace/apps/iperf3
   $ kraft build
   ```

1. (Optional) This step occurs less frequently, but is still useful to discuss in the context of porting an application to Unikraft.
   Remember in [the Unikraft build lifecycle](./docs/concepts/build-process/) that there is a step which occurs between fetching the remote origin code and compiling it.
   This step (3), known as `prepare`, is used to make modifications to the origin code before it is compiled.
   This may be useful for applications which have complex build tools or auxiliary files which need to be created or modified before they are built.
   Examples for `prepare`ing include:

   * Running scripts which generate new source files from templates;
   * Compiling files preemptively before Unikraft starts `build`ing source files;
   * Checking for additional tools or building additional tools which are required to build the library; and,
   * Advanced patching techniques to the source files of the library which make changes to it in a non-standard way.

   Preparation is done by adding Make targets to the `UK_PREPARE` variable:

   ```Makefile
   UK_PREPARE += mytarget
   ```

   Checking whether the library has been `prepare`d or adding a target which requires preparation before it can be executed is as simple as checking whether the following target exists:

   ```Makefile
   $(LIBIPERF3_BUILD)/.patched
   ```

   The `prepare` step is called naturally because of this target.
   However, it can be called separately from `kraft` via:

   ```console
   $ kraft prepare
   ```

The steps outlined above helped us begin the process of porting a simple application to Unikraft.
It covers the major steps involved in the process of porting "from first principles," including addressing all the steps in the construction lifecycle of Unikraft unikernels.

There are occasional caveats to this process, however.
This is to do with context of the "unikernel model", that is, single-purpose OSes with a single address space, acting in a single process without context switches or costly syscalls.
Applications developed for Linux user space make a number of assumptions about its runtime, for example:

* That all syscalls are available (which is not the case for Unikraft, although there is significant work being done to bring more syscalls to Unikraft);
* That the filesystem is complete;
* That P in POSIX is _not_ silent: Unfortunately it is and Unix-type systems do not always adhere to standards and make their own assumptions.
  For example, oftentimes there are differences between Linux and BSD-type OSes which need to be accounted for; and,
* That all features are necessary.

In the next section we address how we can make changes to the application before it is compiled by the Unikraft build tool in order to address the points above.

### Invoking the Application's `main` Method

Traditionally, and by explicit design, Linux user space code invokes a `main` method (or symbol) for the start-of-execution of application logic.
Unikraft is similar and invokes a [`weak`-ly attributed symbol](https://gcc.gnu.org/onlinedocs/gcc-4.3.5/gcc/Function-Attributes.html) for `main` in [its main thread](https://github.com/unikraft/unikraft/blob/staging/lib/ukboot/boot.c#L75).
This is done so that it can be easily overwritten so as to invoke true application-level functionality.
Without any `main` method, the unikernel will simply boot and exit.

All applications must implement the following standard prototype for `main`:

```c
/* Definition 1 */
int main(__((attribute unused))__ int argc, __((attribute unused))__ char *argv[]);
/* Definition 2 */
int main(int argc, char *argv[]);
/* Definition 3 */
int main(void);
```

1. The first definition simply indicates that the parameters may be unused within the function body (i.e. no command-line arguments _may_ be passed as the application makes no use of them).
1. The second is probably more familiar, with explicit use of command-line arguments.
1. Lastly, the third definition explicitly forgoes the use command-line arguments.

There are two ways to invoke the functionality of the application being ported to Unikraft.

#### Do Nothing and Let `main` be Invoked Automatically

If the application has a relatively simple `main` method with one of the prototypes defined above, we could simply leave it and it will be automatically invoked since it represents the only symbol named `main` in the final binary.
This requires the file to be recognised and compiled however, which is done by simply adding the file with the `main` method to the Unikraft port of the library's `Makefile.uk` as a new `_SRC-y` entry.

For `iperf3`, this is done by compiling in `main.c` which contains the `main` method:

```Makefile
LIBIPERF3_SRCS-y += $(LIBIPERF3_SRC)/main.c
```

#### Manually Invoking `main` with Glue Code

To increase extensibility or adapt the application to the context of a unikernel, we can perform a small trick to conditionally invoke the `main` method of the application as a compile-time option.
This is useful in different cases, for instance:

* In some cases where the `main` method for the application may be relatively complex and includes boilerplate code which is not applicable to the use case of a unikernel, it is possible invoke the relevant application-level functionality by calling another method within the application's source code (this is true in the case of, for example, the [Unikraft port of Python3](https://github.com/unikraft/lib-python3/blob/staging/main.c)).

* In other cases, we may wish to perform additional initialisation before the invocation of the application's `main` method (this is true in the case of, for example, the [Unikraft port of Redis](https://github.com/unikraft/lib-redis/blob/staging/main.c)).

* We wish to use the application as a library in the future for another application, and call APIs which it may expose.
  In this case, we do not wish to invoke the `main` method as it will conflict with the other application's `main` method.

In any case, we can rename the default `main` symbol in the application by using the `gcc` flag [`-D`](https://www.rapidtables.com/code/linux/gcc/gcc-d.html) during the pre-processing of the file which contains the method.
This flag allows us to define macros in-line, and we can simply introduce a macro which renames the `main` method to something else.

With `iperf3`, for example, we can rename the `main` method to `iperf3_main` by adding a new library-specific `_FLAGS-y` entry in `Makefile.uk`:

```Makefile
LIBIPERF3_IPERF3_FLAGS-y += -Dmain=iperf3_main
```

The resulting object file for `main.c` will no longer include a symbol named `main`.
At this point, when the final unikernel binary is linked, it will simply quit.
We must now provide another `main` method.

To conditionally invoke the application's now renamed `main` method, it is common to provide a new KConfig in the Unikraft library representing the port of the application's `Config.uk` file, asking whether to "provide the main method".
For example, with `iperf3`:

```KConfig
if LIBIPERF3
config LIBIPERF3_MAIN_FUNCTION
	bool "Provide main function"
	default n
endif
```

When this option is enabled, we can either:

1. Disable the use of the `-D` flag as indicated above, conditionally in the `Makefile.uk`:

   ```Makefile
   ifneq($(CONFIG_LIBIPERF3_MAIN_FUNCTION),y)
   LIBIPERF3_IPERF3_FLAGS-y += -Dmain=iperf3_main
   endif
   ```

1. Or more commonly, introduce a conditional file which provides `main` and invokes the renamed `main` (now `iperf3_main`) method from the library, for example:

   ```Makefile
   LIBIPERF3_SRCS-$(CONFIG_LIBIPERF3_MAIN_FUNCTION) += $(LIBIPERF3_BASE)/main.c|unikraft
   ```

   Notice how the filename is includes the suffix `|unikraft`.
   This is used to simply rename the resulting object file, which will become `main.unikraft.io`.

   The new `main.c` file as part of the library simply calls the renamed method:

   ```c
   int main(int argc, char *argv[])
   {
      return iperf3_main(argc, argv);
   }
   ```

### Patching the Application

Patching the application occasionally must occur to address incompatibilities with the context of a Linux user space application and that of the unikernel model.
It can also be used to introduce new features to the application, although this is more rare (although, [here is an example](https://github.com/unikraft/lib-newlib/blob/staging/patches/0010-enable-per-library-allocator-statistics.patch)).

#### Identifying a Change to the Application

Identifying a change to the application which requires a patch is sometimes quite subtle.
The process usually occurs during [steps 5 and 6 of providing build files](docs/develop/porting/#providing-build-files) of the application or library in question.
During this process, we are expected to see compile-time and link-time errors from `gcc` as we add new files to the build and make fixes.

The `iperf3` application port to Unikraft has four patches in order to make it work.
Let's discuss them and what they mean.
The next section discusses how to create one of these patches.

1. [The first patch](https://github.com/lancs-net/lib-iperf3/blob/staging/patches/0001-Fix-duplicate-import-of-netinet-tcp.h.patch) comes from an error which is thrown when compiling the `iperf_api.c` source file.
   This file is 3rd to be compiled from the list of complete source files.
   In this file, we are receiving a duplicate import of `<netinet/tcp.h>`, simply removing this import fixes it, so the patch addresses this issue.

1. [The second patch](https://github.com/lancs-net/lib-iperf3/blob/staging/patches/0002-Disable-SO_SNDBUF-and-SO_RCVBUF-checks.patch) comes as a result of [missing functionality from LwIP](https://github.com/lwip-tcpip/lwip/blob/b0e347158d8db640c6891f9f31f4e6d19dca200b/src/include/lwip/sockets.h#L220).
   The issue was discovered once the application was fully ported and was able to boot and run.
   When the initialization sequence was on-going between the client and server of `iperf3`, it would crash during this sequence because LwIP does not support setting this option.
   A patch was created simply to remove setting this option.
   (Note: this may not be the most sensible approach)

1. [The third patch](https://github.com/lancs-net/lib-iperf3/blob/staging/patches/0003-Set-the-temp-path-to-the-root.patch) arises from an assumption about the host environment and the difference between Linux user space and a unikernel.
   With a traditional host OS, we have a filesystem populated with known paths, for example `/tmp`.
   `iperf3` assumed this path exists, however, in the case of where no filesystem is provided to the unikernel during boot, which should be possible in some cases, the `iperf3` application would crash since `/tmp` does not exist beforehand.
   The patch solves this by setting the temporary (ramfs) path to `/`.
   An alternative solution is to make this path at boot.

1. Finally, [the fourth patch](https://github.com/lancs-net/lib-iperf3/blob/staging/patches/0004-Disable-use-of-mmap-and-replace-with-mmalloc-and-fr.patch) is once again to do with missing functionality from Unikraft.
   In this case, the syscalls [`mmap`](https://linux.die.net/man/2/mmap) and [`munmap`](https://linux.die.net/man/2/munmap) are missing.
   In this case, `iperf3` used `mmap` simply to statically allocate a region of memory.
   The trick used here is to simply replace instances of `mmap` with `malloc` and instances of `munmap` with `free`.

   **Note:** At the time writing this tutorial, [`mmap` and `munmap` are being actively worked on to be made available as syscalls in Unikraft](https://github.com/unikraft/unikraft/pull/247).

The above patches represent example use cases where patches may be necessary to fix the application when bringing it to Unikraft.
The possibilities presented in this tutorial are non-exhaustive, so take care.

The next section discusses in detail how to create a patch for the target
application or library.

#### Preparing a Patch for the Application

When a change is identified and is to be provided as a patch to the application or library during the compilation, it can be done using the procedure identified in this section.
Note that providing patches is an unfortunate workaround to the inherent differences between Linux user space applications and libraries and unikernels.

**Note:** When patches are created, they are also version-specific.
As such, if you update the library or application's code (i.e. by updating, for example, the version number of `LIBIPER3_VERSION`), patches may no longer be apply-able and will then need to be updated accordingly.

To make a patch:

1. First, ensure that the remote origin code has been downloaded to the application's `build/` folder:

   ```console
   $ cd ~/workspace/apps/iperf3
   $ kraft fetch
   ```

1. Once the source files have been downloaded, turn it into a Git repository and save everything to an initial commit, in the case of `iperf3`:

   ```console
   $ cd build/libiperf3/origin/iperf-3.10.1
   $ git init
   $ git add .
   $ git commit -m "Initial commit"
   ```

   This will allow us to make changes to the source files and save those differences.

1. After making changes, create a Git commit, where you briefly describe the change you made and why.
   This can be done through a number of successive steps, for example, as a result of having to make several changes to the application.

1. After your changes have been saved to the git log, export them as patches.
   For example, if you have made one (`1`) patch only, export it like so:

   ```console
   $ git format-patch HEAD~1
   ```

   This will save a new `.patch` file in the current directory; which should be the origin source files of `iperf3`.

1. The next step is to create a `patches/` folder within the Unikraft port of the library and to move the new `.patch` file into this folder:

   ```console
   $ mkdir ~/workspace/libs/iperf3/patches
   $ mv ~/workspace/apps/iperf3/build/libiperf3/origin/iperf-3.10.1/*.patch ~/workspace/libs/iperf3/patches
   ```

1. To register patches against Unikraft's build system such that they are applied before the compilation of all source files, simply indicate it in the library's `Makefile.uk`:

   ```Makefile
   # Add or edit ~/workspace/libs/iperf3/Makefile.uk
   LIBIPERF3_PATCHDIR = $(LIBIPERF3_BASE)/patches
   ```

This concludes the necessary steps to port an application to Unikraft "from first principles".

### Internals of the Unikraft Build System

As we saw above, Unikraft uses a set of files as part of the configuration and build steps.
When porting an application, you want to be aware of these files and tune them to your needs.
This section delves into the internals of the Unikraft build system and how they are useful for porting an application.

In order for an application or library to work with the [Unikraft `Make`-based build system](/docs/usage/make_build), you need to provide some specific files:

1. **Makefile**:
   Used to specify where the main Unikraft repository is with respect to the application's repository, as well as repositories for any external libraries the application needs to use.
   The `Makefile` is not required when porting an external library.

1. **Makefile.uk**:
   Used to specify which sources to build (and optionally where to fetch them from), include paths, flags and any application-specific targets.

1. **Config.uk**:
   A [Kconfig-like](https://www.kernel.org/doc/html/latest/kbuild/kconfig-language.html) snippet used to populate Unikraft's menu with application-specific options.

1. **exportsyms.uk**:
   A text file where each line contains the name of one symbol that should be exported to other libraries.
   This file usually contains only the `main()` function for an application that is developed/ported as a single library to Unikraft.
   If an `exportsyms.uk` file is not present, all symbols will be exported.

1. **extra.ld**:
   [Optional] Contains an amendment to the main linker script.

In the tutorial below, we will focus on files belonging to an application (i.e. not to a library).
The process of porting a library is very similar, just change the `APP` prefix of the variable names to `LIB`.

#### Makefile

The `Makefile` is generally short and simple and might remind you of Linux kernel modules that are built off-tree.
For most applications the `Makefile` should contain no more than the following:

```Makefile
UK_ROOT  ?= $(PWD)/../../unikraft
UK_LIBS  ?= $(PWD)/../../libs
UK_PLATS ?= $(PWD)/../../plats
LIBS  := $(UK_LIBS)/lib1:$(UK_LIBS)/lib2:$(UK_LIBS)/libN
PLATS ?=

all:
        @make -C $(UK_ROOT) A=$(PWD) L=$(LIBS) P=$(PLATS)

$(MAKECMDGOALS):
        @make -C $(UK_ROOT) A=$(PWD) L=$(LIBS) P=$(PLATS) $(MAKECMDGOALS)
```

You can notice that the `Makefile` is just a wrapper around the [Unikraft core `Makefile`](https://github.com/unikraft/unikraft/blob/staging/Makefile).
You can get the same result if you use:

```console
$ make -C ../../unikraft A=. L=../../libs/lib1:../../libs/lib2:../../libs/libN
```

#### Makefile.uk

The Unikraft build system provides a number of functions and macros to make it easier to write the `Makefile.uk` file.
Also, ensure that all variables that you define begin with `APP[NAME]_` or `LIB[NAME]_` (e.g., `APPHELLOWORLD_`) so that they are properly namespaced.

The first thing to do is to call [the Unikraft `addlib` function](https://github.com/unikraft/unikraft/blob/staging/support/build/Makefile.rules#L195) to register the application with the system (note the letters `lib`: everything in Unikraft is ultimately a library).
This function call will also populate `APPNAME_BASE` (containing the directory path to the application sources) and `APPNAME_BUILD` (containing the directory path to the application's build directory):

```Makefile
$(eval $(call addlib,appname))
```

where `name` would be replaced by your application's name.
In case your main application code should be downloaded as an archive from a remote server, the next step is to set up a variable to point to a URL with the application sources (or objects, or pre-linked libraries, see further below), and to call [the Unikraft `fetch` function](https://github.com/unikraft/unikraft/blob/staging/support/build/Makefile.rules#L456) to download and unpack those sources (`APPNAME_ORIGIN` is populated containing the directory path to the extracted files):

```Makefile
APPNAME_ZIPNAME = myapp-v0.0.1
APPNAME_URL = http://app.org/$(APPNAME_ZIPNAME).zip
$(eval $(call fetch,appname,$(APPNAME_URL)))
```

Next we set up a call to [the Unikraft `patch` function](https://github.com/unikraft/unikraft/blob/staging/support/build/Makefile.rules#L360).
Even if you don't have any patches yet, it's good to have this set up in case you need it later.

```Makefile
APPNAME_PATCHDIR=$(APPNAME_BASE)/patches
$(eval $(call patch,appname,$(APPNAME_PATCHDIR),$(APPNAME_ZIPNAME)))
```

With all of this in place, you can already start testing things out:

```console
$ make menuconfig
[choose appropriate options and save configuration, see user's guide]
$ make
```

You should see Unikraft downloading the application archive and unpacking it.
It will do the same for libraries specified in the `Makefile` or through the menu.
Libraries will then be built.
There will be nothing to build for your application yet, as we haven't specified any sources to build.
When building, Unikraft creates a `build/` directory and places all temporary and object files under it;
the application sources are placed under `build/origin/[tarballname]/`.

To tell Unikraft which source files to build, we add files to the `APPNAME_SRCS-y` variable:

```Makefile
APPNAME_SRCS-y += $(APPNAME_BASE)/path_to_src/myfile.c
```

For source files, Unikraft so far supports C (`.c`), C++ (`.cc`, `.cxx`, `.cpp`) and assembly files (`.s`, `.S`).

In case you have pre-compiled object files, you could add them (but due to possible incompatible compilation flags of your pre-compiled object files, you should handle this with care):

```Makefile
APPNAME_OBJS-y += $(APPNAME_BASE)/path_to_src/myobj.o
```

You can also use `APPNAME_OBJS-y` to add pre-built libraries (as `.o` or `.a`):

```Makefile
APPNAME_OBJS-y += $(APPNAME_BASE)/path_to_lib/mylib.a
```

Once you have specified all of your source files (and optionally binary files), it is generally also necessary to specify include paths and compile flags:

```Makefile
# Include paths
APPNAME_ASINCLUDES  += -I$(APPNAME_BASE)/path_to_include/include [for assembly files]
APPNAME_CINCLUDES   += -I$(APPNAME_BASE)/path_to_include/include [for C files]
APPNAME_CXXINCLUDES += -I$(APPNAME_BASE)/path_to_include/include [for C++ files]

# Flags for application sources
APPNAME_ASFLAGS-y   += -DFLAG_NAME1 ... -DFLAG_NAMEN [for assembly files]
APPNAME_CFLAGS-y    += -DFLAG_NAME1 ... -DFLAG_NAMEN [for C files]
APPNAME_CXXFLAGS-y  += -DFLAG_NAME1 ... -DFLAG_NAMEN [for C++ files]
```

With all of these in place, you can save `Makefile.uk`, and type `make`.
Assuming that the chosen Unikraft libraries provide all of the support that your application needs, Unikraft should compile and link everything together, and output one image per target platform specified in the menu.

In addition to all the functionality mentioned, applications might need to perform a number of additional tasks after the sources are downloaded and unpacked, but **before** the compilation takes place (e.g., run a configure script or a custom script that generates source code from source files).
To support this, Unikraft provides the [`UK_PREPARE` variable](https://github.com/unikraft/unikraft/blob/staging/Makefile#L278), connected to the internal [`prepare` target](https://github.com/unikraft/unikraft/blob/staging/Makefile#L708), which you can set to a temporary marker file and from there to a target in your `Makefile.uk` file.
For example:

```Makefile
$(APPNAME_BUILD)/.prepared: [dependencies to further targets]
       cmd && $(TOUCH) $@

UK_PREPARE += $(APPNAME_BUILD)/.prepared
```

In this way, you ensure that `cmd` is run before any compilation takes place.
If you use `fetch`, add `$(APPNAME_BUILD)/.origin` as dependency.
If you use `patch`, add `$(APPNAME_BUILD)/.patched` instead.

Further, you may find it necessary to specify compile flags or includes only for a _specific_ source file.
Unikraft supports this through the following syntax:

```Makefile
APPNAME_SRCS-y += $(APPNAME_BASE)/filename.c
APPNAME_FILENAME_FLAGS-y += -DFLAG
APPNAME_FILENAME_INCLUDES-y += -Iextra/include
```

It is also possible to compile a single source file multiple times with different flags.
For this case, Unikraft supports variants:

```Makefile
APPNAME_SRCS-y += $(APPNAME_BASE)/filename.c|variantname
APPNAME_FILENAME_VARIANTNAME_FLAGS-y += -DFLAG2
APPNAME_FILENAME_VARIANTNAME_INCLUDES-y += -Iextra/include
```

{{% alert theme="info" %}}
Note: The build system treats the reserved `isr` variant differently.
This variant is intended for build units that contain code that can also be called from interrupt context.
Separate global architecture flags are used to generate interrupt-safe code (`ISR_ARCHFLAGS-y` instead of `ARCHFLAGS-y`).
Generally, these flags avoid the use of extended machine units which aren't saved by the processor before entering interrupt context (e.g. floating point units, vector units).
{{% /alert %}}

Finally, you may also need to provide "glue" code, for instance to implement the `main()` function that Unikraft expects you to implement by calling your application's main or init routines.
As a rule of thumb, we suggest to place any such files in the application's main directory (`APPNAME_BASE`), and any includes they may depend on under `APPNAME_BASE/include/`.
And, of course, don't forget to add the source files and include path to `Makefile.uk`.

To see full examples of `Makefile.uk` files, you can browse the available repositories for [applications](https://github.com/search?q=topic%3Aunikraft-application+org%3Aunikraft&type=Repositories) or [external libraries](https://github.com/search?q=topic%3Alibrary+org%3Aunikraft&type=Repositories).

Reserved variable names in the name scope are so far:

```text
APPNAME_BASE                              - Path to source base
APPNAME_BUILD                             - Path to target build dir
APPNAME_EXPORTS                           - Path to the list of exported symbols
                                            (default is '$(APPNAME_BASE)/exportsyms.uk')
APPNAME_ORIGIN                            - Path to extracted archive
                                            (when fetch or unarchive was used)
APPNAME_CLEAN APPNAME_CLEAN-y             - List of files to clean additional
                                            on make clean
APPNAME_SRCS APPNAME_SRCS-y               - List of source files to be
                                            compiled
APPNAME_OBJS APPNAME_OBJS-y               - List of object files to be linked
                                            for the library
APPNAME_OBJCFLAGS APPNAME_OBJCFLAGS-y     - link flags (e.g., define symbols
                                            as internal)
APPNAME_CFLAGS APPNAME_CFLAGS-y           - Flags for C files of the library
APPNAME_CXXFLAGS APPNAME_CXXFLAGS-y       - Flags for C++ files of the library
APPNAME_ASFLAGS APPNAME_ASFLAGS-y         - Flags for assembly files of the
                                            library
APPNAME_CINCLUDES APPNAME_CINCLUDES-y     - Includes for C files of the
                                            library
APPNAME_CXXINCLUDES APPNAME_CXXINCLUDES-y - Includes for C++ files of the
                                            library
APPNAME_ASINCLUDES APPNAME_ASINCLUDES-y   - Includes for assembly files of
                                            the library
APPNAME_FILENAME_FLAGS                    - Flags for a *specific* source file
APPNAME_FILENAME_FLAGS-y                    of the library (not exposed to its
                                            variants)
APPNAME_FILENAME_INCLUDES                 - Includes for a *specific* source
APPNAME_FILENAME_INCLUDES-y                 file of the library (not exposed
                                            to its variants)
APPNAME_FILENAME_VARIANT_FLAGS            - Flags for a *specific* source file
APPNAME_FILENAME_VARIANT_FLAGS-y            and variant of the library
APPNAME_FILENAME_VARIANT_INCLUDES         - Includes for a *specific* source
APPNAME_FILENAME_VARIANT_INCLUDES-y         file and variant of the library
```

#### Config.uk

Unikraft's configuration system is based on [Linux's KConfig system](https://www.kernel.org/doc/html/latest/kbuild/kconfig-language.html).
With `Config.uk` you define possible configurations for your application and define dependencies to other libraries.
This file is included by Unikraft to render the menu-based configuration, and to load and store configurations (aka `.config`).
Each setting that is defined in this file will be globally populated as a set variable for all `Makefile.uk` files, as well as a defined macro in your source code when you use `"#include <uk/config.h>"`.
Please ensure that all settings are properly namespaced.
They should begin with `[APPNAME]_` (e.g. `APPHELLOWORLD_`).
Please also note that some variable names are predefined for each application or library namespace (see [`Makefile.uk`](docs/develop/porting/#makefileuk)).

As best practice, we recommend to begin the file with defining dependencies with an invisible boolean option that is set to `y` (i.e. an option that will not be visible in the `menuconfig` screen):

```kconfig
### Invisible option for dependencies
config APPHELLOWORLD_DEPENDENCIES
	bool
	default y
	# dependencies with `select`:
	select LIBNOLIBC if !HAVE_LIBC
	select LIB1
	select LIB2
```

In this example, `LIB1` and `LIB2` would be enabled (the user can't unselect them).
Additionally, if the user did not provide and select any `libc`, the Unikraft internal replacement `nolibc` would be selected.
You can find a documentation of the syntax in the [Linux kernel tree](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/plain/Documentation/kbuild/kconfig-language.txt).
Of course, you could also directly define a dependency on a particular `libc` (e.g., `libmusl`), instead.
You can also depend on feature flags (like `HAVE_LIBC`) to provide or hide options.
The feature flag `HAVE_LIBC` in this example is set as soon as a proper and full-fledged `libc` was selected by the user.
You can get an overview of available feature flags in `libs/Config.uk`.

Any other setting of your application can be a type of boolean, int, or string.
You are even able to define dropdown-selections.
See [the KConfig documentation](https://www.kernel.org/doc/html/latest/kbuild/kconfig-language.html) for details on the syntax.
Please note that Unikraft does not have tristates (the `m` option, for kernel modules, is not available).

```kconfig
  ### App configuration
  config APPHELLOWORLD_OPTION
  	bool "Boolean Option 1"
  	default y
  	help
  	  Help text of Option 1
```

#### exportsyms.uk

Unikraft provides separate namespaces for each library.
This means that every function and variable will only be visible and linkable internally.

To make a symbol visible for other libraries, add it to this `exportsyms.uk` file.
It is simply a flat file, with one symbol name per line.
Line comments may be introduced by the hash character (`#`).

If you are writing an application, you need to add your program entry point to this file.
Most likely nothing else should be there.
For a library, all external API functions must be listed.

For the sake of file structure consistency, it is not recommended to change the default path of this symbols file, unless it is really necessary (e.g., multiple libraries are sharing the same base folder, this symbols file is part of a remotely fetched archive).
You can override it by defining the `APPNAME_EXPORTS` variable.
The path must be either absolute (you can refer with `$(APPNAME_BASE)` to the base directory of your application sources) or relative to the Unikraft sources directory.

{{% alert theme="info" %}}
If no `exportsyms.uk` file is present within a given library (internal or external), all the symbols will be exported by default.
{{% /alert %}}

#### extra.ld

If your library/application needs a section in the final executable image, edit your `Makefile.uk` to add:

```Makefile
LIBYOURAPPNAME_SRCS-$(CONFIG_LIBYOURAPPNAME) += $(LIBYOURAPPNAME_BASE)/extra.ld
```

An example context of `extra.ld`:

```ld
SECTIONS
{
    .uk_fs_list : {
         PROVIDE(uk_fslist_start = .);
         KEEP (*(.uk_fs_list))
         PROVIDE(uk_fslist_end = .);
    }
}
INSERT AFTER .text;
```

This will add the section `.uk_fs_list` after the `.text` section.

## After Porting

After porting an application or library, you can share it with the rest of the community by creating a PR.
You can find more about that on the [contributing page](/docs/contributing/).
