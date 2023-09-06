We want to enable debugging for the `KVM` platform and the `x86_64` architecture.
We do this by enabling the `ukdebug` library in the configuration menu.
It is located in the `Library Configuration` menu.

We follow the steps.

**Clean the Environment**

```console
$ make distclean
```

**Configure the Application**

```console
$ make menuconfig
```

In the configuration screen, follow the steps:

1. From `Architecture Selection`, select `Architecture` -> `x86 compatible`.
1. From `Platform Configuration`, select `KVM guest`.
1. From `Library Configuration`, enter the `ukdebug` menu.
   1. Select the `Enable kernel messages (uk_printk)` entry.
   1. Change the option below it, `Kernel message level`, from `Show critical and error messages (default)` to `Show all types of messages`.
   1. To make things prettier, also enable the `Colored output` option.
1. Save and exit.

**Build the Application**

```console
$ make prepare
$ make -j $(nproc)
```

**Run the Unikraft Application**

```console
$ sudo qemu-system-x86_64 -kernel ./build/app-helloworld_qemu-x86_64 -nographic
```

```console
Booting from ROM..[    0.000000] Info: [libkvmplat] <setup.c @  245> Memory 00fd00000000-010000000000 outside mapped area                             
[    0.000000] Info: [libkvmplat] <bootinfo.c @   56> Unikraft Atlas (0.13.1~28d0edfe)                                                                
[    0.000000] Info: [libkvmplat] <bootinfo.c @   59> Architecture: x86_64                                                                            
[    0.000000] Info: [libkvmplat] <bootinfo.c @   62> Boot loader : qemu-multiboot                                                                    
[    0.000000] Info: [libkvmplat] <bootinfo.c @   67> Command line: ./build/app-helloworld_qemu-x86_64
[...]
[    0.000000] Info: [libukboot] <boot.c @  288> Initialize memory allocator...
[    0.000000] Info: [libukallocbbuddy] <bbuddy.c @  515> Initialize binary buddy allocator 183000
[    0.000000] Info: [libukboot] <boot.c @  313> Initialize IRQ subsystem...
[    0.000000] Info: [libukboot] <boot.c @  320> Initialize platform time...
[    0.000000] Info: [libkvmplat] <tscclock.c @  255> Calibrating TSC clock against i8254 timer
[...]
[    0.111088] Info: [libukboot] <boot.c @  369> Pre-init table at 0x120060 - 0x120060
[    0.111823] Info: [libukboot] <boot.c @  380> Constructor table at 0x120060 - 0x120060
[    0.112619] Info: [libukboot] <boot.c @  401> Calling main(1, ['./build/app-helloworld_qemu-x86_64'])
Hello world
[    0.114181] Info: [libukboot] <boot.c @  410> main returned 0, halting system
[    0.115266] Info: [libkvmplat] <shutdown.c @   35> Unikraft halted
```

We now see some information about what happens from the booting process until the application actually starts.
Furthermore, we are able to see all the initialization performed and how much they take. 
