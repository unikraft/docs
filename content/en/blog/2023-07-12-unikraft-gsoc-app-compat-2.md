+++
title = "GSoC'23: Expanding Binary Compatibility Mode (Part 2)"
date = "2023-07-12T00:00:00+01:00"
author = "Tianyi Liu"
tags = ["GSoC'23", "Binary Compatibility", "VDSO", "Performance Optimization"]
+++

<img width="100px" src="https://summerofcode.withgoogle.com/assets/media/gsoc-2023-badge.svg" align="right" />

[This project](https://summerofcode.withgoogle.com/programs/2023/projects/Bl7ARfep) aims to enhance the binary compatibility of Unikraft.
In the [previous blog post](https://unikraft.org/blog/2023-06-23-unikraft-gsoc-app-compat-1/), we primarily discussed the motivation and expected objectives of this project.
In this blog, we will further elaborate on the design and principle of `syscall-bypass`, which is the most significant objectives of this project.

## Design History of Syscall Bypass

Syscall Bypass is the most crucial component of this project, as outlined in the proposal.
In order to reduce unnecessary overhead, we aim to leverage the feature of dynamic libraries to modify the behavior of libc, which traditionally uses interrupts for system calls.
This approach is based on the understanding that, in the context of an unikernel, the isolation between user programs and the kernel is unnecessary.
However, during the implementation, we encountered several challenges that required multiple refactorings.
Here are some brief notes on the evolutionary process:

* Period 1: LD_PRELOAD (deprecated)
  * When it comes to replacing function implementations in dynamic libraries, the most commonly considered approach is using `LD_PRELOAD`.
    `LD_PRELOAD` leverages the `.plt` table in libc to prioritize symbols from the PRELOAD library, thus choosing the implementation from the PRELOAD library first during symbol resolution.
    However, this method has its drawbacks.
    It can only replace functions at the `.plt` level and cannot perform bulk replacements at the syscall level.
    Additionally, due to TLS considerations, `LD_PRELOAD` libraries cannot share thread-local variables with the original `libc.so` because they have different layouts.
    This limitation prevents the use of certain functions that heavily rely on TLS, such as `malloc()`.
  * In the initial version, we replaced all the system call wrapper functions provided by libc, while other libc functions (such as `printf()`) were not replaced.
    Even in this situation, `Redis` benchmark achieved performance very close to that of native build applications.

* Period 2: Syscall Wrappers in VDSO (deprecated)
  * The second approach we attempted was to store the addresses of kernel syscall-related functions in VDSO.
    We also made modifications to the underlying layer of libc to enable direct syscalls using the kernel function addresses.
  * We placed over 400 wrapper functions for syscalls in VDSO, and stored their addresses in libc using `vdso_sym()`.
  * This method also has its shortcomings.
    First, due to the storage of a large number of wrapper functions, the size of the VDSO image becomes large, making it cumbersome to construct a VDSO that is filled with kernel addresses.
    Second, libc needs to map system call numbers to functions, which is a heavy task in some degree.

* Period 3: __kernel_vsyscall (current)
  * Earlier in the x86 architecture, we found a design called `vsyscall`, which was later replaced by VDSO.
  * This design used a unified interface (`__kernel_vsyscall`) to execute syscalls in user space, but it was abandoned due to security concerns.
    But in an unikernel context, we can revive such a design by providing a simple and unified interface for libc and distributing system calls within the kernel.
    This implementation would be more elegant as libc no longer needs to store a large number of kernel function addresses, and the kernel can also reuse many existing implementations.

## Current Progress

* Syscall Bypass
  * We have already provided patched versions of `glibc` and `Musl`, which can read kernel addresses from VDSO and directly invoke kernel functions to perform syscalls.
  * This approach has been proven to be both universal and secure.
    We have taken into account the TLS switching between kernel space and user space, and have successfully conducted experiments on multiple applications.

* VDSO
  * The automatic generation of VDSO images has been implemented, exposing kernel addresses in the form of variables within the Unikraft kernel.
  * The kernel will update the addresses contained in VDSO after the relocation process is completed.
    This implementation supports the kernel's ability to enable ASLR (Address Space Layout Randomization).

* CI/CD
  * This part of the work is currently on hold and will be resumed once the implementation of Syscall Bypass is completed.

## Next Steps

* Syscall Bypass
  * The patches for `glibc` and `Musl` may not fully comply with code standards in some areas (primarily due to the extensive use of macros) and need to be reorganized in a more elegant manner.
  * Further experimentation is required on a wider range of application workloads to validate that this approach offers better performance than binary syscalls.
  * Analyze the differences between this approach and native build applications.

* VDSO
  * Unify the traditional VDSO function interface with the new `vsyscall` interface, and automatically generate code that allows the kernel to be aware of and relocate kernel addresses within VDSO.

## Acknowledgement

I would like to express my sincere gratitude to my mentors and the Unikraft community for their support throughout my participation in the project.
