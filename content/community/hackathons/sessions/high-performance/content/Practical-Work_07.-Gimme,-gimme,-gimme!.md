With the last task you will implement a receive-only unikernel that measures the received traffic.
We keep busy polling for receive as well but you should implement a switching logic to switch between transmit and receive mode.
You can do this either with a configuration option (`Config.uk`) or with a kernel argument (see: `int argc, char *argv[]`).

Opening the network device is the same for receive except that we implement and hand-over a proper receive buffer allocation function.
This will replace `dummy_alloc_rxpkts()` when the receive mode is activated.
We can use the same pool allocator that we allocated for transmit during task 06.1.

Whenever the driver calls our callback, it tries to setup new receive buffers to receive new packet data.
When filled, these buffers are later returned back to us.
The function should look like this:

```c
/* global variables, fill-out before configuring the receive queue */
struct uk_netdev_info netdev_info;
struct uk_alloc *p;

uint16_t alloc_rxpkts(void *argp __unused,
                      struct uk_netbuf *pkts[],
                      uint16_t count)
{
	uint16_t i;

	/* fill out given array with allocated receive buffers */
	for (i=0; i<count; ++i) {
	    pkts[i] = uk_netbuf_alloc_buf(p,
                                      2048,
                                      netdev_info.ioalign,
                                      netdev_info.nb_encap_rx, /* headroom for rx */
                                      0, NULL);
	    if (!pkts[i])
			break; /* We ran out of memory */
	}
	return i;
}
```

Please note that this function expects that we initialized the global variables `netdev_info` and `p` before we configure the receive queue.

Now you should be able to build the polling receive loop based on the following snippet:

```c
status = uk_netdev_rx_one(netdev, 0, &pkt);
if (uk_netdev_status_successful(status)) {
	/* count packet and bytes and free received packet */
	nb_total_pkts += 1;
	nb_total_bytes += pkt->len + 24;
	uk_netbuf_free(pkt);
}
```

In order to test your configuration, you can run 2 unikernels that are both connected to `usocbr0`.
One is transmitting traffic and the other one receives it.
