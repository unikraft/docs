At this stage, you should be familiar with the steps of configuring, building and running any application within Unikraft and know the main parts of the architecture.
Below you can see a list of the commands you have used so far.

| Command                                                | Description                                                             |
|--------------------------------------------------------|-------------------------------------------------------------------------|
| `make clean`                                           | Clean the application                                                   |
| `make properclean`                                     | Clean the application, fully remove the `build/` folder                 |
| `make distclean`                                       | Clean the application, also remove `.config`                            |
| `make menuconfig`                                      | Configure application through the main menu                             |
| `make`                                                 | Build configured application (in `.config`)                             |
| `qemu-guest -k <kernel_image>`                         | Start the unikernel                                                     |
| `qemu-guest -k <kernel_image> -e <directory>`          | Start the unikernel with a filesystem mapping of `fs0` id from `<directory>` |
| `qemu-guest -k <kernel_image> -g <port> -P`            | Start the unikernel in debug mode, with GDB server on port `<port>`     |

Today we'll make use of `gdb`. We recommend the [following cheat sheet](https://darkdust.net/files/GDB%20Cheat%20Sheet.pdf) for
the most common commands. A quick crash course on GDB may be found [here](https://www.cs.umd.edu/~srhuang/teaching/cmsc212/gdb-tutorial-handout.pdf).

Let's take a look over some of GDB's commands. First, we need to start running the
binary, for this we have the `run` command.

```console
(gdb) run
Program received signal SIGSEGV, Segmentation fault.
0x00000000006005ad in print_arr (arr=0x0, pos=4) at my_program.c:16
16 int elem = arr[pos];
```

We can quickly see that the segmentation fault was caused by line 16 in our program
Let us inspect the backtrace using `backtrace`.

```console
(gdb) backtrace
#0 0x00000000004005ad in print_arr (arr=0x0, pos=4) at my_program.c:16
#1 0x000000000040064b in main (argc=2, argv=0x7fffffffe2f8) at my_program.c:30
```

To inspect the frames we can run:

```console
(gdb) frame 0
#0 print_arr (arr=0x0, pos=4) at program.c:16
16 int elem = arr[pos];
```

In many cases we would like to run the code up to the point where the crash happens.
To do this, we will use breakpoints.

```console
(gdb) break print_arr
(gdb) break print_arr if arr == 0
(gdb) break program.c:16
```