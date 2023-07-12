The build system always creates two image files for each selected platform:

* one that includes debugging information and symbols (`.dbg` file extension)
* one that does not

Before using GDB, go to the configuration menu under `Build Options` and select a `Debug information level` that is bigger than 0.
We recommend 3, the highest level.

![debug information level](/community/hackathons/sessions/debugging/images/debug_information_level.png)

In most cases, we'll be running our unikernel using QEMU. We won't be able to simply run the binary
with GDB, but we be using [gdb’s remote-connection facility](https://qemu-project.gitlab.io/qemu/system/gdb.html).


Once set, save the configuration and build your images.

#### Linuxu

For the Linux user space target (`linuxu`) simply point GDB to the resulting debug image, for example:

```console
$ gdb build/app-helloworld_linuxu-x86_64.dbg
```

#### KVM
When running under a virtualized environment, we cannot simply call gdb on the resulting unikernel image
because it is not a linux binary. In this case, we will be using gdb's remote-connection facility to
connect to a GDB server in QEMU.

We will run the guest image in a paused state, the `-S` option, which prevents the virtual CPU from starting:

```console
$ qemu-system-x86_64 -s -S -cpu host -enable-kvm -m 128 -nodefaults -no-acpi -display none -nographic -device isa-debug-exit -kernel build/app-helloworld_kvm-x86_64 -append verbose
```

Now we can connect to the gdb server and start running the guest. Note that the `-s` parameter is shorthand for `-gdb tcp::1234`.
To avoid this long `qemu-system-x86` command with a lot of arguments, we can use `qemu-guest`.

```console
$ qemu-guest -P -g 1234 -k build/app-helloworld_kvm-x86_64
```

Now connect GDB by using the debug image with:

```console
$ gdb --eval-command="target remote :1234" build/app-helloworld_kvm-x86_64.dbg
```

Unless you're debugging early boot code (until `_libkvmplat_start32`), you’ll need to set a hardware break point.
Hardware breakpoints have the same effect as the common software breakpoints you are used to, but they are different in the implementation.
As the name suggests, hardware breakpoints are based on direct hardware support.
This may limit the number of breakpoints you can set, but makes them especially useful when debugging kernel code.

```console
(gdb) hbreak [location]
(gdb) continue
```

We'll now need to set the right CPU architecture:

```console
(gdb) disconnect
(gdb) set arch i386:x86-64:intel
```

And reconnect:

```console
(gdb) tar remote localhost:1234
```

You can now run `continue` and debug as you would do normally.