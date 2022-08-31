Before starting the task, let's get familiar with some GDB commands.

`ni` - go to the next instruction, but skip function calls

`si` - go to the next instruction, but enters function calls

`c` - continue execution to the next breakpoint

`p expr` - display the value of an expression

`x addr` - get the value at the indicated address (similar to `p *addr`)

`whatis arg` - print the data type of `arg`

GDB provides convenience variables that you can use within GDB to hold on to a value and refer to it later.
For example:


```bash
set $foo = *object_ptr
```

Note that you can also cast variables in GDB similar to C:

```bash
set $var = (int *) ptr
```

If you want to dereference a pointer and actually see the value, you can use the following command:

```bash
p *addr
```

You can find more GDB commands [here](https://users.ece.utexas.edu/~adnan/gdb-refcard.pdf)
Also, if you are unfamiliar with X86_64 calling convention you can read more about it [here](https://en.wikipedia.org/wiki/X86_calling_conventions).

Now, let's get back to the task.
Navigate to `work/02-mystery/` directory.
Use `./debug.sh` to start the application in paused state and `./connect.sh` to connect to it via GDB.
Do you think you can find out the **secret**?

#### Support Instructions

Follow these steps:

1. Start the `./debug.sh` script in a terminal and the `./connect.sh` script in another terminal.

1. In the second terminal (running `./connect.sh`) run

   ```
   hbreak main
   ```

   to break at the `main()` function.
   The use

   ```
   c
   ```

   (for `continue`) to get the to `main()` function.


1. Use

   ```
   set disassembly-flavor intel
   disass
   ```

   to disassemble the `main()` function.

1. Look through the assembly code and see what it does.
   Follow the `test eax, eax` instructions and see what needs to happen to pass those tests and get to the last point where the secret is printed, i.e. be able to advance to address `0x000000000018a4ae`.

1. Investigate memory addresses (using the `x` instruction - such as `x/s $rbp-0x120`), do instruction stepping (`stepi` or `nexti`), use breakpoints (`break *<address>`) and find out the secret.
