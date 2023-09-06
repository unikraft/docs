The Unikraft core is comprised of several components:

* [the architecture code](https://github.com/unikraft/unikraft/tree/staging/arch):
  This defines behaviours and hardware interactions specific to the target architecture (x86_64, ARM, RISC-V).
  For example, for the x86_64 architecture, this component defines the usable registers, data types sizes and how Thread-Local Storage should happen.
* [the platform code](https://github.com/unikraft/unikraft/tree/staging/plat):
  This defines interaction with the underlying hardware, depending on whether a hypervisor is present or not, and which hypervisor is present.
  For example, if the KVM hypervisor is present, Unikraft will behave almost as if it runs bare-metal, needing to initialize the hardware components according to the manufacturer specifications.
  The difference from bare-metal is made only at the entry, where some information, like the memory layout, the available console, are supplied by the bootloader (Multiboot), and there's no need to interact with the BIOS or UEFI.
  In the case of Xen, many of the hardware-related operations must be done through hypercalls, thus reducing the direct interaction of Unikraft with the hardware.
 * [internal libraries](https://github.com/unikraft/unikraft/tree/staging/lib):
  These define behaviour independent of the hardware, like scheduling, networking, memory allocation, basic file systems.
  These libraries are the same for every platform or architecture, and rely on the platform code and the architecture code to perform the needed actions.
  The internal libraries differ from the external ones in the implemented functionalities.
  The internal ones define parts of the kernel, while the external ones define user-space level functionalities.
  For example, **uknetdev** and **lwip** are 2 libraries that define networking components.
  [Uknetdev](https://github.com/unikraft/unikraft/tree/staging/lib/uknetdev) is an internal library that interacts with the network card and defines how packages are sent using it.
  [Lwip](https://github.com/unikraft/lib-lwip) is an external library that defines networking protocols, like IP, TCP, UDP.
  This library knows that the packages are somehow sent over the NIC, but it is not concerned how.
  That is the job of the kernel.
