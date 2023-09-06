Tracepoints are provided by `lib/ukdebug`.
To enable Unikraft to collect trace data, enable the option `CONFIG_LIBUKDEBUG_TRACEPOINTS` in your configuration (via `make menuconfig` under `Library Configuration -> ukdebug -> Enable tracepoints`).

![enable tracepoints](/community/hackathons/sessions/debugging/images/enable_tracepoints.png)


The configuration option `CONFIG_LIBUKDEBUG_ALL_TRACEPOINTS` activates **all** existing tracepoints.
Because tracepoints may noticeably affect performance, you can alternatively enable tracepoints only for compilation units that you are interested in.

This can be done with the `Makefile.uk` of each library.

```make
# Enable tracepoints for a whole library
LIBNAME_CFLAGS-y += -DUK_DEBUG_TRACE
LIBNAME_CXXFLAGS-y += -DUK_DEBUG_TRACE

# Alternatively, enable tracepoints of source files you are interested in
LIBNAME_FILENAME1_FLAGS-y += -DUK_DEBUG_TRACE
LIBNAME_FILENAME2_FLAGS-y += -DUK_DEBUG_TRACE
```

This can also be done by defining `UK_DEBUG_TRACE` in the head of your source files.
Please make sure that `UK_DEBUG_TRACE` is defined before `<uk/trace.h>` is included:

```c
#ifndef UK_DEBUG_TRACE
#define UK_DEBUG_TRACE
#endif

#include <uk/trace.h>
```

As soon as tracing is enabled, Unikraft will store samples of each enabled tracepoint into an internal trace buffer.
Currently this is not a circular buffer.
This means that as soon as it is full, Unikraft will stop collecting further samples.
