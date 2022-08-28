Unikraft is storing trace data to an internal buffer that resides in the guest's main memory.
You can use GDB to read and export it.
For this purpose, you will need to load the `uk-gdb.py` helper script into your GDB session.
It adds additional commands that allow you to list and store the trace data.
We recommend to automatically load the script to GDB.
For this purpose, run the following command in GDB:

```bash
source /path/to/your/build/uk-gdb.py
```

In order to collect the data, open GDB with the debug image and connect to your Unikraft instance as described in Section [Using GDB](community/hackathons/sessions/debugging/#using-gdb):

```bash
$ gdb build/app-helloworld_linuxu-x86_64.dbg
```

The `.dbg` image is required because it contains offline data needed for parsing the trace buffer.

As soon as you let your guest run, samples should be stored in Unikraft's trace buffer.
You can print them by issuing the GDB command `uk trace`:

```bash
(gdb) uk trace
```

Alternatively, you can save all trace data to disk with `uk trace save <filename>`:

```bash
(gdb) uk trace save traces.dat
```

It may make sense to connect with GDB after the guest execution has been finished (and the trace buffer got filled).
For this purpose, make sure that your hypervisor is not destroying the instance after guest shut down (on QEMU add `--no-shutdown` and `--no-reboot` parameters).

If you are seeing the error message `Error getting the trace buffer. Is tracing enabled?`, you probably did not enable tracing or Unikraft's trace buffer is empty.
This can happen when no tracepoint was ever called.

Any saved trace file can be later processed with the `trace.py` script, available in the support scripts from the unikraft core repository.
In our example:

```bash
$ /path/to/unikraft/core/repo/support/scripts/uk_trace/trace.py list traces.dat
```
