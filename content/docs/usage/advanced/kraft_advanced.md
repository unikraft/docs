---
title: Advanced kraft Usage
date: 2023-01-02T14:09:21+09:00
draft: false
weight: 323
---

## Advanced kraft Usage

You can use the `kraft` companion tool to work with Unikraft: download, configure, build, run, debug and develop applications and libraries.

As a result of Unikraft aiming to librarize all software components, `kraft` will treat every component (core, platforms, architectures, libraries, applications) as a library.
Each component is stored as a repository inside the [Unikraft GitHub organization](https://github.com/unikraft/).
In order to be used with `kraft`, application components need to define a `kraft.yaml` file that contains configuration, build and run options.
The manifest files need to be downloaded and synced locally (via the [`kraft list` command](/docs/usage/advanced/kraft_advanced/#kraft-list)).
The manifests will be cached in the `kraft` cache directory (usually `~/.kraftcache/`).

## `kraft list`

You will need to determine (and later select) the possible targets for your Unikraft application.
You can use `kraft list` to retrieve a list of all available applications, libraries, platforms and architectures supported by Unikraft:

```console
$ kraft list
UNIKRAFT                VERSION         RELEASED        LAST CHECKED
unikraft                0.7.0           6 days ago      02 Mar 22

PLATFORMS               VERSION         RELEASED        LAST CHECKED
aws                     0.7.0           09 Feb 22       02 Mar 22
digitalocean            0.7.0           04 Feb 22       02 Mar 22
solo5                   0.7.0           04 Feb 22       02 Mar 22
gcp                     0.7.0           04 Feb 22       02 Mar 22

LIBRARIES               VERSION         RELEASED        LAST CHECKED
compiler-rt             0.7.0           04 Feb 22       02 Mar 22
newlib                  0.7.0           7 days ago      02 Mar 22
googletest              0.7.0           04 Feb 22       02 Mar 22
libcxx                  0.7.0           04 Feb 22       02 Mar 22
libfp16                 0.7.0           05 Feb 22       02 Mar 22
libcxxabi               0.7.0           04 Feb 22       02 Mar 22
[...]

APPLICATIONS            VERSION         RELEASED        LAST CHECKED
helloworld              0.7.0           04 Feb 22       02 Mar 22
httpreply               0.7.0           04 Feb 22       02 Mar 22
python3                 0.7.0           04 Feb 22       02 Mar 22
duktape                 0.7.0           04 Feb 22       02 Mar 22
[...]
```

The components available on your system will be colored in green;
those that are absent will be colored in red.
By default, they are saved in the `~/.unikraft/` directory, which is also the default value of the `UK_WORKDIR` environment variable used by `kraft`.
You can update the value of `UK_WORKDIR` if you want to keep the file structure in another location.
This represents the working directory for all Unikraft components.
This is the usual layout of the `~/.unikraft/` directory:

```text
.
|-- apps/
|-- archs/
|-- libs/
|-- plats/
`-- unikraft/
```

You can choose to list only specific components and other options available with the `kraft list` command:

```console
$ kraft list -c # List information about Unikraft's core
UNIKRAFT        VERSION         RELEASED        LAST CHECKED
unikraft        0.7.0           6 days ago      02 Mar 22

$ kraft list -p # List supported platforms
PLATFORMS       VERSION         RELEASED        LAST CHECKED
aws             0.7.0           09 Feb 22       02 Mar 22
digitalocean    0.7.0           04 Feb 22       02 Mar 22
solo5           0.7.0           04 Feb 22       02 Mar 22
gcp             0.7.0           04 Feb 22       02 Mar 22

$ kraft list -l # List supported libraries
LIBRARIES       VERSION         RELEASED        LAST CHECKED
compiler-rt     0.7.0           04 Feb 22       02 Mar 22
newlib          0.7.0           7 days ago      02 Mar 22
googletest      0.7.0           04 Feb 22       02 Mar 22
[...]

$ kraft list -a # List supported applications
APPLICATIONS    VERSION         RELEASED        LAST CHECKED
helloworld      0.7.0           04 Feb 22       02 Mar 22
httpreply       0.7.0           04 Feb 22       02 Mar 22
python3         0.7.0           04 Feb 22       02 Mar 22
[...]
```

### `kraft list pull`

You can pull a component on your disk by using `kraft list pull`:

```console
$ kraft list pull redis
 100.00% :::::::::::::::::::::::::::::::::::::::: |       19 /       19 |:  app/redis@0.7
 100.00% :::::::::::::::::::::::::::::::::::::::: |       43 /       43 |:  lib/redis@0.7
```

{{% alert theme="info" %}}
Some listed components may not be able to be pulled, if there isn't a suitable `kraft.yaml` file in the application repository.
{{% /alert %}}

You can also specify the wanted version:

```console
$ kraft list pull lib-python3>=0.4
```

### `kraft list show`

You can view details of a component using `kraft list show`:

```console
$ kraft list show python3
name:           python3
type:           lib
description:    Unikraft port of Python 3
distributions:  stable@0.7
		staging@a69471f
git:            https://github.com/unikraft/lib-python3
manifest:       https://github.com/unikraft/lib-*
last checked:   02 Mar 22
located at:     [...]/my-unikernel/libs/python3
---
name:           python3
type:           app
description:    Unikraft Python3 app repo
distributions:  stable@0.7
		staging@45761b8
git:            https://github.com/unikraft/app-python3
manifest:       https://github.com/unikraft/app-*
last checked:   02 Mar 22
located at:     [...]/my-unikernel/apps/python3
```

### `kraft list update`

You need to regularly update the manifest files of the available components, by running:

```console
$ kraft list update
```

You may get the following error when running the command above:

```text
GitHub rate limit exceeded.  You can tell kraft to use a personal access token by setting the UK_KRAFT_GITHUB_TOKEN environmental variable.
```

In this case, create a [GitHub personal access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) and use the following command:

```console
$ UK_KRAFT_GITHUB_TOKEN=<your_GitHub_token_here> kraft list update
```

### Overview of the `kraft list` Command

You can get a full list of features by running `kraft list -h` or `kraft list --help`:

```text
  Usage: kraft list [OPTIONS] COMMAND [ARGS]...

  Retrieves lists of available architectures, platforms, libraries and
  applications supported by unikraft.  Use this command if you wish to
  determine (and then later select) the possible targets for your unikraft
  application.

  By default, this subcommand will list all possible targets.

Options:
  -i, --installed   Display only installed components.
  -c, --core        Display information about Unikraft's core repository.
  -p, --plats       List supported platforms.
  -l, --libs        List supported libraries.
  -a, --apps        List supported application runtime execution environments.
  -d, --show-local  Show local source path.
  -n, --paginate    Paginate output.
  -t, --this        Show the components for this application (default is cwd).
  --this=PATH       Show the components for this application.
  -j, --json        Return output as JSON.
  -h, --help        Show this message and exit.

Commands:
  add     Add a remote manifest or repository.
  pull    Pull the remote component to disk.
  remove  Remove a remote manifest or repository.
  show    Show a unikraft component.
  update  Update the list of remote components.
```

## `kraft up`

You can download, configure, build and run an application, all in one command, using `kraft up`:

```console
$ kraft up -t helloworld my-helloworld-app

 100.00% :::::::::::::::::::::::::::::::::::::::: |       36 /       36 |:  app/helloworld@0.7
[INFO    ] Initialized new unikraft application: [...]/my-unikraft/unikraft/my-helloworld-app
make: Entering directory '[...]/my-unikernel/unikraft'
LN      Makefile
mkdir -p [...]/my-unikraft/unikraft/my-helloworld-app/build/kconfig/lxdialog

[...]

CC      libkvmplat: trace.common.o
CC      libkvmplat: traps.isr.o
CC      libkvmplat: cpu_features.common.o
CC      libkvmplat: cpu_native.common.o

[...]

LD      helloworld_kvm-x86_64.ld.o
OBJCOPY helloworld_kvm-x86_64.o
LD      helloworld_kvm-x86_64.dbg
SCSTRIP helloworld_kvm-x86_64
GZ      helloworld_kvm-x86_64.gz
LN      helloworld_kvm-x86_64.dbg.gdb.py
GEN     uk-gdb.py

Successfully built unikernels:

  => build/helloworld_kvm-x86_64
  => build/helloworld_kvm-x86_64.dbg (with symbols)

    To instantiate, use: kraft run

Trying to get root privileges...
**************************************************************************

[...]

SeaBIOS (version 1.13.0-1ubuntu1.1)
Booting from ROM...
Powered by
o.   .o       _ _               __ _
Oo   Oo  ___ (_) | __ __  __ _ ' _) :_
oO   oO ' _ `| | |/ /  _)' _` | |_|  _)
oOo oOO| | | | |   (| | | (_) |  _) :_
 OoOoO ._, ._:_:_,\_._,  .__,_:_, \___)
                    Mimas 0.7.0~1939bce
Hello world!
Arguments:  "[...]/my-unikraft/unikraft/my-helloworld-app/build/helloworld_kvm-x86_64" "console=ttyS0"
```

You can use the same arguments that you use with [`kraft init`](docs/usage/advanced/kraft_advanced/#kraft-init), [`kraft configure`](docs/usage/advanced/kraft_advanced/#kraft-configure), [`kraft build`](docs/usage/advanced/kraft_advanced/#kraft-build) and [`kraft run`](docs/usage/advanced/kraft_advanced/#kraft-run).

Behind the scenes, the `kraft up` command does the following:

1. It downloads the `helloworld` application repository in the `my-helloworld-app` directory (i.e. runs `kraft init -t helloworld my-helloworld-app`).
1. It configures the repository, resulting in a `.config` file (i.e. runs `kraft configure`).
1. It builds the required components, resulting in the `build/helloworld_kvm-x86_64` unikernel image (i.e. runs `kraft build`).
1. It runs the image, resulting in `QEMU/KVM` being run, with the `Hello world!` message getting printed (i.e. runs `kraft run`).

All that magic is done using one command.

### Overview of the `kraft up` Command

You can get a full list of features by running `kraft up -h` or `kraft up --help`:

```text
Usage: kraft up [OPTIONS] NAME

  Configures, builds and runs an application for a selected architecture and
  platform.

Options:
  -w, --workdir PATH         Specify an alternative directory for the
			     application [default is cwd].
  -t, --template NAME        Use an existing application as a template.
			     [required]
  -p, --plat TEXT            Target platform.
  -m, --arch TEXT            Target architecture.
  -i, --initrd TEXT          Provide an init ramdisk.
  -B, --background           Run in background.
  -P, --paused               Run the application in paused state.
  -g, --gdb INTEGER          Run a GDB server for the guest on specified port.
  -d, --dbg                  Use unstriped unikernel
  -n, --virtio-nic TEXT      Attach a NAT-ed virtio-NIC to the guest.
  -b, --bridge TEXT          Attach a NAT-ed virtio-NIC an existing bridge.
  -V, --interface TEXT       Assign host device interface directly as virtio-
			     NIC to the guest.
  -D, --dry-run              Perform a dry run.
  -M, --memory INTEGER       Assign MB memory to the guest.
  -s, --cpu-sockets INTEGER  Number of guest CPU sockets.
  -c, --cpu-cores INTEGER    Number of guest cores per socket.
  -F, --force                Overwrite any existing files in current working
			     directory.
  -j, --fast                 Use all CPU cores to build the application.
  -M, --with-makefile        Create a Unikraft compatible Makefile.
  -h, --help                 Show this message and exit.
```

## `kraft init`

You can initialize an empty application, or download an existing one, by using `kraft init`.
If you want to use an existing application listed in `kraft list`, you can use the `-t, --template` option:

```console
$ kraft init -t helloworld my-helloworld-app
[...]
[INFO    ] Initialized new unikraft application: [...]my-unikernel/my-helloworld-app-init
```

A new directory named `my-helloworld-app/` will be created inside you working directory, and will contain the following file structure:

```text
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

You can use the generated `Makefile` to invoke the Unikraft build system.

```console
$ cat Makefile
UK_ROOT ?= $(PWD)/../../unikraft
UK_LIBS ?= $(PWD)/../../libs
LIBS :=

all:
	@$(MAKE) -C $(UK_ROOT) A=$(PWD) L=$(LIBS)

$(MAKECMDGOALS):
	@$(MAKE) -C $(UK_ROOT) A=$(PWD) L=$(LIBS) $(MAKECMDGOALS)

```

You can build your application on top of this basic file structure, without `kraft`.
You can do that by adding source files and modifying the `Makefile.uk` and `Config.uk` files.
See more on that in the [`Make-based System` page](/docs/usage/make_build).

### Overview of the `kraft init` Command

You can get a full list of features by running `kraft init -h` or `kraft init --help`:

```text
Usage: kraft init [OPTIONS] [NAME]

  Initializes a new unikraft application.

  Start here if this is your first time using (uni)kraft.

Options:
  -t, --template NAME  Use an existing application as a template.
  -p, --plat PLAT      Target platform.
  -m, --arch ARCH      Target architecture.
  -w, --workdir PATH   Specify an alternative directory for the application
		       [default is cwd].
  -M, --with-makefile  Create a Unikraft compatible Makefile.
  -D, --no-deps        Do not download additional dependencies for application
		       components.
  -d, --dump           Dump dependencies into project directory.
  -F, --force          Overwrite any existing files.
  -h, --help           Show this message and exit.
```

## `kraft configure`

You can configure the application by using `kraft configure`, while inside the application directory.
The configuration will be saved inside the `.config` file.
The `kraft configure` command will process the application `kraft.yaml` and `Config.uk` files and generate the `.config` file based on the encountered configuration options.
You can find more about files related to the configuration in the [porting page](/docs/develop/porting).

When no option is specified, and while inside the application directory, you will be prompted with a list from where you can choose your desired configuration.
Use the arrows to navigate through the list:

```console
$ kraft configure
[?] Which target would you like to configure?: helloworld_linuxu-x86_64
> helloworld_linuxu-x86_64
  helloworld_kvm-x86_64
  helloworld_xen-x86_64
  helloworld_linuxu-arm64
  helloworld_kvm-arm64
  helloworld_linuxu-arm
```

You can avoid the interactive prompt by specifying the platform and architecture with the `-p, --plat` and `-m, --arch` options:

```console
$ kraft configure -p kvm -m x86_64
[...]
#
# configuration written to [...]unikraft/my-helloworld-app/.config
#
make: Leaving directory '[...]my-unikernel/unikraft'
```

The command above configured the application for the `kvm` platform and `x86_64` architecture.
The configuration is saved in the `.config` file:

```console
$ grep '^[^#].*\(PLAT\|ARCH\)' .config
CONFIG_UK_ARCH="x86_64"
CONFIG_ARCH_X86_64=y
CONFIG_MARCH_X86_64_GENERIC=y
CONFIG_PLAT_KVM=y
```

You can enable, disable and set a value for an Unikraft configuration option by using `-y, --yes`, `-n, --no`, `-s, --set`:

```console
$ kraft configure -p kvm -m x86_64 -n LIBUKMMAP -s HZ=100
[...]
$ kraft configure -p kvm -m x86_64 -y LIBUKMMAP -s HZ=300
[...]/my-unikraft/unikraft/my-helloworld-app is already configured, would you like to overwrite configuration? [y/N]: y
make: Entering directory '[...]/my-unikernel/unikraft'
#
# configuration written to [...]/my-unikraft/unikraft/my-helloworld-app/.config
#
make: Leaving directory '[...]/my-unikernel/unikraft'

$ diff .config .config.old
78c78
< CONFIG_HZ=300
---
> CONFIG_HZ=100
137c137
< CONFIG_LIBUKMMAP=y
---
> # CONFIG_LIBUKMMAP is not set
```

You can see that the `-y OPTION` options sets `CONFIG_OPTION=y` in the `.config` file, while the `-s OPTION=X` sets `CONFIG_OPTION=X` in the `.config` file.

You can use a specific directory of your target application (instead of the default current working directory) by using the `-w, --workdir` option:

```console
$ kraft configure -p kvm -m x86_64 -w [...]my-unikernel/hello/
make: Entering directory '[...]/my-unikernel/unikraft'
[...]
#
# configuration written to [...]my-unikernel/hello/.config
#
make: Leaving directory '[...]/my-unikernel/unikraft'
```

If you run `kraft configure` on a previously configured application (i.e. the `.config` file exists), you will be prompted with a message to overwrite the previous configuration.
You can force the overwriting of the existing configuration by using `-F, --force`.

{{% alert theme="warning" %}}
If you are changing the target architecture, make sure you run `kraft clean` before rebuilding.
{{% /alert %}}

```console
$ kraft configure -p kvm -m x86_64 -F
make: Entering directory '[...]/my-unikernel/unikraft'
#
# configuration written to [...]/my-unikraft/unikraft/my-helloworld-app/.config
#
make: Leaving directory '[...]/my-unikernel/unikraft'
```

### Overview of the `kraft configure` Command

You can get a full list of features by running `kraft configure -h` or `kraft configure --help`:

```text
Usage: kraft configure [OPTIONS]

  Configure the unikernel using the KConfig options set in the kraft.yaml
  file.  Alternatively, you can use the -k|--menuconfig flag to open the TUI
  to manually select the configuration for this unikernel.

  When the unikernel is configured, a .config file is written to the working
  directory with the selected KConfig options.

Options:
  -p, --plat PLAT         Target platform.
  -t, --target TARGET     Target name.
  -m, --arch ARCH         Target architecture.
  -F, --force             Force writing new configuration.
  -k, --menuconfig        Use Unikraft's ncurses Kconfig editor.
  -w, --workdir PATH      Specify an alternative directory for the application
			  [default is cwd].
  -y, --yes KOPTION       Specify an option to enable.
  -n, --no KOPTION        Specify an option to disable.
  -s, --set KOPTION       Set an option's value.
  -u, --use-version COMP  Use the specified version for the component, e.g.
			  -u unikraft@staging (will override kraft.yaml).
  -h, --help              Show this message and exit.
```

## `kraft build`

You can build your application by using `kraft build`.
You can use the `--no-fetch` and `--no-prepare` flags to disable the fetch and prepare steps before building.
To shorten the build time, you can use the `-j, --fast` option.
This will pass the `-j` option to `make`, resulting in running multiple jobs that can run simultaneously.
If you want to force the overwriting of the existing build, use `-F, --force`.

```console
$ kraft build --no-fetch --no-prepare -F -j
CC      libukdebug: hexdump.o
LD      libukdebug.ld.o
OBJCOPY libukdebug.o
[...]
Successfully built unikernels:

  => build/hello_kvm-x86_64
  => build/hello_kvm-x86_64.dbg (with symbols)

To instantiate, use: kraft run
```

### Overview of `kraft build` command

You can get a full list of features by running `kraft build -h` or `kraft build --help`:

```text
Usage: kraft build [OPTIONS] [TARGET]

  Builds the Unikraft application for the target architecture and platform.

Options:
  -v, --verbose               Verbose build
  --fetch / --no-fetch        Run fetch step before build.
  --prepare / --no-prepare    Run prepare step before build.
  --progress / --no-progress  Show progress of build.
  -j, --fast                  Use all CPU cores to build the application.
  -F, --force                 Force the build of the unikernel.
  -h, --help                  Show this message and exit.

```

## `kraft run`

You can run your application using `kraft run`:

```console
$ kraft run
SeaBIOS (version 1.13.0-1ubuntu1.1)
Booting from ROM...
Powered by
o.   .o       _ _               __ _
Oo   Oo  ___ (_) | __ __  __ _ ' _) :_
oO   oO ' _ `| | |/ /  _)' _` | |_|  _)
oOo oOO| | | | |   (| | | (_) |  _) :_
 OoOoO ._, ._:_:_,\_._,  .__,_:_, \___)
                  Tethys 0.5.0~b8be82b4
Hello world!
Arguments:  "[...]/my-unikernel/apps/app-helloworld/build/helloworld_kvm-x86_64" "console=ttyS0"
Console terminated, terminating guest (PID: 442022)...
```

In case of multiple existing builds (for different platforms and architectures) you will be prompted for the image to run, similar to [`kraft configure`](/docs/usage/advanced/kraft_advanced/#kraft-configure):

```console
$ kraft run
[?] Which target would you like to run?: helloworld_kvm-x86_64
 > helloworld_kvm-x86_64
   helloworld_linuxu-x86_64
```

To run the specific image non-interactively, use the `-m, --arch` and `-p, --plat`options to specify the target architecture and platform:

```console
$ kraft run -m x86_64 -p kvm
```

### Attach a Filesystem to the Application

Your application might need a filesystem to function.
You can attach different types of filesystems to an application by enabling specific configuration options and by passing the required options to the `kraft run` command.

#### Use an initrd Filesystem

You can add an initrd (_initial ramdisk_) filesystem to the application, by using the `-i, --initrd` option:

```console
$ kraft run -m x86_64 -p kvm -i archive.cpio
```

#### Use a `9pfs` Filesystem

You can also attach a `9pfs` filesystem to your application.
In order to do that, you need to make sure you have set the following options in the application configuration:

```text
CONFIG_LIBVFSCORE_ROOTFS_9PFS=y
CONFIG_LIBVFSCORE_ROOTDEV="fs0"
```

You can check the `kraft.yaml` file from the [Python 3 app](https://github.com/unikraft/app-python3/blob/staging/kraft.yaml#L5) to get a better idea of the required configuration.
By default, the `kraft` application uses the name `fs0` for the device to mount the filesystem from.
To use your application with `kraft`, you must name the shared filesystem `fs0`.

```console
$ mkdir fs0
$ echo 'Salut mundi!' > fs0/file.txt
$ kraft run
[...]

SeaBIOS (version 1.13.0-1ubuntu1.1)
Booting from ROM...
Powered by
o.   .o       _ _               __ _
Oo   Oo  ___ (_) | __ __  __ _ ' _) :_
oO   oO ' _ `| | |/ /  _)' _` | |_|  _)
oOo oOO| | | | |   (| | | (_) |  _) :_
 OoOoO ._, ._:_:_,\_._,  .__,_:_, \___)
                     Mimas 0.7.0~1939bce
Salut mundi!
```

### Use `kraft run` to Debug Your Application

If you want to debug the application, you can launch it in a paused state by using the `-P, --paused` option.
You can run a `GDB` server for the guest on a specific port using the `-g, --gdb PORT` option:

```console
$ kraft run -P -g 1234
```

To connect `GDB` to the created server, you can run

```console
$ gdb --eval-command="target remote :1234" build/application-image.dbg
[...]
Reading symbols from build/application-image.dbg
Remote debugging using :1234
```

You can set the debug information level from the `Build options --> Debug information level` screen in `kraft menuconfig`.
For more information about debugging with Unikraft, check the [debugging section](docs/develop/debugging).

### Overview of the `kraft run` Command

You can get a full list of features by running `kraft run -h` or `kraft run --help`.

```text
Usage: kraft run [OPTIONS] [ARGS]...

Options:
  -t, --target TARGET        Name of target architecture/platform.
  -p, --plat PLAT            Target platform.
  -m, --arch ARCH            Target architecture.
  -i, --initrd PATH          Provide an init ramdisk.
  -B, --background           Run in background.
  -P, --paused               Run the application in paused state.
  -g, --gdb PORT             Run a GDB server for the guest at PORT.
  -d, --dbg                  Use unstriped unikernel
  -n, --virtio-nic NAME      Attach a NAT-ed virtio-NIC to the guest.
  -b, --bridge NAME          Attach a NAT-ed virtio-NIC an existing bridge.
  -V, --interface NAME       Assign host device interface directly as virtio-
			     NIC to the guest.
  -D, --dry-run              Perform a dry run.
  -M, --memory INTEGER       Assign MB memory to the guest.
  -s, --cpu-sockets INTEGER  Number of guest CPU sockets.
  -c, --cpu-cores INTEGER    Number of guest cores per socket.
  -w, --workdir PATH         Specify an alternative directory for the library
			     (default is cwd).
  -h, --help                 Show this message and exit.
```

## `kraft clean`

You can clean the build artifacts of your application by using `kraft clean`.
You can remove the entire build directory by using the `-p, --proper` flag.
You can also remove the configuration files by using the `-d, --dist` flag.

### Overview of `kraft clean` command

You can get a full list of features by running `kraft clean -h` or `kraft clean --help`:

```text
Usage: kraft clean [OPTIONS] [LIBS]...

  Clean the build artifacts of a Unikraft unikernel application.

Options:
  -w, --workdir PATH          Specify an alternative working directory for the
			      application
  -p, --proper                Delete the build directory.
  -d, --dist                  Delete the build directory and configuration
			      files.
  --progress / --no-progress  Show progress of build.
  -h, --help                  Show this message and exit.
```

## `kraft lib`

If you are maintaining and working directly with Unikraft libraries, you can use `kraft lib`.

### `kraft lib init`

You can initialize a new Unikraft library by using `kraft lib init`.
You can add the author and version information using the `-a, --author-name`, `-e, --author-email` and `-v, --version` options.
When you run the command, you will be able to interactively set all the options for the new library:

```console
$ kraft lib init your-lib
source (Use $VERSION for automatic versioning):
project_name [your-lib]:
lib_name [lib-your-lib]:
lib_kname [YOURLIB]:
version: your-first-version
description []:
author_name [Your name]:
author_email [Your email]:
provide_main [False]:
with_gitignore [True]:
with_docs [True]:
with_patchedir [False]:
initial_branch [staging]:
copyright_holder []:
[INFO    ] Generating files...
[INFO    ] Generated new library: [...]my-unikernel/lib-name
```

#### Overview of the `kraft lib init` Command

```text
Usage: kraft lib init [OPTIONS] [NAME]

  Initialize a new Unikraft library.

Options:
  -a, --author-name NAME       The author's name for library.
  -e, --author-email EMAIL     The author's email for library.
  -v, --version VERSION        Set the known version of the library.
  -s, --origin TEXT            Source code origin URL.  Use $VERSION in the
			       URL for automatic versioning.
  -m, --with-main              Provide a main function override.
  -w, --workdir PATH           Specify an alternative directory for the
			       library (default is cwd).
  -F, --force                  Overwrite any existing files.
  -q, --no-prompt              Do not prompt for additional data.
  -S, --soft-pack              Softly pack the component so that it is
			       available via kraft list.
  -b, --initial-branch BRANCH  The initial Git branch of the new library.
  -h, --help                   Show this message and exit.

 ```

### `kraft lib add` and `kraft lib remove`

You can add and remove libraries from your project by using `kraft list add` and `kraft list remove`:

```console
$ kraft lib add pthread-embedded
[INFO    ] Adding lib/pthread-embedded@0.7.0...

$ kraft lib remove pthread-embedded
[INFO    ] Removing lib/pthread-embedded...
```

#### Overview of the `kraft lib add` and `kraft lib remove` Commands

You can get a full list of features by running `kraft lib add -h` or `kraft lib remove -h`:

```text
Usage: kraft lib add [OPTIONS] [LIB]...

  Add a library to the unikraft application project.

Options:
  -w, --workdir PATH  Specify an alternative directory for the application
		      [default is cwd].
  --pull / --no-pull  Save libraries into project directory.
  -h, --help          Show this message and exit.


Usage: kraft lib remove [OPTIONS] [LIB]...

  Remove a library from the unikraft application project.

Options:
  -w, --workdir PATH  Specify an alternative directory for the application
		      [default is cwd].
  -P, --purge         Removes the source files for the library.
  -h, --help          Show this message and exit.
```
