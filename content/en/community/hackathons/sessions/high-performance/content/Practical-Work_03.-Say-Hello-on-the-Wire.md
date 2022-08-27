In this chapter we are going to send out our first packet.
We provide you a function through the header [`"genpkt.h"`](https://github.com/unikraft/summer-of-code-2021/blob/main/content/en/docs/sessions/10-high-performance/sol/pktgen/genpkt.h) which generates an Ethernet-IPv4-UDP frame with a dummy payload for a given size: `genpkt_udp4()`.
In the same header we also provide you the short-hand version `genpkt_usoc21()` which has some parameters, like the IP addresses, pre-filled.

The only items that the function still wants to know from you are the following:

* `a`: Allocator where the packet should be allocated from.
  Use [`uk_alloc_get_default()`](https://github.com/unikraft/unikraft/blob/64870e20031aad230973b205ba80ff70a454c924/lib/ukalloc/include/uk/alloc.h#L135-L138) for now.

* `bufalign`: An alignment requirement for the packet buffer containing the packet.
   Some network drivers require specific alignments.
   You find this value after querying the device with [`uk_netdev_info_get()`](https://github.com/unikraft/unikraft/blob/104fed122c41cbdedb03b701c19c38d4974cca34/lib/uknetdev/netdev.c#L217-L236) on [`struct uk_netdev_info`](https://github.com/unikraft/unikraft/blob/104fed122c41cbdedb03b701c19c38d4974cca34/lib/uknetdev/include/uk/netdev_core.h#L141-L150) as `ioalign`.

* `headroom`: Reserved bytes at the beginning of the packet buffer and before the packet data starts.
  Some drivers require this in order to do another encapsulation on transmit (like virtio).
  You find this value on the `struct uk_netdev_info` as `nb_encap_tx`.

* `pktlen`: The size of the Ethernet frame (excluding CRC, FCS, SFD, and preamble) that should be generated.
  According to the [Ethernet specification](https://www.ietf.org/rfc/rfc1042.txt) the smallest packet size can be created with `60` and the biggest with `1518`.
  The most interesting are minimum sized packets because those stress software and hardware components the most.
  For each packet, the header needs to be parsed and the packet needs to get forwarded to the next processing layer of the stack.
  As smaller the packets are, the more load with parsing and handling packet buffers occurs. So, please take `60` ;-)

* `mac_src`: The hardware address of our interface where we are going to send the packet out.

The function returns you a `netbuf` that can be send out with [`uk_netdev_tx_one()`](https://github.com/unikraft/unikraft/blob/4e54f09a3930f0482a90903a5750c036346c7c06/lib/uknetdev/include/uk/netdev.h#L471-L508).
Please check the resulting status code for success and free the packet with [`uk_netbuf_free()`](https://github.com/unikraft/unikraft/blob/4e54f09a3930f0482a90903a5750c036346c7c06/lib/uknetdev/netbuf.c#L220-L254) in case of failures.
The driver will do the free operation itself only if a packet got correctly enqueued to the device and sent.
In such a case, you aren't allowed to touch this packet anymore after sending;
so your transmit code should look like this:

```c
	/* <...> */

	status = uk_netdev_tx_one(netif, 0, pkt);
	if (!uk_netdev_status_successful(status)) {
		uk_pr_err("netdev%u: Failed to send packet %p\n",
			  uk_netdev_id_get(netif), pkt);
		uk_netbuf_free(pkt);
	}

	/* Do not touch pkt here anymore */
	/* <...> */
```

In order to see if everything works, attach `tshark` or `tcpdump` on your Linux host to `usocbr0` on a second terminal:

```sh
$ tshark -i usocbr0
```

Whenever you launch your unikernel, you should be able to see the UDP packet:

```
    3 1.050213439 192.168.128.1 → 192.168.128.254 UDP 60 5001 → 5001 Len=18
```
