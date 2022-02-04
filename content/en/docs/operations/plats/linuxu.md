---
title: Linux Userspace
date: 2020-01-11T14:09:21+09:00
draft: false
weight: 512
---

## Linux Userspace

### General Characteristics

Images that are usually loaded with QEMU (for KVM), can, most often than not, be generated as a Linux Userspace application (if they support it).
This means that they will be able to run as any other application running on Linux.
This also means that the list of dependencies needed to build & run the application is smaller.

Running as a userspace application has its own advantages and disadvantages, though:

### Pros and Cons

| Pros                | Cons                                                   |
|---------------------|--------------------------------------------------------|
| Easy to set up      | Possibly slower than other platforms in specific cases |
| Easy to use         | Limited features compared to other platforms           |
| Development focused | Harder to use for very specific cases                  |

### Unikraft Support

Unikraft can run as a `linuxu` build, in which it behaves as a Linux user-space application.
This severely limits its performance, though, as everything Unikraft does must go through the Linux kernel, via system calls.
This mode should be used only for development and debugging.

To configure Unikraft to build the image as a userspace application select the `linuxu` platform from the list using `kraft` or `menuconfig`.
Currently, the `linuxu` platform is supported on both x86 and ARM architectures:

```bash
kraft configure -p linuxu -m your-architecture
```

To run your Unikraft image in `linuxu` mode, just run the resulting executable directly:

```bash
    ./build/app-helloworld_linuxu-your-architecture
```
