We will start from the `app-helloworld` application and we will put two tracepoints.
One at the beginning of the program (after the main) and one at the end of it.
These tracepoints should print the value of `argc`.

First, we need to define `UK_DEBUG_TRACE` and to include `uk/trace.h`.

```c
#ifndef UK_DEBUG_TRACE
#define UK_DEBUG_TRACE
#endif

#include <uk/trace.h>
```

After that, we have to define those tracepoints that we want to use.
In our case it should be something similar with:

```c
UK_TRACEPOINT(start_trace, "%d", int);
UK_TRACEPOINT(stop_trace, "%d", int);
```

Now we can invoke them inside the main.

```c
int main(int argc, char *argv[])
{
    start_trace(argc);
    start_status();

    printf("Hello world!\n");

    stop_trace(argc);
    stop_status();

    return 0;
}
```

We also added two simple functions for a better view of tracepoints in GDB.

```c
void start_status(){
    printf("Start tracing\n");
}

void stop_status(){
    printf("Stop tracing\n");
}
```

You can check the source code for this tutorial in `work/04-tutorial-tracepoints.`
Now we can build the application, but we need to make sure that we have checked the `CONFIG_LIBUKDEBUG_TRACEPOINTS` option in the configuration (`Library Configuration -> ukdebug -> Enable tracepoints`).

Now we will have to start the application in paused state.

```bash
qemu-guest -P -g 1234 -k build/app-helloworld-tracepoints_kvm-x86_64.dbg
```

In another terminal, we will start the GDB:

```bash
gdb --eval-command="target remote :1234" build/app-helloworld-tracepoints_kvm-x86_64.dbg
```

Put a hardware breakpoint  to main and continue until there.

```bash
(gdb) hbreak main
(gdb) continue
```

Now we can put a break to first function, `start_status()`, to check if the first tracepoint is successful.
To show all the tracepoints, we can use `uk trace`.

* Do **NOT** forget to run `source /path/to/your/build/uk-gdb.py` in GDB.
Otherwise, you won't be able to use `uk trace`.


```bash
(gdb) break start_status
(gdb) continue
(gdb) uk trace
0000116012362374 start_trace: 2
```

We notice that we got an output and that the tracepoint was reached.
We continue until the second trace point and we will save all the tracepoints obtained with the command `uk trace save traces.dat`

```bash
(gdb) break stop_status
(gdb) continue
(gdb) uk trace save traces.dat
Saving traces to traces.dat ...
```

Now we can read all the tracepoints obtained using `trace.py` from the main repo located in `unikraft/support/scripts/uk_trace/trace.py`.
The output will be similar to this:

```
       time  tp_name        msg
-----------  -----------  -----
 5321091993  start_trace      2
11121071844  stop_trace       2
```
