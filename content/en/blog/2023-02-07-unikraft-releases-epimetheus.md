---
title: "Unikraft releases v0.12.0 (Janus)"
date: "2023-02-07T12:00:00+01:00"
authors: [
  "Răzvan Deaconescu",
  "Alexander Jung",
  "Simon Kuenzer",
  "Marc Rittinghaus",
  "Răzvan Vîrtan"
]
tags: ["announcement"]
---

We are excited to bring you the newest Unikraft release, v0.12.0 (Epimetheus)!

With this relese, we aim to bring more stability to the Musl support integrated in 0.11, but also come with a lot of exciting features.

In this blog post, we highlight just some of the new features available in Unikraft.  For a full breakdown, please check out the [changelog](https://github.com/unikraft/unikraft/compare/RELEASE-0.11.0...RELEASE-0.12.0).


## POSIX-compatible Virtual Address Space management (`ukvmem`)

_This feature was championed by [Marc Rittinghaus](https://github.com/marcrittinghaus) with important advice and essential support from [Michalis Pappas](https://github.com/michpappas)._

In this release we introduce virtual address space management to Unikraft via a new library called `lib/ukvmem` (virtual memory).  The functionality will be exposed in a POSIX compatible way via `lib/posix-mmap`.

However, the API introduced by `lib/ukvmem` via header `uk/vmem.h` (see `lib/ukvmem/include/uk/vmem.h`) is ready for first feedback by the community and defines the following core functions.  See [the header file](https://github.com/unikraft/unikraft/blob/staging/lib/ukvmem/include/uk/vmem.h) and the examples below for usage:

```c
int uk_vma_map(struct uk_vas *vas, __vaddr_t *vaddr, __sz len,
	       unsigned long attr, unsigned long flags, const char *name,
	       const struct uk_vma_ops *ops, void *args);

int uk_vma_unmap(struct uk_vas *vas, __vaddr_t vaddr, __sz len,
		 unsigned long flags);

int uk_vma_set_attr(struct uk_vas *vas, __vaddr_t vaddr, __sz len,
		    unsigned long attr);

const struct uk_vma *uk_vma_find(struct uk_vas *vas, __vaddr_t vaddr);
```

The core concepts are:

- Every virtual address space (VAS) is represented by a `struct uk_vas`.
- Every virtual memory area (VMA) in an address space is represented by a `struct uk_vma`.
- The core library does **only** generic management of VMAs (e.g., add, modify, remove etc.) without implementing the actual different VMA types such as anonymous memory or file mappings.
- When a VMA is created, the user specifies a set of VMA operations that determine the behavior of the VMA and thereby allowing different types of VMAs (e.g., anon, file mappings) to be implemented.

The library will come with an implementation for the following VMA types:

- Simple anonymous memory;
- Direct-mapped physical memory;
- File-backed memory - no global cache, simple pre-initialization with file contents;
- Reserved VMAs - to reserve an address range in the VAS and to represent static/fixed mappings already existing in the page table (e.g., kernel `.text`, `.rodata` etc.);
- Stack VMAs - simple anonymous memory with a guard page to signal stack overflows

Just like Linux, adjacent VMAs are merged, if possible. Also, just like Linux, changing the properties of a certain address range in an existing VMA leads to the VMA transparently being split into separate VMAs as needed to reflect the different ranges.

The library will implement **demand-paging** as well as pre-population.

### API Usage Examples

The functions `uk_vma_map_*()` are wrappers to `uk_vma_map()` referring to the corresponding VMA operations and necessary parameters for easier use.

1. Create an anonymous writable memory mapping with demand paging. Physical memory is dynamically allocated on access.

   ```c
   __vaddr_t vaddr = __VADDR_ANY;
   uk_vma_map_anon(uk_vas_get_active(), &vaddr, <SIZE>, PAGE_ATTR_PROT_RW,
                   0, NULL);
   ```

2. Create a writable memory mapping of an existing physical memory range (e.g., to map device memory). UK_VMA_MAP_POPULATE is optional and just ensures that the mappings in the page table are already established so they are present in interrupt context.

   ```c
   __vaddr_t vaddr = __VADDR_ANY;
   uk_vma_map_dma(uk_vas_get_active(), &vaddr, <SIZE>, PAGE_ATTR_PROT_RW,
                  UK_VMA_MAP_POPULATE, NULL, <PADDR>);
   ```

3. Create a writable memory mapping of a newly allocated physical memory
area that uses 2MB pages. The size must be a multiple of 2MB.

   ```c
   __vaddr_t vaddr = __VADDR_ANY;
   uk_vma_map_anon(uk_vas_get_active(), &vaddr, <SIZE>, PAGE_ATTR_PROT_RW,
                   UK_VMA_MAP_SIZE_2MB, NULL);
   ```

4. Create a fixed VMA for a mapping already existing in the pagetable (e.g., for an initrd). Note that the attributes specified must match the configuration in the page table. Otherwise, behavior is undefined.

   ```c
   uk_vma_reserve_ex(uk_vas_get_active(), <VADDR>, <SIZE>,
                     PAGE_ATTR_PROT_READ, 0, ".initrd");
   ```

5. Reserve a 1GB address range, create an initial 1MB mapping, extend the mapping by 2MB, and shrink the mapping by 1MB again. The reserved range acts as a placeholder which can be only be used for other mappings by explicitly providing a virtual address of the range and specifying the `UK_VMA_MAP_REPLACE` flag. The flag is also used to replace part of the heap mapping with a reservation again. The figures to the right depict the VMAs after each operation.

   ```c
   __vaddr_t vaddr = HEAP_BASE;                          ┌────────┐0MB
   uk_vma_reserve(uk_vas_get_active(),                   │        │
                  &vaddr, 0x40000000);                   │  RSVD  │
                                                         │        │
                                                         │        │
                                                         └ ─ ─ ─ ─┘
   // Initial 1MB mapping                                ┌────────┐0MB
   vaddr = HEAP_BASE;                                    │  HEAP  │
   uk_vma_map_anon(uk_vas_get_active(),                  ├────────┤1MB
              &vaddr, 0x100000, PAGE_ATTR_PROT_RW,       │  RSVD  │
              UK_VMA_MAP_REPLACE, "HEAP");               │        │
                                                         └ ─ ─ ─ ─┘
   // Grow mapping by 2MB                                ┌────────┐0MB
   vaddr += 0x100000;                                    │/  /  / │
   uk_vma_map_anon(uk_vas_get_active(),                  │  HEAP  │
              &vaddr, 0x200000, PAGE_ATTR_PROT_RW,       │ /  /  /│
              UK_VMA_MAP_REPLACE, "HEAP");               ├────────┤3MB
                                                         └ ─ ─ ─ ─┘
   // Shrink mapping by 1MB                              ┌────────┐0MB
   vaddr += 0x100000;                                    │/  /  / │
   uk_vma_reserve_ex(uk_vas_get_active(),                │  HEAP  │
                &vaddr, 0x100000, 0,                     ├────────┤2MB
                UK_VMA_MAP_REPLACE, NULL);               │  RSVD  │
                                                         └ ─ ─ ─ ─┘
   ```

6. It is also possible to just create a large virtual memory area that uses demand paging and only release the physical memory when not needed anymore.  Thus keeping the VMA intact and accessible.

   ```c
   vaddr = HEAP_BASE;
   uk_vma_map_anon(uk_vas_get_active(), &vaddr, 0x300000, PAGE_ATTR_PROT_RW, 0,
                   "HEAP");

   /* ... heap manager decides to release some physical memory in an unused area */
   vaddr = HEAP_BASE + 0x200000;
   uk_vma_advise(uk_vas_get_active(), vaddr, 0x100000, UK_VMA_ADV_DONTNEED, 0);
   ```

7. Create a linear ring buffer that mirrors the buffer at the end to avoid copying (see https://en.wikipedia.org/wiki/Circular_buffer#Optimization).  Note: Precede an address reservation for the whole 2 * PAGE_SIZE * <PAGES> range to ensure race free allocation of the virtual addresses.  Note: Physical memory mapped with `uk_vma_map_dma()` will not be freed automatically when the VMA is unmapped.

   ```c
   struct uk_vas *vas = uk_vas_get_active();
   __paddr_t paddr = uk_falloc(vas->pt->fa, <PAGES>);
   __vaddr_t vaddr = __VADDR_ANY;
   uk_vma_map_dma(vas, &vaddr, PAGE_SIZE * <PAGES>, PAGE_ATTR_PROT_RW,
                  UK_VMA_MAP_POPULATE, NULL, paddr);
   vaddr += PAGE_SIZE * <PAGES>;
   uk_vma_map_dma(vas, &vaddr, PAGE_SIZE * <PAGES>, PAGE_ATTR_PROT_RW,
                  UK_VMA_MAP_POPULATE, NULL, paddr);
   ```

### Changes to the Paging API

Prototyping some bits and pieces of the implementation showed that some changes to the paging code are needed:
- Make `ukplat_page_set_attr()` ignore ranges that are not mapped to allow a simple call for a whole VMA irrespective of what ranges of a VMA are actually represented in the page table due to demand-paging
- Introduce `ukplat_page_kmap()` and `ukplat_page_kunmap()` to perform a quick temporary mapping of an arbitrary physical frame for initialization of a page in the page fault handlers of `lib/ukvmem`. These mapping will not actually use new mappings if a direct-mapped physical memory exists. In this case, only the corresponding virtual address can be returned with the `unmap` being a noop.
- Replace `ukplat_page_map()` with `ukplat_page_mapx()` that allows to execute a function in before the new PTE is written. This way, it is possible to change the PTE or initialize the physical memory. It also allows allocating the physical memory in a different way (e.g., using a frame from a cache). For compatibility there is a `ukplat_page_map()` wrapper.


## Fault safe memory accesses (`uknofault`)

_This feature was championed by [Marc Rittinghaus](https://github.com/marcrittinghaus) with support from [Marco Schlumpp](https://github.com/mschlumpp/) and [Răzvan Deaconescu](https://github.com/razvand/)._


This new library provides support for performing fault-safe memory accesses and `memcpy`s.

Normally, when the CPU attempts to access a memory address that is not accessible or if the access would violate the protection settings of the corresponding page, a page fault occurs. Similarly, on x86 the CPU raises a general protection fault when a non-canonicalized virtual address is used. Writing code that can potentially be given invalid addresses or which might attempt accesses to inaccessible memory thus becomes very complicated.

This library provides functions for performing fault-safe memory accesses. Faults will just cause the functions to indicate an error instead of crashing.

Generally, all functions are compiled as ISR-safe. `uknofault` also provides variants that will in addition disable on-demand paging for duration of the access or continue on failure (e.g., to make sure a whole region is not accessible). These variants can be selected via the flags parameter.

### API Usage Examples

1. The following code checks if a given address range [`0x100000`; `0x100000+42`) can be read:

   ```c
   #include <uk/nofault.h>
   if (uk_nofault_probe_r(0x100000, 42, 0) != 42)
           uk_pr_err("Cannot read memory range\n");
   ```

2. The following code performs a fault-safe `memcpy`. Both the `src` and `dst` are allowed to cause faults:

   ```c
   #include <uk/nofault.h>
   char *dst = ...;
   const char *src = ...;
   __sz l, len = ...;
   l = uk_nofault_memcpy(dst, src, len, 0);
   if (l != len)
           uk_pr_err("Could only copy %ld bytes\n", l);
   ```

3. The following code disables on-demand paging while performing the probe:

   ```c
   #include <uk/nofault.h>
   if (uk_nofault_probe_r(0x100000, 42, UK_NOFAULTF_NOPAGING) != 42)
           uk_pr_err("Cannot read memory range\n");
   ```


## Binary compatibility support application (`elfloader`)

_This feature was championed by [Simon Kuenzer](https://github.com/skuenzer) with support from [Andra Paraschiv]() and [Eduard Vintilă]()._

A feature that had been in testing in the Unikraft community for a long while now: a binary compatibility support unikernel application which allows Linux ELF binaries to be run unmodified on top of Unikraft. This is done via a custom Unikraft application, [`app-elfloader`](https://github.com/unikraft/app-elfloader) which receives the unmodified Linux ELF binary as initram.  `app-elfloader` parses the binary, loads it into memory and then passes control to it. The [`syscall_shim` layer](https://github.com/unikraft/unikraft/tree/staging/lib/syscall_shim) is then in charge of redirecting system calls from the binary to their implementation in Unikraft.

Binary compatibility is a key feature in Unikraft adoption, as it makes it seamless to run prebuilt Linux binaries with Unikraft. Moreover, it provides an excellent testing ground for system call and ABI compatibility.

Current setup is for static PIE (Position Independent Executable) binaries such as those in the [`static-pie-apps` repository](https://github.com/unikraft/static-pie-apps), with initial support for dynamic PIE binaries. Dynamic PIE binaries are the most common top of executables in modern Linux distributions.

The next steps for the `elfloader` application are improving usability by adding support to load applications from the filesystem and the correct handling of application exits. We will also work on increasing application support by completing the Unirkaft core with missing or incomplete system calls.
Additionaly, we want to natively support `elfloader` within [KraftKit](https://unikraft.com/unikraft/kraftkit). Users should be abe to quickly retrieve and use `elfloader` from the command-line without having to compile it from source.


## `strace`-like syscall debug printing

_This feature was championed by [Simon Kuenzer](https://github.com/skuenzer) with support from [Andra Paraschiv](https://github.com/andraprs), [Eduard Vintilă](https://github.com/eduardvintila/) and [Răzvan Deaconescu](https://github.com/razvand/)._

{{< figure
    src="/assets/imgs/strace.png"
    position="center"
>}}

This release introduces a debugging option under `lib/syscall_shim` that enables a `strace`-like output when binary system call requests were handled. Its original intention is to simplify the understanding of still missing system call/feature implementation when running applications in binary compatibility mode (see "Binary compatibility support application"). Such a system call request is decoded and pretty-printed to the kernel console.

To make `strace`-like printing possible, this release introduces [`lib/ukstreambuf`]() a generic library that makes it easier to enqueue data to a buffer. It automatically keeps track of the current seek position and left space on a buffer. Especially for C-string buffers there is also special handling available for taking care of correct `'\0'`-termination so that C-strings can be easily appended.


## Boot code refactoring

_This feature was championed by [Marc Rittinghaus](https://github.com/marcrittinghaus) with great support from [Sergiu Moga](https://github.com/mogasergiu) and [Marco Schlumpp](https://github.com/mschlumpp)._

Currently, the x86-64 KVM platform defines a `multiboot.S` file that provides the early multiboot1 entry point. This entry point eventually communicates the multiboot-specific boot information structures to the `_libkvmplat_entry()` function, which then works on the multiboot structures to setup the platform.

This approach has the disadvantage that for every other boot protocol like Linux Boot Protocol (Firecracker), or EFI, we have to replicate the whole platform initialization. Also initialization steps are hard to share across architectures.

This release introduces a generic Unikraft boot information (`ukplat_bootinfo`) structure that the platform initialization is based on. Every individual boot protocol then supplies a custom entry point that extracts all relevant data from the protocol-specific boot information and sets up the Unikraft boot information before jumping into the generic platform initialization.

### Memory regions

A central piece of information during boot is the current memory setup. This release extends the existing `ukplat_memregion_desc` so that it is able to store the physical and virtual address of memory regions (see the commit description for further changes). It thereby allows to use the descriptor in the boot information to describe the memory layout also for more complicated cases where the kernel image might be loaded at an arbitrary virtual address (ASLR).

Previously, iterating over the `ukplat_memregion_desc`s was implemented by using the section symbols (e.g., `__TEXT`, `__ETEXT`). With the memory regions being part of the boot information, this code is now gone.

### MAP/UNMAP flags (paging only)

The memory regions can be marked with a `MAP` and `UNMAP` flag to instruct the kernel to map/unmap the region at boot (when paging is enabled). This is useful, for example, to unmap code/data of a chainloader after jumping into the final unikernel. Also mapping a dynamically discovered region like the `initrd` can be expressed in a generic way, without having to pollute the platform code with special `initrd` handling.

### mkbootinfo.py

The release includes a script `mkbootinfo.py` which is executed at link-time to provide a prepared boot information structure that already contains the layout (with permissions) of the kernel image. For multiboot this information is not supplied by the protocol. Instead at runtime the multiboot information on the location of the `initrd`, device memory and free physical memory is used to supplement the already existing kernel layout information.

### Plat Re-arch

The code is structured in a way so that it will be easy during platform re-architecture to move each boot protocol entry (multiboot1, multiboot2, EFI, Linux Boot Protocol, ...) into its own library.


## Documentation Updates

_This was championed by [Ștefan Jumărea](https://github.com/StefanJum) with great support from [Radu Nichita](https://github.com/RaduNichita), [Delia Pavel](https://github.com/DeliaPavel), [Eduard Vintilă](https://github.com/eduardvintila/), [Răzvan Deaconescu](https://github.com/razvand/) and [Alexander Jung](https://github.com/nderjung/)._

We've taken steps to improve the [documentation]() by adding details on what's happening behind the scenes when building and configuring an application. Both by using the underlying Make-based build system and by using [the `pykraft` companion tool](https://github.com/unikraft/pykraft).

At the same time, we're adding `README.md` files and Doxygen-style comments for internal libraries. The goal is to provide useful information regarding the design decisions and implementation specifics and the API that the library provides. This has been done for [`ramfs`](https://github.com/unikraft/unikraft/tree/staging/lib/ramfs), [`vfscore`](https://github.com/unikraft/unikraft/tree/staging/lib/vfscore) and [`uktest`](https://github.com/unikraft/unikraft/tree/staging/lib/uktest).


## Community Activities

### 1200 stars and counting!

Since the last release, we managed to grow the number of github stars to 1200 on our [main repository](https://github.com/unikraft/unikraft.git)! This shows us that we keep growing and makes us grateful to the amazing Unikraft community for their efforts!

### Full day hackathon at UPB in January

We kicked-off 2023 in our usual style with aother full day hackathon! Tha hackathon took place on 14th of January 2023. Everyone interested could join us in-person, at University POLITEHNICA of Bucharest, and online, on our [Discord server](https://bit.ly/UnikraftDiscord).

We had all kind of community members joining, from very beginners to more experienced people, adding features, reviewing, debugging or making their first steps in Unikraft.

{{< figure
    src="/assets/imgs/hackathon-2023-01-14.jpg"
    position="center"
>}}

### Unikraft Athens Hackathon in March

Fear not in missing out!  Unikraft plans on hosting another hackathon in March in Athens, Greece.  Along with [Nubificus](https://nubificus.co.uk/), [the High Speed Communication Networks Lab (HSCN)](http://hscnl.ece.ntua.gr/) and [the Computing Systems Lab (CSLab)](http://www.cslab.ece.ntua.gr/) of the National Technical University of Athens ([ICCS](https://www.iccs.gr/en/)/[NTUA](https://www.ntua.gr/en/)), the Unikraft community come together to organize the **Unikraft Athens Hackathon** to be held on Thursday and Friday, March 30-31, 2023.

The hackathon will take place as an in-person event at the Multimedia Amphitheater at the Zografou campus of NTUA.  The full address is: [Multimedia Amphitheater, Central Library Building, Heroon Polytechniou 9, 15780 Zografou, Greece](https://goo.gl/maps/NPyEgR286NdeCM2X7).

Support information and discussions will take place on [Discord](http://bit.ly/UnikraftDiscord) on the `#hack-athens23` channel.

To take part in the hackathon please fill this [registration form](https://forms.gle/a315sJrzRQV8rZdz8) by **Sunday, March 19, 2023, 11pm CET** and to learn more [visit the dedicated hackathon page](https://unikraft.org/community/hackathons/2023-03-athens/).

### Unikraft at FOSDEM'23

Unikraft was part of [FOSDEM'23](https://fosdem.org/2023/). [Răzvan Deaconescu](https://github.com/razvand/) and [Simon Kuenzer](https://github.com/skuenzer/) were the managers of the ["Microkernel and Component-based OS" devroom](https://fosdem.org/2023/schedule/track/microkernel_and_component_based_os/) where they also gave talks:

- [**Unikraft Weather Report**](https://fosdem.org/2023/schedule/event/unikraft/)
  by [Razvan Deaconescu](https://github.com/razvand/)
- [**Building a Linux-compatible Unikernel**](https://fosdem.org/2023/schedule/event/appunikraft/)
  by [Simon Kuenzer](https://github.com/skuenzer/)

Members of the wider FOSS community exploring unikernels also gave interesting talks which featured Unikraft, including:

- [**Hardware acceleration for Unikernels**](https://fosdem.org/2023/schedule/event/hwacceluk/)
  by [Anastassios Nanos](https://fosdem.org/2023/schedule/speaker/anastassios_nanos) and [Charalampos Mainas](https://fosdem.org/2023/schedule/speaker/charalampos_mainas/)
- [**Loupe: Designing Application-driven Compatibility Layers in Custom Operating Systems**](https://fosdem.org/2023/schedule/event/loupe/)
  by [Pierre Olivier](https://sites.google.com/view/pierreolivier)

It was great to meet people face to face and interact with cool people in the technical and research OS community. This was the first face-to-face edition after the pandemic, the previous face-to-face edition was in 2020.

{{< figure
    src="/assets/imgs/unikraft-fosdem23.jpg"
    position="center"
>}}
