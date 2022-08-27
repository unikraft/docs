It is now interesting to understand at which speed we are generating.
For this purpose we prepared a little function in [`"netspeed.h"`](https://github.com/unikraft/summer-of-code-2021/blob/main/content/en/docs/sessions/10-high-performance/sol/pktgen/netspeed.h) that computes the packet rate (packets/sec) and current bandwidth (MBit/s): [`print_netspeed()`](https://github.com/unikraft/summer-of-code-2021/blob/main/content/en/docs/sessions/10-high-performance/sol/pktgen/netspeed.h#L93-L112).

Declare before your loop the following two variables:

```c
uint64_t total_nb_pkts = 0; /* total number of pkts successfully sent */
uint64_t total_nb_bytes = 0; /* total number of bytes successfully sent */
```

Whenever a packet was successfully sent, we will simply increment `total_nb_pkts` and add the sent bytes `total_nb_bytes` counters.
In order to see a bandwidth computation that is comparable with physical Ethernet speeds, we have to additionally add the number of bytes (=`24`) for CRC, FCS, SFD, and preamble to each accounted packet size:

```c
	status = uk_netdev_tx_one(netif, 0, pkt);
	if (uk_netdev_status_successful(status)) {
		/* success */
		total_nb_pkts += 1;
		total_nb_bytes += 60 /* pktlen */ + 24;
	} else {
		/* failed */
		uk_netbuf_free(pkt);
	}
```

By having this instrumentation, we could now just print the packet rate and bandwidth at every loop iteration with:

```c
	print_netspeed(total_nb_pkts, total_nb_bytes);
```

The problem is that printing is extremely expensive.
This is because it happens synchronously in Unikraft, so the CPU can not do anything else while waiting for the console to finish its operation.
Additionally, for computation, the clock is accessed to measure a time delta, which is also an expensive operation.
In general, this means that we do not want this function to be called very often.
The cheapest option is to call this print function every `n`th sent packet.
We could do a cheap modulo operation by using a bitmask, for example:

```c
		if ((total_nb_pkts & 0x3fffff) == 0x0) {
			print_netspeed(total_nb_pkts, total_nb_bytes);
		}
```

You are able to adopt the mask `0x3fffff` in order to make printing more often or less often.

* Faster: `0x1fffff`, `0x0fffff`, `0x07ffff`, `0x03ffff`, `0x01ffff`, ...
* Slower: `0x7fffff`, `0xffffff`, `0x1ffffff`, `0x3ffffff`, `0x7ffffff`, ...

Another option is to use another counter variable that is reset as soon as we print:

```c
		if (count == 1000) {
			print_netspeed(total_nb_pkts, total_nb_bytes);
			count = 0;
		}
```

Instrument your code with the two statistics variables and implement one of the mentioned printing mechanisms.
We should roughly print not faster than every `2` seconds, ideal are roughly `5`-`10` second intervals.
Remember, if your rate goes up or down with one of the following experiments, you may need to revisit your chosen value and adopt this `n`th packet parameter again.
