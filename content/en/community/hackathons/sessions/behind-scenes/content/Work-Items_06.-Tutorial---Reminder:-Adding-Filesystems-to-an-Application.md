For this tutorial, the aim is to create a simple QEMU / KVM application that reads from a file and displays the contents to standard output.
A local directory is to be mounted as the root directory (`/`) inside the QEMU / KVM virtual machine.

Some parts of this tutorial were already discussed in [Session 01: Baby Steps](community/hackathons/sessions/baby-steps).

We will use both the manual approach (`make` and `qemu-system-x86_64` / `qemu-guest`) and `kraft` to configure, build and run the application.

#### Setup

The basic setup is in the `work/06-adding-filesystems/` folder in the session directory.
Enter that folder:

```
$ cd work/06-adding-filesystems/

$ ls -F
guest_fs/  kraft.yaml  launch.sh*  main.c  Makefile  Makefile.uk  qemu-guest*
```

The `guest_fs/` local directory is to be mounted as the root directory (`/`) inside the QEMU / KVM virtual machine.
It contains the `grass` file.
The program (`main.c`) reads the contents of the `/grass` file and prints it to standard output.
`Makefile.uk` lists the `main.c` file as the application source file to be compiled and linked with Unikraft.

`Makefile` is used by the manual configuration and build system.
`kraft.yaml` is used by kraft to configure, build and run the application.

`launch.sh` is a wrapper script around `qemu-system-x86_64` used to manually run the application.
Similarly, `qemu-guest` is a wrapper script [used internally by `kraft`](https://github.com/unikraft/kraft/blob/staging/scripts/qemu-guest).
We'll use it as well to run the application.

**Important**: This setup belongs as an application folder in the `apps/` folder in your working directory as discussed in [the 1st tutorial of this session](#01-tutorial--reminder-building-and-running-unikraft).
Your best approach would be to copy this folder (`work/06-adding-filesystems/`) to the `apps/` folder in your working directory.
You will then get a hierarchy such as:

```
.
|-- apps/
|   |-- 06-adding-filesystems/
|   `-- helloworld/
|-- libs/
`-- unikraft/
```

**If, at any point of this tutorial, something doesn't work, or you want a quick check, see the reference solution in `sol/06-adding-filesystems/` folder in the session directory.**

#### Using the Manual Approach

Firstly, we will use the manual approach to configure, build and run the application.

**Configure**

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

We want to run Unikraft with QEMU / KVM, so we must select **KVM guest** in the `Platform Configuration` menu.
For 9pfs we also need to enable, in the **KVM guest** options menu, `Virtio` -> `Virtio PCI device support`.

Save the configuration and exit.

Do a quick check of the configuration in `.config` by pitting it against the `config.sol` file in the reference solution:

```
$ diff -u .config ../../sol/06-adding-filesytstems/config.sol
```

Differences should be minimal, such as the application identifier.

**Build**

Build the Unikraft image:

```
make
```

Building the Unikraft image will take a while.
It has to pull newlib source code, patch it and then build it, together with the Unikraft source code.

**Run with qemu-system-x86_64**

To run the Unikraft image with QEMU / KVM, we use the wrapper `launch.sh` script, that calls `qemu-system-x86_64` command with the proper arguments:

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

**Run with qemu-guest**

[qemu-guest](https://github.com/unikraft/kraft/blob/staging/scripts/qemu-guest) is the script used by kraft to run its QEMU / KVM images.
Before looking at the command, take some time to look through the script, and maybe figure out the arguments needed for our task.

To run a QEMU / KVM application using `qemu-guest`, we use:

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

**Build**

We can now build the application using:

```
$ kraft build
```

**Run**

Run the application using:

```
$ kraft run
```

**Note**: This step is not currently working due to [a kraft issue](https://github.com/unikraft/kraft/issues/71).
You can use the fix described in the issue to make `kraft run` work.
