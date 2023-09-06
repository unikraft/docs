---
title: Architecture
date: 2020-01-11T14:09:21+09:00
draft: false
weight: 202
---

## Unikraft Architecture

In contrast to classical OS work, which can be roughly split between monolithic
kernels (with great performance) versus micro-kernels that provide great
isolation between OS components (at the expense of performance), our work
embraces both the monolithic design (no protection between components) and the
modularity that micro-kernels advocated.

We use modularity to enable specialization, splitting OS functionality into
fine-grained components that only communicate across well-defined API
boundaries. Our key observation is that we can obtain performance via careful
API design and static linking, rather than short-circuiting API boundaries for
performance. To achieve the overarching principle of modularity, Unikraft
consists of two main components:

* **Micro-libraries** are software components which implement one of the core
  Unikraft APIs; we differentiate them from libraries in that they have minimal
  dependencies and can be arbitrarily small, e.g., a scheduler.  All
  micro-libraries that implement the same API are interchangeable. One such API
  contains multiple memory allocators that all implement the ukalloc interface.
  In addition, Unikraft supports libraries that can provide functionality from
  external library projects ([OpenSSL](https://github.com/unikraft/lib-openssl),
  [musl](https://github.com/unikraft/lib-musl),
  [Protobuf](https://github.com/unikraft/lib-protobuf), etc.), applications
  ([SQLite](https://github.com/unikraft/lib-sqlite),
  [Redis](https://github.com/unikraft/lib-redis), etc.), or even platforms
  (e.g., [Solo5](https://github.com/unikrat/plat-solo5), Firecracker, Raspberry Pi 3).

* **Build system** which provides a [Kconfig-based
  menu](/docs/usage/advanced/kconfig/) for users to select which micro-libraries
  to use in an application build, for them to select which platform(s) and CPU
  architectures to target, and even configure individual micro-libraries if
  desired. The build system then compiles all of the micro-libraries, links
  them, and produces one binary per selected platform.

The figure below shows Unikraft's architecture.  All components are
micro-libraries that have their own `Makefile` and Kconfig configuration files
(`Config.uk`), and so can be added to the unikernel build independently of each
other.  APIs are also micro-libraries that can be easily enabled or disabled via
a Kconfig menu; unikernels can thus compose which APIs to choose to best cater
to an application's needs (e.g., an RCP-style application might turn off the
uksched API in order to implement a high performance, run-to-completion event
loop).

{{< img
  class="mx-auto"
  src="/assets/imgs/unikraft-architecture.svg"
  title="Overview of Unikraft's architecture"
  caption="All components are micro-libraries that have their own Makefile and Kconfig configuration files, and so can be added to the unikernel build independently of each other.  APIs are also micro-libraries that can be easily enabled or disabled via a Kconfig menu; unikernels can thus compose which APIs to choose to best cater to an application's need."
  position="center"
>}}

Unikraft's architecture also includes components that add [POSIX
support](/docs/features/posix-compatibility), making it relatively easy to
support existing applications. Unikraft can improve the performance of
applications in two ways:

1. Un modified applications, by eliminating syscall overheads, reducing image
   size and memory consumption, and by choosing efficient memory allocators.

2. Specialization, by adapting applications to take advantage of lower level
   APIs wherever performance is critical (e.g., a database application seeking
   high disk I/O throughput).

The ability to easily swap components in and out, and to plug applications in at
different levels presents application developers with a wide range of
optimization possibilities.  To begin with, unmodified applications (e.g. "Hello
World" and NGINX) can use the posix-compatibility layer with
[`musl`](https://github.com/unikrarft/lib-musl) (1️⃣ in the figure above) or
[`nolibc`](https://github.com/unikraft/unikraft/tree/staging/lib/nolibc),
transparently getting low boot times, lower memory consumption and improved
throughput because of the lack of syscall overheads, as Unikraft syscalls are
effectively function calls.

Likewise, the application developer can easily select an appropriate memory
allocator via [`ukalloc`](https://github.com/unikraft/unikraft/tree/staging/lib/ukalloc) (6️⃣) to obtain maximum performance, or to use multiple different ones
within the same unikernel (e.g., a simple, fast memory allocator for the boot
code, and a standard one for the application itself).

Developers interested in fast boot times could further optimize the unikernel by
providing their own boot code (5️⃣) to comply with the
[`ukboot`](/docs/develop/booting/) API; in [Unikaft EuroSys'21
paper](https://dl.acm.org/doi/abs/10.1145/3447786.3456248) we show experiments
with two boot code micro-libraries, one with static memory pages and one with
dynamic ones, showing the trade-off between boot time and memory allocation
flexibility.

For network-bound applications, the developers can use the standard socket
interface (2️⃣) or the lower level, higher performance
[`uknetdev`](https://github.com/unikraft/unikraft/tree/staging/lib/uknetdev) API
(7️⃣) in order to significantly improve throughput; we will discuss this API in
greater detail below.  Similarly, disk-bound applications such as databases can
follow a standard path through the
[`vfscore`](https://github.com/unikraft/unikraft/tree/staging/lib/vfscore)
micro-library (3️⃣), or optimize throughput by oding against the ukblock API
(8️⃣).  Schedulers are also pluggable (4️⃣), and each CPU core can run a
different scheduler (even if [multi-core support is still work in
progress](https://github.com/unikraft/unikraft/pull/244)).
