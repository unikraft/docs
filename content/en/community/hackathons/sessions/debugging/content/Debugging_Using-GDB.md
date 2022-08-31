The build system always creates two image files for each selected platform:

* one that includes debugging information and symbols (`.dbg` file extension)
* one that does not

Before using GDB, go to the configuration menu under `Build Options` and select a `Debug information level` that is bigger than 0.
We recommend 3, the highest level.

![debug information level](/community/hackathons/sessions/debugging/images/debug_information_level.png)

Once set, save the configuration and build your images.

#### Linuxu

For the Linux user space target (`linuxu`) simply point GDB to the resulting debug image, for example:

```bash
$ gdb build/app-helloworld_linuxu-x86_64.dbg
```

#### KVM

For KVM, you can start the guest with the kernel image that includes debugging information, or the one that does not.
We recommend creating the guest in a paused state (the `-S` option):

```bash
$ qemu-system-x86_64 -s -S -cpu host -enable-kvm -m 128 -nodefaults -no-acpi -display none -serial stdio -device isa-debug-exit -kernel build/app-helloworld_kvm-x86_64.dbg -append verbose
```

Note that the `-s` parameter is shorthand for `-gdb tcp::1234`.
To avoid this long `qemu-system-x86` command with a lot of arguments, we can use `qemu-guest`.

```bash
$ qemu-guest -P -g 1234 -k build/app-helloworld_kvm-x86_64.dbg
```

Now connect GDB by using the debug image with:

```bash
$ gdb --eval-command="target remote :1234" build/app-helloworld_kvm-x86_64.dbg
```

Unless you're debugging early boot code (until `_libkvmplat_start32`), you’ll need to set a hardware break point.
Hardware breakpoints have the same effect as the common software breakpoints you are used to, but they are different in the implementation.
As the name suggests, hardware breakpoints are based on direct hardware support.
This may limit the number of breakpoints you can set, but makes them especially useful when debugging kernel code.

```bash
hbreak [location]
continue
```

We'll now need to set the right CPU architecture:

```bash
disconnect
set arch i386:x86-64:intel
```

And reconnect:
```bash
tar remote localhost:1234
```

You can now run `continue` and debug as you would do normally.

#### Xen

For Xen, you first need to create a VM configuration (save it under `helloworld.cfg`):

```text
name          = 'helloworld'
vcpus         = '1'
memory        = '4'
kernel        = 'build/app-helloworld_xen-x86_64.dbg'
```
Start the virtual machine with:

`$ xl create -c helloworld.cfg`


For Xen the process is slightly more complicated and depends on Xen's `gdbsx` tool.
First you'll need to make sure you have the tool on your system.
Here are sample instructions to do that:

```bash
[get Xen sources]
$ ./configure
$ cd tools/debugger/gdbsx/ && make
```

The `gdbsx` tool will then be under tools/debugger.
For the actual debugging, you first need to create the guest (we recommend paused state: `xl create -p`), note its domain ID (`xl list`) and execute the debugger backend:

```bash
$ gdbsx -a [DOMAIN ID] 64 [PORT]
```

You can then connect GDB within a separate console and you're ready to debug:

```bash
$ gdb --eval-command="target remote :[PORT]" build/helloworld_xen-x86_64.dbg
```

You should also be able to use the debugging file (`build/app-helloworld_xen-x86_64.dbg`) for GDB instead passing the kernel image.
