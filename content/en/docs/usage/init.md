---
title: Creating an App
date: 2020-01-11T14:09:21+09:00
weight: 403
---


## Configuring your application

The configuration step used in kraft will perform necessary checks pertaining to compatibility and availability of source code and will populate your application directory with new files and folders, including:

* `kraft.yaml` – This file holds information about which version of the Unikraft core, additional libraries, which architectures and platforms to target and which network bridges and volumes to mount durirng runtime.
* `Makefile.uk` – A Kconfig target file you can use to create compile-time toggles for your application.
* `build/` – All build artifacts are placed in this directory including intermediate object files and unikernel images.
* `.config` – The selection of options for architecture, platform, libraries and your application (specified in Makefile.uk) to use with Unikraft.

## `kraft configure`

To configure an application, you can use `kraft configure [OPTIONS]`.
The application can be targeted for multiple platforms and architectures that should be listed in the `kraft.yaml` file.

You can choose the desired platform and target by running:
```bash
$ kraft configure -p PLAT -m ARCH
```

Running the command with no options will let you choose from the available configurations by interactively using arrow keys to select the desired option.

```bash
$ kraft configure
[?] Which target would you like to configure?: helloworld_xen-x86_64
   helloworld_linuxu-x86_64
   helloworld_kvm-x86_64
 > helloworld_xen-x86_64
   helloworld_linuxu-arm64
   helloworld_kvm-arm64
   helloworld_xen-arm64
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

## `kraft menuconfig`

If you want more control over the application configuration, you can run `kraft menuconfig`.
This will open a text-user interface, where you can choose and modify all the options.

You can choose the architecture in the `Architecture Selection --->` and the platform in the `Platform Configuration --->` screen.
All the needed libraries, specified in the `kraft.yaml` file, can be configured in the `Library Configuration --->` screen, along with unikraft core libraries.
Extra build options, like optimization level or debug information level can be modified in the `Build Options --->` screen.
You can select the application options from the `Application Options --->`screen.

## `kraft build`

After you have configured the application, run `kraft build` to build it.

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

After building the application, you can run it using the `kraft run` command.

You can specify the platform and architecture for the target using `-p --plat` and `-m --arch` options.
```bash
$ kraft run -p kvm -m x86_64
```

You can pass arguments by listing them after all the options.
```bash
$ kraft run "arg1 arg2"
```

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

## `kraft fetch` and `kraft prepare`

You can fetch and patch the nedded libraries by running:
```bash
$ kraft fetch
```
or
```bash
$ kraft prepare
```
