---
title: KConfig-based System
date: 2020-01-11T14:09:21+09:00
draft: false
weight: 322
---

### Config.uk

The `Config.uk` file stores all the config variables, which will be visible in `make menuconfig`.
These variables can be accessed from `Makefile.uk` or even from C sources, by including `"uk/config.h"`, using the prefix `CONFIG_`.

For example, in the [configuration file](https://github.com/unikraft/lib-libhogweed/blob/staging/Config.uk) of `lib-libhogweed`, `libhogweed/Config.uk`, we have:

1. The main variable of the library which acts as an identifier for it:

   ```text
   config LIBHOGWEED
   	bool "libhogweed - Public-key algorithms"
   	default n
   ```

1. We can also set another library's main variable, in this case `newlib`, which involves including it in the build process:

   ```text
   select LIBNEWLIBC
   ```

1. Creating an auxiliary menu, containing all the test cases:

   ```text
   menuconfig TESTSUITE
   		bool "testsuite - tests for libhogweed"
   		default n
   		if TESTSUITE
   			config TEST_X
   				bool "test x functionality"
   				default y
   		endif
   ```

   Each test case has its own variable in order to allow testing just some tests from the whole suite.

