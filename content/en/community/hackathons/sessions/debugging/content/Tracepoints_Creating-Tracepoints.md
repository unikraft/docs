Instrumenting your code with tracepoints is done by two steps.
First, you define and register a tracepoint handler with the `UK_TRACEPOINT()` macro.
Second, you place calls to the generated handler at those places in your code where your want to trace an event:

```c
#include <uk/trace.h>

UK_TRACEPOINT(trace_vfs_open, "\"%s\" 0x%x 0%0o", const char*, int, mode_t);

int open(const char *pathname, int flags, ...)
{
      trace_vfs_open(pathname, flags, mode);

      /* lots of cool stuff */

      return 0;
}
```

`UK_TRACEPOINT(trace_name, fmt, type1, type2, ... typeN)` generates the handler `trace_name()` (static function).
It will accept up to 7 parameters of type `type1`, `type2`, etc.
The given format string `fmt` is a printf-style format which will be used to create meaningful messages based on the collected trace parameters.
This format string is only kept in the debug image and is used by the tools to read and parse the trace data.
Unikraft's trace buffer stores for each sample a timestamp, the name of the tracepoint, and the given parameters.
