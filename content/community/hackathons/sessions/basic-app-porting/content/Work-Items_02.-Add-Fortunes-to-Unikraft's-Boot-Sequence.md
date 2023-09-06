In this task, we are diving a little deeper into Unikraft's core and finding an opportunity to meddle with internal features which can prove handy for certain application contexts.
In this case, we are going to play with Unikraft's extensible boot sequence to provide fortunes during the boot of an application.
After word got out, we found that everybody wanted fortunes, right before the application started and `main()` was called.
This will provide the runtime of the unikernel with good fortune and save it from crashes.

Unikraft calls various `constructor` (`ctor`) and `initialiser` (`init`) methods during its boot sequence.
These constructors and initialisers are located in a static section of the final binary image, `ctortab` and `inittab`, respectively.
There are 7 entry points during the boot sequence:

| Order | Level | Registering method                  | Type   |
|------:|------:|-------------------------------------|--------|
|     1 |     1 | `UK_CTOR_PRIO(fn, prio)`            | `ctor` |
|     2 |     1 | `uk_early_initcall_prio(fn, prio)`  | `init` |
|     3 |     2 | `uk_plat_initcall_prio(fn, prio)`   | `init` |
|     4 |     3 | `uk_lib_initcall_prio(fn, prio)`    | `init` |
|     5 |     4 | `uk_rootfs_initcall_prio(fn, prio)` | `init` |
|     6 |     5 | `uk_sys_initcall_prio(fn, prio)`    | `init` |
|     7 |     6 | `uk_late_initcall_prio(fn, prio)`   | `init` |

New constructors and initialisers can be registered using the methods defined above at various levels (meaning they are called in that order) and at various priorities (between `0` and `9`) allowing the registration of numerous constructors or initialisers at the same level.
This allows application developers or library developers to correctly set up the unikernel by registering a constructor or initialiser at the right time or before or after others.

Initialisers have 6 different levels, allowing code to be injected before certain operations occur during the boot sequence.
This includes, in order: before and after the `platform` drivers are initialised; before and after all `libraries` are initialised; before and after all filesystems (`rootfs`) are initialised; and, before and after various `system` methods are called.

The source code for this sequence is defined in [`ukboot`](https://github.com/unikraft/unikraft/blob/staging/lib/ukboot/boot.c).

In this task, add a new KConfig option to the Unikraft port of `libfortune` which allows you to enable or disable the ability to introduce a fortune during the boot sequence of a Unikernel.
Demonstrate the ability of using this library by building the Unikraft port of `libfortune` to the Unikraft port of [python3](https://github.com/unikraft/app-python3) and show a fortune before the Unikraft banner.
