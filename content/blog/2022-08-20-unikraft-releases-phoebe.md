---
title: "Unikraft releases v0.10.0 (Phoebe)"
date: "2022-08-20T00:00:00+01:00"
authors: [
  "Alexander Jung",
  "Simon Kuenzer",
  "Marc Rittinghaus",
  "Michalis Pappas",
  "Răzvan Deaconescu",
  "Răzvan Vîrtan"
]
tags: ["announcement"]
---

We're very excited to announce the latest edition of Unikraft, v0.10.0 (Phoebe), and to show off many of the things the community has been working on over the last two months.
There is so many new features and improvements in this release that enhance Unikraft's performance, security and compatibility.

In this blog post, we highlight just some of the new features available in Unikraft.
For a full breakdown, please check out the [changelog](https://github.com/unikraft/unikraft/compare/RELEASE-0.9.0...RELEASE-0.10.0).

### A new abstract microlibrary for POSIX sockets

_This feature was championed by [Alexander Jung](https://github.com/nderjung) and [Marc Rittinghaus](https://github.com/marcrittinghaus) with input from  [Cezar Craciunoiu](https://github.com/craciunoiuc), [Razvan Deaconescu](https://github.com/razvand) and [Paul Ungureanu](https://github.com/ungps)._

In this release we introduce the [`posix-socket`](https://github.com/unikraft/unikraft/tree/staging/lib/posix-socket) microlibrary within the Unikraft core in order to facilitate the use of multiple POSIX-compliant socket implementations which target specific address family (`AF_*`) numbers.

Using the AF number as the index to an implementation, this library provides only a driver API and access to a fast (compile-time optimizable) socket syscall translation layer which redirects the functionality of the call to the `socket` (and friends) syscall to the registered implementation matched against the AF number.
This means that `posix-socket` does not actually implement the underlying socket API but only functions as the POSIX socket interface to applications and other libraries.
The figure below illustrates how the implementation is redirected given a specific AF number.

{{< img
  class="max-w-2xl mx-auto"
  src="/assets/imgs/posix-socket.svg"
  caption="Example of how posix-socket redirects the use of socket() calls to different implementations."
  position="center"
>}}

For example, when using the TCP/IP implementation provided by the library [LwIP](https://github.com/unikraft/lib-lwip), it must register its implementation for `AF_INET` to `posix-socket`.
Therefore, calling `socket(AF_INET, ...` will automatically be redirected to LwIP's implementation.
This has required throwing out the `socket` syscalls exposed by LwIP to favor this new interface (which was completed in [lib-lwip#17](https://github.com/unikraft/lib-lwip/pull/17)) and make the relevant registration call.

Providing `posix-socket` opens up new possibilities for "mixing and matching" AF implementations as well as easing the swapping of an implementation out in favor of another.
Now the developer has the power to easily choose which implementation underlies a particular AF.


#### Usage 

This library allows for the registration of socket interfaces, listed within [`struct posix_socket_ops`](#), and exposes unikernel-wide POSIX prototypes for `socket()`, `accept()`, `bind()`, `listen()`, `connect()`, `send()`, `recv()` and friends in order to access them via a  corresponding AF number.

The implementing library simply needs to register against the desired interfaces with a glue function.
In the following code snippets, we demonstrate the registration of a socket family named `mysock` which implements `AF_INET`:

```c
#include <uk/socket.h>
#include "my_socket.h"

static struct posix_socket_ops mysock_socket_ops = {
        /* The initialization function on socket registration. */
        .init        = mysock_init,
        /* POSIX interfaces */
        .create      = mysock_create,
        .accept4     = mysock_accept4,
        .bind        = mysock_bind,
        .shutdown    = mysock_shutdown,
        .getpeername = mysock_getpeername,
        .getsockname = mysock_getsockname,
        .getsockopt  = mysock_getsockopt,
        .setsockopt  = mysock_setsockopt,
        .connect     = mysock_connect,
        .listen      = mysock_listen,
        .recvfrom    = mysock_recvfrom,
        .recvmsg     = mysock_recvmsg,
        .sendmsg     = mysock_sendmsg,
        .sendto      = mysock_sendto,
        /* vfscore ops */
        .read        = mysock_read,
        .write       = mysock_write,
        .close       = mysock_close,
        .ioctl       = mysock_ioctl,
        .poll        = mysock_poll,
};
```

Each glue function accepts traditional parameters for the POSIX interface apart from the file descriptor, traditionally `int fd` or `int sock`, which has instead been cast as `void *`.
This allows the implementing library to use internal socket file descriptor or reference.

The creation of a socket via `socket()` and `accept()` have  also been cast to return `void *` in line with internal needs of the  implementing library.
This makes sense for implementing libraries which use a structure instead of a file descriptor identification integer.

An additional parameter, `struct posix_socket_driver`, is passed to each interface which can store private data as well as a preferred memory allocator.

The glue for each interface simply needs to call the appropriate method representing the implementation, for example:

```c
static int
mysock_glue_bind(struct posix_socket_driver *d,
                 void *sock, const struct sockaddr *addr,
                 socklen_t addr_len)
{
        struct my_socket *mysock;
        int ret;

        mysock = (struct my_socket *)sock;
        ret = mysock_bind(mysock, addr, addr_len);
        if (ret < 0)
                ret = -errno;

        return ret;
}
```

The library selects the appropriate implementation based on the AF number and registers the required interfaces using a newly exposed macro:

```c
POSIX_SOCKET_FAMILY_REGISTER(AF_INET, &mysock_socket_ops);
```

Implementing libraries can register as many AF numbers as desired or specify new families which are not listed in the `<sys/socket.h>` header.
To access the relevant implementation, the application simply needs to call the `socket()` method with the relevant AF number.

#### Future work

In a future release of Unikraft we intend to implement `AF_UNIX` with a fast in-memory (zero-copy) ring buffer which will allow local socket calls between multiple threads to transfer data at line-rate.


### A new VFS eventpoll API and POSIX event syscalls

_This feature was championed by [Marc Rittinghaus](https://github.com/marcrittinghaus) and [Hugo Lefeuvre](https://github.com/hlef) with extensive input from [Cezar Crăciunoiu](https://github.com/craciunoiuc) and [Răzvan Deaconescu](https://github.com/razvand)._

This release adds a new eventpoll API to [`vfscore`](https://github.com/unikraft/unikraft/pull/484) which makes adaptations to have stubs for the new poll `vnode` operation.
This enables the introduction of the POSIX compatible library `posix-event` which contains a registration and exposure of the implementation for the following new system calls based on the VFS eventpoll API:

 * `poll()`, `ppoll()`
 * `select()`, `pselect()`, `pselect6()`
 * `epoll_create()`, `epoll_create1()`
 * `epoll_ctl()`
 * `epoll_wait()`, `epoll_pwait()`
 * `eventfd()`, `eventfd2()`

In contrast to the current implementation of `poll` and `select` in [`lib-lwip`](https://github.com/unikraft/lib-lwip), file descriptors can be of any type for this implementation as long as they implement the poll VFS operation.
In a similar vein to `posix-socket`, the dependent implementation is looked up based on the file descriptor as its index.

Each VFS file description being watched by an eventpoll is represented with by this change and now within `vfscore` through the proxy `posix-event`.

At the moment, the eventpoll API is included in `vfscore` and tightly based on how the `epoll` system calls work and which data structures they use (e.g., `epoll_event`).

#### Future work

In a future release of Unikraft we intend to break up `vfscore` such that the registration of file descriptors (fds) is facilitated by [its own library](https://github.com/unikraft/unikraft/issues/52) and so the eventpoll API will be moved to this new library and perhaps be, in part, redesigned to be more Unikraft-specific.

The purpose breaking the up the registration of file descriptors and with the internal `vfscore` library which facilitates all POSIX operations on files (`open`, `close`, etc.), is that in some unique cases, unikernels may not necessarily need to deal with these operations specifically but wish to interact with a file descriptor nonetheless (for example, in the case of the newly introduced `posix-socket` library where no file may be used but a file descriptor is required to manage the socket itself).

### musl integration

_This feature was championed by [Simon Kuenzer](https://github.com/skuenzer) and [Dragoș Argint](https://github.com/dragosargint) with extensive input from [Robert Kuban](https://github.com/kubanrob), [Michalis Pappas](https://github.com/michpappas), [Răzvan Deaconescu](https://github.com/razvand), [Răzvan Vîrtan](https://github.com/razvanvirtan), [Cezar Crăciunoiu](https://github.com/craciunoiuc), [Eduard Vintilă](https://github.com/eduardvintila) and [Sergiu Moga](https://github.com/mogasergiu)._

In v0.10.0 we mark the start of a transition for better support of [musl](https://www.musl-libc.org/) via [`lib-musl`](https://github.com/unikraft/lib-musl) to Unikraft.
Musl is a feature-rich and performant standard C library (_libc_) alternative to [newlib](https://github.com/unikraft/lib-newlib).
With this initial introduction of musl into Unikraft s a major milestone for the project as many important OS primitives, including scheduling were refactored to become more generic and general-purpose for the 

The introduction of musl will facilitate the running of applications under binary-compatibility mode (i.e. running unmodified Linux ELFs with Unikraft) where future versions of Unikraft will need only to be statically linked against existing applications.
With Musl, external application and library porting will be easier too.  

{{< alert theme="warning" >}}
#### The road to full musl

Due to extensive changes and the possibility of breaking existing applications and libraries based on newlib, musl support will be featured in a different branch of the [Unikraft core](https://github.com/unikraft/unikraft) (`staging-muslpreview`).
By release [v0.11.0 (Janus)](https://github.com/unikraft/unikraft/milestone/10) due in late September / early October, the `stating-muslpreview` branch will be merged into `staging` branch and then subsequently into `stable` when full support of musl for all supported applications and libraries is achieved.

Changes to the Unikraft core include a rewrite of the internal threading implementation, with musl patches compatible with the rewrite.
{{</ alert >}}


### SMP implementation for x86_64

_This feature was championed by [Marc Rittinghaus](https://github.com/marcrittinghaus) and [Cristian Vijelie](https://github.com/cristian-vijelie) with extensive input from [Sairaj Kodilkar](https://github.com/Sairajkodilkar), [Răzvan Deaconescu](https://github.com/razvand) and [Răzvan Vîrtan](https://github.com/razvanvirtan)._

<!-- We implemented [SMP support for x86/KVM](https://github.com/unikraft/unikraft/pull/502).
This adds basic SMP support related to architecture (x86) and platform (KVM).
Fully functional support will rely on adding SMP-aware scheduling.
 -->
 
In v0.10.0, we also add the x86_64 implementation on top of [Unikraft's abstract the SMP API introduced in v0.9.0](https://unikraft.org/blog/2022-06-13-unikraft-releases-hyperion/#a-new-common-smp-api), which provides the means to initialize and execute code on secondary CPU cores.

#### Implementation

Processor discovery on x86 is done using the [Advanced Configuration and Power Interface (ACPI)](https://wiki.osdev.org/APIC) for which [support in Unikraft was already present](https://github.com/unikraft/unikraft/commit/ba2abe075b85db5ff36157bf05a2607b7523fefa).
In order to enable secondary cores and generate inter-processor interrupts, however, we [added support for the x2APIC]([#link-to-commit](https://github.com/unikraft/unikraft/pull/502/commits/142e84215d3043b259ecb728c4ff36b1511bbbc3)).
In contrast to the xAPIC, the x2APIC extends the processor ID to 32-bits and is accessed solely via Model Specific Registers (MSRs).
There is currently no support for the APIC and xAPIC, which are accessed via memory-mapped I/O.

Currently, the legacy i8259 PICs are still used to process IRQs from timers and devices.
Both the PICs and the processor-local APICs (LAPIC) are active at the same time, where the LAPICs only route SMP-related IRQs.
To transition to full APIC operation, I/O APIC support must be completed, [which is already underway by Google Summer of Code contributor Sairaj Kodilkar](https://github.com/unikraft/unikraft/pull/517).

One of the most important changes for multi-processor support on x86 was the refactoring of the boot and trap initialization code.
Previously, dedicated stacks were used for IRQs, traps, and critical traps (e.g., double fault).
However, there was only one global instance for each of these stacks, which does not work with multi-processor configurations, where each processor needs its own stacks.
We thus extend the code to offer stacks for each processor.
In addition, the boot path was based on the assumption that the processor is starting in a multiboot environment.
However, this does not need to be the case, for example, when running with Firecracker which uses the Linux boot protocol.
Furthermore, when booting secondary cores in a multi-processor setup, these cores start in 16-bit real mode and need a different initialization path.

Obviously, we do not want to introduce and maintain multiple ASM boot trampolines for the various combinations of VMMs and SP/MP setups.
In this release, therefore, we separate the actual initialization of the processor from the boot environment (e.g., multiboot) and add further entry points depending on the architectural state (e.g., 16-bit mode).

We use the interrupt stack table (IST) feature for switching to IRQ and critical trap stacks.
This means when an IRQ or a critical exception (e.g., a double fault) occurs, the CPU automatically switches to the stack pointer configured in the IST entry.
To make this work, we introduced per-processor instances of relevant data structures.

```
CPU ─────┐ per CPU
         ▼
┌──────────────────┐
│       GDT        │     ┌──────────────────┐
├──────────────────┤  ┌─►│       TSS        │
│   null segment   │  │  ├──────────────────┤    ┌────────────────────┐
├──────────────────┤  │  │   IST stack[0] ──┼───►│     IRQ Stack      ├─┐
│    cs  segment   │  │  │   IST stack[1] ──┼────│                  │ │ │
├──────────────────┤  │  │   IST stack[2]   │    │                  │ │ │
│    ds  segment   │  │  │        .         │    │                  │ │ │
├──────────────────┤  │  │        .         │    │                  ▼ │ │
│   tss  segment   ├──┘  │        .         │    └─┬──────────────────┘ │
└──────────────────┘     └──────────────────┘      └────────────────────┘
```

Whereas IST is a useful feature to guarantee a working stack for IRQs and critical exceptions, using it for regular traps (e.g., page faults) can be problematic.
This is because IST always resets the stack pointer to the configured stack base irrespective if the CPU is already using the same stack.
This leads to corruption during nested traps, which is a common scenario during debugging.
For example, GDB regularly performs illegal memory accesses while executing on the trap stack.

We thus removed the dedicated stack for regular traps and corresponding IST entries for now, so that regular traps operate on whatever stack is currently configured.
This allows nested traps but also means that stacks have to be scaled appropriately to not overflow.
However, this has always been the case for Unikraft and as a unikernel, we know our workload better than other OSs and are thus able to scale the stacks more appropriately for the workload at hand.
Nevertheless, we are investigating ways to make sure that stack space is always available for safe exception handling.

Finally, to make the API more consistent with other major APIs in Unikraft, we changed the existing implementation to use `errno` codes instead of the previously used custom ones.


#### Testing

For testing you may set `CONFIG_UKPLAT_LCPU_MAXCOUNT` to something larger than 3 and use the following code as `main`:
```C
#include <stdio.h>
#include <errno.h>
#include <uk/essentials.h>
#include <uk/plat/lcpu.h>
#include <uk/alloc.h>

void myfunc(struct __regs *regs __unused, void *arg __unused) {
        printf("Hello from %ld %d\n", ukplat_lcpu_id(), ukplat_lcpu_idx());
}

void myfunc2(struct __regs *regs __unused, void *arg __unused) {
        printf("Super! %ld %d\n", ukplat_lcpu_id(), ukplat_lcpu_idx());
}

int main(int argc __unused, char *argv[] __unused)
{
        struct uk_alloc *a = uk_alloc_get_default();
        __lcpuidx idx[] = {1, 2};
        void *stack[] = {a->palloc(a, 8) + 8 * __PAGE_SIZE,
                         a->palloc(a, 8) + 8 * __PAGE_SIZE};
        struct ukplat_lcpu_func fn = {myfunc, NULL};
        struct ukplat_lcpu_func fn2 = {myfunc2, NULL};
        unsigned int num = sizeof(idx) / sizeof(__lcpuidx);
        int rc;

        rc = ukplat_lcpu_start(idx, &num, stack,
                               NULL, 0);
        if (unlikely(rc))
                uk_pr_err("Failed start: %d\n", rc);

        rc = ukplat_lcpu_wait(NULL, 0, 0);
        if (unlikely(rc))
                uk_pr_err("Failed wait: %d\n", rc);

        rc = ukplat_lcpu_run(NULL, 0, &fn, 0);
        if (unlikely(rc))
                uk_pr_err("Failed run: %d\n", rc);

        rc = ukplat_lcpu_run(NULL, 0, &fn2, 0);
        if (unlikely(rc))
                uk_pr_err("Failed run: %d\n", rc);

        rc = ukplat_lcpu_wait(NULL, 0, 0);
        if (unlikely(rc))
                uk_pr_err("Failed wait: %d\n", rc);

        return 0;
}
```

You can then enable SMP with `-smp cores=N` via `qemu-system-x86_64`:

```shell
sudo qemu-system-x86_64 \
    -k de -m 1024 \
    --kernel build/unikraft_kvm-x86_64 \
    -nodefaults \
    -nographic \
    -vga none \
    --device sga \
    -s -serial stdio \
    --enable-kvm \
    -smp cores=3
```

{{< alert theme="info" >}}
**Note**: Output will be totally out of order as the cores output characters in parallel ;-)
{{</ alert >}}

#### Future Work

On x86, we currently use the legacy i8259 Intel PICs to process IRQs from timers and I/O devices.
However, for SMP using the APIC is required.
This initial introduction of SMP for x86 keeps both the PICs and the APIC active at the same time, only routing SMP-related IRQs through the APIC.

In a future release, we intend to transition the x86 platform to a modular design comparable to the GICv2 / GICv3 drivers used on ARM and transparently use PICs **OR** APIC.
However, this will require more extensive changes also for pure APIC operation (e.g., 256 trap vectors, support for I/O APIC, etc.).
Finally, we intend to map the use of SMP against the internal scheduling system such that multi-threaded applications can offload work onto secondary cores.

### Paging support on arm64 according to VMSAv8-64

_This feature was championed by [Michalis Pappas](https://github.com/michpappas) with extensive input from [Marc Rittinghaus](https://github.com/marcrittinghaus), [Razvan Virtan](https://github.com/razvanvirtan), [Stefan Jumarea](https://github.com/StefanJum) and [Maria Sfiraiala](https://github.com/mariasfiraiala)._

This release comes with the implementation of Unikraft's paging API for ARM64, according to VMSAv8-64.

In Unikraft, we support the lower 256TiB VA range, controlled by `TTBR0`.
This should provide more than enough memory for unikernel use-cases and allows Unikraft to run on any Exception Level.
Of the above, the region between `0x0000_ff80_0000_0000` and `0x0000_ffff_ffff_ffff` is reserved, and is used to directly map the PA range between `0x0000_0000_0000_0000 - 0x0000_007f_ffff_ffff`, i.e. the first 512GiB.
This is used internally by the paging subsystem to provide fast translation of the page tables.
Any memory controlled by `TTBR1`, that is `VA[55] == 1`, is considered invalid.
We choose 48-bit addressing with a 4KiB granule.
This is the most commonly used configuration, and should cover most deployments.

KVM is also updated with the following paging-related changes:

- [**Enforcing `W^X` protection**](https://github.com/unikraft/unikraft/commit/f21273f4a58738c556b01687cca5eda8ba3606bb):  Initializing the page tables at compile-time uses `RWX` permissions on the entire kernel image, as we cannot know the boundaries of each section before compile.
Update the PTEs of different sections with the correct protections at runtime.
This security feature can be enabled by setting `ENFORCE_W_XOR_X` KConfig option.
- **Simplified page-table generation process**:  By replacing runtime generation using complex code with compile-time generation using assembler macros, this has greatly simplified the generation of all page tables on KVM in x86.
- **Heap page initialization**: Since there is no support for virtual address space management and on-demand paging yet, assign all available memory to the heap.


### Enhancements to POSIX user syscalls

_This feature was championed by [Marc Rittinghaus](https://github.com/marcrittinghaus) with extensive input from [Stefan Jumarea](https://github.com/StefanJum) and [Razvan Deaconescu](https://github.com/razvand)._

In this release, we clean up methods found within the internal library [`posix-user`](https://github.com/unikraft/unikraft/tree/staging/lib/posix-user):

1. Separating user/passwd and group related functions;
2. Ensuring consistent implementation schemes (e.g., using static global variable instead of iterators);
3. Fixing minor formatting issues; and,
4. Harmonizing the order in which functions are implemented and referenced.

From a functional perspective this release does the following changes:

1. Adds the following functions or their implementation: `login_r`, `getpwnam_r`, `getpwuid_r`, `getgrgid_r`, `getgrouplist`;
2. Fixes a bug in `getgrnam_r` where not enough memory is allocated to accommodate the array of group name pointers;
3. Returns proper default values (e.g., `UK_DEFAULT_GID=0`) instead of just `0`. Although practically this does not make a difference; and,
4. Adds checks to all functions to accept only valid user/group IDs as it was already done for `setresgid`.

As an additional note, whereas all functions make directly use of the fact that there is only a single passwd/group entry with fixed values, we do not assume the same in the `getgr_r` and `getpw_r` functions.
This is due to the fact that these two functions are more complex to implement and we want to make sure these do not need to be changed IFF we would have multiple entries at some point (e.g., impersonation).

#### Future Work

There are the `capget` and `capset` system calls which are currently implemented in `posix-user` although they are probably better moved to [`posix-process`](https://github.com/unikraft/unikraft/tree/staging/lib/posix-process) as they are related to the capabilities of threads.
For now, we keep them here so that we do not collide with changes to `posix-process` that are about to be published by [Simon Kuenzer](https://github.com/skuenzer] for musl compatibility.


### Community Activities

Unikraft is part of [Google Summer of Code 2022](https://summerofcode.withgoogle.com/) (GSoC’22), a global online program focused on bringing new contributors into open source software development.
Our 3 students are currently working on their GSoC projects:
- [Sairaj Kodilkar](https://github.com/Sairajkodilkar): SMP Synchronization in Unikraft
- [Maria Sfîrăială](https://github.com/mariasfiraiala): Shadow Stack Support in Unikraft
- [Xiangyi Meng](https://github.com/xymeng16): Isolating Unikraft with Intel SGX

See their latest blog posts with updates: https://unikraft.org/blog/

Also, we continued our hackathons series with the [Unikraft Aachen Hackathon](https://unikraft.org/community/hackathons/2022-06-aachen/) during June 25-26, 2022, and presented to participants the exciting world of unikernels and Unikraft.
Participants were able to solve technical challenges and make their first PRs to the Unikraft GitHub repositories.

#### Unikraft Summer of Code

We’re thrilled to announce [Unikraft Summer of Code 2022 (USoC’22)](https://unikraft.org/community/hackathons/usoc22/) a unique 10 days workshop targeting students, professionals and hobbyists in operating systems, low-level programming and systems hacking.
USoC’22 starts on Monday, August 29, 2022.

Participants from all over the world will get hands-on experience in building, running, configuring, evaluating, improving and enhancing Unikraft, an open-source unikernel SDK allowing the deployment of fast specialized applications.

Session contents [will be publicly available](https://github.com/unikraft/docs/tree/main/content/en/community/hackathons/usoc22) in the spirit of open source.
Anyone is invited to use them and find more about Unikraft and unikernels.

If you’re up to the challenge and want to expand your knowledge in Operating Systems and unikernels and engage in the Unikraft community, then apply to the workshop by filling [this Eventbrite form](https://www.eventbrite.com/e/unikraft-summer-of-code-2022-tickets-394973716017).
Applications to the workshop close on Saturday, August 27, 2022, 11pm CEST.
We will notify all responders on Sunday, August 28, 2022.
For questions and additional information, please join us on [Discord](https://bit.ly/UnikraftDiscord).
See you there!