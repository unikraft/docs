Once the application is configured, in **.config**, symbols are defined (e.g. `CONFIG_ARCH_X86_64`).
Those symbols are usable both in the C code, to include certain functionalities only if they were selected in the configuring process, and in the actual building process, to include / exclude source files, or whole libraries.
This last step is done in **Makefile.uk**, where source code files are added to libraries.
During the build process, all the `Makefile.uk` files (from the Unikraft core and external libraries) are evaluated, and the selected files are compiled and linked, to form the Unikraft image.

| ![unikraft build](/community/hackathons/sessions/behind-scenes/images/build_uk.svg) |
| :--: 									 |
| The build process of Unikraft 					 |
