---
title: "Unikraft on VMware"
date: "2023-04-0xT12:00:00+01:00"
authors: [
  "Paul-Sebastian Ungureanu"
]
tags: ["unikernel", "vmware", "e1000", "networking"]
---
Unikraft is currently able to run on the most popular open-source hypervisors: KVM and Xen. These platforms are amazing for development, but the tooling for more ambitious environments is either lacking or can be difficult to setup. VMware's bare-metal hypervisor, ESXi has all the vSphere ecosystem built around it that makes configuration really easy. In this blog post we explore the journey of getting a Unikraft simple HTTP server running on VMware.

So, before jumping into more details, let's expand a bit on VWare hypervisors. VMware currently offers two hypervisors: ESXi and Workstation. If you are not an infrastructure or a DevOPs engineer, you are more likely to have played with Workstation before. Workstation is a type 2 hypervisor, meaning that it gets installed on top of your current operating system. On the other hand, ESXi is a type 1 hypervisor that must be installed directly on your hardware and managed from another device.

Although the goal of this project is to get it running on ESXi, the first step is to get it working on Workstation as that does not require an additional device for server.

## Booting

VMware Workstation expects a `.iso` image to boot. This can be obtained by using the `mkgrubimg` [script](https://github.com/unikraft/unikraft/blob/staging/support/scripts/mkgrubimg). Using the KVM kernel image as input is enough to get a bootable image that can be used in Workstation.

## Devices

Ok, cool, we've got Unikraft HTTP Server running on VMware, but is it really working as expected? Well, not really. Unikraft currently has drivers for only one networking device: virtio-net, [a virtual ethernet card](https://docs.oasis-open.org/virtio/virtio/v1.2/cs01/virtio-v1.2-cs01.html#x1-2170001). However, Workstation only supports other network devices: `vlance`, `e1000`, `e1000e`, `vmxnet` and `vmxnet3`. In order to get the networking in Unikraft, we have to add a driver for one of these devices, but each of these has its quirks:

`vlance` is the virtualized variant of AMD's PCnet32 LANCE, quite an old device.
`e1000` is the virtualized variant of Intel's 82545EM 1GBit Network Card. This is the most widely used device and is used by default.
`e1000e` is the newer version of `e1000` and is basically a virtualized Intel's 82574EM. One other difference compared to the older version is that this is a PCIe device, not a PCI.
`vmxnet3` is a VMware proprietary virtual card that supports 10GBit. This is also a PCIe device.

Because Unikraft does not have PCIe support, `e1000` was the best option.

TODO: test vmxnet3 / e1000 performance on Ubuntu on VMWare.

In Workstation, there is no option to configure the network device type via GUI. The only way is by changing the `.virtualDev` option in the `.vmx` configuration file of the virtual machine.

## PCI Devices

In a PCI configuration, there are three types of devices: root complex devices, endpoint devices and bridge devices. Bridge devices connects a bus to the parent bus, allowing hierarchical structure, meanwhile endpoint devices provide a specific functionality. Root complex devices have only a downstream connection with the PCI bus.

The process in which the operating systems acknowledges the devices is called enumeration. Enumeration is usually done at boot time in order to enable the early usage of the devices. There are multiple approaches to enumerate devices: brute-forcing or recursively. There are three numbers used to define a configuration: bus number (0-255), device number (0-31) and a function number (0-7). Because of the small address space of 16 bits, summing up to 65536 configurations, it is possible for the kernel to verify if there are devices associated for all the configurations. A more efficient alternative to the solution before is to perform a recursive lookup in the PCI hierarchy on bridge devices. The kernel can determine if a device is a bridge device or endpoint device by reading the IO registers and thus, enabling it to explore only the existing bus.

VMware adds the majority of the devices on a bridge. Unikraft uses the recursive approach and should theoretically recognize all sub-devices, but it's unable to do so. Just to get over this problem faster, I switched to a brute-force approach.

## E1000 driver

There makes little to no sense to build the driver from scratch (except for funsies) since E1000 is an extremely popular network card and there are so many implementations out there. Unikraft in particular has a similar interface to DPDK's making it easier to port the code from there. Of course, you cannot blindly copy code without understanding it, but this is where the [E1000 documentation](https://pdos.csail.mit.edu/6.828/2022/readings/8254x_GBe_SDM.pdf) comes in handy.

I won't dive too deep in how the driver works, but I think the reception / transmission model can be quite interesting. In the following we will refer to the guest's driver as "software" and host's device as "hardware".

The reception and transmission of data uses these "descriptors" which are just some simple data structures containing pointers to memory buffers (that hold the actual data), the length of the data and other metadata fields (e.g. special, status, errors, checksum). These metadata fields provide more information about the buffer.

So, okay, we have this mean of communication, but how can we make sure the producer / consumer are in sync and do not have concurrency issues (e.g. the consumer consuming incomplete buffers or the producer overwriting a buffer that was not consumed yet by the producer)? Simple: by using two circular queues smartly: one for reception (abbreviated as RX), one for transmission (abbreviated as TX). These circular queues are also refereed as ring buffers. Let's see how these work by breaking into 3 phases: initialization, reception and transmission.

At initialization, the driver has to allocate the descriptors (including the buffers) and the queues. There are (at least) two queues: one for RX, one for TX. The ownership of the RX queue is handed to the hardware. The transmission queue is software's to keep. Each queue has two pointers: head and tail. For both queues, the software owns the TAIL pointer and the hardware owns the HEAD. Initially, these two both point to the BASE pointer (which is just the "first" element of a circular queue if that makes sense somehow). When these pointers are incremented, the ownership of the past descriptor is passed to the other entity.

Let's say we just initialized our device and we have N packets incoming. Immediately after initialization, both HEAD and TAIL are pointing to BASE. When these N packet arrive, the hardware populates the descriptor HEAD is pointing at and increments HEAD for each of those. At the end, HEAD will be BASE + N and TAIL has not moved at all. The elements between TAIL and HEAD are owned now by the software (remember, the contract is that ownership is passed when one pointer is increased). Software can start now consume those packages. Once it is done with processing, the descriptors have to be in a clean state (ready to be populated again by the hardware when the time comes). Given no interruption, the software processes all N packages and increment TAIl each time. TAIL will be again equal to HEAD (and equal to BASE + N). When TAIL = HEAD, it means that there are no new packets received. When HEAD != TAIL, there are packets that were received but not processed yet (not saying HEAD > TAIL, because this is a circular buffer).

Transmission is similar to reception, but this time, the software is the producer and the hardware is the consumer. When the software wants to transmit something, it writes the packets (let's say N again) into the descriptor to which TAIL is pointing at and increments TAIL (for each packet). The device will process these packages and increment HEAD. This means that when HEAD = TAIL, there are no packets to be transmitted. When TAIL != HEAD, there are packets that were sent for transmission by the software, but not processed yet by the hardware.

In both cases, under no circumstance should the consumer pointer (software's TAIL in case of RX and hardware's HEAD in case of TX) be increased if they are equal to the other pointer because that would mean the consumer tries to consume packages that were not produced yet (which can lead to weird behaviour). This would happen in case of a faster consumer.

And similarly, the producer's pointer (hardware's HEAD in case of RX and software's TAIL in case of TX) should under no circumstance be incremented if it's equal to consumer's pointer - 1 (software's TAIL in case of RX and hardware's HEAD in case of TX) because this would mean the producer overwrites packages not consumed yet. This would happen in case of a faster producer. Take the following example: we just powered on our laptop; the networking gets initialized quite early but there are a lot of other stuff still ongoing (meaning that we will consume packets reaaaally slow). Let's also say we have a queue of N elements, and we receive N packets. Because the device is not slowed at all it can easily process these so HEAD will become: BASE + 1, BASE + 2, ... BASE + N - 1, BASE (BASE + N = BASE, if N = len(ring buffer)), while TAIL still points to BASE. If we were to receive the (N+1)th package, we would be forced to overwrite the descriptor at which HEAD (= BASE = TAIL) points, but that descriptor has not been processed yet.

## A reminder on I/O slowness

After I got it working, I wanted to stress it a bit and see how well it handles packages... However, when I was pinging the HTTP server, I noticed that it was extremly slow. One ping was taking 300ms. It turned out that debug messages I had were making it so slow. After disabling those, the ping reduced to 0.1 - 0.2 ms. Ok, that was easy fix but I still think it's a nice reminder on how slow I/O can be.

## TCP port reuse in LWIP

But that above was not the only issue. There was a second issue I had was when I was trying to stress test by doing tons of cURLs (I know, not the most efficient way of stress testing, but surely one of the easiest/fastest way). What I found out is that every hundred-ish / thousand-ish cURLs, cURL eventually stucks. Opened up Wireshark to investigate and saw the last connection, the one that got stuck, was marked as "TCP Port reuse". So, instead of doing that many cURLs, I was eventually able to replicate the behaviour by forcing the TCP port reuse with `--local-port 42000` (or whatever port number) on two consecutive cURLs.

My hypothesis is this happens because LWIP (the library implementing the TCP/IP stack used by Unikraft) does not support port reusage. This can be somehow alleviated by enabling `LWIP_SO_LINGER`. This gets us back a response, but the connection is not closed gracefully.

This issue is tracked on Unikraft's lwip port [repo](https://github.com/unikraft/lib-lwip/issues/31).

## What's next?

I started on quite an old Unikraft version which now requires rebasing. Once rebased, I will have to fix all the shortcuts took and tidy up the implementation. Of course, as initially stated, having Unikraft running on ESXi is the goal, so another round of testing will be necessary. And of course, a comparison between KVM/qemu with virtio-net and VMware ESXi/Workstation with e1000 would be interesting to see. I expect e1000 to actually have a better bandiwdth than 1Gbit since it's virtualized, but this has yet to be confirmed.
