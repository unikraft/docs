Now, we have can go through some options to play around with.

Our overall goal is to get the packet rate of our packer generator as high as possible.
Note your rate and bandwidth before and, after each of the steps because we are going over this list twice, make sure that you do the steps non-destructive and keep the code of each step.

1. **Try compiler options**: Enable *Link Time Optimizations* (LTO) and *Dead Code Elimitation* (DCE) within `Build Options` of the `menuconfig`.
   The compiler reconsiders a second time optimizations like function inlining while linking the final binary;
   actually over the whole code base at once again.
   These optimizations can have some visible effect on your packet rate.
   Try it out!

2. **Don't waste packets**: An obvious idea might be to keep packets which have failed to send.
   We could save on packet generation time if we wouldn't free them.
   We retry sending a packet until it finally leaves.
   Our assumption is that the reason why it fails is that the transmit queue is full.
   This approach can have positive but also likely negative effects.
   The reason might be that some drivers may query their device more often to confirm that there is really no space left.
   This causes the device to be busy answering instead of doing some actual work.
   Try it out!

3. **Copy instead of create**: Depending on how expensive the packet generation function is (e.g., because of an extra step computing a checksum), it could be cheaper to do a `memcpy` operation from a primordial packet buffer instead.
   This means that we would run `genpkt_udp4()` just once and use as source for all cloned packets that are going to get transmitted.
   We provide you such an extra routine with `"netbuf.h"`: [`uk_netbuf_dup_single()`](https://github.com/unikraft/summer-of-code-2021/blob/main/content/en/docs/sessions/10-high-performance/sol/pktgen/netbuf.h#L45-L79) duplicates a given `netbuf` packet with `memcpy`.
   Like `genpkt_udp4()`, it also needs the same extra information like `bufalign`, `headroom` for doing the allocation of the duplicate.
   Try it out!

4. **Use a memory pool allocator**: This is usually a very promising optimization.
   Instead of using a general purpose allocator you can ensure that all `malloc` and `free` operations are satisfied within O(1).
   If we deal with rates at maximum speed you want to have every job done as fast as possible.
   A pool is basically a list of pre-allocated objects that have all the same size and an alignment property (if given).
   On `malloc`, an object is returned out of this list;
   on `free`, the object gets back to the free list.
   For trying it out, continue with 06.1 and come back to point 5 of this list afterwards.

5. **Zero-copy with refcounting**: Instead of all the optimization ahead, we could also simply increase the `netbuf` reference counter before sending.
   This avoids that the packet being `free`'d after sending and we would not need to allocate, copy, or generate a packet over and over again.
   Every `free` operation will decrease the refcount until the reference counter becomes zero.
   At this point the netbuf is really `free`'d.
   Unfortunately, we do not support this mode with network drivers which modify the packet for the transmission, like virtio-net does.
   Unfortunately, it is not an option for virtio-net at the moment.
   The transmit function will return an error.

Besides these options, another common technique is using **batching**.
Instead of sending one packet at a time, you send multiple ones at once.
The advantage is that the device backend is notified just once per batch instead of for each packet.
This reduces communication overhead.
This feature is currently submitted as [PR#243](https://github.com/unikraft/unikraft/pull/243) and will be added in the near future.

In order to understand better the bottlenecks in our implementation, we can isolate the code from the netdev device bottlenecks.
This is done by replacing the send operation with `uk_netbuf_free()`.
There we can assume that this means that every transmit operation works but this reveals more dominantly performance differences of the suggestions 1-5 ahead.
Go over the list again and note the new collected rates.
Which option results in the best performance?

**Recommendation**: The pre-processor can help you switching between these two modes quickly:

```c
#if 0 /* <-- toggle between these two blocks with 0 and 1 */
	status = uk_netdev_tx_one(netif, 0, pkt);
	if (uk_netdev_status_successful(status)) {
		/* success */
		total_nb_pkts += 1;
		total_nb_bytes += 60 /* pktlen */ + 24;
	} else {
		/* failed */
		uk_netbuf_free(pkt);
	}
#else
	uk_netbuf_free(pkt);
	/* always success */
	total_nb_pkts += 1;
	total_nb_bytes += 60 /* pktlen */ + 24;
#endif
```

#### 06.1. Use a memory pool

We provide a pool allocator library with Unikraft: `libukallocpool`.
First of all, add a dependency to this library in your `Config.uk`:

```
depends on LIBUKALLOCPOOL
```

This dependency makes the header `"<uk/allocpool.h>"` (within `[PATH-TO-UNIKRAFT]/lib/ukallocpool/include/uk/`) available.

In order to allocate one pool, you call `uk_allocpool_alloc()` at your application startup.
The function will allocate the pool memory from a parent allocator.
This happens just during creation time for pre-allocating all the pool objects.

In our case this parent is the default allocator.
As `obj_len` you should choose `2048` because this is a big enough buffer to keep packet data and needed meta data.
`obj_align` should be again set to the alignment requirement of the device (`struct uk_netdev_info`->`ioalign`).
The `obj_count` argument should be big enough so that we do not run out of pool objects while sending.
You can try different values, start with `1024`.

```c
struct uk_allocpool *pool;

pool = uk_allocpool_alloc(uk_alloc_get_default(), 1024, 2048,
                          netdev_info.ioalign);
```

In order to use the pool as allocator for `pktgen_udp4()`  and `uk_netbuf_dup_single()`, you need to get the compatibility interface from libukallocpool:

```c
struct uk_alloc *p;

p = uk_allocpool2ukalloc(pool);
```

`p` can then be handed over as normal allocator, like `uk_alloc_get_default()`.
`p` will always return 2048B objects as long as the malloc request is smaller or equal to the initialized `obj_len`.
Any bigger allocation request cannot be satisfied and libukallocpool is returning `NULL`.
