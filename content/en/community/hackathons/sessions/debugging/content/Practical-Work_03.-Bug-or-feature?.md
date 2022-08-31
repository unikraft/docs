There are two kernel images located in the `work/03-app-bug/` folder.
One of them is build for **Linuxu**, the other for **KVM**.

First, try to inspect what is wrong with the **Linuxu** image.
You will notice that if you run the program you will get a segmentation fault.
Why does this happen?

After you figure out what is happening with the **Linuxu** image, have a look at the **KVM** one.
It was built from the code source, but when you will try to run it, you will not get a segmentation fault.
Is this a bug or a feature?

#### Support Instructions

Follow these steps:

1. Check the disassembly code of `main()` both in the **Linuxu** and the **KVM** image.
   Use GDB and then use the commands:

   ```
   hbreak main
   ```

   to break at the `main()` function.
   The use

   ```
   c
   ```

   (for `continue`) to get the to `main()` function.

   ```
   set disassembly-flavor intel
   disass
   ```

   For **KVM** adapt the `connect.sh` and `debug.sh` scripts from the previous task.

1. Use `nexti` and `stepi` instructions to step through the code.
   Get a general idea of what the program does.

1. Check the values of the `rax`, `rdx` and `rbp` registers.
   Use

   ```
   info registers
   ```

   for that.

1. Inspect the value of registers right after the segmentation fault message.

1. Deduce what the issue is.
