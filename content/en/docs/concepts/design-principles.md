---
title: Design Principles
date: 2022-03-11T21:35:00+02:00
weight: 201
---

## Overview

The problem we want to solve is to enable developers to create a specialized OS
for every single application to ensure the best performance possible, while at
the same time bounding OS-related development effort and enabling easy porting
of existing applications. This analysis points to a number of key design
decisions:


* **Single address space**: Target single application scenarios, with possibly
  different applications talking to each other through networked communications.

* **Fully modular system**: All components, including operating system
  primitives, drivers, platform code and libraries should be easy to add and
  remove as needed; even APIs should be modular.

* **Single protection level**: There should be no user-/kernel-space separation
  to avoid costly processor mode switches. This does not preclude
  compartmentalization (e.g., of micro-libraries), which can be achieved at
  reasonable cost <i>Sung2020</i>.

* **Static linking**: Enable compiler features, e.g., [Dead-Code Elimination](#)
  and :ref:`lto`, to automatically get rid of unneeded code.

* **POSIX support**: In order to support existing or legacy
  applications and programming languages while still allowing for
  specialization under that API.

* **Platform abstraction**: Seamless generation of images for
  a range of different hypervisors/VMMs.


Given these, the question is how to implement such a system: by minimizing an
existing general-purpose operating system, by starting from an existing
unikernel project, or from scratch.

Existing work has taken three directions in tackling this problem. The first
direction takes existing OSes and adds or removes functionality.  Key examples
add support for a single address space and remove protection domain crossings:
OSv and Rump <i>rump</i> adopt parts of the BSD kernel and re-engineer it to
work in a unikernel context; Lupine Linux <i>Kuo2020</i> relies on a minimal,
specialized configuration of the Linux kernel with Kernel Mode Linux (KML)
patches. These approaches make application porting easy because they provide
binary compatibility or POSIX compatibility, but the resulting kernel is
monolithic.



Existing monolithic OSes do have APIs for each component, but most
APIs are quite rich as they have evolved organically, and
component separation is often blurred to achieve performance (e.g.,
sendfile short circuits the networking and storage stacks).  The
Linux kernel, for instance, historically featured highly inter-dependent
subsystems <i>Bowman1999</i>.

To better quantify this API complexity, we analyzed dependencies between the main
components of the Linux kernel.
As a rough approximation, we used the subdirectories in the kernel
source tree to identify (broad) components.
We used cscope to extract all
function calls from the sources of all kernel components, and then for
each call checked to see if the function is defined in the same
component or a different one; in the latter case, we recorded a
dependency.  We plot the dependency graph, the annotations on the edges show the number of dependencies
between nodes. This dense graph makes it obvious that
removing or replacing any single component in the Linux kernel requires understanding and fixing all
the dependencies of other components, a daunting task.

While full modularization is difficult, modularizing certain parts of a monolithic
  kernel has been done succesfully by Rump. There, the NetBSD kernel was
  split into base layers (which must be used by all kernels),
  functions provided by the host (scheduling, memory allocation,etc)
  and so-called factions that can be run on their own (e.g.  network
  or filesystem support). Rump goes some way towards achieving our goals,
  however there are still many dependencies left which require that all kernels
  have the base and hypercall layers.
  Additionally, the dependencies on the host
  are limiting in the context of a VM, which is our target deployment.

The second direction is to bypass the OS altogether, mostly
for I/O performance, while leaving the original stack in place --
wasting resources in the process. Even here, porting effort is required
 as apps must be coded against the new network (DPDK,
netmap or Linux's iouring subsystem) or storage (SPDK) API.

The third direction is to add the required OS functionality from scratch
for each target application, possibly by reusing code from existing
operating systems. This is the approach taken by ClickOS to support
Click modular routers, MirageOS to support OCaml applications, and
MiniCache to implement a web cache, to name a few. The resulting
images are very lean, have great performance and have small boot
times; the big problem is that the porting effort is huge, and that
it has to be mostly repeated for every single application or language.


In sum, starting from an existing project is suboptimal since none
of the projects in the three directions mentioned
were designed to support the key principles we have outlined. We opt
for a clean-slate API design approach, though we do reuse components
from existing works where relevant.
Course borrowing parts of code from existing projects, where relevant,
in order not to reinvent the wheel (eg x86_64 KVM boot).
