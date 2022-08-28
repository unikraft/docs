Benchmarking Nginx running on top of Unikraft can be achieved with a utility called `iperf`.
The package can be easily installed using the command:

```bash
sudo apt-get install -y iperf
```

Next, we will start the nginx app as we have done with the previous work item, and then we will open one additional terminal.

We'll start an `iperf` client by connecting to the Nginx server running on top of Unikraft with the command:

```bash
$ iperf -c 172.44.0.76 -p 80
```

If everything runs as expected, then we will see the following output:

```bash
------------------------------------------------------------
Client connecting to 172.44.0.76, TCP port 80
TCP window size: 85.0 KByte (default)
------------------------------------------------------------
[  3] local 172.44.0.1 port 33262 connected with 172.44.0.76 port 80
[ ID] Interval       Transfer     Bandwidth
[  3]  0.0-10.0 sec  1.28 GBytes  1.10 Gbits/sec
```
