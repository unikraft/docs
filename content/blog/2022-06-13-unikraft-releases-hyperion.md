+++
title = "Unikraft releases v0.9.0 (Hyperion)"
date = "2022-06-13T00:00:00+01:00"
authors = [
  "Alexander Jung",
  "Simon Kuenzer",
  "Marc Rittinghaus",
  "Răzvan Vîrtan",
  "Michalis Pappas",
  "Razvan Deaconescu"
]
tags = ["announcement"]
+++

We're excited to announce Unikraft v0.9.0 (Hyperion) and to show off many of the things the community has been working on over the last two months.

In this blog post, we highlight some of the new features available in Unikraft.
A full list of features can be found [on the releases page for Hyperion](/releases/v0.9.0)

### A new common SMP API

_This feature was championed by [Marc Rittinghaus](https://github.com/marcrittinghaus) with extensive input from [Michalis Pappas](https://github.com/michpappas), [Răzvan Vîrtan](https://github.com/razvanvirtan), [Cristian-Mihai Vijelie](https://github.com/cristian-vijelie) and [Simon Kuenzer](https://github.com/skuenzer)._

Unikraft has introduced a new API which provides an abstraction over all the architecture-dependent hardware details.
It enables platforms and applications to easily start secondary cores and let them execute a user-defined entry function.
Furthermore, with `ukplat_lcpu_run()` remote CPUs can be instructed at any time to interrupt execution and run an arbitrary function.
This makes it easy, for example, to temporarily freeze CPUs for debugging or synchronize CPUs for shutdown and restart.
Already, [`arm64`](https://github.com/unikraft/unikraft/pull/373) has implemented this API with on-going work for introducing [`x86_64`](https://github.com/unikraft/unikraft/pull/244).
This new API makes it easy to add SMP support for future architectures and standardizes the use of SMP within Unikraft for true multi-core support.

Multi-core support is a heavily requested feature for Unikraft and this new API takes strides in making this a reality.

#### Implementing the API for a new architecture

Internally, Unikraft represents every logical CPU (LCPU) in the system as `struct lcpu`.
Besides holding information common to all architectures, this structure is fully extensible, making it easy to accommodate future architecture specializations and extensions.
On ARM64, CPU structures are initialized during the platform setup with information read from the device tree.
While the hardware itself refers to CPUs via architecture-dependent identifiers, the multiprocessor API harmonizes differences by referring to CPUs with just a sequential index.
With this abstraction, users of the API can address CPUs in a generic way without having to consider the platform's peculiarities of CPU addressing.
Nevertheless, if  the need arises, functions for translating between hardware IDs and indices are available.

Architecture implementations must provide the following functions as described in [`/plat/common/include/uk/plat/common/lcpu.h`](https://github.com/unikraft/unikraft/blob/RELEASE-0.9.0/plat/common/include/uk/plat/common/lcpu.h) which then hook into:

- `lcpu_arch_mp_init` which is executed on the bootstrapping processor (BSP) by `lcpu_mp_init()` during system boot to allow architecture-dependent initialization of the multi-processor functionality.
  This function should perform CPU enumeration and allocate LCPUs using `lcpu_alloc()`.
  The first LCPU must be the BSP itself but it does not need to be explicitly allocated).
- `lcpu_arch_init()` which is executed on the a CPU when calling `lcpu_init()`.
  This function can be used to initialize extended CPU features or setup traps and interrupts for the newly started CPU.
- `lcpu_arch_id()` which queries the hardware ID of the CPU which executes the function using architecture-dependent instructions / facilities.
- `lcpu_arch_start()` which signals a certain CPU to begin with the startup sequence (e.g., by issuing a special interprocessor interrupt (IPI)).
- `lcpu_arch_post_start()` (optional) if the architecture defines `LCPU_ARCH_MULTI_PHASE_STARTUP` and which is called in `ukplat_lcpu_start()` after all LCPUs specified in the call have received an `lcpu_arch_start()` call.
  This can be used to speed up starting multiple CPUs at the same time on some architectures lik x86.
- `lcpu_arch_run()` which queues a function supplied to `ukplat_lcpu_run()` to the given LCPU and signals the corresponding CPU to wake up and dispatch queued functions.
  The common code expects this to be triggered by a special IPI whose vector is defined by the platform and is saved in `lcpu_run_irqv`.
- `lcpu_arch_wakeup()` which forces the given CPU to wake up from a temporary halt state.
  The common code expects this to be triggered by a special IPI whose vector is defined by the platform and is accessible in `lcpu_wakeup_irqv`.
  The architecture may decide to implement a very lightweight IRQ handler for this vector which just acknowledges the IRQ and returns.
  However, in that case, the architecture must ensure that no other handlers will be registered for this vector.

The platform boot code (usually in `setup.c`) should call `lcpu_init()` to setup the current BSP and afterwards call `lcpu_mp_init()` to initialize multi-processor functionality including CPU discovery. The boot code should crash the system if any of these initializations fail. If `lcpu_init()` fails on a secondary CPU, the CPU should be put into a halt state using `lcpu_halt()` with an error code indicating the reason. Secondary CPUs must not call `lcpu_mp_init()`.

For more information on this feature:

* Checkout the corresponding [pull request](https://github.com/unikraft/unikraft/pull/469) which highlights details.


### `ukstore`: Unikraft Information Storage

_This feature was championed by [Cezar Craciunoiu](https://github.com/craciunoiuc) with extensive input from [Simon Kuenzer](https://github.com/skuenzer)._

As part of this release, we have introduced the first part of a new Unikraft-internal information storage.
It has minimal dependencies, allows link-time optimizations and comes as an internal library.
It provides a standard way of passing information, setting run-time configurations, and providing action triggers via getter and setter functions from a central tree-like structure of storage entries.
The role of `ukstore` has many future applications for the project, for example: [registering monitoring hooks and counters through Unikraft](https://github.com/unikraft/unikraft/pull/279); acting as backend for a `procfs`-like implementation for unmodified Linux applications; providing platform-specific interfaces that are not part of the platform API because they aren't common; and, generally providing callbacks within different subsystems.

`ukstore` has been designed with two types of entries in mind:

1. static entries that are implemented in this release, and;
2. [dynamic entries that will be introduce by v0.10.0](https://github.com/unikraft/unikraft/pull/460).

The main difference is that static entries are registered to the `ukstore`-tree at compile-time while dynamic entries can appear and disappear at run-time.
Static entries can only be placed in the root path of a library while dynamic entries are placed under one sub-folder of a library.
Static entries are fixed for the whole runtime, e.g., the total free memory over all llocators provided by `libukalloc`.
Dynamic entries are intended to represent specific instances in the system, like network interface cards, schedulers, etc.

A tree could look like the following:

```txt
<ukstore root>
 |
 + [libukboot]
 |   + shutdown (-s)
 + [ukalloc]
     + free_mem (g-)
     + [0]
     |   + free_mem (g-)
     + [1]
         + free_mem (g-)        
```

Unlike dynamic entries, the registration process of static entries is not done during boot.
The linker will create a per-library list of entries via per-library created `ukstore` sections, no entry allocation is necessary at run-time.
Additionally, for efficiency reasons, `ukstore` is not looking up libraries by its name strings but on a compile-time generated identifier.
This enables making the library lookup a `O(1)` operation. Only searching an entry within a library is currently a `O(n)` operation.

In general the structure of both registration methods is similar.
The main difference is how the entries and folders are structured in the memory.
Static entries are ordered in an array saved in a sections table and dynamic entries are held inside folders within memory as an ordered linked list.
Because of this, searching for static folders is faster, thanks to cache storage locality.

#### Usage

To use static registration within your lib `libmylib`, `ukstore` will have to be first included:
```c
#include <uk/store.h>
```

The header is always available but adopts accordingly if `ukstore` is part of the build.
Code for static entry registration can be preserved because the pre-processor is going to remove all instrumentation when `ukstore` is not part of the build.

Afterwards you can very simply register your getters & setters via the exposed macro:

```c
UK_STORE_STATIC_ENTRY(
  name,
  type,
  getter,
  setter,
  cookie
);
```

Where:

- `name` - the name of the ukstore entry (this will be used to access it). Here, it is not a string, so no quoting;
- `type` - the type of the entry (`s8`, `u8`, `s16`, `u16`, `s32`, `u32`, `s64`, `u64`, `uptr`, `charp`);
- `getter` - the reference to the getter function (optional);
- `setter` - the reference to the getter function (optional);
- `cookie` - An extra argument that is handed over to the getter and setter functions;

Lets take the following example of a metric function that returns a `u8`:

```c
static int my_getter(void *cookie __unused, __u8 *dst)
{
   UK_ASSERT(dst);
   *dst = metric;
   return 0;
}
UK_STORE_STATIC_ENTRY(my_metric, u8, my_getter, NULL, NULL);
```

Afterwards, you are able to access the entry with `uk_store_get_entry()` and get its current metric value with `uk_store_get_value()`.
We have chosen this split in order to speed-up successive entry lookups.
For instance, in a monitoring loop you could save the reference of an entry instead of invoking each time a lookup.
This avoids causing string comparisons over all library entries each time the metrics value is queried:

```c
static struct uk_store_entry *my_registered_entry;
my_registered_entry = uk_store_get_entry(libmylib, NULL, "my_metric");
```
Where:
- `libmylib` - library where you are getting the entry from (see also `build/libukstore/include/uk/bits/store_libs.h`);
- `NULL` - the folder you are getting the entry from (`NULL` for static entry);
- `"my_metric"` - the name of the entry that you are looking for, this time as quoted string.

Its current metric value is retrieved with:

```c
__u8 cur_metric;
uk_store_get_value(my_entry, u8, &curr_metric);
```

Where:
- `my_entry` - the entry extracted before;
- `u8` - Actually, the type field for the target variable.
  The value is automatically up- or down-casted if source and target type do not match.
  In case the target type is too small to hold the value, `-ERANGE` is returned;
- `&curr_metric` - the actual reference of the target variable to store the result.

In this example, calling `uk_store_get_value()` will ultimately invoke `my_getter()`.
The same applies for setting a value with `uk_store_set_value` which accepts the same parameters.

For more information on this feature:

* Checkout the corresponding [pull request](https://github.com/unikraft/unikraft/pull/459) which highlights details.


### ARM Branch Target Identification (BTI)

_This feature was championed by [Michalis Pappas](https://github.com/michpappas) with input from [Renê de Souza Pinto](https://github.com/rene) and [Stefan Jumarea](https://github.com/StefanJum)._

Branch Target Identification (BTI) is a hardware protection against [JOP-like attacks](https://developer.arm.com/documentation/102433/0100/Jump-oriented-programming).
To prevent these types of attacks on ARM64, Unikraft has introduced: the BTI instruction; the GP field in Stage 1 PTEs; and, the `PSTATE.BTYPE` field.

BTI instructions, aka landing pads, are placed by the compiler at branch targets.
On runtime, branches that do not land on a BTI instruction trigger an Branch Target Exception.

The GP field indicates whether a page is guarded with BTI.
This is allows backwards compatibilty, by disabling BTI on pages that contain non-BTI guarded code.
Notice that BTI instructions on unguarded pages execute as NOP.

`PSTATE.BTYPE` encodes the type of an indirect jump, ie the branch instruction, the registers used to carry parameters, and whether the target page is guarded or or not.
When an indirect branch is taken, the processor checks whether PSATE.BTYPE matches the type of the branch target, and on negative match it generates an Branch Target Exception.
The purpose of this is to further limit the scope of possible gadgets among BTI protected branches.
Notice that there are exceptions to this. For details see [Armv8 manual D5.4.4](https://developer.arm.com/documentation/ddi0487/ga)

#### Architecture Support

Armv8.5-a introduces `FEAT_BTI` as a mandatory feature.
This feature is only available in AArch64.

#### GCC Support

GCC-9 introduces support for Armv8.5-A. BTI is supported through the `-mbranch-protection` parameter.
    
The parameters passed to `-mbranch-protection` are interpreted as:

* none: Disables all branch protections.
* pac-ret: Enables PAuth for function returns on non-leaf functions.
  The `+leaf` modifier enables protection for leaf functions.    
* bti: Enables BTI.
* standard: Enables all branch protections.

GCC-9 comes with an [issue where under certain conditions incorrect BTI instructions are generated](https://gcc.gnu.org/bugzilla/show_bug.cgi?id=94697).
Due of that issue, for BTI support in Unikraft we mandate GCC >= 10.

#### Backwards Compatibility

BTI is implemented as hint instructions. Processors based on older architecture revisions will execute these as NOP.

#### Changes introduced in this PR

This PR adds BTI support on arm64-based platforms through a new Kconfig option `CONFIG_ARM64_FEAT_BTI`.
Enabling this option instructs GCC to instrument branch targets with landing pads.
The default PTE attributes of executable pages and blocks are updated to set the GP attribute when BTI is enabled.

#### Platform Requirements

As GCC only generates BTI instructions for C code, platforms need to make sure that assembly functions that are called through indirect branching are updated with landing pads before BTI support is enabled.

For more information on this feature:

* Checkout the corresponding [pull request](https://github.com/unikraft/unikraft/pull/469) which highlights details;
* [Learn the architecture: Providing protection for complex software](https://developer.arm.com/documentation/102433/latest/);
* [The Arm Architecture Reference Manual Armv8, for Armv8-A architecture profile](https://developer.arm.com/documentation/ddi0487/ga).


### Community Activities

Unikraft is part of [Google Summer of Code 2022 (GSoC'22)](https://summerofcode.withgoogle.com/), a global online program focused on bringing new contributors into open source software development.
3 projects and students have been selected to work on GSoC projects during summer 2022.

We organized the [Unikraft Lyon Hackathon during May 14-15, 2022](/community/hackathons/2022-06-aachen/), and presented to participants the exciting world of unikernels and Unikraft.
Participants were able to solve technical challenges and make their first PRs to the Unikraft GitHub repositories.
