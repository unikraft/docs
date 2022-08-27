In this session we are going to understand how we can run applications using the binary compatibility layer as well as the inner workings of the system call shim layer.

One of the obstacles when trying to use Unikraft could be the porting effort of your application.
One way we can avoid this is through binary compatibility.
Binary compatibility is the possibility to take already compiled binaries and run them on top of Unikraft without porting effort and at the same time keeping the benefits of unikernels.
In our case, we support binaries compiled for the Linux kernel.

In order to achieve binary compatibility with the Linux kernel, we had to find a way to have support for system calls, for this, the **system call shim layer** (also called **syscall shim**) was created.
The system call shim layer provides Linux-style mappings of system call numbers to actual system call handler functions.
