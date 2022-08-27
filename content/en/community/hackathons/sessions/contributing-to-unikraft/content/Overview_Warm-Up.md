Let's check the integrity of this library using its test suite through the exposed wrapper function.

For this task, you have to move the library in the `$UK_LIBS` folder and the `work/01-tut-porting/apps/app-libhogweed` application in the `$UK_APPS` folder.
You can also keep the current directory structure and clone the [Unikraft core repository](https://github.com/unikraft/unikraft) in the `work/0x-task-name` directory, basically changing the `UK_WORKDIR` to `work/0x-task-name`, as described [above](https://unikraft.org/community/hackathons/usoc22/contributing-to-unikraft/#reminders).
Fill the `TODO` lines from the application code: add the `libhogweed` library as a dependency in its `Makefile` and call the function exposed by the library for running the test suite from `main.c`.
Remember to include the library header file.

Disable some tests, rebuild, and run the checker application again.

**Note**: The [`libhogweed`](https://github.com/unikraft/lib-libhogweed) library depends on [`newlib`](https://github.com/unikraft/lib-newlib).

**Note**: Remember to select the test suite from `menuconfig`.
You can also check the library's [`README.md`](https://github.com/unikraft/lib-libhogweed#readme) for additional information.

**Hint**: The order of the `libhogweed` and `newlib` libraries in the `Makefile` matters.
