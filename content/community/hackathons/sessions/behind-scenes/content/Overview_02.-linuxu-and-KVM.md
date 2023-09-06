Unikraft can be run in 2 ways:

* As a virtual machine, using QEMU/KVM or Xen.
  It acts as an operating system, having the responsibility to configure the hardware components that it needs (clocks, additional processors, etc).
  This mode gives Unikraft direct and total control over hardware components, allowing advanced functionalities.
* As a `linuxu` build, in which it behaves as a Linux user-space application.
  This severely limits its performance, as everything Unikraft does must go through the Linux kernel, via system calls.
  This mode should be used only for development and debugging.

When Unikraft is running using QEMU / KVM, it can either be run on an emulated system or a (para)virtualized one.
Technically, KVM means virtualization support is enabled.
If using QEMU in emulated mode, KVM is not used.
To keep things simple, we will use interchangeably the terms QEMU, KVM or QEMU / KVM to refer to this use (either virtualized, or emulated).

Emulation is slower, but it allows using CPU architectures different from the local one (you can run ARM code on a x86 machine).
Using (para)virtualisation, aka hardware acceleration, greater speed is achieved and more hardware components are visible to Unikraft.
