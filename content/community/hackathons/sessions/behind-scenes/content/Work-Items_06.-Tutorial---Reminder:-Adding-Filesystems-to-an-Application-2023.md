For this tutorial, the aim is to create a simple QEMU / KVM application that reads from a file and displays the contents to standard output.
A local directory is to be mounted as the root directory (`/`) inside the QEMU / KVM virtual machine.
#### Setup

The basic setup is in the `work/03-adding-filesystems/` folder in the session directory. 

**If, at any point of this tutorial, something doesn't work, or you want a quick check, see the reference solution in `sol/03-adding-filesystems/` folder in the session directory.**

1. Enter the `work/03-adding-filesystems/:

    ```console
    $ cd work/03-adding-filesystems/

    $ ls -F
    guest_fs/  kraft.yaml  launch.sh*  main.c  Makefile  Makefile.uk  qemu-guest*
    ```

    * The `guest_fs/` local directory is to be mounted as the root directory (`/`) inside the QEMU / KVM virtual machine.
    It contains the `grass` file.
    * The program (`main.c`) reads the contents of the `/grass` file and prints it to standard output.
    * `Makefile.uk` lists the `main.c` file as the application source file to be compiled and linked with Unikraft.
    * `Makefile` is used by the manual configuration and build system.
    * `launch.sh` is a wrapper script around `qemu-system-x86_64` used to manually run the application.
We'll use it as well to run the application.


1. Clone the Unikraft repository:

    ```console
    $ mkdir .unikraft
    $ cd .unikraft/
    $ mkdir libs/
    $ cd ../
    ```

1. Add the `lib-musl` repository:

    For filesystem functionalities (opening, reading, writing files) we require a more powerful libc.
    [Musl](https://github.com/unikraft/lib-musl) is already ported in Unikraft and will do nicely:

    ```console
    $ cd .unikraft/libs
    $ git clone https://github.com/unikraft/lib-musl musl
    ```

    We also need to update the `LIBS` line in the `Makefile`:

    ```console
    LIBS := $(UK_LIBS)/musl
    ```

### Configuring the application

Now we need to enable **9pfs** and **musl** in Unikraft.
To do this, we run:

```console
$ make menuconfig
```

We need to select the following options, from the `Library Configuration` menu:

* `libmusl`
* `vfscore: VFS Core Interface`
* `vfscore: VFS Configuration` -> `Automatically mount a root filesystem` -> `Default root filesystem` -> `9pfs`
  * For the `Default root device` option fill the `fs0` string.

These configurations will also enable the **9pfs** and **uk9p** internal libraries the menu.

We want to run Unikraft with QEMU / KVM, so we must select **KVM guest** in the `Platform Configuration` menu.
For 9pfs we also need to enable, in the **KVM guest** options menu, `Virtio` -> `Virtio PCI device support`.

Save the configuration and exit.

Do a quick check of the configuration in `.config` by pitting it against the `config.sol` file in the reference solution:

```console
$ diff -u .config ../../sol/03-adding-filesytstems/config.sol
```
Differences should be minimal, such as the application identifier.

**Build**

Build the Unikraft image:

```console
make
```

Building the Unikraft image will take a while.
It has to pull musl source code, patch it and then build it, together with the Unikraft source code.

**Run with qemu-system-x86_64**

To run the Unikraft image with QEMU / KVM, we use the wrapper `launch.sh` script, that calls `qemu-system-x86_64` command with the proper arguments:

```console
$ ./launch.sh ./build/06-adding-filesystems_qemu-x86_64
[...]
Powered by
o.   .o       _ _               __ _
Oo   Oo  ___ (_) | __ __  __ _ ' _) :_
oO   oO ' _ `| | |/ /  _)' _` | |_|  _)
oOo oOO| | | | |   (| | | (_) |  _) :_
 OoOoO ._, ._:_:_,\_._,  .__,_:_, \___)
                  Atlas 0.13.1~5eb820bd
Hello, world!
File contents: The grass is green!
Bye, world!
```

A completely manual run would use the command:

```console
$ qemu-system-x86_64 -fsdev local,id=myid,path=guest_fs,security_model=none -device virtio-9p-pci,fsdev=myid,mount_tag=fs0 -kernel build/06-adding-filesystems_qemu-x86_64 -nographic
[...]
Powered by
o.   .o       _ _               __ _
Oo   Oo  ___ (_) | __ __  __ _ ' _) :_
oO   oO ' _ `| | |/ /  _)' _` | |_|  _)
oOo oOO| | | | |   (| | | (_) |  _) :_
 OoOoO ._, ._:_:_,\_._,  .__,_:_, \___)
                  Atlas 0.13.1~5eb820bd
Hello, world!
File contents: The grass is green!
Bye, world!
```

Lets break it down:

* `-fsdev local,id=myid,path=guest_fs,security_model=none` - assign an id (`myid`) to the `guest_fs/` local folder
* `-device virtio-9p-pci,fsdev=myid,mount_tag=fs0` - create a device with the 9pfs type, assign the `myid` for the `-fsdev` option and also assign the mount tag that we configured above (`fs0`)
  Unikraft will look after that mount tag when trying to mount the filesystem, so it is important that the mount tag from the configuration is the same as the one given as argument to qemu.
* `-kernel build/06-adding-filesystems_qemu-x86_64` - tells QEMU that it will run a kernel;
  if this parameter is omitted, QEMU will think it runs a raw file
* `-nographic` - prints the output of QEMU to the standard output, it doesn't open a graphical window