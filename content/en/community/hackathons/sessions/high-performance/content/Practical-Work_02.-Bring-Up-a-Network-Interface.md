We can directly interact with network device drivers which are typically provided by each platform using Unikraft's internal [`uknetdev`](https://github.com/unikraft/unikraft/tree/staging/lib/uknetdev) API.
First, make sure that we state a dependency of our application to `libuknetdev`.
To do this, open `Config.uk` and place the following dependency accordingly in the file (if not already there): `depends on LIBUKNETDEV`.

This dependency gives us access to the `<uk/netdev.h>` and `<uk/netbuf.h>` headers which are available within the `libuknetdev` library:

```console
$ ls [PATH-TO-UNIKRAFT]/lib/uknetdev/include/uk/
```

As described in `<uk/netdev.h>`, bringing up a network interface means transition it through configuration states before we can use the interface for sending packets:

**Note**: Keep a tab open with [`netdev.h`](https://github.com/unikraft/unikraft/blob/staging/lib/uknetdev/include/uk/netdev.h).
You'll find the documentation for the netdev API there.

1. Check that the platform detected network interfaces.
   `uk_netdev_count()` should tell us how many interfaces are available.
   Please note that you should also check that the network driver is enabled in the platform configuration.
   For this session we are interested in `virtio-net` within `KVM guest`.

1. Retrieve `struct uk_netdev *` for further API interaction from a netdev number (they are just incrementally going upwards).
   We take the first interface, so our device number should be `0`.

1. Configure the device, which essentially indicate how many receive and transmit queues the device should provide.
   In SMP scenarios, you typically configure as many queues as CPU-cores or handler threads you have been allocated.

   **Note:**  Not every driver or network card can support multiple queues.

   There is a query interface where you can check for queues are supported by your device.
   For simplicity, we are going to configure just one queue for each direction.
   This is supported by all drivers.
   Although we are going to send packets only, we still have to also configure one receive queue (zero transmit or receive queues is not possible with our virtio driver):

   ```c
   /* Device configuration */
   struct uk_netdev_conf ifconf = {
   	   .nb_rx_queues = 1,
   	   .nb_tx_queues = 1
   };
   ```

1. Configure the transmit queue `0` and the receive queue `0`.
   This step allows us to specify the size for each queue and which allocators should be used for internal queue descriptors and receive buffers.
   We will take the default allocator for those items.
   You can define a dummy allocation function for the receive buffers, because we are not interested in receiving for now.
   We will also let the driver to choose an optimal queue size for us.
   You can hand-over `0`.

   ```c
   /* Dummy receive buffer allocation function that is called by the driver */
   static uint16_t dummy_alloc_rxpkts(void *argp __unused,
   				struct uk_netbuf *pkts[] __unused,
   				uint16_t count __unused)
   {
   	return 0;
   }

   /* Receive queue configuration */
   struct uk_netdev_rxqueue_conf rxqconf;

   rxqconf.a = uk_alloc_get_default();
   rxqconf.alloc_rxpkts = dummy_alloc_rxpkts;

   /* Transmit queue configuration */
   struct uk_netdev_txqueue_conf txqconf;

   rxqconf.a = uk_alloc_get_default();
   ```

1. Probe the device. `uk_netdev_probe` probes an unprobed Unikraft network device and turns it into unconfigured state.
   After successful probing, the driver collected information about the backend device.

   ```C
   int uk_netdev_probe(struct uk_netdev *dev);
   ```

1. Start the network interface.
   If successful, the device is now ready to process network traffic.
   You will now have the ability to also enable interrupt mode for each queue individually and change the promiscuous setting for the interface.
   Because we will operate in _polling mode_ to achieve the highest possible performance, we should not change any interrupt settings.
   We also do not need promiscuous mode because we will put the device's hardware address as sender address into our generated traffic.
   It is probably a good moment to print on the console this mac address and store it for later.
   We will need it to craft our first network packet.

   ```C
   int uk_netdev_start(struct uk_netdev *dev);
   ```

For easier development of this state transition, we recommend to enable all kernel message types and optionally debug message (go to `Library Configuration` -> `ukbedug`).
Many of these steps should produce some kernel output so that you can quicker see if something got misconfigured.

In order to test your code you should run the guest with one interface attached.
For this purpose we need to create a network bridge on your Linux host first (we just need to do this once):

```console
# Ensure you have permissions to change stp
sudo sysctl -w net.bridge.bridge-nf-call-arptables=0

# Create bridge 'usocbr0'
brctl addbr usocbr0
brctl setfd usocbr0 0
brctl sethello usocbr0 0
brctl stp usocbr0 off
ifconfig usocbr0 0.0.0.0 up

# Disable packet filtering on bridge interfaces
echo 0 > /proc/sys/net/bridge/bridge-nf-call-arptables
echo 0 > /proc/sys/net/bridge/bridge-nf-call-iptables
echo 0 > /proc/sys/net/bridge/bridge-nf-call-ip6tables
```

As soon as your unikernel image builds, the guest can then be started with:

```console
$ kraft run -b usocbr0
```
