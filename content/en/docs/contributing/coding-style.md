---
title: Coding Style
date: 2020-01-11T14:09:21+09:00
draft: false
weight: 504
---

The Unikraft project uses the Linux kernel coding style which is mostly true for
the Unikraft base libraries, new source files, and KConfig files.  Please note
that ported libraries from existing sources may use different style definitions
(e.g., `lib/fdt`).  Please follow the appropriate style depending on where you
want to modify or introduce new code.

{{< alert icon="💡" text="You can find the documentation of the Linux kernel style <a href='https://www.kernel.org/doc/html/latest/process/coding-style.html'>here</a>." />}}

You can also use clang-format to check your patches. Most code closely follows
an automatically-formatted style defined by the .clang-format file in the
repository's root directory. However, since this is an automated formatting
tool, it's not perfect, and the Unikraft code can deviate from the
clang-format's programmatically created output (especially in the aesthetics of
assignment alignments). Use clang-format as a helpful tool, but with a grain of
salt. Again, note that some parts of the code (e.g., lib/fdt) follow different
coding styles that you should follow if you change this code. In the future, me
might provide .clang-format files appropriate for those libraries. We would also
be very happy to accept .clang-format definitions for those.


### Syntax Recommendations


### Code Documentation

Unikraft uses `Doxygen <#>`_ to document


### Commit message format

In order to simplify reading and searching the patch history, please
use the following format for the short commit message:

```txt
[selector]/[component name]: [Your short message]
```

Where `[selector]` can be one of the following:

| Selector    | Description                                                                                                                                                           |
|-------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `arch`      | Patch for the architecture code in `arch/`.  `[component]` is the architecture (e.g, `x86`) applies also for corresponding headers in `include/uk/arch/`.             |
| `plat`      | Patch for one of the platform libraries in `plat/`, `[component]` is the platform (e.g, `linuxu`).  This applies also for corresponding headers in `include/uk/plat/` |
| `include`   | Changes to general Unikraft headers, e.g. `include/`, `include/uk`.                                                                                                   |
| `lib`       | Patch for one of the Unikraft base libraries (not external) in `lib/`, `[component]` is the library name without lib prefix (e.g, `fdt`).                             |
| `build`     | Changes to build system or generic configurations, `[component]` is optional.                                                                                         |

{{< alert icon="💡" text="Commit messages, along with all source files follow a 80-character ruler." />}}

If no `[selector]` applies, define your own and cross your fingers that the
`reviewer(s) <review-process>`_ do(es) not complain. :-)

Sometimes a single change required multiple commit identifiers.  In general this
should be avoided by splitting a commits into multiple ones.  But for the rare
case use a comma separated list of identifiers and/or use an asterisk for
`[component]` (according to the sense).  For example:

```txt
lib/nolibc, plat/xen: Add support for foobar
arch/*: Add spinlocks
```

The short message part should start with a capital and be formulated in simple
present.

The long message part is pretty free form but should be used to explain the
reasons for the commit, what has been changed and why.  It is important to
provide enough information to allow `reviewers <review-process>`_ and other
developers to understand the commit's purpose.

### Developer's Certificate of Origin

Please note that all commits **must be signed off**.  This is required so that
you certify that you submitted the patch under the [Developer's Certificate of
Origin](https://www.kernel.org/doc/html/latest/process/submitting-patches.html#developer-s-certificate-of-origin-1-1).

Signing off is done by adding the following line after the long commit message:

```txt
Signed-off-by: $FULL_NAME <$EMAIL>
```

You can also use the `--signoff` or `-s` parameter of `git commit` when
writing commit messages.

### Example commit message

```txt
lib/ukdebug: Add new trondle calls

Add some new trondle calls to the foobar interface to support
the new zot feature.

Signed-off-by: J Smith <j.smith@unikraft.org>
```
