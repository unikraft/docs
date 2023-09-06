Because Unikraft needs a tracing and performance measurement system, one method to do this is using Unikraft's tracepoint system.
A tracepoint provides a hook to call a function that you can provide at runtime.
You can put tracepoints at important locations in the code.
They are lightweight hooks that can pass an arbitrary number of parameters, which prototypes are described in a tracepoint declaration placed in a header file.
