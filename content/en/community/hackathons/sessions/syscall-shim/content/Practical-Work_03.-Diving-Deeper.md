Now that we saw how we can run an executable on top of Unikraft through binary compatibility, let's take a look at what happens behind the scenes.
For this we have to compile the unikernel with debug printing.

Copy the `config_debug` file to our application folder:

```
$ cp demo/03/config_debug <WORKDIR>/apps/app-elfloader/.config
```

Now, recompile the unikernel:

```
.../<WORKDIR>/apps/app-elfloader$ make properclean
[...]
.../<WORKDIR>/apps/app-elfloader$ make
```

Now, let's rerun the previously compiled executable on top of Unikraft:

```
.../<WORKDIR>/apps/app-elfloader$ qemu-guest -k build/elfloader_kvm-x86_64 -i example/helloworld/helloworld

SeaBIOS (version 1.10.2-1ubuntu1)
Booting from ROM...
Powered by
o.   .o       _ _               __ _
Oo   Oo  ___ (_) | __ __  __ _ ' _) :_
oO   oO ' _ `| | |/ /  _)' _` | |_|  _)
oOo oOO| | | | |   (| | | (_) |  _) :_
 OoOoO ._, ._:_:_,\_._,  .__,_:_, \___)
                  Tethys 0.5.0~825b1150
[    0.153848] dbg:  <0x3f20000> [libukboot] Call constructor: 0x10b810()...
[    0.156271] dbg:  <0x3f20000> [appelfloader] Searching for image...
[    0.159115] dbg:  <0x3f20000> [appelfloader] Load image...
[    0.161569] dbg:  <0x3f20000> [appelfloader] build/elfloader_kvm-x86_64: ELF machine type: 62
[    0.164844] dbg:  <0x3f20000> [appelfloader] build/elfloader_kvm-x86_64: ELF OS ABI: 3
[    0.167843] dbg:  <0x3f20000> [appelfloader] build/elfloader_kvm-x86_64: ELF object type: 3
[...]
```

We now have a more detailed output to see exactly what happens.
The debug output is divided as follows:

1. Debug information that comes from when the unikernel is executing.
1. Debug information that comes from when the binary is executing.

When the unikernel is executing (so our loader application) there are two phases:

1. The *loading phase*: copies the contents of the binary at certain memory zones, as specified by the ELF header.
   You can see the loading phase in the debug output:

   ```
   [appelfloader] Load image...
   [...]
   [appelfloader] build/elfloader_kvm-x86_64: Program/Library memory region: 0x3801000-0x3ac88e0 <- this is the memory zone where our binary will be mapped
   [appelfloader] build/elfloader_kvm-x86_64: Copying 0x171000 - 0x23113e -> 0x3801000 - 0x38c113e <- actual copying of the binary
   [appelfloader] build/elfloader_kvm-x86_64: Zeroing 0x38c113e - 0x38c113e <- zeroing out zones of the binary, like the bss
   [...]
   ```

2. The *execution phase*: sets the correct information on the stack (for example environment variables) and jumps to the program entry point.

   ```
   [appelfloader] Execute image...
   [appelfloader] build/elfloader_kvm-x86_64: image:          0x3801000 - 0x3ac88e0
   [appelfloader] build/elfloader_kvm-x86_64: start:          0x3801000
   [appelfloader] build/elfloader_kvm-x86_64: entry:          0x3809940
   [appelfloader] build/elfloader_kvm-x86_64: ehdr_phoff:     0x40
   [appelfloader] build/elfloader_kvm-x86_64: ehdr_phnum:     8
   [appelfloader] build/elfloader_kvm-x86_64: ehdr_phentsize: 0x38
   [appelfloader] build/elfloader_kvm-x86_64: rnd16 at 0x3f1ff20
   [appelfloader] Jump to program entry point at 0x3809940...
   ```

From this point forward, the binary that we passed in the initial ramdisk starts executing.
Now all the debug messages come from an operation that happened in the binary.
We can also now see the syscall shim layer in action:

```
[libsyscall_shim] Binary system call request "write" (1) at ip:0x3851c21 (arg0=0x1, arg1=0x3c01640, ...)
Hello world!
```

In the above case, the binary used a `write` system call in order to write *Hello world!* to standard output.
