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
