---
title: Syscall Shim and Binary Compatibility Layer
date: 2022-05-13T19:27:37+10:00
weight: 7
summary: "We use the syscall shim layer to run unmodified (binary) applications. Expected time: 75min."
---

##  Syscall Shim and Binary Compatibility Layer

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
   The wrapper function again copies the system call number into specific CPU registers
1. The wrapper function takes care of copying the arguments to the correct registers.
1. Now the wrapper function executes trap instruction (`int 0x80` or `syscall` or `sysenter`).
   This instruction causes the processor to switch from *user mode* to *kernel mode*.
1. We reach a trap handler, that will call the correct kernel function based on the id we passed.
1. The system call service routine is called.

{{< img
  class="max-w-xl mx-auto"
  src="https://qph.fs.quoracdn.net/main-qimg-0cb5c3a6e1fd7642ac988badc7598c0c"
  title="Figure 1"
  caption="Overview of userspace and kernel space separation"
  position="center"
>}}

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

1. The ability to pass the binary to Unikraft
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

As an overview of the whole process, when we want to run an application on Unikraft using binary compatibility, the first step is to pass the application to the unikernel as an initial ramdisk.
Once the unikernel gets the application, the loader reads the executable segments and loads them accordingly.
After the program is loaded, the last step is to jump to its entry point and start executing.

The loader that we currently have implemented in Unikraft only supports executables that are static (so all the libraries are part of the executables) and also position-independent.
A position independent binary (PIE) is a binary that can run correctly independent of the address at which it was loaded.
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

1. The `_ukplat_syscall` function is the handler attached to system call instructions.
   See [the source code](https://github.com/unikraft/unikraft/blob/staging/plat/common/include/x86/cpu.h#L274).
   Whenever the `syscall` instruction is executed, control is passed to the `_ukplat_syscall` function.

   ```
   static inline void _init_syscall(void)
   {
   	[...]
   	wrmsrl(X86_MSR_LSTAR,
   	       (__uptr) _ukplat_syscall);
   	[...]
   ```

1. After some preparatory actions, `_ukplat_syscall` calls `ukplat_syscall_handler`.
   See [the source code](https://github.com/unikraft/unikraft/blob/staging/plat/common/x86/syscall.S#L38).

   ```
   ENTRY(_ukplat_syscall)
   	[...]
   	/*
   	 * Handle call
   	 * NOTE: Handler function is going to modify saved registers state
   	 * NOTE: Stack pointer as "struct __regs *" argument
   	 *       (calling convention: 1st arg on %rdi)
   	 */
   	movq %rsp, %rdi
   	call ukplat_syscall_handler
   	[...]
   ```

   `ukplat_syscall_handler` is also an intermediary function, printing some debug messages and passing the correct parameters further down.
   The next function that gets called is the `uk_syscall6_r` function.
   See [the source code](https://github.com/unikraft/unikraft/blob/staging/lib/syscall_shim/uk_syscall6_r.c.in_end#L7).

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
   See [the generated source code](https://github.com/unikraft/unikraft/blob/staging/lib/syscall_shim/gen_uk_syscall6_r.awk#L16).

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

## Work Items

### Support Files

Session support files are available [in the repository](https://github.com/unikraft/docs/tree/main/content/en/community/hackathons/2022-05-lyon).
The repository is already cloned in the virtual machine.

If you want to clone the repository yourself, do

```
$ git clone https://github.com/unikraft/docs

$ cd docs/content/en/community/hackathons/2022-05-lyon/bincompat/

$ ls
images/  index.md  sol/  work/
```

### 00. Setup

For the practical work we will need the following prerequisites:

* **gcc version >= 8** - installation guide [here](https://linuxize.com/post/how-to-install-gcc-compiler-on-ubuntu-18-04/)

* **the elfloader application** - this is the implementation of our loader which is build like a normal Unikraft application.
  You can clone the [ELF Loader repository](https://github.com/unikraft/app-elfloader/), on the `lyon-hackathon` branch.
  This cloned repo should go into the `apps` folder in your Unikraft directory structure.

* **lwip, zydis, libelf libs** - we have to clone all the repos coresponding to the previously mentioned libraries into the libs folder.
    * [forked lwip](https://github.com/razvand/lib-lwip), on the `lyon-hackathon` branch
    * [zydis](https://github.com/unikraft/lib-zydis)
    * [libelf](https://github.com/unikraft/lib-libelf)

* **unikraft** - the [forked Unikraft repository](https://github.com/razvand/unikraft-bincompat) must also be cloned and checked out on the `bin-compat` branch.

* **test scripts** - the [run-app-elfloader repository](https://github.com/unikraft/run-app-elfloader) with the scripts to run the resulting Unikraft image with binary applications
    * see the [README file](https://github.com/unikraft/run-app-elfloader/blob/master/README.md#run-app-elf-loader) for detailed information

* **test applications** - the [static-pie-apps repository](https://github.com/unikraft/static-pie-apps) stores pre-compiled `static-pie` ELF files

In the end you would have the following setup:

```
.
|-- apps/
|   |-- app-elfloader/     [lyon-hackathon]
|   |-- run-app-elfloader/
|   `-- static-pie-apps/
|-- libs/
|   |-- libelf/
|   |-- lwip/              [lyon-hackathon]
|   `-- zydis/
`-- unikraft/              [bincompat]
```

### 01. Run Binary Applications

We want to test the `run-app-elfloader/` setup together with applications in `static-pie-apps/` repository.

Run as many executables as possible from the `static-pie-apps/` repository.

See the instructions in the [README](https://github.com/unikraft/run-app-elfloader/blob/master/README.md) and run `redis-server` and `sqlite3` static PIE executables.

### 02. Debug Run

See the instructions in the [README](https://github.com/unikraft/run-app-elfloader/blob/master/README.md#running-in-debugging-mode) to run an application in debugging mode.
Add breakpoints to system call functions such as `uk_syscall_r_open`.

### 03. Build app-elfloader from Existing Config

Build the `app-elfloader` from an existing configuration.

Copy the `.config` file from `work/03/config` to the `app-elfloader` folder.
Now you can build it:

```
$ make
```

In the `build/` folder you should have the `app-elfloader_kvm-x86_64` binary.

To run it, go to the `run-app-elfloader` folder and run the `run_elfloader` script by passing it the `-k` option with the correct path to the built binary.

### 04. Doing it From Scratch

Inside the `app-elfloder` folder, remove previous build and configuration files:

```
$ make distclean
```

Now configure it from scratch by running:

```
$ make menuconfig
```

Select the proper `ukdebug` configuration.

Select `9PFS` as the default filesystem and mount it at boot time.

Now you can build it:

```
$ make
```

Test it using the `run_elfloader` script in the the `run-app-elfloader` repository.

### 05. Build with Debugging

Use different `ukdebug` configurations and build the `app-elfloader` with those.
Run applications and see the different messages they print.

### 06. Create your Own Application

Create your own application as a static PIE ELF file.
Use a programming language that provides static PIE ELF files.

Run it with the `app-elfloader`.

## Further Reading

[Elf Loaders, Libraries and Executables on Linux](https://dtrugman.medium.com/elf-loaders-libraries-and-executables-on-linux-e5cfce318f94)
