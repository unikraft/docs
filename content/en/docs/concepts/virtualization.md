---
title: Virtualization
date: 2020-01-11T14:09:21+09:00
weight: 202
---

## Virtualization Technologies & Unikraft

The next sections briefly describe the capabilities of both virtualization and
how Unikraft fits in the ecosystem.

### OS-Level Virtualization and Containers

Unikernels are not containers and are not based on container technology.
Instead, unikernels are a replacement for containers entirely

### Hyerpvisors and Virtual Machines

A hypervisor incorporates hardware-enabled multiplexing and segmentation of
compute resources in order to better utilize, better secure and better
facilitate the instantenous runtime of user-defined programs.  Traditionally,
monolithic Operating Systems (OSes) can become one or many Virtual Machines
(VMs), acting as if they the sole utilizer of their resources, unaware of the
multiplexing which happens to facilitate its existence.  Unikraft can be used to
build bespoke application-specific VMs which can run alongside monolithic OS
VMs.  The figure below illustrates an enumeration of at least one VM supervised
by a hypervisor embedded as a kernel component toolkit in the first OS.



The hypervisor emulates devices on behalf of the guest OS, including providing
access to vCPUs, vRAM, VFS' and vNIC(s) which are segmented from the underlying
hardware.

There are two forms of hardware-assisted virtualization: type-1 hypervisors
which give direct access to the hardware resources to the guest VM; and, type-2
hypervisors which emulate this interaction.

Since the hypervisor sits on top of a kernel capable of interacting with this
hardware, these individual software components are not needed by any guest OS
and (para-)virtualization libraries need only be used to achieve equal userland
process capabilities.  However, since it is possible to completely emulate all
hardware components, the individual architecture-specific components can be
included as part of a guest-OS as overhead.



## Supported Platforms in Unikraft

Unikraft supports the following type-1 and type-2 hypervisors out-of-the-box:

* `Linux Userspace <#>`_;
* `Linux KVM <#>`_;
* `Xen Hypervisor <#>`_;
* `Amazon Firecracker <#>`_; and,
* `Solo5 <#>`_.

There is planned or on-going work to provide these platforms to Unikraft:

* `VMWare <#>`_ (see `Github Issue <#>`_); and,
* `Hyper-V <#>`_ (see `Github Issue <#>`_).

If you are interested in helping in the development of with any of these
platforms, or any platform not listed above, please read our `contribution
guidelines <#>`_ or `get in contact <#>`_.
