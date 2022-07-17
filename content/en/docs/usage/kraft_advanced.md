---
title: Advanced Kraft Usage
date: 2020-01-11T14:09:21+09:00
weight: 403
---

## Advanced kraft usage

You can use the `kraft` tool to work with Unikraft: to download, configure, build and run applications and maintaind and develop libraries.

## `kraft list`

You can use `kraft list` to retrieve a list of all available applications, libraries, platforms and architectures supported by unikraft.
```bash
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

The components available on your system will be coloured in green, and the others in red.
By default, they are saved in the `~/.unikraft/` directory, which is also the value of the UK_WORKDIR environment variable used by kraft.
You can update the value of `UK_WORKDIR` if you want to keep the file structure in another location.
This represents the working directory for all Unikraft components.
This is the usual layout of the ~/.unikraft/ directory:
```text
/home/stefan/.unikraft/
├── apps
├── archs
├── libs
├── plats
└── unikraft
```

You can choose to list only specific components and other options available with the `kraft list` command:
```bash
$ kraft list -c
UNIKRAFT        VERSION         RELEASED        LAST CHECKED
unikraft        0.7.0           6 days ago      02 Mar 22

$ kraft list -p
PLATFORMS       VERSION         RELEASED        LAST CHECKED
aws             0.7.0           09 Feb 22       02 Mar 22
digitalocean    0.7.0           04 Feb 22       02 Mar 22
solo5           0.7.0           04 Feb 22       02 Mar 22
gcp             0.7.0           04 Feb 22       02 Mar 22

$ kraft list -l
LIBRARIES       VERSION         RELEASED        LAST CHECKED
compiler-rt     0.7.0           04 Feb 22       02 Mar 22
newlib          0.7.0           7 days ago      02 Mar 22
googletest      0.7.0           04 Feb 22       02 Mar 22
[...]

$ kraft list -a
APPLICATIONS    VERSION         RELEASED        LAST CHECKED
helloworld      0.7.0           04 Feb 22       02 Mar 22
httpreply       0.7.0           04 Feb 22       02 Mar 22
python3         0.7.0           04 Feb 22       02 Mar 22
[...]
```

### `kraft list pull`

You can pull a component on your disk by using `kraft list pull`:
```bash
$ kraft list pull redis
 100.00% :::::::::::::::::::::::::::::::::::::::: |       19 /       19 |:  app/redis@0.7
 100.00% :::::::::::::::::::::::::::::::::::::::: |       43 /       43 |:  lib/redis@0.7
```

You can also specify the wanted version:
```bash
$ kraft list pull lib-python3>=0.4
```

### `kraft list show`

You can view details of a component using `kraft list show`:
```bash
$ kraft list show python3
name:           python3
type:           lib
description:    Unikraft port of Python 3
distributions:  stable@0.7
		staging@a69471f
git:            https://github.com/unikraft/lib-python3
manifest:       https://github.com/unikraft/lib-*
last checked:   02 Mar 22
located at:     /home/stefan/.unikraft/libs/python3
---
name:           python3
type:           app
description:    Unikraft Python3 app repo
distributions:  stable@0.7
		staging@45761b8
git:            https://github.com/unikraft/app-python3
manifest:       https://github.com/unikraft/app-*
last checked:   02 Mar 22
located at:     /home/stefan/.unikraft/apps/python3
```

### `kraft list update`

You need to regulary update the available components, by running:
```bash
$ kraft list update
```

You may get the following error when running the command above:
```text
GitHub rate limit exceeded.  You can tell kraft to use a personal access token by setting the UK_KRAFT_GITHUB_TOKEN environmental variable.
```

In this case, create a [GitHub personal acces token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) and use the following command:
```bash
$ UK_KRAFT_GITHUB_TOKEN=<your_GitHub_token_here> kraft list update
```

### Overview of `kraft list` command

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

You can use `kraft up` to easily download, configure, build and run an application all at once.
```bash
$ kraft up -t helloworld my-helloworld-app

 100.00% :::::::::::::::::::::::::::::::::::::::: |       36 /       36 |:  app/helloworld@0.7
[INFO    ] Initialized new unikraft application: /media/stefan/projects/unikraft/my-helloworld-app
make: Entering directory '/home/stefan/.unikraft/unikraft'
LN      Makefile
mkdir -p /media/stefan/projects/unikraft/my-helloworld-app/build/kconfig/lxdialog

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
Arguments:  "/media/stefan/projects/unikraft/my-helloworld-app/build/helloworld_kvm-x86_64" "console=ttyS0"
```

You can use the same arguments that you use with [kraft init](docs/usage/kraft_advanced/#kraft-init), [kraft configure](docs/usage/kraft_advanced/#kraft-configure), [kraft build](docs/usage/kraft_advanced/#kraft-configure) and [kraft run](docs/usage/kraft_advanced/#kraft-configure).

### Overview of `kraft up` command

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

You can use `kraft init` to initiate an empty application or download an existing one.
You can choose to create a compatible Makefile for the application by using the `-M, --with-makefile` flags.
If you want to use an existing application listed in `kraft list`, you can use the `-t, --template` flag.
```bash
$ kraft init -M -t helloworld my-helloworld-app
[...]
[INFO    ] Initialized new unikraft application: /home/stefan/projects/unikraft/my-helloworld-app-init
```

### Overview of `kraft init` command

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

You can configure the application by using `kraft configure`.
You can specify the platform and architecture by using the `-p, --plat` and `-m --arch` flags.
You can enable, disable and set a value for an option by using `-y, --yes`, `-n, --no`, `-s, --set`.
You can change the directory for your application by using the `-w, --workdir` flags.
You can force the overwriting of the existing configuration by using `-F, --force`.

```bash
$ kraft configure -p kvm -m x86_64 -s CONFIG_LIBUKMMAP=y -w /home/stefan/projects/unikraft/hello/ -F
make: Entering directory '/home/stefan/.unikraft/unikraft'
[...]
#
# configuration written to /home/stefan/projects/unikraft/hello/.config
#
make: Leaving directory '/home/stefan/.unikraft/unikraft'
```

### Overview of `kraft configure` command

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

You can use `kraft build` to build your application.
You can use the `--fetch / --no-fetch` and `--prepare / --no-prepare` flags to run the fetch and prepare steps before building.
You can use `-j, --fast` to use all CPU cores for building the app.
If you want to force the overwrite of the existing build, use `-F, --force`.

```bash
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

You can run your application using `kraft run`.
You can specify the target architecture and platform using `-m, --arch` and `-p, --plat`.
```bash
$ kraft run -m x86_64 -p kvm
```

### Attach a file system to the application

####  Use an InitRD filesystem

You can add an InitRD filesystem to the application, by using the `-i, --initrd` flags.
```bash
$ kraft run -m x86_64 -p kvm -i archive.cpio
```

#### Use a `9pfs` filesystem

You can also attach a `9pfs` filesystem to your application.
In order to do that, you need to make sure you have set the following options in the application configuration:
```text
- CONFIG_LIBVFSCORE_ROOTFS_9PFS=y
- CONFIG_LIBVFSCORE_ROOTDEV="fs0"
```

You can check the `kraft.yaml` file from the [Python 3 app](https://github.com/unikraft/app-python3/blob/staging/kraft.yaml#L5) to get a better idea of the required configuration.
By default, the `kraft` application uses the name `fs0` for the device to mount the filesystem from.
To use your application with `kraft`, you must name the shared filesystem "fs0".
```bash
$ mkdir fs0
$ echo 'Hello world!' > fs0/file.txt
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
Hello world!
```

### Use `kraft run` to debug you application

If you want to debug the application, you can launch it in a paused state by using the `-P, --paused` flags.
You can run a GDB server for the guest on a specific port using the `-g, --gdb PORT` flags.
```bash
$ kraft run -P -g 1234
```

To connect the GDB to the created server, you can run
```bash
$ gdb --eval-command="target remote :1234" build/application-image.dbg
[...]
Reading symbols from build/application-image.dbg
Remote debugging using :1234
```

You can set the debug information level from the `Build options --> Debug information level` screen in `kraft menuconfig`.
For more informations about debugging with Unikraft, please check the [debugging section](docs/develop/debugging).

### Overview of `kraft run` command

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

You can use `kraft clean` to clean the build artifacts of your application.
You can remove the entire build directory by using the `-p, --proper` flags.
You can also remove the configuration files by using the `-d, --dist` flags.

### Overview of `kraft clean` command

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
You can add the author and version information using `-a, --author-name`, `-e, --author-email` and `-v, --version`.
When you run the command, you will be able to interactively set all the options for the new library.
```bash
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
[INFO    ] Generated new library: /home/stefan/projects/unikraft/lib-name
```

#### Overview of `kraft lib init` command

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

You can add and remove libraries from your project by using `kraft list add` and `kraft list remove`.
```bash
$ kraft list add pthread-embedded
[INFO    ] Adding lib/pthread-embedded@0.7.0...

$ kraft list remove pthread-embedded
[INFO    ] Removing lib/pthread-embedded...
```

#### Overview of `kraft lib add` and `kraft lib remove` commands:

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

