Let's start by understanding the basic layout of the Unikraft working directory, its environment variables, as well as what the most common Unikraft specific files mean.
We are also going to take a look at how we can build basic applications and how we can extend their functionality and support by adding ported external libraries.

Before everything, we shall take a bird's eye view of what Unikraft is and what we can do with it.
Unikraft is a unikernel [SDK](https://en.wikipedia.org/wiki/Software_development_kit), meaning it offers you the blocks (source code, configuration and build system, runtime support) to build and run unikernels (i.e. applications such as `redis`, `nginx` or `sqlite`).
A unikernel is a single image file that can be loaded and run as a separate running instance, most often a virtual machine.

Summarily, the Unikraft components are shown in the image below:

![unikraft components](/community/hackathons/sessions/baby-steps/images/unikraft_components.png)

`Unikraft` is the core component, consisting of multiple core / internal libraries (each providing a part of the functionality commonly found in an operating system), the build system, and platform and architecture code.
It is the basis of any unikernel image.
It is located in the [main Unikraft repository](https://github.com/unikraft/unikraft).

`Libraries` are additional software components that will be linked against Unikraft for the final image.
There are multiple supported libraries.
Each unikernel image is using its specific libraries.
Libraries are also called **external** libraries, as they sit outside the main Unikraft repository.
They are typically common libraries (such as OpenSSL - a crypto library, or LwIP - a TCP/IP network stack) that have been ported on top of Unikraft.
They are located in specialized repositories in the [Unikraft organization](https://github.com/unikraft/), those whose names start with `lib-`.

`Application` is the actual application code.
It typically provides the `main()` function (or equivalent) and is reliant on Unikraft and external libraries.
Applications that have been ported on top of Unikraft are located in repositories in the [Unikraft organization](https://github.com/unikraft/), those whose names start with `app-`.

An important role of the core Unikraft component is providing support for different platforms and architectures.
A platform is the virtualization / runtime environment used to run the resulting image (i.e QEMU, Firecracker, VMWare etc.).
An architecture details the CPU and memory specifics that will run the resulting image (i.e. x86, ARM).

We can  use a lower-level configuration and build system (based on [Kconfig](https://www.kernel.org/doc/html/latest/kbuild/kconfig-language.html) and [make](https://www.gnu.org/software/make/)) to get a grasp of how everything works.
The low-level system will be further detailed in the next session.
