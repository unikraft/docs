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
