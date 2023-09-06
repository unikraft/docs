+++
title = "Xen Project Celebrates Unikraft Unikernel Project's One Year Anniversary"
date = "2019-01-31T00:00:00+01:00"
tags = ["Xen"]
+++

It has been one year since the Xen Project introduced Unikraft as an
incubator project. In that time, the team has made great strides in
simplifying the process of building unikernels through a unified and
customizable code base.

Unikraft is an incubation project under the Xen Project, hosted by the
Linux Foundation, focused on easing the creation of building
unikernels, which compile source code into a lean operating system
that only includes the functionality required by the application
logic. As containers increasingly become the way cloud applications
are built, there is a need to drive even more efficiency into the way
these workloads run. The ultra lightweight and small trusted compute
base nature of unikernels make them ideal not only for cloud
applications, but also for fields where resources may be constrained
or safety is critical.

Unikraft tackles one of the fundamental downsides of unikernels:
despite their clear potential, building them is often manual,
time-consuming work carried out by experts. Worse, the work, or at
least chunks of it, often needs to be redone for each target
applications. Unikraft’s goal is to provide an automated build system
where non-experts can easily and quickly generate extremely efficient
and secure unikernels without having to touch a single line of
code. Further, Unikraft explicitly supports multiple target platforms:
not only virtual machines for Xen and KVM, but also OCI-compliant
containers and bare metal images for various CPU architectures.

Over the last year the lead team at NEC Laboratories Europe along with
external contributors from companies like ARM and universities such as
University Politehnica of Bucharest have made great strides in
developing and testing Unikraft’s base functionality, including
support for a number of CPU architectures, platforms, and operating
system primitives. Notable updates include support for ARM64.

The Unikraft community continues to grow. Over the last year, we’ve
seen impressive momentum in terms of community support and
involvement:

* Contributions from outside the project founders (NEC) now make up 25%
of all contributions.

* Active contributors rose 91%, from 2 contributors to 23.

The initial NEC code contribution was around 86KLOC: since then around
34KLOC of code have been added and/or modified.  An upcoming milestone
for the project is the Unikraft v0.3 release, which will ship in
February.

This release includes:

* Xenstore and Xen bus support
* ARM32 support for Xen
* ARM64 support for QEMU/KVM
* X86_64 bare metal support
* Networking support, including an API that allows for high-speed I/O frameworks (e.g., DPDK, netmap)
* A lightweight network stack (lwip)
* Initial VFS support along with an a simple but performant in-RAM filesystem

We are very excited about this coming year, where the focus will be on
automating the build process and supporting higher-layer functionality
and applications:

* External standard libraries: musl, libuv, zlib, openssl, libunwind, libaxtls (TLS), etc.
* Language environments: Javascript (v8), Python, Ruby, C++
* Frameworks: Node.js, PyTorch, Intel DPDK
* Applications: lighttpd, nginx, SQLite, Redis, etc.

Looking forward, in the first half of 2019 Unikraft will be
concentrating its efforts towards supporting an increasing number of
programming languages and applications and towards actively creating
links to other unikernel projects in order to ensure that the project
delivers on its promise. Stay tuned for what’s in store. If you want
to take Unikraft out for a spin, to contribute or to simply find out
more information about Unikraft please head over to the project’s
[website](http://unikraft.org).

Also, if you are attending FOSDEM, February 2nd and 3rd, please stop
by room
[AW1.121](https://archive.fosdem.org/2019/schedule/room/aw1121/) for
the talk “Unikraft: Unikernels Made Easy,” given by [Simon
Kuenzer](https://archive.fosdem.org/2019/schedule/speaker/simon_kuenzer/). Simon,
a senior systems researcher at NEC Labs and the lead maintainer of
Unikraft, will be speaking all about Unikraft and giving a
comprehensive overview of the project, where it’s been and what’s in
store.

Want to learn more about Unikraft and connect with the Xen community
at large? Registration for the annual [Xen Project Developer and Design
Summit](https://events.linuxfoundation.org/events/xensummit-2019/) is open now! Check out information on sponsorships, speaking
opportunities and more [here](https://events.linuxfoundation.org/events/xensummit-2019/).
