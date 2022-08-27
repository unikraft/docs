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
