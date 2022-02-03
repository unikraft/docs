---
title: Concepts
date: 2020-01-11T14:09:21+09:00
draft: false
collapsible: true
weight: 200
---

## What is a unikernel?

**The high level goal of Unikraft is to be able to build specialized OS images,
known as unikernels, easily, quickly and without time-consuming expert work.**

A key distinction between unikernels and classical monolithic Operating Systems
(OS) is that in its core, a unikernel does not have separate kernel and user
address spaces which allows much faster execution but comes at the cost of
security through the lack of memory protection with running unikernel processes
having full access to the memory of the system.  Furthermore, unikernels are
specifically designed for use in cloud environments where the host of such
environments must be trusted to not interfere or intercept the data passed
through the virtualized instance and must be trusted to keep the underlying
system secure. This level of trust depends on many factors, where even one
weakness could lead to the security benefits offered by unikernels mute.

By tailoring the OS, libraries and tools to the particular needs of your
specifically targeted application, a Unikraft unikernel image is both highly
performant and has a reduced attack surface. Out of the box, Unikraft supports
multiple platforms (e.g., Xen and KVM) and CPU architectures, meaning that if
you are able to build an application in Unikraft, you get support for these
platforms and architectures for "free".

### Problems with Monolithic OSes

To derive the core design principles of Unikraft, it is worth analyzing the
features and (heavyweight) mechanisms of traditional OSes that are unnecessary
or ill-suited to single application use cases:

* Protection-domain switches between the application and the kernel might be
  redundant in a virtualization context because isolation is ensured by the
  hypervisor, and result in measurable performance degradation.

* Multiple address spaces may be useless in a single application domain, but
  removing such support in standard OSes requires a massive reimplementation
  effort.

* For RPC-style server applications, threading is not needed, with a single,
  run-to-completion event loop sufficing for high performance. This would remove
  the need for a scheduler within the VM and its associated overheads, as well
  as the mismatch between the guest and hypervisor
  schedulers~\cite{Faggioli2019}.

* For performance-oriented UDP-based apps, much of the OS networking stack is
  useless: the app could simply use the driver API, much like DPDK-style
  applications already do. There is currently no way to easily remove just the
  network stack but not the entire network sub-system from standard OSes.

* Direct access to NVMe storage from apps removes the need for file
  descriptors, a VFS layer and a filesystem, but removing such support from
  existing OSes, built around layers of the storage API, is very difficult.

* Memory allocators have a large impact on application
  performance, and general purpose allocators have been shown to be
  suboptimal for many apps~\cite{Savage2020}. It would therefore
  be ideal if each app could choose its own allocator; this is
  however very difficult to do in today's operating systems because
  the allocators that kernels use are baked in.


This admittedly non-exhaustive list of application-specific optimizations
implies that for each core functionality that a standard OS provides, there
exists at least one or a few applications that do not need it. Removing such
functionality would reduce code size and resource usage but would often require
an important re-engineering effort.


## Unikraft

Unikraft consists of three basic components:

 * **Library Components** are Unikraft modules, each of which provides some
   piece of functionality. As is expected of a library, they are the core
   building blocks of an application. Libraries can be arbitrarily small (e.g.,
   a small library providing a proof-of-concept scheduler) or as large as
   standard libraries like libc. However, libraries in Unikraft often wrap
   pre-existing libraries, such as openssl, and as such existing applications
   can still make use of relevant, existing systems without having to re-work
   anything.

 * **Configuration.** Inspired by Linux’s Kconfig system, this Unikraft uses
   this approach to quickly and easily allow users to pick and choose which
   libraries to include in the build process, as well as to configure options
   for each of them, where available. Like Kconfig, the menu keeps track of
   dependencies and automatically selects them where applicable.

 * **Build Tools.** The core of Unikraft is a suite of tools which aid in the
   creation of the final unikernel image. Based on make, it takes care of
   compiling and linking all the relevant modules and of producing images for
   the different platforms selected via the configuration menu.

## Unikraft Libraries

Unikraft libraries are grouped into two large groups: core (or internal)
libraries, and external libraries. Core libraries generally provide
functionality typically found in operating systems. Such libraries are grouped
into categories such as memory allocators, schedulers, filesystems, network
stacks and drivers, among others. Core libraries are part of the main Unikraft
repo which also contains the build tool and configuration menu.

External libraries consist of existing code not specifically meant for Unikraft.
This includes standard libraries such as libc or openssl, but also run-times
like Python.

Whether core or external, from a user’s perspective these are indistinguishable:
they simply show up as libraries in the menu.