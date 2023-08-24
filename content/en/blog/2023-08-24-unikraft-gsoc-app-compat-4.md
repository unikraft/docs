+++
title = "GSoC'23: Expanding Binary Compatibility Mode (Part 4)"
date = "2023-08-24T00:00:00+01:00"
author = "Tianyi Liu"
tags = ["GSoC'23", "Binary Compatibility", "AArch64 Support"]
+++

<img width="100px" src="https://summerofcode.withgoogle.com/assets/media/gsoc-2023-badge.svg" align="right" />

[This project](https://summerofcode.withgoogle.com/programs/2023/projects/Bl7ARfep) aims to enhance the binary compatibility of Unikraft.
In the [previous blog post](https://unikraft.org/blog/2023-08-04-unikraft-gsoc-app-compat-3/), we told the story of porting `.NET` Runtime.
Currently, as GSoC comes to an end, most of my work has been merged upstream, and there are also some new items.

## AArch64 support for binary compat mode

To support binary syscalls for the AArch64 architecture, I introduced an adapter function into the AArch64 interrupt handling module, redirecting system calls to the `syscall-shim` layer.
After testing, this has proven to work effectively.
However, it's worth noting that there are some libraries within Unikraft that do not offer complete support for the AArch64 architecture, which will require further effort.

## Current Progress

* Syscall Bypass / VDSO
  * Upstreamed in `0.14` release.

* .NET Runtime Support
  * Upstreamed in `0.14` release.

* CI/CD
  * Integrated in `kraftkit` CI/CD system by [@Alexander Jung](https://github.com/nderjung).

* AArch64 support for binary compat mode
  * The implementation is complete, awaiting review.

## Next Steps

All planned work has been completed.

## Acknowledgement

I would like to express my sincere gratitude to my mentors and the Unikraft community for their kindly support.
