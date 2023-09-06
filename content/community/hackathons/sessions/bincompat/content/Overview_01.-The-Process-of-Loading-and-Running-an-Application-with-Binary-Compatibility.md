For Unikraft to achieve binary compatibility there are two main objectives that need to be met:

1. The ability to pass the Linux ELF binary to Unikraft at boot time.
1. The ability to load the passed ELF binary into memory and jump to its entry point.

The dominant format for executables is the *Executable and Linkable File* format (ELF), so, in order to run executables we need an ELF loader.
The job of the ELF Loader is to load the executable into the main memory.
It does so by reading the program headers located in the ELF formatted executable and acting accordingly.

As an overview of the whole process, when we want to run an application on Unikraft using binary compatibility, the first step is to pass the executable file to the unikernel as an initial ram disk.
Once the unikernel gets the executable, it reads the executable segments and loads them accordingly.
After the program is loaded, the last step is to jump to its entry point and start executing.

The unikernel image is the [`app-elfloader` application](https://github.com/unikraft/app-elfloader).
This application parses the ELF file and then loads it accordingly.
It's a custom application developed for Unikraft.

We require PIE (*position-independent executable*) ELFs.
This is fine, as default Linux executables are built as PIE.

We have collected PIE executables in:

- the [`dynamic-apps`](https://github.com/unikraft/dynamic-apps) repository - storing dynamically-linked executables
- the [`static-pie-apps`](https://github.com/unikraft/static-pie-apps) repository - storing statically-linked executables
