---
title: "Session 07: Syscall Shim"
linkTitle: "07. Syscall Shim"
---

In this session we are going to understand how we can run applications using the binary compatibility layer as well as the inner workings of the system call shim layer.

One of the obstacles when trying to use Unikraft could be the porting effort of your application.
One way we can avoid this is through binary compatibility.
Binary compatibility is the possibility to take already compiled binaries and run them on top of Unikraft without porting effort and at the same time keeping the benefits of unikernels.
In our case, we support binaries compiled for the Linux kernel.

In order to achieve binary compatibility with the Linux kernel, we had to find a way to have support for system calls, for this, the **system call shim layer** (also called **syscall shim**) was created.
The system call shim layer provides Linux-style mappings of system call numbers to actual system call handler functions.

## Reminders

### Configuring, Building and Running Unikraft

At this stage, you should be familiar with the steps of configuring, building and running any application within Unikraft and know the main parts of the architecture.
Below you can see a list of the commands you have used so far.

| Command                                                | Description                                                             |
|--------------------------------------------------------|-------------------------------------------------------------------------|
| `kraft list`                                           | Get a list of all components that are available for use with kraft      |
| `kraft up -t <appname> <your_appname>`                 | Download, configure and build existing components into unikernel images |
| `kraft run`                                            | Run resulting unikernel image                                           |
| `kraft init -t <appname>`                              | Initialize the application                                              |
| `kraft configure`                                      | Configure platform and architecture (interactive)                       |
| `kraft configure -p <plat> -m <arch>`                  | Configure platform and architecture (non-interactive)                   |
| `kraft build`                                          | Build the application                                                   |
| `kraft clean`                                          | Clean the application                                                   |
| `kraft clean -p`                                       | Clean the application, fully remove the `build/` folder                 |
| `make clean`                                           | Clean the application                                                   |
| `make properclean`                                     | Clean the application, fully remove the `build/` folder                 |
| `make distclean`                                       | Clean the application, also remove `.config`                            |
| `make menuconfig`                                      | Configure application through the main menu                             |
| `make`                                                 | Build configured application (in `.config`)                             |
| `qemu-guest -k <kernel_image>`                         | Start the unikernel                                                     |
| `qemu-guest -k <kernel_image> -e <directory>`          | Start the unikernel with a filesystem mapping of `fs0` id from `<directory>` |
| `qemu-guest -k <kernel_image> -g <port> -P`            | Start the unikernel in debug mode, with GDB server on port `<port>`     |

### System Calls

A system call is the programmatic way in which a process requests a privileged service from the kernel of the operating system.

A system call is not a function, but specific assembly instructions that do the following:

* setup information to identify the system call and its parameters
* trigger a kernel mode switch
* retrieve the result of a system call

In Linux, system calls are identified by a system call ID (a number) and the parameters for system calls are machine word sized (32 or 64 bit).
There can be a maximum of 6 system call parameters.
Both the system call number and the parameters are stored in certain registers.

For example, on 32bit x86 architecture, the system call identifier is stored in the `EAX` register, while parameters in registers `EBX`, `ECX`, `EDX`, `ESI`, `EDI`, `EBP`.

Usually an application does not make a system call directly, but call functions in the system libraries (e.g. libc) that implement the actual system call.

Let's take an example that you can see in the below image:

1. Application program makes a system call by invoking a wrapper function in the C library.
1. Each system call has a unique call number which is used by kernel to identify which system call is invoked.
   The wrapper function again copies the system call number into specific CPU registers.
1. The wrapper function takes care of copying the arguments to the correct registers.
1. Now the wrapper function executes trap instruction (`int 0x80` or `syscall` or `sysenter`).
   This instruction causes the processor to switch from *user mode* to *kernel mode*.
1. We reach a trap handler, that will call the correct kernel function based on the id we passed.
1. The system call service routine is called.

![system_call_image](https://qph.fs.quoracdn.net/main-qimg-0cb5c3a6e1fd7642ac988badc7598c0c)

Now, let's take a quick look at unikernels.
As stated above, in Linux, we use system calls to talk to the operating system, but there is a slight problem.
The system calling process adds some overhead to our application, because we have to do all the extra operations to switch from *user space* to *kernel space*.
In unikernels, because we don't have a delimitation between *kernel space* and *user space* we do not need system calls so everything can be done as simple function calls.
This is both good and bad.
It is good because we do not get the overhead that Linux does when doing a system call.
At the same time it is bad because we need to find a way to support applications that are compiled on Linux, so application that do system calls, even though we don't need them.

## Overview

### 01. The Process of Loading and Running an Application with Binary Compatibility

For Unikraft to achieve binary compatibility there are two main objectives that need to be met:

1. The ability to pass the binary to Unikraft.
1. The ability to load the binary into memory and jump to its entry point.

For the first point we decided to use the initial ramdisk in order to pass the binary to the unikernel.
With `qemu-guest`, in order to pass an initial ramdisk to a virtual machine you have to use the `-initrd` option.
As an example, if we have a `helloworld` binary, we can pass it to the unikernel with the following command:

```
sudo qemu-guest -kernel build/unikernel_image -initrd helloworld_binary
```

After the unikernel gets the binary the next step is to load it into memory.
The dominant format for executables is the *Executable and Linkable File* format (ELF), so, in order to run executables we need an ELF loader.
The job of the ELF Loader is to load the executable into the main memory.
It does so by reading the program headers located in the ELF formatted executable and acting accordingly.
For example, you can see the program headers of a program by running `readelf -l binary`:

```
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
                 0x00000000000053b8 0x0000000000006aa0  RW     0x200000
  DYNAMIC        0x00000000000c3c18 0x00000000002c3c18 0x00000000002c3c18
                 0x00000000000001b0 0x00000000000001b0  RW     0x8
  NOTE           0x0000000000000200 0x0000000000000200 0x0000000000000200
                 0x0000000000000044 0x0000000000000044  R      0x4
  TLS            0x00000000000c0e40 0x00000000002c0e40 0x00000000002c0e40
                 0x0000000000000020 0x0000000000000060  R      0x8
  GNU_EH_FRAME   0x00000000000b3d00 0x00000000000b3d00 0x00000000000b3d00
                 0x0000000000001afc 0x0000000000001afc  R      0x4
  GNU_STACK      0x0000000000000000 0x0000000000000000 0x0000000000000000
                 0x0000000000000000 0x0000000000000000  RW     0x10
  GNU_RELRO      0x00000000000c0e40 0x00000000002c0e40 0x00000000002c0e40
                 0x00000000000031c0 0x00000000000031c0  R      0x1

 Section to Segment mapping:
  Segment Sections...
   00     .note.ABI-tag .note.gnu.build-id .gnu.hash .dynsym .dynstr .rela.dyn .rela.plt .init .plt .plt.got .text __libc_freeres_fn __libc_thread_freeres_fn .fini .rodata .stapsdt.base .eh_frame_hdr .eh_frame .gcc_except_table
   01     .tdata .init_array .fini_array .data.rel.ro .dynamic .got .data __libc_subfreeres __libc_IO_vtables __libc_atexit __libc_thread_subfreeres .bss __libc_freeres_ptrs
   02     .dynamic
   03     .note.ABI-tag .note.gnu.build-id
   04     .tdata .tbss
   05     .eh_frame_hdr
   06
   07     .tdata .init_array .fini_array .data.rel.ro .dynamic .got
```

As an overview of the whole process, when we want to run an application on Unikraft using binary compatibility, the first step is to pass the application to the unikernel as an initial ram disk.
Once the unikernel gets the application, the loader reads the executable segments and loads them accordingly.
After the program is loaded, the last step is to jump to its entry point and start executing.

The loader that we currently have implemented in Unikraft only supports executables that are static (so all the libraries are part of the executables) and also position-independent.
A position independent binary is a binary that can run correctly independent of the address at which it was loaded.
So we need executables that are built using the `-static-pie` compiler / linker option, available in GCC since version 8.

### 02. Unikraft Syscall Shim

As stated previously, the system call shim layer in Unikraft is what we use in order to achieve the same system call behaviour as the Linux kernel.

Let's take a code snippet that does a system call from a binary:

```
mov	edx,4		; message length
mov	ecx,msg		; message to write
mov	ebx,1		; file descriptor (stdout)
mov	eax,4		; system call number (sys_write)
syscall		    ; call kernel
```

In this case, when the `syscall` instruction gets executed, we have to reach the write function inside our unikernel.
In our case, when the `syscall` instruction gets called there are a few steps taken until we reach the **system call** inside Unikraft:

1. After the `syscall` instruction gets executed we reach the `ukplat_syscall_handler`.
   This function has an intermediate role, printing some debug messages and passing the correct parameters further down.
   The next function that gets called is the `uk_syscall6_r` function.

   ```
   void ukplat_syscall_handler(struct __regs *r)
   {
   	UK_ASSERT(r);

   	uk_pr_debug("Binary system call request \"%s\" (%lu) at ip:%p (arg0=0x%lx, arg1=0x%lx, ...)\n",
   		    uk_syscall_name(r->rsyscall), r->rsyscall,
   		    (void *) r->rip, r->rarg0, r->rarg1);
   	r->rret0 = uk_syscall6_r(r->rsyscall,
   				 r->rarg0, r->rarg1, r->rarg2,
   				 r->rarg3, r->rarg4, r->rarg5);
   }
   ```

1. The `uk_syscall6_r` is the function that redirects the flow of the program to the actual **system call** function inside the kernel.

   ```
   switch (nr) {
   	case SYS_brk:
   		return uk_syscall_r_brk(arg1);
   	case SYS_arch_prctl:
   		return uk_syscall_r_arch_prctl(arg1, arg2, arg3);
   	case SYS_exit:
   		return uk_syscall_r_exit(arg1);
       ...
   ```

All the above functions are generated, so the only thing that we have to do when we want to register a system call to the system call shim layer is to use the correct macros.

There are four definition macros that we can use in order to add a system call to the system call shim layer:

* `UK_SYSCALL_DEFINE` - to implement the libc style system calls. That returns `-1` and sets the `errno` accordingly.
* `UK_SYSCALL_R_DEFINE` - to implement the raw variant which returns a negative error value in case of errors. `errno` is not used at all.

The above two macros will generate the following functions:

```C
/* libc-style system call that returns -1 and sets errno on errors */
long uk_syscall_e_<syscall_name>(long <arg1_name>, long <arg2_name>, ...);

/* Raw system call that returns negative error codes on errors */
long uk_syscall_r_<syscall_name>(long <arg1_name>, long <arg2_name>, ...);

/* libc-style wrapper (the same as uk_syscall_e_<syscall_name> but with actual types) */
<return_type> <syscall_name>(<arg1_type> <arg1_name>,
                              <arg2_type> <arg2_name>, ...);
```
For the case that the libc-style wrapper does not match the signature and return type of the underlying system call, a so called low-level variant of these two macros are available: ``UK_LLSYSCALL_DEFINE``, ``UK_LLSYSCALL_R_DEFINE``.
These macros only generate the ``uk_syscall_e_<syscall_name>`` and ``uk_syscall_r_<syscall_name>`` symbols. You can then provide the custom libc-style wrapper on top.

Apart from using the macro to define the function, we also have to register the system call by adding it to `UK_PROVIDED_SYSCALLS-y` withing the corresponding `Makefile.uk` file.
Let's see how this is done with an example for the write system call.
We have the following definition of the write system call:

```C
ssize_t write(int fd, const void * buf, size_t count)
{
    ssize_t ret;

    ret = vfs_do_write(fd, buf, count);
    if (ret < 0) {
        errno = EFAULT;
        return -1;
    }
    return ret;
}
```

The next step is to define the function using the correct macro:

```C
#include <uk/syscall.h>

UK_SYSCALL_DEFINE(ssize_t, write, int, fd, const void *, buf, size_t, count)
{
    ssize_t ret;

    ret = vfs_do_write(fd, buf, count);
    if (ret < 0) {
        errno = EFAULT;
        return -1;
    }
    return ret;
}
```

And the raw variant:

```C
    #include <uk/syscall.h>

    UK_SYSCALL_R_DEFINE(ssize_t, write, int, fd, const void *, buf, size_t, count)
    {
        ssize_t ret;

        ret = vfs_do_write(fd, buf, count);
        if (ret < 0) {
            return -EFAULT;
        }
        return ret;
    }
```

The last step is to add the system call to `UK_PROVIDED_SYSCALLS-y` in the `Makefile.uk` file.
The format is:

`UK_PROVIDED_SYSCALLS-$(CONFIG_<YOURLIB>) += <syscall_name>-<number_of_arguments>`

So, in our case:

`UK_PROVIDED_SYSCALLS-$(CONFIG_LIBWRITESYS) += write-3`

## Summary

The binary compatibility layer is a very important part of the Unikraft unikernel.
It helps us run applications that were not build for Unikraft while, at the same time, keeps the classic benefits of Unikraft: speed, security and small memory footprint.

## Practical Work

### Support Files

Session support files are available [in the repository](https://github.com/unikraft/summer-of-code-2021).
If you already cloned the repository, update it and enter the session directory:

```
$ cd path/to/repository/clone

$ git pull --rebase

$ cd content/en/docs/sessions/07-syscall-shim/

$ ls -F
demo/  images/  index.md  work/
```

If you haven't cloned the repository yet, clone it and enter the session directory:

```
$ git clone https://github.com/unikraft/summer-of-code-2021

$ cd content/en/docs/sessions/07-syscall-shim/

$ ls -F
demo/  images/  index.md  work/
```

### 00. Setup

For the practical work we will need the following prerequisites:

* **gcc version >= 8** - installation guide [here](https://linuxize.com/post/how-to-install-gcc-compiler-on-ubuntu-18-04/).

* **the elfloader application** - this is the implementation of our loader which is build like a normal Unikraft application.
  You can clone the [ELF Loader repository](https://github.com/skuenzer/app-elfloader/), on the `usoc21` branch.
  This cloned repo should go into the `apps` folder in your Unikraft directory structure.

* **the configuration file** - you can find the `config` files in the `demo/01` and `demo/03` folder of this session.

* **lwip, zydis, libelf libs** - we have to clone all the repos corresponding to the previously mentioned libraries into the `libs` folder.
  All of them have to be on the `staging` branch.
    * [lwip](https://github.com/unikraft/lwip.git)
    * [zydis](https://github.com/unikraft/lib-zydis.git)
    * [libelf](https://github.com/unikraft/lib-libelf.git)

* **unikraft** - the [Unikraft repository](https://github.com/unikraft/unikraft) must also be cloned and checked out on the `usoc21` branch.

Set the repositories in a directory of your choosing.
We'll call this directory `<WORKDIR>`.
The final directory structure for this session should look like this:

```
workdir/
`-- apps/
|   `-- app-elfloader/ [usoc21]
`-- libs/
|   |-- lwip/ [staging]
|   |-- libelf/ [staging]
|   `-- zydis/ [staging]
`-- unikraft/ [usoc21]
```

### 01. Compiling the ELF Loader Application

The goal of this task is to make sure that our setup is correct.
The first step is to copy the correct `.config` file into our application.

```
$ cp demo/01/config <WORKDIR>/apps/app-elfloader/.config
```

To check that the config file is the correct one, go to the `app-elfloader/` directory and configure it:

1. Change the directory to `<WORKDIR>/apps/app-elfloader/`.
1. Run `make menuconfig`.
1. Select `library configuration`.
   It should look like the below picture.
   Take a moment and inspect all the sub-menus, especially the syscall-shim one.

   ![Libraries configuration](images/config-image)

If everything is correct, we can run `make` and the image for our unikernel should be compiled.
In the `build` folder you should have the `elfloader_kvm-x86_64` binary.
To also test if it runs correctly:

```
.../<WORKDIR>/apps/app-elfloader$ qemu-guest -k build/elfloader_kvm-x86_64

SeaBIOS (version 1.10.2-1ubuntu1)
Booting from ROM...
Powered by
o.   .o       _ _               __ _
Oo   Oo  ___ (_) | __ __  __ _ ' _) :_
oO   oO ' _ `| | |/ /  _)' _` | |_|  _)
oOo oOO| | | | |   (| | | (_) |  _) :_
 OoOoO ._, ._:_:_,\_._,  .__,_:_, \___)
                  Tethys 0.5.0~825b1150
[    0.105192] ERR:  <0x3f20000> [appelfloader] No image found (initrd parameter missing?)
```

Because we did not pass an initial ramdisk, the loader does not have anything to load, so that's where the error comes from.

### 02. Compile a Static-Pie Executable and Run It On Top of Unikraft

The next step is to get an executable with the correct format.
We require a static executable that is also PIE (*Position-Independent Executable*).

We go to the `apps/app-elfloader/example/helloworld` directory.
We can see that the directory has a `helloworld.c` (a simple helloworld program) and a `Makefile`.
The program will be compiled as a static PIE:

```Makefile
RM = rm -f
CC = gcc
CFLAGS += -O2 -g -fpie # fpie generates position independet code in the object file
LDFLAGS += -static-pie # static-pie makes the final linking generate a static and a pie executable
LDLIBS +=

all: helloworld

%.o: %.c
	$(CC) $(CFLAGS) -c $< -o $@

%: %.o
	$(CC) $(LDFLAGS) $^ $(LDLIBS) -o $@

helloworld: helloworld.o

clean:
	$(RM) *.o *~ core helloworld
```

We can now run `make` so we can get the `helloworld` executable:

```
.../<WORKDIR>/apps/app-elfloader/example/helloworld$ make
gcc -O2 -g -fpie -c helloworld.c -o helloworld.o
gcc -static-pie helloworld.o  -o helloworld

.../<WORKDIR>/apps/app-elfloader/example/helloworld$ ldd helloworld
	statically linked

.../<WORKDIR>/apps/app-elfloader/example/helloworld$ checksec helloworld
[*] '/home/daniel/Faculty/BachelorThesis/apps/app-elfloader/example/helloworld/helloworld'
    Arch:     amd64-64-little
    RELRO:    Full RELRO
    Stack:    Canary found
    NX:       NX enabled
    PIE:      PIE enabled
```

We can see above from the `ldd` and `checksec` output that the `helloworld` executable is a static PIE.

Now, the last part is to pass this executable to our unikernel.
We can use the `-i` option to pass the initial ramdisk to the virtual machine.

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
Hello world!
```

We can see that the binary is successfully loaded and executed.

### 03. Diving Deeper

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

### 04. Solve the Missing Syscall

For the last part of today's session we will try to run another binary on top of Unikraft.
You can find the C program in the `04-missing-syscall/` directory.
Try compiling it as static-pie and then run it on top of Unikraft.

```
[libsyscall_shim] Binary system call request "getcpu" (309) at ip:0x3851926 (arg0=0x3f1fc14, arg1=0x0, ...)
[libsyscall_shim] syscall "getcpu" is not available
[libsyscall_shim] Binary system call request "write" (1) at ip:0x3851cb1 (arg0=0x1, arg1=0x3c01640, ...)
Here we are in the binary, calling getcpu
Getcpu returned: -1
```

Your task is to print a debug message between the `Here we are in the binary` and `Getcpu returned` message above and also make the `sched_getcpu()` return 0.

**Hint 1**: [Syscall Shim Layer](http://docs.unikraft.org/developers-app.html#syscall-shim-layer)

**Hint 2**: Check the `brk.c`, `Makefile.uk` and `exportsyms.uk` files in the `app-elfloader` directory.
You do not have to use `UK_LLSYSCALL_R_DEFINE`, instead, use the two other macros previously described in the session (eg. `UK_SYSCALL_DEFINE` and `UK_SYSCALL_R_DEFINE`).

### 05. Inspect the program flow of an application.

Take the above C program and compile it directly into Unikraft.
Inspect the flow of the program, see how we get from the application code to the library code and then to the unikernel code.
After you see all the functions that get called, modify the program to skip the library code but still keep the same functionality.

**Hint 1**: You should call a function that is generated with the syscall shim macros.

### 06. Give Us Feedback

We want to know how to make the next sessions better. For this we need your [feedback](https://forms.gle/cY75bQ3x4wdpxWKKA). Thank you!

## Further Reading

[Elf Loaders, Libraries and Executables on Linux](https://dtrugman.medium.com/elf-loaders-libraries-and-executables-on-linux-e5cfce318f94)
