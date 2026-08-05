---
title: "GSoC'26: Expanding the Unikraft Software Support Ecosystem"
description: |
  A technical update on the last 3 weeks of Google Summer of Code 2026 with Unikraft,
  covering the upgrade of the GCC support library from 7.3.0 to 14.2.0, and the
  cross-platform build fixes surfaced by testing the whole stack with Clang and GCC.
publishedDate: 2026-08-05
image: /images/unikraft-gsoc24.png
authors:
- Cristian Andrei
tags:
- gsoc
- gsoc26
- virtualization
- operating systems
---

## Project Overview

The core external libraries that power Unikraft — musl, lwIP, and GCC — are several major versions behind their upstream releases.
This creates technical debt and prevents developers from benefiting from security fixes, bugfixes, and modern language features available in newer versions.

This project upgrades these libraries to their latest stable releases: musl to `1.2.5`, lwIP to `2.2.1`, and GCC to `14.2.0`.
Rather than replacing the old versions outright, the project implements Unikraft's new Microlibrary Versioning RFC: each library gains a version choice in its `Config.uk`, allowing users to select a version at build time through `menuconfig`.
The old versions are preserved as selectable options, so existing projects can continue using them without any changes.

## The GCC Library

`lib-gcc` builds **three** separate sub-libraries from one GCC source tree: `libgcc` (the low-level compiler runtime), `libbacktrace` (symbolic stack traces), and `libffi` (the Foreign Function Interface).
Upgrading from `7.3.0` to `14.2.0` meant making all three build against a source tree.

Like with musl and lwIP, the first change was a version choice block in `Config.uk`, with `14.2.0` as the new default, plus a `Makefile.uk` that picks the URL and sources based on the active version.
The work was in only two of the three sub-libraries.

For `libbacktrace`, its build needs a pre-generated `config.h`, and the copy in the port was made on a normal Linux host.
Because of that, it turned on features that do not exist in a unikernel: the dynamic-linker ones `HAVE_DLFCN_H`, `HAVE_DL_ITERATE_PHDR`, `HAVE_LINK_H`.
Turning those off was enough to make it build.
GCC-14's `libbacktrace` also ships four new files `alloc.c`, `read.c`, `nounwind.c`, `unknown.c`.
They look like additions, but they are *replacements* for files already in the build.
Adding them next to the existing ones causes duplicate-symbol link errors, so the source list stays the same.

For `libffi`, two of its three headers: `ffi.h` and `fficonfig.h`, are not shipped at all.
They are *generated* by libffi's `configure` step, so the Unikraft port keeps hand-made copies.
Those copies were made for the old libffi inside GCC 7.3.0.
Because they come first on the include path, they *hide* the newer headers in the 14.2.0 tree.
So the new source files were built against the old headers, which caused errors: missing constants like `FFI_EFI64` and `FFI_GNUW64`, a missing `FFI_BAD_ARGTYPE`, and `const` mismatches on `ffi_type`.
The fix: first, the three headers are re-generated from 14.2.0's own libffi.
Second, split them into versioned sub-directories, and make `Makefile.uk` pick the right directory for the active version, so both releases still build.
Third, libffi `3.4` split its x86_64 ABI handling into new files for the Windows/EFI64 calling convention (`ffiw64.c` and `win64.S`), add them to the source list, only for the `14.2.0` build.

Relevant [pull request](https://github.com/unikraft/lib-gcc/pull/5).

## Core Fixes: Building the Whole Stack with Clang

Partway through the GSoC period I was asked to switch the test regime from GCC to **Clang**, and to run the full `catalog-core`: QEMU, Firecracker, and Xen, on both x86_64 and arm64.
The two compilers lit up a set of build breakages in Unikraft core, several of them dating back to the 0.21.0 native-platform refactor and simply never hit before.

The first is arm64 with Clang.
The code in the native platform's `ectx.c` is compiled with `-mgeneral-regs-only`, but it contains inline assembly that uses floating-point instructions, GCC's assembler tolerates this, Clang's does not.
This turned out to be a regression of a previously-closed issue (#1494), fixed there and quietly reintroduced.

The second and third are both C++ build failures.
On arm64, the exception-handling headers performed an implicit `int -> enum` conversion that C++ rejects, the fix is an explicit cast.
While looking into it, I found the same bug on the Xen platform, where it had not been reported before.
The third one, only on Xen, is a missing include path: `CXXINCLUDES` does not have `-I$(LIBXENPLAT_BASE)/include`, so `libcxxabi` cannot find the Xen platform's `except.h`.

The payoff: with these applied, the full `catalog-core` suite builds green for musl `1.2.5` and lwip `2.2.1` across every target, including the C++ applications on Xen, which previously did not build at all.

Relevant pull requests:
[#1875](https://github.com/unikraft/unikraft/pull/1875) (arm64 / Clang),
[#1876](https://github.com/unikraft/unikraft/pull/1876) (arm64 / C++),
[#1879](https://github.com/unikraft/unikraft/pull/1879) (Xen / C++).

## Next Steps

- Get the open pull requests reviewed and merged.
- Upgrade the remaining support libraries: `intel-intrinsics`, `libcxx`, `libcxxabi`, `compiler-rt`, and `libunwind`.
- Continue integration testing through KraftKit.

## Acknowledgements

Special thanks to my mentors Razvan Deaconescu and Shashank Srivastava for their guidance and support along the way.
