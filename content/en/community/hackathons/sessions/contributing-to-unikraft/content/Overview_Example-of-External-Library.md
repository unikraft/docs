Let's focus for now on an already ported library: [lib-libhogweed](https://github.com/unikraft/lib-libhogweed).
Let's examine its core components.
Go to the `work/01-tut-porting/libs/libhogweed/` directory and follow the bookmarks marked with `USOC_X`, where `X` is the index of the item in the list, from the files specified in the sections below.

#### Glue Code

In some cases, not all the dependencies of an external library are already present in the Unikraft project, so the solution is to add them manually, as glue code, to the library's sources.

Another situation when we need glue code is when the ported library comes with test modules, used for testing the library's functionalities.
The goal, in this case, is to wrap all the test modules into one single function.
In this way, we can check the library integrity if we want so by just a single function call.
Moreover, we can create a test framework which can periodically check all of the ported libraries, useful especially for detecting if a new library will interfere with an already ported one.

Moving back to `libhogweed`, a practical example of the second case is the `run_all_libhogweed_tests(int v)` function from `libhogweed/testutils_glue.c`, line `#674`, which calls every selected (we will see later how we can make selectable config variables) test module and exits with `EXIT_SUCCESS` only if it passes over all the tests.
For exposing this API, we should also make a header file with all of the test modules, as well as our wrapper function.

**Note**: Check `libhogweed/include/testutils_glue.h`.

#### Config.uk

The `Config.uk` file stores all the config variables, which will be visible in `make menuconfig`.
These variables can be accessed from `Makefile.uk` or even from C sources, by including `"uk/config.h"`, using the prefix `CONFIG_`.

Moving to the source code, `libhogweed/Config.uk`, we have:

1. The main variable of the library which acts as an identifier for it:

   ```
   config LIBHOGWEED
   	bool "libhogweed - Public-key algorithms"
   	default n
   ```

1. We can also set another library's main variable, in this case `newlib`, which involves including it in the build process:

   ```
   select LIBNEWLIBC
   ```

1. Creating an auxiliary menu, containing all the test cases:

   ```
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

#### Makefile.uk

The `libhogweed/Makefile.uk` file is used to:

1. Register the library to Unikraft's build system:

   ```
   $(eval $(call addlib_s,libhogweed,$(CONFIG_LIBHOGWEED)))
   ```

   As you can see, we are registering the library to Unikraft's build system only if the main library's config variable, `LIBHOGWEED`, is set.

1. Set the URL from where the library will be automatically downloaded at build time:

   ```
   LIBHOGWEED_VERSION=3.6
   LIBHOGWEED_URL=https://ftp.gnu.org/gnu/nettle/nettle-$(LIBHOGWEED_VERSION).tar.gz
   ```

1. Declare helper variables for the most used paths:

   ```
   LIBHOGWEED_EXTRACTED = $(LIBHOGWEED_ORIGIN)/nettle-$(LIBHOGWEED_VERSION)
   ```

   There are some useful default variables, for example:

   * `$LIBNAME_ORIGIN`: represents the path where the original library is downloaded and extracted during the build process;
   * `$LIBNAME_BASE`: represents the path of the ported library sources(the path appended to the `$LIBS` variable).

   You can check all reserved variables in [the main documentation](http://docs.unikraft.org/developers-app.html#makefile-uk).

1. Set the locations where the headers are searched:

   ```
   // including the path of the glue header added by us
   LIBHOGWEED_COMMON_INCLUDES-y += -I$(LIBHOGWEED_BASE)/include
   ```

   You should include the directories with the default library's headers as well as the directories with the glue headers created by you, if it's the case.

1. Add compile flags, used in general for suppressing some compile warnings and making the build process neater:

   ```
   LIBHOGWEED_SUPPRESS_FLAGS += -Wno-unused-parameter \
           -Wno-unused-variable -Wno-unused-value -Wno-unused-function \
           -Wno-missing-field-initializers -Wno-implicit-fallthrough \
           -Wno-sign-compare

   LIBHOGWEED_CFLAGS-y   += $(LIBHOGWEED_SUPPRESS_FLAGS) \
           -Wno-pointer-to-int-cast -Wno-int-to-pointer-cast
   LIBHOGWEED_CXXFLAGS-y += $(LIBHOGWEED_SUPPRESS_FLAGS)
   ```

1. Register the library's sources:

   ```
   LIBHOGWEED_SRCS-y += $(LIBHOGWEED_EXTRACTED)/bignum.c
   ```

1. Register the library's tests:

   ```
   ifeq ($(CONFIG_RSA_COMPUTE_ROOT_TEST),y)
   LIBHOGWEED_SRCS-y += $(LIBHOGWEED_EXTRACTED)/testsuite/rsa-compute-root-test.c
   LIBHOGWEED_RSA-COMPUTE-ROOT-TEST_FLAGS-y += -Dtest_main=rsa_compute_root_test
   endif
   ```

   There are situations when the test cases have each a `main()` function.
   In order to wrap all the tests into one single main function, we have to modify their main function name by using preprocessing symbols.

   You can read more about compile flags in [the main documentation](http://docs.unikraft.org/developers-app.html#makefile-uk).

   **Note**: A good practice is to include a test only if the config variable corresponding to that test is set.

1. This step is very customizable, being like a script executed before starting to compile the unikernel.

   In most cases, and in this case too, the libraries build their own config file through a provided executable, usually named `configure`:

   ```
   $(LIBHOGWEED_EXTRACTED)/config.h: $(LIBHOGWEED_BUILD)/.origin
   	$(call verbose_cmd,CONFIG,libhogweed: $(notdir $@), \
           cd $(LIBHOGWEED_EXTRACTED) && ./configure --enable-mini-gmp \
       )
   LIBHOGWEED_PREPARED_DEPS = $(LIBHOGWEED_EXTRACTED)/config.h

   $(LIBHOGWEED_BUILD)/.prepared: $(LIBHOGWEED_PREPARED_DEPS)

   UK_PREPARE += $(LIBHOGWEED_BUILD)/.prepared
   ```

   We can also do things like generating headers using the original building system, modify sources, etc.
