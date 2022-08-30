* Unikraft is a special type of operating system, that can be configured to match the needs of a specific application.
* This configuration is made possible by a system based on Kconfig, that uses **Config.uk** files to add possible configurations, and **.config** files to store the specific configuration for a build.
* The configuration step creates symbols that are visible in both Makefiles and source code.
* Each component has its own **Makefile.uk**, where source files can be added, removed, or be made dependent on the configuration.
* Unikraft has an internal libc, but it can use others, more complex and complete, like newlib and musl.
* Being an operating system, it needs to be run by a hypervisor, like KVM or xen, to work at full capacity.
  It can also be run as an ELF, in Linux, but in this way the true power of Unikraft is not achieved.
