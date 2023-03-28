---
title: Using an Already Compiled Application
date: 2023-03-27T14:09:21+09:00
weight: 403
---

## Using an Already Compiled Application

One of the obstacles when trying to use Unikraft is the porting effort of new applications.
This process can be made painless through the use of Unikraft's **binary compatibility layer**.
Binary compatibility is the possibility to take pre-built Linux ELF binaries and run them on top of Unikraft.
This is done without any porting effort while maintaining the benefits of Unikraft: reduced memory footprint, high degree of configurability of library components.

For this, Unikraft must provide a similar ABI (*Application Binary Interface*) with the Linux kernel.
This means that Unikraft has to provide a similar system call interface that Linux kernel provides, a [POSIX](https://pubs.opengroup.org/onlinepubs/9699919799.2018edition/) compatible interface.
For this, the [**system call shim layer**](https://github.com/unikraft/unikraft/tree/staging/lib/syscall_shim) (also called **syscall shim**) was created.
The system call shim layer provides Linux-style mappings of system call numbers to actual system call handler functions.

You can find more information on the Unikraft's `syscall-shim` layer [here](docs/develop/syscall-shim/).

## Loading and Running Application

In order to achieve binary compatibility, two main objectives must be met:

1. The ability to pass the `ELF` binary and the shared libraries to Unikraft at boot time.
1. The ability to load the passed `ELF` binary and the shared libraries into memory and jump to its entry point.

For the first point we decided to use the initial `ramdisk` in order to pass the binary to the unikernel.
With the [`qemu-guest` script](https://github.com/unikraft/unikraft/blob/staging/support/scripts/qemu-guest), in order to pass an initial `ramdisk` to a virtual machine you have to use the `-initrd` option.
As an example, if we have a `helloworld` binary, we can pass it to the unikernel with the following command:

```console
$ qemu-guest -kernel build/unikernel_image -initrd helloworld_binary
```

After the unikernel reads the binary, the next step is to load it into memory.
The dominant format for executables is the [*Executable and Linkable File* format](https://en.wikipedia.org/wiki/Executable_and_Linkable_Format) (ELF), so, in order to run executables we need an ELF loader.
The job of the ELF Loader is to load the executable into the main memory.
It does so by reading the program headers located in the ELF formatted executable and acting accordingly.
For example, you can see the program headers of a program by running `readelf -l binary`:

```console
$ readelf -l helloworld_binary

Elf file type is DYN (Shared object file)
Entry point 0x8940
There are 8 program headers, starting at offset 64

Program Headers:
  Type           Offset             VirtAddr           PhysAddr
                 FileSiz            MemSiz              Flags  Align
  LOAD           0x0000000000000000 0x0000000000000000 0x0000000000000000
                 0x00000000000c013e 0x00000000000c013e  R E    0x200000
  LOAD           0x00000000000c0e40 0x00000000002c0e40 0x00000000002c0e40
```

As an overview of the whole process, when we want to run an application on Unikraft using binary compatibility, the first step is to pass the executable file to the unikernel as an initial `ramdisk`.
Once the unikernel gets the executable, it reads the executable segments and loads them accordingly.
After the program is loaded, the last step is to jump to its entry point and start executing.

The unikernel image is the [`app-elfloader` application](https://github.com/unikraft/app-elfloader).
This application parses the ELF file and then loads it accordingly.

Currently, the `app-elfloader` only supports [statically linked position-independent executables](https://en.wikipedia.org/wiki/Position-independent_code#Position-independent_executables) (PIE) compiled for Linux on `x86_64`.
Dynamically linked PIE executables can be loaded using the corresponding official dynamic loader (e.g. [`ld-linux.so*`](https://linux.die.net/man/8/ld-linux) from `glibc`).
This loader will be recognized as a statically linked PIE executable, which will be passed to the `elfloader` application via the `initrd` argument.

### Building the `elfloader` Application

Building the `elfloader` app works just like [building any other Unikraft application](https://linux.die.net/man/8/ld-linux).
The necessary external libraries for building the `elfloader` are [`libelf`](https://github.com/unikraft/lib-libelf), [`lwip`](https://github.com/unikraft/lib-lwip) and [`zydis`](https://github.com/unikraft/lib-zydis).
Assuming we are in an empty working directory, we can clone all the dependencies using the following commands:

```console
$ git clone https://github.com/unikraft/unikraft.git
$ mkdir apps/
$ mkdir libs/
$ git clone https://github.com/unikraft/app-elfloader apps/elfloader
$ git clone https://github.com/unikraft/lib-libelf libs/libelf
$ git clone https://github.com/unikraft/lib-lwip libs/lwip
$ git clone https://github.com/unikraft/lib-zydis libs/zydis
```

After all that, we should be left with a file structure that looks like this:

```console
$ tree
.
|-- apps
|   `-- elfloader
|-- libs
|   |-- libelf
|   |-- lwip
|   `-- zydis
`-- unikraft
```

We can then go into the `apps/elfloader/` directory and run:

```console
$ make menuconfig
```

In the configuration menu, we need to do the following changes:

1. Select `KVM guest` from the `Platform Configuration` screen.
1. Under the `Platform Configuration -> Platform Interface Options` select `Virtual Memory API`.
1. Under the `Library Configuration` screen, unselect `ukmmap` and select `ukvmem` and `posix-mmap`.
1. Under the `Library Configuration -> ukvmem` screen, select all the `Use dedicated *` options.
1. If you want to use a filesystem with your application, under the `Library Configuration -> vfscore: Configuration`, select the `Automatically mount a root filesysytem` option and choose the default `root filesystem` to be `9PFS`.
1. Change the `Default root device` to `fs0` in the `vfscore: Configuration` screen above, to be able to use the `qemu-guest` script.
1. Select `lwip` under the `Library Configuration` screen if the applications that we will run require networking support.

We can then save our configuration and build the `elfloader`:

```console
$ make -j $(ncpus)
```

### Running Static-PIE Executables

To run a static PIE executable, we can simply pass it over as `initrd`.
We can do that by using the `-i` option with `qemu-guest`.
There is already a source file and `Makefile` for us to test in the `apps/elfloader/example/helloworld/` directory.
We can build the `helloworld` static PIE executable by running `make`.
We can use `ldd` to see that the resulting executable is a static PIE:

```console
$ ldd helloworld
    statically linked
```

We can then pass it to the `elfloader` unikernel:

```console
$ qemu-guest -k build/elfloader_kvm-x86_64 -i example/helloworld/helloworld
SeaBIOS (version 1.13.0-1ubuntu1.1)
Booting from ROM...
Powered by
o.   .o       _ _               __ _
Oo   Oo  ___ (_) | __ __  __ _ ' _) :_
oO   oO ' _ `| | |/ /  _)' _` | |_|  _)
oOo oOO| | | | |   (| | | (_) |  _) :_
 OoOoO ._, ._:_:_,\_._,  .__,_:_, \___)
             Epimetheus 0.12.0~5bd4b94d
Hello world!
```

{{% alert theme="info" %}}
Note that if we selected the `Automatically Mount a Filesystem` option under the `vfscore: Configuration` screen, we must also pass it to `qemu-guest` by using the `-e path/to/local/fs/` option.
{{% /alert %}}

We can also pass arguments to your application by using the `-a "<application arguments>"` option.

### Running Dynamically Linked Executables

To run a dynamically linked PIE executable, we must pass the loader as a static PIE to the `elfloader` and place the application inside a `9pfs` filesystem, along with its dependencies.
We can use `ldd` to list the dynamic libraries on which the application depends in order to start.
Say we remove the `-static-pie` flag from the `example/helloworld/Makefile` file, build the app again and get a dynamically linked executable.
To list all the dependencies, we can run:

```console
$ ldd example/helloworld/helloworld
    linux-vdso.so.1 (0x00007ffe16a63000)
    libc.so.6 => /lib/x86_64-linux-gnu/libc.so.6 (0x00007fafbfd3d000)
    /lib64/ld-linux-x86-64.so.2 (0x00007fafbff60000)
```

{{% alert theme="info" %}}
Note that the `linux-vdso.so.1` file is provided by the Linux kernel and is not present on the filesystem, so we will ignore it.
On the other hand, `/lib64/ld-linux-x86-64.so.2` is the system loader, that we will pass as an `initrd` to our `elfloader`.
{{% /alert %}}

We will copy the `helloworld` application, along with all its dependencies in a new directory, `rootfs`.

```console
$ mkdir rootfs/
$ mv example/helloworld/helloworld rootfs/
$ mv /lib/x86_64-linux-gnu/libc.so.6 rootfs/
```

Since we will use an external filesystem, we must enable the `Automatically mount a Filesystem` option in the `Library Configuration -> vfscore: Configuration` screen.
To run the application, we will pass to the static loader the path to the application dependencies and the path to the application, by using the `-a "<application argument>"` option in `qemu-guest`.

{{% alert theme="info" %}}
Note that for running dynamically linked applications, you must also add [this commit](https://github.com/unikraft/app-elfloader/pull/9) to the `elfloader` application.
{{% /alert %}}

After the `rootfs/` directory is populated with all the dependencies, we can run the application using the `qemu-guest` script:

```console
$ qemu-guest -k build/elfloader_kvm-x86_64 -i /lib64/ld-linux-x86-64.so.2 -e rootfs/ -a "/ld-linux-x86-64.so.2 --library-path / /helloworld"
SeaBIOS (version 1.13.0-1ubuntu1.1)
Booting from ROM...
Powered by
o.   .o       _ _               __ _
Oo   Oo  ___ (_) | __ __  __ _ ' _) :_
oO   oO ' _ `| | |/ /  _)' _` | |_|  _)
oOo oOO| | | | |   (| | | (_) |  _) :_
 OoOoO ._, ._:_:_,\_._,  .__,_:_, \___)
             Epimetheus 0.12.0~5bd4b94d
Hello world!
```
