---
title: Inside the Config and Build System
date: 2022-05-13T19:27:37+10:00
weight: 3
summary: "We take a look inside Unikraft internals - its build system and runtime infrastructure. Expected time 75min."
---

## Inside the Config and Build System

_The presentation of this session can be found [here](/community/hackathons/2022-05-lyon/a-look-inside/slides.pdf)._

For this session, the following tools are needed: `qemu-kvm`, `qemu-system-x86_64`, `qemu-system-aarch64`, `gcc-aarch64-linux-gnu`.
To install on Debian/Ubuntu use the following command

```
$ sudo apt-get -y install qemu-kvm qemu-system-x86 qemu-system-arm gcc-aarch64-linux-gnu
```

## Overview

### 01. linuxu and KVM

Unikraft can be run in 2 ways:

* As a virtual machine, using QEMU/KVM or Xen.
  It acts as an operating system, having the responsibility to configure the hardware components that it needs (clocks, additional processors, etc).
  This mode gives Unikraft direct and total control over hardware components, allowing advanced functionalities.
* As a `linuxu` build, in which it behaves as a Linux user-space application.
  This severely limits its performance, as everything Unikraft does must go through the Linux kernel, via system calls.
  This mode should be used only for development and debugging.

When Unikraft is running using QEMU/KVM, it can either be run on an emulated system or a (para)virtualized one.
Technically, KVM means virtualization support is enabled.
If using QEMU in emulated mode, KVM is not used.
To keep things simple, we will use interchangeably the terms QEMU, KVM or QEMU/KVM to refer to this use (either virtualized, or emulated).

Emulation is slower, but it allows using CPU architectures different from the local one (you can run ARM code on a x86 machine).
Using (para)virtualisation, aka hardware acceleration, greater speed is achieved and more hardware components are visible to Unikraft.

### 02. Unikraft Core

The Unikraft core is comprised of several components:

* [the architecture code](https://github.com/unikraft/unikraft/tree/staging/arch):
  This defines behaviours and hardware interactions specific to the target architecture (x86_64, ARM, RISC-V).
  For example, for the x86_64 architecture, this component defines the usable registers, data types sizes and how Thread-Local Storage should happen.
* [the platform code](https://github.com/unikraft/unikraft/tree/staging/plat):
  This defines interaction with the underlying hardware, depending on whether a hypervisor is present or not, and which hypervisor is present.
  For example, if the KVM hypervisor is present, Unikraft will behave almost as if it runs bare-metal, needing to initialize the hardware components according to the manufacturer specifications.
  The difference from bare-metal is made only at the entry, where some information, like the memory layout, the available console, are supplied by the bootloader (Multiboot) and there's no need to interact with the BIOS or UEFI.
  In the case of Xen, many of the hardware-related operations must be done through hypercalls, thus reducing the direct interaction of Unikraft with the hardware.
 * [internal libraries](https://github.com/unikraft/unikraft/tree/staging/lib):
  These define behaviour independent of the hardware, like scheduling, networking, memory allocation, basic file systems.
  These libraries are the same for every platform or architecture, and rely on the platform code and the architecture code to perform the needed actions.
  The internal libraries differ from the external ones in the implemented functionalities.
  The internal ones define parts of the kernel, while the external ones define user-space level functionalities.
  For example, **uknetdev** and **lwip** are 2 libraries that define networking components.
  [uknetdev](https://github.com/unikraft/unikraft/tree/staging/lib/uknetdev) is an internal library that interacts with the network card and defines how packages are sent using it.
  [lwip](https://github.com/unikraft/lib-lwip) is an external library that defines networking protocols, like IP, TCP, UDP.
  This library knows that the packages are somehow sent over the NIC, but it is not concerned how.
  That is the job of the kernel.

### 03. libc in Unikraft

The Unikraft core provides only the bare minimum components to interact with the hardware and manage resources.
A software layer, similar to the standard C library in a general-purpose OS, is required to make it easy to run applications on top of Unikraft.

Unikraft has multiple variants of a libc-like component:

* [nolibc](https://github.com/unikraft/unikraft/tree/staging/lib/nolibc) is a minimalistic libc, part of the core Unikraft code, that contains only the functionality needed for the core (strings, qsort, etc).
* [isrlib](https://github.com/unikraft/unikraft/tree/staging/lib/isrlib) is the interrupt-context safe variant of nolibc.
  It is used for interrupt handling code.
* [newlibc](https://github.com/unikraft/lib-newlib) is the most complete libc currently available for Unikraft, but it still lacks some functionalities, like multithreading.
  Newlibc was designed for embedded environments.
* [musl](https://github.com/unikraft/lib-musl) is, theoretically, the best libc that will be used by Unikraft, but it's currently in testing.

Nolibc and isrlib are part of the Unikraft core.
Newlibc and musl are external libraries, from the point of view of Unikraft, and they must be included to the build.

### 04. Configuring Unikraft - Config.uk

Unikraft is a configurable operating system, where each component can be modified, configured, according to the user’s needs.
This configuration is done using a version of Kconfig, through the **Config.uk** files.
In these files, options are added to enable libraries, applications and different components of the Unikraft core.
The user can then apply those configuration options, using `make menuconfig`, which generates an internal configuration file that can be understood by the build system, **.config**.
Once configured, the Unikraft image can be built, using `make`, and run, using the appropriate method (Linux ELF loader, qemu-kvm, xen, others).

Configuration can be done in 3 ways:

* Manually, using

  ```
  $ make menuconfig
  ```

* Adding a dependency in **Config.uk** for a component, so that the dependency gets automatically selected when the component is enabled.
  This is done using `depends on` and `select` keywords in **Config.uk**.
  The configuration gets loaded and the **.config** file is generated by running

  ```
  $ make menuconfig
  ```

  This type of configuration removes some configuration steps, but not all of them.

* Writing the desired configuration in **kraft.yaml**.
  The configuration gets loaded and the **.config** file is generated by running

  ```
  $ kraft configure
  ```

In this session, we will use the first and the last configuration options.

### 05. The Build System - basics

Once the application is configured, in **.config**, symbols are defined (e.g. `CONFIG_ARCH_X86_64`).
Those symbols are usable both in the C code, to include certain functionalities only if they were selected in the configuring process, and in the actual building process, to include / exclude source files, or whole libraries.
This last thing is done in **Makefile.uk**, where source code files are added to libraries.
During the build process, all the `Makefile.uk` files (from the Unikraft core and external libraries) are evaluated, and the selected files are compiled and linked, to form the Unikraft image.

{{< img
  class="max-w-3xl mx-auto"
  src="./images/build_uk.svg"
  title="Figure 1"
  caption="The build process of Unikraft"
  position="center"
>}}

## Summary

* Unikraft is a special type of operating system, that can be configured to match the needs of a specific application.
* This configuration is made possible by a system based on Kconfig, that uses **Config.uk** files to add possible configurations, and **.config** files to store the specific configuration for a build.
* The configuration step creates symbols that are visible in both Makefiles and source code.
* Each component has its own **Makefile.uk**, where source files can be added, removed, or be made dependent on the configuration.
* Unikraft has an internal libc, but it can use others, more complex and complete, like newlib and musl.
* Being an operating system, it needs to be run by a hypervisor, like KVM, xen, to work at full capacity.
  It can also be run as an ELF, in Linux, but in this way the true power of Unikraft is not achieved.

## Work Items

### Support Files

Session support files are available [in the repository](https://github.com/unikraft/docs/tree/main/content/en/community/hackathons/2022-05-lyon).
The repository is already cloned in the virtual machine.

If you want to clone the repository yourself, do

```
$ git clone https://github.com/unikraft/docs

$ cd docs/content/en/community/hackathons/2022-05-lyon/a-look-inside/

$ ls
images/  index.md  sol/  work/
```

### 01. Tutorial / Reminder: Building and Running Unikraft

We want to build the `helloworld` application, using the Kconfig-based system, for the **linuxu** and **KVM** platforms, for the **ARM** and **x86** architectures, and then run them.

The `unikraft` and `app-helloworld` repsitories are already created in the virtual machine, in the `a-look-inside/` folder, in a typical development hierarchy:

```
a-look-inside/
`-- apps/
|   `-- helloworld/
|-- libs/
`-- unikraft/
```

See the `UK_ROOT` and `UK_LIBS` in the `apps/helloworld/Makefile`, pointing to the `unikraft` repository and the library folder:

```
UK_ROOT ?= $(PWD)/../../unikraft
UK_LIBS ?= $(PWD)/../../libs
```

#### Linuxu, x86_64

First, we will build the image for the **linuxu** platform.
As the resulting image will be an ELF, we can only run the **x86** Unikraft image.
We follow the steps:

1. Enter the `helloworld` folder:

   ```
   $ cd apps/helloworld
   ```

1. Clean up all configuration and build files:

   ```
   $ make distclean
   ```

1. Configure the application by running

   ```
   $ make menuconfig
   ```

   1. From `Architecture Selection`, select `Architecture` -> `x86 compatible`.
   1. From `Platform Configuration`, select `Linux user space`.
   1. Save, exit and run

      ```
      $ make
      ```

1. The resulting image, `helloworld_linuxu-x86_64` is located in the `build/` folder.
   Run it directly, as a Linux executable:

   ```
   $ ./build/helloworld_linuxu-x86_64
   ```

#### KVM, x86_64

Next, we will build the image for the **kvm** platform.
Before starting the process, make sure that you have the necessary tools, listed in the [Required Tools](/a-look-inside/#required-tools) section.
We follow the steps:

1. Enter the `helloworld` folder:

   ```
   $ cd apps/helloworld
   ```

1. Clean up all configuration and build files:

   ```
   $ make distclean
   ```

1. Configure the application by running

   ```
   $ make menuconfig
   ```

   1. We will leave the architecture as is, for now.
   1. From `Platform Configuration`, select `KVM guest`.
   1. Save, exit and run

      ```
      $ make
      ```

1. Load the resulting image in QEMU by using

   ```
   $ sudo qemu-system-x86_64 -kernel ./build/helloworld_kvm-x86_64 -nographic
   ```

Besides `-serial stdio`, no other option is needed to run the `helloworld` application.
Other, more complex applications, will require more options given to the `qemu-system-x86-64` command.

The above command ran the application in QEMU emulation mode.
We can also run it in virtualization mode, by adding the `-enable-kvm` option.
You may receive a warning, `host doesn't support requested feature:`.
This is because KVM uses a generic CPU model.
You can instruct KVM to use your local CPU model, by adding `-cpu host` to the command.

The final command will look like this:

```
$ sudo qemu-system-x86_64 -enable-kvm -cpu host -kernel ./build/helloworld_kvm-x86_64 -nographic
```

#### KVM, ARM

To configure Unikraft for the ARM architecture, follow the steps:

1. Enter the `helloworld` folder:

   ```
   $ cd apps/helloworld
   ```

1. Clean up all configuration and build files:

   ```
   $ make distclean
   ```

1. Configure the application by running

   ```
   $ make menuconfig
   ```

   1. From `Architecture Selection`, select `Architecture` -> `Armv8 compatible`.
   1. From `Platform Configuration`, select `KVM guest`.
   1. Save, exit and run

      ```
      $ make
      ```

1. Load the resulting image in QEMU by using

   ```
   $ sudo qemu-system-aarch64 -machine virt -cpu cortex-a57 -kernel ./build/helloworld_kvm-arm64 -nographic
   ```

Note that now we need to provide a machine and a CPU model to be emulated, as there are no defaults available.
If you want to find information about other machines, run

```
$ sudo qemu-system-aarch64 -machine help
```

### 02. Tutorial / Reminder: Adding Filesystems to an Application

For this tutorial, the aim is to create a simple QEMU/KVM application that reads from a file and displays the contents to standard output.
A local directory is to be mounted as the root directory (`/`) inside the QEMU/KVM virtual machine.

We will use both the manual approach (`make` and `qemu-system-x86_64` / `qemu-guest`) and `kraft` to configure, build and run the application.

#### Setup

The basic setup is in the `work/02-adding-filesystems/` folder in the session directory.
Enter that folder:

```
$ cd work/02-adding-filesystems/

$ ls -F
guest_fs/  kraft.yaml  launch.sh*  main.c  Makefile  Makefile.uk  qemu-guest*
```

The `guest_fs/` local directory is to be mounted as the root directory (`/`) inside the QEMU/KVM virtual machine.
It contains the `grass` file.
The program (`main.c`) reads the contents of the `/grass` file and prints it to standard output.
`Makefile.uk` lists the `main.c` file as the application source file to be compiled and linked with Unikraft.

`Makefile` is used by the manual configuration and build system.
`kraft.yaml` is used by kraft to configure, build and run the application.

`launch.sh` is a wrapper script around `qemu-system-x86_64` used to manually run the application.
Similarly, `qemu-guest` is a wrapper script [used internally by `kraft`](https://github.com/unikraft/kraft/blob/staging/scripts/qemu-guest).
We'll use it as well to run the application.

**If, at any point of this tutorial, something doesn't work, or you want a quick check, see the reference solution in `sol/02-adding-filesystems/` folder in the session directory.**

### Using the Manual Approach

Firstly, we will use the manual approach to configure, build and run the application.

#### Configure

For filesystem functionalities (opening, reading, writing files) we require a more powerful libc.
[newlib](https://github.com/unikraft/lib-newlib) is already ported in Unikraft and will do nicely.
For this, we update the `LIBS` line in the `Makefile`:

```
LIBS := $(UK_LIBS)/newlib
```

Update the `UK_ROOT` and `UK_LIBS` variables in the `Makefile` to point to the folders storing the Unikraft and libraries repositories.
You can use the folders in `~/a-look-inside/`,

**Make sure that both `unikraft` and `newlib` repositories are on the `staging` branch.**
Go to each of the two repository folders (`unikraft` and `newlib`) and check the current branch:

```
$ git status
On branch staging
```

Now we need to enable **9pfs** and **newlib** in Unikraft.
To do this, we run:

```
$ make menuconfig
```

We need to select the following options, from the `Library Configuration` menu:

* `libnewlib`
* `vfscore: VFS Core Interface`
* `vfscore: VFS Configuration` -> `Automatically mount a root filesystem` -> `Default root filesystem` -> `9pfs`
  * For the `Default root device` option fill the `fs0` string (instead of the default `rootfs` string).

These configurations will also mark as required **9pfs** and **uk9p** in the menu.

We want to run Unikraft with QEMU/KVM, so we must select **KVM guest** in the `Platform Configuration` menu.
For 9PFS we also need to enable, in the **KVM guest** options menu, `Virtio` -> `Virtio PCI device support`.

Save the configuration and exit.

Do a quick check of the configuration in `.config` by pitting it against the `config.sol` file in the reference solution:

```
$ diff -u .config ../../sol/02-adding-filesytstems/config.sol
```

Differences should be minimal, such as the application identifier.

#### Build

Build the Unikraft image:

```
$ make
```

Building the Unikraft image will take a while.
It has to pull the `newlib` source code, patch it and then build it, together with the Unikraft source code.

#### Run with qemu-system-x86_64

To run the Unikraft image with QEMU/KVM, we use the wrapper `launch.sh` script, that calls `qemu-system-x86_64` command with the proper arguments:

```
$ ./launch.sh ./build/02-adding-filesystems_kvm-x86_64
[...]
o.   .o       _ _               __ _
Oo   Oo  ___ (_) | __ __  __ _ ' _) :_
oO   oO ' _ `| | |/ /  _)' _` | |_|  _)
oOo oOO| | | | |   (| | | (_) |  _) :_
 OoOoO ._, ._:_:_,\_._,  .__,_:_, \___)
                   Tethys 0.5.0~825b115
Hello, world!
File contents: The grass is green!
Bye, world!
```

A completely manual run would use the command:

```
$ qemu-system-x86_64 -fsdev local,id=myid,path=guest_fs,security_model=none -device virtio-9p-pci,fsdev=myid,mount_tag=fs0 -kernel build/02-adding-filesystems_kvm-x86_64 -nographic
[...]
Powered by
o.   .o       _ _               __ _
Oo   Oo  ___ (_) | __ __  __ _ ' _) :_
oO   oO ' _ `| | |/ /  _)' _` | |_|  _)
oOo oOO| | | | |   (| | | (_) |  _) :_
 OoOoO ._, ._:_:_,\_._,  .__,_:_, \___)
                   Tethys 0.5.0~825b115
Hello, world!
File contents: The grass is green!
Bye, world!
```

Lets break it down:

* `-fsdev local,id=myid,path=guest_fs,security_model=none` - assign an id (`myid`) to the `guest_fs/` local folder
* `-device virtio-9p-pci,fsdev=myid,mount_tag=fs0` - create a device with the 9pfs type, assign the `myid` for the `-fsdev` option and also assign the mount tag that we configured above (`fs0`)
  Unikraft will look after that mount tag when trying to mount the filesystem, so it is important that the mount tag from the configuration is the same as the one given as argument to qemu.
* `-kernel build/02-adding-filesystems_kvm-x86_64` - tells QEMU that it will run a kernel;
  if this parameter is omitted, QEMU will think it runs a raw file
* `-nographic` - prints the output of QEMU to the standard output, it doesn't open a graphical window

#### Run with qemu-guest

[qemu-guest](https://github.com/unikraft/kraft/blob/staging/scripts/qemu-guest) is the script used by kraft to run its QEMU/KVM images.
Before looking at the command, take some time to look through the script, and maybe figure out the arguments needed for our task.

To run a QEMU/KVM application using `qemu-guest`, we use:

```
$ ./qemu-guest -e guest_fs/ -k build/02-adding-filesystems_kvm-x86_64
```

If we add the `-D` option, we can see the `qemu-system` command generated.

You may get the following error:

```
[    0.100664] CRIT: [libvfscore] <rootfs.c @  122> Failed to mount /: 22
```

If you do, check that the mount tag in the configuration is the same as the one used by `qemu-guest`.
`qemu-guest` will use the tag `fs0`.

**The `fs0` tag is hardcoded for `qemu-guest` (and, thus, for `kraft`).
This is why we used the `fs0` tag when configuring the application with `make menuconfig`.
Another tag could be used but then we couldn't run the application with `qemu-guest` or `kraft`.
It could only be run by manually using `qemu-system-x86_64` with the corresponding arguments.**

### Using kraft

With kraft, the whole process of configuring, building and running Unikraft can be made easier.

By default, kraft uses the `~/.unikraft/` folder where all the repositories are cloned.
As we want to use the repositories in `~/a-look-inside/`, we fill the `UK_WORKDIR` variable:

```
$ export UK_WORKDIR=~/a-look-inside/
```

And clean up the build workplace:

```
$ make distclean
```

#### Configure

First, we need to replace the `TODO` lines in **kraft.yaml**, to reflect our new configuration.
The first set of `TODO` lines correspond to the Unikraft configuration.
They are used by the `kraft configure` command.
This is the equivalent of what `make menuconfig` does.
We need to update those `TODO` lines with:

```yaml
  kconfig:
    - CONFIG_LIBUK9P=y
    - CONFIG_LIB9PFS=y
    - CONFIG_LIBVFSCORE_AUTOMOUNT_ROOTFS=y
    - CONFIG_LIBVFSCORE_ROOTFS_9PFS=y
    - CONFIG_LIBVFSCORE_ROOTDEV="fs0"
```

Then, we need to update the `TODO` lines for the volume configuration (for mounting the filesystem).
These configuration lines are to be used by the `kraft run` command.
We need to update those `TODO` lines with:

```yaml
volumes:
  guest_fs:
    driver: 9pfs
```

In the end, the resulting `kraft.yaml` file will look like this:

```yaml
---
specification: '0.5'
name: 02-adding-filesystems
unikraft:
  version: 'staging'
  kconfig:
    - CONFIG_LIBUK9P=y
    - CONFIG_LIB9PFS=y
    - CONFIG_LIBVFSCORE_AUTOMOUNT_ROOTFS=y
    - CONFIG_LIBVFSCORE_ROOTFS_9PFS=y
    - CONFIG_LIBVFSCORE_ROOTDEV="fs0"
targets:
  - architecture: x86_64
    platform: kvm
libraries:
  newlib:
    version: 'staging'
    kconfig:
      - CONFIG_LIBNEWLIBC=y
volumes:
  guest_fs:
    driver: 9pfs
```

Next, we will make kraft reconfigure our application:

```
$ kraft configure
```

In our case, nothing should be modified in `.config`, as we had the same configuration before.
If you get an error like "missing component: newlib", you may need to run `kraft list update`.

#### Build

We can now build the application using:

```
$ kraft build
```

#### Run

Run the application using:

```
$ kraft run
```

**Note**: This step is not currently working due to [a kraft issue](https://github.com/unikraft/kraft/issues/71).
You can use the fix described in the issue (and the [corresponding pull request](https://github.com/unikraft/kraft/pull/72))to make `kraft run` work.

### 03. Tutorial: Make It Speak

The goal of this exercise is to enable the internal debugging library for Unikraft (`ukdebug`) and make it display messages up to the *info* level.
We also want to identify which hardware components are initialized for both x86 and ARM, and where.
Go to the `helloworld/` application folder:

```
$ cd ~/a-look-inside/apps/helloworld/
```

#### x86_64

We need to enable `ukdebug` in the configuration menu:

```
$ make menuconfig
```

It is located in the `Library Configuration` menu.
Enter the `ukdebug` configuration menu.
We need to have `Enable kernel messages (uk_printk)` checked.
Also, we need to change the option below it, `Kernel message level`, from `Show critical and error messages (default)` to `Show all types of messages`.
To make thing prettier, also enable the `Colored output` option.
After updating the configuration, build Unikraft:

```
$ make
```

And run in under QEMU/KVM.

The output differs.
We can see that, in the case of x86, the platform library initializes less components, or it is less verbose than the ARM one.
But the timer and bus initialization is more verbose.
We see what timer is used, the i8254 one.
Also, we see that the PCI bus is used.

#### ARM

For the ARM part, just change the architecture in the configuration interface:

```
$ make menuconfig
```

After changing the architecture, we have to clean the previously compiled files:

```
$ make clean
```

Build Unikraft:

```
$ make
```

We have a bunch of initializations happening, before seeing the "Hello world!" message.
Let's break them down. We start with the platform internal library, `libkvmplat`.
Here, the hardware components are initialized, like the Serial module, `PL001 UART`, and the `GIC`, which is the interrupt controller.
After that, the memory address space is defined, and the booting process starts, by replacing the current stack with a larger one, that is part of the defined address space.
Lastly, before calling the main function of the application, the software components of Unikraft are initialized, like timers, interrupts, and bus handlers.
The execution ends in in the platform library, with the shutdown command.
