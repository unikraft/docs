---
title: "Unikraft releases v0.13.0 (Atlas)"
date: "2023-05-15T22:00:00+01:00"
authors: [
  "Răzvan Deaconescu",
  "Alexander Jung",
  "Simon Kuenzer",
  "Marco Schlumpp",
  "Răzvan Vîrtan"
]
tags: ["announcement"]
---

Unikraft v0.13.0 (Atlas) is out!

As usual, this release adds important fixes and comes with a bunch of new features.

In this blog post, we describe some of the new features available in Unikraft. For a full breakdown, please check out the [changelog](https://github.com/unikraft/unikraft/compare/RELEASE-0.12.0...RELEASE-0.13.0).


## New Synchronization Primitives ([#476](https://github.com/unikraft/unikraft/pull/476))

_This feature began as a [Google Summer of Code 2022 (GSoC22) project](https://github.com/unikraft/gsoc/blob/staging/gsoc-2022/ideas.md#smp-synchronization), and it was championed by [Sairaj Kodilkar](https://github.com/Sairajkodilkar) under the guidance of [Marc Rittinghaus](https://github.com/marcrittinghaus) and [Andra Paraschiv](https://github.com/andraprs) with support from [Radu Nichita](https://github.com/RaduNichita) and [Răzvan Deaconescu](https://github.com/razvand)._

The release introduces an IRQ safe API for the spinlock as well as SMP safe mutex implementation.  Previously for UP arch, the Mutex disabled the interrupt, this implementation also synchronized the wait queue.  Along with this, the previous implementation also used the two conditions to indicate the lock that lock is free, which was:

```
owner == current || lock_count == 0;
```

However, if we observe closely we can separate these conditions since if the owner is the current thread then we can increment the lock count, otherwise, we can wait for the current to be null and can acquire the lock.  This implementation does not disable interrupts, but we can definitely introduce an API that does.  One requirement of this commit is that we need to separately implement the SMP safe wait queue. Currently, these wait queue is only used in uklock lib, but SMP safe wait queues can be used anywhere in the kernel.

More can be read about this implementation in:

- https://unikraft.org/blog/2022-06-27-unikraft-synchronization/
- https://unikraft.org/blog/2022-07-19-unikraft-synchronization/


## Native Firecracker VMM Support ([#760](https://github.com/unikraft/unikraft/pull/760))

_This feature was championed by [Marco Schlumpp](https://github.com/mschlumpp) with important advice from [Marc Rittinghaus](https://github.com/marcrittinghaus), [Sergiu Moga](https://github.com/mogasergiu) and [Andrei Topala](https://github.com/Krechals)._

**⚠️ This addition results in a breaking change to Unikraft's output binary artifact name.**

This release introduces support for booting Unikraft on the Firecracker VMM.  Compared to QEMU, this enables even faster boot times for Unikraft unikernels.  This support was built on top of the boot code refactoring in the previous release, and therefore shares most of the code with the entry point of QEMU.

Currently, Unikraft's virtio drivers do not work with firecracker. This will be addressed with a future release.

Previously, when building for x86_64 and targeting KVM, the resulting binary artifact would be output as, in the case of the helloworld application, `helloworld_kvm-x86_64`.  The new artifact name now targets the VMM, so the result will be `helloworld_qemu-x86_64` or `helloworld_fc-x86_64` in the case of Firecracker.


## `posix-environ`: Handling Environmental Variables ([#868](https://github.com/unikraft/unikraft/pull/868))

_This feature was championed by [Simon Kuenzer](https://github.com/skuenzer) with support from [Răzvan Deaconescu](https://github.com/razvand), [Eduard Mihăilescu](https://github.com/Starnox) and [Job Paardekooper](https://github.com/jobpaardekooper)._

This release introduces the handling of environment variables with the `posix-environ` library. The environment variables vector `environ` can be populated at compile time and at runtime if  `uklibparam` is configured as part of a build. The library provides POSIX-conformant getters and setters, like `getenv()` and `setenv()`.

The variables provided at compile-time are configurable with `make menuconfig` under `Library Configuration --> posix-environ --> Compiled-in environment variables`. 16 slots are available and the initial `environ` vector is created with the filled slots.

Additionally, the configuration option `Parse kernel command line arguments` enables setting further initial environment varaibles via the kernel command line. For this purpose, the parameter `env.vars` accepts an array of strings that is appended to the compile-time initialized vector.

As example, the following command line snippet sets the variables `PATH`, `UID`, `GID`, and `LD_LIBRARY_PATH=/lib`:

```text
env.vars=[ "PATH=/bin" "UID=0" "GID=0" "LD_LIBRARY_PATH=/lib" ] --
```


## Rewriting `uklibparam` ([#867](https://github.com/unikraft/unikraft/pull/867))

_This feature was championed by [Simon Kuenzer](https://github.com/skuenzer) with advice from [Alexander Jung](https://github.com/nderjung) and [Răzvan Deaconescu](https://github.com/razvand)._

Unikraft's library parameter parser is originally rewritten for providing support for environment variables with the kernel command line (see [`posix-environ`](https://github.com/unikraft/unikraft/tree/staging/lib/posix-environ)).

Besides ensuring an allocation-free and TLS-free implementation for early boot code, `uklibparam` now relies on pre-processed argument vectors, like with `ukargparse`. This avoids duplicated processing of quotes while naturally enabling support for single quotes (`'`), double quotes (`"`), and nested quoting. Also, arrays of strings are supported by this release.

A new set of registration macros simplifies the registration process and introduces the ability to specify a description that is displayed with the `help` kernel command:

```text
Usage of command line:
   [help] [PREFIX.PARAMETER=VALUE]... -- [APPLICATION ARGUMENT]...

Special commands:
        help                   Print this help summary

Available parameters:
         env.vars              Environment variables (array[8] of charp)
         vfs.rootfs            rootfs (charp)
         vfs.rootdev           rootdev (charp)
         vfs.rootopts          rootopts (charp)
         vfs.rootflags         rootflags (u64)

Numbers can be passed in decimal, octal ("0" as prefix), or hexadecimal ("0x" as prefix).
Valid boolean values for 'true' are: "true", "on", "yes", a non-zero number.
Valid boolean values for 'false' are: "false", "off", "no", a zero number (e.g., "0").
Boolean parameters that are passed without a value will be set to 'true'.
Array parameters can be passed with multiple 'PREFIX.PARAMETER=VALUE' tokens,
using a list: 'PREFIX.PARAMETER=[ VALUE0 VALUE1 ... ]', or a combination of both.
Please refer the application manual or application help for application arguments.
```

A library has only to include `uk/libparam.h`, declare the variables and register those to `uklibparam`. The following example demonstrates how this is done with C code:

```c
#include <stddef.h> /* NULL */
#include <uk/libparam.h>

/* Declarations with default values */
static char *myvar="My parameter";
static char *myvec[4]={ NULL };

/* Registration to uklibparam
 * NOTE: The macro automatically removes the registration if
 *       lib/uklibparam is excluded from the configuration.
 */
UK_LIBPARAM_PARAM(myvar, charp, "My variable");
UK_LIBPARAM_PARAM_ARR(myvar, charp, 4, "My C-string vector");
```

The following command line snippet sets the variables `myvar` and `myvec`:

```text
mylib.myvar="Banana" mylib.myvec=[ "I" "am" "very" "hungry!" ] --
```

Alternatively, arrays can be filled with multiple tokens or a combination of array syntax and tokens, like:

```text=
mylib.myvar="Banana" mylib.myvec="I" mylib.myvec="am" mylib.myvec=[ "very" "hungry!" ] --
```

## `app-elfloader` Updates

_This was championed by [Simon Kuenzer](https://github.com/skuenzer) with extensive support from [Andra Paraschiv](https://github.com/andraprs), [Cosmin Vancea](https://github.com/csvancea) and [Răzvan Deaconescu](https://github.com/razvand)._

This release includes updates that enhance and simplify the use of [`app-elfloader`](https://github.com/unikraft/app-elfloader). `app-elfloader` is used to run unmodified Linux ELFs with Unikraft, via the [`syscall_shim`](https://github.com/unikraft/unikraft/tree/staging/lib/syscall_shim).

The `README.md` file has been updated, with detailed instructions on configuring, building, running and debugging `app-elfloader`. A helper debugging script allows using debugging symbols in the application, in the loader and in the standard C library.

For dynamic applications, explicit loading of the Linux dynamic linker / loader was required. Recent updates don't require that, and the path to the actual dynamic ELF can be passed to the running Unikraft instance. `app-elfloader` parses the `.interp` section to locate information about the dynamic linker / loader, typically located in `/lib64/ld-linux-x86-64.so` on a typical Linux system. The dynamic linker / loader, which needs to be part of the filesystem of the running Unikraft instance, is then loaded and invoked to load dependent libraries and to do dynamic symbol resolution.

Up until now, the executable (or the explicit dynamic linker / loader) was passed as part of the initial ramdisk, using the `-initrd` of `qemu-system`. With the recent changes, the executable can be part of the filesystem of the running instance. It's filesystem path is passed as arguments when running `app-elfloader`. Running applications is simplified by using the the compation [`run-app-elfloader` repository], consisting of wrapper scripts with proper options, configurations and pre-built images.


## Application Compatibility Updates

_This was a continuous effort from [Marc Rittinghaus](https://github.com/marcrittinghaus), [Simon Kuenzer](https://github.com/skuenzer), [Răzvan Deaconescu](https://github.com/razvand), [Ioan Țeugea](https://github.com/John-Ted), [Florin Postolache](https://github.com/maniatro111), [Andra Paraschiv](https://github.com/andraprs), [Marco Schlumpp](https://github.com/mschlumpp) and [Cosmin Vancea](https://github.com/csvancea)._

Multiple applications are tested using the binary-compatibility mode, i.e. running unmodified Linux ELFs on top of Unikraft, by trapping in the [Unikraft `syscall_shim`](https://github.com/unikraft/unikraft/tree/staging/lib/syscall_shim); this is done using [`app-elfloader`](https://github.com/unikraft/app-elfloader). ELFs must be PIE (_Position-Independent Executables_). Two repositories store pre-built applications: [`dynamic-apps`](https://github.com/unikraft/dynamic-apps) and [`static-pie-apps`](https://github.com/unikraft/static-pie-apps) for dynamic and static PIE apps, respectively.

Running these applications revealed incompatibilities between the Linux ABI the Unikernel ABI required by applications, incomplete, missing or faulty system calls. These are now fixed. Applications in the [`dynamic-apps`](https://github.com/unikraft/dynamic-apps) and [`static-pie-apps`](https://github.com/unikraft/static-pie-apps) repositories are now working with Unikraft by employing [`app-elfloader`](https://github.com/unikraft/app-elfloader).

As part of the effort, the [`dynamic-apps` repository](https://github.com/unikraft/dynamic-apps) was created. And the [`static-pie-apps` repository](https://github.com/unikraft/static-pie-apps) was enriched with new applications. Focus is on dynamic PIE apps, since they are the default applications on Linux distributions; they can simply be picked up, together with dependent libraries, configuration files and support files and run with Unikraft by using [`app-elfloader`](https://github.com/unikraft/app-elfloader).

Existing applications can be quickly tested by using the companion [`run-app-elfloader` repository](https://github.com/unikraft/run-app-elfloader):

```console
$ ./run_app.sh 
Usage: ./run_app.sh [-l] <app>
Possible apps:
bc bc_static bzip2 client client_go client_go_static client_static echo gzip 
gzip_static haproxy helloworld helloworld_cpp helloworld_cpp_static 
helloworld_go helloworld_go_static helloworld_rust helloworld_rust_static_gnu 
helloworld_rust_static_musl helloworld_static ls nginx nginx_static openssl 
python redis redis7 redis_static server server_go server_go_static 
server_static sqlite3 sqlite3_static 
    -l - use dynamic loader explicitly

$ ./run_app.sh helloworld
[...]
Hello, World!
```

## Newlib Support on in the Latest Unikraft Version

_This feature was championed by [Eduard Vintilă](https://github.com/eduardvintila), with support from [Maria Sfîrăială](https://github.com/mariasfiraiala), [Răzvan Deaconescu](https://github.com/razvand) and [Teodor Țeugea](https://github.com/John-Ted)._

Since the introduction of [Musl](https://github.com/unikraft/lib-musl) as the default standard C library (_libc_) for Unikraft, since [release 0.11.0](https://github.com/unikraft/unikraft/releases/tag/RELEASE-0.11.0), [Newlib](https://github.com/unikraft/lib-newlib) support was deprioritized. With this release, Newlib support is not updated to the recent Unikraft version.

[Updates to `lib-newlib`](https://github.com/unikraft/lib-newlib/pull/28) and [to the companion threading library `lib-pthread-embedded`](https://github.com/unikraft/lib-pthread-embedded/pull/11) were related to the recent updates of Unikraft and `lib-lwip`: new scheduling API, Musl-imported functions, timing.

Most [Unikraft application repositories](https://github.com/search?q=topic%3Aunikraft-application+org%3Aunikraft&type=Repositories) are currently configured to use, by default, [Musl](). They can be configured to use [Newlib](https://github.com/unikraft/lib-newlib) instead.


## Documentation Updates

_This feature was championed by [Ștefan Jumărea](https://github.com/eduardvintila), with extensive support from [Radu Nichita](https://github.com/RaduNichita), [Maria Sfîrăială](https://github.com/mariasfiraiala), [Răzvan Deaconescu](https://github.com/razvand), [Delia Pavel](https://github.com/DeliaPavel) and [Eduard Vintilă](https://github.com/eduardvintila)._

As usual with every release, documentation has been updated.
Most documentation is filling in the blanks of existing features that require better documentation, and as support for hackathon and tutorial events.

Documentation updates take part in the [core `unikraft` repository](https://github.com/unikraft/unikraft) and in the [`docs` repository](https://github.com/unikraft/docs) - that also stores website information.

In the [core `unikraft` repository](https://github.com/unikraft/unikraft), documentation consists of `README.md` files in internal libraries, such as [`vfscore`](https://github.com/unikraft/unikraft/blob/staging/lib/vfscore/README.md). And in Doxygen-style comments in header and source code files such as [`ramfs`](https://github.com/unikraft/unikraft/blob/staging/lib/ramfs/ramfs.h), that are then planned to be exported to the website, as an official API documentation for Unikraft.

For the [`docs` repository](https://github.com/unikraft/docs), most changes consisted of updates to [hackathon sessions](https://unikraft.org/community/hackathons/sessions/) for the hackathons taking place during this time. Two important additions to documentation are related to [binary compatibility](https://unikraft.org/docs/usage/bin_compat/) and to [building and running complex applications](https://unikraft.org/docs/usage/make_build/#building-and-running-complex-applications-with-make).


## Community Activities


### Full Day Hackathon at UPB in March

We took the time to do another full day hackathon! Tha hackathon took place on 11th of March 2023. Everyone interested could join us in-person, at University POLITEHNICA of Bucharest, and online, on our [Discord server](https://bit.ly/UnikraftDiscord).

We had all kind of community members joining, from very beginners to more experienced people, adding features, reviewing, debugging or making their first steps in Unikraft. And for pizza, of course.

{{< figure
    src="/assets/imgs/hackathon-2023-03-11.jpg"
    position="center"
>}}


### Athens Hackathon

On 30th and 31st of March 2023, we organized our first hackathon in Greece, with support from [Nubificus](https://nubificus.co.uk/), [the High Speed Communication Networks Lab (HSCN)](http://hscnl.ece.ntua.gr/) and [the Computing Systems Lab (CSLab)](http://www.cslab.ece.ntua.gr/) of the National Technical University of Athens ([ICCS](https://www.iccs.gr/en/)/[NTUA](https://www.ntua.gr/en/))!

For 2 days, the participants have been introduced to the Unikraft universe and had the opportunity to become part of our community and bring their first contributions. [Michalis Pappas](https://github.com/michpappas), [Răzvan Deaconescu](https://github.com/razvand/) and [Ștefan Jumărea](https://github.com/StefanJum) provided help on site, with other veteran community members offering online suport.

You can find the hackathon sessions and challenges on the [Athens Hackathon page](https://unikraft.org/community/hackathons/2023-03-athens/).

{{< figure
    src="/assets/imgs/hackathon-athens-2023-03-30.jpg"
    position="center"
>}}


### Amsterdam Hackathon

We continued our hackathon season with the Amsterdam Unikraft Hackathon, organized on 15th and 16th of April 2023, together with [Vrije Universiteit Amsterdam (VUA)](https://vu.nl/en) and [VUSec](https://www.vusec.net/).

This time, [Răzvan Deaconescu](https://github.com/razvand/) was joined by [Hugo Lefeuvre](https://github.com/hlef/) on-site, with other community members keeping in touch online.

For full hackathon content, check [Amsterdam Hackathon page](https://unikraft.org/community/hackathons/2023-04-amsterdam/).

{{< figure
    src="/assets/imgs/hackathon-amsterdam-2023-04-15.jpg"
    position="center"
>}}


### Porto Hackathon

Show must go on! We then moved to Porto for the next Unikraft hackathon, organized in collaboration with [Faculdade de Engenharia Universidade do Porto](https://sigarra.up.pt/feup/en/web_page.Inicial) and University of Porto Faculty of Engineering ACM Student Chapter. The hackathon took part on Wednesday and Thursday, May 10-11, 2023.

[Ștefan Jumărea](https://github.com/StefanJum) and [Eduard Vintilă](https://github.com/eduardvintila) were present on-site, with other community members providing support online, on Discor.

You can find more about this on the [Porto hackathon page](https://unikraft.org/community/hackathons/2023-05-porto/).

{{< figure
    src="/assets/imgs/hackathon-porto-2023-05-10.jpg"
    position="center"
>}}


### Google Summer of Code 2023

The results of the project selection for this year edition of Google Summer of Code are here: 5 projects proposed by Unikraft have been selected!

Here is the list of students that will work together with us in the next few months, together with their projects:

- [**MD Sahil**](https://github.com/MdSahil-oss): [Enhancing the VSCode Developer Experience](https://summerofcode.withgoogle.com/programs/2023/projects/ZUeHjGnO)
- [**Rareș Miculescu**](https://github.com/rares-miculescu): [re:Arch Unikraft](https://summerofcode.withgoogle.com/programs/2023/projects/L97cI91F)
- [**Tianyi Liu**](https://github.com/i-Pear): [Expanding binary compatibility mode](https://summerofcode.withgoogle.com/programs/2023/projects/Bl7ARfep)
- [**Zeyu Li**](https://github.com/zyllee): [Packaging Pre-built Micro-libraries for Faster and More Secure Builds](https://summerofcode.withgoogle.com/programs/2023/projects/vakHok2H)
- [**Zhang Xingjian**](https://github.com/zhxj9823): [Arm CCA Support for Unikraft](https://summerofcode.withgoogle.com/programs/2023/projects/5oKH0o5n)

We are looking forward to start mentoring our students, and we can't wait for the great features we are going to develop together!
