---
title: Make-based System
date: 2020-01-11T14:09:21+09:00
draft: false
weight: 321
---

### Makefile.uk

The [`Makefile.uk` file](https://github.com/unikraft/lib-libhogweed/blob/staging/Makefile.uk) is used to:

1. Register the library to Unikraft's build system:

   ```make
   $(eval $(call addlib_s,libhogweed,$(CONFIG_LIBHOGWEED)))
   ```

   As you can see, we are registering the library to Unikraft's build system only if the main library's config variable, `LIBHOGWEED`, is set.

1. Set the URL from where the library will be automatically downloaded at build time:

   ```make
   LIBHOGWEED_VERSION=3.6
   LIBHOGWEED_URL=https://ftp.gnu.org/gnu/nettle/nettle-$(LIBHOGWEED_VERSION).tar.gz
   ```

1. Declare helper variables for the most used paths:

   ```make
   LIBHOGWEED_EXTRACTED = $(LIBHOGWEED_ORIGIN)/nettle-$(LIBHOGWEED_VERSION)
   ```

   There are some useful default variables, for example:

   * `$LIBNAME_ORIGIN`: represents the path where the original library is downloaded and extracted during the build process;
   * `$LIBNAME_BASE`: represents the path of the ported library sources(the path appended to the `$LIBS` variable).

1. Set the locations where the headers are searched:

   ```make
   // including the path of the glue header added by us
   LIBHOGWEED_COMMON_INCLUDES-y += -I$(LIBHOGWEED_BASE)/include
   ```

   You should include the directories with the default library's headers as well as the directories with the glue headers created by you, if it's the case.

1. Add compile flags, used in general for suppressing some compile warnings and making the build process neater:

   ```make
   LIBHOGWEED_SUPPRESS_FLAGS += -Wno-unused-parameter \
           -Wno-unused-variable -Wno-unused-value -Wno-unused-function \
           -Wno-missing-field-initializers -Wno-implicit-fallthrough \
           -Wno-sign-compare

   LIBHOGWEED_CFLAGS-y   += $(LIBHOGWEED_SUPPRESS_FLAGS) \
           -Wno-pointer-to-int-cast -Wno-int-to-pointer-cast
   LIBHOGWEED_CXXFLAGS-y += $(LIBHOGWEED_SUPPRESS_FLAGS)
   ```

1. Register the library's sources:

   ```make
   LIBHOGWEED_SRCS-y += $(LIBHOGWEED_EXTRACTED)/bignum.c
   ```

1. Register the library's tests:

   ```make
   ifeq ($(CONFIG_RSA_COMPUTE_ROOT_TEST),y)
   LIBHOGWEED_SRCS-y += $(LIBHOGWEED_EXTRACTED)/testsuite/rsa-compute-root-test.c
   LIBHOGWEED_RSA-COMPUTE-ROOT-TEST_FLAGS-y += -Dtest_main=rsa_compute_root_test
   endif
   ```

   There are situations when the test cases have each a `main()` function.
   In order to wrap all the tests into one single main function, we have to modify their main function name by using preprocessing symbols.

   **Note**: A good practice is to include a test only if the config variable corresponding to that test is set.

1. This step is very customizable, being like a script executed before starting to compile the unikernel.

   In most cases, and in this case too, the libraries build their own config file through a provided executable, usually named `configure`:

   ```make
   $(LIBHOGWEED_EXTRACTED)/config.h: $(LIBHOGWEED_BUILD)/.origin
   	$(call verbose_cmd,CONFIG,libhogweed: $(notdir $@), \
           cd $(LIBHOGWEED_EXTRACTED) && ./configure --enable-mini-gmp \
       )
   LIBHOGWEED_PREPARED_DEPS = $(LIBHOGWEED_EXTRACTED)/config.h

   $(LIBHOGWEED_BUILD)/.prepared: $(LIBHOGWEED_PREPARED_DEPS)

   UK_PREPARE += $(LIBHOGWEED_BUILD)/.prepared
   ```

   We can also do things like generating headers using the original building system, modify sources, etc.

