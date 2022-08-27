Let's check the integrity of this library using its test suite through the exposed wrapper function.

For this task, you have to move, [or clone](https://github.com/unikraft/lib-libhogweed), the library in the `$UK_LIBS` folder and the `work/01-tut-porting/apps/app-libhogweed` application in the `$UK_APPS` folder.
Fill the `TODO` lines from the application code: add the `libhogweed` library as a dependency in its `Makefile` and call from `main.c` the function exposed by the library for running the test suite.

Disable some tests, rebuild, and run again the checker application.

**Note**: The [`libhogweed`](https://github.com/unikraft/lib-libhogweed) library depends on [`newlib`](https://github.com/unikraft/lib-newlib).

**Note**: Remember to select the test suite from `menuconfig`.
You can also check the library's `README.md` for additional information.
