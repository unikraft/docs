We aim to benchmark the Redis app running on top of Unikraft and Redis running on top of Linux.
Find the support files in the `work/05-benchmark-redis/` folder of the session directory.
There are three binaries: `redis-cli`, `redis-benchmark`, and `redis-server`.

First, we will start by benchmarking `app-redis` on Unikraft.
Start Redis on top of Unikraft as we did before and in another terminal run the following command:

```bash
$ ./redis-benchmark --csv -q -r 100 -n 10000 -c 1 -h 172.88.0.2 -p 6379 -P 8 -t set,get
```

The description of the used options can be seen here:

```bash
Usage: redis-benchmark [-h <host>] [-p <port>] [-c <clients>] [-n <requests>] [-k <boolean>]

 -h <hostname>      Server hostname (default 127.0.0.1)
 -p <port>          Server port (default 6379)
 -c <clients>       Number of parallel connections (default 50)
 -n <requests>      Total number of requests (default 100000)
 -P <numreq>        Pipeline <numreq> requests. Default 1 (no pipeline).
 -q                 Quiet. Just show query/sec values
 --csv              Output in CSV format
 -t <tests>         Only run the comma separated list of tests. The test
                    names are the same as the ones produced as output.
```

If everything runs as expected, you'll see the following output:

```bash
"SET","265252.00"
"GET","276701.72"
```

The printed values represent `requests/second` for the `set` and `get` operations.

Further, we will run the executable `redis-server` (`./redis-server`), which can be found in the support folder, and the following command (only the IP address of the redis server was changed):

```bash
$ ./redis-benchmark --csv -q -r 100 -n 10000 -c 1 -h 127.0.0.1 -p 6379 -P 8 -t set,get
```

The output should be similar to this:

```bash
"SET","495785.84"
"GET","514138.81"
```
