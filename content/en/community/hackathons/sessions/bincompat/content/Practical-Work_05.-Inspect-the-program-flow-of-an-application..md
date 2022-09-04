Take the above C program and compile it directly into Unikraft.
Inspect the flow of the program, see how we get from the application code to the library code and then to the unikernel code.
After you see all the functions that get called, modify the program to skip the library code but still keep the same functionality.

**Hint 1**: You should call a function that is generated with the syscall shim macros.
