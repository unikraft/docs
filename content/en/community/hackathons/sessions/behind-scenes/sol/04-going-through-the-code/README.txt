The kernel messages are sent by `uk_pr_{level}` functions, where level can be
debug, info, warn, err and crit. In setup.c, hardware components are initialized,
in the _libkvmplat_entry function, then the stack is changed, and
_libkvmplat_entry2 is called. That function calls ukplat_entry_argp, which
constructs argc and argv, then calls ukplat_entry. Here, software components
are initialized, like the memmory allocator, the scheduler, the arguments
are parsed to see if any of those arguments are destined to a library,
interrupts are enabled, the clock is set up, and the main function, from
the application, is called. This happens around line 290, in the boot.c
source file.

But the main function is not called instantly. First, some more
initialization takes place, namely the constructors are called. You will
learn about constructors in the following sessions. The real main call
happens at line 160, in boot.c.
