---
title: Coding Style
date: 2020-01-11T14:09:21+09:00
draft: false
weight: 504
---

## Coding Style

### Syntax Recommendations

The Unikraft project uses the Linux kernel coding style which is mostly true for the Unikraft base libraries, new source files, and KConfig files.
Please note that ported libraries from existing sources may use different style definitions (e.g., `lib/fdt`).
Please follow the appropriate style depending on where you want to modify or introduce new code.

You can also use `.clang-format` to check your patches.
Most code closely follows an automatically-formatted style defined by the [.clang-format](https://github.com/unikraft/unikraft/blob/staging/.clang-format) file in the repository's root directory.
However, since this is an automated formatting tool, it's not perfect, and the Unikraft code can deviate from the `clang-format`'s programmatically created output (especially in the aesthetics of assignment alignments).
Use `clang-format` as a helpful tool, but with a grain of salt.
Again, note that some parts of the code (e.g. lib/fdt) follow different coding styles that you should follow if you change this code.
In the future, me might provide .clang-format files appropriate for those libraries.
We would also be very happy to accept `.clang-format` definitions for those.

### Code Documentation

Internal Unikraft code follows mostly the code comments style of the [Linux kernel](https://www.kernel.org/doc/html/v4.10/process/coding-style.html#commenting) and the [Doxygen](https://www.doxygen.nl/manual/docblocks.html) style.
Try to keep comments uniform across the file you are editing.
