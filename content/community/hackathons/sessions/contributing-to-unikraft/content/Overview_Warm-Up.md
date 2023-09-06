Let's check the integrity of this library using its test suite through the exposed wrapper function.

You can keep the current directory structure and clone the [Unikraft core repository](https://github.com/unikraft/unikraft) in the `work/01-tut-porting/app-libhogweed/.unikraft/` directory.
Fill the `TODO` lines from the application code: add the `libhogweed` library as a dependency in its `Makefile` and call the function exposed by the library for running the test suite from `main.c`.
Remember to include the library header file.

Use `qemu-system-x86_64` to run the application, only the `-kernel` and `-nographic` options are needed.
Disable some tests, rebuild, and run the checker application again.

**Note**: The [`libhogweed`](https://github.com/unikraft/lib-libhogweed) library depends on [`musl`](https://github.com/unikraft/lib-musl).

**Note**: The build might fail if you try to use multiple jobs by using the `-j` option.
Before the build step (`make -j $(nproc)`), it's best to run:

```console
make prepare
```

**Note**: Remember to select the test suite from `menuconfig`.
You can also check the library's [`README.md`](https://github.com/unikraft/lib-libhogweed#readme) for additional information.

**Hint**: The order of the `libhogweed` and `musl` libraries in the `Makefile` matters.

**Hint:** Check the `testutils_glue.c` file from `libhogweed` to find the test wrapper function.
