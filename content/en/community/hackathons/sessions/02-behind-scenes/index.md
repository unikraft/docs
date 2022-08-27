---
title: "Session 02: Behind the Scenes"
linkTitle: "02. Behind the Scenes"
---

## Reminders

### Kraft

[Kraft](https://github.com/unikraft/kraft) is the tool developed by the Unikraft team, to make application deployment easier.
To automatically download, configure, build and run an application, for example Helloworld, run

```
$ kraft list update
$ kraft up -t helloworld@staging ./my-first-unikernel
```

If you are already working with cloned / forked repositories from Unikraft, kraft can also help you configure, build and run you application.
`kraft up` can be broken down into the following commands:

```
$ kraft configure
$ kraft build
$ kraft run
```

## Required Tools and Resources

For this session, the following tools are needed: `qemu-kvm`, `qemu-system-x86_64`, `qemu-system-aarch64`, `gcc-aarch64-linux-gnu`.
To install on Debian/Ubuntu use the following command

```
$ sudo apt-get -y install qemu-kvm qemu-system-x86 qemu-system-arm gcc-aarch64-linux-gnu
```

### Support Files

Session support files are available [in the repository](https://github.com/unikraft/summer-of-code-2021).
If you already cloned the repository, update it and enter the session directory:

```
$ cd path/to/repository/clone

$ git pull --rebase

$ cd content/en/docs/sessions/02-behind-scenes/

$ ls
demo/  images/  index.md  sol/
```

If you haven't cloned the repository yet, clone it and enter the session directory:

```
$ git clone https://github.com/unikraft/summer-of-code-2021

$ cd summer-of-code-2021/content/en/docs/sessions/02-behind-scenes/

$ ls
demo/  images/  index.md  sol/
```

## Overview

### 01. Virtualization

Through virtualization, multiple operating systems (OS) are able to run on the same hardware, independently, thinking that each one of them controls the entire system.
This can be done using a hypervisor, which is a low-level software that virtualizes the underlying hardware and manages access to the real hardware, either directly or through the host Operating System.
There are 2 main virtualized environments: virtual machines and containers, each with pros and cons regarding complexity, size, performance and security.
Unikernels come somewhere between those 2.

#### Virtual Machines

Virtual machines represent an abstraction of the hardware, over which an operating system can run, thinking that it is alone on the system and that it controls the hardware below it.
Virtual machines rely on hypervisors to run properly.
Those hypervisors can be classified in 2 categories: Type 1 and Type 2.
We won't go in depth into them, but it is good to know how they are different:

* The **Type 1 hypervisor**, also known as **bare-metal hypervisor**, has direct access to the hardware and controls all the operating systems that are running on the system.
  KVM, despite the appearances, is a Type 1 hypervisor.
* The **Type 2 hypervisor**, also known as **hosted hypervisor**, has to go through the host operating system to reach the hardware.
  An example of Type 2 hypervisor is VirtualBox.

| ![type 1 hypervisor os](/docs/sessions/02-behind-scenes/images/vm1.svg) | ![type 2 hypervisor os](/docs/sessions/02-behind-scenes/images/vm2.svg) |
| :--:									  | :--:								    |
| Operating systems over type 1 hypervisor				  | Operating systems over type 2 hypervisor 				    |

#### Containers

Containers are environments designed to contain and run only one application and its dependencies.
This leads to very small sizes.
The containers are managed by a Container Management Engine, like Docker, and are dependent on the host OS, as they cannot run without it.

| ![containers](/docs/sessions/02-behind-scenes/images/container.svg)	|
| :--: 									|
| Containers								|

#### Unikraft

Unikraft has a size comparable with that of a container, while it retains the power of a virtual machine, meaning it can directly control the hardware components (virtualized, or not, if running bare-metal).
This gives it an advantage over classical Operating Systems.
Being a special type of operating system, Unikraft can run bare-metal or over a hypervisor.

| ![type 1 hypervisor uk](/docs/sessions/02-behind-scenes/images/unikraft1.svg) | ![type 2 hypervisor uk](/docs/sessions/02-behind-scenes/images/unikraft2.svg) |
| :--: | :--: |
| Unikraft over Type 1 hypervisor                                                  | Unikraft over Type 2 hypervisor                           		|

The following table makes a comparison between regular Virtual Machines (think of an Ubuntu VM), Containers and Unikernels, represented by Unikraft:
|                      | Virtual Machines              | Containers                        | Unikernels                  |
| :------------------: | :---------------------------: | :-------------------------------: | :-------------------------: |
| **Time performance** | Slowest of the 3              | Fast                              | Fast                        |
| **Memory footprint** | Heavy                         | Depends on the number of features | Light                       |
| **Security**         | Very secure                   | Least secure of the 3             | Very secure                 |
| **Features**         | Everything you would think of | Depends on the needs              | Only the absolute necessary |

### 02. linuxu and KVM

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

### 03. Unikraft Core

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
  [Uknetdev](https://github.com/unikraft/unikraft/tree/staging/lib/uknetdev) is an internal library that interacts with the network card and defines how packages are sent using it.
  [Lwip](https://github.com/unikraft/lib-lwip) is an external library that defines networking protocols, like IP, TCP, UDP.
  This library knows that the packages are somehow sent over the NIC, but it is not concerned how.
  That is the job of the kernel.

### 04. libc in Unikraft

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
Newlibc and musl are external libraries, from the point of view of Unikraft, and they must be included to the build, as shown in [Session 01: Baby Steps](/docs/sessions/01-baby-steps).

### 05. Configuring Unikraft - Config.uk

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

### 06. The Build System - basics

Once the application is configured, in **.config**, symbols are defined (e.g. `CONFIG_ARCH_X86_64`).
Those symbols are usable both in the C code, to include certain functionalities only if they were selected in the configuring process, and in the actual building process, to include / exclude source files, or whole libraries.
This last thing is done in **Makefile.uk**, where source code files are added to libraries.
During the build process, all the `Makefile.uk` files (from the Unikraft core and external libraries) are evaluated, and the selected files are compiled and linked, to form the Unikraft image.

| ![unikraft build](/docs/sessions/02-behind-scenes/images/build_uk.svg) |
| :--: 									 |
| The build process of Unikraft 					 |

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

Session support files are available [in the repository](https://github.com/unikraft/summer-of-code-2021).
If you already cloned the repository, update it and enter the session directory:

```
$ cd path/to/repository/clone

$ git pull --rebase

$ cd content/en/docs/sessions/02-behind-scenes/

$ ls
demo/  images/  index.md  sol/
```

If you haven't cloned the repository yet, clone it and enter the session directory:

```
$ git clone https://github.com/unikraft/summer-of-code-2021

$ cd summer-of-code-2021/content/en/docs/sessions/02-behind-scenes/

$ ls
demo/  images/  index.md  sol/
```

### 01. Tutorial / Reminder: Building and Running Unikraft

We want to build the Helloworld application, using the Kconfig-based system, for the **linuxu** and **KVM** platforms, for the **ARM** and **x86** architectures, and then run them.

If you don't have the `unikraft` and `app-helloworld` repositories cloned already, do so, by running the following commands:

```
$ git clone https://github.com/unikraft/unikraft
$ cd apps
$ git clone https://github.com/unikraft/app-helloworld helloworld/
```

As you can see from the commands above, it is recommended to have the following file structure in your working directory:

```
workdir
|_______apps
|	|_______helloworld
|_______libs
|_______unikraft
```

Make sure that `UK_ROOT` and `UK_LIBS` are set correctly in the `Makefile` file, in the `helloworld` folder.
If you are not sure if they are set correctly, set them like this:

```
UK_ROOT ?= $(PWD)/../../unikraft
UK_LIBS ?= $(PWD)/../../libs
```

#### Linuxu, x86_64

First, we will the image for the **linuxu** platform.
As the resulting image will be an ELF, we can only run the **x86** Unikraft image.
We follow the steps:

1. While in the `helloworld` folder, run

   ```
   $ make menuconfig
   ```

1. From `Architecture Selection`, select `Architecture` -> `x86 compatible`.
1. From `Platform Configuration`, select `Linux user space`.
1. Save, exit and run

   ```
   $ make
   ```

1. The resulting image, `app-helloworld_linuxu-x86_64` will be present in the `build/` folder.
   Run it.

   ```
   $ ./build/app-helloworld_linuxu-x86_64
   ```

#### KVM, x86_64

Next, we will build the image for the **kvm** platform.
Before starting the process, make sure that you have the necessary tools, listed in the [Required Tools](/docs/sessions/02-behind-scenes/#required-tools) section.
We follow the steps:

1. Run

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
   $ sudo qemu-system-x86_64 -kernel ./build/app-helloworld_kvm-x86_64 -serial stdio
   ```

Besides `-serial stdio`, no other option is needed to run the Helloworld application.
Other, more complex applications, will require more options given to qemu.

We have run Unikraft in the emulation mode, with the command from above.
We can also run it in the virtualization mode, by adding the `-enable-kvm` option.
You may receive a warning, `host doesn't support requested feature:`.
This is because kvm uses a generic CPU model.
You can instruct kvm to use your local CPU model, by adding `-cpu host` to the command.

The final command will look like this:

```
$ sudo qemu-system-x86_64 -enable-kvm -cpu host -kernel ./build/app-helloworld_kvm-x86_64 -serial stdio
```

While we are here, we can check some differences between emulation and virtualization.
Record the time needed by each image to run, using `time`, like this:

```
$ time sudo qemu-system-x86_64 -kernel ./build/app-helloworld_kvm-x86_64 -serial stdio
$ time sudo qemu-system-x86_64 -enable-kvm -cpu host -kernel ./build/app-helloworld_kvm-x86_64 -serial stdio
```

Because `helloworld` is a simple application, the **real** running time will be similar.
The differences are where each image runs most of its time: in user space, or in kernel space.
Find an explanation to those differences.

#### KVM, ARM

To configure Unikraft for the ARM architecture, go to the configuration menu, like before, and select, from `Architecture Selection`, `Armv8 compatible`.
Save and exit the configuration.
As a new architecture is selected, you have to clean the previously compiled files:

```
$ make clean
```

After cleaning, build the image:

```
$ make
```

To run Unikraft, use the following command:

```
$ sudo qemu-system-aarch64 -machine virt -cpu cortex-a57 -kernel ./build/app-helloworld_kvm-arm64 -serial stdio
```

Note that now we need to provide a machine and a CPU model to be emulated, as there are no defaults available.
If you want to find information about other machines, run

```
$ sudo qemu-system-aarch64 -machine help
```

### 02. Tutorial: Make It Speak

The goal of this exercise is to enable the internal debugging library for Unikraft (`ukdebug`) and make it display messages up to the *info* level.
We also want to identify which hardware components are initialized for both x86 and ARM, and where.

#### ARM

Considering that the last exercise ended with an ARM image, we will start now with that configuration.
We need to enable `ukdebug` in the configuration menu.
It is located in the `Library Configuration` menu.
But, for this exercise, besides enabling a component, we must modify it.

Enter the `ukdebug` configuration menu.
We need to have `Enable kernel messages (uk_printk)` checked.
Also, we need to change the option below it, `Kernel message level`, from `Show critical and error messages (default)` to `Show all types of messages`.
To make thing prettier, also enable the `Colored output` option.
Save and exit the configuration, then build and run the image.

We have a bunch of initializations happening, before seeing the "Hello world!" message.
Let's break them down. We start with the platform internal library, `libkvmplat`.
Here, the hardware components are initialized, like the Serial module, `PL001 UART`, and the `GIC`, which is the interrupt controller.
After that, the memory address space is defined, and the booting process starts, by replacing the current stack with a larger one, that is part of the defined address space.
Lastly, before calling the main function of the application, the software components of Unikraft are initialized, like timers, interrupts, and bus handlers.
The execution ends in in the platform library, with the shutdown command.

#### x86_64

For the x86 part, just change the architecture in the configuration interface.
Recall that, after changing the architecture, we have to clean the previously compiled files:

```
$ make clean
```

Build Unikraft:

```
$ make
```

And run in under QEMU/KVM.
The output differs.
We can see that, in the case of x86, the platform library initializes less components, or it is less verbose than the ARM one.
But the timer and bus initialization is more verbose.
We see what timer is used, the i8254 one.
Also, we see that the PCI bus is used.

If you are wondering what the Constructors are, they will be covered in [Session 06: Testing Unikraft](/docs/sessions/06-testing-unikraft/)

### 03. More Messages

Sometimes we need a more detailed output.
For this, `ukdebug` has the option to show *debug* level messages.
Enable them and run Unikraft, for either ARM or x86 architectures, or both.

### 04. Going through the Code

Having the output of `ukdebug`, go through the Unikraft code, in the `unikraft` folder.
Find the components that you have seen in the outputs, in the platform library, and where the kernel messages are sent.
The platform library, even though is called a library, is not in the `lib` subfolder.
It is placed in the `plat` folder.
Explore the code, at your own pace.
Can you also find where the main function is called?

### 05. I Have an Important Message

Send an important kernel message, that everyone needs to see, right before the main function is called.
Try different message levels (critical, error, warning, info, debug), to see how they differ.

Note: sending a critical kernel message will not affect how Unikraft runs after the message.

### 06. Tutorial / Reminder: Adding Filesystems to an Application

For this tutorial, the aim is to create a simple QEMU/KVM application that reads from a file and displays the contents to standard output.
A local directory is to be mounted as the root directory (`/`) inside the QEMU/KVM virtual machine.

Some parts of this tutorial were already discussed in [Session 01: Baby Steps](content/en/docs/sessions/01-baby-steps/index.md).

We will use both the manual approach (`make` and `qemu-system-x86_64` / `qemu-guest`) and `kraft` to configure, build and run the application.

#### Setup

The basic setup is in the `work/06-adding-filesystems/` folder in the session directory.
Enter that folder:

```
$ cd work/06-adding-filesystems/

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

**If, at any point of this tutorial, something doesn't work, or you want a quick check, see the reference solution in `sol/06-adding-filesystems/` folder in the session directory.**

#### Using the Manual Approach

Firstly, we will use the manual approach to configure, build and run the application.

##### Configure

For filesystem functionalities (opening, reading, writing files) we require a more powerful libc.
[newlib](https://github.com/unikraft/lib-newlib) is already ported in Unikraft and will do nicely.
For this, we update the `LIBS` line in the `Makefile`:

```
LIBS := $(UK_LIBS)/newlib
```

Update the `UK_ROOT` and `UK_LIBS` variables in the `Makefile` to point to the folders storing the Unikraft and libraries repositories.

**Make sure that both `unikraft` and `newlib` repositories are on the `staging` branch.**
Go to each of the two repository folders (`unikraft` and `newlib`) and check the current branch:

```
$ git checkout
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
$ diff -u .config ../../sol/06-adding-filesytstems/config.sol
```

Differences should be minimal, such as the application identifier.

##### Build

Build the Unikraft image:

```
make
```

Building the Unikraft image will take a while.
It has to pull newlib source code, patch it and then build it, together with the Unikraft source code.

##### Run with qemu-system-x86_64

To run the Unikraft image with QEMU/KVM, we use the wrapper `launch.sh` script, that calls `qemu-system-x86_64` command with the proper arguments:

```
$ ./launch.sh ./build/unikraft-kraft-9pfs-issue_kvm-x86_64
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
$ qemu-system-x86_64 -fsdev local,id=myid,path=guest_fs,security_model=none -device virtio-9p-pci,fsdev=myid,mount_tag=fs0 -kernel build/06-adding-filesystems_kvm-x86_64 -nographic
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
* `-kernel build/06-adding-filesystems_kvm-x86_64` - tells QEMU that it will run a kernel;
  if this parameter is omitted, QEMU will think it runs a raw file
* `-nographic` - prints the output of QEMU to the standard output, it doesn't open a graphical window

#### Run with qemu-guest

[qemu-guest](https://github.com/unikraft/kraft/blob/staging/scripts/qemu-guest) is the script used by kraft to run its QEMU/KVM images.
Before looking at the command, take some time to look through the script, and maybe figure out the arguments needed for our task.

To run a QEMU/KVM application using `qemu-guest`, we use:

```
$ ./qemu-guest -e guest_fs/ -k build/06-adding-filesystems_kvm-x86_64
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

#### Using kraft

With kraft, the whole process of configuring, building and running Unikraft can be made easier.

##### Configure

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
name: 06-adding-filesystems
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

Next, we will make kraft reconfigure our application, using `kraft configure`.
In our case, nothing should be modified in `.config`, as we had the same configuration before.
If you get an error like "missing component: newlib", you need to run `kraft list update`.

##### Build

We can now build the application using:

```
$ kraft build
```

##### Run

Run the application using:

```
$ kraft run
```

**Note**: This step is not currently working due to [a kraft issue](https://github.com/unikraft/kraft/issues/71).
You can use the fix described in the issue to make `kraft run` work.

### 07. Tutorial: Give the User a Choice

The goal of this exercise is to modify **Config.uk**, for the Helloworld app, so that the user can choose if the app will display *Hello world*, or what it reads from the file from the previous exercise.

First of all, we need to add a new configuration in `Config.uk`.
We will do it like this:

```
config APPHELLOWORLD_READFILE
	bool "Read my file"
	default n
	help
	  Reads the file in guest_fs/ and prints its contents,
	  instead of printing helloworld
```

After this, we need to modify our code in `main.c`, to use this configuration option.

```
#ifndef CONFIG_APPHELLOWORLD_READFILE
	printf("Hello world!\n");
#else
	FILE *in = fopen("file", "r");
	char buffer[100];

	fread(buffer, 1, 100, in);
	printf("File contents: %s\n", buffer);
	fclose(in);
#endif
```

Note that, for our configuration option `APPHELLOWORLD_READFILE`, a symbol, `CONFIG_APPHELLOWORLD_READFILE`, was defined.
We tell GCC that, if that symbol was not defined, it should use the `printf("Hello world!\n")`.
Otherwise, it should use the code written by us.

The last step is to configure the application.
We do this by running `make menuconfig`, then going to the `Application Options` and enabling our configuration option.

Now we can build and run the new Unikraft image.

### 08. Tutorial: Arguments from Command Line

We want to configure the helloworld app to receive command line arguments and then print them.

For this, the Helloworld application already has a configuration option.
Configure the application by running

```
$ make menuconfig
```

In the configuration menu, go to `Application Options` and enable `Print arguments`.
If we build and run the image now, using `qemu-guest`, we will see that two arguments are passed to Unikraft: the kernel argument, and a console.
We want to pass it an aditional argument, `"foo=bar"`.

Before this, make sure to reset your configuration, so Unikraft won't use 9pfs for this task:

```
$ make clean
```

#### Raw qemu command

To send an argument with qemu-system, we use the `-append` option, like this:

```
$ qemu-system-x86_64 -kernel build/app-helloworld_kvm-x86_64 -append "console=ttyS0 foo=bar" -serial stdio
```

#### qemu-guest script

To send an argument with the qemu-guest script, we use the `-a` option, like this:
```
$ ./qemu-guest -k build/app-helloworld_kvm-x86_64 -a "foo=bar"
```

#### Kraft

To send an argument while using kraft, run it like this:

```
$ kraft run "foo=bar"
```

### 09. Adding a new source file

Create a new source file for your application, and implement a function that sorts a given integer array, by calling qsort, in turn, from different libc variants, and then prints that array.
For each library, check the size of the Unikraft image.
Enable **nolibc** and then, as a separate config / build, **newlibc**, both by using **make menuconfig** and modifying **kraft.yaml**.
You will have four different configurations and builds:

* nolibc + kraft
* nolibc + make
* newlibc + kraft
* newlibc + make

### 10. More Power to the User

Add the possibility to include the new source file only if a configuration option is selected.
Make sure that after this change, the application can still be built and run.

### 11. Less Power to the User

Delete `Config.uk` and reconfigure / rebuild the app.
What happens when you run the app?

### 12. Give Us Feedback

We want to know how to make the next sessions better.
Fo this we need your [feedback](https://forms.gle/awraHJpjLaPDeXzk9).
