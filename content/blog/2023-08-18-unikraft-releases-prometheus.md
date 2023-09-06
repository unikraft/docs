---
title: "Unikraft releases v0.14.0 (Prometheus)"
date: "2023-08-17T23:00:00+01:00"
authors: [
  "Răzvan Deaconescu",
  "Ștefan Jumărea",
  "Martin Kröning",
  "Simon Kuenzer",
  "Sergiu Moga",
  "Michalis Pappas",
  "Maria Sfîrăială",
  "Andrei Tătar",
  "Răzvan Vîrtan"
]
tags: ["announcement"]
---

Unikraft v0.14.0 (Prometheus) is out!

This release is the result of extensive hard work during the last months in the entire community.
It comes packed with tons of fixes and new features that improve the overall Unikraft ecosystem.

In this blog post, we describe some of the new features available in Unikraft.
For a full breakdown, please check out the [changelog](https://github.com/unikraft/unikraft/compare/RELEASE-0.13.0...RELEASE-0.14.0).

### Native macOS (Darwin) Support ([#1034](https://github.com/unikraft/unikraft/pull/1034))

_This feature was championed by [Simon Kuenzer](https://github.com/skuenzer), [Mihailescu Eduard-Florin](https://github.com/Starnox), and [Răzvan Deaconescu](https://github.com/razvand) with important advice from [Alexander Jung](https://github.com/nderjung)._

With the release of Unikraft 0.14, the build system officially supports a macOS-based development environment.
Unikernel images can be developed, compiled, and tested directly on macOS.
Both types of Macs are supported: you can do this on a Mac with an Intel processor or with an Apple silicon.
Only the following packages are expected to be installed on the system via [Homebrew](https://brew.sh/):

```console
brew install gnu-sed make m4 gawk grep wget qemu socat git
# ...for compiling x86_64 unikernels
brew install x86_64-elf-binutils x86_64-elf-gcc
# ...for compiling aarch-64 unikernels
brew install aarch64-elf-binutils aarch64-elf-gcc
```

Behind the scenes, Unikraft uses the Python-based [Kconfiglib](https://github.com/ulfalizer/Kconfiglib) to configure Unikraft on a Mac.
The build system automatically chooses the Linux-equivalent command-line tools on Mac to perform a successful build.

1. Within a terminal session, Unikraft can be cloned in the same way as on Linux:

   ```console
   git clone https://github.com/unikraft/unikraft.git
   cd unikraft
   ```

1. Configuration and compilation can be invoked with `gmake`:

   ```console
   # Configure (select an architecture and platform)
   gmake menuconfig
   # Build
   gmake
   ```

1. Also on Mac, `qemu-guest` can support in running built Unikernels with QEMU:

   ```console
   support/scripts/qemu-guest -t arm64v -k build/unikraft_qemu-arm64
   ```

### UEFI Support on `x86_64` and `AArch64` ([#910](https://github.com/unikraft/unikraft/pull/910), [#909](https://github.com/unikraft/unikraft/pull/909))

_This feature was championed by [Sergiu Moga](https://github.com/mogasergiu) with amazing support from [Michalis Pappas](https://github.com/michpappas) and advice from [Răzvan Deaconescu](https://github.com/razvand), [Ștefan Jumărea](https://github.com/StefanJum) and [Răzvan Vîrtan](https://github.com/razvanvirtan)._

Unikraft bootable through `UEFI` on `arm64` / `AArch64` and `x86_64`.

Features:

- custom, minimalist built-in bootloader to act as a UEFI stub capable of loading Unikraft straight from UEFI firmware on both `x86_64` and `AArch64` by relocating the kernel, fetching the command-line, initial RAM disk, Devicetree blob and setting up the memory region descriptors as well as bridging the gap between the components initialized by UEFI and those supported by Unikraft
- script to create UEFI based disk and ISO Unikraft bootable images

### Linux Boot Protocol on `arm64` ([#988](https://github.com/unikraft/unikraft/pull/988))

_This feature was championed by [Michalis Pappas](https://github.com/michpappas) with the inputs of [Xingjian Zhang](https://github.com/zhxj9823) and [Sergiu Moga](https://github.com/mogasergiu)._

The [arm64 Linux boot protocol](https://www.kernel.org/doc/Documentation/arm64/booting.txt) defines the layout of a Linux image, the kernel parameters, and the system configuration expected by the boot environment.

Unikraft `0.14` introduces support for the `arm64` Linux boot protocol, which allows booting Unikraft into any environments that expects an `arm64` linux image, such as boot loaders or VMMs like Firecracker.

### Firecracker Support on `arm64` ([#989](https://github.com/unikraft/unikraft/pull/989))

_This feature was championed by [Michalis Pappas](https://github.com/michpappas) with the inputs of [Xingjian Zhang](https://github.com/zhxj9823) and [Sergiu Moga](https://github.com/mogasergiu)._

This release introduces the ability to boot `arm64` builds of Unikraft on Firecracker.
[Firecracker](https://firecracker-microvm.github.io/) is an ultra-light VMM that allows creating and running microVMs, combining the security and isolation properties of VMs with the flexibility and ease of use of containers.

### Dynamic `uk_store` API ([#939](https://github.com/unikraft/unikraft/pull/939))

_This feature was championed by [Cezar Crăciunoiu](https://github.com/craciunoiuc) and [Michalis Pappas](https://github.com/michpappas) with inputs from [Simon Kuenzer](https://github.com/skuenzer)_.

The `uk_store` API provides micro-libraries with the ability to register getters and setters for various properties.
Unikraft `0.14` enhances `uk_store` with the ability for microlibraries to dynamically create and destroy `uk_store` objects.
This paves the road for features like per-device statics, dynamic entries in virtual file systems like `procfs` / `sysfs`, and more.

### SUBBUILD Build System Feature ([#938](https://github.com/unikraft/unikraft/pull/938))

_This feature was championed by [Simon Kuenzer](https://github.com/skuenzer) with support from [Michalis Pappas](https://github.com/michpappas)._

This release introduces a so called `SUBBUILD` feature to the build system.
It adds the ability to place generated files (e.g., pre-processed, compiled units) in a subdirectory of a library build directory.
For this purpose, the build system looks for a file-scoped variable with the suffix `_SUBBUILD`.
Such a variable contains a path that is created below the library build directory.

The feature is especially useful for generating headers with a pre-processor, like AWK or M4.

An example `Makefile.uk`:

```Makefile
# Create `myheader.h` under `build/libmylib/include/uk/`
LIBMYLIB_SRCS-y            += $(LIBMYLIB_BASE)/myheader.m4>.h
LIBMYLIB_MYHEADER_SUBBUILD += include/uk

# Register the include folder of the library with the generated header
CINCLUDES-$(CONFIG_LIBMYLIB) += -I$(LIBMYLIB_BUILD)/include
```

### TREE BUILD Build System Feature ([#1001](https://github.com/unikraft/unikraft/pull/1001))

_This feature was championed by [Andrei Tatar](https://github.com/andreittr) with support from [Marco Schlumpp](https://github.com/mschlumpp), [Maria Sfîrăială](https://github.com/mariasfiraiala), [Ștefan Jumărea](https://github.com/StefanJum), and [Simon Kuenzer](https://github.com/skuenzer)._

TREE BUILD is an alternative library registration mode for the build system which automatically handles subdirectory paths for build products.
The work adds `addlib_tree` and `addlib_tree_s` as library registration functions.
For each library in tree mode, the build system places build products in a subdirectory structure that mirrors the directory structure of the corresponding source file.
This is a very handy tool to simplify the porting of libraries whose source files span multiple directories.

### `uklibid`: Library Identifiers ([#938](https://github.com/unikraft/unikraft/pull/938))

_This feature was championed by [Simon Kuenzer](https://github.com/skuenzer) with support from [Michalis Pappas](https://github.com/michpappas) and [Robert Kuban](https://github.com/kubanrob)._

Based on the SUBBUILD build feature, this release introduces library identifiers with `uklibid`.
The new library generates at compile-time unique IDs for each library.
Such a ID starts from `0` and increases linearly so that they can be used for table lookups with `O(1)` complexity.
The library provides helpers to map identifiers to names and vice versa.
`lib/ukdebug` and `lib/ukstore` are first users of this library and adopted accordingly.

A clear separation between runtime and compile-time resolution of library identifiers is done so that libraries can potentially be built off-tree and shipped in binary form.
Each library's own identifier (`uk_libid_self()`) is stored in a constant variable that is resolved during link-time.
The owner of the identifier variable is `uklibid`, so that the identifier is external to a binary library.

### `ukreloc`: Self-Relocation and Symbol-based Relocations ([#772](https://github.com/unikraft/unikraft/pull/772))

_This feature was championed by [Sergiu Moga](https://github.com/mogasergiu) with amazing support from [Michalis Pappas](https://github.com/michpappas), [Marco Schlumpp](https://github.com/mschlumpp) and advice from [Răzvan Deaconescu](https://github.com/razvand) and [Dragoș Petre](https://github.com/dragosp27)._

Unikraft is now position independent, can be built as a static `PIE` and self relocate on both `x86_64` and `ARM64`.

Features:

- `CONFIG_OPTIMIZE_PIE` to build Unikraft as a static `PIE`
- `CONFIG_LIBUKRELOC` automatically selected by `CONFIG_OPTIMIZE_PIE` and implements Unikraft's custom relocation system:
  - custom macro-definitions to be used as relocation friendly alternatives to various instructions (`ldr` -> `ur_ldr`, `mov` -> `ur_mov`) as well as numerical values declarations GNU Assembler directives (`.quad`/`.long`/`.short`/etc -> `ur_data`) and a way to create relocatable static Page Table entries (`ur_pte`).
  - self relocator written in C to be used in 64-bit operating mode
  - 32-bit self relocator written in assembly to be used by early code that runs in x86 Protected Mode (e.g. when booting from Multiboot)

### Individual Volume Automounting ([#979](https://github.com/unikraft/unikraft/pull/979))

_This feature was championed by [Sergiu Moga](https://github.com/mogasergiu) with support from [Simon Kuenzer](https://github.com/skuenzer) and advice from [Radu Nichita](https://github.com/RaduNichita) and [Ștefan Jumărea](https://github.com/StefanJum)._

It is now possible to dynamically mount additional volumes via the introduction of a new command-line argument `vfs.fstab` that is meant to contain a list of whitespace separated strings with the following format:

```text
vfs.fstab=[
    "<src_dev>:<mntpoint>:<fsdriver>[:<flags>:<opts>]"
    "<src_dev>:<mntpoint>:<fsdriver>[:<flags>:<opts>]"
    ...
]
```

The core will parse the provided strings as volume information and attempt to mount them accordingly, if `CONFIG_LIBVFSCORE_FSTAB` is provided.

### vDSO and vsyscall Support for Binary Compatibility ([#23](https://github.com/unikraft/app-elfloader/pull/23))

_This feature was championed by [Tianyi Liu](https://github.com/i-Pear) with great support from [Simon Kuenzer](https://github.com/skeunzer), and insights from [Teodor Țeugea](https://github.com/John-Ted) and [Ștefan Jumărea](https://github.com/unikraft/StefanJum)._

The `vsyscall` (_virtual system call_) is the first and oldest mechanism used to accelerate system calls.
Due to security concerns, it has been deprecated, and `vDSO` (_virtual dynamic shared object_) serves as its successor.
However, in the context of unikernels, kernel isolation is not a concern, allowing us to utilize both of them.
The [`app-elfloader`](https://github.com/unikraft/app-elfloader) now supports both of these features.

If you don't have the source code of your application but desire the performance of Unikraft, [`app-elfloader`](https://github.com/unikraft/app-elfloader) can load unmodified ELF files.
However, there will be some performance overhead compared to a native build, while the two newly introduced features can help mitigate this difference.

The `vDSO` is available for both dynamically linked applications and statically linked ones, to accelerate certain commonly used time-related system calls (`clock_gettime`, `gettimeofday`, `time`, `clock_getres`).
As a result, some server programs can experience significant performance improvements.

If your application is dynamically linked, it can further utilize `vsyscall` to avoid costly binary syscalls (since `vsyscall` has been deprecated in the latest version of libc, we provide patched dynamic runtime libraries for [`glibc`](https://github.com/unikraft/fork-glibc) and [`musl`](https://github.com/unikraft/fork-musl)).

### Application Updates

_This feature was championed by in the community by [Ștefan Jumărea](https://github.com/StefanJum), [Radu Nichita](https://github.com/RaduNichita), [Andrei Tatar](https://github.com/andreittr), [Răzvan Deaconescu](https://github.com/razvand), [Alexander Jung](https://github.com/nderjung) and participants at various Unikraft hackathons._

The [Unikraft applications](https://github.com/unikraft/?q=app-&type=all&language=&sort=) now contain `README.md` files with very easy to use instructions for running the applications, both using [`kraftkit`](https://github.com/unikraft/kraftkit) and the `Make`-based build system.
We take advantage of the `defconfig` build rule, that can generate a full `.config` file starting from a given minimal configuration.
The minimal configurations (for multiple supported platforms and architectures) are already provided in the application repositories, and can be used as such:

```console
UK_DEFCONFIG=$(pwd)/.config.helloworld_qemu-x86_64 make defconfig
```

After the configuration file is generated, the application can be build using `make` and run using the instructions from the `README.md` files.

Along with that, many applications have been ported to use Musl as the default libc.
Some of the more important ones are [`app-lua`](https://github.com/unikraft/app-lua), [`app-duktape`](https://github.com/unikraft/app-duktape/), [`app-click`](https://github.com/unikraft/app-click/), [`app-wamr`](https://github.com/unikraft/app-wamr).

As part of the [Unikraft Summer of Code](https://unikraft.org/community/hackathons/usoc23/) final hackathon, we also focused on the binary compatibility side, porting a lot of new applications and adding them in the [`dynamic-apps` repository](https://github.com/unikraft/dynamic-apps/).
Among the new ported applications are [`lua`](https://github.com/unikraft/dynamic-apps/tree/master/lang/lua), [`ruby`](https://github.com/unikraft/dynamic-apps/tree/master/lang/ruby), [`iputils`](https://github.com/unikraft/dynamic-apps/tree/master/iputils), [`redis7`](https://github.com/unikraft/dynamic-apps/tree/master/redis7).

In order to have a one to one version match between the binary compatibility and native application, [`app-redis`](https://github.com/unikraft/app-redis) was also updated to version `7.0.11`, from `5.0.6`.

### GitHub Actions for CI ([#1012](https://github.com/unikraft/unikraft/pull/1012))

_This feature was championed by [Alexander Jung](https://github.com/nderjung) and [Cezar Crăciunoiu](https://github.com/craciunoiuc) with support from [Răzvan Deaconescu](https://github.com/razvand)._

Preliminary steps in using GitHub actions as a continuous integration have been undertaken.
These allow the building and running of tests at PR submissions, as a complement and future replacement of the current [Concourse-based system](https://builds.unikraft.io/).

In conjunction to this, a new [application `catalog` repository](https://github.com/unikraft/catalog) will store application files and serve as the sole go-to place for grabbing applications that can be built and run on top of Unikraft.

### Improved Python Support ([lib-python3:15](https://github.com/unikraft/lib-python3/pull/15))

_This feature was championed by [Andrei Tatar](https://github.com/andreittr) with support from and [Ștefan Jumărea](https://github.com/StefanJum), [Radu Nichita](https://github.com/RaduNichita) and [Maria Sfîrăială](https://github.com/mariasfiraiala)._

The [Unikraft port of Python 3](https://github.com/unikraft/lib-python3) has been updated to upstream version [3.10.11](https://docs.python.org/3.10/whatsnew/3.10.html), with the [Python 3 Demo App](https://github.com/unikraft/app-python3) similarly updated.

Notable changes:

- Functional `asyncio`
- More robust root filesystem build
- Many standard lib functionality & stability improvements

We are also excited to announce the first native ports of third-party Python packages:

- [NumPy](https://github.com/unikraft/lib-python-numpy)
- [Shapely](https://github.com/unikraft/lib-python-shapely)

### Updated Go Support ([lib-libgo:#23](https://github.com/unikraft/lib-libgo/pull/7)

_This feature was championed by [Marc Rittinghaus](https://github.com/marcrittinghaus) and [Eduard Vintilă](https://github.com/eduardvintila) with support from [Ștefan Jumărea](https://github.com/StefanJum) and [Radu Nichita](https://github.com/RaduNichita)_.

We update the Go support to version 1.18 an fully integrated `lib-go` with Musl.
Go applications are now fully functional on top of Unikraft for `x86_64`.

In the near future Go support will be updated for `AArch64`.

### Integrated Clang Support ([#23](https://github.com/unikraft/app-elfloader/pull/23))

_This feature was championed by [Maria Sfîrăială](https://github.com/mariasfiraiala) with input from [Michalis Pappas](https://github.com/michpappas) and [Ștefan Jumărea](https://github.com/StefanJum)._

We now provide `Clang` support for compiling for `x86_64` and cross-compiling for `AArch64` targets.
This is exciting news as it opens the door for cool compiler enforced security features and better integration for platforms such as Darwin ([unikraft#685](https://github.com/unikraft/unikraft/pull/685)).

Use the following command to compile with Clang, both on `x86_64` and on `AArch64` (depending on the configuration):

```console
$ make CC=clang
```

### Coding Conventions ([docs:#248](https://github.com/unikraft/docs/pull/248))

_This feature was championed by [Marc Rittinghaus](https://github.com/marcrittinghaus), [Michalis Pappas](https://github.com/michpappas), [Simon Kuenzer](https://github.com/skuenzer), [Marco Schlumpp](https://github.com/mschlumpp) and [Radu Nichita](https://github.com/RaduNichita) based on numerous meetings where the Unikraft community provided insight._

We're excited to announce [an official coding conventions guideline](https://github.com/unikraft/docs/blob/main/content/en/docs/contributing/coding-conventions.md)!
This comprehensive document outlines that one should have in mind when submitting contributions to out codebase, whether it's a first-time contributor or a well-known veteran.

By introducing these conventions, we want to ensure consistent and clean code across all our repositories and make maintenance more efficient.
The document includes naming conventions, indentation guidelines, commenting practices, and many more.
Happy coding!

### External Build System Integration (`kraftld`) ([#957](https://github.com/unikraft/unikraft/pull/957))

_This feature was championed by [Martin Kröning](https://github.com/mkroening) with support from [Marco Schlumpp](https://github.com/mschlumpp) and [Simon Kuenzer](https://github.com/skuenzer)._

You can now influence the Unikraft build process via a set of environment variables.

- `UK_ASFLAGS`: explicit Unikraft-specific additions to the assembler flags (the `ASFLAGS` variable is ignored)
- `UK_CFLAGS`: explicit Unikraft-specific additions to the C compiler flags (the `CFLAGS` variable is ignored)
- `UK_CXXFLAGS`: explicit Unikraft-specific additions to the C++ compiler flags (the `CXXFLAGS` variable is ignored)
- `UK_GOCFLAGS`: explicit Unikraft-specific additions to the GO compiler flags (the `GOCFLAGS` variable is ignored)
- `UK_LDFLAGS`: explicit Unikraft-specific additions to the linker flags (the `LDFLAGS` variable is ignored)
- `UK_LDEPS`: explicit, space-separated link-time file dependencies (changes to these files will trigger relinking on subsequent builds)

This info is also shown on `make help`.

The `UK_LDFLAGS` and `UK_LDEPS` flags are of special interest, as they allow injecting externally built object files into the Unikraft image.
This approach will be further integrated into KraftKit via [`kraftld`](https://github.com/unikraft/kraftkit/pull/703).
`kraftld` is a drop-in replacement for a gcc-flavored linker, allowing the transparent linking of object files into Unikraft images.
A follow-up blog post will describe this approach and its design in more detail and will show how this is used to bring Rust support to Unikraft.

### `ADOPTERS.md` File ([#892](https://github.com/unikraft/unikraft/pull/892))

_This feature was championed by [Alexander Jung](https://github.com/nderjung) with support from [Răzvan Deaconescu](https://github.com/razvand)._

We want to keep track of entities using Unikraft and foster collaboration.
Inside the `unikraft` core repository there is now [an `ADOPTERS.md` file](https://github.com/unikraft/unikraft/blob/staging/ADOPTERS.md) storing Unikraft users and, ideally, contributors (companies, universities, institutions) that benefit from using Unikraft as part of their commercial, research or teaching activities.

If you are an entity using Unikraft, follow the [submission guidelines](https://unikraft.org/docs/contributing/submitting-changes/) and submit a pull request to update [the `ADOPTERS.md` file](https://github.com/unikraft/unikraft/blob/staging/ADOPTERS.md).
And expect full support from the Unikraft community in assisting your work and integrating contribution in the Unikraft project.

## Community Activities

### Unikraft Summer of Code 2023

_This activity was lead by [Ștefan Jumărea](https://github.com/StefanJum) with the active involvement of [Cezar Crăciunoiu](https://github.com/craciunoiuc), [Răzvan Deaconescu](https://github.com/razvand), [Eduard Vintilă](https://github.com/eduardvintila), [Radu Nichita](https://github.com/RaduNichita), [Vlad Bădoiu](https://github.com/vladandrew), [Sergiu Moga](https://github.com/mogasergiu), [Luca Serițan](https://github.com/LucaSeri), [Teodor Țeugea](https://github.com/John-Ted)._

The third edition of [Unikraft Summer of Code](https://unikraft.org/community/hackathons/usoc23/) took place this July, had about 45 participants, and consisted in 6 sessions and a final hackathon.
The sessions covered topics like building and running unikernels, debugging, porting applications, etc.
The final hackathon was a full day event, and the participants had their chance to apply the things they've learned and to contribute to Unikraft.
It took place both in person, at [University POLITEHNICA of Bucharest](https://upb.ro/en), and online, on Discord.
A lot of work was done on application porting and binary compatibility, with more than 35 issues and pull requests opened.

We plan to keep organising the Unikraft Summer of Code in the following years, and make people eager to learn more about low-level topics, operating systems, unikernels, and, most importantly, the open source world.

{{< figure
    src="/assets/imgs/usoc23-hackathon.jpg"
    position="center"
}}

### Unikernels Alliance

As we want to speed up the unikernels ascent, we decided to organize a discussion group involving all the people that are interested and bring their contribution into this field.

We decided to name our group the "Unikernel Alliance".
This is a community formed from existing unikernel and libOS communities, aimed at popularizing and promoting unikernel-like solutions in research, industry and in technical communities.

We organize monthly meetings, featuring technical talks from the group members.
Until now, we have organized three meetings.
You can find the recordings and slides [here](https://drive.google.com/drive/folders/1qXcdpCXb8iKxsQzgP5GBEFwQ06wa1x1L?usp=share_link).

Feel free to join [the discussion group](https://groups.google.com/u/1/g/unikernel-alliance), [our Slack channel](https://join.slack.com/t/unikraftworkspace/shared_invite/zt-1v5zz3l3l-B6~36Me9SpWycaS2TximSA) and to be part of our next meeting on Thursday, August 31, 2023, 6pm CEST, online, on Zoom.

### Unikernels in the Wild

Together with our friends from [RWTH Aachen](https://www.rwth-aachen.de/go/id/a/?lidx=1), we organized the first edition of [Unikernels in the Wild](https://www.acs.eonerc.rwth-aachen.de/cms/E-ON-ERC-ACS/Das-Institut/Aktuelle-Meldungen-Institut/~bapbol/Unikernel-Community-Meeting-Aachen/?lidx=1), an event centered on knowledge sharing in the Unikernels area.
[Răzvan Deaconescu](https://github.com/razvand) and [Răzvan Vîrtan](https://github.com/razvanvirtan) participated from our side, having presentations and offering support during the practical workshops.

The day started with a few presentations about the general view and latest updates in [RustyHermit](https://github.com/hermitcore/rusty-hermit).
Then, we moved on with two presentations about binary compatibility and memory allocation in Unikraft.
Also, our collaborators from [Nubificus](https://nubificus.co.uk/) (remember the [Athens Hackathon](https://unikraft.org/community/hackathons/2023-03-athens/)?) gave a presentation about their work on getting unikernels into the DevOps mainstream.
The day ended with two hands-on sessions for Unikraft and [RustyHermit](https://github.com/hermitcore/rusty-hermit).

This event has been a great chance for getting together people from the Unikernels community and we hope it will become a tradition!

{{< figure
    src="/assets/imgs/unikernels-in-the-wild-2023-07-07.jpg"
    position="center"
}}

If you are using Unikraft, consider adding your affiliation in our [`ADOPTERS.md`](https://github.com/unikraft/unikraft/blob/staging/ADOPTERS.md) file.
We use this file to keep a track of entities that use Unikraft for their commercial and / or research work.

### Google Summer of Code 2023

We are proud to be one of the Google Summer of Code organizations for the second year in a row!

During these last months, our 5 students have started their work and already achieved some amazing intermediary results!
You can find more about the progress of our mentees in the following blog posts:

- [**Afsar Sahil**](https://github.com/MdSahil-oss): [Enhancing the VSCode Developer Experience](https://unikraft.org/blog/2023-06-23-unikraft-gsoc-enhancing-vscode-developer-experience/)
- [**Rareș Miculescu**](https://github.com/rares-miculescu): [re:Arch Unikraft](https://unikraft.org/blog/2023-06-22-unikraft-gsoc-plat-rearch/)
- [**Tianyi Liu**](https://github.com/i-Pear): [Expanding binary compatibility mode](https://unikraft.org/blog/2023-06-23-unikraft-gsoc-app-compat-1/)
- [**Zeyu Li**](https://github.com/zyllee): [Packaging Pre-built Micro-libraries for Faster and More Secure Builds](https://unikraft.org/blog/2023-06-23-unikraft-gsoc-packaging-libs-1/)
- [**Zhang Xingjian**](https://github.com/zhxj9823): [Arm CCA Support for Unikraft](https://unikraft.org/blog/2023-06-23-unikraft-gsoc-arm-cca-1/)

Stay tuned for news regarding the final status of their projects!
