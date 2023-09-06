kdtree for Unikraft
===================

This is the port of kdtree 0.5.7 for Unikraft as external library.

kdtree depends on libc(e.g. `newlib`), so please ensure you add the
following line to the `LIBS` variable in the `Makefile`:

...$(UK_LIBS)/newlib:$(UK_LIBS)/kdtree...


Running kdtree test suite
-------------------------

For running the test cases: enable the `Build test suite` option
in the configuration menu, include `test_suite_glue.h` and call
the `libkdtree_test_main()` function in your main application.


Further information
-------------------

Please refer to the `README.md` as well as the documentation in the `doc/`
subdirectory of the main unikraft repository.
