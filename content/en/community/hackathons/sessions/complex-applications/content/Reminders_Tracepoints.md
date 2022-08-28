Tracepoints are provided by `lib/ukdebug`.
To enable Unikraft to collect trace data, enable the option `CONFIG_LIBUKDEBUG_TRACEPOINTS` in your configuration (via `make menuconfig` under `Library Configuration -> ukdebug -> Enable tracepoints`).

#### Instrumenting

Instrumenting your code with tracepoints is done in two steps:

* Define and register a tracepoint handler with the `UK_TRACEPOINT()` macro.
* Place calls to the generated handler at the places in your code where your want to trace an event.

#### Reading traces

Unikraft is storing trace data to an internal buffer that resides in the guest's main memory.
To access that data you need to configure the GDB and add `source /path/to/your/build/uk-gdb.py` to `~/.gdbinit`

Commands available in GDB:

| Commands               | Deion                    |
|------------------------|--------------------------|
| uk trace               | show tracepoints in GDB  |
| uk trace save `<file>` | save tracepoints to file |

Any saved trace file can be later processed with the  `trace.py`  .

```bash
$ support/s/uk_trace/trace.py list <file>
```

