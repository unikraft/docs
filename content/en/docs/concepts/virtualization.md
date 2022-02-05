---
title: Virtualization
description: |
  Understand the main differences in virtualization technologies and what
  Unikraft supports.
---

## Virtualization

Through virtualization, multiple operating systems (OSes) are able to run on the same hardware, independently, thinking that each one of them controls the entire system.
This can be done using a hypervisor, which is a low-level software that virtualizes the underlying hardware and manages access to the real hardware, either directly or through the host Operating System.
There are 2 main virtualized environments: virtual machines and containers, each with pros and cons regarding complexity, size, performance and security.
Unikernels come somewhere between those 2.

### Virtual Machines

A virtual machine represents an abstraction of the hardware, over which an operating system can run, thinking that it is alone on the system and that it controls the hardware below it.
Virtual machines rely on hypervisors to run properly.

A hypervisor incorporates hardware-enabled multiplexing and segmentation of compute resources in order to better utilize, better secure and better facilitate the instantenous runtime of user-defined programs. Through By the means of a virtaul machine, an operating system is unaware of the multiplexing which happens to facilitate its existence. The hypervisor emulates devices on behalf of the guest OS, including providing access to virtual CPUs, virtual Interrupt Controllers and virtual NICs, which are segmented from the underlying hardware.

The hypervisors can be classified in 2 categories: Type 1 and Type 2:

* The **Type 1 hypervisor**, also known as **bare-metal hypervisor**, has direct access to the hardware and controls all the operating systems that are running on the system.
  The guest OSes have access to the physical hardware, and the hypervisor arbiters this accesses.
  KVM is an example of Type 1 hypervisor.
* The **Type 2 hypervisor**, also known as **hosted hypervisor**, has to go through the host operating system to reach the hardware.
  Access to the hardware is emulated, using software components that behave in the same way as the hardware ones.
  An example of Type 2 hypervisor is VirtualBox.

| ![type 1 hypervisor os](/assets/imgs/vm1.svg) | ![type 2 hypervisor os](/assets/imgs/vm2.svg) |
| :--:									  | :--:								    |
| Operating systems over type 1 hypervisor				  | Operating systems over type 2 hypervisor 				    |

### Unikraft

Unikraft has a size comparable with that of a container, while it retains the power of a virtual machine, meaning it can directly control the hardware components (virtualized, or not, if running bare-metal).
This gives it an advantage over classical Operating Systems.
Being a special type of operating system, Unikraft can run bare-metal or over a hypervisor.

| ![type 1 hypervisor uk](/assets/imgs/unikraft1.svg) | ![type 2 hypervisor uk](/assets/imgs/unikraft2.svg) |
| :--: | :--: |
| Unikraft over Type 1 hypervisor                                                  | Unikraft over Type 2 hypervisor                           		|

The following table makes a comparison between regular virtual machines (think of an Ubuntu VM), Containers and Unikernels, represented by Unikraft:
|                      | Virtual Machines              | Containers                        | Unikernels                  |
| :------------------: | :---------------------------: | :-------------------------------: | :-------------------------: |
| **Time performance** | Slowest of the 3              | Fast                              | Fast                        |
| **Memory footprint** | Heavy                         | Depends on the number of features | Light                       |
| **Security**         | Very secure                   | Least secure of the 3             | Very secure                 |
| **Features**         | Everything you would think of | Depends on the needs              | Only the absolute necessary |

### Supported platforms

Unikraft is usually run in 2 ways:

* As a virtual machine, using [**QEMU-KVM**](/docs/operations/plats/kvm/) or [**Xen**](/docs/operations/plats/xen/).
  It acts as an operating system, having the responsibility to configure the hardware components that it needs (clocks, additional processors, etc).
  This mode gives Unikraft direct and total control over hardware components, allowing advanced functionalities.
* As a [**linuxu**](/docs/operations/plats/linuxu/) build, in which it behaves as a Linux user-space application.
  This severely limits its performance, as everything Unikraft does must go through the Linux kernel, via system calls.
  This mode should be used only for development and debugging.

When Unikraft is running using **QEMU-KVM**, it can either be run on an emulated system or a (para)virtualized one.
Technically, **KVM** means virtualization support is enabled.
If using **QEMU** in emulated mode, **KVM** is not used.

Emulation is slower, but it allows using CPU architectures different from the local one (you can run ARM code on a x86 machine).
Using (para)virtualisation, aka hardware acceleration, greater speed is achieved and more hardware components are visible to Unikraft.

Unikraft can also be run on Cloud platforms, like [**AWS**](/docs/operations/cloud/aws/), [**GCP**](/docs/operations/cloud/gcp/) and [**DigitalOcean**](/docs/operations/cloud/digitalocean/). for more information, see the [**Cloud**](/docs/operations/cloud/) section.

### Future virtualization support

Unikraft is planned to be able to run on **Hyper-V** and **VMWare**, in the near future.
