In this session we are going to understand the basic layout of the Unikraft working directory, its environment variables, as well as what the most common Unikraft specific files mean.
We are also going to take a look at how we can build basic applications and how we can extend their functionality and support by adding ported external libraries.

Before everything, let's take a bird's eye view of what Unikraft is and what we can do with it.
Unikraft is a unikernel [SDK](https://en.wikipedia.org/wiki/Software_development_kit), meaning it offers you the blocks (source code, configuration and build system, runtime support) to build and run unikernels.
A unikernel is a single image file that can be loaded and run as a separate running instance, most often a virtual machine.

Summarily, the Unikraft components are shown in the image below:

![unikraft components](/community/hackathons/sessions/baby-steps/images/unikraft_components.png)

`Unikraft` is the core component, consisting of multiple core / internal libraries (each providing a part of the functionality commonly found in an operating system), the build system, and platform and architecture code.
It is the basis of any unikernel image.
It is located in the [main Unikraft repository](https://github.com/unikraft/unikraft).

`Libraries` are additional software components that will be linked against Unikraft for the final image.
There are multiple supported libraries.
Each unikernel image is using its specific libraries.
Libraries are also called **external** libraries as they sit outside the main Unikraft repository.
Libraries are typically common libraries (such as OpenSSL or LwIP) that have been ported on top of Unikraft.
They are located in specialized repositories in the [Unikraft organization](https://github.com/unikraft/), those whose names start with `lib-`.

`Application` is the actual application code.
It typically provides the `main()` function (or equivalent) and is reliant on Unikraft and external libraries.
Applications that have been ported on top of Unikraft are located in repositories in the [Unikraft organization](https://github.com/unikraft/), those whose names start with `app-`.

An important role of the core Unikraft component is providing support for different platforms and architectures.
A platform is the virtualization / runtime environment used to run the resulting image.
An architecture details the CPU and memory specifics that will run the resulting image.

As this is a rather complicated setup, a companion tool ([kraft](https://github.com/unikraft/kraft)) was designed and implemented to provide the interface for configuring, building and running unikernel images based on Unikraft.
The recommended way of building and running Unikraft is via `kraft`.

We can either use a lower-level configuration and build system (based on [Kconfig](https://www.kernel.org/doc/html/latest/kbuild/kconfig-language.html) and Makefile) to get a grasp of how everything works, or use the `kraft` tool for a more simplified approach in configuring and building the application. We'll exemplify building the [helloworld](https://github.com/unikraft/app-helloworld) application and the [httpreply](https://github.com/unikraft/app-httpreply) application with both of these approaches.

The lower-level system will be detailed further in session 02: Behind the Scenes.
