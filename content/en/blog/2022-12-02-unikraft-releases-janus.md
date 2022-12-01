---
title: "Unikraft releases v0.11.0 (Janus)"
date: "2022-12-01T00:00:00+01:00"
authors: [
  "Alexander Jung",
  "Simon Kuenzer",
  "Florin Postolache",
  "Michalis Pappas",
  "Răzvan Deaconescu",
  "Răzvan Vîrtan"
]
tags: ["announcement"]
---

We are thrilled to announce the new edition of Unikraft, v0.11.0 (Janus)!

This release is the result of around 3 months of hard work in the entire community, with a focus on integrating the long awaited musl support.

In this blog post, we highlight just some of the new features available in Unikraft.  For a full breakdown, please check out the [changelog](https://github.com/unikraft/unikraft/compare/RELEASE-0.10.0...RELEASE-0.11.0).


## New Scheduling API

_This feature was championed by [Simon Kuenzer](https://github.com/skuenzer) with extensive support from [Răzvan Deaconescu](https://github.com/razvand), [Adina Smeu](https://github.com/adinasm), [Dragoș Argint](https://github.com/dragosargint), [Cezar Crăciunoiu](https://github.com/craciunoiuc) and [Florin Postolache](https://github.com/maniatro111)._

We are releasing a revised [`uksched` API](https://github.com/unikraft/unikraft/tree/staging/lib/uksched). The driving motivation for the design was to remove unneeded functionality, simplification, and introducing the concept of separating thread creation from scheduling. Threads are independently handled instances with references to a stack and thread-local storage (TLS). They can be assigned, unassigned, and reassigned to a scheduler instance. A `uksched` thread is minimal by design and executes only a non-returning thread function. Extended functionality such as POSIX-typical thread properties, thread IDs, and APIs are to be implemented on top of it, for example by `pthread-embedded` or `musl`.

The revision has also enabled [the `clone` system call](https://github.com/unikraft/unikraft/pull/566) which was needed by`musl`.  With the revision, the API for handling context, extended context (floating point, vector units, ...) and TLS/TCB are provided by a new architecture library called [`libcontext`](https://github.com/unikraft/unikraft/pull/535).

The following highlights are implemented by `libcontext`: 
- Support for lightweight contexts (threads) with and without TLS/TCB
- Support for lightweight contexts (threads) that run only ISR-safe code
- Support for user-defined stack sizes
- Support for embedding custom TCBs by third-party libraries (e.g., libc, pthread-embedded)


## Musl support, POSIX-process, and the `clone` system call

_This feature was championed by [Simon Kuenzer](https://github.com/skuenzer) and [Dragoș Argint](https://github.com/dragosargint) with extensive support from [Răzvan Deaconescu](https://github.com/razvand), [Adina Smeu](https://github.com/adinasm), [Florin Postolache](https://github.com/maniatro111), [Maria Sfîrăială](https://github.com/mariasfiraiala), [Ștefan Jumărea](https://github.com/StefanJum), [Robert Kuban](https://github.com/kubanrob), [Delia Pavel](https://github.com/DeliaPavel), [Eduard Vintilă](https://github.com/eduardvintila), [Cezar Crăciunoiu](https://github.com/craciunoiuc), [Marco Schlumpp](https://github.com/craciunoiuc), [Răzvan Vîrtan](https://github.com/razvanvirtan) and [Sergiu Moga](https://github.com/mogasergiu)._

We are proudly announcing that with this release [`musl`](https://github.com/unikraft/lib-musl) is becoming our default libc for application builds. `musl` replaces the `newlib` and `pthread-embedded` pair. Our goal is a vanilla integration that leaves `musl`'s codebase untouched as much as possible. Updating the library to a newer version in the future should be as simple as possible.
Instead of doing system calls, our integration is utilizing the `syscall_shim` library: complex but automatic macros allow us to replace every system call invocation with a direct function call at compile time. This required a fairly complete system call interface: We refactored posix-process to provide proper handling of threads and process IDs, and an implementation of the `clone` system call which is used by `musl` to create threads behind the POSIX thread API.

The update to `musl` also required changes to [`lwip`](https://github.com/unikraft/lib-lwip). The internal [`nolibc`](https://github.com/unikraft/unikraft) library was updated for better compatibility and to support the required changes for `musl` in the core repository.

We updated the `kraft.yaml` file for applications to use `musl` as the default libc:

- [`app-helloworld-cpp`](https://github.com/unikraft/app-helloworld-cpp)
- [`app-redis`](https://github.com/unikraft/app-redis)
- [`app-nginx`](https://github.com/unikraft/app-nginx)
- [`app-python3`](https://github.com/unikraft/app-python3)
- [`app-micropython`](https://github.com/unikraft/app-micropython)
- [`app-sqlite`](https://github.com/unikraft/app-sqlite)

To use `musl` in your Unikraft application, update the `kraft.yaml` file to feature `musl` as a dependency (remove `newlibc` and / or `pthread-embedded` if present):

```
libraries:
  [...]
  musl:
    version: stable
```

Or update the application `Makefile`:

```
[...]
UK_LIBS ?= $(PWD)/../../libs
LIBS := $(UK_LIBS)/musl
[...]
```

## libc Tests

_This feature was championed by [Florin Postolache](https://github.com/maniatro111) with extensive input from [Simon Kuenzer](https://github.com/skuenzer), [Delia Pavel](https://github.com/DeliaPavel) and [Răzvan Deaconescu](https://github.com/razvand)._

We added [`libc-test`](https://wiki.musl-libc.org/libc-test.html) as an external library for Unikraft in [the `lib-libc-test` repository](https://github.com/unikraft/lib-libc-test). `libc-test` tests the standard C library API. We updated `libc-test` to make use of the `uktest` framework and test standard C library implementations. We used it to test [`musl`](https://github.com/unikraft/lib-musl), the new default libc for Unikraft and [`nolibc`](https://github.com/unikraft/unikraft).

## KraftKit -- Our New CLI Companion Tool

_This feature was championed by [Alexander Jung](https://github.com/nderjung) with extensive support from [Cezar Crăciunoiu](https://github.com/craciunoiuc/), [Gabriel Mocanu](https://github.com/gabrielmocanu), [Ștefan Jumărea](https://github.com/StefanJum), [Costi Răducanu](https://github.com/consra), [Andrei Albișoru](https://github.com/albisorua)._

We are excited to announce the release of [KraftKit](https://kraftkit.sh), our new companion tool for building Unikraft unikernels!  KraftKit aims to ease the use of building and using Unikraft, streamlining the process of retrieving relevant sources and abstracting the internals of Unikraft so that you can focus on building your application as a unikernel.

### Getting Started

You can get started today with KraftKit by installing via:

```shell
$ curl --proto '=https' --tlsv1.2 -sSf https://get.kraftkit.sh | sh
$ kraft --help
```
```
    .
   /^\     Build and use highly customized and ultra-lightweight unikernels.
  :[ ]:
  | = |
 /|/=\|\   Documentation:    https://kraftkit.sh/
(_:| |:_)  Issues & support: https://github.com/unikraft/kraftkit/issues
   v v
   ' '

USAGE
  kraft [SUBCOMMAND] [FLAGS]

BUILD COMMANDS
  build         Configure and build Unikraft unikernels
  clean         Remove the build object files of a Unikraft project
  configure     Configure a Unikraft unikernel its dependencies
  fetch         Fetch a Unikraft unikernel's dependencies
  menu          Open's Unikraft configuration editor TUI
  prepare       Prepare a Unikraft unikernel
  properclean   Completely remove the build artifacts of a Unikraft project
  set           Set a variable for a Unikraft project
  unset         Unset a variable for a Unikraft project

PACKAGING COMMANDS
  pkg           Package and distribute Unikraft unikernels and their dependencies
  pkg list      List installed Unikraft component packages
  pkg pull      Pull a Unikraft unikernel and/or its dependencies
  pkg source    Add Unikraft component manifests
  pkg update    Retrieve new lists of Unikraft components, libraries and packages

RUNTIME COMMANDS
  ps            List running unikernels
  rm            Remove one or more running unikernels
  run           Run a unikernel
  stop          Stop one or more running unikernels

FLAGS
  -h, --help   help for kraft
```

### On Rewriting It in Go

Our companion tool for Unikraft started life with an initial implementation written in Python.  [The original version](https://github.com/unikraft/kraft) (now known as `pykraft`) has been a great adventure building and using over the last 2 years.  However, it has had many limitations which maintainers of the Unikraft project believe limits its potential.  As a result, we have spent the last few months re-building it from the ground-up in Go, now designed following the lessons we have learnt from this original project.

Apart from speed, size and efficiency, one of the main reasons for the reimplementation has been the ecosystem that Unikraft finds itself situated in.  Many of the tools and services which Unikraft finds itself well-suited for are written in Go.  Many of the usecases for manipulating unikernels are represented as libraries which are written in Go and many of the APIs for managing services in the cloud have APIs which are more rich in nature, and are written or provided in Go.  These possible integrations are listed below under future plans.

The original `pykraft` project will always remain open-source and accessible to the community.  However, maintainers of the Unikraft project will no longer maintain the project.  Instead, the project today can only serve existing use cases outside of being an official command-line companion tool for building Unikraft, including: usage for research (such as with [FlexOS](https://github.com/project-flexos)) as well as Python bindings for building Unikraft unikernels programmatically.  Note that since `pykraft` will no longer receive updates to be compatible newer specification versions its last acceptable `kraft.yaml` specication version which is v0.5.  Newer versions of Unikraft's core may also be incompatible.  We will still accept valid PRs which make the repository more library-friendly as we are always seeking for contributors!

For anyone who is using the original `kraft` program, please reach out to us so we can help you during this transition.  KraftKit has been designed to feel very much like the original `kraft` utility but with re-implementation and design aimed at making the workflow easier to use. Importantly, all original `kraft.yaml` files are compatible.

### Future Plans

We have a lot of plans and are very excited for the future of KraftKit towards making Unikraft easier to use and useful for developers and this journey has already begun.  Some highlights of what's to come:

* Integration into major software build systems, e.g. [Packer](https://packer.io) and [CloudFoundry BOSH](https://bosh.io);
* Using the built in [machine monitor](https://pkg.go.dev/kraftkit.sh/machine) to facilitate runtime integrations, e.g. with Kubenetes and [Nomad](https://nomadproject.io).


## Memory Tagging Extension (MTE)

_This feature was championed by [Michalis Pappas](https://github.com/michpappas/) with extensive support from [Cezar Crăciunoiu](https://github.com/craciunoiuc/)  and [Marc Rittinghaus](https://github.com/marcrittinghaus)._

Memory tagging is a hardware protection against memory safety violations in the scope of both spatial (eg buffer overflows) and temporal (eg use-after-free) safety.

The idea behind MTE is to restrict pointer access to predefined blocks of memory. This is done by tagging memory regions and pointers, and check for match upon access. A mismatch generates a Tag Check Fault (TCF). Specifically, the architecture introduces the concepts of:

    Physical Address Tags, which are and are stored into the upper bits of pointers.
    Allocation Tags, which tag blocks of memory. These are stored into the Tag PA Space, an IMPLEMENTATION
    DEFINED memory space that is logically different from the Data PA Space.

Combined together, these ensure that only memory within a given block is accessed. For instance, in the case of a buffer overflow, memory access outside the allocated bufer will cause a tag mismatch. Similarly, assuming that freeing memory re-tags the freed region, a use-after-free attempt will also cause a tag mismatch. Other accesses like prefetches, cache maintenance, translation table walks, accesses to the tag PA space, etc are always tag unchecked.

MTE requires support from the operating system. For example, addresses returned by malloc() must be tagged. Notice that the tags are only 4-bits wide, ie tags can have 16 possible values. Consequently, the same tag may be used on different regions on a given time, or that a region may have different tag values during time. This release introduces instrumentation to ukalloc. This is a fairly simple implementation that tags memory on uk_malloc_ifpages(), uk_free_ifpages(), and uk_posix_memalign_ifpages(). The region tagged is equal to the size requested by the user aligned to the MTE granule, ie 16 bytes. Any attempt to access memory outside that region, including allocation metadata, will cause a fault.

When it comes to hardware support, until recently MTE has been only known to be implemented in emulators QEMU, and in Arm FVP. Lately vendor support for MTE has started to appear on the news. Notable examples include the DSU-110 DynamIQ cluster from Arm for Armv9, and Samsung's Exynos 2200.

## Community Activities

### Reaching 1k+ Stars and 500 Discord Members!

October was an interesting month for many reasons. One of those is that we have been able to reach an exciting threshold: we are beyond 1k Github stars on our [main repository](https://github.com/unikraft/unikraft.git)!  In addition to this, our [Discord server](https://bit.ly/UnikraftDiscord) reached 500 members!  A huge thank you and warm welcome to all stargazers, members and new contributors of the project!

We are very happy because we can see that Unikraft experienced a clear acceleration in the stars number in the last few months. More about this in [the accompanying blog post](https://unikraft.org/blog/2022-10-14-unikraft-reaches-1k-github-stars/).

### Unikraft Community Meetup

This autumn we had the opportunity to organize the first in-person meeting of the Unikraft community members. The event was organized in the shape of a three-day trip to Sinaia, Romania between the 14th and the 16th of October.

The trip was a great opportunity for both technical talks about the future of Unikraft and for the community members to get to know each other more.

For details about this event, check the [related blogpost](https://unikraft.org/blog/2022-10-14-unikraft-community-meetup/).

### Hacktoberfest

In October, one of our traditional Saturday hackathons was a bit different, since it was accepted to be part of [Hacktoberfest 2022](https://hacktoberfest.com/).

The event was a hybrid one, with participants being able to join both remote, on [our Discord server](https://bit.ly/UnikraftDiscord), or in person at University POLITEHNICA of Bucharest.

You can find more insides about the hackathon outcomes in the [Hacktoberfest 2022 blogpost](https://unikraft.org/blog/2022-10-08-unikraft-hacktoberfest/). 

### Munich Hackathon

With awesome support from [Technische Universität München (TUM)](https://www.tum.de/en/) we organized the [Unikraft Munich Hackathon](https://unikraft.org/community/hackathons/2022-10-munich/), a two days event (October 22-23, 2022) of technical work on Unikraft. Around 30 active participants took part in tutorials and then on [hackathon practical items](https://github.com/orgs/unikraft/projects/29/views/1) that resulted in PRs and issues for the project.

The hackathon took place in person, at TUM, with support being provided both live and via the Unikraft Discord server.

You can find more about the Munich Hackathon on [our blogpost](https://unikraft.org/blog/2022-10-25-unikraft-munich-2022/).
