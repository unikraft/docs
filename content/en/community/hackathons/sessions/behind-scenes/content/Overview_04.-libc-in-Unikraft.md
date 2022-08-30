The Unikraft core provides only the bare minimum components to interact with the hardware and manage resources.
A software layer, similar to the standard C library in a general-purpose OS, is required to make it easy to run applications on top of Unikraft.

Unikraft has multiple variants of a libc-like component:

* [nolibc](https://github.com/unikraft/unikraft/tree/staging/lib/nolibc) is a minimalistic libc, part of the core Unikraft code, that contains only the functionality needed for the core (strings, qsort, etc).
* [isrlib](https://github.com/unikraft/unikraft/tree/staging/lib/isrlib) is the interrupt-context safe variant of nolibc.
  It is used for interrupt handling code.
* [newlibc](https://github.com/unikraft/lib-newlib) is the most complete libc currently available for Unikraft, but it still lacks some functionalities, like multithreading.
  Newlibc was designed for embedded environments.
* [musl](https://github.com/unikraft/lib-musl) is, theoretically, the best libc that will be used by Unikraft, but it's currently in testing.

Nolibc and isrlib are part of the Unikraft core.
Newlibc and musl are external libraries, from the point of view of Unikraft, and they must be included to the build, as shown in [Session 01: Baby Steps](community/hackathons/sessions/baby-steps).
