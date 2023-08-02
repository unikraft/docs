+++
title = "GSoC'23: Expanding Binary Compatibility Mode (Part 3)"
date = "2023-08-04T00:00:00+01:00"
author = "Tianyi Liu"
tags = ["GSoC'23", "Binary Compatibility", ".Net Runtime"]
+++

<img width="100px" src="https://summerofcode.withgoogle.com/assets/media/gsoc-2023-badge.svg" align="right" />

[This project](https://summerofcode.withgoogle.com/programs/2023/projects/Bl7ARfep) aims to enhance the binary compatibility of Unikraft.
In the [previous blog post](https://unikraft.org/blog/2023-06-23-unikraft-gsoc-app-compat-2/), we introduced the design and its revision history for using VDSO to perform binary syscall bypassing.
Currently, it has been implemented and waiting for review.
In this blog post, we will delve into the adaptation work for the `.Net` runtime and highlight the challenges encountered during the process.

## Adapting to the .NET Runtime

`.Net` is a widely used framework.
According to TIOBE's rankings, `C#` and `Visual Basic`, both based on `.NET`, have market shares of `6.87%` and `2.90%` respectively.
Therefore, adapting to the `.Net` runtime can significantly increase the number of applications supported by Unikraft.

As a complex dynamic language virtual machine, the `.NET` runtime requires a lot of configuration in the environment, involving many system calls that require support from the operating system.
However, one advantage is that the `.NET` runtime is implemented in C++ and directly uses `glibc`, so our previous support for `glibc` can be reused, including `VDSO`.

Specifically, the `.NET` runtime relies on the following support:

For the `posix-mmap` module, it requires the `mlock` and `msync` system calls.
However, since Unikraft doesn't support swap and doesn't write back the content of mmap to files, both of these system calls can be safely ignored.

For the `vfscore` module, the `mknodat` system call is needed to create the debug pipe `/tmp/clr-debug-pipe`.
We found that adding the environment variable `COMPlus_EnableDiagnostics=0` can prevent this behavior.
Hence, we decided not to implement the `mknodat` system call to avoid disrupting compatibility with other applications.
We also compiled a modified `.NET` runtime version with the default value of `COMPlus_EnableDiagnostics` changed to 0.
Both the original and modified binary libraries are stored in the `dynamic-apps` repository.

For the `uksched` module, it requires the `sched_getaffinity` and `sched_setaffinity` system calls.
Since Unikraft's `SMP`support is still under developing, we temporarily ignore `sched_setaffinity` and ensure that `sched_getaffinity` always returns `CPU0`.

Finally, The `.Net` runtime uses [`__pthread_getattr_np`](https://github.com/bminor/glibc/blob/glibc-2.37/nptl/pthread_getattr_np.c#L85)
in [`CPalThread::GetStackBase()`](https://github.com/dotnet/runtime/blob/v7.0.7/src/coreclr/pal/src/thread/thread.cpp#L2683)
and [`CPalThread::GetStackLimit()`](https://github.com/dotnet/runtime/blob/v7.0.7/src/coreclr/pal/src/thread/thread.cpp#L2723).
In `__pthread_getattr_np`, the `glibc` implementation reads `/proc/self/maps` to get stack addresses [here](https://github.com/bminor/glibc/blob/glibc-2.37/nptl/pthread_getattr_np.c#L129).
Instead of relying on identifying the names of mappings, it checks if each memory mapping includes the known address range of the stack.
Since `procfs` is not yet implemented, users have to change the content of `/proc/1/maps` in their `rootfs`, to make the address range of `[stack]` contains the real stack area.
Otherwise, the runtime will crash with `Failed to create CoreCLR, HRESULT: 0x8007000E`.
To get to know what's the stack address, the debug information provided in [app-elfloader](https://github.com/unikraft/app-elfloader/blob/bbb92f8c04bd58f0cf52b9e76250b0e03c5fc7e7/main.c#L239) may be helpful.

## Current Progress

* Syscall Bypass / VDSO
  * Everything has been done and awaiting review.

* .NET Runtime Support
  * Basic `.NET 7.0` programs are already runnable (tested with C#).
  * However, more complex applications like `ASP.NET` require additional support for asynchronous syscalls from `vfscore`.

* CI/CD
  * The CI/CD workflow is now capable of automatic execution on GitHub Actions, generating differential reports.
  * This helps developers to determine whether their pull requests might potentially disrupt Unikraft's libc compatibility.
  * Additionally, with the recent inclusion of GitHub Actions support in `kraftkit`, we plan to migrate `lib-libc-test` to the new CI/CD system shortly and utilize it as a regular integrated test.

* Supporting AArch64 binary syscalls in `app-elfloader`
  * The implementation is complete, waiting upstream dependencies to be merged.

## Next Steps

* CI/CD
  * Pending to port to the new CI/CD system in `kraftkit`.

The planned work has almost been completed.

## Acknowledgement

I would like to express my sincere gratitude to my mentors and the Unikraft community for their kindly support.
