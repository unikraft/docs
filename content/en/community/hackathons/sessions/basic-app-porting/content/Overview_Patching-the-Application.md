Patching the application occasionally must occur to address incompatibilities with the context of a Linux user space application and that of the unikernel model.
It can also be used to introduce new features to the application, although this is  rare (although, [here is an example](https://github.com/unikraft/lib-newlib/blob/staging/patches/0010-enable-per-library-allocator-statistics.patch)).


#### Identifying a Change to the Application

Identifying a change to the application which requires a patch is sometimes quite subtle.
The process usually occurs during [steps 5 and 6 of providing build files](/community/hackathons/usoc22/basic-app-porting/#providing-build-files) of the application or library in question.
During this process, we are expected to see compile-time and link-time errors from `gcc` as we add new files to the build and make fixes.

The `iperf3` application port to Unikraft has four patches in order to make it work.
Let's discuss them and what they mean.
The next section discusses how to create one of these patches.

1. [The first patch](https://github.com/lancs-net/lib-iperf3/blob/staging/patches/0001-Fix-duplicate-import-of-netinet-tcp.h.patch) comes from an error which is thrown when compiling the `iperf_api.c` source file.
   This file is 3rd to be compiled from the list of complete source files.
   In this file, we are receiving a duplicate import of `<netinent/tcp.h>`, simply removing this import fixes it, so the patch addresses this issue.

1. [The second patch](https://github.com/lancs-net/lib-iperf3/blob/staging/patches/0002-Disable-SO_SNDBUF-and-SO_RCVBUF-checks.patch) comes as a result of [missing functionality from LwIP](https://github.com/lwip-tcpip/lwip/blob/b0e347158d8db640c6891f9f31f4e6d19dca200b/src/include/lwip/sockets.h#L220).
   The issue was discovered once the application was fully ported and was able to boot and run.
   When the initialization sequence was on-going between the client and server of `iperf3`, it would crash during this sequence because LwIP does not support setting this option.
   A patch was created simply to remove setting this option.
   (Note: this may not be the most sensible approach)

1. [The third patch](https://github.com/lancs-net/lib-iperf3/blob/staging/patches/0003-Set-the-temp-path-to-the-root.patch) arises from an assumption about the host environment and the difference between Linux user space and a unikernel.
   With a traditional host OS, we have a filesystem populated with known paths, for example `/tmp`.
   `iperf3` assumed this path exists, however, in the case of where no filesystem is provided to the unikernel during boot, which should be possible in some cases, the `iperf3` application would crash since `/tmp` does not exist beforehand.
   The patch solves this by setting the temporary (ramfs) path to `/`.
   An alternative solution is to make this path at boot.

1. [The fourth patch](https://github.com/lancs-net/lib-iperf3/blob/staging/patches/0004-Disable-use-of-mmap-and-replace-with-mmalloc-and-fr.patch)(Optional) is optional.
   In this case, the syscalls [`mmap`](https://linux.die.net/man/2/mmap) and [`munmap`](https://linux.die.net/man/2/munmap) were missing.
   In this case, `iperf3`, used `mmap` simply to statically allocate a region of memory.
   The trick used here is to simply replace instances of `mmap` with `malloc` and instances of `munmap` with `free`.

   **Note:** At the time writing this tutorial, [`mmap` and `munmap` are being actively worked on to be made available as syscalls in Unikraft](https://github.com/unikraft/unikraft/pull/247).

The above patches represent example use cases where patches may be necessary to fix the application when bringing it to Unikraft.
The possibilities presented in this tutorial are non-exhaustive, so take care.

The next section discusses in detail how to create a patch for the target application or library.


#### Preparing a Patch for the Application

When a change is identified and is to be provided as a patch to the application or library during the compilation, it can be done using the procedure identified in this section.
Note that providing patches are an unfortunate workaround to the inherent differences between Linux user space applications and libraries and unikernels.

**Note:** When patches are created, they are also version-specific.
As such, if you update the library or application's code (i.e. by updating, for example, the version number of `LIBIPER3_VERSION`), patches may no longer be apply-able and will then need to be updated accordingly.

To make a patch:

1. First, ensure that the remote origin code has been downloaded to the application's `build/` folder:

   ```bash
   $ cd ~/workspace/apps/iperf3
   $ kraft fetch
   ```

1. Once the source files have been downloaded, turn it into a Git repository and save everything to an initial commit, in the case of `iperf3`:

   ```bash
   $ cd build/libiperf3/origin/iperf-3.10.1
   $ git init
   $ git add .
   $ git commit -m "Initial commit"
   ```

   This will allow us to make changes to the source files and save those differences.

1. After making changes, create a Git commit, where you briefly describe the change you made and why.
   This can be done through a number of successive steps, for example, as a result of having to make several changes to the application.

1. After your changes have been saved to the git log, export them as patches.
   For example, if you have made one (`1`) patch only, export it like so:

   ```bash
   git format-patch HEAD~1
   ```

   This will save a new `.patch` file in the current directory; which should be the origin source files of `iperf3`.

5. The next step is to create a `patches/` folder within the Unikraft port of the library and to move the new `.patch` file into this folder:

   ```bash
   mkdir ~/workspace/libs/iperf3/patches
   mv ~/workspace/apps/iperf3/build/libiperf3/origin/iperf-3.10.1/*.patch ~/workspace/libs/iperf3/patches
   ```

6. To register patches against Unikraft's build system such that they are applied before the compilation of all source files, simply indicate it in the library's `Makefile.uk`:

   ```Makefile
   # Add or edit ~/workspace/libs/iperf3/Makefile.uk
   LIBIPERF3_PATCHDIR = $(LIBIPERF3_BASE)/patches
   ```

This concludes the necessary steps to port an application to Unikraft `from first principles`.
