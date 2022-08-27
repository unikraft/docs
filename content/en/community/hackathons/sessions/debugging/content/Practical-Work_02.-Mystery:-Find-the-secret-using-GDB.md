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
Copy the `mystery_kvm-x86_64` file to the `work/02-mystery/` directory.
Navigate to `work/02-mystery/` directory.
Use the 2 scripts in the directory (`debug.sh` and `connect.sh`) to start the `mystery_kvm-x86_64.dbg` executable using GDB.
Do you think you can find out the **secret**?

**HINT** Use the `nm` utility on the binary as a starting point.
