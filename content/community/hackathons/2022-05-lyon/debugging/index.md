---
title: Debugging in Unikraft
date: 2022-05-13T19:27:37+10:00
weight: 4
summary: "We discuss about using GDB to debug Unikraft. Expected time: 75min."
---

## Debugging in Unikraft

_The slides for this session can be found [here](/community/hackathons/2022-05-lyon/debugging/slides.pdf)._

Because unikernels aim to be a more efficient method of virtualization, this can sometimes cause problems.
This session aims to familiarize you to solve any problem encountered during the development using **GDB**.

## Reminders

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
| `make menuconfig`                                      | Configure application through the main menu                             |


## Support Files

Session support files are available [in the repository](https://github.com/unikraft/docs/tree/main/content/en/community/hackathons/2022-05-lyon).
The repository is already cloned in the virtual machine.

If you want to clone the repository yourself, do

```
$ git clone https://github.com/unikraft/docs

$ cd docs/content/en/community/hackathons/2022-05-lyon/debugging/

$ ls
demo/  images/  index.md  sol/  work/
```

## Debugging

Contrary to popular belief, debugging a unikernel is in fact simpler than debugging a standard operating system.
Since the application and OS are linked into a single binary, debuggers can be used on the running unikernel to debug both application and OS code at the same time.
A couple of hints that should help starting:

1. In the configuration menu (presented with `make menuconfig`), under `Build Options` make sure that `Drop unused functions and data` is **unselected**.
   This prevents Unikraft from removing unused symbols from the final image and, if enabled, might hide missing dependencies during development.
2. Use `make V=1` to see verbose output for all of the commands being executed during the build.
   If the compilation for a particular file is breaking and you would like to understand why (e.g., perhaps the include paths are wrong), you can debug things by adding the `-E` flag to the command, removing the `-o [objname]`, and redirecting the output to a file which you can then inspect.
3. Check out the targets under `Miscellaneous` when typing `make help`, these may come in handy.
   For instance, `make print-vars` enables inspecting at the value of a particular variable in `Makefile.uk`.
4. Use the individual `make clean-[libname]` targets to ensure that you're cleaning only the part of Unikraft you're working on and not all the libraries that it may depend on.
   This will speed up the build and thus the development process.
5. Use the Linux user space platform target (`linuxu`) for quicker and easier development and debugging.

### Debug Information

An old saying goes: "Two of the most useful tools for debuging are `printf` and your brain".
It's very useful to just print information as part of your program to understand the runtime execution flow.

However, extensive printing may be too much and doesn't make sens when you're not debugging.
Which is why, usually debug printing is configured by a logging level, i.e. how many messages are printed.

The debugging / logging facility in Unikraft is the [`ukdebug` library](https://github.com/unikraft/unikraft/tree/staging/lib/ukdebug).
[Function provided by the `ukdebug` interface](https://github.com/unikraft/unikraft/blob/staging/lib/ukdebug/include/uk/print.h) (such as `uk_printk`, `uk_pr_debug`, `uk_pr_info`) print information conditionally is the logging level is past a pre-configured level.

When debugging Unikraft, it's generally a good idea to enable logging messages.
This is done by adding support for `ukdebug` at configuration stage.

### Using GDB

The build system always creates two image files for each selected platform:

* one that includes debugging information and symbols (`.dbg` file extension)
* one that does not

Before using GDB, go to the configuration menu under `Build Options` and select a `Debug information level` that is bigger than 0.
We recommend 3, the highest level.

{{< img
  class="max-w-xl mx-auto"
  src="./images/debug_information_level.png"
  title="Figure 1"
  caption="Setting an optimization level"
  position="center"
>}}

Once set, save the configuration and build your images.

#### Linuxu
---

For the Linux user space target (`linuxu`) simply point GDB to the resulting debug image, for example:

```
$ gdb build/app-helloworld_linuxu-x86_64.dbg
```

#### KVM
---

For KVM, you can start the guest with the kernel image that includes debugging information, or the one that does not.
We recommend creating the guest in a paused state (the `-S` option):

```
$ qemu-system-x86_64 -s -S -cpu host -enable-kvm -m 128 -nodefaults -no-acpi -display none -serial stdio -device isa-debug-exit -kernel build/app-helloworld_kvm-x86_64.dbg -append verbose
```

Note that the `-s` parameter is shorthand for `-gdb tcp::1234`.
To avoid this long `qemu-system-x86` command with a lot of arguments, we can use `qemu-guest`.

```
$ qemu-guest -P -g 1234 -k build/app-helloworld_kvm-x86_64.dbg
```

Now connect GDB by using the debug image with:

```
$ gdb --eval-command="target remote :1234" build/app-helloworld_kvm-x86_64.dbg
```

Unless you're debugging early boot code (until `_libkvmplat_start32`), you’ll need to set a hardware break point:
Hardware breakpoints have the same effect as the common software breakpoints you are used to, but they are different in the implementation.
As the name suggests, hardware breakpoints are based on direct hardware support.
This may limit the number of breakpoints you can set, but makes them especially useful when debugging kernel code.

```
hbreak [location]
continue
```

We’ll now need to set the right CPU architecture:

```
disconnect
set arch i386:x86-64:intel
```

And reconnect:
```
tar remote localhost:1234
```

You can now run `continue` and debug as you would normally.

## Practical Work

### Support Files

Session support files are available [in the repository](https://github.com/unikraft/docs/tree/main/content/en/community/hackathons/2022-05-lyon).
The repository is already cloned in the virtual machine.

If you want to clone the repository yourself, do

```
$ git clone https://github.com/unikraft/docs

$ cd docs/content/en/community/hackathons/2022-05-lyon/debugging/

$ ls
demo/  images/  index.md  sol/  work/
```

### 01. Debugging information

Setup, configure, build and run the [`app-helloworld` application](https://github.com/unikraft/app-helloworld).
Build it both for Linuxu and for KVM.

Then configure `ukdebug` for `app-helloworld`.
Enable all messages (all debug levels) then build and run the application, both for Linuxu and KVM.

Add a `uk_pr_*` call (such as `uk_pr_info` or `uk_pr_warn`) in the `main.c` file to print a message.
Configure the application such that it would print and then it would not print the message.

### 02. Tutorial. Use GDB in Unikraft

For this tutorial, we will just start the `app-helloworld` application and inspect it with the help of GDB.

First make sure you have the following file structure in your working directory:

```
workdir
|-- apps
|   `-- helloworld
|-- libs
`-- unikraft
```

#### Linuxu

For the image for the **linuxu** platform we can use GDB directly with the binary already created.

```
$ gdb build/app-helloworld_linuxu-x86_64.dbg
```

#### KVM

To avoid using a command with a lot of parameters that you noticed above in the **KVM** section, we can use `qemu-guest`.

```
$ qemu-guest -P -g 1234 -k build/app-helloworld_kvm-x86_64.dbg
```

Open another terminal to connect to GDB by using the debug image with:

```
$ gdb --eval-command="target remote :1234" build/app-helloworld_kvm-x86_64.dbg
```

First you can set the right CPU architecture and then reconnect:

```
disconnect
set arch i386:x86-64:intel
tar remote localhost:1234
```

Then you can put a hardware break point at main function and run `continue`:
```
hbreak main
continue
```

All steps described above can be done using the script `kvm_gdb_debug` located in the `work/02-tutorial-gdb/` folder.
All you need to do is to provide the path to kernel image.

```
kvm_gdb_debug build/app-helloworld_kvm-x86_64.dbg
```

### 03. Mystery: Find the secret using GDB

Before starting the task let's get familiar with some GDB commands.

`ni` - go to the next instruction, but skip function calls

`si` - go to the next instruction, but enters function calls

`c` - continue execution to the next breakpoint

`p expr` - display the value of an expression

`x addr` - get the value at the indicated address (similar to `p *addr`)

`whatis arg` - print the data type of `arg`

GDB provides convenience variables that you can use within GDB to hold on to a value and refer to it later.
For example:

```
set $foo = *object_ptr
```

Note that you can also cast variables in GDB similar to C:

```
set $var = (int *) ptr
```

If you want to dereference a pointer and actually see the value, you can use the following command:

```
p *addr
```

You can find more GDB commands [here](https://users.ece.utexas.edu/~adnan/gdb-refcard.pdf)
Also, if you are unfamiliar with X86_64 calling convention you can read more about it [here](https://en.wikipedia.org/wiki/X86_calling_conventions).


Now, let's get back to the task.
Download the `mystery_kvm-x86_64` file from [here](https://drive.google.com/drive/folders/1K74TYViRxGtyRwDepJ3W_JNOZWdO2LXT?usp=sharing).
Copy the `mystery_kvm-x86_64` file to the `work/03-mystery/` directory.
Navigate to `work/03-mystery/` directory.
Use the 2 scripts in the directory (`debug.sh` and `connect.sh`) to start the `mystery_kvm-x86_64.dbg` executable using GDB.
Do you think you can find out the **secret**?

**HINT** Use the `nm` utility on the binary as a starting point.

### 04. Bug or feature?

There are two kernel images located in the `work/04-app-bug/` folder.
One of them is build for **Linuxu**, the other for **KVM**.

First try to inspect what it's wrong with **Linuxu** image.
You will notice that if you run the program you will get a segmentation fault.
Why does this happen?

After you figure out what it's happening with **Linuxu** image have a look also at the **KVM** one.
It was built from the code source, but when you will try to run it, you will not get a segmentation fault.
Is this a bug or a feature?

## Further Reading

* [Hardware Breakpoint](https://sourceware.org/gdb/wiki/Internals/Breakpoint%20Handling)
* [GDB Cheatsheet](https://users.ece.utexas.edu/~adnan/gdb-refcard.pdf)
* [X86_64 calling convention](https://en.wikipedia.org/wiki/X86_calling_conventions)
