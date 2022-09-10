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
Many of the principles in this tutorial, however, can be applied in the same way for the mentioned  languages, with a bit of context-specific work.
Namely, this may include additional build rules for target files, using specific compilers and linkers, etc.

It is worth noting that we are only targeting compile-time applications in this tutorial.
Applications written in a runtime language, such as Python or Lua, require an interpreter which must be brought to Unikraft first.
There are already lots of these high-level languages supported by Unikraft.
If you wish to run an application written in such a language, please check out the list of available applications.
However, if the language you wish to run is interpreted and not yet available on Unikraft, porting the interpreter would be in the scope of this tutorial, as the steps here would cover the ones needed to bring the interpreter, which is a program after all, as a Unikraft unikernel application.

{{< alert theme="info" >}}
In the case of higher-level languages which are interpreted, you do not need to follow this tutorial.
Instead, simply mount the application code with the relevant Unikernel binary.
For example, mounting a directory with python code to the python Unikraft unikernel.
Please review [Session 04: Complex Applications](/docs/sessions/04-complex-applications/index.md) for more information on this topic.
{{< /alert >}}

### Starting with a Linux User Space Build

For this tutorial, we will be targeting the network utility program [`iperf3`](https://github.com/esnet/iperf) as our application example we wish to bring to Unikraft.
`iperf3` is a benchmarking tool, and is used to determine the bandwidth between a client and server.
It is an excellent application to be run as a Unikernel for several reasons:

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

   ```bash
   git clone https://github.com/esnet/iperf.git
   ```

1. Then, we are asked to configure and build the application:

   ```bash
   cd ./iperf
   ./configure;
   make
   ```

If this has worked for you, your terminal will be greeted with several pieces of useful information:

1. The first thing we did was run `./configure`: an auto-generated utility program part of the [`automake`](https://www.gnu.org/software/automake/) build tool.
   Essentially, it checks the compatibility of your system and the program in question.
   If everything went well, it will tell us information about what it checked and what was available.
   Usually this "`./configure`"-type program will raise any issues when it finds something missing.
   One of the things it is checking is whether you have relevant shared libraries (e.g. `.so` files) installed on your system which are necessary for the application to run.
   The application will be dynamically linked to these shared libraries and they will be referenced at runtime in a traditional Linux user space manner.
   If something is missing, usually you must use your Linux-distro's package manager to install this dependency, such as `apt-get`.

   The `./configure` program also comes with a useful `--help` page where we can learn about which features we would like to turn on and off before the build.
   It's useful to study this page and see what is available, as these can later become build options for the application when it is brought to the Unikraft ecosystem.
   The only thing to notice for the case of `iperf3` is that it uses [OpenSSL](https://www.openssl.org).
   Unikraft already has a [port of OpenSSL](https://github.com/unikraft/lib-openssl), which means we do not have to port this before starting.
   **If, however, there are library dependencies for the target application which do not exist within the Unikraft ecosystem, then these library dependencies will need to be ported first before continuing.**
   This tutorial also applies to porting libraries to Unikraft.

1. When we next run `make` in the sequence above, we can see the intermediate object files which are compiled during the compilation process before `iperf3` is finally linked together to form a final Linux user space binary application.
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

   ```bash
   cd ~/workspace
   export UK_WORKDIR=$(pwd)
   kraft list update
   kraft list pull unikraft@staging
   ```

   This will generate the necessary directory structure to build a new Unikraft application, and will also download the latest `staging` branch of Unikraft's core.
   When we list the directories, we should get something like this:

   ```bash
   $ tree -L 1
   .
   ├── apps
   ├── archs
   ├── libs
   ├── plats
   └── unikraft

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

   ```bash
   cd ~/workspace/libs
   kraft lib init \
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

   ```bash
   kraft list add ~/workspace/libs/iperf3
   ```

   This will modify your `.kraftrc` file with a new local library.
   When you have added this library directory, run the update command so that `kraft` can realize it:

   ```bash
   kraft list update
   ```

1. You should now be able to start using this boilerplate library with Unikraft and `kraft`.
   To view basic information about the library and to confirm everything has worked, you can run:

   ```bash
   kraft list show iperf3
   ```

### Using Your Library in a Unikraft Unikernel Application

Now that we have a library set up in `iperf3`'s name, located at `~/workspace/libs/iperf3`, we should immediately start using it so that we can start the porting.

To do this, we create a parallel application which uses both the library we are porting and the Unikraft core source code.

1. First start by creating a new application structure, which we can do by initializing a blank project:

   ```bash
   cd ~/workspace/apps
   kraft init iperf3
   ```

1. We will now have an "empty" initialized project; you'll find boilerplate in this directory, including a `kraft.yaml` file which will look something like this:

   ```bash
   cd ~/workspace/apps/iperf3
   cat kraft.yaml
   ```

   ```yaml
   specification: '0.5'
   unikraft: staging
   targets:
      - architecture: x86_84
        platform: kvm
   ```

1. After setting up your application project, we should add the new library we are working on to the application. This is done via:

   ```bash
   kraft lib add iperf3@staging
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

   ```bash
   kraft menuconfig
   ```

   within the application folder.
   However, it will also be selected automatically since it is in the `kraft.yaml` file now if you run the configure step:

   ```bash
   kraft configure
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

   ```bash
   cd ~/workspace/apps/iperf3
   kraft fetch
   ```

   If this is successful, we should see it download the remote zip file and we should see it saved within our Unikraft application's `build/`.
   The directory with the extracted contents should be located at:

   ```bash
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

   ```bash
   mkdir ~/workspace/libs/iperf3/include
   cp build/libiperf3/origin/iperf-3.10.1/src/iperf_config.h ~/workspace/libs/iperf3/include
   ```

   Let's indicate in the `Makefile.uk` of the Unikraft library for `iperf3` that
   this directory exists:

   ```Makefile
   LIBIPERF3_CINCLUDES-y += -I$(LIBIPERF3_BASE)/include
   ```

   We'll come back to `iperf_config.h`: likely it needs edits from us to turn features on or off depending on availability or applicability based on the unikernel-context.
   We can also wrap build options here.

1. Next, let's run `make` with a special flag:

   ```bash
   cd build/libiperf3/origin/iperf-3.10.1/
   make -n
   ```

   This flag, `-n`, has just shown us what `make` will run; the full commands for `gcc` including flags.
   What's interesting here is any line which start with:

   ```bash
   echo "  CC      "
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

   ```bash
   cd ~/workspace/apps/iperf3
   kraft build
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

   ```bash
   kraft prepare
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

   ```bash
   cd ~/workspace/apps/iperf3
   kraft fetch
   ```

1. Once the source files have been downloaded, turn it into a Git repository and save everything to an initial commit, in the case of `iperf3`:

   ```bash
   cd build/libiperf3/origin/iperf-3.10.1
   git init
   git add .
   git commit -m "Initial commit"
   ```

   This will allow us to make changes to the source files and save those differences.

1. After making changes, create a Git commit, where you briefly describe the change you made and why.
   This can be done through a number of successive steps, for example, as a result of having to make several changes to the application.

1. After your changes have been saved to the git log, export them as patches.
   For example, if you have made one (`1`) patch only, export it like so:

   ```bash
   git format-patch HEAD~1
   ```

   This will save a new `.patch` file in the current directory; which should be the origin source files of `iperf3`.

1. The next step is to create a `patches/` folder within the Unikraft port of the library and to move the new `.patch` file into this folder:

   ```bash
   mkdir ~/workspace/libs/iperf3/patches
   mv ~/workspace/apps/iperf3/build/libiperf3/origin/iperf-3.10.1/*.patch ~/workspace/libs/iperf3/patches
   ```

1. To register patches against Unikraft's build tool such that they are applied before the compilation of all source files, simply indicate it in the library's `Makefile.uk`:

   ```Makefile
   # Add or edit ~/workspace/libs/iperf3/Makefile.uk
   LIBIPERF3_PATCHDIR = $(LIBIPERF3_BASE)/patches
   ```

This concludes the necessary steps to port an application to Unikraft "from first principles".
