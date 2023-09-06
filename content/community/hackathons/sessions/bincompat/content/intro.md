In this session we look into running applications using the binary compatibility layer as well as understanding the inner workings of the system call shim layer.

One of the obstacles when trying to use Unikraft is the porting effort of new applications.
This process can be made painless through the use of Unikraft's **binary compatibility layer**.
Binary compatibility is the possibility to take pre-built Linux ELF binaries and run them on top of Unikraft.
This is done without any porting effort while maintaining the benefits of Unikraft: reduced memory footprint, high degree of configurability of library components.

For this, Unikraft must provide a similar ABI (*Application Binary Interface*) with the Linux kernel.
This means that Unikraft has to provide a similar system call interface that Linux kernel provides, a [POSIX](https://pubs.opengroup.org/onlinepubs/9699919799.2018edition/) compatible interface.
For this, the [**system call shim layer**](https://github.com/unikraft/unikraft/tree/staging/lib/syscall_shim) (also called **syscall shim**) was created.
The system call shim layer provides Linux-style mappings of system call numbers to actual system call handler functions.
