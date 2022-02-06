---
title: Booting
date: 2020-01-11T14:09:21+09:00
draft: false
weight: 403
description: |
  Unikraft has an prograrmmable boot sequence which provides the ability to inject functionality at different moments of system initialization.  Learn how to how and where to introduce custom functionality.
---

## Unikraft Boot Sequence
The Unikraft boot sequence is dependent on the selected platform (linuxu, kvm, xen), but is very similar to how any other operating system would behave.

<<<<<<< Updated upstream
In the case of `linuxu`, the kernel is an ELF image, and it is loaded by the Linux loader.
=======
Unikraft has an prograrmmable boot sequence which provides the ability to inject functionality at different moments of system initialization.
>>>>>>> Stashed changes

In the case of the `KVM` platform, the booting process involves more steps.
First, the image is loaded from the disk into memory and the program sections are defined (see `plat/kvm/x86/link64.lds.S`, as example for the x86 architecture).
Those sections include the `CTORTAB` and `INITTAB` sections, which are used later in the booting process.

### x86_64 

The next step is done by the bootloader, `Multiboot` in our case, which sets up some of the sections (zero-ing the `.bss`, writing the `.text` with the effective code) and passes information about the memory layout and available devices to the entry function, `_libkvmplat_start32`.
The CPU is left in the `Protected Mode`, and a small piece of code is needed to enable the `Long Mode`, paging and extended instruction sets, like `AVX`.
All those are done in `plat/kvm/x86/entry64.S`.
After that, interrupts, traps, the heap, the ACPI tables, and others, are initialized, in the `_libkvmplat_entry` function, in `plat/kvm/x86/setup.c`.
This is the last step of the booting sequence that depends on the platform or the architecture.
Booting continues in the bootstraper library, `ukboot`, where constructors and initializers are called.

### ARM

In the case of `ARM`, there is no bootloader to load information about the system and set up the sections. Those steps are done manually, in `plat/kvm/arm/entry64.S`, along with other component initialization.
After that, the booting sequence is similar to the one from `x86_64`.

### CTORTAB and INITTAB

Unikraft calls various "constructor" (`ctor`) and "initialiser" (`init`) methods during the booting step done in the boostrapping library.
These constructors and initialisers are located in a static section of the final binary image, `ctortab` and `inittab`, respectively.
There are 7 entry points during the boot sequence:

| Order | Level | Registering method                  | Type   |
|------:|------:|-------------------------------------|--------|
|     1 |     1 | `UK_CTOR_PRIO(fn, prio)`            | `ctor` |
|     2 |     1 | `uk_early_initcall_prio(fn, prio)`  | `init` |
|     3 |     2 | `uk_plat_initcall_prio(fn, prio)`   | `init` |
|     4 |     3 | `uk_lib_initcall_prio(fn, prio)`    | `init` |
|     5 |     4 | `uk_rootfs_initcall_prio(fn, prio)` | `init` |
|     6 |     5 | `uk_sys_initcall_prio(fn, prio)`    | `init` |
|     7 |     6 | `uk_late_initcall_prio(fn, prio)`   | `init` |

New constructors and initialisers can be registered using the methods defined above at various levels (meaning they are called in that order) and at various priorities (between `0` and `9`); allowing the registration of numerous constructors or initialisers at the same level.
This allows application developers or library developers to correctly set up the unikernel by registering a constructor or initialiser at the right time or before or after others.

Initialisers have 6 different levels, allowing code to be injected before certain operations occur during the boot sequence.
This includes, in order: before and after the `plat`form drivers are initialised; before and after all `lib`raries are initialised; before and after all filesystems (`rootfs`) are initialised; and, before and after various "`sys`tem" methods are called.

The source code for this sequence is defined in [`ukboot`](https://github.com/unikraft/unikraft/blob/staging/lib/ukboot/boot.c).
